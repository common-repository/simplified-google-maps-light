<?php

if (!class_exists("Cetabo_SGMLHelper")) {
    /**
     * Comodity class
     */
    class Cetabo_SGMLHelper
    {

        /**
         * Get array value if key exist if not the default value will be returned
         * @param array $array
         * @param string $key
         * @param ? $default
         * @return ?
         */
        public static function arr_get($array, $key, $default = '')
        {
            return (array_key_exists($key, $array) ? $array[$key] : $default);
        }

        /**
         * Get specified action URL
         * @param string $action action name
         * @return string (URL)
         */
        public static function action_url($action)
        {
            $path = menu_page_url(Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), false);
            return add_query_arg(array('action' => $action), $path);
        }

        /**
         * Get AJAX request URL
         * @param string $action action name
         * @return string (URL)
         */
        public static function ajax_action_url($action)
        {
            $path = admin_url('admin-ajax.php');
            return add_query_arg(array('action' => $action), $path);
        }

        /**
         * Get admin URL to a certain path
         * @param $path
         * @return string|void
         */
        public static function plugin_url($path)
        {
            return Cetabo_SGMLRegistry::get('PLUGIN_URL') . $path;
        }

        /**
         * Get config by name
         * @param $name
         * @return array
         */
        public static function config($name)
        {
            return include(Cetabo_SGMLRegistry::get('PLUGIN_DIR') . "/config/{$name}.php");
        }
    }
}