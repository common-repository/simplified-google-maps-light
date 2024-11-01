<?php

require_once(plugin_dir_path(__FILE__) . 'cetabo-map-list-table.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-helper.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-theme-helper.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-export-helper.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-import-helper.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-dataprovider.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-registry.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-resource-loader.php');
require_once(plugin_dir_path(__FILE__) . 'cetabo-controller.php');

if (!class_exists("Cetabo_SGMLGoogleMapsPlugin")) {
    class Cetabo_SGMLGoogleMapsPlugin extends Cetabo_SGMLController
    {
        /* --------------------------------------------*
         * Constants
         * -------------------------------------------- */

        /**
         * Constructor
         */
        function __construct()
        {


            //Verify if correct version
            global $wp_version;
            if (!version_compare($wp_version, '3.5', '>=')) {
                return;
            }

            //register an activation hook for the plugin
            register_activation_hook(Cetabo_SGMLRegistry::get('__FILE__'), array(&$this, 'install_cetabo_googlemaps'));
            add_action('plugins_loaded', array(&$this, 'migrate_cetabo_googlemaps'));

            //Hook up to the init action
            add_action('init', array(&$this, 'init_cetabo_googlemaps'));

        }

        /**
         * Runs when the plugin is activated
         */
        function install_cetabo_googlemaps()
        {
            Cetabo_SGMLDataProvider::instance()->install_database();
        }

        function migrate_cetabo_googlemaps()
        {
            Cetabo_SGMLDataProvider::instance()->migrate_database();
        }

        /**
         * Runs when the plugin is initialized
         */
        function init_cetabo_googlemaps()
        {
            // Setup localization
            load_plugin_textdomain(Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), false, dirname(plugin_basename(Cetabo_SGMLRegistry::get('__FILE__'))) . '/lang');
            // Load JavaScript and stylesheets
            $this->register_scripts_and_styles();

            // Register the shortcode [cetabo_map]
            add_shortcode('cetabo_map', array(&$this, 'render_shortcode'));

            if (is_admin()) {
                //this will run when in the WordPress admin
                add_action('admin_menu', array(&$this, 'prepare_admin_menu'));
                add_action('wp_ajax_persist', array(&$this, 'persist_map'));
                add_action('wp_ajax_clone', array(&$this, 'clone_map'));
                add_action('wp_ajax_delete', array(&$this, 'delete_map'));
                add_action('wp_ajax_themes', array(&$this, 'get_themes'));
                add_action('wp_ajax_persist_theme', array(&$this, 'persist_theme'));
            } else {

            }

            add_action('wp_ajax_load', array(&$this, 'load_map'));
            add_action('wp_ajax_nopriv_load', array(&$this, 'load_map'));
        }

        /**
         * Execute when shortcode is rendered
         */
        function render_shortcode($atts)
        {
            // Extract the attributes
            extract(shortcode_atts(array('id' => ''), $atts));

            if (!Cetabo_SGMLDataProvider::instance()->is_valid_map($id)) {
                return (is_user_logged_in()) ? $this->capture('nomap') : '';
            }

            $base_url = Cetabo_SGMLRegistry::get('PLUGIN_URL');
            $encoded_load_url = base64_encode(Cetabo_SGMLHelper::ajax_action_url('load'));
            Cetabo_SGMLResourceLoader::instance()->load_js("view/widget_js.php?id={$id}&url={$encoded_load_url}&base_url={$base_url}");
            return $this->capture('widget', array(
                    'id' => $id,
                    'readonly' => true,
                )
            );
        }

        /**
         * Prepare admin menu
         */
        function prepare_admin_menu()
        {
            //Prepare main menu
            $icon = Cetabo_SGMLResourceLoader::instance()->load_img('media/images/menu_inactive.png');
            $title = "Maps";
            $capability = 'manage_options';
            
            /*$$$IS_LIGHT_REGION_START$$$*/
            $menu_position = '33';
            /*$$$IS_LIGHT_REGION_END$$$*/
            add_menu_page(Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), $title, $capability, Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), array(&$this, 'action_distpatcher'), $icon, $menu_position);
            add_submenu_page(Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), $title, 'All Maps', $capability, Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), array(&$this, 'action_distpatcher'));
            add_submenu_page(Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), $title, 'Add New', $capability, Cetabo_SGMLRegistry::get('PLUGIN_SLUG') . '&action=edit', array(&$this, 'add_new_map'));
            
        }

        /**
         * Create new map
         */
        function add_new_map()
        {
            $this->edit_map(null, false);
        }

        /**
         * Handle action
         */
        function action_distpatcher()
        {
            $action = (array_key_exists('action', $_REQUEST)) ? $_REQUEST['action'] : '';
            $id = (array_key_exists('id', $_REQUEST)) ? $_REQUEST['id'] : '';

            switch ($action) {
                case 'edit':
                    $this->edit_map($id, false);
                    break;
                case 'preview':
                    $this->edit_map($id, true);
                    break;
                
                default :
                    $this->list_maps();
                    break;
            }
        }

        /**
         * Handle global settings
         */
        function configure_settings()
        {

            $language = Cetabo_SGMLHelper::arr_get($_REQUEST, 'language', null);

            if ($language != null) {
                Cetabo_SGMLDataProvider::instance()->write_preference("language", $language);
            }

            $this->render('settings', array(
                'action' => Cetabo_SGMLHelper::action_url('settings'),
                'language' => Cetabo_SGMLDataProvider::instance()->read_preference("language", "en"),
                'languages' => Cetabo_SGMLHelper::config("languages")
            ));
        }


        /**
         * Handle map export
         * @param $id
         */
        function export_map($id)
        {
            

        }

        /**
         * Handle map import
         */
        function import_map()
        {
            
        }

        /**
         * Save map
         */
        function persist_map()
        {
            $success = Cetabo_SGMLDataProvider::instance()->persist_map($_POST);
            echo json_encode(array('success' => $success));
            die();
        }


        /**
         * Handle map clone
         */
        function clone_map()
        {
            
        }


        /**
         * Get all themes
         */
        function get_themes()
        {
            $themes = Cetabo_SGMLTheme_Helper::instance()->get_available_themes();
            echo json_encode(array('themes' => $themes));
            die();
        }


        /**
         * Save theme ajax
         */
        function persist_theme()
        {
            
        }


        /**
         * Map AJAX load
         */
        function load_map()
        {
            $id = Cetabo_SGMLHelper::arr_get($_REQUEST, 'id');
            $data = array(
                'return' => menu_page_url(Cetabo_SGMLRegistry::get('PLUGIN_SLUG'), false),
                'map' => Cetabo_SGMLDataProvider::instance()->load_map($id),
            );
            echo json_encode($data);
            die();
        }

        /**
         * Delete map
         */
        function delete_map()
        {
            $id = Cetabo_SGMLHelper::arr_get($_REQUEST, 'id');
            $success = Cetabo_SGMLDataProvider::instance()->delete_map($id);
            echo json_encode(array('success' => $success));
            die();
        }

        /**
         * Edit map
         */
        function edit_map($id, $readonly)
        {
            $map_name = Cetabo_SGMLDataProvider::instance()->load_map_name($id);


            $this->render((!$readonly) ? 'edit' : 'view', array(
                'id' => $id,
                'map_name' => $map_name,
                'readonly' => $readonly,
                'url' => array(
                    'save' => Cetabo_SGMLHelper::ajax_action_url('persist'),
                    'themes' => Cetabo_SGMLHelper::ajax_action_url('themes'),
                    'persist_theme' => Cetabo_SGMLHelper::ajax_action_url('persist_theme'),
                    'clone' => Cetabo_SGMLHelper::ajax_action_url('clone'),
                    'load' => Cetabo_SGMLHelper::ajax_action_url('load'),
                    'back' => Cetabo_SGMLHelper::action_url(''),
                    'edit' => Cetabo_SGMLHelper::action_url("edit") . "&id={$id}",
                    'export' => Cetabo_SGMLHelper::action_url('export&id=' . $id)
                )));
        }

        /**
         * Display map list
         */
        function list_maps()
        {
            $edit_url = Cetabo_SGMLHelper::action_url('edit');
            //Create an instance of our package class...
            $map_list_table = new Cetabo_SGMLMap_List_Table();
            //Fetch, prepare, sort, and filter our data...
            $map_list_table->prepare_items();
            $this->render('list', array(
                'map_list_table' => $map_list_table
            ));
        }

        /**
         * Register scripts common to admin adn frontend
         */
        private function register_core_scripts_and_styles()
        {
            $language = Cetabo_SGMLDataProvider::instance()->read_preference('language');
            Cetabo_SGMLResourceLoader::instance()->load_js('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&language=' . $language, false);
            $lib_bundle = Cetabo_SGMLHelper::config('core-lib');
            Cetabo_SGMLResourceLoader::instance()->load_js_bundle($lib_bundle);


            //If debug mode use full scripts
            if (Cetabo_SGMLRegistry::get('PLUGIN_DEBUG_MODE')) {
                $core_bundle = Cetabo_SGMLHelper::config('core');
            } else {
                $core_bundle = array('media/scripts/core.app.min.js');
            }
            Cetabo_SGMLResourceLoader::instance()->load_js_bundle($core_bundle);
        }

        private function is_plugin_admin_page()
        {
            return Cetabo_SGMLRegistry::get('PLUGIN_SLUG') == Cetabo_SGMLHelper::arr_get($_GET, 'page');
        }

        /**
         * Register admin scripts
         */
        private function register_admin_scripts_and_styles()
        {

            if (!$this->is_plugin_admin_page()) {
                return;
            }

            wp_enqueue_media();

            $lib_bundle = Cetabo_SGMLHelper::config('admin-lib');
            Cetabo_SGMLResourceLoader::instance()->load_js_bundle($lib_bundle);

            //If debug mode use full scripts
            if (Cetabo_SGMLRegistry::get('PLUGIN_DEBUG_MODE')) {
                $core_bundle = Cetabo_SGMLHelper::config('admin');
            } else {
                $core_bundle = array('media/scripts/admin.app.min.js');
            }
            Cetabo_SGMLResourceLoader::instance()->load_js_bundle($core_bundle);


            $css_bundle = Cetabo_SGMLHelper::config('admin-css');
            Cetabo_SGMLResourceLoader::instance()->load_css_bundle($css_bundle);
        }

        /**
         * Register frontend scripts
         */
        private function register_frontend_scripts_and_styles()
        {
            $css_bundle = Cetabo_SGMLHelper::config('core-css');
            Cetabo_SGMLResourceLoader::instance()->load_css_bundle($css_bundle);
        }

        /**
         * Registers and enqueues stylesheets for the administration panel and the
         * public facing site.
         */
        private function register_scripts_and_styles()
        {
            if (is_admin()) {
                if (!$this->is_plugin_admin_page()) {
                    return;
                }
                $this->register_core_scripts_and_styles();
                $this->register_admin_scripts_and_styles();

            } else {
                $this->register_core_scripts_and_styles();
                $this->register_frontend_scripts_and_styles();

            }
        }

    }
}
