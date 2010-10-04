/**
 * @namespace OSM
 */
OSM.Geometry = {
    /**
     * Factory-function for OSM.Geometry.Entity subclasses
     *
     * @param {OSM.Entity} entity
     * @param {OSM} osm
     * @type OSM.Geometry.Entity */
    getGeometry: function(entity, osm) {
        /** @type {OSM.Geometry.Entity */
        var geometry = undefined;
        if (entity instanceof OSM.Node) {
            geometry = new OSM.Geometry.Node(entity);
        } else if (entity instanceof OSM.Way) {
            geometry = new OSM.Geometry.Way(entity, osm);
        } else if (entity instanceof OSM.Relation) {
            geometry = new OSM.Geometry.Relation(entity, osm);
        }
        return geometry;
    }
};