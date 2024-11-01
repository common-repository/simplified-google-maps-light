<li class="back-wrap">
    <a class="btn btn-default btn-back navbar-btn" href="<?php echo Cetabo_SGMLHelper::action_url(''); ?>">
        <span class="glyphicon glyphicon-remove-circle"></span> &nbsp;Back
    </a>
</li>
<?php if (is_numeric($id)): ?>
    <li>
        <a class="btn btn-default navbar-btn export c-disabled" href="#">
            <span class="glyphicon glyphicon-export"></span> &nbsp;Export
        </a>
    </li>
    <li>
        <a class="btn btn-default navbar-btn remove" href="#" data-target="#delete-dialog" map-id="<?php echo $id; ?>"
           map-name="<?php echo $map_name; ?>">
            <span class="glyphicon glyphicon-remove-circle"></span> &nbsp;Delete
        </a>
    </li>
<?php endif; ?>

<?php if (!$readonly): ?>
    <li>
        <div class="btn-group">
            <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                Save <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#" class="save">Save</a></li>
                <li><a href="#" class="clone c-disabled">Save as clone</a></li>
            </ul>
        </div>
    </li>
<?php else: ?>
    <li>
        <a class="edit btn btn-default">
            <span class="glyphicon glyphicon-remove-circle"></span> &nbsp;Edit
        </a>
    </li>
<?php endif; ?>

<?php echo Cetabo_SGMLController::fragment("menu/buttons/subscribe"); ?>
