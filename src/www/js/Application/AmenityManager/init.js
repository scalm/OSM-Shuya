/**
 * @class Amenity manager
 */
Application.AmenityManager = Class.create({

    /**
     * @constructor
     * @param {OSM.Amenity} amenity
     */
    initialize: function(amenity)
    {
        /** @private @type OSM.Amenity */
        this.amenity = amenity;
        this.amenity.observe("onUpdate", this.onAmenityUpdate.bind(this));

        /** @private @type Element */
        this.toolWindow = new Application.AmenityManager.ToolWindow(this);
        
        Tab.add(new Tab.Tab("Достопримечательности", this.onSelectTab.bind(this)));

        /** @private @type OpenLayers.Layer.Vector */
        this.layer = new Application.EntityLayer( "Amenity", {
            visibility: false,
            styleMap: this.styleMap
        });
        application.map.addLayer(this.layer);

        this.layer.selectControl.onHighlight  = function(feature) {
            if (this.popupHideTimer) {
                window.clearInterval(this.popupHideTimer);
            }
            this.showAmenityTooltip(feature.attributes.entity);
        }.bind(this);

        this.layer.selectControl.onUnhighlight  = function() {
            this.popupHideTimer = window.setTimeout(this.showAmenityTooltip.bind(this), 5000, null)
        }.bind(this);



        /** @private @type Application.Amenity.Filter */
        this.filter = null;

    },

    /** @public @static @type OpenLayers.StyleMap */
    styleMap: new OpenLayers.StyleMap({
        "default": {
            strokeWidth: 1,
            strokeColor: '#800000',
            fillColor: '#FF0000',
            pointRadius: 3,
            strokeOpacity: 0.5,
            fillOpacity: 0.5
        },
        "highlight": {
            strokeWidth: 2,
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
            strokeOpacity: 0.5,
            fillOpacity: 0.5
        }
    }),

    /**
     * @private @event
     * @param {Application.Amenity} amenity
     * @type void
     */
    onAmenityUpdate: function(amenity) {
        this.toolWindow.updateList(this.amenity.getAmenity());
        this.updateLayer();
    },

    /**
     * @param {Application.Amenity.Filter} filter
     */
    setFilter: function(filter) {
        this.filter = filter;
        this.toolWindow.updateList(this.amenity.getAmenity());
        this.updateLayer();
    },

    /**
     * Show tooltip with amenity details.
     *
     * @private
     * @param {OSM.Entity} amenity
     * @type void
     */
    showAmenityTooltip: function(amenity) {
        if(amenity == null) {
            if(this.popup) application.map.removePopup(this.popup);
            return;
        }
        this.popup = new Application.EntityPopup(application.map, amenity, {
            zoom: function(amenity) {
                this.layer.zoomToEntity(amenity);
            }.bind(this)
        });
        application.map.addPopup(this.popup, true);
    },

    /** @private @type Application.EntityPopup */
    popup: null,

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
        var eList = this.amenity.getAmenity();
        if (this.filter) {
            eList = eList.filter(this.filter.filter, this.filter);
        }
        this.layer.addEntities(eList); 
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