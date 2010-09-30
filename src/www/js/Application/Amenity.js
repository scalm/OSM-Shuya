Application.Amenity = Class.create({

    /** @param {Shuya} shuya */
    initialize: function(shuya) {
        /** @type Object */
        this.events = {
            /**
             * @type Function[]
             */
            onUpdate: $A()
        };

        /** @type Shuya */
        this.shuya = shuya;
        this.shuya.osm.observe("onUpdate", this.onSuccess.bind(this));
        /** @type Hash */
        this.amenity = $H();
    },

    /** @type Hash */
    getAmenity: function() {
        return this.amenity;
    },

    /** @type void */
    load: function() {
        this.shuya.loadOSM('data/Amenity.xml');
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
        var old = this.amenity.size()
        var _this = this;
        osm.getObjects().each(function(pair) {
            if (pair.value.hasTag('amenity')) {
                _this.amenity.set(pair.key, pair.value);
            }
        });
        
        this.fire("onUpdate");
    }
}, EventSupport);