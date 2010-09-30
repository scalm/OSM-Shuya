/** @class */
var Shuya = Class.create({

    /** @constructor */
    initialize: function() {
        /** @type Application.Map */
        this.map = null;
        /** @type OpenLayers.Projection */
        this.epsg4326 = new OpenLayers.Projection("EPSG:4326");
        /** @type OSM */
        this.osm = new OSM();
    },

    /** @param {String} url
     * @param {Function} success
     * @type void
     */
    loadOSM: function(url, success) {
        var _this = this;
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(req) {
                var document = req.responseXML;
                var osm = new OSM(document);
                _this.osm.update(osm);
                if(success != undefined) success(_this, osm);
            }
        });
    },

    /** @param {String} divName
     * @param {Object} options
     */
    createMap: function (divName, options) {
        OpenLayers.Lang.setCode('ru');
        options = options || {};

        this.map = new Application.Map(divName, {});

        this.initLayers();
        //OSMTransport.initialize();
        //OSMAmenity.initialize();
        
        this.initControls();

        /** @type Application.Amenity */
        this.amenity = new Application.Amenity(this);
        this.amenityManager = new Application.AmenityManager(this, this.amenity, $('amenityBar'));
        this.amenity.load();
    },

    initLayers: function()
    {
        /*this.layers.markers = new OpenLayers.Layer.TextMarkers("Markers", {
            displayInLayerSwitcher: false,
            numZoomLevels: numZoomLevels,
            maxExtent: new OpenLayers.Bounds(-20037508,-20037508,20037508,20037508),
            maxResolution: 156543,
            units: "m",
            projection: "EPSG:900913"
        });
        this.map.addLayer(this.layers.markers);*/

    },

    initControls: function()
    {
        // MyMeasure.init();

        /*
        vlayer = new OpenLayers.Layer.Vector( "Editable", {
            projection: "EPSG:4326"
        });
        this.map.addLayer(vlayer);
        var editingToolbar = new OpenLayers.Control.EditingToolbar(vlayer)
*/
        
        /*editingToolbar.addControls(new OpenLayers.Control.MyMeasure());
        


        var output = new OpenLayers.Control({
            displayClass: 'olControlMeasureValue'
        });
        OpenLayers.Util.extend(output, {


            draw: function() {
                OpenLayers.Control.prototype.draw.apply(this,arguments);
                //this.div.setClassName('meas');
                if(!this.element) {
                    this.element = document.getElementById('output');
                    this.div.appendChild(this.element);
                }
                //this.div = document.createElement('div');
                return this.div;
            }

        });

        this.map.addControl(output);*/
        
        //SearchManager.initialize(document.getElementById('searchBar'));
        //SearchNameManager.initialize(document.getElementById('searchNameBar'));
        //RouteManager.initialize(document.getElementById('routeBar'));
        //AmenityManager.initialize(document.getElementById('amenityBar'));

        // searchbar
        /*var searchButton = new OpenLayers.Control.Button({
            displayClass: 'olControlSearch',
            trigger: function() {
                SearchManager.toggleSidebar();
            },
            type: OpenLayers.TYPE_TOGGLE});

        editingToolbar.addControls(searchButton);

        this.map.addControl(editingToolbar);

*/
    },


    getArrowIcon: function () {
        var size = new OpenLayers.Size(25, 22);
        var offset = new OpenLayers.Pixel(-30, -27);
        var icon = new OpenLayers.Icon("/images/arrow.png", size, offset);

        return icon;
    },

    // popups
    popup: null,

    // Markers
    addMarkerToMap: function (position, icon, description) {
        var marker = new OpenLayers.Marker(position.clone().transform(this.epsg4326, map.getProjectionObject()), icon);

        this.layers.markers.addMarker(marker);

        if (description) {
            marker.events.register("mouseover", marker, function() {
                Shuya.openMapPopup(marker, description)
            });
            marker.events.register("mouseout", marker, function() {
                Shuya.closeMapPopup()
            });
        }

        return marker;
    },


    // Layers setup
    getMapLayers: function () {
        var layerConfig = "";
        var layers, i;
        for (layers = this.map.getLayersBy("isBaseLayer", true), i = 0; i < layers.length; i++) {
            layerConfig += layers[i] == map.baseLayer ? "B" : "0";
        }

        for (layers = this.map.getLayersBy("isBaseLayer", false), i = 0; i < layers.length; i++) {
            layerConfig += layers[i].getVisibility() ? "T" : "F";
        }

        return layerConfig;
    },

    setMapLayers: function(layerConfig) {
        var l = 0;
        var layers, i, c;

        for (layers = this.map.getLayersBy("isBaseLayer", true), i = 0; i < layers.length; i++) {
            c = layerConfig.charAt(l++);

            if (c == "B") {
                this.map.setBaseLayer(layers[i]);
            }
        }

        while (layerConfig.charAt(l) == "B" || layerConfig.charAt(l) == "0") {
            l++;
        }

        for (layers = this.map.getLayersBy("isBaseLayer", false), i = 0; i < layers.length; i++) {
            c = layerConfig.charAt(l++);

            if (c == "T") {
                layers[i].setVisibility(true);
            } else if(c == "F") {
                layers[i].setVisibility(false);
            }
        }
    }

});