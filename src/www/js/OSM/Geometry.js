/** @type {OpenLayers.Geometry} */
OSM.Entity.prototype.geometry = null;

/**
 * @type {OpenLayers.Geometry}
 */
OSM.Entity.prototype.getGeometry = function() {
    return this.geometry;
}

/**
 * @type {OpenLayers.Geometry}
 */
OSM.Node.prototype.getGeometry = function() {
    if (!this.geometry) {
        this.geometry = new OpenLayers.Geometry.Point(this.getLon(), this.getLat());
    }
    return this.geometry;
}

/**
 * @type {OpenLayers.Geometry}
 */
OSM.Way.prototype.getGeometry = function() {
    if (!this.geometry) {
        var points = [];
        this.nodes.each(function(id) {
            var node = application.osm.get(id);
            points.push(node.getGeometry());
        });
        if(this.nodes.length>2 && this.nodes[0] == this.nodes[this.nodes.length-1])
            this.geometry = new OpenLayers.Geometry.LinearRing(points);
        else
            this.geometry = new OpenLayers.Geometry.LineString(points);
    }
    return this.geometry;
}

/**
 * @param {OSM} osm OSM
 * @type {OpenLayers.Geometry}
 */
OSM.Relation.prototype.getGeometry = function() {
    if (!this.geometry) {
        var collection = new Array();
        var way;
        var node;
        this.members.each(function(pair) {
            var member = pair.value;
            if(member.getType()=='way') {
                way = application.osm.get(member.getRef());
                collection.push(way.getGeometry());
            }
            else
            if(member.getType()=='node') {
                node = application.osm.get(member.getRef());
                collection.push(node.getGeometry());
            }
        });
        this.geometry = new OpenLayers.Geometry.Collection(collection);
    }
    return this.geometry;
}

/** @type OpenLayers.Geometry.Point */
OSM.Entity.prototype.getCenter = function() {
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