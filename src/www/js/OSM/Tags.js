
OSM.Tags = Class.create({

    /** @param {Element} domElement
     * @type OSM.Tags
     */
    initialize: function(domElement) {
        /** @type String[] */
        this.list = [];
        if (domElement != undefined) {
            domNodes = $A(domElement.childNodes);
            domNodes.each(
                function(n) {
                    if(n.nodeType==Node.ELEMENT_NODE) {
                        this.set(n.getAttribute("k"), n.getAttribute("v"))
                    }
                },
                this
            );
        }
    },

    /** @param {String} name
     * @type String
     */
    get: function(name) {
        return this.list[name];
    },

    /**
     * @param {String} name
     * @param {String} value
     * @type void
     */
    set: function(name, value) {
        return this.list[name] = value;
    },

    /** @type String[] */
    getList: function() {
        return this.list;
    },

    /** @param {String} name
     * @type Boolean */
    has: function(name) {
        return this.list[name] != undefined;
    },

    /** @type Number */
    getSize: function() {
        return this.list.length;
    }

});
