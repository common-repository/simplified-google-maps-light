<?php

if (!class_exists("Cetabo_SGMLDataProvider")) {
    /**
     * It isolates the access to DB,map DAO models
     */
    class Cetabo_SGMLDataProvider
    {

        /**
         * Global access point instance
         * @var Cetabo_SGMLDataProvider
         */
        private static $instance;

        /**
         * Provide global access point
         * @return Cetabo_SGMLDataProvider
         */
        public static function instance()
        {
            if (self::$instance == null) {
                self::$instance = new Cetabo_SGMLDataProvider();
            }
            return self::$instance;
        }

        /**
         * Setup Database structure
         * @global type $wpdb
         */
        public function install_database()
        {
            global $wpdb;
            //require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

            $map_sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}maps (
		    id INT NOT NULL AUTO_INCREMENT,
		    name VARCHAR(200) NULL,
		    configuration LONGTEXT NULL, PRIMARY KEY (id)
		    ) ENGINE = InnoDB; ";
            //dbDelta($map_sql);

            $wpdb->query($map_sql);
        }

        /**
         * Update database to 2.0.0 version
         */
        public function migrate_database()
        {
            global $wpdb;
            //require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

            $installed_version = get_option("cetabo-map_schema_version");
            $required_version = '2.0.0';

            if ($installed_version != $required_version) {

                $wpdb->query("ALTER TABLE {$wpdb->prefix}maps ADD COLUMN version INT NOT NULL DEFAULT 1;");

                $wpdb->query("CREATE TABLE IF NOT EXISTS {$wpdb->prefix}places (
                        id INT NOT NULL AUTO_INCREMENT,
                        map_id INT NOT NULL,
                        name VARCHAR(200) NULL,
                        configuration LONGTEXT NULL, PRIMARY KEY (id)
                ) ENGINE = InnoDB; ");

                $wpdb->query("CREATE TABLE IF NOT EXISTS {$wpdb->prefix}preferences (
                    id INT NOT NULL AUTO_INCREMENT,
                    pref_key VARCHAR(200) NOT NULL,
                    pref_value LONGTEXT,PRIMARY KEY (id)
                    ) ENGINE = InnoDB; ");


                update_option("cetabo-map_schema_version", $required_version);
            }

        }

        /**
         * Read system preferences
         * @param $key
         * @return mixed
         */
        public function read_preference($key, $default = null)
        {
            global $wpdb;
            $sql = "SELECT * FROM {$wpdb->prefix}preferences where pref_key='{$key}'";
            $rows = $wpdb->get_results($sql);
            $result = (count($rows) > 0) ? $rows[0] : null;
            return ($result != null) ? $result->pref_value : $default;
        }

        /**
         * Write system preferences
         * @param $key
         * @param $val
         */
        public function write_preference($key, $val)
        {
            $oldVal = $this->read_preference($key);
            global $wpdb;
            if ($oldVal == null) {
                $sql = "INSERT INTO {$wpdb->prefix}preferences (`pref_key`, `pref_value`) VALUES ('{$key}','{$val}')";
                $this->execute($sql);
            } else {
                $sql = "UPDATE {$wpdb->prefix}preferences SET pref_value='{$val}' WHERE pref_key='{$key}'";
                $this->execute($sql);
            }
        }

        /**
         * Delte specified map
         * @global wpdb $wpdb
         * @param type $id
         * @return boolean
         */
        public function delete_map($id)
        {
            if (!is_numeric($id)) {
                return false;
            }
            global $wpdb;
            $sql_map = "DELETE FROM {$wpdb->prefix}maps where id={$id}";
            $sql_places = "DELETE FROM {$wpdb->prefix}places where map_id={$id}";
            return $this->execute($sql_map) && $this->execute($sql_places);
        }

        /**
         * Create or update map
         * @global wpdb $wpdb
         * @param type $map_object
         * @return type
         */
        public function persist_map($map_object)
        {
            $id = Cetabo_SGMLHelper::arr_get($map_object, 'id');
            $create_new = (!is_numeric($id));
            $name = Cetabo_SGMLHelper::arr_get($map_object, 'name');

            $places = $map_object['places'];
            unset($map_object['places']);

            $serialized_object = base64_encode(serialize($map_object));
            global $wpdb;
            if ($create_new) {
                $sql = "INSERT INTO {$wpdb->prefix}maps (`name`, `configuration`) VALUES ('{$name}','{$serialized_object}')";
                $this->execute($sql);
                $id = $wpdb->insert_id;
            } else {
                $sql = "UPDATE {$wpdb->prefix}maps SET configuration='{$serialized_object}', name='{$name}' WHERE id='{$id}'";
                $this->execute($sql);
            }
            $this->persist_places($places, $id);
            return true;
        }


        /**
         * Clone map
         * @param $map_object
         * @return type
         */
        public function clone_map($map_object)
        {
            $id = Cetabo_SGMLHelper::arr_get($map_object, 'id');
            if (is_numeric($id)) {
                unset($map_object['id']);
            }

            $map_object['name'] = $map_object['name'] . " - clone";

            $places = Cetabo_SGMLHelper::arr_get($map_object, 'places');
            $place_clone = array();
            foreach ($places as $place) {
                unset ($place['id']);
                $place_clone[] = $place;
            }
            $map_object['places'] = $place_clone;

            return $this->persist_map($map_object);
        }


        /**
         * Create or update map places
         * @global wpdb $wpdb
         * @param type $map_object
         * @return type
         */
        public function persist_places($places, $map_id)
        {
            // Get all persisted places ids
            $place_ids = $this->load_map_place_ids($map_id);
            foreach ($places as $place) {

                $id = Cetabo_SGMLHelper::arr_get($place, 'id');
                $create_new = (!is_numeric($id));
                $name = Cetabo_SGMLHelper::arr_get($place, 'name');

                $serialized_object = base64_encode(serialize($place));
                global $wpdb;

                if ($create_new) {
                    $sql = "INSERT INTO {$wpdb->prefix}places (`name`,`map_id`, `configuration`) VALUES ('{$name}','{$map_id}','{$serialized_object}')";
                } else {
                    $sql = "UPDATE {$wpdb->prefix}places SET configuration='{$serialized_object}', name='{$name}', map_id='{$map_id}' WHERE id='{$id}'";
                    $place_ids = array_diff($place_ids, array($id));
                }

                $this->execute($sql);
            }

            if (count($place_ids) > 0) {
                //Clean removed places
                $this->execute("DELETE FROM {$wpdb->prefix}places where `id` IN (" . implode(',', $place_ids) . ")");
            }

        }

        /**
         * Load may by id
         * @global wpdb $wpdb
         * @param int $id
         * @return null
         */
        public function load_map($id)
        {
            if (!is_numeric($id)) {
                return null;
            }
            global $wpdb;
            $sql = "SELECT * FROM {$wpdb->prefix}maps where id={$id}";
            $rows = $wpdb->get_results($sql);
            $result = (count($rows) > 0) ? $rows[0] : null;
            if ($result != null) {
                $result->configuration = unserialize(base64_decode($result->configuration));
                //We don't handle legacy maps
                if (!Cetabo_SGMLHelper::arr_get($result->configuration, 'places')) {
                    $result->configuration['places'] = $this->load_map_places($id);
                }
            }

            return $result;
        }

        /**
         * Load map name by id
         * @global wpdb $wpdb
         * @param int $id
         * @return null
         */
        public function load_map_name($id)
        {
            if (!is_numeric($id)) {
                return null;
            }
            global $wpdb;
            $sql = "SELECT * FROM {$wpdb->prefix}maps where id={$id}";
            $rows = $wpdb->get_results($sql);
            $result = (count($rows) > 0) ? $rows[0] : null;

            return (is_object($result)) ? $result->name : "";
        }


        /**
         * Load map places
         * @param $id
         * @return null
         */
        public function load_map_places($id)
        {
            if (!is_numeric($id)) {
                return null;
            }
            global $wpdb;
            $sql = "SELECT * FROM {$wpdb->prefix}places where map_id={$id}";
            $rows = $wpdb->get_results($sql);

            $places = array();
            foreach ($rows as $row) {
                $place = unserialize(base64_decode($row->configuration));
                $place['_id'] = $row->id;
                $place['map_id'] = $row->map_id;
                $places[] = $place;
            }

            return $places;
        }

        /**
         * Load map places ids
         * @param $id
         * @return null
         */
        public function load_map_place_ids($id)
        {
            if (!is_numeric($id)) {
                return null;
            }
            global $wpdb;
            $sql = "SELECT id FROM {$wpdb->prefix}places where map_id={$id}";
            $rows = $wpdb->get_results($sql);

            $places = array();
            foreach ($rows as $row) {
                $places[] = $row->id;
            }

            return $places;
        }


        /**
         * Get map place tags
         * @param $id
         * @return array
         */
        public function load_map_places_tags($id)
        {
            $places = $this->load_map_places($id);
            $tags = array();


            foreach ($places as $place) {
                $placeTags = explode(',', $place['tags']);
                if (empty($placeTags) || empty ($place['tags'])) {
                    continue;
                }
                foreach ($placeTags as $tag) {
                    if (in_array($tag, $tags)) {
                        continue;
                    }
                    $tags[] = $tag;
                }
            }
            return $tags;

        }

        /**
         * Count all existing maps
         * @global type $wpdb
         * @return type
         */
        public function count_all_maps()
        {
            global $wpdb;
            $result = $wpdb->get_results("SELECT count(*) as count FROM {$wpdb->prefix}maps");
            return $result[0]->count;
        }

        /**
         * Check if there is a map with specified id
         * @global wpdb $wpdb
         * @param int $id
         * @return boolean
         */
        public function is_valid_map($id)
        {
            global $wpdb;
            $result = $wpdb->get_results("SELECT count(*) as count FROM {$wpdb->prefix}maps where id={$id}");
            return $result[0]->count == 1;
        }

        /**
         * Get paginated list of maps
         * @global wpdb $wpdb
         * @param int $perpage elements to be displayed per page
         * @param int $page current page
         * @param array $ordering order by configuration
         * @return type
         */
        public function get_list($perpage, $page, $ordering)
        {
            global $wpdb;
            //Number of elements in your table?
            $totalitems = $this->count_all_maps();
            $index = $perpage * ($page - 1);

            if (Cetabo_SGMLHelper::arr_get($ordering, 'column', null) != null) {
                $sql = "SELECT * FROM {$wpdb->prefix}maps ORDER BY {$ordering['column']} {$ordering['direction']} LIMIT {$index},{$perpage}";
            } else {
                $sql = "SELECT * FROM {$wpdb->prefix}maps LIMIT {$index},{$perpage}";
            }

            return array(
                'items' => $wpdb->get_results($sql),
                'pagination' => array(
                    'total_items' => $totalitems,
                    'per_page' => $perpage,
                    'total_pages' => ceil($totalitems / $perpage))
            );
        }

        /**
         * Execute specified query
         * @global wpdb $wpdb
         * @param string $sql
         * @return boolean
         */
        private function execute($sql)
        {
            global $wpdb;
            return $wpdb->query($sql);
        }

    }
}