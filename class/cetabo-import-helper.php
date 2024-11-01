<?php

if (!class_exists("Cetabo_SGMLImport_Helper")) {
    /**
     * Class Cetabo_SGMLExport_Helper
     * Perform map import related tasks
     */
    class Cetabo_SGMLImport_Helper
    {

        /**
         * Global access point instance
         * @var Cetabo_SGMLImport_Helper
         */
        private static $instance;

        /**
         * Provide global access point
         * @return Cetabo_SGMLImport_Helper
         */
        public static function instance()
        {
            if (self::$instance == null) {
                self::$instance = new Cetabo_SGMLImport_Helper();
            }
            return self::$instance;
        }


        /**
         * Check if import is progressing
         * @return bool
         */
        public function has_started()
        {
            return !empty($_FILES);
        }


        /**
         * Perform import
         * @return array
         */
        public function import()
        {
            $report_entries = array();
            $valid = true;

            $types = array(
                'application/zip',
                'application/x-zip',
                'application/x-zip-compressed',
                'application/octet-stream',
                'application/x-compress',
                'application/x-compressed',
                'multipart/x-zip');

            if (!in_array($_FILES["file"]["type"], $types) || 0 === $_FILES["file"]["size"]) {
                $report_entries[] = "Invalid file expected a valid .zip file";
                $valid = false;
            }

            if ($valid) {
                $file = $_FILES["file"]["tmp_name"];
                $name = $_FILES["file"]["name"];
                $sheets = $this->extract_zip($file);

                if ($this->create_map_from_sheets($sheets, $name)) {
                    $report_entries[] = "Map was successfully imported";
                } else {
                    $report_entries[] = "Invalid content";
                    $valid = false;
                }
            }

            return array('entries' => $report_entries, 'success' => $valid);

        }

        /**
         * Create map
         * @param $sheets
         * @return bool
         */
        function create_map_from_sheets($sheets, $name)
        {
            if (!$sheets || !$this->valid_content($sheets)) {
                return false;
            }

            $map_object = $this->create_map_object($sheets);
            $map_object['name'] = $map_object['name'];

            try {
                Cetabo_SGMLDataProvider::instance()->persist_map($map_object);
            } catch (Exception $ex) {
                return false;
            }
            return true;
        }

        /**
         * Check if valid content
         * @param $sheets
         * @return bool
         */
        function valid_content($sheets)
        {
            foreach ($sheets as $sheet) {
                if (!empty ($sheet)) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Restore map model form sheets
         * @param $sheets
         * @return array
         */
        function create_map_object($sheets)
        {

            $map_object = (array)json_decode($sheets['settings.json']);

            $map_object['places'] = $this->normalize((array)json_decode($sheets['places.json']));
            $map_object['places'] = $this->remove_external_dependencies($map_object['places']);

            $map_object['stylers'] = $this->normalize((array)json_decode($sheets['stylers.json']));

            return $map_object;
        }

        function remove_external_dependencies($places)
        {
            $normalized_places = array();
            foreach ($places as $place) {
                $place['icon'] = '';
                $normalized_places[] = $place;
            }
            return $normalized_places;
        }

        /**
         * Convert [{},{}] to [[],[]]
         * @param $array
         * @return array
         */
        function normalize($array)
        {
            $result = array();
            foreach ($array as $key => $val) {
                $result[$key] = (array)$val;
            }

            return $result;

        }

        /**
         * Extracts sheets
         * @param $file
         * @return array|bool
         */
        function extract_zip($file)
        {
            $sheets = array(
                'settings.json' => '',
                'places.json' => '',
                'stylers.json' => '',
            );

            $zip = new ZipArchive();

            if ($zip->open($file) !== TRUE) {
                return false;
            }

            foreach ($sheets as $sheet_name => $sheet_content) {
                $sheets[$sheet_name] = $zip->getFromName($sheet_name);
            }
            $zip->close();
            return $sheets;
        }

    }
}