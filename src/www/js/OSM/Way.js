OSM.Way = Class.create(OSM.Entity, {

    /** @param {Element} domWayElement */
    initialize: function($super, domWayElement) {
        $super(domWayElement);
        /** @type Number[] */
        this.nodes = [];
        if (domWayElement!=undefined) {
            domNodes = $A(domWayElement.childNodes);
            domNodes.each(
                function(n) {
                    if(n.nodeType==Node.ELEMENT_NODE && n.tagName=='nd') {
                        var refId = parseInt(n.getAttribute('ref'));
                        this.nodes.push(refId);
                    }
                },
                this
            );
        }
    },

    /** @param {Function} $super
     * @param {OSM.Way} way
     * @type void
     */
    update: function($super, way) {
        $super(way);
        if (way.getNodes().length) {
            this.nodes = way.getNodes();
        }
    },

    /** @type Number[] */
    getNodes: function() {
        return this.nodes;
    },

    /** @type Boolean */
    isClosed: function() {
        return (this.nodes.length > 2) && (this.nodes[0] == this.nodes[this.nodes.length-1]);
    }

});