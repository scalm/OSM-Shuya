OSM.Relation = Class.create(OSM.Entity, {

    /** @param {Element} domRelationElement */
    initialize: function($super, domRelationElement) {
        $super(domRelationElement);
        /** @type OSM.Relation.Member[] */
        this.members = [];
        if (domRelationElement!=undefined) {
            domNodes = $A(domRelationElement.childNodes);
            domNodes.each(
                function(n) {
                    if(n.nodeType==Node.ELEMENT_NODE && n.tagName=='member') {
                        this.members.push(new OSM.Relation.Member(n));
                    }
                },
                this
            );
        }
    },

    /**
     * @param {OSM.Relation} relation
     * @type void
     */
    update: function($super, relation) {
        $super(relation);
        if (relation.getMembers().length) {
            this.members = relation.getMembers();
        }
    },

    /** @type OSM.Relation.Member[] */
    getMembers: function() {
        return this.members;
    }

});


OSM.Relation.Member = Class.create({

    /** @param {Element} domMemberElement */
    initialize: function(domMemberElement) {
        if (domMemberElement!=undefined) {
            /** @type Number */
            this.ref = parseInt(domMemberElement.getAttribute('ref'));
            /** @type String */
            this.type = domMemberElement.getAttribute('type');
            /** @type String */
            this.role = domMemberElement.getAttribute('role');
        } else {

        }
    },
    
    /** @type Number */
    getRef: function() {
        return this.ref;
    },
    
    /** @type String */
    getType: function() {
        return this.type;
    },

    /** @type String */
    getRole: function() {
        return this.role;
    }
});




