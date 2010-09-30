var EntityList = Class.create({

    /**
     * @param {OSM.Entity, Array, Hash} entities
     */
    initialize: function(entities) {
        this.events = {
            onUpdate: $A()
        }

        this.list = $H();

        if (entities) this.put(entities);
    },

    /**
     * @param {OSM.Entity, Array, Hash} entities
     */
    put: function(entities) {        
        if (entities instanceof Array) {
            entities.each(function(e) { this.set(e.getId(), e)}, this.list);
        } else if (entities instanceof Hash) {
            this.list.update(entities);
        } else if (entities instanceof OSM.Entity) {
            this.list.set(entities.getId(), entities);
        }
    },

    clear: function() {
        this.list = $H();
    },
    
    /** 
     * @type Hash
     */
    getList: function() {
        return this.list;
    },
    
    /**
     * @type Number
     */
    getSize: function() {
        return this.list.size();
    },

    /**
     * @param {Number} id
     * @type OSM.Entity
     */
    get: function(id) {
        return this.list[id];
    },

    update: function() {
        this.fire("onUpdate");
    }
}, EventSupport);