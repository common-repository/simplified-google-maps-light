<!-- ########################## -->
<!-- Map -->
<!-- ########################## -->
<div class="cmap-container" id="map<?php echo (isset($id)) ? $id : ''; ?>-container">
    <div class="cmap-container-inside">
        <!-- ########################## -->
        <!-- Map sidebar -->
        <!-- ########################## -->
        <?php echo Cetabo_SGMLController::fragment("sidebar", array(
            'id' => $id,
            'readonly' => $readonly,
        )); ?>
        <?php echo Cetabo_SGMLController::fragment("product", array(
            'readonly' => $readonly,
        )); ?>
        <!-- ########################## -->
        <!-- Map canvas -->
        <!-- ########################## -->
        <?php echo Cetabo_SGMLController::fragment("canvas", array(
            'readonly' => $readonly,
        )); ?>
    </div>
</div>

