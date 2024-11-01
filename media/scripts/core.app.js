(function() {
  window.Cetabo || (window.Cetabo = {});

  window.google || (window.google = {});

  google.maps || (google.maps = {});

  Cetabo.Api = {
    maps: [],
    create: function(options, alias) {
      var map;
      if (alias != null) {
        alias = "map" + Math.floor(Math.random() * 100000);
      }
      map = new Cetabo.MapView(options);
      this.maps[alias] = map;
      map.loadModel(options.id);
      return map;
    }
  };

}).call(this);
;(function() {
  Cetabo.ArrayUtil = {
    has: function(array, v) {
      var i;
      i = 0;
      while (i < array.length) {
        if (array[i] === v) {
          return true;
        }
        i++;
      }
      return false;
    },
    removeByPosition: function(array, from, to) {
      var rest;
      if (from === undefined || to === undefined) {
        return array;
      }
      rest = array.slice((to || from) + 1 || array.length);
      array.length = (from < 0 ? array.length + from : from);
      return array.push.apply(array, rest);
    },
    removeByContent: function(array, content) {
      var i;
      i = 0;
      while (i < array.length) {
        if (array[i] === content) {
          Cetabo.ArrayUtil.removeByPosition(array, i, i);
        }
        i++;
      }
    },
    asSet: function(array) {
      var i, l, result;
      result = [];
      i = 0;
      l = array.length;
      while (i < l) {
        if (result.indexOf(array[i]) === -1) {
          result.push(array[i]);
        }
        i++;
      }
      return result;
    },
    pushArray: function(array, toPush) {
      var i, len;
      i = 0;
      len = toPush.length;
      while (i < len) {
        array.push(toPush[i]);
        ++i;
      }
    }
  };

  Cetabo.StringUtil = {
    replaceAll: function(str, find, replace) {
      return str.replace(new RegExp(find, "g"), replace);
    },
    trim: function(str, chars) {
      return str.rtrim(chars).ltrim(chars);
    },
    ltrim: function(str, chars) {
      chars = chars || "\\s";
      return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    },
    rtrim: function(str, chars) {
      chars = chars || "\\s";
      return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    },
    isEmpty: function(str) {
      return str === undefined || str === null || str.trim() === "";
    }
  };

}).call(this);
;(function() {
  Cetabo.EventDistpatcher = {
    channels: [],
    use: function(identifier) {
      if (this.channels[identifier] === undefined) {
        this.channels[identifier] = _.extend({}, Backbone.Events);
      }
      return this.channels[identifier];
    }
  };

}).call(this);
;/*
  Base class fro all system managers
*/


(function() {
  Cetabo.BaseManager = Backbone.Model.extend({});

}).call(this);
;/*
Provide global notification system
*/


(function() {
  Cetabo.NotificationsManager = Cetabo.BaseManager.extend({
    constructor: function(config) {
      var channel;
      channel = config.channel;
      this.config = jQuery.extend({
        el: "#notification"
      }, config);
      Cetabo.EventDistpatcher.use(channel).on("notification.show", this.show, this);
    },
    show: function(message) {
      jQuery(this.config.el).html(message).fadeIn(500).delay(4000).fadeOut();
    }
  });

}).call(this);
;/*
Provide global overlay system
*/


(function() {
  Cetabo.OverlayManager = Cetabo.BaseManager.extend({
    constructor: function(config) {
      var channel;
      channel = config.channel;
      this.config = jQuery.extend({
        el: "#cmap-overlay"
      }, config);
      Cetabo.EventDistpatcher.use(channel).on("overlay.show", this.show, this);
      Cetabo.EventDistpatcher.use(channel).on("overlay.hide", this.hide, this);
    },
    show: function(message) {
      jQuery(this.config.el).modal('show');
    },
    hide: function() {
      jQuery(this.config.el).modal('hide');
    }
  });

}).call(this);
;/*
  Provide global access to cached templates
*/


(function() {
  Cetabo.TemplateManager = {
    template: {},
    registerHelpersIfRequired: function() {
      if (this.inited != null) {
        return;
      }
      this.inited = true;
      return Handlebars.registerHelper("list", function(items, options) {
        var i, out;
        out = "";
        i = 0;
        while (i < items.length) {
          out = out + options.fn(items[i]);
          i++;
        }
        return out;
      });
    },
    /*
      Get template by name
    */

    getTemplateByName: function(name) {
      this.registerHelpersIfRequired();
      if (this.template[name] === undefined) {
        this.template[name] = Handlebars.compile(jQuery(name).html());
      }
      return this.template[name];
    }
  };

}).call(this);
;/*
Provide global communication system to backend
*/


(function() {
  Cetabo.ConnectionManager = Cetabo.BaseManager.extend({
    /*
      Initializate the connection manager
    */

    constructor: function(config) {
      var channel;
      channel = config.channel;
      Cetabo.EventDistpatcher.use(channel).on("backend.send", this.send, this);
      this.config = config;
    },
    /*
      Send AJAX backend message
    */

    send: function(message) {
      var options, url;
      options = message.callback;
      url = message.url;
      jQuery.ajax({
        url: message.url,
        type: "POST",
        dataType: "json",
        data: message.content,
        /*
          Success callback
        */

        success: function(object, status) {
          if (options !== undefined && options.success) {
            options.success(object);
          }
        },
        /*
          Error callback
        */

        error: function(xhr, status, error) {
          if (options !== undefined && options.error) {
            options.error(error);
          }
        }
      });
    }
  });

}).call(this);
;/*
Provide logic for place management
*/


(function() {
  Cetabo.MarkerManager = Cetabo.BaseManager.extend({
    initialize: function(config) {
      var channel;
      channel = this.get("channel");
      this.set("state", {
        markers: {},
        infoViews: {}
      });
      this.set("clustering", false);
      Cetabo.EventDistpatcher.use(channel).on("overlay.updated", this.onOverlayStateUpdated, this);
      Cetabo.EventDistpatcher.use(channel).on("place.cluster", this.onClusteringStateUpdated, this);
      Cetabo.EventDistpatcher.use(channel).on("place.add", this.onPlaceStateUpdated, this);
      Cetabo.EventDistpatcher.use(channel).on("place.remove", this.onPlaceStateUpdated, this);
      Cetabo.EventDistpatcher.use(channel).on("place.update", this.onPlaceStateUpdated, this);
      Cetabo.EventDistpatcher.use(channel).on("place.filter", this.onPlaceFilter, this);
      Cetabo.EventDistpatcher.use(channel).on("place.focus", this.onPlaceFocus, this);
      this.set("defaultoverlay", true);
      this.set("overlaymultiple", true);
    },
    /*
    Add new place on map
    */

    addMarker: function(place, container) {
      this.placeNewMarkerOnContainer(place);
      this.attachToContainer(place, container);
      this.bindEvents(place, container);
    },
    /*
      Add new place marker on map/ street canvas
    */

    placeNewMarkerOnContainer: function(place) {
      var reference;
      if ((place.get("lat") === undefined || place.get("lng") === undefined) && this.isNewMarkerReferenceProvider()) {
        reference = this.getNewMarlerReference();
        place.set("lat", reference.lat());
        place.set("lng", reference.lng());
      }
    },
    getNewMarlerReference: function() {},
    isNewMarkerReferenceProvider: function() {},
    getContainer: function() {},
    isAllowingClustering: function() {
      return true;
    },
    /*
    Create map marker and info view
    */

    attachToContainer: function(place, container) {
      var locked, marker, _parent;
      locked = place.get("locked") === true;
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.get("lat"), place.get("lng")),
        map: container,
        draggable: !this.get("readonly") && !locked,
        title: place.get("name"),
        _refplace: place
      });
      _parent = this;
      google.maps.event.addListener(marker, "click", function() {
        var content, viewGroup;
        viewGroup = _parent.getPlaceInfoViewGroup(place, container);
        if ((_parent.infoViewToOpen != null) && !_parent.get("overlaymultiple")) {
          _parent.infoViewToOpen.close();
        }
        _parent.infoViewToOpen = _parent.selectInfoView(viewGroup);
        content = place.get("details");
        if (!content || 0 === content.length || /^\s*$/.test(content)) {
          return;
        }
        _parent.infoViewToOpen.open(container, marker);
      });
      this.get("state").markers[place.get("id")] = marker;
      return marker;
    },
    selectInfoView: function(infoViewGroup) {
      var customInfoView, defaultInfoView, view;
      defaultInfoView = infoViewGroup.google;
      customInfoView = infoViewGroup.custom;
      view = (this.get("defaultoverlay") === true ? defaultInfoView : customInfoView);
      return view;
    },
    /*
    Get marker associated info view
    */

    getPlaceInfoViewGroup: function(place) {
      var customInfoView, googleInfoView, infoViewContainer;
      infoViewContainer = this.get("state").infoViews[place.get("id")];
      if (infoViewContainer === undefined) {
        googleInfoView = new google.maps.InfoWindow({
          content: place.get("details")
        });
        customInfoView = new InfoBox({
          map: this.getContainer(),
          content: "<div class='ccontent'>" + place.get("details") + "</div>",
          disableAutoPan: false,
          pixelOffset: new google.maps.Size(-250, 0),
          boxClass: "cinfobox",
          boxStyle: {
            opacity: 0.90,
            width: "500px"
          },
          closeBoxMargin: "0",
          closeBoxURL: this.config.baseURL + "media/images/close_icon.png",
          infoBoxClearance: new google.maps.Size(1, 1)
        });
        infoViewContainer = {
          google: googleInfoView,
          custom: customInfoView
        };
        this.get("state").infoViews[place.get("id")] = infoViewContainer;
      }
      return infoViewContainer;
    },
    /*
    On change the overlay type
    @param model
    */

    onOverlayStateUpdated: function(model) {
      this.set("defaultoverlay", model.get("overlayenable") === undefined || model.get("overlayenable") === false);
      this.set("overlaymultiple", model.get("overlaymultiple"));
    },
    /*
    On filter places
    */

    onPlaceFilter: function(criteria) {
      var key, marker, place, visible;
      for (key in this.get("state").markers) {
        marker = this.get("state").markers[key];
        place = marker._refplace;
        visible = place.isPassingCriteriaCheck(criteria);
        marker.setVisible(visible);
      }
      if (this.get("clustering")) {
        this.resetClustering();
      }
    },
    resetClustering: function() {
      var map;
      if (this.markerClusterer == null) {
        return;
      }
      this.markerClusterer.repaint();
      map = this.getContainer();
      google.maps.event.trigger(map, 'resize');
      map.setZoom(map.getZoom() - 1);
      map.setZoom(map.getZoom() + 1);
    },
    onPlaceFocus: function(place) {
      var animation, channel, lat, lng, marker;
      channel = this.get("channel");
      lat = place.get("lat");
      lng = place.get("lng");
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatecenter", lat, lng);
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoom", 10);
      marker = this.getMarkerByPlace(place);
      if (marker !== null) {
        animation = marker.getAnimation;
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
          marker.setAnimation(animation);
        }), 2000);
      }
    },
    getMarkerByPlace: function(place) {
      var key, marker, _place;
      for (key in this.get("state").markers) {
        marker = this.get("state").markers[key];
        _place = marker._refplace;
        if (place.id === _place.id) {
          return marker;
        }
      }
      return null;
    },
    /*
    On change the clustering state
    @param model
    */

    onClusteringStateUpdated: function(isClusteringEnabled) {
      if (!this.isAllowingClustering()) {
        return;
      }
      if (isClusteringEnabled) {
        this.enableClustering();
      } else {
        this.disableClustering();
      }
    },
    enableClustering: function() {
      var markers;
      this.set("clustering", true);
      markers = this.getVisibleMarkers();
      if (markers == null) {
        return;
      }
      if (this.markerClusterer === undefined) {
        this.markerClusterer = new MarkerClusterer(this.getContainer(), markers, {
          ignoreHidden: true
        });
      } else {
        this.markerClusterer.clearMarkers();
        this.markerClusterer.addMarkers(markers);
        this.markerClusterer.repaint();
      }
    },
    disableClustering: function() {
      var markers;
      this.set("clustering", false);
      if (this.markerClusterer === undefined) {
        return;
      }
      this.markerClusterer.clearMarkers();
      this.markerClusterer.repaint();
      markers = this.getVisibleMarkers();
      this.reatachToContainer(markers, this.getContainer());
    },
    reatachToContainer: function(markers, container) {
      var key, _results;
      _results = [];
      for (key in markers) {
        _results.push(markers[key].setMap(container));
      }
      return _results;
    },
    onPlaceStateUpdated: function(place) {
      var i, markers;
      markers = this.getVisibleMarkers();
      if ((this.markerClusterer == null) || (markers == null)) {
        return;
      }
      i = 0;
      while (i < markers.length) {
        this.markerClusterer.addMarker(markers[i]);
        i++;
      }
    },
    getVisibleMarkers: function() {
      var i, key, marker, markers, place;
      markers = [];
      if (this.get("state") != null) {
        i = 0;
        for (key in this.get("state").markers) {
          marker = this.get("state").markers[key];
          place = marker._refplace;
          if (place.get("type") !== "hyperlapse") {
            markers[key] = marker;
          }
        }
      }
      return markers;
    },
    /*
    Rebind clustering
    */

    refreshClustering: function() {},
    /*
    Add events on marker
    */

    bindEvents: function(place) {
      var channel, marker;
      marker = this.get("state").markers[place.get("id")];
      channel = this.get("channel");
      google.maps.event.addListener(marker, "dragend", function() {
        var point;
        point = marker.getPosition();
        place.set("lat", point.lat());
        place.set("lng", point.lng());
        Cetabo.EventDistpatcher.use(channel).trigger("place.update", place);
      });
      google.maps.event.addListener(marker, "mousedown", function() {
        Cetabo.EventDistpatcher.use(channel).trigger("place.select", place);
      });
    },
    /*
    Update marker
    */

    updateMarker: function(place) {
      var id, placeMarker, viewGroup;
      id = place.get("id");
      placeMarker = this.get("state").markers[id];
      if (placeMarker === undefined) {
        return;
      }
      placeMarker.setTitle(place.get("name"));
      placeMarker.setIcon(place.get("icon"));
      placeMarker.setAnimation(place.get("animation"));
      placeMarker.setPosition(new google.maps.LatLng(place.get("lat"), place.get("lng")));
      viewGroup = this.getPlaceInfoViewGroup(place);
      viewGroup.google.setContent(place.get("details"));
      viewGroup.custom.setContent("<div class='ccontent'>" + place.get("details") + "</div>");
    },
    /*
    Remove marker
    */

    removeMarker: function(place) {
      var id, marker;
      id = place.get("id");
      marker = this.get("state").markers[id];
      if (marker !== undefined) {
        marker.setMap(null);
      }
    },
    addCustomControll: function(container) {},
    removeCustomControll: function() {
      var customControll;
      customControll = this.get("customcontroll");
      if (customControll !== undefined && customControll !== null) {
        jQuery(customControll).hide();
      }
    }
  });

}).call(this);
;/*
Provide all opperations required to manipute the map
@type @exp;BaseManager@call;extend
*/


(function() {
  Cetabo.MapManager = Cetabo.MarkerManager.extend({
    initialize: function(config) {
      var channel;
      Cetabo.MapManager.__super__.initialize.apply(this, arguments);
      this.config = config;
      this.initMap();
      channel = this.get("channel");
      Cetabo.EventDistpatcher.use(channel).on("map.updatecenter", this.onChangeMapPosition, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatezoom", this.onChangeMapZoom, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatezoomrange", this.onChangeMapZoomRange, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatetype", this.onChangeMapType, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatesize", this.onUpdateSize, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatemode", this.onChangeMode, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatedragging", this.onChangeMapDragging, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatedoubleclickzoom", this.onChangeMapDoubleClickZoom, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatescrollwellzoom", this.onChangeMapScrollWellZoom, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatezoomcontrol", this.onUpdateZoomControl, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatezoomcontrolposition", this.onUpdateZoomControlPosition, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatestreetviewcontrol", this.onUpdateStreetViewControl, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatestreetviewcontrolposition", this.onUpdateStreetViewControlPosition, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatepancontrol", this.onUpdatePanControl, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatepancontrolposition", this.onUpdatePanControlPosition, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatemaptypecontrol", this.onUpdateMapTypeControl, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatemaptypecontrolposition", this.onUpdateMapTypeControlPosition, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatescalecontrol", this.onUpdateScaleControl, this);
      Cetabo.EventDistpatcher.use(channel).on("place.add", this.onAddPlaces, this);
      Cetabo.EventDistpatcher.use(channel).on("place.remove", this.onRemovePlace, this);
      Cetabo.EventDistpatcher.use(channel).on("place.update", this.onUpdatePlace, this);
      Cetabo.EventDistpatcher.use(channel).on("styler.update", this.onUpdateStyle, this);
      Cetabo.EventDistpatcher.use(channel).on("screen.updatesize", this.onUpdateScreenSize, this);
      Cetabo.EventDistpatcher.use(channel).on("screen.resized", this.onScreenResolutionChanged, this);
    },
    /*
    Prepare map
    */

    initMap: function(options) {
      var channel, mapCanvas, mapOptions, _parent;
      google.maps.visualRefresh = true;
      mapCanvas = this.config.el;
      channel = this.get("channel");
      _parent = this;
      mapOptions = jQuery.extend({
        zoom: 3,
        center: new google.maps.LatLng(39.5312, -102.6502),
        panControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        scaleControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        }
      }, options);
      this.map = new google.maps.Map(document.getElementById(mapCanvas), mapOptions);
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatecenter", this.map.getCenter().lat(), this.map.getCenter().lng());
      google.maps.event.addListener(this.map, "dragend", function() {
        Cetabo.EventDistpatcher.use(channel).trigger("map.updatecenter", this.getCenter().lat(), this.getCenter().lng());
      });
      google.maps.event.addListener(this.map, "zoom_changed", function() {
        var normalizedZoom, zoom;
        zoom = this.getZoom();
        normalizedZoom = parseInt(_parent.normalizeZoom(zoom));
        if ((normalizedZoom != null) && normalizedZoom !== zoom) {
          this.setZoom(normalizedZoom);
          return;
        }
        Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoom", this.getZoom());
      });
      Cetabo.EventDistpatcher.use(channel).trigger("map.created", this.map);
    },
    normalizeZoom: function(zoomLevel) {
      var max, min;
      if (this.zoomRange == null) {
        return zoomLevel;
      }
      min = this.zoomRange.min;
      max = this.zoomRange.max;
      if (zoomLevel < max && zoomLevel > min) {
        return zoomLevel;
      }
      if (Math.abs(max - zoomLevel) < Math.abs(min - zoomLevel)) {
        return max;
      } else {
        return min;
      }
    },
    onChangeMapPosition: function(lat, lng) {
      var center;
      if (lat === undefined || lng === undefined) {
        return;
      }
      center = new google.maps.LatLng(lat, lng);
      this.map.panTo(center);
      this.map.setCenter(center);
    },
    onChangeMapType: function(type) {
      this.map.setMapTypeId(type);
    },
    onChangeMode: function(mode) {
      var instance, maxHeight, maxWidth;
      this.mode = mode;
      switch (mode) {
        case google.maps.MapMode.STREET:
        case google.maps.MapMode.HYPERLAPSE:
          instance = this;
          maxHeight = jQuery("#" + this.config.el).height();
          maxWidth = jQuery("#" + this.config.el).width();
          this.set("oldWidth", jQuery("#" + this.get("el")).width());
          this.set("oldHeight", jQuery("#" + this.get("el")).height());
          this.onUpdateSize(300, 300);
          jQuery("#" + this.config.el).addClass("street-mode");
          jQuery("#" + this.config.el).resizable({
            animate: false,
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            handles: 'n, e, s, w, se',
            resize: function(event, ui) {
              instance.onUpdateSize(ui.size.width, ui.size.height);
            }
          });
          this.removeCustomControll();
          break;
        case google.maps.MapMode.MAP:
          this.set("width", this.get("oldWidth"));
          this.set("height", this.get("oldHeight"));
          if (jQuery("#" + this.config.el).hasClass("street-mode")) {
            jQuery("#" + this.config.el).resizable("destroy");
          }
          jQuery("#" + this.config.el).removeClass("street-mode");
          jQuery("#" + this.config.el).css({
            position: "relative"
          });
          this.onUpdateSize(this.get("width"), this.get("height"));
          this.addCustomControll(this.map);
      }
    },
    isMasterView: function() {
      return google.maps.MapMode.MAP === this.mode;
    },
    onUpdateScreenSize: function(width, height) {
      if (this.isMasterView()) {
        this.onUpdateSize(width, height);
      }
    },
    onScreenResolutionChanged: function() {
      var center;
      center = this.map.getCenter();
      google.maps.event.trigger(this.map, "resize");
      this.map.panTo(center);
    },
    onChangeMapZoomRange: function(zoomRange) {
      this.zoomRange = zoomRange;
    },
    onChangeMapZoom: function(zoomLevel) {
      if (zoomLevel === this.map.getZoom() || (isNaN(zoomLevel)) || zoomLevel === undefined) {
        return;
      }
      this.map.setZoom(zoomLevel);
    },
    onUpdateStyle: function(stylers) {
      if (stylers === undefined) {
        return;
      }
      this.map.setOptions({
        styles: stylers
      });
    },
    onUpdateSize: function(width, height) {
      var center;
      if (width === undefined || height === undefined) {
        return;
      }
      jQuery("#" + this.get("el")).width(width).height(height);
      this.set("width", width);
      this.set("height", height);
      center = this.map.getCenter();
      google.maps.event.trigger(this.map, "resize");
      this.map.panTo(center);
      this.map.setCenter(center);
    },
    onAddPlaces: function(place) {
      if (place.get("renderedOnMap") === true) {
        return;
      }
      this.addMarker(place, this.map);
      place.set("renderedOnMap", true);
    },
    getNewMarlerReference: function() {
      return this.map.getCenter();
    },
    isNewMarkerReferenceProvider: function() {
      return google.maps.MapMode.STREET !== this.mode;
    },
    onUpdatePlace: function(place) {
      this.updateMarker(place);
    },
    onRemovePlace: function(place) {
      this.removeMarker(place);
    },
    getContainer: function() {
      return this.map;
    },
    onChangeMapDragging: function(dragging) {
      this.map.setOptions({
        draggable: dragging
      });
    },
    onChangeMapDoubleClickZoom: function(clickZoom) {
      this.map.setOptions({
        disableDoubleClickZoom: !clickZoom
      });
    },
    onChangeMapScrollWellZoom: function(wellZoom) {
      this.map.setOptions({
        scrollwheel: wellZoom
      });
    },
    onUpdateZoomControl: function(enabled) {
      this.map.setOptions({
        zoomControl: enabled
      });
    },
    onUpdateZoomControlPosition: function(position) {
      this.map.setOptions({
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: position
        }
      });
    },
    onUpdateStreetViewControl: function(enabled) {
      this.map.setOptions({
        streetViewControl: enabled
      });
    },
    onUpdateStreetViewControlPosition: function(position) {
      this.map.setOptions({
        streetViewControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: position
        }
      });
    },
    onUpdatePanControl: function(enabled) {
      this.map.setOptions({
        panControl: enabled
      });
    },
    onUpdatePanControlPosition: function(position) {
      this.map.setOptions({
        panControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: position
        }
      });
    },
    onUpdateMapTypeControl: function(enabled) {
      this.map.setOptions({
        mapTypeControl: enabled
      });
    },
    onUpdateMapTypeControlPosition: function(position) {
      this.map.setOptions({
        mapTypeControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: position
        }
      });
    },
    onUpdateScaleControl: function(enabled) {
      this.map.setOptions({
        scaleControl: enabled
      });
    }
  });

}).call(this);
;(function() {
  Cetabo.StreetManager = Cetabo.MarkerManager.extend({
    initialize: function(config) {
      var channel;
      Cetabo.StreetManager.__super__.initialize.apply(this, arguments);
      this.config = config;
      channel = this.get("channel");
      Cetabo.EventDistpatcher.use(channel).on("place.add", this.onAddPlaces, this);
      Cetabo.EventDistpatcher.use(channel).on("place.remove", this.onRemovePlace, this);
      Cetabo.EventDistpatcher.use(channel).on("place.update", this.onUpdatePlace, this);
      Cetabo.EventDistpatcher.use(channel).on("map.created", this.onMapCreated, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatesize", this.onUpdateSize, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatemode", this.onChangeMode, this);
      Cetabo.EventDistpatcher.use(channel).on("street.updateposition", this.onChangePosition, this);
      Cetabo.EventDistpatcher.use(channel).on("street.updatepov", this.onChangePov, this);
      Cetabo.EventDistpatcher.use(channel).on("screen.updatesize", this.onUpdateScreenSize, this);
      Cetabo.EventDistpatcher.use(channel).on("screen.resized", this.onScreenResolutionChanged, this);
    },
    initStreet: function(streetCanvas) {
      var channel;
      this.streetViewService = new google.maps.StreetViewService();
      this.panorama = new google.maps.StreetViewPanorama(document.getElementById(streetCanvas), this.preparePanoramaOptions());
      this.panorama.getDiv = function() {
        return streetCanvas;
      };
      this.panorama.getCenter = function() {
        return this.getPosition();
      };
      channel = this.get("channel");
      google.maps.event.addListener(this.panorama, "position_changed", function() {
        var position;
        position = this.getPosition();
        if (position === undefined) {
          return;
        }
        Cetabo.EventDistpatcher.use(channel).trigger("street.updateposition", position.lat(), position.lng());
      });
      google.maps.event.addListener(this.panorama, "pov_changed", function() {
        Cetabo.EventDistpatcher.use(channel).trigger("street.updatepov", this.getPov());
      });
    },
    preparePanoramaOptions: function() {
      return {
        pov: {
          heading: 34,
          pitch: 10
        },
        addressControl: true,
        addressControlOptions: {
          style: {
            backgroundColor: "grey",
            color: "yellow"
          },
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      };
    },
    onChangeMode: function(mode) {
      var container, position;
      this.mode = mode;
      container = jQuery("#" + this.config.el);
      if (google.maps.MapMode.STREET === mode) {
        container.show();
        position = this.panorama.getPosition();
        this.verifyStreetViewAvailable(position);
        this.map.setStreetView(this.panorama);
        this.panorama.setVisible(true);
        this.onChangePosition(this.get("lat"), this.get("lng"));
        this.addCustomControll(this.panorama);
        this.focusToNearestStreetPositionIfRequired();
      } else {
        container.hide();
        jQuery("#" + this.config.errorEl).hide();
        this.map.setStreetView(null);
        this.map.getStreetView().setVisible(false);
        this.removeCustomControll();
      }
    },
    focusToNearestStreetPositionIfRequired: function() {
      var directionsService, homeLatlng, _parent;
      if (this.panorama.getPosition() !== undefined) {
        return;
      }
      _parent = this;
      homeLatlng = this.map.getCenter();
      directionsService = new google.maps.DirectionsService();
      return directionsService.route({
        origin: homeLatlng,
        destination: homeLatlng,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }, function(response, status) {
        var location;
        if (status !== google.maps.DirectionsStatus.OK) {
          return;
        }
        if (response === undefined || response.routes === undefined || response.routes[0] === undefined) {
          return;
        }
        if (response.routes[0] === undefined || response.routes[0].legs[0] === undefined || response.routes[0].legs[0].start_location === undefined) {
          return;
        }
        location = response.routes[0].legs[0].start_location;
        _parent.onChangePosition(location.lat(), location.lng());
      });
    },
    isMasterView: function() {
      return google.maps.MapMode.STREET === this.mode;
    },
    onUpdateScreenSize: function(width, height) {
      if (this.isMasterView()) {
        this.onUpdateSize(width, height);
      }
    },
    onScreenResolutionChanged: function() {
      google.maps.event.trigger(this.panorama, "resize");
    },
    verifyStreetViewAvailable: function(position) {
      var instance;
      instance = this;
      if (!this.isMasterView()) {
        return;
      }
      if (position === undefined) {
        jQuery("#" + instance.config.errorEl).show();
        return;
      }
      this.streetViewService.getPanoramaByLocation(position, 50, function(data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
          jQuery("#" + instance.config.errorEl).hide();
          return;
        }
        jQuery("#" + instance.config.errorEl).show();
      });
    },
    /*
    On change pegman position
    */

    onChangePosition: function(lat, lng) {
      var currentPosition, isSameValue, position;
      currentPosition = this.panorama.getPosition();
      isSameValue = currentPosition !== undefined && currentPosition.lat() === lat && currentPosition.lng() === lng;
      if (!(lat === undefined || lng === undefined || isSameValue)) {
        position = new google.maps.LatLng(lat, lng);
        this.panorama.setPosition(position);
      }
      this.verifyStreetViewAvailable(this.panorama.getPosition());
      this.set("lat", lat);
      this.set("lng", lng);
    },
    onChangePov: function(pov) {
      var currentPov, isSameValue;
      if (pov === undefined || pov.heading === undefined || pov.pitch === undefined) {
        return;
      }
      currentPov = this.panorama.getPov();
      isSameValue = currentPov !== undefined && currentPov.heading === pov.heading && currentPov.pitch === pov.pitch;
      if (isSameValue) {
        return;
      }
      currentPov.heading = parseFloat(pov.heading);
      currentPov.pitch = parseFloat(pov.pitch);
      this.panorama.setPov(currentPov);
      this.set("pov", currentPov);
    },
    onMapCreated: function(map) {
      this.map = map;
      this.initStreet(this.config.el);
    },
    onUpdateSize: function(width, height) {
      if (width === undefined || height === undefined) {
        return;
      }
      jQuery("#" + this.get("el")).width(width).height(height);
      google.maps.event.trigger(this.panorama, "resize");
    },
    onAddPlaces: function(place) {
      if (place.get("renderedOnStreet") === true) {
        return;
      }
      this.addMarker(place, this.panorama);
      place.set("renderedOnStreet", true);
    },
    getNewMarlerReference: function() {
      var refrence;
      refrence = this.panorama.getPosition();
      return google.maps.geometry.spherical.computeOffset(refrence, 10, this.panorama.getPov().heading);
    },
    isNewMarkerReferenceProvider: function() {
      return google.maps.MapMode.STREET === this.mode;
    },
    onUpdatePlace: function(place) {
      this.updateMarker(place);
    },
    onRemovePlace: function(place) {
      this.removeMarker(place);
    },
    getContainer: function() {
      return this.panorama;
    },
    isAllowingClustering: function() {
      return false;
    }
  });

}).call(this);
;(function() {
  Cetabo.DirectionManager = Cetabo.BaseManager.extend({
    trackingHandler: [],
    placeReference: [],
    MAX_ALLOWED_DIRECTION_PINS: 30,
    initialize: function(config) {
      this.config = config;
      this.canvas = config.canvas;
      this.channel = this.get("channel");
      Cetabo.EventDistpatcher.use(this.channel).on("map.created", this.onMapCreated, this);
      Cetabo.EventDistpatcher.use(this.channel).on("direction.show", this.calcRoute, this);
      Cetabo.EventDistpatcher.use(this.channel).on("direction.clean", this.cleanRoute, this);
      Cetabo.EventDistpatcher.use(this.channel).on("direction.track", this.trackCurrentLocation, this);
      Cetabo.EventDistpatcher.use(this.channel).on("direction.untrack", this.untrackCurrentLocation, this);
    },
    onMapCreated: function(map) {
      var rendererOptions;
      this.map = map;
      rendererOptions = {
        map: map,
        draggable: false
      };
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    },
    isValidRequest: function(routeArgs) {
      if (routeArgs === undefined || this.routeArgs === routeArgs || routeArgs.request === undefined || routeArgs.request.origin === "") {
        return false;
      }
      this.routeArgs = routeArgs;
      return true;
    },
    calcRoute: function(routeArgs) {
      var channel, instance;
      if (!this.isValidRequest(routeArgs)) {
        return;
      }
      instance = this;
      channel = this.channel;
      this.cleanMarkers();
      this.directionsService.route(routeArgs.request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          instance.directionsDisplay.setDirections(response);
          if (routeArgs.showSteps) {
            instance.showSteps(response);
          }
          if (response.routes[0].warnings.length !== 0) {
            Cetabo.EventDistpatcher.use(channel).trigger("direction.message", response.routes[0].warnings);
          }
        } else {
          Cetabo.EventDistpatcher.use(channel).trigger("direction.message", "There was a problem in computing the route.");
        }
      });
    },
    cleanRoute: function() {
      this.directionsDisplay.setDirections(response);
      this.showSteps([]);
    },
    cleanMarkers: function() {
      var channel, i, place;
      channel = this.channel;
      i = 0;
      while (i < this.placeReference.length) {
        place = this.placeReference[i];
        Cetabo.EventDistpatcher.use(channel).trigger("place.remove", place);
        i++;
      }
      this.markerArray = [];
    },
    showSteps: function(directionResult) {
      var MAX_ALLOWED_DIRECTION_PINS, channel, i, ident, myRoute, place, position, step, total;
      myRoute = directionResult.routes[0].legs[0];
      channel = this.channel;
      total = myRoute.steps.length;
      MAX_ALLOWED_DIRECTION_PINS = this.MAX_ALLOWED_DIRECTION_PINS;
      step = Math.floor((total < MAX_ALLOWED_DIRECTION_PINS ? 1 : total / MAX_ALLOWED_DIRECTION_PINS));
      i = 0;
      while (i < myRoute.steps.length) {
        if (i % step !== 0) {
          continue;
        }
        position = myRoute.steps[i].start_point;
        ident = "_dir" + Math.floor(Math.random() * 100000);
        place = new Cetabo.PlaceModel({
          id: ident,
          name: "",
          channel: channel,
          icon: this.config.baseURL + "media/images/cetabo_icons/pin_default_purple.png",
          lat: position.lat(),
          lng: position.lng(),
          details: myRoute.steps[i].instructions,
          locked: true,
          transient: true
        });
        Cetabo.EventDistpatcher.use(channel).trigger("place.add", place);
        Cetabo.EventDistpatcher.use(channel).trigger("place.update", place);
        this.placeReference.push(place);
        i++;
      }
    },
    isGeolocationSupportAvailable: function() {
      return navigator.geolocation;
    },
    trackCurrentLocation: function(interval) {
      if (!this.isGeolocationSupportAvailable()) {
        this.handleNoGeolocation();
        return;
      }
      this.refreshCurrentGeolocation(interval);
    },
    untrackCurrentLocation: function() {
      var i;
      i = 0;
      while (i < this.trackingHandler.length) {
        clearInterval(this.trackingHandler[i]);
        i++;
      }
      this.trackingHandler = [];
      if (this.currentLocationMarker !== undefined) {
        this.currentLocationMarker.setMap(null);
        this.currentLocationMarker = undefined;
      }
      if (this.currentLocationAccuracy !== undefined) {
        this.currentLocationAccuracy.setMap(null);
        this.currentLocationAccuracy = undefined;
      }
    },
    refreshCurrentGeolocation: function(interval) {
      var handler, instance;
      instance = this;
      handler = setInterval(function() {
        navigator.geolocation.getCurrentPosition((function(position) {
          instance.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          instance.coords = position.coords;
          instance.updateCurrentLocationMarker();
        }), function() {
          instance.handleNoGeolocation();
          instance.untrackCurrentLocation();
        });
      }, interval);
      this.trackingHandler.push(handler);
    },
    updateCurrentLocationMarker: function() {
      if (this.currentLocationMarker === undefined) {
        this.currentLocationAccuracy = new google.maps.Circle({
          strokeColor: "#5278F2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#52CCF2",
          fillOpacity: 0.35,
          map: this.map,
          center: this.currentLocation,
          radius: this.coords.accuracy
        });
        this.currentLocationMarker = new google.maps.Marker({
          position: this.currentLocation,
          map: this.map,
          icon: this.config.baseURL + "media/images/current_location.png"
        });
      } else {
        this.currentLocationMarker.setPosition(this.currentLocation);
        this.currentLocationAccuracy.setCenter(this.currentLocation);
        this.currentLocationAccuracy.setRadius(this.coords.accuracy);
      }
    },
    handleNoGeolocation: function() {
      var channel;
      channel = this.channel;
      Cetabo.EventDistpatcher.use(channel).trigger("direction.message", "Your browser doesn't support geolocation.");
    }
  });

}).call(this);
;(function() {
  Cetabo.BaseProvider = Backbone.Model.extend({
    invoke: function(callback) {
      callback();
    },
    /*
    Provide source data model
    */

    getDataModel: function() {
      var data, dataSet, i, result;
      result = [];
      dataSet = this.getData();
      i = 0;
      while (i < dataSet.length) {
        data = dataSet[i];
        result.push(data);
        i++;
      }
      return result;
    },
    /*
    Find custom value by a specified comaprator function
    */

    valueOf: function(comparator) {
      var dataSet, key;
      dataSet = this.getData();
      for (key in dataSet) {
        if (comparator(dataSet[key])) {
          return dataSet[key];
        }
      }
      return undefined;
    },
    getData: function() {
      return this.get("data");
    },
    setData: function(rawData) {
      this.set("data", rawData);
    },
    getDefault: function() {
      return 0;
    }
  });

}).call(this);
;(function() {
  Cetabo.DirectionTypeProviderModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var data;
      data = [
        {
          text: "DRIVING",
          id: google.maps.TravelMode.DRIVING,
          description: "Indicates standard driving directions using the road network."
        }, {
          text: "BICYCLING",
          id: google.maps.TravelMode.BICYCLING,
          description: "Requests bicycling directions via bicycle paths & preferred streets."
        }, {
          text: "TRANSIT",
          id: google.maps.TravelMode.TRANSIT,
          description: "Requests directions via public transit routes"
        }, {
          text: "WALKING",
          id: google.maps.TravelMode.WALKING,
          description: "Requests walking directions via pedestrian paths & sidewalks"
        }
      ];
      this.setData(data);
    }
  });

}).call(this);
;(function() {
  Cetabo.SidebarType = {
    NONE: 0,
    TAGS: 1,
    PLACES: 2,
    DIRECTION: 3
  };

  Cetabo.SidebarTypeProviderModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var data;
      data = [
        {
          text: "NONE",
          id: 0,
          description: "Noting is opened"
        }, {
          text: "TAGS",
          id: 1,
          description: "Show tags tab opened"
        }, {
          text: "PLACES",
          id: 2,
          description: "Show places tab opened"
        }, {
          text: "DIRECTION",
          id: 3,
          description: "Show direction tab opened"
        }
      ];
      this.setData(data);
    }
  });

}).call(this);
;(function() {
  Cetabo.PlaceModel = Backbone.Model.extend({
    initialize: function() {
      var channel;
      channel = this.get("channel");
      this.on("change:lat", function(model) {
        var lat;
        if (model === undefined) {
          return;
        }
        lat = model.get("lat");
        jQuery("#" + model.get("id") + " .lat").val(lat);
      });
      this.on("change:lng", function(model) {
        var lat;
        if (model === undefined) {
          return;
        }
        lat = model.get("lng");
        jQuery("#" + model.get("id") + " .lng").val(lat);
      });
      this.on("change:name", function(model) {
        if (model === undefined) {
          return;
        }
        Cetabo.EventDistpatcher.use(channel).trigger("place.update", this);
      });
      this.on("change:details", function(model) {
        if (model === undefined) {
          return;
        }
        Cetabo.EventDistpatcher.use(channel).trigger("place.update", this);
      });
    },
    toJSON: function() {
      return {
        id: this.get("_id"),
        name: this.get("name"),
        tags: this.get("tags"),
        lat: this.get("lat"),
        lng: this.get("lng"),
        icon: this.get("icon"),
        iconCustomName: this.get("iconCustomName"),
        iconCustomId: this.get("iconCustomId"),
        details: this.get("details"),
        animation: this.get("animation"),
        type: this.get("type")
      };
    },
    hasTag: function(tag) {
      var tags, _i, _len, _tag;
      if (this.get("tags") === undefined) {
        return false;
      }
      tags = (this.get("tags")).split(',');
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        _tag = tags[_i];
        if (String(_tag) === String(tag)) {
          return true;
        }
      }
      return false;
    },
    hasAnyOfTags: function(tags) {
      var _i, _len, _tag;
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        _tag = tags[_i];
        if (this.hasTag(_tag)) {
          return true;
        }
      }
      return false;
    },
    toGoogleMapsPoint: function() {
      return new google.maps.LatLng(this.get("lat"), this.get("lng"));
    },
    validate: function() {
      var fields, messages;
      messages = [];
      fields = [];
      if (!this.get("name")) {
        messages.push("Places > You must provide a name for place");
        fields.push("#" + this.get("id") + " .name");
      }
      if (!this.get("lat") || isNaN(this.get("lat"))) {
        messages.push("Places > Invalid place lat, must be a valid coordonate.");
        fields.push("#" + this.get("id") + " .lat");
      }
      if (!this.get("lng") || isNaN(this.get("lng"))) {
        messages.push("Places > Invalid place lng, must be a valid coordonate.");
        fields.push("#" + this.get("id") + " .lng");
      }
      if (messages.length !== 0) {
        fields.push(".header-" + this.get("id"));
      }
      return {
        messages: messages,
        fields: fields,
        hasError: messages.length !== 0
      };
    },
    isPassingCriteriaCheck: function(criteria) {
      var isPassing;
      isPassing = true;
      if ((criteria.tags != null) && criteria.tags.length > 0) {
        isPassing = isPassing && this.hasAnyOfTags(criteria.tags);
      }
      return isPassing;
    }
  });

}).call(this);
;(function() {
  Cetabo.StylerModel = Backbone.Model.extend({
    initialize: function() {
      if (this.get("visibility") == null) {
        this.set("visibility", "on");
      }
      if (this.get("stylers") == null) {
        this.set("stylers", []);
      }
    },
    isValid: function() {
      if (!this.isValidProperty("featureType")) {
        return false;
      }
      if (!this.isValidProperty("elementType")) {
        return false;
      }
      if (this.get("visibility") !== "off" && !this.isValidProperty("visibility")) {
        return false;
      }
      return true;
    },
    isValidProperty: function(attr) {
      var property;
      property = this.get(attr);
      return property !== undefined && !Cetabo.StringUtil.isEmpty(property);
    },
    toJSON: function() {
      return {
        featureType: this.get("featureType"),
        elementType: this.get("elementType"),
        stylers: this.get("stylers")
      };
    },
    getStyler: function(name) {
      var i, styler, stylers;
      stylers = this.get("stylers");
      i = 0;
      while (i < stylers.length) {
        styler = stylers[i];
        if (styler[name] !== undefined) {
          return styler[name];
        }
        i++;
      }
      return null;
    },
    setStyler: function(name, value) {
      var found, i, obj, styler, stylers;
      stylers = this.get("stylers");
      found = false;
      i = 0;
      while (i < stylers.length) {
        styler = stylers[i];
        if (styler[name] !== undefined) {
          styler[name] = value;
          found = true;
        }
        i++;
      }
      if (!found) {
        obj = {};
        obj[name] = value;
        stylers.push(obj);
      }
      this.set("stylers", stylers);
    },
    validate: function() {
      var fields, messages;
      messages = [];
      fields = [];
      if (!this.get("featureType")) {
        messages.push("Style > You must select feature");
        fields.push("#" + this.get("id") + " .feature-type");
      }
      if (!this.get("elementType")) {
        messages.push("Style > You must select element");
        fields.push("#" + this.get("id") + " .element-type");
      }
      if (messages.length !== 0) {
        fields.push(".header-" + this.get("id"));
      }
      return {
        messages: messages,
        fields: fields,
        hasError: messages.length !== 0
      };
    }
  });

}).call(this);
;(function() {
  google.maps.MapMode = {
    MAP: "1",
    STREET: "2",
    HYPERLAPSE: "3"
  };

}).call(this);
;(function() {
  Cetabo.MapModel = Backbone.Model.extend({
    initialize: function() {
      this.on("change:name", function(model) {
        var name;
        if (model === undefined) {
          return;
        }
        name = model.get("name");
        jQuery("#" + model.get("el") + " .name").val(name);
      });
      this.set("places", {});
      this.set("stylers", {});
    },
    toJSON: function() {
      return {
        id: this.get("id"),
        name: this.get("name"),
        lat: this.get("lat"),
        lng: this.get("lng"),
        zoom: this.get("zoom"),
        zoomrange: this.get("zoomrange"),
        width: this.get("width"),
        height: this.get("height"),
        type: this.get("type"),
        mode: this.get("mode"),
        dragging: this.get("dragging"),
        doubleclickzoom: this.get("doubleclickzoom"),
        scrollwellzoom: this.get("scrollwellzoom"),
        zoomcontrol: this.get("zoomcontrol"),
        zoomcontrolposition: this.get("zoomcontrolposition"),
        streetviewcontrol: this.get("streetviewcontrol"),
        streetviewcontrolposition: this.get("streetviewcontrolposition"),
        maptypecontrol: this.get("maptypecontrol"),
        maptypecontrolposition: this.get("maptypecontrolposition"),
        pancontrol: this.get("pancontrol"),
        pancontrolposition: this.get("pancontrolposition"),
        scalecontrol: this.get("scalecontrol"),
        streetlng: this.get("streetlng"),
        streetlat: this.get("streetlat"),
        heading: this.get("heading"),
        pitch: this.get("pitch"),
        enablefullscreen: this.get("enablefullscreen"),
        startfullscreen: this.get("startfullscreen"),
        enableaddressearch: this.get("enableaddressearch"),
        defaultsidebartab: this.get("defaultsidebartab"),
        enabledirection: this.get("enabledirection"),
        enabletags: this.get("enabletags"),
        enableplaces: this.get("enableplaces"),
        showsteps: this.get("showsteps"),
        overlayenable: this.get("overlayenable"),
        overlaymultiple: this.get("overlaymultiple"),
        places: this.collectionToJSON(this.get("places"), function(place) {
          return place.get("transient") !== true;
        }),
        stylers: this.collectionToJSON(this.get("stylers")),
        clustering: this.get("clustering")
      };
    },
    validate: function() {
      var fields, key, messages, placeValidation, places, stylerValidation, stylers;
      messages = [];
      fields = [];
      if (!this.get("name")) {
        messages.push("You must provide a name for map");
        fields.push(".top .name");
      }
      if (!this.get("width") || !/([0-9]+)(px|em|ex|%|in|cm|mm|pt|pc)/.test(this.get("width"))) {
        messages.push("Settings > Invalid map width, must be a valid width value in px or %.");
        fields.push(".width");
      }
      if (!this.get("height") || !/([0-9]+)(px|em|ex|%|in|cm|mm|pt|pc)/.test(this.get("height"))) {
        messages.push("Settings > Invalid map height, must be a valid width value in px or %.");
        fields.push(".height");
      }
      if (!this.get("lat") || isNaN(this.get("lat"))) {
        messages.push("Settings > Invalid map center lat, must be a valid coordonate.");
        fields.push(".lat");
      }
      if (!this.get("lng") || isNaN(this.get("lng"))) {
        messages.push("Settings > Invalid map center lng, must be a valid coordonate.");
        fields.push(".lng");
      }
      if (!this.get("type")) {
        messages.push("Settings > Invalid map type specified.");
        fields.push(".type");
      }
      places = this.get("places");
      for (key in places) {
        placeValidation = places[key].validate();
        if (places[key].get("transient") !== true && placeValidation.hasError) {
          messages = messages.concat(placeValidation.messages);
          fields = fields.concat(placeValidation.fields);
        }
      }
      stylers = this.get("stylers");
      for (key in stylers) {
        stylerValidation = stylers[key].validate();
        if (stylerValidation.hasError) {
          messages = messages.concat(stylerValidation.messages);
          fields = fields.concat(stylerValidation.fields);
        }
      }
      return {
        messages: messages,
        fields: fields,
        hasError: messages.length !== 0
      };
    },
    collectionToJSON: function(collection, callbackFilter) {
      var key, result;
      result = [];
      for (key in collection) {
        if (callbackFilter !== undefined && !callbackFilter(collection[key])) {
          continue;
        }
        result.push(collection[key].toJSON());
      }
      return result;
    },
    collectionToArray: function(collection, callbackFilter) {
      var key, result;
      result = [];
      for (key in collection) {
        if (callbackFilter !== undefined && !callbackFilter(collection[key])) {
          continue;
        }
        result.push(collection[key]);
      }
      return result;
    },
    addPlace: function(key, placeModel) {
      var places;
      places = this.get("places");
      places[key] = placeModel;
    },
    removePlace: function(key) {
      var places;
      places = this.get("places");
      delete places[key];
    },
    getPlaceById: function(key) {
      var places;
      places = this.get("places");
      return places[key];
    },
    /*
      Get place by specified attribute value
    */

    getPlaceKeysByAttribute: function(attribute, value) {
      var i, key, keys, place, places;
      keys = [];
      places = this.get("places");
      for (key in places) {
        place = places[key];
        if (!(value instanceof Array)) {
          if (place.get(attribute) === value) {
            keys.push(key);
          }
        } else {
          i = 0;
          while (i < value.length) {
            if (place.get(attribute) === value[i]) {
              keys.push(key);
            }
            i++;
          }
        }
      }
      return keys;
    },
    /*
     Get place by specified attribute value
    */

    getPlacesByAttribute: function(attribute, value) {
      var i, key, keys, places;
      places = {};
      keys = this.getPlaceKeysByAttribute(attribute, value);
      i = 0;
      while (i < keys.length) {
        key = keys[i];
        places[key] = this.getPlaceById(key);
        i++;
      }
      return places;
    },
    /*
      Get first place
    */

    getPlaceByAttribute: function(attribute, value) {
      var key, places;
      places = this.getPlacesByAttribute(attribute, value);
      for (key in places) {
        return places[key];
      }
      return undefined;
    },
    /*
      Remove place by attribute
    */

    removePlaceByAttribute: function(attribute, value) {
      var key;
      key = this.getPlaceKeysByAttribute(attribute, value);
      this.removePlace(key);
    },
    addStyler: function(key, syleModel) {
      var stylers;
      stylers = this.get("stylers");
      stylers[key] = syleModel;
    },
    removeStyler: function(key) {
      var stylers;
      stylers = this.get("stylers");
      delete stylers[key];
    },
    getStylerById: function(key) {
      var stylers;
      stylers = this.get("stylers");
      return stylers[key];
    },
    buildMapStyler: function() {
      var key, result, styler, stylers;
      result = [];
      stylers = this.get("stylers");
      for (key in stylers) {
        styler = stylers[key];
        if (!styler.isValid()) {
          continue;
        }
        result.push(styler.toJSON());
      }
      return result;
    },
    prepareModelState: function(data) {
      var map;
      map = data.map.configuration;
      map.id = data.map.id;
      return map;
    },
    load: function(data) {
      var key, modelState, value;
      modelState = this.prepareModelState(data);
      for (key in modelState) {
        value = modelState[key];
        if (Object.prototype.toString.call(value) === "[object Array]") {
          this.fillFromCollection(key, value);
        } else {
          this.set(key, this.convertValue(value));
        }
      }
    },
    convertValue: function(value) {
      if ("true" === value) {
        return true;
      }
      if ("false" === value) {
        return false;
      }
      return value;
    },
    fillFromCollection: function(type, collection) {
      var ident, key, place, styler, subModelState;
      this.set(type, {});
      for (key in collection) {
        subModelState = collection[key];
        if (Object.prototype.toString.call(subModelState) !== "[object Object]") {
          continue;
        }
        subModelState["channel"] = this.get("channel");
        ident = "ident" + Math.floor(Math.random() * 100000);
        switch (type) {
          case "places":
            if (subModelState["details"] !== undefined) {
              subModelState["details"] = subModelState["details"].replace(/\\/g, "");
            }
            place = new Cetabo.PlaceModel(subModelState);
            place.set("id", ident);
            this.addPlace(ident, place);
            break;
          case "stylers":
            styler = new Cetabo.StylerModel(subModelState);
            styler.set("id", ident);
            this.addStyler(ident, styler);
        }
      }
    },
    /*
    Fill stylers from theme
    @param theme
    */

    fillStylerModelFromTheme: function(theme) {
      var i, ident, styler, themeEntry;
      this.set("stylers", {});
      i = 0;
      while (i < theme.length) {
        themeEntry = theme[i];
        if (Object.prototype.toString.call(themeEntry) !== "[object Object]") {
          continue;
        }
        themeEntry["channel"] = this.get("channel");
        themeEntry["elementType"] = (themeEntry["elementType"] !== undefined ? themeEntry["elementType"] : "all");
        ident = "ident" + Math.floor(Math.random() * 100000);
        styler = new Cetabo.StylerModel(themeEntry);
        styler.set("id", ident);
        this.addStyler(ident, styler);
        i++;
      }
    },
    getStylersAsTheme: function() {
      return this.collectionToJSON(this.get("stylers"));
    },
    getMapTags: function() {
      var places, tags, _i, _len, _place, _ref;
      tags = [];
      places = this.get("places");
      if (places == null) {
        return [];
      }
      _ref = this.collectionToArray(places);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _place = _ref[_i];
        if ((_place.get("tags") != null) && _place.get("tags") !== '') {
          Cetabo.ArrayUtil.pushArray(tags, _place.get("tags").split(','));
        }
      }
      return Cetabo.ArrayUtil.asSet(tags);
    },
    getMapPlaces: function() {
      var places;
      places = this.get("places");
      return this.collectionToArray(places, function(place) {
        return place.get("transient") !== true;
      });
    }
  });

}).call(this);
;(function() {
  Cetabo.BaseView = Backbone.View.extend({
    /*
    Get container DOM element id
    */

    getElId: function() {
      return this.enforceELId(this.$el);
    },
    enforceELId: function($expr) {
      if ($expr.attr("id") === undefined) {
        $expr.attr("id", "_elm_" + Math.floor(Math.random() * 100000));
      }
      return $expr.attr("id");
    },
    getChannel: function() {
      if (this.channel === undefined) {
        this.channel = "chn" + Math.floor(Math.random() * 100000);
      }
      return this.channel;
    },
    find: function(selector) {
      return jQuery(this.findIdent(selector));
    },
    findParent: function(selector) {
      return jQuery("#" + this.getElId()).closest(selector);
    },
    findIdent: function(selector) {
      return "#" + this.getElId() + " " + selector;
    }
  });

}).call(this);
;(function() {
  Cetabo.TagsTabView = Cetabo.BaseView.extend({
    events: {
      "click .place-tag": "filterPlaces"
    },
    initialize: function(config) {
      this.config = config;
      this.model = config.model;
      this.channel = config.channel;
      this.tags = [];
      Cetabo.EventDistpatcher.use(this.channel).on("map.load", this.onLoadMapCallback, this);
      Cetabo.EventDistpatcher.use(this.channel).on("place.updateTag", this.onUpdatePlaceTag, this);
    },
    onUpdatePlaceTag: function(place) {
      this.resetTagSelection();
      this.onLoadMapCallback(this.model);
    },
    resetTagSelection: function() {
      this.tags = [];
      this.find('.place-tag').removeClass('active');
      Cetabo.EventDistpatcher.use(this.channel).trigger("place.filter", {
        tags: this.tags
      });
    },
    onLoadMapCallback: function(model) {
      var html, tags, template;
      tags = model.getMapTags();
      template = Cetabo.TemplateManager.getTemplateByName("#template-tags");
      html = template({
        'tags': tags
      });
      this.find('').html(html);
      this.delegateEvents();
    },
    filterPlaces: function(event) {
      var target;
      target = event.currentTarget;
      this.fillCriteria(target);
      this.setActiveTag(target);
      Cetabo.EventDistpatcher.use(this.channel).trigger("place.filter", {
        tags: this.tags
      });
      return false;
    },
    fillCriteria: function(target) {
      var active, index, tagName;
      tagName = jQuery(target).data('tag');
      active = this.isActiveTag(target);
      if (!active) {
        this.tags.push(tagName);
      } else {
        index = this.tags.indexOf(tagName);
        if (index > -1) {
          this.tags.splice(index, 1);
        }
      }
    },
    isActiveTag: function(target) {
      return jQuery(target).hasClass('active-tag');
    },
    setActiveTag: function(target) {
      if (this.isActiveTag(target)) {
        jQuery(target).removeClass('active-tag');
      } else {
        jQuery(target).addClass('active-tag');
      }
    }
  });

}).call(this);
;(function() {
  Cetabo.PlacesTabView = Cetabo.BaseView.extend({
    events: {
      "click .place-ident": "focusPlace"
    },
    initialize: function(config) {
      this.config = config;
      this.model = config.model;
      this.channel = config.channel;
      Cetabo.EventDistpatcher.use(this.channel).on("map.load", this.onLoadMapCallback, this);
      Cetabo.EventDistpatcher.use(this.channel).on("place.filter", this.onPlaceFilter, this);
      Cetabo.EventDistpatcher.use(this.channel).on("place.remove", this.onRemovePlace, this);
      Cetabo.EventDistpatcher.use(this.channel).on("place.update", this.onUpdatePlace, this);
    },
    onRemovePlace: function(place) {
      var places;
      places = this.model.getMapPlaces();
      places.pop(place);
      this.refreshPlaces(places);
    },
    onUpdatePlace: function(place) {
      var places, visiblePlaces, _i, _len, _place;
      places = this.model.getMapPlaces();
      if (this.isStepPlace(place)) {
        places.push(place);
      }
      visiblePlaces = [];
      for (_i = 0, _len = places.length; _i < _len; _i++) {
        _place = places[_i];
        if (this.isPlaceNameNotEmpty(_place)) {
          visiblePlaces.push(_place);
        }
      }
      this.refreshPlaces(visiblePlaces);
    },
    isPlaceNameNotEmpty: function(place) {
      if (place.get("name") !== undefined && place.get("name").trim().length > 0) {
        return true;
      }
    },
    isStepPlace: function(place) {
      return place.get("transient") === true;
    },
    onLoadMapCallback: function(model) {
      this.refreshPlaces(model.getMapPlaces());
    },
    onPlaceFilter: function(criteria) {
      var places, visiblePlaces, _i, _len, _place;
      places = this.model.getMapPlaces();
      visiblePlaces = [];
      for (_i = 0, _len = places.length; _i < _len; _i++) {
        _place = places[_i];
        if (_place.isPassingCriteriaCheck(criteria) && this.isPlaceNameNotEmpty(_place)) {
          visiblePlaces.push(_place);
        }
      }
      this.refreshPlaces(visiblePlaces);
    },
    refreshPlaces: function(places) {
      var html, template;
      template = Cetabo.TemplateManager.getTemplateByName("#template-places");
      html = template({
        'places': places
      });
      this.find('').html(html);
      this.delegateEvents();
    },
    focusPlace: function(event) {
      var place, placeId, target;
      target = event.currentTarget;
      placeId = this.resolvePlace(target);
      place = this.model.getPlaceById(placeId);
      Cetabo.EventDistpatcher.use(this.channel).trigger("place.focus", place);
      return false;
    },
    resolvePlace: function(target) {
      return jQuery(target).data('place');
    }
  });

}).call(this);
;(function() {
  Cetabo.DirectionTabView = Cetabo.PlacesTabView.extend({
    events: function() {
      return _.extend({}, Cetabo.PlacesTabView.prototype.events, {
        "click .calculate-route": "calculateRoute",
        "click .direction-type": "selectDirectionType"
      });
    },
    initialize: function(config) {
      var channel;
      this.config = config;
      this.model = config.model;
      this.channel = config.channel;
      this.travelMode = "DRIVING";
      this.initUIControll();
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).on("place.add", this.onAddPlaces, this);
      Cetabo.EventDistpatcher.use(channel).on("place.remove", this.onRemovePlace, this);
      Cetabo.EventDistpatcher.use(channel).on("place.update", this.onUpdatePlace, this);
      Cetabo.EventDistpatcher.use(channel).on("direction.message", this.onDirectionMessage, this);
      Cetabo.EventDistpatcher.use(channel).on("direction.stateupdate", this.onDirectionButtonStateUpdate, this);
      Cetabo.EventDistpatcher.use(channel).on("map.load", this.onLoadMap, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatemode", this.onChangeMode, this);
    },
    initUIControll: function() {
      this.initAddressPicker();
      this.initPlaceSelector();
      this.initTravelModeSelector();
      this.initNotificationManager();
    },
    initNotificationManager: function() {
      var channel;
      channel = this.getChannel();
      this.notificationsManager = new Cetabo.NotificationsManager({
        channel: channel + "_private",
        el: this.find('.message')
      });
    },
    initPlaceSelector: function() {
      var instance;
      instance = this;
      this.find(' .destination').change(function() {
        instance.calculateRoute();
      });
    },
    initTravelModeSelector: function() {
      var instance;
      instance = this;
      this.find(".travel-bar input[name='travel_mode']").change(function() {
        instance.calculateRoute();
      });
    },
    initAddressPicker: function() {
      var instance, uiAutoData;
      instance = this;
      this.addresspicker = this.find('.origin').addresspicker({
        updateCallback: function(geocodeResult, parsedGeocodeResult) {
          instance.calculateRoute();
        }
      });
      uiAutoData = this.find('.origin').data("ui-autocomplete");
      if (uiAutoData != null) {
        jQuery("#" + uiAutoData.menu.activeMenu.context.id).addClass("cmap-autocompleate-result");
      }
    },
    calculateRoute: function() {
      var channel, destination, directionConfig, origin, token;
      channel = this.getChannel();
      if (this.find('.destination').val() === null) {
        return;
      }
      token = this.find('.destination').val().split("|");
      destination = new google.maps.LatLng(token[0], token[1]);
      origin = this.find('.origin').val();
      directionConfig = {
        request: {
          origin: origin,
          destination: destination,
          travelMode: this.travelMode
        },
        showSteps: this.model.get("showsteps")
      };
      Cetabo.EventDistpatcher.use(channel).trigger("direction.show", directionConfig);
    },
    selectDirectionType: function(event) {
      var target;
      target = event.currentTarget;
      this.travelMode = jQuery(target).data('type');
      this.find('.active').removeClass('active');
      jQuery(target).addClass('active');
    },
    updatePlaceSelector: function(model) {
      var contentHTML, key, place, places;
      contentHTML = "";
      places = model.get("places");
      for (key in places) {
        place = places[key];
        if (this.isStepPlace(place)) {
          continue;
        }
        contentHTML += "<option value='" + place.get("lat") + "|" + place.get("lng") + "'>" + place.get("name") + "</option>";
      }
      this.find('.destination').html(contentHTML);
    },
    isStepPlace: function(place) {
      return place.get("transient") === true;
    },
    onAddPlaces: function(place) {
      this.model.addPlace(place.get("id"), place);
      this.onModelUpdate();
    },
    onRemovePlace: function(place) {
      this.model.removePlace(place.get("id"));
      this.onModelUpdate();
    },
    onUpdatePlace: function(place) {
      this.onModelUpdate();
      if (!this.isStepPlace(place)) {
        this.calculateRoute();
      }
    },
    onModelUpdate: function() {
      var model;
      model = this.model;
      this.updatePlaceSelector(model);
      this.updateStepPlaceList(model);
    },
    onDirectionMessage: function(message) {
      Cetabo.EventDistpatcher.use(this.getChannel() + "_private").trigger("notification.show", message);
    },
    onLoadMap: function(model) {
      if (model.get("tracking") === true) {
        Cetabo.EventDistpatcher.use(this.channel).trigger("direction.track", model.get("trackinginterval"));
      } else {
        Cetabo.EventDistpatcher.use(this.channel).trigger("direction.untrack");
      }
    },
    onDirectionStateUpdate: function() {
      var model;
      model = this.model;
      this.onLoadMap(model);
      this.calculateRoute();
    },
    updateStepPlaceList: function(model) {
      var contentHTML, directionPlaces, html, key, place, places, template;
      contentHTML = "";
      places = model.get("places");
      directionPlaces = [];
      for (key in places) {
        place = places[key];
        if (!this.isStepPlace(place)) {
          continue;
        }
        directionPlaces.push(place);
      }
      template = Cetabo.TemplateManager.getTemplateByName("#template-steps");
      html = template({
        'places': directionPlaces
      });
      this.find('.steps').html(html);
    }
  });

}).call(this);
;(function() {
  Cetabo.SidebarView = Cetabo.BaseView.extend({
    events: {
      "click .cmap-close-sidebar": "closeSidebar",
      "click .tabs-left a": "openSidebar"
    },
    initialize: function(config) {
      this.config = config;
      this.model = config.model;
      this.channel = config.channel;
      this.visibleTabs = [];
      this.tabs = [];
      Cetabo.EventDistpatcher.use(this.channel).on("screen.resized", this.onScreenResolutionChanged, this);
      Cetabo.EventDistpatcher.use(this.channel).on("screen.updatesize", this.onScreenResolutionChanged, this);
      Cetabo.EventDistpatcher.use(this.channel).on("map.loaded", this.onScreenResolutionChanged, this);
      Cetabo.EventDistpatcher.use(this.channel).on("map.load", this.onLoadMap, this);
      Cetabo.EventDistpatcher.use(this.channel).on("direction.stateupdate", this.onDirectionButtonStateUpdate, this);
      Cetabo.EventDistpatcher.use(this.channel).on("tags.stateupdate", this.onTagsButtonStateUpdate, this);
      Cetabo.EventDistpatcher.use(this.channel).on("places.stateupdate", this.onPlacesButtonStateUpdate, this);
      this.initUIControll();
    },
    initUIControll: function() {
      this.inintTagsTab();
      this.initSidebarMenuAction();
      this.inintPlacesTab();
      this.initDirectionTab();
      this.initSlimScroll();
    },
    onLoadMap: function(model) {
      var defaultOpendTab;
      defaultOpendTab = parseInt(model.get('defaultsidebartab'));
      switch (defaultOpendTab) {
        case Cetabo.SidebarType.DIRECTION:
          this.openSidebarMenu();
          this.openSidebarTab('direction');
          this.onDirectionButtonStateUpdate(true);
          break;
        case Cetabo.SidebarType.PLACES:
          this.openSidebarMenu();
          this.openSidebarTab('places');
          this.onPlacesButtonStateUpdate(true);
          break;
        case Cetabo.SidebarType.TAGS:
          this.openSidebarMenu();
          this.openSidebarTab('tags');
          this.onTagsButtonStateUpdate(true);
      }
    },
    onDirectionButtonStateUpdate: function(enabled) {
      var element;
      element = this.find('.c-direction');
      this.visibleTabs['.c-direction'] = enabled;
      this.updateTabButtonState(element, enabled);
      this.updateMenuButtonState();
    },
    onTagsButtonStateUpdate: function(enabled) {
      var element;
      element = this.find('.c-tags').show();
      this.visibleTabs['.c-tags'] = enabled;
      this.updateTabButtonState(element, enabled);
      this.updateMenuButtonState();
    },
    onPlacesButtonStateUpdate: function(enabled) {
      var element;
      element = this.find('.c-places').show();
      this.visibleTabs['.c-places'] = enabled;
      this.updateTabButtonState(element, enabled);
      this.updateMenuButtonState();
    },
    updateTabButtonState: function(element, state) {
      var boundedTab;
      boundedTab = jQuery('#' + (element.data('bound')));
      if (state) {
        element.show();
      } else {
        element.hide();
        boundedTab.removeClass('active');
      }
    },
    updateMenuButtonState: function() {
      if (!this.isAnyTabVisible()) {
        jQuery(this.config.sidebarTrigger).hide();
      } else {
        jQuery(this.config.sidebarTrigger).show();
      }
    },
    isAnyTabVisible: function() {
      var key, visible;
      visible = false;
      for (key in this.visibleTabs) {
        if (typeof this.visibleTabs[key] !== 'function') {
          visible = visible || this.visibleTabs[key];
        }
      }
      return visible;
    },
    onScreenResolutionChanged: function() {
      this.updateSlimScroll(this.findParent('.cmap-container').height() - 90);
    },
    initSlimScroll: function() {
      this.find('.cmap-sidebar-content-inside').each(function() {
        jQuery(this).niceScroll();
      });
      this.onScreenResolutionChanged();
    },
    updateSlimScroll: function(containerHeight) {
      this.find('.cmap-sidebar-content-inside').each(function() {
        jQuery(this).height(containerHeight);
      });
    },
    initSidebarMenuAction: function() {
      var sidebarMenuButton, _parent;
      _parent = this;
      sidebarMenuButton = jQuery(this.config.sidebarTrigger);
      sidebarMenuButton.on('click', function() {
        _parent.togleSidebar();
      });
    },
    togleSidebar: function() {
      var isOpened;
      isOpened = this.$el.hasClass("cmap-sidebar-open");
      if (isOpened) {
        this.closeSidebar();
      } else {
        this.openSidebarMenu();
      }
    },
    closeSidebar: function() {
      this.closeSidebarMenu();
      this.closeSidebarContent();
    },
    closeSidebarMenu: function() {
      var sidebarMenuButton;
      this.find('').removeClass("cmap-sidebar-open");
      this.find('.nav-tabs .active').removeClass("active");
      sidebarMenuButton = jQuery(this.config.sidebarTrigger);
      sidebarMenuButton.removeClass("cmap-trigger-active");
    },
    closeSidebarContent: function() {
      if (this.find(".cmap-sidebar-content") != null) {
        this.find(".cmap-sidebar-content").hide();
      }
      this.find('.active').removeClass('active');
    },
    openSidebarMenu: function() {
      var sidebarMenuButton;
      this.find('').addClass("cmap-sidebar-open");
      this.find('.nav-tabs .active').addClass("active");
      sidebarMenuButton = jQuery(this.config.sidebarTrigger);
      sidebarMenuButton.addClass("cmap-trigger-active");
    },
    openSidebarTab: function(tab) {
      this.openSidebar();
      if (tab != null) {
        this.find('.ctab-' + tab).addClass('active');
      }
      if (tab != null) {
        this.find('.c-' + tab).addClass('active');
      }
    },
    openSidebar: function() {
      this.find('.cmap-sidebar-content').show();
    },
    inintPlacesTab: function() {
      this.tabs['places'] = new Cetabo.PlacesTabView(this.getSidebarConfiguration('.pins'));
    },
    inintTagsTab: function() {
      this.tabs['tags'] = new Cetabo.TagsTabView(this.getSidebarConfiguration('.tags'));
    },
    initDirectionTab: function() {
      this.tabs['direction'] = new Cetabo.DirectionTabView(this.getSidebarConfiguration('.mapdirection'));
    },
    getSidebarConfiguration: function(tab) {
      return {
        el: "#" + this.enforceELId(this.find(tab)),
        channel: this.getChannel(),
        model: this.model
      };
    }
  });

}).call(this);
;(function() {
  Cetabo.SearchView = Cetabo.BaseView.extend({
    events: {
      "click .cmap-search-submit": "toggleSearch"
    },
    searchOpen: false,
    initialize: function(config) {
      var channel, searchButton, searchInput, uiAutoData;
      this.config = config;
      this.model = config.model;
      this.channel = config.channel;
      channel = this.getChannel();
      searchButton = this.find(".cmap-search-submit");
      searchInput = this.find(".cmap-search-input");
      this.searchAddresSearchPicker = searchInput.addresspicker({
        updateCallback: function(geocodeResult, parsedGeocodeResult) {
          Cetabo.EventDistpatcher.use(channel).trigger("map.updatecenter", parsedGeocodeResult.lat, parsedGeocodeResult.lng);
          Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoom", 10);
        }
      });
      uiAutoData = searchInput.data("ui-autocomplete");
      if (uiAutoData != null) {
        jQuery("#" + uiAutoData.menu.activeMenu.context.id).addClass("cmap-autocompleate-result");
      }
    },
    openSearch: function() {
      this.$el.addClass('cmap-show-search');
    },
    closeSearch: function() {
      this.$el.removeClass('cmap-show-search');
    },
    toggleSearch: function() {
      this.searchOpen = !this.searchOpen;
      if (this.searchOpen) {
        this.openSearch();
      } else {
        this.closeSearch();
      }
    }
  });

}).call(this);
;/*
Provide functionality to toggle full screen
*/


(function() {
  Cetabo.FullscreenView = Cetabo.BaseView.extend({
    events: {
      "click .cmap-fullscreen": "toggleFullscreen"
    },
    isFullscreen: false,
    bodyState: [],
    tempPlaceHolder: jQuery("<div class=\"__tempPlaceHolder\"></div>"),
    $win: jQuery(window),
    initialize: function(config) {
      this.config = config;
      this.initFullscreenObserver();
    },
    resizeFullscreen: function() {
      var $html, containerId, size;
      containerId = "#" + this.getElId();
      $html = jQuery("html");
      $html.css({
        overflow: "hidden"
      });
      size = this.getFullscreenSize();
      jQuery(containerId).addClass("cmap-container-fullscreen");
      jQuery(containerId).css({
        position: "fixed",
        width: size.width,
        height: size.height,
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000010
      });
      this.tempPlaceHolder.insertBefore(containerId);
      jQuery(containerId).appendTo("body");
      jQuery("html").css("overflow", "hidden");
      jQuery("body").css("overflow", "hidden");
      this.onResizeFullscreen(size.width, size.height);
    },
    getFullscreenSize: function() {
      var isiOS, result, winHeight, winWidth;
      winWidth = this.$win.width();
      winHeight = this.$win.height();
      isiOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
      if (isiOS) {
        winHeight = this.getIOSWindowHeight();
      }
      result = {
        width: winWidth,
        height: winHeight
      };
      return result;
    },
    getIOSWindowHeight: function() {
      var zoomLevel;
      zoomLevel = document.documentElement.clientWidth / window.innerWidth;
      return window.innerHeight * zoomLevel;
    },
    getHeightOfIOSToolbars: function() {
      var tH;
      tH = (window.orientation === 0 ? screen.height : screen.width) - this.getIOSWindowHeight();
      return (tH > 1 ? tH : 0);
    },
    initOnResize: function() {
      var containerId, size;
      size = this.getFullscreenSize();
      containerId = "#" + this.getElId();
      jQuery(containerId).css({
        width: size.width,
        height: size.height
      });
      this.onResizeFullscreen(size.width, size.height);
    },
    resizeToDefault: function() {
      var containerId, size, tempHolder;
      containerId = "#" + this.getElId();
      size = this.getOriginalSize();
      tempHolder = jQuery(".__tempPlaceHolder");
      jQuery("html").removeAttr("style");
      jQuery(containerId).removeClass("cmap-container-fullscreen");
      jQuery(containerId).css({
        position: "relative",
        width: size.width,
        height: size.height,
        zIndex: 10
      });
      this.onResizeOriginalSize(size.width, size.height);
      tempHolder.replaceWith(jQuery(containerId));
    },
    initFullscreenObserver: function() {
      var instance;
      instance = this;
      jQuery(window).resize(function() {
        if (instance.isFullscreen) {
          instance.initOnResize();
        }
      });
    },
    toggleFullscreen: function() {
      this.setFullscreen(!this.isFullscreen);
    },
    setFullscreen: function(fullscreen) {
      this.isFullscreen = fullscreen;
      if (fullscreen) {
        this.resizeFullscreen();
        this.find('.cmap-fullscreen').addClass("cmap-is-fullscreen");
      } else {
        this.resizeToDefault();
        this.find('.cmap-fullscreen').removeClass("cmap-is-fullscreen");
      }
    },
    onResizeOriginalSize: function() {},
    onResizeFullscreen: function() {}
  });

}).call(this);
;/*
Provide functionality to load and display map
*/


(function() {
  Cetabo.MapView = Cetabo.FullscreenView.extend({
    initialize: function(config) {
      var channel;
      Cetabo.MapView.__super__.initialize.apply(this, arguments);
      this.config = config;
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).on("map.load", this.onLoadMapCallback, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatesize", this.onUpdateMapSize, this);
      Cetabo.EventDistpatcher.use(channel).on("map.updatemode", this.onChangeMode, this);
      Cetabo.EventDistpatcher.use(channel).on("screen.resized", this.onScreenResolutionChanged, this);
      Cetabo.EventDistpatcher.use(channel).on("screen.stateupdate", this.onUpdateFullscreen, this);
      Cetabo.EventDistpatcher.use(channel).on("view.updatefullscreen", this.onEnableFullscreen, this);
      Cetabo.EventDistpatcher.use(channel).on("view.updatesearch", this.onEnableSearch, this);
      this.initConnection(config.url.load);
      this.initModel();
      this.initDirectionManager();
      this.initStreetManager();
      this.initMapManager();
      this.initSidebarView();
      this.initSearchView();
      this.initScreenResizeEvent();
    },
    initScreenResizeEvent: function() {
      var channel;
      channel = this.getChannel();
      jQuery(window).resize(function() {
        Cetabo.EventDistpatcher.use(channel).trigger("screen.resized");
      });
    },
    /*
    Create ajax connector
    */

    initConnection: function() {
      var channel;
      channel = this.getChannel();
      this.connectionManager = new Cetabo.ConnectionManager({
        channel: channel
      });
    },
    initSidebarView: function() {
      this.sidebarView = new Cetabo.SidebarView(this.getSidebarConfiguration());
    },
    getSidebarConfiguration: function() {
      return {
        el: "#" + this.enforceELId(this.find(".cmap-sidebar")),
        sidebarTrigger: this.find('.cmap-sidebar-trigger'),
        channel: this.getChannel(),
        model: this.model
      };
    },
    initSearchView: function() {
      this.sidebarView = new Cetabo.SearchView(this.getSearchConfiguration());
    },
    getSearchConfiguration: function() {
      return {
        el: "#" + this.enforceELId(this.find(".cmap-search")),
        channel: this.getChannel(),
        model: this.model
      };
    },
    /*
    Init model
    */

    initModel: function() {
      this.model = new Cetabo.MapModel(this.getDefaultModelState());
    },
    getDefaultModelState: function() {
      var channel;
      channel = this.getChannel();
      return {
        readonly: this.isReadOnly(),
        channel: channel
      };
    },
    /*
    Init map manager
    */

    initMapManager: function() {
      var configuration;
      configuration = this.getMapConfiguration();
      this.mapManager = new Cetabo.MapManager(configuration);
    },
    /*
    Holds the map configuration, override this for custom configurations in
    descendent classes
    */

    getMapConfiguration: function() {
      var mapCanvas;
      mapCanvas = this.enforceELId(this.find(".map-canvas"));
      return {
        el: mapCanvas,
        readonly: this.isReadOnly(),
        channel: this.getChannel(),
        baseURL: this.config.baseURL,
        scaleControl: this.model.get("scalecontrol")
      };
    },
    initStreetManager: function() {
      var configuration;
      configuration = this.getStreetConfiguration();
      this.streetManager = new Cetabo.StreetManager(configuration);
    },
    getStreetConfiguration: function() {
      var errorCanvas, streetCanvas;
      streetCanvas = this.enforceELId(this.find(".street-canvas"));
      errorCanvas = this.enforceELId(this.find(".street-canvas-error"));
      return {
        el: streetCanvas,
        errorEl: errorCanvas,
        readonly: this.isReadOnly(),
        channel: this.getChannel(),
        baseURL: this.config.baseURL
      };
    },
    /*
    Init map manager
    */

    initDirectionManager: function() {
      var configuration;
      configuration = this.getDirectionConfiguration();
      this.directionManger = new Cetabo.DirectionManager(configuration);
    },
    /*
    Holds the map configuration, override this for custom configurations in
    descendent classes
    */

    getDirectionConfiguration: function() {
      return {
        canvas: this.getElId(),
        readonly: this.isReadOnly(),
        channel: this.getChannel(),
        baseURL: this.config.baseURL
      };
    },
    getConfiguration: function() {
      return this.config;
    },
    isReadOnly: function() {
      return true;
    },
    /*
    Load map with specified id
    */

    loadModel: function(id) {
      var channel, instance;
      instance = this;
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("backend.send", {
        content: {
          id: id
        },
        url: this.getLoadURL(),
        callback: {
          success: function(data) {
            instance.model.load(data);
            Cetabo.EventDistpatcher.use(channel).trigger("map.load", instance.model);
          }
        }
      });
    },
    getLoadURL: function() {
      return this.getConfiguration().url.load;
    },
    onLoadMapCallback: function(model) {
      var channel, key, places;
      channel = this.getChannel();
      places = model.get("places");
      for (key in places) {
        Cetabo.EventDistpatcher.use(channel).trigger("place.add", places[key]);
        Cetabo.EventDistpatcher.use(channel).trigger("place.update", places[key]);
      }
      Cetabo.EventDistpatcher.use(channel).trigger("styler.update", model.buildMapStyler());
      if (this.isReadOnly()) {
        Cetabo.EventDistpatcher.use(channel).trigger("map.updatesize", model.get("width"), model.get("height"));
      }
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoom", parseInt(model.get("zoom")));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatedragging", model.get("dragging"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatedoubleclickzoom", model.get("doubleclickzoom"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatescrollwellzoom", model.get("scrollwellzoom"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoomcontrol", model.get("zoomcontrol"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoomcontrolposition", model.get("zoomcontrolposition"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatestreetviewcontrol", model.get("streetviewcontrol"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatestreetviewcontrolposition", model.get("streetviewcontrolposition"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatepancontrol", model.get("pancontrol"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatepancontrolposition", model.get("pancontrolposition"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatemaptypecontrol", model.get("maptypecontrol"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatemaptypecontrolposition", model.get("maptypecontrolposition"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatescalecontrol", model.get("scalecontrol"));
      Cetabo.EventDistpatcher.use(channel).trigger("direction.stateupdate", model.get("enabledirection"));
      Cetabo.EventDistpatcher.use(channel).trigger("tags.stateupdate", model.get("enabletags"));
      Cetabo.EventDistpatcher.use(channel).trigger("places.stateupdate", model.get("enableplaces"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoomrange", model.get("zoomrange"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatecenter", model.get("lat"), model.get("lng"));
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatetype", model.get("type"));
      Cetabo.EventDistpatcher.use(channel).trigger("street.updateposition", model.get("streetlat"), model.get("streetlng"));
      Cetabo.EventDistpatcher.use(channel).trigger("street.updatepov", {
        heading: model.get("heading"),
        pitch: model.get("pitch")
      });
      Cetabo.EventDistpatcher.use(channel).trigger("map.updatemode", model.get("mode"));
      Cetabo.EventDistpatcher.use(channel).trigger("place.cluster", model.get("clustering"));
      Cetabo.EventDistpatcher.use(channel).trigger("overlay.updated", model);
      if (this.isReadOnly()) {
        Cetabo.EventDistpatcher.use(channel).trigger("screen.stateupdate", model.get('startfullscreen'));
      }
      Cetabo.EventDistpatcher.use(channel).trigger("view.updatefullscreen", model.get('enablefullscreen'));
      Cetabo.EventDistpatcher.use(channel).trigger("view.updatesearch", model.get('enableaddressearch'));
      Cetabo.EventDistpatcher.use(channel).trigger("map.loaded");
    },
    onResizeFullscreen: function(width, height) {
      var channel;
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("screen.updatesize", width, height);
    },
    getOriginalSize: function() {
      return {
        width: this.model.get("width"),
        height: this.model.get("height")
      };
    },
    onResizeOriginalSize: function(width, height) {
      var channel;
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("screen.updatesize", width, height);
    },
    onUpdateMapSize: function(width, height) {
      if (this.isReadOnly()) {
        jQuery("#" + this.getElId()).width(width).height(height);
      }
    },
    onScreenResolutionChanged: function() {
      this.toggleSidebarMode();
    },
    onChangeMode: function() {
      this.toggleSidebarMode();
    },
    toggleSidebarMode: function() {
      var canvas, isStreetMode, width;
      canvas = (this.isReadOnly() ? this.findParent(".cmap-container") : this.find(".cmap-container"));
      isStreetMode = this.model.get('mode') === google.maps.MapMode.STREET;
      width = this.find(".map-canvas").width();
      if (width < 480 || isStreetMode) {
        canvas.addClass("cmap-mob-wrap");
      } else {
        canvas.removeClass("cmap-mob-wrap");
      }
    },
    onUpdateFullscreen: function(fullscreen) {
      this.setFullscreen(fullscreen);
    },
    onEnableFullscreen: function(enabled) {
      if (enabled) {
        this.find('.cmap-fullscreen').show();
      } else {
        this.find('.cmap-fullscreen').hide();
      }
    },
    onEnableSearch: function(enabled) {
      if (enabled) {
        this.find('.cmap-search').show();
      } else {
        this.find('.cmap-search').hide();
      }
    },
    setFullscreen: function(fullscreen) {
      if (this.isReadOnly()) {
        Cetabo.MapView.__super__.setFullscreen.apply(this, arguments);
      }
    }
  });

}).call(this);
