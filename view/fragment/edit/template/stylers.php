<script id="template-style" type="text/x-handlebars-template">
    <h3 class="header-{{id}}">
        <div id="name-lable-{{id}}"></div>
        <a href="#" identif="{{id}}" class="remove">x</a></h3>
    <div id="{{id}}" class="syle-content">

        <!-- Feature Type -->
        <div class="control-group">
            <h3>Feature type</h3>

            <div class="feature-type" style="width:100%"></div>
        </div>

        <!-- Element Type -->
        <div class="control-group">
            <h3>Element type</h3>

            <div class="element-type" style="width:100%"></div>
        </div>

        <!-- Visiblity -->
        <div class="control-group">
            <h3>Visibility</h3>

            <div class="visibility" style="width:100%"></div>
        </div>

        <!-- Color -->
        <div class="control-group visibility-bound">
            <h3>Color</h3>
            <fieldset>
                <input class="color" value="66ff00"/>
            </fieldset>
        </div>

        <!-- Lightness -->
        <div class="control-group visibility-bound">
            <div class="t-wrap">
                <div class="f-cell">
                    <h3>Saturation</h3>
                    <input class="saturation" value="0"/>
                </div>
                <div class="f-cell">
                    <h3>Lightness</h3>
                    <input class="lightness" value="0"/>
                </div>
                <div class="f-cell">
                    <h3>Gamma</h3>
                    <input class="gamma" value="1"/>
                </div>
            </div>
        </div>

        <!-- Weight
        <div>
            <label>Weight </label>
            <input class="weight " type="text"/>
        </div>
        -->
        <!-- Inverse lightness
        <div>
            <label>Inverse lightness </label>
            <input type="checkbox" class="inverse-lightness" type="text"/>
        </div>
        -->
    </div>
</script>