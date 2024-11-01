<?php
/*
  Plugin Name: Simplified Google Maps light
  Plugin URI: http://cmap.cetabo.com
  Description: A plugin to create awesome google maps
  Version: 2.0.0
  Author: cetabo
  Author Email: contact@cetabo.com
  License: GPL v2 or later

 */


require_once(plugin_dir_path(__FILE__) . 'class/cetabo-googlemaps-plugin.php');

Cetabo_SGMLRegistry::put('PLUGIN_URL', plugin_dir_url(__FILE__));
Cetabo_SGMLRegistry::put('PLUGIN_DIR', plugin_dir_path(__FILE__));
Cetabo_SGMLRegistry::put('PLUGIN_SLUG', 'cetabo_googlemaps_light');

Cetabo_SGMLRegistry::put('PLUGIN_NAME', 'Simplified Google Maps light');
Cetabo_SGMLRegistry::put('PLUGIN_SHORT_NAME', 'Powered by SGM');
Cetabo_SGMLRegistry::put('PLUGIN_PAGE', 'http://cmap.cetabo.com');
Cetabo_SGMLRegistry::put('PLUGIN_AUTHOR_NAME', 'cetabo');
Cetabo_SGMLRegistry::put('PLUGIN_AUTHOR_URL', 'http://cetabo.com');
Cetabo_SGMLRegistry::put('PLUGIN_SUBSCRIPTION_URL', 'http://cmap.cetabo.com/subscribe/');


Cetabo_SGMLRegistry::put('__FILE__', __FILE__);

Cetabo_SGMLRegistry::put('PLUGIN_DEBUG_MODE', false);
Cetabo_SGMLRegistry::put('PLUGIN_VERSION', '2.0.0');

//Instantiate plugin
new Cetabo_SGMLGoogleMapsPlugin();
