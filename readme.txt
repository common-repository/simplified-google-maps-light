=== Simplified Google Maps Light ===
Contributors: cetabo
Donate link: http://cmap.cetabo.com
Tags: google maps, map, location, maps, simple to use
Requires at least: 3.5
Tested up to: 4.0
Stable tag: 2.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Simplified Google Maps is a very unique plugin, it will allow you to easily create, administrate and customize maps at the WordPress site. 

== Description ==

Simplified Google Maps is a very unique plugin, it will allow you to easily create, administrate and customize maps at the WordPress site. Most Google Maps WordPress plugins require that you should master some advanced web development skills. But not anymore! I have created a plugin that handles all the hard work for you, so that you can focus on the end result.

The Simplified Google Maps plugin allow user easily to:

* Live administrate all your maps – this means that all actions user takes are instantly visible, no more "click to preview".
* Globally administrate maps – all maps can be defined and maintained in one place, but used everywhere.
* Add as many places as you want – each can have individual customization.
* Move places on map by drag and drop or by directly specifying the coordinates.
* Configure the map settings ( map center, map zoom, map size and map type)
* Add place detail rich content.
* Responsive support - now you can specify the size of the map in % 
* And yes ... No coding skills required! It's just works!

== Installation ==

Simplified Google Maps installation doesn't differ from any other plugin installation process, so you might be familiar with this process already. If not, please follow instructions below.

Upload Methods

FTP Upload:
* First, you need a tool for uploading theme files to your site, you can use filemanager from cPanel or any ftp client.
* Extract theme zipped file
upload extracted folder to /wp-content/plugins/ directory on your site, so after upload you must have something like /wp-content/plugins /cetabo-googlemaps-light/
* Go to Plugins -> Installed plugins
* Click "Activate Plugin" button

By Wordpress:
* Login to your website
* Go to Plugins -> Add New section
* Click Upload link
* Browse to the plugin's zip file (it is located in the folder you've downloaded) and choose that file.
* Click "Install Now" button
* Wait while plugin is uploaded to your server
* Click "Activate Plugin" button

That's it! Now you should see the Maps new menu entry

== Frequently asked questions ==

= What WordPress version does Simplified Google Maps supports ? =
Currently we are supporting 3.5, it may work on older versions too but not guaranteed.

= How do I install the plugin = 
For installation instruction see the installation section

= I'm getting some XML fetch/parse errors =
Google Maps API is probably down. Don't worry this this happens rarely and lasts a short period of time.

= Can I place multiple places on the same map ? =
Yes ! of course

= I have a problem how do I debug the problem ? =
To enable the debug mode modify the Cetabo_Registry::put('PLUGIN_DEBUG_MODE', false); to Cetabo_Registry::put('PLUGIN_DEBUG_MODE', true);

== Screenshots ==

1. Features
2. Screens


== Changelog ==

= 2.0 =
* Major release
= 1.3 =
* Added responsive support
* Bug fixing
= 1.2 =
* Minor CSS bug fix
= 1.1 =
* Feature image bug fix
= 1.0 =
* Initial release
