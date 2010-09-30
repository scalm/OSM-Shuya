OSM.Geometry.Node = Class.create(OSM.Geometry.Entity, {

    /** @param {Function} $super
     * @param {OSM.Node} node */
    initialize: function($super, node) {
        $super(node);
        this.geometry = new OpenLayers.Geometry.Point(node.getLon(), node.getLat());
    }
});

