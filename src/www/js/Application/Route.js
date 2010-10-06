Application.Route = Class.create({

    initialize: function() {
        /** @type Object */
        this.events = {
            /**
             * @type Function[]
             */
            onUpdate: $A()
        };

        application.osm.observe("onUpdate", this.onSuccess.bind(this));
        /** @type Hash */
        this.hash = $H();
    },

    /** @type Hash */
    getHash: function() {
        return this.hash;
    },

    /** @type void */
    load: function() {
        application.loadOSM('data/RouteRelations.xml');
    },

    /**
     * @param {OSM} osm
     * @param {OSM} delta
     * @type void
     * @event
     * */
    onSuccess: function(osm, delta) {
        this.update(delta);
    },

    /**
     * @param {OSM} osm
     * @type void
     */
    update: function(osm) {
        var _this = this;
        osm.getObjects().each(function(pair) {
            if ((pair.value instanceof OSM.Relation) &&
                (pair.value.getTag('type') == 'route')) {
                _this.hash.set(pair.key, pair.value);
            }
        });
        
        this.fire("onUpdate");
    }
}, EventSupport);