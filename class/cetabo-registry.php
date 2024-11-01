<?php

if (!class_exists("Cetabo_SGMLRegistry")) {
    /**
     * Container used to globally store and pass values
     */
    class Cetabo_SGMLRegistry
    {

        private static $registry = array();

        public static function get($key)
        {
            return Cetabo_SGMLHelper::arr_get(self::$registry, $key, null);
        }

        public static function put($key, $value)
        {
            self::$registry[$key] = $value;
        }

    }
}