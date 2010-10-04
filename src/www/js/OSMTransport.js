var OSMTransport = {
    routes: new Array(),

    layer: null,

    initialize: function() {
        var caller = this;
        OSMXML.load('data/RouteRelations.xml', function() {
            caller.update();
            RouteManager.updateList();
        });


        this.layer = new OpenLayers.Layer.Vector( "Transport", {
            projection: "EPSG:4326"
        });
        Shuya.map.addLayer(this.layer);
    },

    update: function() {
        OSMTransport.processRelations();
        OSMTransport.updateFeatures();
    },

    processRelations: function() {
            var rels = OSMXML.document.getElementsByTagName('relation');
            for(var i = 0; i < rels.length; i++) {
                var rel = rels.item(i);
                if(OSMXML.getTag(rel, "type")=="route")
                    this.processRouteRelation(rel);
            }
    },

    processRouteRelation: function(rel) {
        var g = OSMGeometry.getRelationGeometry(rel);
        this.routes[rel.getAttribute('id')] = {
            id: rel.getAttribute('id'),
            geometry: g,
            relation: rel
        };
    },

    //** @return OpenLayers.Layer */
    getLayer: function() {
        return this.layer;
    },

    updateFeatures: function() {
        for(var i in this.routes) {
            var route = this.routes[i];
            mline = route.geometry.transform(Shuya.epsg4326, Shuya.map.getProjectionObject());

            route.color = this.getRouteColor(route.relation);
            route.feature = new OpenLayers.Feature.Vector(mline, {}, {
                strokeWidth: 3,
                strokeColor: route.color,
                fillColor: route.color,
                pointRadius: 3,
                strokeOpacity: 0.5,
                fillOpacity: 0.5

            })

            this.layer.addFeatures([route.feature]);

        }
    },

    getRouteColor: function(rel) {
        var color = OSMXML.getTag(rel, "colour");

        if(color==null) {
            var colors = ['red', 'green', 'blue', 'yellow', 'maroon', 'navy'];
            color = colors[Math.round(Math.random()*colors.length)];
        }
        return color;
    },

    toogle: function(route) {
        if(this.layer.getFeatureById(route.feature.id)) {
            this.layer.removeFeatures([route.feature]);
            return false;
        } else {
            this.layer.addFeatures([route.feature]);
            return true;
        }
    },

    getRouteMembers: function(route) {
            var members = route.relation.getElementsByTagName("member");

            var result = new Array();
            for(var i = 0; i < members.length; i++) {
                var member = members[i];
                var mtype = member.getAttribute('type');
                if(mtype=='way' || mtype=='node') {
                    var ref = member.getAttribute('ref');
                    var e = OSMXML.getElementById(ref);
                    if(e)
                        result.push(e);
                    else alert("not found: "+mtype+" #"+ref);
                }
            }

            return result;
    },

    selectedFeature: null,

    selectMember: function(member) {
        if(this.selectedFeature) {
            this.layer.removeFeatures([this.selectedFeature]);
            this.selectedFeature = null;
        }

        if(member) {
            var g;
            if(member.tagName=='way') {
                g = OSMGeometry.getWayGeometry(member);
            } else if(member.tagName=='node') {
                g = OSMGeometry.getNodeGeometry(member);
            }
            if(g) {
                g = g.clone().transform(Shuya.epsg4326, Shuya.map.getProjectionObject());

                f = new OpenLayers.Feature.Vector(g, {}, {
                    pointRadius: 6,
                    strokeWidth: 4,
                    strokeColor: 'maroon',
                    fillColor: 'maroon',
                    opacity: 1
                })

                this.selectedFeature = f;
                this.layer.addFeatures([this.selectedFeature]);
            }
        }
    },

    nodeListToArray:function(nodeList) {
        var a = new Array();
        for(var i=0; i<nodeList.length; i++) {
            a.push(nodeList[i]);
        }
        return a;
    },

    buildFullPath: function(rel) {
        var membersArray = nodeListToArray(rel.getElementsByTagName("member"));
        var members = new Array();
        for(var i in memersArray) {
            if(membersArray[i].getAttribute('type')=='way') {
                member.push(membersArray[i]);
            }
        }
        var path = new Array();
        var ref;
        var way;
        var currentMember;
        var memberIndex = -1;
        var done = members.length==0;
        var lastConnectors = null;
        while(!done) {

            // first member
            if(currentMember==null) {
                memberIndex = 0;
                currentMember = members[memberIndex];
                path.push({
                    member: currentMember,
                    index: memberIndex,
                    direction: 'forward'
                });
            }

            // next member as member next index
            var tryMemberIndex = memberIndex + 1;
            if(tryMemberIndex<members.length) {
                var tryMember = members[tryMemberIndex];
                var connectors = memberConnectors(
                    OSMXML.getElementById(currentMember.getAttribute('ref')),
                    OSMXML.getElementById(tryMember.getAttribute('ref')));
                if(connectors) {
                    if(lastConnectors==null) {

                    }
                }
            }

        }

        var path = new Array();
        var direction = 'none';
        for(i in ways) {
            way = ways[i];
            switch(direction) {
                case 'none':
                    path.push(way);
                    direction = 'forward';
                    break;
                case 'forward':
                    break;
            }
        }
    },

    wayConnectors: function(way1, way2) {
        var nds1 = way1.getElementsByTagName("nd");
        var nds2 = way2.getElementsByTagName("nd");

        if(nds1.length==0) return null;
        if(nds2.length==0) return null;

        var startRef1 = nds1.item(0).getAttribute('ref');
        var endRef1 = nds1.item(nds1.length-1).getAttribute('ref');

        var startRef2 = nds2.item(0).getAttribute('ref');
        var endRef2 = nds2.item(nds2.length-1).getAttribute('ref');

        if(endRef1==startRef2) {
            return {direction1: 'forward', direction2: 'forward'};
        } else
        if(endRef1==endRef2) {
            return {direction1: 'forward', direction2: 'backward'};
        } else
        if(startRef1==endRef2) {
            return {direction1: 'backward', direction2: 'forward'};
        }
        if(startRef1==startRef2) {
            return {direction1: 'backward', direction2: 'backward'};
        }
        return null;
    },

    getWayNodes: function(way) {
        var nodeRefs = way.getElementsByTagName("nd");
        var nodes = new Array();
        for(var i=0; i<nodeRefs.length; i++) {
            nodes.push(OSMXML.getElementById(nodeRefs[i].getAttribute('id')));
        }
        return nodes;
    }




}