<div class="street-canvas map" style=" <?php if ($readonly): ?>width:100%;<?php endif; ?>display:none"></div>
<div class="hyperlapse-canvas map" style=" <?php if ($readonly): ?>width:100%;<?php endif; ?>display:none"></div>
<div class="street-canvas-error" style="display:none">
    <p>Drop the Pegman marker onto a street and the map will update to display a Street View panorama of the indicated location.</p>
</div>
<div class="hyperlapse-canvas-error" style="display:none">There was a problem on loading hyperlapse</div>
<div class="map-canvas map" <?php if ($readonly): ?>style="width:100%"<?php endif; ?>></div>