Application.Map = OpenLayers.Class(OpenLayers.Map, {

    /** @type OpenLayers.Projection */
    epsg4326: new OpenLayers.Projection("EPSG:4326"),

    initialize: function(div, options) {
        OpenLayers.Lang.setCode('ru');

        this.measureControl = new Application.MeasureControl();
        this.toolbar = new OpenLayers.Control.Panel({
            displayClass: "controlToolbar"
        });
        this.toolbar.addControls([
            this.measureControl,
            new OpenLayers.Control.DragPan()
        ]);

        this.measureValueControl = new Application.MeasureValueControl(this.measureControl);

        options = {
            controls: options.controls || [
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.LayerSwitcher(),
                new OpenLayers.Control.Navigation(),
                //new OpenLayers.Control.PanZoom(),
                new OpenLayers.Control.PanZoomBar(),
                //new OpenLayers.Control.MouseToolbar(),
                new OpenLayers.Control.Permalink(),
                new OpenLayers.Control.MousePosition(),
                new OpenLayers.Control.OverviewMap(),
                new OpenLayers.Control.KeyboardDefaults(),
                this.toolbar,
                this.measureValueControl,
            ],
            displayProjection: this.epsg4326
        };
        OpenLayers.Map.prototype.initialize.call(this, div, options);
        this.initLayers();
    },

    initLayers: function() {
        this.namedLayers = {};

        this.namedLayers.mapnik = new OpenLayers.Layer.OSM.Mapnik("mapnik", {
            keyid: "mapnik",
            displayOutsideMaxExtent: false
            //wrapDateLine: true
        });
        this.addLayer(this.namedLayers.mapnik);

        this.namedLayers.osmarender = new OpenLayers.Layer.OSM.Osmarender("osmarender", {
            keyid: "osmarender",
            displayOutsideMaxExtent: true
            //wrapDateLine: true
        });
        this.addLayer(this.namedLayers.osmarender);

        this.namedLayers.cyclemap = new OpenLayers.Layer.OSM.CycleMap(("cycle_map"), {
            keyid: "cyclemap",
            displayOutsideMaxExtent: true
            //wrapDateLine: true
        });
        this.addLayer(this.namedLayers.cyclemap);

        /*var numZoomLevels = Math.max(
            this.namedLayers.mapnik.numZoomLevels,
            this.namedLayers.osmarender.numZoomLevels);*/
    },

    /**
     * Transform from EPSG4326 to map projection.
     *
     * @param {OpenLayers.Geometry} g
     * @type OpenLayers.Geometry */
    transformTo: function(g) {
        return g.clone().transform(this.epsg4326, this.getProjectionObject());
    },

    /**
     * Transform from map projection to EPSG4326.
     * 
     * @param {OpenLayers.Geometry} g
     * @type OpenLayers.Geometry */
    transformFrom: function(g) {
        return g.clone().transform(this.getProjectionObject(), this.epsg4326);
    },

    /**
     * Get EPSG4326 center of map.
     *
     * @type OpenLayers.Geometry
     */
    getMapCenter: function () {
        return this.transformFrom(this.getCenter());
    },

    /**
     * Set EPSG4326 center of map.
     */
    setMapCenter: function (center, zoom) {
        zoom = parseInt(zoom);
        var numzoom = this.getNumZoomLevels();
        if (zoom >= numzoom) zoom = numzoom - 1;
        this.setCenter(this.transformTo(center), zoom);
    },

    /**
     * Get EPSG4326 position of event
     */
    getEventPosition: function (event) {
        return this.transformFrom(this.getLonLatFromViewPortPx(event.xy));
    }


});