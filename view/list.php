<div class="wrap">

    <?php echo Cetabo_SGMLController::fragment("menu", array("content" => "menu/list.php")); ?>
    <?php echo Cetabo_SGMLController::fragment("dialog/delete"); ?>

    <div class="panel panel-default">
        <div class="panel-heading">Maps list</div>
        <div class="panel-body">

            <form id="map-list" method="get">
                <input type="hidden" name="page" value="<?php echo $_REQUEST['page'] ?>"/>
                <?php $map_list_table->display() ?>
            </form>
        </div>
    </div>
</div>