<div class="wrap">

    <?php echo Cetabo_SGMLController::fragment("menu", array("content" => "menu/list.php")); ?>

    <?php if ($report): ?>
        <div class="alert alert-dismissable <?php if ($report['success']): ?>alert-success<?php else: ?>alert-danger <?php endif; ?>">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <?php foreach ($report['entries'] as $entry): ?>
                <?php echo($entry); ?>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>


    <div class="panel panel-default">
        <div class="panel-heading">Settings</div>
        <div class="panel-body">
            <form role="form" method="post" enctype="multipart/form-data" action="<?php echo $action; ?>">
                <div class="form-group">
                    <label for="language">Map language</label>
                    <select name="language">
                        <option value="" selected="">---</option>
                        <?php foreach ($languages as $key => $val): ?>
                            <option value="<?php echo $key ?>" <?php if ($key == $language): ?>selected=""<?php endif; ?>><?php echo $val ?></option>
                        <?php endforeach; ?>

                    </select>

                    <p class="help-block">Select map language</p>
                </div>
                <button type="submit" class="btn btn-default">Save</button>
            </form>
        </div>


    </div>
</div>

</div>
