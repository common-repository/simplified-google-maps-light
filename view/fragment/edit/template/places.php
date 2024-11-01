<script id="template-place" type="text/x-handlebars-template">
    <h3 class="header-{{id}}">
        <div id="name-lable-{{id}}"></div>
        <a href="#" identif="{{id}}" class="remove">x</a></h3>
    <div id="{{id}}" class="accordion-content">
        <!-- Name -->
        <div class="control-group">
            <h3>Name</h3>
            <fieldset>
                <input class="name block" type="text"/>
            </fieldset>
        </div>
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

        <!-- Animation -->
        <div class="control-group c-disabled">
            <h3>Pin animation</h3>
            <fieldset class="s-icon">
                <input class="animation" style="width:100%" id="animation"/>
            </fieldset>
        </div>

        <!-- Icon -->
        <div class="control-group select-icons">
            <div class="select-wrap c-col">
                <h3>Icon</h3>
                <fieldset class="s-icon">
                    <input class="icon" style="width:100%" id="icon"/>
                </fieldset>
            </div>
            <div class="custom-icons">
                <button class="custom btn c-disabled"><i class="icon-plus"></i></button>
            </div>
        </div>

        <!-- Tags -->
        <div class="control-group c-disabled">
            <h3>Tags</h3>
            <fieldset class="s-icon">
                <input name="tags" class="tags" style="width:100%" value=""/>
            </fieldset>
        </div>


    </div>
</script>
