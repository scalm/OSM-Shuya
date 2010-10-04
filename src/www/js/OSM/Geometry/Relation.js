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
        members.each(function(pair) {
            var member = pair.value;
            if(member.getType()=='way') {
                way = new OSM.Geometry.Way(osm.get(member.getRef()), osm);
                collection.push(way.getGeometry());
            }
            else
            if(member.getType()=='node') {
                node = new OSM.Geometry.Node(osm.get(member.getRef()));
                collection.push(node.getGeometry());
            }
        });
        this.geometry = new OpenLayers.Geometry.Collection(collection);
    }
});



