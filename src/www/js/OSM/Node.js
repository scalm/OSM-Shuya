OSM.Node = Class.create(OSM.Entity, {

    /**
     * @param {Function} $super
     * @param {Element} domNodeElement
     * @type OSM.Node
     */
    initialize: function($super, domNodeElement) {
        $super(domNodeElement);
        if (domNodeElement!=undefined) {
            /** @type Number */
            this.lat = parseFloat(domNodeElement.getAttribute("lat"));
            /** @type Number */
            this.lon = parseFloat(domNodeElement.getAttribute("lon"));
        }
    },

    /** @type Number */
    getLat: function() {
        return this.lat;
    },

    /** @type Number */
    getLon: function() {
        return this.lon;
    },

    /** @type OpenLayers.LonLat */
    getLonLat: function() {
        return new OpenLayers.LonLat(this.lon, this.lat);
    },

    /**
     * @param {OSM.Node} node
     * @type void
     */
    update: function($super, node) {
        $super(node);
        if (node.lat!==undefined) {
            this.lat = node.lat;
        }
        if (node.lon!==undefined) {
            this.lon = node.lon;
        }
    }

});

