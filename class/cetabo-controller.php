<?php

if (!class_exists("Cetabo_SGMLController")) {
    /**
     * Base controller class. It provides functionality to work with views
     */
    class Cetabo_SGMLController
    {

        /**
         * The folder name where the views are located
         */
        const VIEW_LOCATION = "view";

        /**
         * Get view content and render it
         * @param string $view the name of the view
         * @param array $params parameters to be sent on view
         */
        public static function render($view, $params = array())
        {
            //Prepare view context (variables)
            foreach ($params as $key => $val) {
                $$key = $val;
            }
            // Include view fragment
            include(Cetabo_SGMLRegistry::get('PLUGIN_DIR') . self::VIEW_LOCATION . "/{$view}.php");
        }

        /**
         * Get fragment content and render it
         * @param string $fragment the name of the view
         * @param array $params parameters to be sent on view
         */
        public static function fragment($fragment, $params = array())
        {
            //Prepare view context (variables)
            foreach ($params as $key => $val) {
                $$key = $val;
            }
            // Include view fragment
            include(Cetabo_SGMLRegistry::get('PLUGIN_DIR') . self::VIEW_LOCATION . "/fragment/{$fragment}.php");
        }

        /**
         * Get view content without actually render it.
         * @param string $view the name of the view
         * @param array $params parameters to be sent on view
         * @return string
         */
        protected function capture($view, $params = array())
        {
            ob_start();
            $this->render($view, $params);
            $contents = ob_get_contents();
            ob_end_clean();
            return $contents;
        }
    }
}