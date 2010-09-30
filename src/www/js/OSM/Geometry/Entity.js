OSM.Geometry.Entity = Class.create({

    /** @param {OSM.Entity} entity */
    initialize: function(entity) {
        /** @type OpenLayers.Geometry */
        this.geometry = null;
        /** @type OSM.Entity */
        this.entity = entity;
    },

    /** @type OpenLayers.Geometry */
    getGeometry: function() {
        return this.geometry;
    },

    /** @type OSM.Entity */
    getEntity: function() {
        return this.entity;
    },

    /** @type OpenLayers.Geometry.Point */
    getCenter: function() {
        if (this.geometry == null)
            return null;
        
        if (this.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point')
            return this.geometry;

        if (this.geometry.components && (this.geometry.components.length > 2)) {
            var sumX = 0.0;
            var sumY = 0.0;
            for (var i = 0; i < this.geometry.components.length; i++) {
                var c = this.geometry.components[i];
                sumX += c.x;
                sumY += c.y;
            }
            var x = sumX / (this.geometry.components.length);
            var y = sumY / (this.geometry.components.length);
            return new OpenLayers.Geometry.Point(x, y);
        } else {
            return null;
        }
    }

});

