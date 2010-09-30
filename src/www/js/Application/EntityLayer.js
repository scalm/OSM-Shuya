Application.EntityLayer = OpenLayers.Class(OpenLayers.Layer.Vector, {

    initialize: function(name, options) {
        options = Object.extend(options, {
            projection: "EPSG:4326",
            units: "degrees",
            maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90)
        });
        OpenLayers.Layer.Vector.prototype.initialize.call(this, name, options);

        /** @type Application.SelectFeatureEx */
        this.selectControl = new Application.SelectFeatureEx(this, {
            hover: true,
            highlightOnly: false,
            highlighting: true,
            scope: this
        });
    },

    setMap: function(map) {
        if (map) {
            map.addControl(this.selectControl);
              this.selectControl.activate();
        }
        OpenLayers.Layer.Vector.prototype.setMap.call(this, map);
    },

    removeMap: function(map) {
        if (map) {
            this.selectControl.deactivate();
            map.removeControl(this.selectControl);
        }
        OpenLayers.Layer.Vector.prototype.removeMap.call(this, map);
    },

    /**
     * Set selection to passed entity. Entity can be array. If entity is
     * null then seletion will be removed.
     *
     * @param {OSM.Entity} entity
     * @type void
     **/
    selectEntity: function(entity) {
        this.selectControl.unselectAll();
        if (entity) {
            if (!(entity instanceof Array)) entity = [entity];
            entity.each(function(e) {
                var feature = this.getFeatureBy('entity', e);
                if (feature) this.selectControl.select(feature);
            }, this);
        }
    },

    /**
     * @param {OSM.Entity} entity
     * @type void
     */
    highlightEntity: function(entity) {
        if (entity) {
            if (!(entity instanceof Array)) entity = [entity];
            entity.each(function(e) {
                var feature = this.getFeatureBy('entity', e);
                if (feature) this.selectControl.highlight(feature);
            }, this);
        }
    },


    /**
     * @param {OSM.Entity} entity
     * @type void
     */
    unhighlightEntity: function(entity) {
        if (entity) {
            if (!(entity instanceof Array)) entity = [entity];
            entity.each(function(e) {
                var feature = this.getFeatureBy('entity', e);
                if (feature) this.selectControl.unhighlight(feature);
            }, this);
        }
    },

    addEntity: function(entity) {
        if (!entity) return;
        this.addFeatures([this.getFeature(entity)]);
    },

    addEntities: function(entities) {
        if (!entities) return;
        var features = entities.map(this.getFeature, this);
        this.addFeatures(features);
    },

    removeAllEntities: function() {
        this.selectEntity(null);
        this.removeAllFeatures();
    },
    /**
     * Get feature by amenity.
     *
     * @param {OSM.Entity} entity
     * @type OpenLayers.Feature.Vector
     */
    getFeature: function(entity) {
        if (entity instanceof Array) entity = entity.value;
        var ge = OSM.Geometry.getGeometry(entity, this.osm);
        var g = ge.getGeometry();
        var gt = this.map.transformTo(g);
        var feature = new OpenLayers.Feature.Vector(gt, {gEntity: ge });
        feature.entity = entity;
        return feature;
    },

    /**
     * @param {OSM.Entity} entity
     * @type void
     */
    zoomToEntity: function(entity) {
        var feature = this.getFeatureBy('entity', entity);
        var ge = undefined;
        if (feature) {
            ge = feature.attributes.gEntity;
        } else {
            ge = OSM.Geometry.getGeometry(entity, this.osm);
        }
        var p = ge
            .getGeometry()
            .getCentroid();
        this.map.setMapCenter(new OpenLayers.LonLat(p.x, p.y), 17);
        if (feature) {
            this.selectControl.unselectAll();
            this.selectControl.select(feature)
        }
        return false;
    },

    CLASS_NAME: "Application.EntityLayer"

});