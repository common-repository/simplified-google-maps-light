<div class="cmap-sidebar-content-inside">
  <div class="mapdirection">
    <div class="travel-bar">

      <div class="btn-group">
        <button type="button" data-type="DRIVING" class="btn btn-default direction-type active"><span class="map-driving-icon"></span></button>
        <button type="button" data-type="TRANSIT" class="btn btn-default direction-type"><span class="map-transit-icon"></span></button>
        <button type="button" data-type="BICYCLING" class="btn btn-default direction-type"><span class="map-bicycling-icon"></span></button>
        <button type="button" data-type="WALKING" class="btn btn-default direction-type"><span class="map-walking-icon"></span></button>
      </div>

    </div>
    <fieldset>
      <label>Destination:</label>
      <select class="destination"></select>
    </fieldset>
    <fieldset>
      <label>Origin:</label>
      <input type='text' class="origin block" placeholder="Search for location"/>
    </fieldset>
    <fieldset class="btn-wrap">
      <button class="btn-cmap-direction calculate-route" type="button">Get Direction</button>
    </fieldset>


    <div class="message alert alert-danger" style="display: none;"></div>
    <ul class="steps places"></ul>

    <script id="template-steps" type="text/x-handlebars-template">
      {{#list places}}
      <li><a href="#" class="place-ident" data-place="{{id}}">{{{attributes.details}}}</a></li>
      {{/list}}
    </script>
  </div>
</div>
