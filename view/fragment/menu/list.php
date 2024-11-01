<li>
    <a class="btn btn-default navbar-btn selected" href="<?php echo Cetabo_SGMLHelper::action_url(''); ?>">
        <span class="glyphicon glyphicon-list-alt"></span> &nbsp;All maps</a>
</li>
<li>
    <a class="btn btn-default navbar-btn" href="<?php echo Cetabo_SGMLHelper::action_url('edit'); ?>">
        <span class="glyphicon glyphicon-plus">&nbsp;</span>Add new</a>
</li>
<?php  ?>

<?php /*$$$IS_LIGHT_REGION_START$$$*/ ?>
<li>
    <a class="btn btn-default navbar-btn c-disabled" href="#">
        <span class="glyphicon glyphicon-import">&nbsp;</span>Import</a>
</li>
<?php /*$$$IS_LIGHT_REGION_END$$$*/ ?>

<?php echo Cetabo_SGMLController::fragment("menu/buttons/subscribe"); ?>
