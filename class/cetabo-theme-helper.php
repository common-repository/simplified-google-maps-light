<?php

if (!class_exists("Cetabo_SGMLTheme_Helper")) {
    /**
     * Comodity class
     */
    class Cetabo_SGMLTheme_Helper
    {

        /**
         * Global access point instance
         * @var Cetabo_SGMLTheme_Helper
         */
        private static $instance;

        /**
         * Provide global access point
         * @return Cetabo_SGMLTheme_Helper
         */
        public static function instance()
        {
            if (self::$instance == null) {
                self::$instance = new Cetabo_SGMLTheme_Helper();
            }
            return self::$instance;
        }

        /**
         * Get list of available themes
         */
        public function get_available_themes()
        {
            $themes = array();
            $index = 0;
            if ($handle = opendir(plugin_dir_path(__FILE__) . '/../media/themes/')) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        $themes[] = array(
                            'id' => $index++,
                            'text' => str_replace('.json', '', $entry),
                            'description' => str_replace('.json', '', $entry),
                            'url' => Cetabo_SGMLHelper::plugin_url('media/themes/' . $entry),
                        );
                    }
                }
                closedir($handle);
            }

            return $themes;

        }

        /**
         * Save theme
         * @param $file
         * @param $theme_content
         * @return bool
         */
        public function persist_theme($file, $theme_content)
        {
            $success = file_put_contents($file, json_encode($theme_content)) !== false;
            if (!$success) {
                unlink($file);
            }
            return $success;
        }

    }
}