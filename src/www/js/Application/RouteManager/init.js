/**
 * @class Route manager
 */
Application.RouteManager = Class.create({

    /**
     * @constructor
     * @param {Shuya} shuya
     * @param {OSM.Route} route
     */
    initialize: function(shuya, route)
    {
        /**
         * @private
         * @deprecated
         * @type Shuya
         */
        this.shuya = shuya;

        /** @private @type Application.Map */
        this.map = shuya.map;

        /** @private @type OSM */
        this.osm = shuya.osm;

        /** @private @type OSM.Amenity */
        this.route = route;
        this.route.observe("onUpdate", this.onRouteUpdate.bind(this));

        /** @private @type Element */
        this.toolWindow = new Application.RouteManager.ToolWindow(this);
        
        Tab.add(new Tab.Tab("Маршруты", this.onSelectTab.bind(this)));

        /** @private @type OpenLayers.Layer.Vector */
        this.layer = new Application.EntityLayer( "Routes", {
            visibility: false,
            styleMap: this.styleMap,
            osm: this.osm
        });
        this.map.addLayer(this.layer);
/*
        this.layer.selectControl.onHighlight  = function(feature) {
            if (this.popupHideTimer) {
                window.clearInterval(this.popupHideTimer);
            }
            this.showAmenityTooltip(feature.attributes.gEntity);
        }.bind(this);

        this.layer.selectControl.onUnhighlight  = function() {
            this.popupHideTimer = window.setTimeout(this.showAmenityTooltip.bind(this), 5000, null)
        }.bind(this);
*/


        /** @private @type Application.Route.Filter */
        this.filter = null;

        var rule = new RouteRule({ route: this.route });
        
        this.styleMap.styles['default'].addRules([rule]);

    },

    /** @public @static @type OpenLayers.StyleMap */
    styleMap: new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({
            strokeWidth: 3,
            strokeColor: '#800000',
            fillColor: '#FF0000',
            pointRadius: 3,
            strokeOpacity: 0.5,
            fillOpacity: 0.5
        }),
        "highlight": {
            strokeWidth: 3,
            strokeColor: '#800000',
            fillColor: '#FF0000',
            pointRadius: 5,
            strokeOpacity: 1,
            fillOpacity: 1
        },
        "select": {
            strokeWidth: 3,
            strokeColor: '#800000',
            fillColor: '#00FF00',
            pointRadius: 5,
            strokeOpacity: 1,
            fillOpacity: 1
        }
    }),

    /**
     * @private @event
     * @param {Application.Route} route
     * @type void
     */
    onRouteUpdate: function(route) {
        this.toolWindow.updateList(this.route.getHash());
        this.updateLayer();
    },

    /**
     * @param {Application.Route.Filter} filter
     */
    setFilter: function(filter) {
        /*this.filter = filter;
        this.toolWindow.updateList(this.route.getHash());
        this.updateLayer();*/
    },

    /**
     * Show tooltip with amenity details.
     *
     * @private
     * @param {OSM.Geometry.Entity} gAmenity
     * @type void
     */
    /*showAmenityTooltip: function(gAmenity) {
        if(gAmenity == null) {
            if(this.popup) this.map.removePopup(this.popup);
            return;
        }
        this.popup = new Application.AmenityManager.Popup(this.map, gAmenity, {
            zoom: function(amenity) {
                this.layer.zoomToEntity(amenity);
            }.bind(this)
        });
        this.map.addPopup(this.popup, true);
    },*/

    /** @private @type Application.AmenityManager.Popup */
    //popup: null,

    /**
     * Invoke when feature was selected
     *
     * @private @event
     * @param {OpenLayers.Feature} feature
     * @type void
     */
    onSelectFeature: function(feature) {

    },

    /**
     * Invoke when feature was unselected
     * @private @event
     * @param {OpenLayers.Feature} feature
     * @type void
     */
    onUnselectFeature: function(feature) {

    },

    /**
     * Update layer, features on layer, apply new filter on amenities.
     *
     * @private
     * @type void
     */
    updateLayer: function() {
        this.layer.removeAllEntities();
        var eList = this.route.getHash();
        /*if (this.filter) {
            eList = eList.filter(this.filter.filter, this.filter);
        }*/
        //this.layer.addEntities(eList);

        eList.each(function(pair) {
            var relation = pair.value;
            relation.getMembers().each(function(pair) {
                var member = pair.value;
                var entity = this.osm.get(member.getRef());
                if(!this.layer.getFeatureBy('entity', entity)) {
                    this.layer.addEntity(entity);
                }
            }, this);
        }, this);
    },

    /**
     * @private @event
     * @param {Tab.Tab} tab
     * @param {Boolean} selected
     * @type void
     */
    onSelectTab: function(tab, selected) {
        // unselect
        if (!selected) {
            this.showElements(false);
        }
        // select first
        else if (!this.toolWindow.visible()) {
            this.showElements(true);
        }
        // select more
        else {
            this.toolWindow.hide();
        }
    },

    /**
     * @param {Boolean} show
     * @type void
     */
    showElements: function(show) {
        if (show===undefined) show = true;
        this.layer.setVisibility(show);
        this.toolWindow.visible(show);
    }

});

var RouteRule = OpenLayers.Class(OpenLayers.Rule, {

    initialize: function() {
        OpenLayers.Rule.prototype.initialize.apply(this, arguments);
    },

    evaluate: function(feature) {
        var applies = OpenLayers.Rule.prototype.evaluate.apply(this, arguments);
        if (applies) {
            var entity = feature.attributes.entity;
            if (entity) {
                var pair = this.route.getHash().find(function(pair) {
                    return (pair.value.getMembers().get(entity.getId()) !==undefined);
                });
                applies = !!pair;
                if (applies) {
                    relation = pair.value;
                    var color = relation.getTag('colour');
                    this.symbolizer = {
                        strokeColor: color
                    }
                }
            } else {
                applies = false;
            }
        };
        return applies;
    }
});