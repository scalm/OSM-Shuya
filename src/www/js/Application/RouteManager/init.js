/**
 * @class Manage routes
 */
Application.RouteManager = Class.create({

    /**
     * @constructor
     * @param {OSM.Route} route Producer for routes.
     */
    initialize: function(route)
    {
        /** @private @type OSM.Amenity */
        this.route = route;
        this.route.observe("onUpdate", this.onRouteUpdate.bind(this));

        /** @private @type Element */
        this.toolWindow = new Application.RouteManager.ToolWindow(this);
        
        Tab.add(new Tab.Tab("Маршруты", this.onSelectTab.bind(this)));

        /** @private @type OpenLayers.Layer.Vector */
        this.layer = new Application.EntityLayer( "Routes", {
            visibility: false,
            styleMap: this.styleMap
        });
        application.map.addLayer(this.layer);

        this.layer.selectControl.onHighlight  = function(feature) {
            if (this.popupHideTimer) {
                window.clearInterval(this.popupHideTimer);
            }
            if (!this.layer.dontPopup)
                this.showTooltip(feature.attributes.entity);
        }.bind(this);

        this.layer.selectControl.onUnhighlight  = function() {
            if (this.popup) {
                this.popupHideTimer = window.setTimeout(this.showTooltip.bind(this), 5000, null);
            }
        }.bind(this);


        /** @private @type Application.Route.Filter */
        this.filter = null;
        //[442943842.5, 221471921.25, 110735960.625, 55367980.3125,
        //27683990.15625, 13841995.078125, 6920997.5390625, 3460498.76953125,
        //1730249.384765625, 865124.6923828125, 432562.34619140625, 216281.17309570312,
        //108140.58654785156, 54070.29327392578, 27035.14663696289, 13517.573318481445]
        var rule = new RouteRule({
            route: this.route,
            type: 'Line',
            maxScaleDenominator: 432562.34619140625
        });

        var rulePoint = new RouteRule({
            route: this.route,
            type: 'Point',
            maxScaleDenominator: 216281.17309570312
        });

        this.styleMap.styles['default'].addRules([rule, rulePoint]);
    },

    /** @private @type OpenLayers.StyleMap */
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
            fillOpacity: 1,
            display: ''
        },
        "select": {
            strokeWidth: 3,
            strokeColor: '#800000',
            fillColor: '#00FF00',
            pointRadius: 5,
            strokeOpacity: 1,
            fillOpacity: 1,
            display: ''
        }
    }),

    /**
     * Invokes when producer for routes gives new data.
     *
     * @private @event
     * @param {Application.Route} route Producer for routes.
     * @type void
     */
    onRouteUpdate: function(route) {
        this.toolWindow.updateList(this.route.getHash());
        this.updateLayer();
    },

    /**
     * Set filter and update dependencies.
     *
     * @param {Application.Route.Filter} filter
     */
    setFilter: function(filter) {
        /*this.filter = filter;
        this.toolWindow.updateList(this.route.getHash());
        this.updateLayer();*/
    },

    /**
     * Show tooltip with route details.
     *
     * @private
     * @param {OSM.Entity} entity OSM entity
     * @type void
     */
    showTooltip: function(entity) {
        if(entity == null) {
            if(this.popup) application.map.removePopup(this.popup);
            return;
        }
        this.popup = new Application.EntityPopup(application.map, entity, {
            zoom: function(entity) {
                this.layer.zoomToEntity(entity);
            }.bind(this)
        });
        application.map.addPopup(this.popup, true);
    },

    /** @private @type Application.EntityPopup */
    popup: null,

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
                var entity = application.osm.get(member.getRef());
                if(!this.layer.getFeatureBy('entity', entity)) {
                    this.layer.addEntity(entity);
                }
            }, this);
        }, this);
    },

    /**
     * Invokes when tab was selected.
     *
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
     * Show or hide gui of this routes manager.
     * 
     * @param {Boolean} show
     * @type void
     */
    showElements: function(show) {
        if (show===undefined) show = true;
        this.layer.setVisibility(show);
        this.toolWindow.visible(show);
    }

});

/**
 * Implements rule that produces color for route.
 */
var RouteRule = OpenLayers.Class(OpenLayers.Rule, {

    /**
     * @constructor
     * @param {Object} options
     */
    initialize: function(options) {
        OpenLayers.Rule.prototype.initialize.apply(this, arguments);
    },

    /**
     * Evaluate rule.
     *
     * @param {OpenLayers.Feature.Vector}
     */
    evaluate: function(feature) {
        var applies = true;
        if (this.type) {
            var prefix = OpenLayers.Style.prototype.getSymbolizerPrefix(feature.geometry);
            applies = this.type == prefix;
        }
        if (applies) {
            applies = OpenLayers.Rule.prototype.evaluate.apply(this, arguments);
        }
        if (applies) {
            var entity = feature.attributes.entity;
            if (entity) {
                var pair = this.route.getHash().find(function(pair) {
                    return (pair.value.getMembers().get(entity.getId()) !==undefined);
                });
                applies = !!pair;
                if (applies) {
                    var relation = pair.value;
                    var color = relation.getTag('colour');
                    this.symbolizer = this.symbolizer || {};
                    this.symbolizer.strokeColor = color;
                }
            } else {
                applies = false;
            }
        }
        return applies;
    }
});