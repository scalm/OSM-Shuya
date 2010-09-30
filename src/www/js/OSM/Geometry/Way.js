OSM.Geometry.Way = Class.create(OSM.Geometry.Entity, {

    /**
     * @param {Function} $super
     * @param {OSM.Way} way
     * @param {OSM} osm
     **/
    initialize: function($super, way, osm)
    {
        $super(way);
        var points = [];
        var nodes = way.getNodes();
        nodes.each(function(id) {
            var node = new OSM.Geometry.Node(osm.get(id));
            points.push(node.getGeometry());
        });
        if(nodes.length>2 && nodes[0] == nodes[nodes.length-1])
            this.geometry = new OpenLayers.Geometry.LinearRing(points);
        else
            this.geometry = new OpenLayers.Geometry.LineString(points);
    }
});

