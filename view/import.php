
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
        <div class="panel-heading">Import map</div>
        <div class="panel-body">
            <form role="form" method="post" enctype="multipart/form-data" action="<?php echo $action; ?>">
                <div class="form-group">
                    <label for="file">File input</label>
                    <input type="file" id="file" name="file">

                    <p class="help-block">Attach the ZIP file and click import</p>
                </div>
                <button type="submit" class="btn btn-default">Import</button>
            </form>
        </div>


    </div>
</div>

</div>
