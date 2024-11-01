<div id="controll-settings">
    <div>
        <h2 class="settings-title">General</h2>

        <div class="group-wrap">
            <!-- Map size -->
            <div class="control-group">
                <fieldset class="col">
                    <label for="map-width">width</label>
                    <input class="width" id="map-width" type="text"/>
                </fieldset>
                <fieldset class="col col2">
                    <label for="map-height">height</label>
                    <input class="height" id="map-height" type="text"/>
                </fieldset>
            </div>
            <!-- /control-group -->
            <!-- Map center -->
            <div class="control-group" id="center-details">
                <h3>Center</h3>
                <fieldset class="col">
                    <input class="lat" id="map-lat" type="text"/>
                </fieldset>
                <fieldset class=" col col2">
                    <input class="lng" id="map-lng" type="text"/>
                </fieldset>
            </div>
            <!-- /control-group -->
            <!-- Zoom level -->
            <div class="control-group">
                <h3>Zoom level</h3>

                <div class="zoom"></div>
            </div>
            <!-- /control-group -->
            <!-- Zoom level -->
            <div class="control-group  c-disabled">
                <h3>Zoom range</h3>
                <div class="zoomrange"></div>
            </div>
            <!-- /control-group -->

            <!-- Map type -->
            <div class="control-group c-disabled">
                <h3>Map type</h3>
                <div class="maptype" style="width:100%"></div>
            </div>

            <!-- Place clustering -->
            <div class="control-group c-disabled">
                <input type="checkbox" class="clustering styled-input"><em>Enable places clustering</em></li>
            </div>

            <!-- Dragging -->
            <div class="control-group c-disabled">
                <input type="checkbox" class="dragging styled-input"><em>Enable map dragging</em></li>
            </div>

            <!-- Double click zoom -->
            <div class="control-group c-disabled">
                <input type="checkbox" class="doubleclickzoom styled-input"><em>Enable double click zoom</em></li>
            </div>

            <!-- Enable scroll well zoom -->
            <div class="control-group c-disabled">
                <input type="checkbox" class="scrollwellzoom styled-input"><em>Enable zooming using a mouse's scroll wheel</em></li>
            </div>

            <!-- Enable scale controll -->
            <div class="control-group c-disabled">
                <input type="checkbox" class="scalecontrol-enabled styled-input"><em>Show scale</em></li>
            </div>

            <!-- /control-group -->
        </div>

        <h2 class="settings-title">Map control</h2>

        <div class="group-wrap">


            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="zoomcontrol-enabled styled-input"><em>Zoom control</em></li>
                </fieldset>
                <fieldset class="col col2">
                    <div class="zoomcontrol-position c-disabled" style="width:100%"></div>
                </fieldset>
            </div>



            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="streetviewcontrol-enabled styled-input"><em>Street view control</em></li>
                </fieldset>
                <fieldset class="col col2">
                    <div class="streetviewcontrol-position c-disabled" style="width:100%"></div>
                </fieldset>
            </div>



            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="pancontrol-enabled styled-input"><em>Pan control</em></li>
                </fieldset>
                <fieldset class="col col2">
                    <div class="pancontrol-position c-disabled" style="width:100%"></div>
                </fieldset>
            </div>


            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="maptypecontrol-enabled styled-input"><em>Map type control</em></li>
                </fieldset>
                <fieldset class="col col2">
                    <div class="maptypecontrol-position c-disabled" style="width:100%"></div>
                </fieldset>
            </div>

            <div class="control-group c-disabled">
                <fieldset class="col">
                    <input type="checkbox" class="enable-fullscreen styled-input"><em>Fullscreen</em>
                </fieldset>
                <fieldset class="col col2">
                    <input type="checkbox" class="start-fullscreen styled-input"><em>Start in fullscreen</em>
                </fieldset>
            </div>

            <div class="control-group c-disabled">
                <fieldset class="col">
                    <input type="checkbox" class="enable-addres-search styled-input"><em>Address search</em>
                </fieldset>
            </div>

        </div>


        <h2 class="settings-title">Map layout</h2>

        <div class="group-wrap  c-disabled">
            <!-- Map mode -->
            <div class="control-group">
                <h3>Map mode</h3>

                <div class="mapmode" style="width:100%"></div>
            </div>
            <!-- /control-group -->

            <!-- Map point of view -->
            <div class="control-group" id="pov-details" style="display:none;">
                <h3>Point of view</h3>
                <fieldset class="col">
                    <input class="heading" id="map-heading" type="text"/>
                </fieldset>
                <fieldset class=" col col2">
                    <input class="pitch" id="map-pitch" type="text"/>
                </fieldset>
            </div>
            <!-- /control-group -->

            <!-- Map pegman -->
            <div class="control-group" id="pegman-details" style="display:none;">
                <h3>Pegman position</h3>
                <fieldset class="col">
                    <input class="plat" id="map-lat" type="text"/>
                </fieldset>
                <fieldset class=" col col2">
                    <input class="plng" id="map-lng" type="text"/>
                </fieldset>
            </div>
            <!-- /control-group -->
        </div>


        <h2 class="settings-title">Sidebar settings</h2>

        <div class="group-wrap  c-disabled">
            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="enable-direction styled-input"><em>Enable direction</em>
                </fieldset>
                <fieldset class="col col2">
                    <input type="checkbox" class="show-direction-steps styled-input"><em>Show direction steps</em>
                </fieldset>
            </div>

            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="enable-tags styled-input"><em>Enable tags filter</em>
                </fieldset>
                <fieldset class="col col2">
                </fieldset>
            </div>


            <div class="control-group">
                <fieldset class="col">
                    <input type="checkbox" class="enable-places styled-input"><em>Enable places filter</em>
                </fieldset>
                <fieldset class="col col2">
                </fieldset>
            </div>

            <!-- Opened sidebar -->
            <div class="control-group">
                <h3>Show opened as default</h3>
                <div class="default-sidebar-tab" style="width:100%"></div>
            </div>

        </div>


        <h2 class="settings-title">Info box style</h2>

        <div class="group-wrap  c-disabled">
            <ul>
                <li><input type="checkbox" class="enable-custom-overlay styled-input"><em>Enable custom overlay</em></li>
                <li><input type="checkbox" class="overlaymultiple styled-input"><em>Allow multiple overlays to be opened</em></li>
            </ul>
        </div>

    </div>
</div>