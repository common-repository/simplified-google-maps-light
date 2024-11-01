<script>
    function __cetaboMapBootstrap() {

        var editView = new Cetabo.EditableMapView({
            el: "#map-editor",
            url: <?php echo json_encode($url); ?>,
            readonly:<?php echo json_encode($readonly); ?>,
            baseURL:<?php echo json_encode(Cetabo_SGMLRegistry::get('PLUGIN_URL')); ?>
        });

        <?php if (is_numeric($id)): ?>
        jQuery("#notification")
            .html("Loading ...")
            .fadeIn(500)
            .delay(3000)
            .fadeOut();

        editView.loadModel(<?php echo json_encode($id); ?>);
        //    	setTimeout(function() {
        //
        //    	}, 1000);
        <?php endif; ?>
    }
</script>

<?php echo Cetabo_SGMLController::fragment("dialog/delete"); ?>

<div class="wrap">

    <div id="map-editor">

        <?php echo Cetabo_SGMLController::fragment("menu", array(
            "content" => "menu/edit.php",
            'id' => $id,
            'map_name' => $map_name,
            'readonly' => $readonly,
        )); ?>

        <!-- /header -->
        <div id="notification" class="alert alert-info" style="display: none;"></div>


        <div class="panel panel-default">
            <div class="panel-heading"><?php echo $map_name; ?></div>
            <div class="panel-body">
                <div class="col-md-6 col-md-offset-3">
                    <?php include 'widget.php'; ?>
                </div>
            </div>
        </div>


    </div>

</div>





