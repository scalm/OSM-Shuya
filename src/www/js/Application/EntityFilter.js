/**
 * @class Entity filter
 */
Application.EntityFilter = Class.create({

    /**
     * @constructor
     * @param {Object} options
     */
    initialize: function(options) {
        options = options || {};
        /** @type string */
        this.name = options.name;
    },

    /*
     * @param {Pair} pair
     */
    filter: function(pair) {
        var entity = pair.value;
        var name = entity.getTag('name') || "";

        if (this.name) {
            if (!name.containsIgnoreCase(this.name))
                return false;
        }
        return true;
    }
});