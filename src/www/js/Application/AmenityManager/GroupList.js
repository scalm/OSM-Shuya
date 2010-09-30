/**
 * @class Class manage group list of amenity
 */
Application.AmenityManager.GroupList = Class.create({

    /**
     * @param {Application.AmenityManager} manager
     */
    initialize: function(manager) {
        /** @private @type Application.AmenityManager */
        this.manager = manager;
        var ListItemViewCallbacks = {
            over: function(liView, event) {
                manager.layer.highlightEntity(liView.amenity);
            },

            out: function(liView, event) {
                manager.layer.unhighlightEntity(liView.amenity);
            },

            click: function(liView, event) {
                manager.layer.zoomToEntity(liView.amenity);
            }
        };
        var GroupListItemViewCallbacks = {
            over: function(liView, event) {
                manager.layer.highlightEntity(liView.sublist);
            },

            out: function(liView, event) {
                manager.layer.unhighlightEntity(liView.sublist);
            }
        };

        /** @private
         * @param {OSM.Entity} amenity Amenity entity.
         * @type View
         */
        function listViewItemConstructor(amenity) {
            return new Application.AmenityManager.ListItemView(amenity, ListItemViewCallbacks);
        }

        /** @private
         * @param {OSM.Entity[]} list List of amenities.
         * @type View
         */
        function sublistViewConstructor (list) {
            return new Application.AmenityManager.ListView(list, listViewItemConstructor);
        }

        /**
         * @private
         * @param {String} group Group name
         * @param {OSM.Entity[]} list List of amenities.
         * @type View
         */
        function groupListViewItemConstructor(group, list) {
            return new Application.AmenityManager.GroupListItemView(group, list,
                GroupListItemViewCallbacks,
                sublistViewConstructor);
        }

        /**
         * @private
         * @param {Hash} groups Hash { group => entityList } as
         * <code>Hash&lt;String,OSM.Entity[]&gt;</code>
         * @type View
         */
        function groupListViewConstructor(groups) {
            return new Application.AmenityManager.GroupListView(groups,
                groupListViewItemConstructor);
        }

        /** @private @type Function */
        this.listConstructor = groupListViewConstructor;

        /** @private @type Element */
        this.element = this.listConstructor($H()).toElement();
    },

    /**
     * @param {Hash} hash <p>Hash {id => entity} as
     * <code>Hash&lt;Number,OSM.Entity&gt;</code></p>
     * @type void
     */
    update: function(hash) {
        var groups = $H();

        var f = function(pair) {
            var type = pair.value.getTag("amenity");
            if (groups.get(type) == undefined) {
                groups.set(type, $A());
            }
            groups.get(type).push(pair.value);
        };

        hash.eachFilter(f, this, this.manager.filter ? this.manager.filter.filter : null, this.manager.filter);

        var oldElement = this.element;
        this.element = this.listConstructor(groups).toElement()
        oldElement.replace(this.element);
    },

    /** @type Element */
    toElement: function() {
        return this.element;
    }
});
