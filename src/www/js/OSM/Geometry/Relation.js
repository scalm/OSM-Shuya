OSM.Geometry.Relation = Class.create(OSM.Geometry.Entity, {

    /**
     * @param {Function} $super
     * @param {OSM.Relation} relation
     * @param {OSM} osm
     **/
    initialize: function($super, relation, osm)
    {
        $super(relation);
        var members = relation.getMembers();

        var collection = new Array();
        var way;
        var node;
        for(var member in members) {
            if(member.getType()=='way') {
                way = new OSM.Geometry.Way(osm.get(member.getId()), osm);
                collection.push(way.getGeometry());
            }
            else
            if(member.getType()=='node') {
                node = new OSM.Geometry.Node(osm.get(member.getId()));
                collection.push(node.getGeometry());
            }
        }
        this.geometry = new OpenLayers.Geometry.Collection(collection);
    }
});



