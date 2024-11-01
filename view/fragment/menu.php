<h2></h2>
<?php $action = Cetabo_SGMLHelper::arr_get($_GET, 'action'); ?>

<nav class="navbar navbar-default cmap-header-bar" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse"
              data-target="#cmap-header-nav">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <div class="navbar-brand">
        <div class="cmap-prod-name">
          <a target="_blank" href="<?php echo Cetabo_SGMLRegistry::get('PLUGIN_PAGE') ?>"><?php echo Cetabo_SGMLRegistry::get('PLUGIN_NAME') ?> <span
                class="badge"><?php echo Cetabo_SGMLRegistry::get('PLUGIN_VERSION') ?></span></a>

          <div class="cmap-brand">
            created by <a href="<?php echo Cetabo_SGMLRegistry::get('PLUGIN_AUTHOR_URL') ?>" class="navbar-link" target="_blank"><?php echo Cetabo_SGMLRegistry::get('PLUGIN_AUTHOR_NAME') ?></a>
          </div>
        </div>
      </div>
    </div>

    <div class="collapse navbar-collapse" id="cmap-header-nav">
      <ul class="nav navbar-nav navbar-right">
        <?php include($content); ?>
      </ul>
    </div>
    <!-- /.navbar-collapse -->
  </div>
  <!-- /.container-fluid -->
</nav>

