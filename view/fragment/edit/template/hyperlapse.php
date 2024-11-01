<script id="template-place-hyperlapse" type="text/x-handlebars-template">
    <h3 class="header-{{id}}">
        <div id="name-lable-{{id}}"></div>
        <a href="#" identif="{{id}}" class="remove">x</a></h3>
    <div id="{{id}}" class="accordion-content">
        <!-- Location -->
        <div class="control-group">
            <h3>Location</h3>
            <fieldset class="col">
                <input class="lat" type="text"/>
            </fieldset>
            <fieldset class="col col2">
                <input class="lng" type="text"/>
            </fieldset>
        </div>
    </div>
</script>