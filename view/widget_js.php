<?php
require_once(dirname(__FILE__) . '/../class/cetabo-helper.php');
header('Content-Type: application/javascript');

$id = Cetabo_SGMLHelper::arr_get($_GET, 'id');
$url = Cetabo_SGMLHelper::arr_get($_GET, 'url');
$base_url = Cetabo_SGMLHelper::arr_get($_GET, 'base_url');
if (!is_numeric($id)) {
    return;
}
?>
jQuery(function() {
    Cetabo.Api.create({
        id:<?php echo json_encode($id); ?>,
        el: "#map<?php echo $id; ?>-container",
        url:{load: <?php echo json_encode(base64_decode($url)); ?>},
        baseURL:<?php echo json_encode($base_url); ?>
    });
});

