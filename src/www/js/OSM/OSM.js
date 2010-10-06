/**
 * @class Class for load and store OSM data.
 */
var OSM = Class.create({
    /**
     * @constructor
     * @param {Document} domDocument
     */
    initialize: function(domDocument) {
        /**
         * @type Hash
         */
        this.objects = $H();
        /**
         * Object contains event handlers for named events.
         *
         * @type Object
         */
        this.events = {
            /**
             * Array of handlers for 'onUpdate' event.
             *
             * @type Function[]
             */
            onUpdate: $A()
        };


        if (domDocument != undefined) {
            var domNode = domDocument.documentElement.firstChild;
            while (domNode) {
                if (domNode.nodeType == Node.ELEMENT_NODE) {
                    var object = undefined;
                    if (domNode.tagName == 'node') {
                        object = new OSM.Node(domNode);
                    } else if (domNode.tagName == 'way') {
                        object = new OSM.Way(domNode);
                    } else if (domNode.tagName == 'relation') {
                        object = new OSM.Relation(domNode);
                    }
                    if (object) {
                        this.objects.set(object.getId(), object);
                    }
                }
                domNode = domNode.nextSibling;
            }
        }
    },

    /**
     * Update OSM data from another OSM data
     *
     * @public
     * @param {OSM} osm
     * @type void
     */
    update: function(osm) {
        osm.objects.each(function(pair) {
            var object = this.objects.get(pair.key);
            if (object) {
                object.update(pair.value);
            } else {
                this.objects.set(pair.key, pair.value);
            }
        }, this);
        this.fire('onUpdate', osm);
    },

    /**
     * Get object by id
     * 
     * @public
     * @param {Number} id
     * @type OSM.Entity
     */
    get: function(id) {
        return this.objects.get(id);
    },

    /**
     * Get list of object
     *
     * @public
     * @type Hash
     */
    getObjects: function() {
        return this.objects;
    }
    
}, EventSupport);

