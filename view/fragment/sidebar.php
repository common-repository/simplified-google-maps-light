<div class="cmap-ui-wrap">
  <div class="cmap-l-cell cmap-trigger-s-wrap">
    <button class="cmap-sidebar-trigger cmap-btn-default">
          <span class="bar-wrap">
            <span class="cmap-icon-bar cmap-bar-top"></span>
            <span class="cmap-icon-bar cmap-bar-mid"></span>
            <span class="cmap-icon-bar cmap-bar-bot"></span>
          </span>
    </button>
  </div>
  <div class="cmap-search-resize cmap-l-cell">
    <button type="button" class="cmap-fullscreen cmap-search-resize-submit cmap-btn-default">
      <i class="cmap-icon"></i>
    </button>
  </div>
  <div class="cmap-search cmap-l-cell">
    <button type="button" class="cmap-search-submit cmap-btn-default">
      <i class="cmap-icon"></i>
    </button>
    <input type="text" class="cmap-search-input" placeholder="Address">
  </div>
</div>
<button class="cmap-sidebar-trigger cmap-btn-default cmap-mob-sidebar-trigger">
  <span class="bar-wrap">
    <span class="cmap-icon-bar cmap-bar-top"></span>
    <span class="cmap-icon-bar cmap-bar-mid"></span>
    <span class="cmap-icon-bar cmap-bar-bot"></span>
  </span>
</button>

<div class="cmap-sidebar">

  <!-- ########################## -->
  <!-- Nav tabs -->
  <!-- ########################## -->
  <div class="col-xs-3">
    <ul class="nav nav-tabs tabs-left cmap-tabs">
      <li class="c-tags" data-bound="cmap-tags-<?php echo $id ?>">
          <a href="#cmap-tags-<?php echo $id ?>" data-toggle="tab"><i class="cmap-icon"></i></a>
      </li>
      <li class="c-places" data-bound="cmap-places-<?php echo $id ?>">
          <a href="#cmap-places-<?php echo $id ?>" data-toggle="tab"><i class="cmap-icon"></i></a>
      </li>
      <li class="c-direction" data-bound="cmap-direction-<?php echo $id ?>">
          <a href="#cmap-direction-<?php echo $id ?>" data-toggle="tab"><i class="cmap-icon"></i></a>
      </li>
    </ul>
  </div>


  <!-- ########################## -->
  <!-- Tab panes -->
  <!-- ########################## -->
  <div class="col-xs-9 cmap-sidebar-content">
    <div class="tab-content">
      <!-- ########################## -->
      <!-- TAGS -->
      <!-- ########################## -->
      <div class="tab-pane ctab-tags" id="cmap-tags-<?php echo $id ?>">
        <div class="cmap-sidebar-heading">
          <h3>Tags</h3>
          <button type="button" class="cmap-close-sidebar">close</button>
        </div>
        <div class="cmap-sidebar-tab-content">
          <?php include("sidebar/tabs/tags.php"); ?>
        </div>
      </div>
      <!-- ########################## -->
      <!-- PLACES -->
      <!-- ########################## -->
      <div class="tab-pane ctab-places" id="cmap-places-<?php echo $id ?>">
        <div class="cmap-sidebar-heading">
          <h3>Places</h3>
          <button type="button" class="cmap-close-sidebar">close</button>
        </div>
        <div class="cmap-sidebar-tab-content">
          <?php include("sidebar/tabs/places.php"); ?>
        </div>
      </div>

      <!-- ########################## -->
      <!-- DIRECTION -->
      <!-- ########################## -->
      <div class="tab-pane ctab-direction" id="cmap-direction-<?php echo $id ?>">
        <div class="cmap-sidebar-heading">
          <h3>Direction</h3>
          <button type="button" class="cmap-close-sidebar"></button>
        </div>
        <div class="cmap-sidebar-tab-content">
          <?php include("sidebar/tabs/direction.php"); ?>
        </div>
      </div>
    </div>
  </div>


</div>