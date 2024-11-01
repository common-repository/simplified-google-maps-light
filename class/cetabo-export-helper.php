<?php

if (!class_exists("Cetabo_SGMLExport_Helper")) {
    /**
     * Class Cetabo_SGMLExport_Helper
     * Perform map export related tasks
     */
    class Cetabo_SGMLExport_Helper
    {

        /**
         * CSV configuration export
         * @var array
         */
        private $settings = array(
            'delimiter' => ',',
            'enclosure' => '"',
            'encoding' => 'UTF-8',
        );

        /**
         * Global access point instance
         * @var Cetabo_SGMLExport_Helper
         */
        private static $instance;

        /**
         * Provide global access point
         * @return Cetabo_SGMLExport_Helper
         */
        public static function instance()
        {
            if (self::$instance == null) {
                self::$instance = new Cetabo_SGMLExport_Helper();
            }
            return self::$instance;
        }

        /**
         * Export map by id
         * @param $id
         * @return array
         */
        public function export($id)
        {
            $map = Cetabo_SGMLDataProvider::instance()->load_map($id);
            if (!$map) {
                return array('success' => false);
            }

            $sheets = array(
                'settings.json' => $this->export_settings_sheet($map),
                'places.json' => $this->export_places_sheet($map),
                'stylers.json' => $this->export_stylers_sheet($map),
            );

            $zip = $this->zip($map->name, $sheets);
            $url = Cetabo_SGMLHelper::plugin_url("/export/{$zip}");

            return array(
                'success' => $zip !== false,
                'name' => $map->name,
                'url' => $url
            );

        }

        private function zip($map_name, $sheets)
        {
            $replace = "_";
            $pattern = "/([[:alnum:]_\.-]*)/";
            $map_name = str_replace(str_split(preg_replace($pattern, $replace, $map_name)), $replace, $map_name);
            $zip_name = $map_name;
            $zip_file = plugin_dir_path(__FILE__) . "/../export/{$zip_name}.zip";

            $zip = new ZipArchive();
            if ($zip->open($zip_file, ZIPARCHIVE::OVERWRITE) !== true) {
                return false;
            }
            foreach ($sheets as $sheet_name => $sheet_content) {
                $zip->addFromString($sheet_name, $sheet_content);
            }

            $zip->close();

            return $zip_name . '.zip';
        }


        /**
         * Export settings sheet
         * @param $map
         * @return string
         */
        private function export_settings_sheet($map)
        {
            $result = array();
            $ignore = array('stylers', 'places', 'id');

            foreach ($map->configuration as $key => $val) {
                if (in_array($key, $ignore)) {
                    continue;
                }
                $result[$key] = $val;
            }

            return json_encode($result);

        }

        /**
         * Export places sheet
         * @param $map
         * @return string
         */
        private function export_places_sheet($map)
        {
            $places = $map->configuration['places'];
            $ignore = array('id', 'map_id', '_id');
            $result = array();

            //Get header
            $header = array();
            foreach ($places as $place) {
                $place_data = array();
                foreach ($place as $key => $val) {
                    if (in_array($key, $header) || in_array($key, $ignore)) {
                        continue;
                    }
                    $place_data[$key] = $place[$key];
                }
                $result[] = $place_data;
            }
            return json_encode($result);
        }

        /**
         * Export stylers sheet
         * @param $map
         * @return string
         */
        private function export_stylers_sheet($map)
        {
            $stylers = $map->configuration['stylers'];
            return json_encode($stylers);

        }

    }
}