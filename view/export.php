<div class="wrap">

    <?php echo Cetabo_SGMLController::fragment("menu", array("content" => "menu/list.php")); ?>

    <div class="panel panel-default">
        <div class="panel-heading">Export map</div>
        <div class="panel-body">
            <?php if ($success): ?>
                <div class="alert alert-success">
                    The map <b><?php echo $name ?></b> was successfully exported. If the download doesn't start click
                    <a href="<?php echo $url; ?>">here</a>
                </div>

            <?php else: ?>
                <div class="alert alert-danger">
                    There was an error on exporting the map.
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script>
        window.location.href =<?php echo json_encode($url);?>;
    </script>
</div>
