(function() {
  Cetabo.ContentManager = Cetabo.BaseManager.extend({
    initialize: function(config) {
      var channel;
      this.config = config;
      channel = this.get("channel");
      this.initEditor();
      Cetabo.EventDistpatcher.use(channel).on("content.change", this.onContentChange, this);
      Cetabo.EventDistpatcher.use(channel).on("content.persist", this.onContentPersit, this);
      Cetabo.EventDistpatcher.use(channel).on("content.hide", this.hideEditor, this);
      Cetabo.EventDistpatcher.use(channel).on("content.show", this.showEditor, this);
    },
    onContentChange: function(content, callback) {
      this.showEditor();
      this.setContent((content !== undefined ? content : ""));
      this.setUpdateCallback(callback);
      this.rebindEvents(this);
    },
    setUpdateCallback: function(callback) {
      this.updateCallback = callback;
    },
    onContentPersit: function(persistCallback) {
      persistCallback(this.getContent());
    },
    initEditor: function() {
      this.hideEditor();
      this.rebindEvents(this);
    },
    rebindEvents: function(instance) {
      this.getHtmlEditor().keyup(function() {
        if (instance.updateCallback === undefined) {
          return;
        }
        instance.updateCallback(instance.getContent());
      });
      if (this.getRichEditor() !== null) {
        this.getRichEditor().onKeyUp.add(function(ed, l) {
          if (instance.updateCallback === undefined) {
            return;
          }
          instance.updateCallback(instance.getContent());
        });
        this.getRichEditor().onChange.add(function(ed, l) {
          if (instance.updateCallback === undefined) {
            return;
          }
          instance.updateCallback(instance.getContent());
        });
      }
    },
    showEditor: function() {
      this.getEditorContainer().show();
    },
    hideEditor: function() {
      this.getEditorContainer().hide();
    },
    getEditorContainer: function() {
      return jQuery("#wp-" + this.config.el + "-wrap");
    },
    /*
    Get content
    */

    getContent: function() {
      var editor;
      editor = this.getEditor();
      if (this.isRichEditorActive()) {
        return editor.getContent();
      } else {
        return editor.val();
      }
    },
    /*
    Set content
    */

    setContent: function(content) {
      var editor;
      editor = this.getEditor();
      if (editor === undefined || (editor == null)) {
        return;
      }
      if (this.isRichEditorActive()) {
        editor.setContent(content);
      } else {
        editor.val(content);
      }
    },
    isRichEditorActive: function() {
      return jQuery("#wp-" + this.config.el + "-wrap").hasClass("tmce-active");
    },
    getRichEditor: function() {
      return tinyMCE.activeEditor;
    },
    getHtmlEditor: function() {
      return jQuery("#" + this.config.el);
    },
    getEditor: function() {
      if (this.isRichEditorActive()) {
        return this.getRichEditor();
      } else {
        return this.getHtmlEditor();
      }
    }
  });

}).call(this);
;(function() {
  Cetabo.IconProviderModel = Cetabo.BaseProvider.extend({
    iconData: [
      {
        id: 0,
        imageSrc: "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1",
        text: "DEFAULT",
        description: "Icon default"
      }, {
        id: 1,
        imageSrc: "{url}/media/images/cetabo_icons/pin_default_blue.png",
        text: "Default blue",
        description: "Default blue"
      }, {
        id: 2,
        imageSrc: "{url}/media/images/cetabo_icons/pin_default_lightblue.png",
        text: "Default light blue",
        description: "Default light blue"
      }, {
        id: 3,
        imageSrc: "{url}/media/images/cetabo_icons/pin_default_purple.png",
        text: "Default purple",
        description: "Default purple"
      }, {
        id: 4,
        imageSrc: "{url}/media/images/cetabo_icons/pin_default_red.png",
        text: "Default red",
        description: "Default red"
      }, {
        id: 5,
        imageSrc: "{url}/media/images/cetabo_icons/pin_default_yellow.png",
        text: "Default yellow",
        description: "Default yellow"
      }, {
        id: 6,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_blue.png",
        text: "Airport blue 1",
        description: "Airport blue 1"
      }, {
        id: 7,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_blue-2.png",
        text: "Airport blue 2",
        description: "Airport blue 2"
      }, {
        id: 8,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_lightblue.png",
        text: "Airport light blue 1",
        description: "Airport light blue 1"
      }, {
        id: 9,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_lightblue-2.png",
        text: "Airport light blue 2",
        description: "Airport light blue 2"
      }, {
        id: 10,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_purple.png",
        text: "Airport purple 1",
        description: "Airport purple 1"
      }, {
        id: 11,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_purple-2.png",
        text: "Airport purple 2",
        description: "Airport purple 2"
      }, {
        id: 12,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_red.png",
        text: "Airport red 1",
        description: "Airport red 1"
      }, {
        id: 13,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_red-2.png",
        text: "Airport red 2",
        description: "Airport red 2"
      }, {
        id: 14,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_yellow.png",
        text: "Airport yellow 1",
        description: "Airport yellow 1"
      }, {
        id: 15,
        imageSrc: "{url}/media/images/cetabo_icons/pin_airport_yellow-2.png",
        text: "Airport yellow 2",
        description: "Airport yellow 2"
      }, {
        id: 16,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_blue.png",
        text: "Car blue 1",
        description: "Car blue 1"
      }, {
        id: 17,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_blue-2.png",
        text: "Car blue 2",
        description: "Car blue 2"
      }, {
        id: 18,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_ligthblue.png",
        text: "Car light blue 1",
        description: "Car light blue 1"
      }, {
        id: 19,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_lightblue-2.png",
        text: "Car light blue 2",
        description: "Car light blue 2"
      }, {
        id: 20,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_purple.png",
        text: "Car purple 1",
        description: "Car purple 1"
      }, {
        id: 21,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_purple-2.png",
        text: "Car purple 2",
        description: "Car purple 2"
      }, {
        id: 22,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_red.png",
        text: "Car red 1",
        description: "Car red 1"
      }, {
        id: 23,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_red-2.png",
        text: "Car red 2",
        description: "Car red 2"
      }, {
        id: 24,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_yellow.png",
        text: "Car yellow 1",
        description: "Car yellow 1"
      }, {
        id: 25,
        imageSrc: "{url}/media/images/cetabo_icons/pin_car_yellow-2.png",
        text: "Car yellow 2",
        description: "Car yellow 2"
      }, {
        id: 26,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_blue.png",
        text: "Cart blue 1",
        description: "Cart blue 1"
      }, {
        id: 27,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_blue-2.png",
        text: "Cart blue 2",
        description: "Cart blue 2"
      }, {
        id: 28,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_lightblue.png",
        text: "Cart light blue 1",
        description: "Cart light blue 1"
      }, {
        id: 29,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_lightblue-2.png",
        text: "Cart light blue 2",
        description: "Cart light blue 2"
      }, {
        id: 30,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_purple.png",
        text: "Cart purple 1",
        description: "Cart purple 1"
      }, {
        id: 31,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_purple-2.png",
        text: "Cart purple 2",
        description: "Cart purple 2"
      }, {
        id: 32,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_red.png",
        text: "Cart red 1",
        description: "Cart red 1"
      }, {
        id: 33,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_red-2.png",
        text: "Cart red 2",
        description: "Cart red 2"
      }, {
        id: 34,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_yellow.png",
        text: "Cart yellow 1",
        description: "Cart yellow 1"
      }, {
        id: 35,
        imageSrc: "{url}/media/images/cetabo_icons/pin_cart_yellow-2.png",
        text: "Cart yellow 2",
        description: "Cart yellow 2"
      }, {
        id: 36,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_blue.png",
        text: "Coffee blue 1",
        description: "Coffee blue 1"
      }, {
        id: 37,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_blue-2.png",
        text: "Coffee blue 2",
        description: "Coffee blue 2"
      }, {
        id: 38,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_lightblue.png",
        text: "Coffee light blue 1",
        description: "Coffee light blue 1"
      }, {
        id: 39,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_lightblue-2.png",
        text: "Coffee light blue 2",
        description: "Coffee light blue 2"
      }, {
        id: 40,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_purple.png",
        text: "Coffee purple 1",
        description: "Coffee purple 1"
      }, {
        id: 41,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_purple-2.png",
        text: "Coffee purple 2",
        description: "Coffee purple 2"
      }, {
        id: 42,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_red.png",
        text: "Coffee red 1",
        description: "Coffee red 1"
      }, {
        id: 43,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_red-2.png",
        text: "Coffee red 2",
        description: "Coffee red 2"
      }, {
        id: 44,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_yellow.png",
        text: "Coffee yellow 1",
        description: "Coffee yellow 1"
      }, {
        id: 45,
        imageSrc: "{url}/media/images/cetabo_icons/pin_coffee_yellow-2.png",
        text: "Coffee yellow 2",
        description: "Coffee yellow 2"
      }, {
        id: 46,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_blue.png",
        text: "Gas station blue 1",
        description: "Gas station blue 1"
      }, {
        id: 47,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_blue-2.png",
        text: "Gas station blue 2",
        description: "Gas station blue 2"
      }, {
        id: 48,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_lightblue.png",
        text: "Gas station light blue 1",
        description: "Gas station light blue 1"
      }, {
        id: 49,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_lightblue-2.png",
        text: "Gas station light blue 2",
        description: "Gas station light blue 2"
      }, {
        id: 50,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_purple.png",
        text: "Gas station purple 1",
        description: "Gas station purple 1"
      }, {
        id: 51,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_purple-2.png",
        text: "Gas station purple 2",
        description: "Gas station purple 2"
      }, {
        id: 52,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_red.png",
        text: "Gas station red 1",
        description: "Gas station red 1"
      }, {
        id: 53,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_red-2.png",
        text: "Gas station red 2",
        description: "Gas station red 2"
      }, {
        id: 54,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_yellow.png",
        text: "Gas station yellow 1",
        description: "Gas station yellow 1"
      }, {
        id: 55,
        imageSrc: "{url}/media/images/cetabo_icons/pin_gas_station_yellow-2.png",
        text: "Gas station yellow 2",
        description: "Gas station yellow 2"
      }, {
        id: 56,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_blue.png",
        text: "Home blue 1",
        description: "Home blue 1"
      }, {
        id: 57,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_blue-2.png",
        text: "Home blue 2",
        description: "Home blue 2"
      }, {
        id: 58,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_lightblue.png",
        text: "Home light blue 1",
        description: "Home light blue 1"
      }, {
        id: 59,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_lightblue-2.png",
        text: "Home light blue 2",
        description: "Home light blue 2"
      }, {
        id: 60,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_purple.png",
        text: "Home purple 1",
        description: "Home purple 1"
      }, {
        id: 61,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_purple-2.png",
        text: "Home purple 2",
        description: "Home purple 2"
      }, {
        id: 62,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_red.png",
        text: "Home red 1",
        description: "Home red 1"
      }, {
        id: 63,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_red-2.png",
        text: "Home red 2",
        description: "Home red 2"
      }, {
        id: 64,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_yellow.png",
        text: "Home yellow 1",
        description: "Home yellow 1"
      }, {
        id: 65,
        imageSrc: "{url}/media/images/cetabo_icons/pin_home_yellow-2.png",
        text: "Home yellow 2",
        description: "Home yellow 2"
      }, {
        id: 66,
        imageSrc: "{url}/media/images/cetabo_icons/pin_plus_blue.png",
        text: "Plus blue 1",
        description: "Plus blue"
      }, {
        id: 67,
        imageSrc: "{url}/media/images/cetabo_icons/pin_plus_lightblue.png",
        text: "Plus light blue 1",
        description: "Plus light blue"
      }, {
        id: 68,
        imageSrc: "{url}/media/images/cetabo_icons/pin_plus_purple.png",
        text: "Plus purple",
        description: "Plus purple"
      }, {
        id: 69,
        imageSrc: "{url}/media/images/cetabo_icons/pin_plus_red.png",
        text: "Plus red",
        description: "Plus red"
      }, {
        id: 70,
        imageSrc: "{url}/media/images/cetabo_icons/pin_plus_yellow.png",
        text: "Plus yellow",
        description: "Plus yellow"
      }, {
        id: 71,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_blue.png",
        text: "Star blue 1",
        description: "Star blue 1"
      }, {
        id: 72,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_blue-2.png",
        text: "Star blue 2",
        description: "Star blue 2"
      }, {
        id: 73,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_lightblue.png",
        text: "Star lightblue 1",
        description: "Star lightblue 1"
      }, {
        id: 74,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_lightblue-2.png",
        text: "Star lightblue 2",
        description: "Star lightblue 2"
      }, {
        id: 75,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_purple.png",
        text: "Star purple 1",
        description: "Star purple 1"
      }, {
        id: 76,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_purple-2.png",
        text: "Star purple 2",
        description: "Star purple 2"
      }, {
        id: 77,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_red.png",
        text: "Star red 1",
        description: "Star red 1"
      }, {
        id: 78,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_red-2.png",
        text: "Star red 2",
        description: "Star red 2"
      }, {
        id: 79,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_yellow.png",
        text: "Star yellow 1",
        description: "Star yellow 1"
      }, {
        id: 80,
        imageSrc: "{url}/media/images/cetabo_icons/pin_star_yellow-2.png",
        text: "Star yellow 2",
        description: "Star yellow 2"
      }, {
        id: 81,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_blue.png",
        text: "Tools blue 1",
        description: "Tools blue 1"
      }, {
        id: 82,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_blue-2.png",
        text: "Tools blue 2",
        description: "Tools blue 2"
      }, {
        id: 83,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_lightblue.png",
        text: "Tools light blue 1",
        description: "Tools light blue 1"
      }, {
        id: 84,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_ligthblue-2.png",
        text: "Tools light blue 2",
        description: "Tools light blue 2"
      }, {
        id: 85,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_purple.png",
        text: "Tools purple 1",
        description: "Tools purple 1"
      }, {
        id: 86,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_purple-2.png",
        text: "Tools purple 2",
        description: "Tools purple 2"
      }, {
        id: 87,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_red.png",
        text: "Tools red 1",
        description: "Tools red 1"
      }, {
        id: 88,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_red-2.png",
        text: "Tools red 2",
        description: "Tools red 2"
      }, {
        id: 89,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_yellow.png",
        text: "Tools yellow 1",
        description: "Tools yellow 1"
      }, {
        id: 90,
        imageSrc: "{url}/media/images/cetabo_icons/pin_tools_yellow-2.png",
        text: "Tools yellow 2",
        description: "Tools yellow 2"
      }
    ],
    initialize: function(baseURL) {
      var i, icon;
      i = 0;
      while (i < this.iconData.length) {
        icon = this.iconData[i];
        if (icon.hidden !== true) {
          icon.imageSrc = icon.imageSrc.replace("{url}", baseURL);
        }
        i++;
      }
      this.setData(this.iconData);
    },
    /*
      Get icon by id
    */

    getById: function(id) {
      var i;
      i = 0;
      while (i < this.iconData.length) {
        if (this.iconData[i].id === parseInt(id)) {
          return this.iconData[i];
        }
        i++;
      }
      return undefined;
    }
  });

}).call(this);
;(function() {
  Cetabo.MapVisibilityProviderModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var featureTypes;
      featureTypes = [
        {
          id: "on",
          text: "On",
          description: "Show feature"
        }, {
          id: "off",
          text: "Off",
          description: "Hide feature"
        }, {
          id: "simplified ",
          text: "Simplified",
          description: "Removes some style features from the affected features"
        }
      ];
      this.setData(featureTypes);
    },
    getDefault: function() {
      return "on";
    }
  });

}).call(this);
;(function() {
  Cetabo.MapModeProvierModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var data;
      data = [
        {
          text: "MAP",
          id: google.maps.MapMode.MAP,
          description: "Displays the default map mode"
        }, {
          text: "STREET",
          id: google.maps.MapMode.STREET,
          description: "Displays street view mode"
        }
      ];
      this.setData(data);
    }
  });

}).call(this);
;(function() {
  Cetabo.MapTypeProviderModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var data;
      data = [
        {
          text: "ROADMAP",
          id: google.maps.MapTypeId.ROADMAP,
          description: "Displays the default road map view"
        }, {
          text: "SATELLITE",
          id: google.maps.MapTypeId.SATELLITE,
          description: "Displays Google Earth satellite images"
        }, {
          text: "HYBRID",
          id: google.maps.MapTypeId.HYBRID,
          description: "Displays a mixture of normal and satellite views"
        }, {
          text: "TERRAIN",
          id: google.maps.MapTypeId.TERRAIN,
          description: "Displays a physical map based on terrain information"
        }
      ];
      this.setData(data);
    }
  });

}).call(this);
;(function() {
  Cetabo.PlaceAnimationTypeProviderModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var data;
      data = [
        {
          text: "NONE",
          id: 0,
          description: "No animantion"
        }, {
          text: "BOUNCE",
          id: google.maps.Animation.BOUNCE,
          description: "Repeated bouncing animation"
        }, {
          text: "DROP",
          id: google.maps.Animation.DROP,
          description: "Dropping from sky animation"
        }
      ];
      this.setData(data);
    }
  });

}).call(this);
;(function() {
  Cetabo.MapControlPostionProviderModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var data;
      data = [
        {
          id: google.maps.ControlPosition.BOTTOM_CENTER,
          description: "Elements are positioned in the center of the bottom row",
          text: "BOTTOM CENTER"
        }, {
          id: google.maps.ControlPosition.BOTTOM_LEFT,
          description: "Elements are positioned in the bottom left and flow towards the middle. Elements are positioned to the right of the Google logo",
          text: "BOTTOM LEFT"
        }, {
          id: google.maps.ControlPosition.BOTTOM_RIGHT,
          description: "Elements are positioned in the bottom right and flow towards the middle. Elements are positioned to the left of the copyrights",
          text: "BOTTOM RIGHT"
        }, {
          id: google.maps.ControlPosition.LEFT_BOTTOM,
          description: "Elements are positioned on the left, above bottom-left elements, and flow upwards",
          text: "LEFT BOTTOM"
        }, {
          id: google.maps.ControlPosition.LEFT_CENTER,
          description: "Elements are positioned in the center of the left side",
          text: "LEFT CENTER"
        }, {
          id: google.maps.ControlPosition.LEFT_TOP,
          description: "Elements are positioned on the left, below top-left elements, and flow downwards",
          text: "LEFT TOP"
        }, {
          id: google.maps.ControlPosition.RIGHT_BOTTOM,
          description: "Elements are positioned on the right, above bottom-right elements, and flow upwards",
          text: "RIGHT BOTTOM"
        }, {
          id: google.maps.ControlPosition.RIGHT_CENTER,
          description: "Elements are positioned in the center of the right side",
          text: "RIGHT CENTER"
        }, {
          id: google.maps.ControlPosition.RIGHT_TOP,
          description: "Elements are positioned on the right, below top-right elements, and flow downwards",
          text: "RIGHT TOP"
        }, {
          id: google.maps.ControlPosition.TOP_CENTER,
          description: "Elements are positioned in the center of the top row",
          text: "TOP_CENTER"
        }, {
          id: google.maps.ControlPosition.TOP_LEFT,
          description: "Elements are positioned in the top left and flow towards the middle",
          text: "TOP LEFT"
        }, {
          id: google.maps.ControlPosition.TOP_RIGHT,
          description: "Elements are positioned in the top right and flow towards the middle",
          text: "TOP RIGHT"
        }
      ];
      this.setData(data);
    }
  });

}).call(this);
;(function() {
  Cetabo.ElementProviderMapModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var elementTypes;
      elementTypes = [
        {
          text: "all",
          id: "all",
          description: "Apply the rule to all elements of the specified feature."
        }, {
          text: "geometry",
          id: "geometry",
          description: "Apply the rule to the feature's geometry."
        }, {
          text: "geometry.fill",
          id: "geometry.fill",
          description: "Apply the rule to the fill of the feature's geometry."
        }, {
          text: "geometry.stroke",
          id: "geometry.stroke",
          description: "Apply the rule to the stroke of the feature's geometry."
        }, {
          text: "labels",
          id: "labels",
          description: "Apply the rule to the feature's labels."
        }, {
          text: "labels.icon",
          id: "labels.icon",
          description: "Apply the rule to icons within the feature's lab"
        }, {
          text: "labels.text",
          id: "labels.text",
          description: "Apply the rule to the text in the feature's labe"
        }, {
          text: "labels.text.fill",
          id: "labels.text.fill",
          description: "Apply the rule to the fill of the text in the feature's labels."
        }, {
          text: "labels.text.stroke",
          id: "labels.text.stroke",
          description: "Apply the rule to the stroke of the text in the feature"
        }
      ];
      this.setData(elementTypes);
    },
    getDefault: function() {
      return undefined;
    }
  });

}).call(this);
;(function() {
  Cetabo.FeatureProviderMapModel = Cetabo.BaseProvider.extend({
    initialize: function() {
      var featureTypes;
      featureTypes = [
        {
          id: "administrative",
          text: "administrative",
          description: "Apply the rule to administrative areas."
        }, {
          id: "administrative.country",
          text: "administrative.country",
          description: "Apply the rule to countries."
        }, {
          id: "administrative.land_parcel",
          text: "administrative.land_parcel",
          description: "Apply the rule to land parcels."
        }, {
          id: "administrative.locality",
          text: "administrative.locality",
          description: "Apply the rule to localities."
        }, {
          id: "administrative.neighborhood",
          text: "administrative.neighborhood",
          description: "Apply the rule to neighborhoods."
        }, {
          id: "administrative.province",
          text: "administrative.province",
          description: "Apply the rule to provinces."
        }, {
          id: "all",
          text: "all",
          description: "Apply the rule to all selector types."
        }, {
          id: "landscap",
          text: "landscap",
          description: "Apply the rule to landscapes."
        }, {
          id: "landscape.man_made",
          text: "landscape.man_made",
          description: "Apply the rule to man made structures."
        }, {
          id: "landscape.natural",
          text: "landscape.natural",
          description: "Apply the rule to natural features."
        }, {
          id: "landscape.natural.landcover",
          text: "landscape.natural.landcover",
          description: "Apply the rule to landcover."
        }, {
          id: "landscape.natural.terrain\t",
          text: "landscape.natural.terrain\t",
          description: "Apply the rule to terrain."
        }, {
          id: "poi",
          text: "poi",
          description: "Apply the rule to points of interest."
        }, {
          id: "poi.attraction",
          text: "poi.attraction",
          description: "Apply the rule to attractions for tourist"
        }, {
          id: "poi.business",
          text: "poi.business",
          description: "Apply the rule to businesses."
        }, {
          id: "poi.government",
          text: "poi.government",
          description: "Apply the rule to government buildings."
        }, {
          id: "poi.medical",
          text: "poi.medical",
          description: "Apply the rule to emergency services (hospi"
        }, {
          id: "poi.park",
          text: "poi.park",
          description: "Apply the rule to parks."
        }, {
          id: "poi.place_of_worship",
          text: "poi.place_of_worship",
          description: "Apply the rule to places of worship, such as church, temple, or mosque."
        }, {
          id: "poi.school",
          text: "poi.school",
          description: "Apply the rule to schools."
        }, {
          id: "poi.sports_complex",
          text: "poi.sports_complex",
          description: "Apply the rule to sports complexes."
        }, {
          id: "road",
          text: "road",
          description: "Apply the rule to all roads."
        }, {
          id: "road.arterial",
          text: "road.arterial",
          description: "Apply the rule to arterial roads."
        }, {
          id: "road.highway",
          text: "road.highway",
          description: "Apply the rule to highways."
        }, {
          id: "road.highway.controlled_access",
          text: "road.highway.controlled_access",
          description: "Apply the rule to controlled-access highways."
        }, {
          id: "road.local",
          text: "road.local",
          description: "Apply the rule to local roads."
        }, {
          id: "transit",
          text: "transit",
          description: "Apply the rule to all transit stations and lines."
        }, {
          id: "transit.line",
          text: "transit.line",
          description: "Apply the rule to transit lines."
        }, {
          id: "transit.station",
          text: "transit.station",
          description: "Apply the rule to all transit stations."
        }, {
          id: "transit.station.airport",
          text: "transit.station.airport",
          description: "Apply the rule to airports."
        }, {
          id: "transit.station.bus",
          text: "transit.station.bus",
          description: "Apply the rule to bus stops."
        }, {
          id: "transit.station.rail",
          text: "transit.station.rail",
          description: "Apply the rule to rail stations."
        }, {
          id: "water",
          text: "water",
          description: "Apply the rule to bodies of water."
        }
      ];
      this.setData(featureTypes);
    },
    getDefault: function() {
      return undefined;
    }
  });

}).call(this);
;(function() {
  Cetabo.ThemeProvierModel = Cetabo.BaseProvider.extend({
    initialize: function(config) {
      this.channel = config.channel;
      this.url = config.url;
    },
    invoke: function(callback) {
      var instance;
      instance = this;
      Cetabo.EventDistpatcher.use(this.channel).trigger("backend.send", {
        url: this.url,
        callback: {
          success: function(data) {
            instance.setData(data.themes);
            callback();
          }
        }
      });
    }
  });

}).call(this);
;/*
Generic accordion implementation
*/


(function() {
  Cetabo.AbstractAccordionView = Cetabo.BaseView.extend({
    events: {
      "click .add": "addNew",
      "click .remove": "remove"
    },
    /*
    Get accordion DOM element
    */

    getAccordion: function() {
      return jQuery(this.getAccordionIdentifier());
    },
    /*
    Get accordion DOM element identifier
    */

    getAccordionIdentifier: function() {
      return "#" + this.getElId() + " .accordion";
    },
    /*
    Perform required initializations
    */

    initAccordionControl: function() {
      this.getAccordion().accordion();
      this.bindListeners();
    },
    bindListeners: function() {
      var instance;
      instance = this;
      this.getAccordion().on("accordionactivate", function(event, ui) {
        var index;
        index = instance.getActiveIndex();
        instance.onExpand(index);
      });
      this.getAccordion().on("accordionbeforeactivate", function(event, ui) {
        var index;
        index = instance.getActiveIndex();
        instance.onPreexpand(index);
      });
    },
    getActiveIndex: function() {
      return this.getAccordion().accordion("option", "active");
    },
    onExpand: function(index) {},
    onPreexpand: function(index) {},
    /*
    Get accordion index by element identifier
    */

    resolveAccordionIndexById: function(id) {
      var index;
      index = 0;
      this.getAccordion().children(".accordion-content").each(function(i) {
        if (id === this.id) {
          index = i;
        }
      });
      return index;
    },
    resolveAccordionIdByIndex: function(index) {
      var id;
      id = undefined;
      this.getAccordion().children(".accordion-content").each(function(i) {
        if (index === i) {
          id = this.id;
        }
      });
      return id;
    },
    getDataModelAtIndex: function(index) {
      return this.modelReference[index];
    },
    buildAccordionElementIdentifier: function() {
      return "ident" + Math.floor(Math.random() * 100000);
    },
    /*
    Add new accordion element
    */

    addNew: function() {
      var accordionElement, newElementId;
      newElementId = this.buildAccordionElementIdentifier();
      accordionElement = this.createAccordionElement(newElementId);
      this.getAccordion().append(accordionElement);
      this.createAccordionElementDataModel(newElementId);
      this.afterElementCreation(newElementId);
      this.refresh();
      this.afterElementAdded(newElementId);
      return newElementId;
    },
    bindModel: function(id, model) {
      var accordionElement, newElementId;
      newElementId = id;
      accordionElement = this.createAccordionElement(newElementId);
      this.getAccordion().append(accordionElement);
      this.afterElementCreation(newElementId);
      this.refresh();
      this.afterElementAdded(newElementId);
    },
    refresh: function() {
      this.getAccordion().accordion("refresh");
    },
    /*
    Build element, abstract method to be implemented in children classes
    */

    createAccordionElement: function(newElementId) {},
    /*
    Build element model, abstract method to be implemented in children classes
    */

    createAccordionElementDataModel: function(newElementId) {},
    /*
    Anny additional work to be done after elemnt creation
    */

    afterElementCreation: function(newElementId) {},
    afterElementAdded: function(newElementId) {},
    /*
    Remove selected accordion element
    */

    remove: function(event) {
      var removingElementId, selectedAccordionElement;
      selectedAccordionElement = event.currentTarget;
      removingElementId = jQuery(selectedAccordionElement).attr("identif");
      jQuery(event.currentTarget).parent("h3").next("div").andSelf().remove();
      this.getAccordion().accordion("refresh");
      this.afterElementRemoval(removingElementId);
      if (this.getElementsCount() === 0) {
        this.onClear();
      }
    },
    removeAll: function() {
      this.getAccordion().html("");
      this.getAccordion().accordion("refresh");
    },
    getElementsCount: function() {
      var children;
      children = this.getAccordion().children(".accordion-content");
      if (children !== undefined) {
        return children.length;
      } else {
        return 0;
      }
    },
    onClear: function() {},
    /*
    Anny additional work to be done after elemnt removal
    */

    afterElementRemoval: function(elementId) {},
    /*
    Select accordion element
    */

    expand: function(elementId) {
      var index;
      index = this.resolveAccordionIndexById(elementId);
      this.getAccordion().accordion("option", "active", index);
    }
  });

}).call(this);
;(function() {
  Cetabo.StylerView = Cetabo.AbstractAccordionView.extend({
    events: function() {
      return _.extend({}, Cetabo.AbstractAccordionView.prototype.events, {
        "click .apply": "apply",
        "click .save-theme": "saveTheme"
      });
    },
    initialize: function(config) {
      this.initAccordionControl();
      this.model = config.model;
      this.channel = config.channel;
      this.config = config;
      this.elementProviderModel = new Cetabo.ElementProviderMapModel();
      this.featureProviderModel = new Cetabo.FeatureProviderMapModel();
      this.mapVisibilityProviderModel = new Cetabo.MapVisibilityProviderModel();
      this.componentFactory = new Cetabo.ComponentFactory();
      Cetabo.EventDistpatcher.use(this.channel).on("map.load", this.onLoadMap, this);
      this.initThemeSelector(config);
    },
    onLoadMap: function(model) {
      this.updateAccordionFromModel(model);
    },
    updateAccordionFromModel: function(model) {
      var key, stylers;
      stylers = model.get("stylers");
      for (key in stylers) {
        this.bindModel(key, stylers[key]);
        this.updateStylerHeader(stylers[key]);
      }
    },
    afterElementCreation: function(id) {
      var style;
      style = this.getStylerById(id);
      this.initStylerElementSelector(style);
      this.initStylerFeatureSelector(style);
      this.initStylerVisiblitySelector(style);
      this.initStylerColorPicker(style);
      this.initStylerSaturationSelector(style);
      this.initStylerLightnessSelector(style);
      this.initStylerGammaSelector(style);
    },
    initStylerGammaSelector: function(styler) {
      var instance;
      instance = this;
      jQuery("#" + styler.get("id") + " .gamma").val(styler.getStyler("gamma"));
      jQuery("#" + styler.get("id") + " .gamma").spinner({
        step: 0.01,
        min: 0.01,
        max: 10,
        numberFormat: "n",
        change: function() {
          var value;
          value = this.value;
          styler.setStyler("gamma", value);
          instance.apply();
        },
        stop: function() {
          var value;
          value = this.value;
          styler.setStyler("gamma", value);
          instance.apply();
        }
      });
    },
    initStylerLightnessSelector: function(styler) {
      var instance;
      jQuery("#" + styler.get("id") + " .lightness").val(styler.getStyler("lightness"));
      instance = this;
      jQuery("#" + styler.get("id") + " .lightness").spinner({
        step: 1,
        min: -100,
        max: 100,
        numberFormat: "n",
        change: function() {
          var value;
          value = this.value;
          styler.setStyler("lightness", value);
          instance.apply();
        },
        stop: function() {
          var value;
          value = this.value;
          styler.setStyler("lightness", value);
          instance.apply();
        }
      });
    },
    initStylerSaturationSelector: function(styler) {
      var instance;
      jQuery("#" + styler.get("id") + " .saturation").val(styler.getStyler("saturation"));
      instance = this;
      jQuery("#" + styler.get("id") + " .saturation").spinner({
        step: 1,
        min: -100,
        max: 100,
        numberFormat: "n",
        change: function() {
          var value;
          value = this.value;
          styler.setStyler("saturation", value);
          instance.apply();
        },
        stop: function() {
          var value;
          value = this.value;
          styler.setStyler("saturation", value);
          instance.apply();
        }
      });
    },
    /*
    Handle feature visibility
    @param styler
    */

    initStylerVisiblitySelector: function(styler) {
      var instance;
      if (styler.getStyler("visibility") == null) {
        styler.setStyler("visibility", "on");
      }
      instance = this;
      instance.changeStylerVisiblity(styler, styler.getStyler("visibility"));
      new Cetabo.Select2Adaptor({
        el: "#" + styler.get("id") + " .visibility",
        provider: this.mapVisibilityProviderModel,
        onMatchSelection: function(obj) {
          return obj !== undefined && obj.id === styler.getStyler("visibility");
        },
        onFormatResult: function(item) {
          return "<div class='place-icon-selector'>" + item.text + "<div class='description'>" + item.description + "</div></div>";
        },
        onFormatSelection: function(item) {
          return item.text;
        },
        onSelect: function(item) {
          styler.setStyler("visibility", item.id);
          instance.changeStylerVisiblity(styler, item.id);
          instance.apply();
        }
      });
    },
    /*
    Theam selector
    */

    initThemeSelector: function(config) {
      var channel, instance;
      instance = this;
      channel = this.channel;
      this.componentFactory.create('select', 'theme', {
        el: this.findIdent(".theme"),
        provider: new Cetabo.ThemeProvierModel({
          url: config.url.themes,
          channel: this.channel
        }),
        onChange: function(id, item) {
          

        }
      });
    },
    /*
    Change visibility of styler
    @param styler
    @param visibility
    */

    changeStylerVisiblity: function(styler, visibility) {
      if (visibility === "off") {
        jQuery("#" + styler.get("id") + " .visibility-bound").hide();
      } else {
        jQuery("#" + styler.get("id") + " .visibility-bound").show();
      }
    },
    initStylerCheckBoxes: function(styler) {
      var instance;
      instance = this;
      jQuery("#" + styler.get("id") + " .visibility").change(function() {
        var value;
        value = jQuery(this).is(":checked");
        styler.setStyler("visibility", (value ? "on" : "off"));
        instance.apply();
      });
      jQuery("#" + styler.get("id") + " .inverse-lightness").change(function() {
        var value;
        value = jQuery(this).is(":checked");
        styler.setStyler("inverse", value);
        instance.apply();
      });
    },
    initStylerColorPicker: function(styler) {
      var color, instance;
      instance = this;
      color = jQuery("#" + styler.get("id") + " .color");
      color.val(styler.getStyler("color"));
      color.change(function() {
        var value;
        value = jQuery(this).val();
        styler.setStyler("color", "#" + value);
        instance.apply();
      });
      jscolor.bind();
    },
    initStylerElementSelector: function(styler) {
      var instance;
      instance = this;
      new Cetabo.Select2Adaptor({
        el: "#" + styler.get("id") + " .element-type",
        provider: this.elementProviderModel,
        onMatchSelection: function(obj) {
          return obj !== undefined && obj.id === styler.get("elementType");
        },
        onFormatResult: function(item) {
          return "<div class='place-icon-selector'>" + item.text + "<div class='description'>" + item.description + "</div></div>";
        },
        onFormatSelection: function(item) {
          return item.text;
        },
        onSelect: function(item) {
          styler.set("elementType", item.id);
          instance.apply();
        }
      });
    },
    initStylerFeatureSelector: function(styler) {
      var instance;
      instance = this;
      new Cetabo.Select2Adaptor({
        el: "#" + styler.get("id") + " .feature-type",
        provider: this.featureProviderModel,
        onMatchSelection: function(obj) {
          return obj !== undefined && obj.id === styler.get("featureType");
        },
        onFormatResult: function(item) {
          return "<div class='place-icon-selector'>" + item.text + "<div class='description'>" + item.description + "</div></div>";
        },
        onFormatSelection: function(item) {
          return item.text;
        },
        onSelect: function(item) {
          styler.set("featureType", item.id);
          instance.apply();
          instance.updateStylerHeader(styler);
        }
      });
    },
    updateStylerHeader: function(styler) {
      var feature, id;
      id = styler.get("id");
      feature = styler.get("featureType");
      if (feature === undefined) {
        return;
      }
      jQuery("#name-lable-" + id).html(styler.get("featureType"));
    },
    getStylerById: function(id) {
      return this.model.getStylerById(id);
    },
    createAccordionElement: function(id) {
      var template;
      template = Cetabo.TemplateManager.getTemplateByName("#template-style");
      return template({
        'id': id
      });
    },
    createAccordionElementDataModel: function(id) {
      var model;
      model = new Cetabo.StylerModel({
        id: id,
        channel: this.getChannel()
      });
      this.model.addStyler(id, model);
    },
    afterElementRemoval: function(id) {
      this.model.removeStyler(id);
      this.apply();
    },
    apply: function() {
      var channel;
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("styler.update", this.model.buildMapStyler());
    },
    saveTheme: function() {
      

    }
  });

}).call(this);
;(function() {
  Cetabo.PlacesView = Cetabo.AbstractAccordionView.extend({
    events: function() {
      return _.extend({}, Cetabo.AbstractAccordionView.prototype.events, {});
    },
    initialize: function(config) {
      var channel;
      this.initAccordionControl();
      this.model = config.model;
      this.channel = config.channel;
      this.iconProviderModel = new Cetabo.IconProviderModel(config.baseURL);
      this.placeAnimationTypeProviderModel = new Cetabo.PlaceAnimationTypeProviderModel();
      this.iconSelectors = [];
      this.animationSelectors = [];
      channel = this.getChannel();
      this.componentFactory = new Cetabo.ComponentFactory();
      Cetabo.EventDistpatcher.use(channel).on("place.select", this.onFocusPlace, this);
      Cetabo.EventDistpatcher.use(channel).on("map.load", this.onLoadMap, this);
    },
    onFocusPlace: function(place) {
      var id;
      id = place.get("id");
      this.expand(id);
    },
    onLoadMap: function(model) {
      var key, place, places;
      places = model.getPlacesByAttribute("type", [undefined, "default"]);
      place = undefined;
      for (key in places) {
        if (place === undefined) {
          place = places[key];
        }
        this.bindModel(key, places[key]);
      }
      this.updateContentEditor(place);
    },
    getPlaceById: function(id) {
      return this.model.getPlaceById(id);
    },
    afterElementCreation: function(id) {
      var channel, place;
      place = this.getPlaceById(id);
      this.initIconSelector(place);
      this.initAnimationSelector(place);
      this.initNameInput(place);
      this.initLocationInput(place);
      this.initFileUploader(place);
      this.initTagsInput(place);
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("place.add", place);
    },
    afterElementAdded: function(id) {
      var place;
      place = this.getPlaceById(id);
      this.onFocusPlace(place);
      this.updateContentEditor(place);
    },
    initNameInput: function(place) {
      var name;
      name = jQuery("#" + place.get("id") + " .name");
      name.val(place.get("name"));
      jQuery("#name-lable-" + place.get("id")).html(place.get("name"));
      name.change(function() {
        var value;
        value = jQuery(this).val();
        place.set("name", value);
        jQuery("#name-lable-" + place.get("id")).html(value);
      });
    },
    initTagsInput: function(place) {
      var channel, tags;
      channel = this.getChannel();
      tags = jQuery("#" + place.get("id") + " .tags");
      tags.val(place.get("tags"));
      tags.tagsInput({
        onChange: function() {
          

        }
      });
    },
    initLocationInput: function(place) {
      var lat, lng;
      lng = jQuery("#" + place.get("id") + " .lng");
      lng.val(place.get("lng"));
      lng.change(function() {
        var value;
        value = jQuery(this).val();
        place.set("lng", value);
      });
      lat = jQuery("#" + place.get("id") + " .lat");
      lat.val(place.get("lat"));
      lat.change(function() {
        var value;
        value = jQuery(this).val();
        place.set("lat", value);
      });
    },
    initFileUploader: function(place) {
      

    },
    initIconSelector: function(place) {
      var channel;
      this.updatePlaceIconIfEmpty(place);
      this.updateIconProviderModelIfRequired(place);
      channel = this.getChannel();
      this.iconSelectors[place.get("id")] = new Cetabo.Select2Adaptor({
        el: "#" + place.get("id") + " .icon",
        provider: this.iconProviderModel,
        channel: channel,
        onMatchSelection: function(obj) {
          return obj !== undefined && obj.imageSrc === place.get("icon");
        },
        onFormatResult: function(item) {
          return "<div class='place-icon-selector'><img class='icon' src='" + item.imageSrc + "'/>" + item.text + "<div class='description'>" + item.description + "</div></div>";
        },
        onFormatSelection: function(item) {
          return item.text;
        },
        onSelect: function(item) {
          place.set("icon", item.imageSrc);
          place.set("iconCustomName", item.text);
          place.set("iconCustomId", item.id);
          Cetabo.EventDistpatcher.use(channel).trigger("place.update", place);
        }
      });
    },
    updatePlaceIconIfEmpty: function(place) {
      var channel, item;
      if (place.get('icon') !== '') {
        return;
      }
      item = this.iconProviderModel.getById(place.get("iconCustomId"));
      if (item != null) {
        channel = this.getChannel();
        place.set("icon", item.imageSrc);
        Cetabo.EventDistpatcher.use(channel).trigger("place.update", place);
      } else {
        item = this.iconProviderModel.getById(0);
        place.set("icon", item.imageSrc);
        place.set("iconCustomName", item.text);
        place.set("iconCustomId", item.id);
      }
    },
    initAnimationSelector: function(place) {
      var channel;
      channel = this.getChannel();
      this.componentFactory.create('select', place.get("id"), {
        el: jQuery("#" + place.get("id") + " .animation"),
        provider: this.placeAnimationTypeProviderModel,
        value: parseInt(place.get("animation")),
        onChange: function(value, item) {
          

        }
      });
    },
    updateIconProviderModelIfRequired: function(place) {
      var channel, customIcon, selectedItem;
      selectedItem = this.iconProviderModel.valueOf(function(obj) {
        return obj !== undefined && obj.imageSrc === place.get("icon");
      });
      if (selectedItem === undefined) {
        channel = this.getChannel();
        customIcon = {
          id: place.get("iconCustomId"),
          imageSrc: place.get("icon"),
          description: "Icon " + place.get("iconCustomName"),
          text: place.get("iconCustomName")
        };
        this.iconProviderModel.getData().push(customIcon);
        Cetabo.EventDistpatcher.use(channel).trigger("select2.update", customIcon);
      }
    },
    /*
    Provice concrete implementation for creation of nre accordionElement
    */

    createAccordionElement: function(id) {
      var template;
      template = Cetabo.TemplateManager.getTemplateByName("#template-place");
      return template({
        'id': id
      });
    },
    createAccordionElementDataModel: function(id) {
      var placeDataModel;
      placeDataModel = new Cetabo.PlaceModel({
        id: id,
        name: "",
        channel: this.getChannel(),
        details: "",
        type: "default",
        animation: "0"
      });
      this.model.addPlace(id, placeDataModel);
      return placeDataModel;
    },
    afterElementRemoval: function(id) {
      var channel, place;
      place = this.model.getPlaceById(id);
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("place.remove", place);
      this.model.removePlace(id);
    },
    onExpand: function(index) {
      var id, place;
      id = this.resolveAccordionIdByIndex(index);
      place = this.getPlaceById(id);
      this.updateContentEditor(place);
    },
    onPreexpand: function(index) {
      var channel, id, place;
      id = this.resolveAccordionIdByIndex(index);
      place = this.getPlaceById(id);
      if (place === undefined) {
        return;
      }
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("content.change", place.get("details"), function(content) {});
    },
    onClear: function() {
      var channel;
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("content.hide");
    },
    updateContentEditor: function(place) {
      var channel;
      if (place === undefined) {
        return;
      }
      channel = this.getChannel();
      Cetabo.EventDistpatcher.use(channel).trigger("content.change", place.get("details"), function(content) {
        place.set("details", content);
      });
    }
  });

}).call(this);
;(function() {
  Cetabo.SettingsView = Cetabo.BaseView.extend({
    events: {},
    initialize: function(config) {
      this.model = config.model;
      this.channel = config.channel;
      this.componentFactory = new Cetabo.ComponentFactory();
      this.initUIModel();
      Cetabo.EventDistpatcher.use(this.channel).on("street.updateposition", this.onChangePagmanPosition, this);
      Cetabo.EventDistpatcher.use(this.channel).on("street.updatepov", this.onChangePagmanPov, this);
      Cetabo.EventDistpatcher.use(this.channel).on("map.updatecenter", this.onChangeMapPosition, this);
      Cetabo.EventDistpatcher.use(this.channel).on("map.updatezoom", this.onChangeMapZoom, this);
      Cetabo.EventDistpatcher.use(this.channel).on("map.load", this.onLoadMap, this);
      Cetabo.EventDistpatcher.use(this.channel).on("map.updatemode", this.onChangeMode, this);
    },
    /* Initalization of view components
    */

    initUIModel: function() {
      var zoomrange, _parent;
      _parent = this;
      this.componentFactory.create('spinner', 'lng', {
        el: this.findIdent(".lng"),
        step: 0.0001,
        value: this.model.get("lng"),
        numberFormat: "n",
        onChange: function(value) {
          _parent.model.set("lng", value);
          _parent.changedMapCenter();
        }
      });
      this.componentFactory.create('spinner', 'lat', {
        el: this.findIdent(".lat"),
        step: 0.0001,
        value: this.model.get("lat"),
        numberFormat: "n",
        onChange: function(value) {
          _parent.model.set("lat", value);
          _parent.changedMapCenter();
        }
      });
      this.componentFactory.create('slider', 'zoom', {
        el: this.findIdent(".zoom"),
        range: "max",
        min: 0,
        max: 21,
        value: this.model.get("zoom"),
        onChange: function(value) {
          _parent.model.set("zoom", value);
          _parent.changeMapZoom();
        }
      });
      zoomrange = this.model.get("zoomrange");
      this.componentFactory.create('rangeslider', 'zoomrange', {
        el: this.findIdent(".zoomrange"),
        range: true,
        values: [zoomrange.min, zoomrange.max],
        min: 0,
        max: 21,
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('input', 'width', {
        el: this.findIdent(".width"),
        value: this.model.get("width"),
        onChange: function(value) {
          _parent.model.set("width", value);
          _parent.changeMapWidth();
        }
      });
      this.componentFactory.create('input', 'height', {
        el: this.findIdent(".height"),
        value: this.model.get("height"),
        onChange: function(value) {
          _parent.model.set("height", value);
          _parent.changeMapHeight();
        }
      });
      this.componentFactory.create('select', 'type', {
        el: this.findIdent(".maptype"),
        provider: new Cetabo.MapTypeProviderModel(),
        value: this.model.get("type"),
        onChange: function(value) {
          _parent.model.set("type", value);
          _parent.changeMapType();
        }
      });
      this.componentFactory.create('select', 'mode', {
        el: this.findIdent(".mapmode"),
        provider: new Cetabo.MapModeProvierModel(),
        value: this.model.get("mode"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('spinner', 'heading', {
        el: this.findIdent(".heading"),
        step: 0.0001,
        numberFormat: "n",
        min: -180,
        max: 180,
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('spinner', 'pitch', {
        el: this.findIdent(".pitch"),
        step: 0.0001,
        numberFormat: "n",
        min: -90,
        max: 90,
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('spinner', 'plng', {
        el: this.findIdent(".plng"),
        step: 0.0001,
        numberFormat: "n",
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('spinner', 'plat', {
        el: this.findIdent(".plat"),
        step: 0.0001,
        numberFormat: "n",
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'overlayenable', {
        el: this.findIdent(".enable-custom-overlay"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'clustering', {
        el: this.findIdent(".clustering"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'dragging', {
        el: this.findIdent(".dragging"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'doubleclickzoom', {
        el: this.findIdent(".doubleclickzoom"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'scrollwellzoom', {
        el: this.findIdent(".scrollwellzoom"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'zoomcontrol', {
        el: this.findIdent(".zoomcontrol-enabled"),
        onChange: function(value) {
          _parent.model.set("zoomcontrol", value);
          _parent.updateZoomControl();
        }
      });
      this.componentFactory.create('select', 'zoomcontrolposition', {
        el: this.findIdent(".zoomcontrol-position"),
        provider: new Cetabo.MapControlPostionProviderModel(),
        value: this.model.get("zoomcontrolposition"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'streetviewcontrol', {
        el: this.findIdent(".streetviewcontrol-enabled"),
        onChange: function(value) {
          _parent.model.set("streetviewcontrol", value);
          _parent.updateStreetViewControl();
        }
      });
      this.componentFactory.create('select', 'streetviewcontrolposition', {
        el: this.findIdent(".streetviewcontrol-position"),
        provider: new Cetabo.MapControlPostionProviderModel(),
        value: this.model.get("streetviewcontrolposition"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'pancontrol', {
        el: this.findIdent(".pancontrol-enabled"),
        onChange: function(value) {
          _parent.model.set("pancontrol", value);
          _parent.updatePanControl();
        }
      });
      this.componentFactory.create('select', 'pancontrolposition', {
        el: this.findIdent(".pancontrol-position"),
        provider: new Cetabo.MapControlPostionProviderModel(),
        value: this.model.get("pancontrolposition"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'maptypecontrol', {
        el: this.findIdent(".maptypecontrol-enabled"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('select', 'maptypecontrolposition', {
        el: this.findIdent(".maptypecontrol-position"),
        provider: new Cetabo.MapControlPostionProviderModel(),
        value: this.model.get("maptypecontrolposition"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'scalecontrol', {
        el: this.findIdent(".scalecontrol-enabled"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'overlaymultiple', {
        el: this.findIdent(".overlaymultiple"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'enabledirection', {
        el: this.findIdent(".enable-direction"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'showsteps', {
        el: this.findIdent(".show-direction-steps"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'enabletags', {
        el: this.findIdent(".enable-tags"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'enableplaces', {
        el: this.findIdent(".enable-places"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'enablefullscreen', {
        el: this.findIdent(".enable-fullscreen"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'startfullscreen', {
        el: this.findIdent(".start-fullscreen"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('checkbox', 'enableaddressearch', {
        el: this.findIdent(".enable-addres-search"),
        onChange: function(value) {
          

        }
      });
      this.componentFactory.create('select', 'defaultsidebartab', {
        el: this.findIdent(".default-sidebar-tab"),
        provider: new Cetabo.SidebarTypeProviderModel(),
        value: this.model.get("defaultsidebartab"),
        onChange: function(value) {
          

        }
      });
    },
    /*  UI triggered events
    */

    changedMapCenter: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatecenter", this.model.get('lat'), this.model.get('lng'));
    },
    updateFullscreenMode: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("view.updatefullscreen", this.model.get('enablefullscreen'));
    },
    updateSearch: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("view.updatesearch", this.model.get('enableaddressearch'));
    },
    changeMapWidth: function() {},
    changeMapHeight: function() {},
    changeMapType: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatetype", this.model.get("type"));
    },
    changeMapMode: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatemode", this.model.get("mode"));
    },
    changeMapZoom: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatezoom", parseInt(this.model.get("zoom")));
    },
    changeMapZoomRange: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatezoomrange", this.model.get("zoomrange"));
    },
    changePagmanPosition: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("street.updateposition", this.model.get('plat'), this.model.get('plng'));
    },
    changePagmantPov: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("street.updatepov", {
        heading: this.model.get('heading'),
        pitch: this.model.get('pitch')
      });
    },
    updateOverlay: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("overlay.updated", this.model);
    },
    updateOveralyMultiple: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("overlay.updated", this.model);
    },
    updateClustering: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("place.cluster", this.model.get("clustering"));
    },
    updateDragging: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatedragging", this.model.get("dragging"));
    },
    updateDoubleClickZoom: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatedoubleclickzoom", this.model.get("doubleclickzoom"));
    },
    updateScrollWellZoom: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatescrollwellzoom", this.model.get("scrollwellzoom"));
    },
    /*
      ZOOM control
    */

    updateZoomControl: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatezoomcontrol", this.model.get("zoomcontrol"));
    },
    updateZoomControlPosition: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatezoomcontrolposition", this.model.get("zoomcontrolposition"));
    },
    /*
       Street view control
    */

    updateStreetViewControl: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatestreetviewcontrol", this.model.get("streetviewcontrol"));
    },
    updateStreetViewControlPosition: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatestreetviewcontrolposition", this.model.get("streetviewcontrolposition"));
    },
    /*
      Pan control
    */

    updatePanControl: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatepancontrol", this.model.get("pancontrol"));
    },
    updatePanControlPosition: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatepancontrolposition", this.model.get("pancontrolposition"));
    },
    /*
     Map type control
    */

    updateMapTypeControl: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatemaptypecontrol", this.model.get("maptypecontrol"));
    },
    updateMapTypeControlPosition: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatemaptypecontrolposition", this.model.get("maptypecontrolposition"));
    },
    updateScaleControl: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("map.updatescalecontrol", this.model.get("scalecontrol"));
    },
    updateDirection: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("direction.stateupdate", this.model.get("enabledirection"));
    },
    updateTags: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("tags.stateupdate", this.model.get("enabletags"));
    },
    updatePlaces: function() {
      Cetabo.EventDistpatcher.use(this.channel).trigger("places.stateupdate", this.model.get("enableplaces"));
    },
    /*  Messages bus events
    */

    onChangeMapPosition: function(lat, lng) {
      this.model.set("lng", lng);
      this.model.set("lat", lat);
      this.componentFactory.setValue('lat', lat);
      this.componentFactory.setValue('lng', lng);
    },
    onChangePagmanPosition: function(lat, lng) {
      this.model.set("streetlng", lng);
      this.model.set("streetlat", lat);
      this.componentFactory.setValue('plat', lat);
      this.componentFactory.setValue('plng', lng);
    },
    onChangePagmanPov: function(pov) {
      if (pov === undefined) {
        return;
      }
      this.model.set("heading", pov.heading);
      this.model.set("pitch", pov.pitch);
      this.componentFactory.setValue('heading', pov.heading);
      this.componentFactory.setValue('pitch', pov.pitch);
    },
    onChangeMapZoom: function(zoomLevel) {
      this.model.set("zoom", zoomLevel);
      this.componentFactory.setValue('zoom', zoomLevel);
    },
    onChangeMode: function(mode) {
      if (google.maps.MapMode.STREET === mode) {
        this.find("#pov-details").show();
        this.find("#pegman-details").show();
      } else {
        this.find("#pov-details").hide();
        this.find("#pegman-details").hide();
      }
    },
    onLoadMap: function(model) {
      this.componentFactory.setValue('type', model.get("type"));
      this.componentFactory.setValue('mode', model.get("mode"));
      this.componentFactory.setValue('width', model.get("width"));
      this.componentFactory.setValue('height', model.get("height"));
      this.componentFactory.setValue('overlayenable', model.get("overlayenable"));
      this.componentFactory.setValue('overlaymultiple', model.get("overlaymultiple"));
      this.componentFactory.setValue('clustering', model.get("clustering"));
      this.componentFactory.setValue('enabledirection', model.get("enabledirection"));
      this.componentFactory.setValue('enabletags', model.get("enabletags"));
      this.componentFactory.setValue('enableplaces', model.get("enableplaces"));
      this.componentFactory.setValue('showsteps', model.get("showsteps"));
      this.componentFactory.setValue('zoom', model.get("zoom"));
      this.componentFactory.setValue('zoomrange', model.get("zoomrange"));
      this.componentFactory.setValue('lat', model.get("lat"));
      this.componentFactory.setValue('lng', model.get("lng"));
      this.componentFactory.setValue('plat', model.get("streetlng"));
      this.componentFactory.setValue('plng', model.get("streetlat"));
      this.componentFactory.setValue('dragging', model.get("dragging"));
      this.componentFactory.setValue('doubleclickzoom', model.get("doubleclickzoom"));
      this.componentFactory.setValue('scrollwellzoom', model.get("scrollwellzoom"));
      this.componentFactory.setValue('zoomcontrol', model.get("zoomcontrol"));
      this.componentFactory.setValue('zoomcontrolposition', model.get("zoomcontrolposition"));
      this.componentFactory.setValue('streetviewcontrol', model.get("streetviewcontrol"));
      this.componentFactory.setValue('streetviewcontrolposition', model.get("streetviewcontrolposition"));
      this.componentFactory.setValue('pancontrol', model.get("pancontrol"));
      this.componentFactory.setValue('pancontrolposition', model.get("pancontrolposition"));
      this.componentFactory.setValue('maptypecontrol', model.get("maptypecontrol"));
      this.componentFactory.setValue('maptypecontrolposition', model.get("maptypecontrolposition"));
      this.componentFactory.setValue('scalecontrol', model.get("scalecontrol"));
      this.componentFactory.setValue('enablefullscreen', model.get("enablefullscreen"));
      this.componentFactory.setValue('startfullscreen', model.get("startfullscreen"));
      this.componentFactory.setValue('enableaddressearch', model.get("enableaddressearch"));
      this.componentFactory.setValue('defaultsidebartab', model.get("defaultsidebartab"));
    }
  });

}).call(this);
;(function() {
  Cetabo.Select2Adaptor = Cetabo.BaseView.extend({
    initialize: function(config) {
      var instance;
      this.config = config;
      instance = this;
      config.provider.invoke(function() {
        instance.fill();
      });
      Cetabo.EventDistpatcher.use(config.channel).on("select2.update", this.onDataUpdate, this);
    },
    fill: function() {
      var config, selectedItem, selector;
      config = this.config;
      selectedItem = config.provider.valueOf(function(obj) {
        return config.onMatchSelection(obj);
      });
      selector = jQuery(config.el);
      this.refreshSelect2(selector);
      if (selectedItem !== undefined) {
        if (selectedItem.id !== undefined) {
          selector.select2("val", selectedItem.id);
        } else {
          selector.select2("val", config.provider.getDefault());
        }
      }
      selector.on("select2-selecting", function(event) {
        config.onSelect(event.object);
      });
    },
    refreshSelect2: function(selector) {
      var config;
      config = this.config;
      selector.select2("destroy");
      selector.select2({
        data: config.provider.getDataModel(),
        formatResult: function(item) {
          return config.onFormatResult(item);
        },
        formatSelection: function(item) {
          return config.onFormatSelection(item);
        },
        escapeMarkup: function(item) {
          return item;
        }
      }, true);
      this.updateEnabledState();
    },
    setEnabled: function(enabled) {
      this.enabled = enabled;
      this.updateEnabledState();
    },
    updateEnabledState: function() {
      var selector;
      selector = jQuery(this.config.el);
      selector.select2("enable", this.enabled);
    },
    onDataUpdate: function(attachment) {
      var selector;
      selector = jQuery(this.config.el);
      if (attachment !== undefined) {
        this.refreshSelect2(selector);
        selector.select2("val", attachment.id);
      }
    }
  });

}).call(this);
;(function() {
  Cetabo.FileUploaderAdaptor = Cetabo.BaseView.extend({
    initialize: function(config) {
      var mediaFileController, wp_media_post_id;
      mediaFileController = void 0;
      wp_media_post_id = wp.media.model.settings.post.id;
      jQuery(config.el).live("click", function(event) {
        event.preventDefault();
        if (mediaFileController) {
          mediaFileController.open();
          return;
        }
        mediaFileController = wp.media.frames.file_frame = wp.media({
          title: jQuery(this).data("uploader_title"),
          library: {
            type: "image"
          },
          button: {
            text: jQuery(this).data("uploader_button_text")
          },
          multiple: false
        });
        mediaFileController.on("select", function() {
          var attachment;
          attachment = mediaFileController.state().get("selection").first().toJSON();
          config.onSelectAttachment(attachment);
          wp.media.model.settings.post.id = wp_media_post_id;
        });
        mediaFileController.open();
      });
      jQuery("a.add_media").on("click", function() {
        wp.media.model.settings.post.id = wp_media_post_id;
      });
    }
  });

}).call(this);
;/*
  Base component
*/


(function() {
  Cetabo.AbstractComponent = Cetabo.BaseView.extend({
    initialize: function(state) {
      this.state = state;
      if (this.state.value) {
        this.setValue(this.state.value);
      }
      this.create();
      this.setEnabled(this.isEnabled());
      this.created = true;
    },
    setValue: function(value) {
      var isSameValue;
      isSameValue = this.value === value;
      this.value = value;
      if (!isSameValue) {
        this.onChangeValue();
      }
    },
    isEnabled: function() {
      var isDisabled, isParentDisabled;
      isDisabled = jQuery(this.state.el).hasClass('c-disabled');
      isParentDisabled = jQuery(this.state.el).closest('.c-disabled').length > 0;
      return !(isDisabled || isParentDisabled);
    },
    onChangeValue: function() {},
    getValue: function() {
      return this.value;
    }
  });

}).call(this);
;/*
  Input component
*/


(function() {
  Cetabo.Select = Cetabo.AbstractComponent.extend({
    create: function() {
      var _component;
      _component = this;
      this._instance = new Cetabo.Select2Adaptor({
        el: this.state.el,
        provider: this.state.provider,
        onMatchSelection: function(obj) {
          return obj !== undefined && obj.id === _component.getValue();
        },
        onFormatResult: function(item) {
          return "<div class='c-selector'>" + item.text + "<div class='description'>" + item.description + "</div></div>";
        },
        onFormatSelection: function(item) {
          return item.text;
        },
        onSelect: function(item) {
          _component.onUpdateValue(item.id, item);
        }
      });
    },
    setEnabled: function(enabled) {
      this._instance.setEnabled(enabled);
    },
    onChangeValue: function() {
      jQuery(this.state.el).select2("val", this.value);
    },
    onUpdateValue: function(value, item) {
      this.setValue(value);
      if (this.state.onChange != null) {
        this.state.onChange(value, item);
      }
    }
  });

}).call(this);
;/*
  Input component
*/


(function() {
  Cetabo.Spinner = Cetabo.AbstractComponent.extend({
    create: function() {
      var _component;
      _component = this;
      this._instance = jQuery(this.state.el).spinner({
        step: this.state.step,
        numberFormat: this.state.format,
        min: this.state.min,
        max: this.state.max,
        change: function() {
          var val;
          val = jQuery(this).val();
          _component.onUpdateValue(val);
        },
        stop: function() {
          var val;
          val = jQuery(this).val();
          _component.onUpdateValue(val);
        }
      });
    },
    onChangeValue: function() {
      jQuery(this.state.el).val(this.value);
    },
    setEnabled: function(enabled) {
      if (enabled) {
        jQuery(this.state.el).spinner("enable");
      } else {
        jQuery(this.state.el).spinner("disable");
      }
    },
    onUpdateValue: function(value) {
      this.setValue(value);
      if (this.state.onChange != null) {
        this.state.onChange(value);
      }
    }
  });

}).call(this);
;/*
  Input component
*/


(function() {
  Cetabo.Checkbox = Cetabo.AbstractComponent.extend({
    create: function() {
      var _component;
      _component = this;
      this._instance = jQuery(this.state.el).iCheck({
        checkboxClass: "icheckbox_minimal",
        radioClass: "iradio_minimal"
      }).on("ifChanged", function() {
        _component.onUpdateValue(this.checked);
      });
    },
    onChangeValue: function() {
      jQuery(this.state.el).iCheck(this.value ? 'check' : 'uncheck');
    },
    setEnabled: function(enabled) {
      if (enabled) {
        jQuery(this.state.el).iCheck("enable");
      } else {
        jQuery(this.state.el).iCheck("disable");
      }
    },
    onUpdateValue: function(value) {
      this.setValue(value);
      if (this.state.onChange != null) {
        this.state.onChange(value);
      }
    }
  });

}).call(this);
;/*
  Input component
*/


(function() {
  Cetabo.Slider = Cetabo.AbstractComponent.extend({
    create: function() {
      var _component;
      _component = this;
      this._instance = jQuery(this.state.el).slider({
        range: this.state.range,
        min: this.state.min,
        max: this.state.max,
        value: this.state.value,
        slide: function(event, ui) {
          var val;
          val = ui.value;
          _component.onUpdateValue(val);
        }
      });
    },
    onChangeValue: function() {
      if (this.created) {
        jQuery(this.state.el).slider("value", this.value);
      }
    },
    setEnabled: function(enabled) {
      if (enabled) {
        jQuery(this.state.el).slider("enable");
      } else {
        jQuery(this.state.el).slider("disable");
      }
    },
    onUpdateValue: function(value) {
      this.setValue(value);
      if (this.state.onChange != null) {
        this.state.onChange(value);
      }
    }
  });

}).call(this);
;/*
  Input component
*/


(function() {
  Cetabo.RangeSlider = Cetabo.AbstractComponent.extend({
    create: function() {
      var _component;
      _component = this;
      this._instance = jQuery(this.state.el).slider({
        range: this.state.range,
        min: this.state.min,
        max: this.state.max,
        values: this.state.values,
        slide: function(event, ui) {
          var maxval, minval;
          minval = ui.values[0];
          maxval = ui.values[1];
          _component.onUpdateValue({
            min: minval,
            max: maxval
          });
        }
      });
    },
    onChangeValue: function() {
      if (this.created) {
        jQuery(this.state.el).slider("values", [this.value.min, this.value.max]);
      }
    },
    setEnabled: function(enabled) {
      if (enabled) {
        jQuery(this.state.el).slider("enable");
      } else {
        jQuery(this.state.el).slider("disable");
      }
    },
    onUpdateValue: function(value) {
      this.setValue(value);
      if (this.state.onChange != null) {
        this.state.onChange(value);
      }
    }
  });

}).call(this);
;/*
  Input component
*/


(function() {
  Cetabo.Input = Cetabo.AbstractComponent.extend({
    create: function() {
      var _component;
      _component = this;
      this._instance = jQuery(this.state.el).change(function() {
        var value;
        value = jQuery(this).val();
        _component.onUpdateValue(value);
      });
      this._instance.val(this.state.value);
    },
    onChangeValue: function() {
      jQuery(this.state.el).val(this.value);
    },
    setEnabled: function(enabled) {},
    onUpdateValue: function(value) {
      this.setValue(value);
      if (this.state.onChange != null) {
        this.state.onChange(value);
      }
    }
  });

}).call(this);
;/*
  Base component
*/


(function() {
  Cetabo.ComponentFactory = Cetabo.BaseView.extend({
    components: {},
    /*
      Create component instance
    */

    create: function(type, name, options) {
      switch (type) {
        case 'input':
          this.components[name] = new Cetabo.Input(options);
          break;
        case 'checkbox':
          this.components[name] = new Cetabo.Checkbox(options);
          break;
        case 'rangeslider':
          this.components[name] = new Cetabo.RangeSlider(options);
          break;
        case 'select':
          this.components[name] = new Cetabo.Select(options);
          break;
        case 'slider':
          this.components[name] = new Cetabo.Slider(options);
          break;
        case 'spinner':
          this.components[name] = new Cetabo.Spinner(options);
      }
    },
    /*
      Get component instance by name
    */

    instance: function(name) {
      return this.components[name];
    },
    /*
      Set value of field
    */

    setValue: function(name, value) {
      this.components[name].setValue(value);
    },
    /*
      Get value of field
    */

    getValue: function(name) {
      return this.components[name].getValue();
    }
  });

}).call(this);
;(function() {
  Cetabo.EditableMapView = Cetabo.MapView.extend({
    events: function() {
      return _.extend({}, Cetabo.MapView.prototype.events, {
        "click .save": "save",
        "click .edit": "edit",
        "click .clone": "clone",
        "click .tab-place": "switchOnPlace",
        "click .tab-settings": "switchOnSettings",
        "click .tab-style": "switchOnStyle",
        "click .tab-direction": "switchOnDirection",
        "click .export": "export"
      });
    },
    initialize: function(config) {
      Cetabo.EditableMapView.__super__.initialize.apply(this, arguments);
      this.initMapNameInput();
      if (!config.readonly) {
        this.initSubViews();
        this.initNotificationManager();
        this.initOverlayManager();
        this.initTabControl();
        this.initAddressPicker();
        this.initContentManager();
        Cetabo.EventDistpatcher.use(this.getChannel()).on("map.loaded", this.onMapLoaded, this);
        Cetabo.EventDistpatcher.use(this.getChannel()).trigger("map.load", this.model);
      }
    },
    initSubViews: function() {
      this.placesView = new Cetabo.PlacesView({
        el: "#controll-place",
        model: this.model,
        channel: this.getChannel(),
        baseURL: this.config.baseURL
      });
      this.settingsView = new Cetabo.SettingsView({
        el: "#controll-settings",
        model: this.model,
        channel: this.getChannel()
      });
      this.stylerView = new Cetabo.StylerView({
        el: "#controll-style",
        model: this.model,
        url: this.getConfiguration().url,
        channel: this.getChannel()
      });
      this.find(".fullscreen").hide();
    },
    switchOnPlace: function() {
      this.placesView.refresh();
      Cetabo.EventDistpatcher.use(this.getChannel()).trigger("content.show");
    },
    switchOnSettings: function() {
      Cetabo.EventDistpatcher.use(this.getChannel()).trigger("content.hide");
    },
    switchOnStyle: function() {
      this.stylerView.refresh();
      Cetabo.EventDistpatcher.use(this.getChannel()).trigger("content.hide");
    },
    switchOnDirection: function() {
      Cetabo.EventDistpatcher.use(this.getChannel()).trigger("content.hide");
    },
    getDefaultModelState: function() {
      var channel;
      channel = this.getChannel();
      return {
        readonly: this.isReadOnly(),
        channel: channel,
        zoom: 2,
        zoomrange: {
          min: 2,
          max: 18
        },
        width: "800px",
        height: "600px",
        lat: 41.552409812870664,
        lng: 12.88751972656244,
        type: google.maps.MapTypeId.ROADMAP,
        mode: google.maps.MapMode.MAP,
        dragging: true,
        doubleclickzoom: true,
        scrollwellzoom: true,
        maptypecontrol: false,
        maptypecontrolposition: google.maps.ControlPosition.TOP_RIGHT,
        pancontrol: false,
        pancontrolposition: google.maps.ControlPosition.TOP_RIGHT,
        scalecontrol: true,
        streetviewcontrol: true,
        streetviewcontrolposition: google.maps.ControlPosition.TOP_RIGHT,
        zoomcontrol: true,
        zoomcontrolposition: google.maps.ControlPosition.TOP_RIGHT,
        defaultsidebartab: 0,
        heading: 34,
        pitch: 10,
        enablefullscreen: false,
        startfullscreen: false,
        enableaddressearch: false,
        enabledirection: false,
        enabletags: false,
        enableplaces: false,
        travelmode: false,
        showsteps: true,
        tracking: false,
        trackinginterval: 1000,
        overalyenable: false,
        overlaymultiple: true,
        overlay_arrowshahowstyle: 0,
        overlay_padding: 10,
        overlay_borderradius: 10,
        overlay_borderwidth: 1,
        overlay_bordercolor: "#CCC",
        overlay_backgroundcolor: "#FFF",
        overlay_minwidth: 0,
        overlay_maxwidth: 300,
        overlay_minheight: 0,
        overlay_maxheight: 0,
        overlay_arrowsize: 15,
        overlay_arrowposition: 50,
        overlay_arrowstyle: 0,
        clustering: false
      };
    },
    initNotificationManager: function() {
      var channel;
      channel = this.getChannel();
      this.notificationsManager = new Cetabo.NotificationsManager({
        channel: channel
      });
    },
    initContentManager: function() {
      var channel;
      channel = this.getChannel();
      this.contentManger = new Cetabo.ContentManager({
        channel: channel,
        el: "___hiddenEditor___"
      });
    },
    initOverlayManager: function() {
      var channel;
      channel = this.getChannel();
      this.overlayManager = new Cetabo.OverlayManager({
        channel: channel
      });
    },
    getMapConfiguration: function() {
      var mapCanvas;
      mapCanvas = this.enforceELId(this.find(".map-canvas"));
      return {
        el: mapCanvas,
        readonly: this.isReadOnly(),
        channel: this.getChannel(),
        baseURL: this.config.baseURL
      };
    },
    initTabControl: function() {
      this.find("#cmap-tabs-container").tabs({
        active: -1
      });
      if (this.isReadOnly()) {
        this.find("#cmap-tabs-container").hide();
      }
    },
    initMapNameInput: function() {
      var model;
      model = this.model;
      this.find(".name").change(function() {
        var value;
        value = jQuery(this).val();
        model.set("name", value);
      });
      this.find(".name").prop("disabled", this.isReadOnly());
    },
    initAddressPicker: function() {
      var channel, instance;
      channel = this.getChannel();
      instance = this;
      this.addresspicker = this.find(".addresspicker").addresspicker({
        updateCallback: function(geocodeResult, parsedGeocodeResult) {
          var place, placeId;
          Cetabo.EventDistpatcher.use(channel).trigger("map.updatecenter", parsedGeocodeResult.lat, parsedGeocodeResult.lng);
          Cetabo.EventDistpatcher.use(channel).trigger("map.updatezoom", 15);
          placeId = instance.placesView.addNew();
          place = instance.model.getPlaceById(placeId);
          place.set("lat", parsedGeocodeResult.lat);
          place.set("lng", parsedGeocodeResult.lng);
          place.set("name", geocodeResult.label);
          instance.placesView.initNameInput(place);
        }
      });
    },
    onLoadMapCallback: function(model) {
      Cetabo.EditableMapView.__super__.onLoadMapCallback.apply(this, arguments);
      this.find(".name").val(model.get("name"));
    },
    /*
    Persist map
    */

    save: function() {
      var parent;
      parent = this;
      this.persist(this.getSaveURL(), function() {
        return parent.getSaveCallbacks();
      });
    },
    clone: function() {
      

    },
    persist: function(url, callback) {
      var channel, i, validation;
      channel = this.getChannel();
      validation = this.model.validate();
      if (validation.hasError) {
        Cetabo.EventDistpatcher.use(channel).trigger("notification.show", validation.messages.join(" <br/>"));
        i = 0;
        while (i < validation.fields.length) {
          this.highlightField(validation.fields[i]);
          i++;
        }
        return;
      }
      Cetabo.EventDistpatcher.use(channel).trigger("overlay.show");
      Cetabo.EventDistpatcher.use(channel).trigger("backend.send", {
        url: url,
        content: this.model.toJSON(),
        callback: callback()
      });
    },
    highlightField: function(name) {
      this.find("" + name).addClass("invalid").delay(8000).queue(function(next) {
        jQuery(this).removeClass("invalid");
        next();
      });
    },
    getSaveURL: function() {
      return this.getConfiguration().url.save;
    },
    getCloneURL: function() {
      return this.getConfiguration().url.clone;
    },
    getBackURL: function() {
      return this.getConfiguration().url.back;
    },
    getExportURL: function() {
      return this.getConfiguration().url["export"];
    },
    isReadOnly: function() {
      return this.getConfiguration().readonly;
    },
    getSaveCallbacks: function() {
      var callback, channel, instance;
      channel = this.getChannel();
      instance = this;
      callback = {
        success: function(object) {
          instance.onSaveSuccess(object, channel);
        },
        error: function(error) {
          instance.onSaveError(error, channel);
        }
      };
      return callback;
    },
    getExportCallbaks: function() {
      var callback, channel, instance;
      channel = this.getChannel();
      instance = this;
      callback = {
        success: function(object) {
          instance.onExportSuccess(object, channel);
        },
        error: function(error) {
          instance.onSaveError(error, channel);
        }
      };
      return callback;
    },
    onSaveSuccess: function(object, channel) {
      var returnURL;
      if (object.success) {
        Cetabo.EventDistpatcher.use(channel).trigger("notification.show", "Map successfully saved");
        returnURL = this.getConfiguration().url.back;
        setInterval((function() {
          window.location.replace(returnURL);
        }), 2000);
      } else {
        Cetabo.EventDistpatcher.use(channel).trigger("notification.show", "An error has occurred");
      }
    },
    onExportSuccess: function(object, channel) {
      var returnURL;
      if (object.success) {
        returnURL = this.getConfiguration().url["export"];
        setInterval((function() {
          window.location.replace(returnURL);
        }), 2000);
      } else {
        Cetabo.EventDistpatcher.use(channel).trigger("notification.show", "An error has occurred");
      }
    },
    onSaveError: function(error, channel) {
      Cetabo.EventDistpatcher.use(channel).trigger("notification.show", "An critical error has occurred");
    },
    edit: function() {
      window.location.replace(this.getConfiguration().url.edit);
    },
    onUpdateMapSize: function(width, height) {
      if (this.isReadOnly()) {
        this.find(".cmap-container").width(width).height(height);
      }
    },
    loadModel: function(id) {
      Cetabo.EditableMapView.__super__.loadModel.apply(this, arguments);
      Cetabo.EventDistpatcher.use(this.getChannel()).trigger("overlay.show");
    },
    onMapLoaded: function() {
      var channel;
      channel = this.getChannel();
      setTimeout(function() {
        return Cetabo.EventDistpatcher.use(channel).trigger("overlay.hide");
      }, 2000);
    },
    "export": function() {
      

    }
  });

}).call(this);
;(function() {
  jQuery(function() {
    if (typeof __cetaboMapBootstrap === "function") {
      __cetaboMapBootstrap();
    }
    /*$$$IS_LIGHT_REGION_START$$$*/

    jQuery('body').tooltip({
      selector: '.c-disabled',
      title: 'This feature is avaialble only in full version.',
      placement: 'left'
    });
    jQuery('.c-disabled').tooltip({
      container: 'body',
      title: 'This feature is avaialble only in full version.',
      placement: 'left'
    });
    /*$$$IS_LIGHT_REGION_END$$$*/

  });

}).call(this);
