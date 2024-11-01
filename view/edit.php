<script>
    function __cetaboMapBootstrap() {

        var editView = new Cetabo.EditableMapView({
            el: "#map-editor",
            url: <?php echo json_encode($url); ?>,
            readonly:<?php echo json_encode($readonly); ?>,
            baseURL:<?php echo json_encode(Cetabo_SGMLRegistry::get('PLUGIN_URL')); ?>
        });

        <?php if (is_numeric($id)): ?>
        editView.loadModel(<?php echo json_encode($id); ?>);
        //    	setTimeout(function() {
        //
        //    	}, 1000);
        <?php endif; ?>
    }
</script>

<?php echo Cetabo_SGMLController::fragment("dialog/delete"); ?>
<?php echo Cetabo_SGMLController::fragment("dialog/loading"); ?>

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
        <div id="warning" class="alert alert-warning" style="display: none;"></div>

        <div class="panel panel-default">
            <div class="content" id="cmap-tabs-container">
                <div class="main-nav-tabs">
                    <!-- Tab header -->
                    <ul>
                        <!-- <li><a href="#controll-hyperlapse" class="tab-style"><i class="icon-dashboard"></i><span>Hyperlapse</span></a></li>-->
                        <li><a href="#controll-style" class="tab-style"><i class="icon-dashboard"></i><span>Style</span></a>
                        <li><a href="#controll-settings" class="tab-settings"><i class="icon-cog"></i><span>Settings</span></a></li>
                        <li><a href="#controll-place" class="tab-place"><i class="icon-map-marker"></i><span>Places</span></a></li>
                    </ul>
                </div>
                <div class="inside">
                    <div class="leftcontainer">
                        <div class="map-name" <?php if ($readonly): ?>style="width:100%"<?php endif; ?>>
                            <input type='text' placeholder="Map name" class='name block'/>
                        </div>
                        <!-- MAP -->
                        <?php include 'widget.php'; ?>

                        <!-- ########################## -->
                        <!-- Editor -->
                        <!-- ########################## -->
                        <?php echo Cetabo_SGMLController::fragment("edit/editor", array('readonly' => $readonly,)); ?>

                    </div>

                    <!-- Control -->
                    <?php if (!$readonly): ?>
                        <div class="controll">
                            <!-- ########################## -->
                            <!-- Places tab -->
                            <!-- ########################## -->
                            <?php echo Cetabo_SGMLController::fragment("edit/tabs/places"); ?>
                            <!-- ########################## -->
                            <!-- Settings tab -->
                            <!-- ########################## -->
                            <?php echo Cetabo_SGMLController::fragment("edit/tabs/settings"); ?>
                            <!-- ########################## -->
                            <!-- Style tab -->
                            <!-- ########################## -->
                            <?php echo Cetabo_SGMLController::fragment("edit/tabs/style"); ?>
                            <!-- ########################## -->

                            <!-- Hyperlapse tab -->
                            <!-- ########################## -->
                            <?php //echo Cetabo_SGMLController::fragment("edit/tabs/hyperlapse", array('readonly' => $readonly));?>

                        </div>
                    <?php endif; ?>
                </div>
            </div>
            <!-- /content -->
        </div>

    </div>

</div>


<?php echo Cetabo_SGMLController::fragment("edit/template"); ?>







