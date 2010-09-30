/**
 * @namespace OSM
 *
 * @class Base class for OSM-entity.
 * @name Entity
 */
OSM.Entity = Class.create({
    /**
     * @constructor
     * @param {Element} [domElement] 
     */
    initialize: function(domElement) {
        if (domElement!=undefined) {
            /** @type Number */
            this.id = parseInt(domElement.getAttribute("id"));
            /** @type OSM.Tags */
            this.tags = new OSM.Tags(domElement);
        } else {
            /** @type OSM.Tags */
            this.tags = new OSM.Tags();
        }
    },

    /**
     * Update entity from given entity.
     *
     * @public @method
     * @param {OSM.Entity} entity Source entity.
     * @type void
     */
    update: function(entity) {
        if (entity.getTags().getSize()) {
            this.tags = entity.getTags();
        }
    },

    /**
     * Id attribute from OSM XML-node.
     *
     * @public @method
     * @type Number
     */
    getId: function() {
        return this.id;
    },

    /**
     * Tags object from OSM XML-node
     *
     * @public @method
     * @type OSM.Tags
     */
    getTags: function() {
        return this.tags;
    },

    /**
     * Value of tag
     *
     * @public @method
     * @param {String} name Name of tag
     * @type String
     */
    getTag: function(name) {
        return this.tags.get(name);
    },

    /**
     * Checks, has entity tag or not.
     *
     * @public @method
     * @param {String} name
     * @type Boolean
     */
    hasTag: function(name) {
        return this.tags.has(name);
    }
});