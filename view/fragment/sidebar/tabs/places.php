<div class="cmap-sidebar-content-inside">
  <div class="cmap-places-scroll">
    <ul class="places pins"></ul>
  </div>

  <script id="template-places" type="text/x-handlebars-template">
    {{#list places}}
    <li><a href="#" class="place-ident" data-place="{{id}}">{{attributes.name}}</a></li>
    {{/list}}
  </script>
</div>