/**
 * @class Class manage group list of routes
 */
Application.RouteManager.GroupList = Class.create({

    /**
     * @param {Application.RouteManager} manager
     */
    initialize: function(manager) {
        /** @private @type Application.RouteManager */
        this.manager = manager;
        var ListItemViewCallbacks = {
            /*over: function(liView, event) {
                manager.layer.highlightEntity(liView.amenity);
            },

            out: function(liView, event) {
                manager.layer.unhighlightEntity(liView.amenity);
            },

            click: function(liView, event) {
                manager.layer.zoomToEntity(liView.amenity);
            }*/
        };
        var GroupListItemViewCallbacks = {
            /*over: function(liView, event) {
                manager.layer.highlightEntity(liView.sublist);
            },

            out: function(liView, event) {
                manager.layer.unhighlightEntity(liView.sublist);
            }*/
        };


        function memberListViewConstructor(list) {
            ;
        }

        function headerViewConstructor(headerView, item) {
            headerView.toElement.update();
        }

        function listItemViewConstructor(listItemView, item) {
            new Application.View.HeaderList(item.key, item.value,
                headerViewConstructor,
                memberListViewConstructor, {
                    element: listItemView.toElement()
                });
        }

        this.update($H());
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
        
        var $a = function(e, c) { e.appendChild(c); return c; };
        var $t = function(n, o) { return new Element(n, o); };
        var $at = function(e, n, c) { return $a(e, $t(n,c)); };

        this.oldElement = this.element;
        this.element = $t('ul');
        this.oldElement.replace(this.element);

        groups.each(function(pair, index) {
            var li = $at(this.element, 'li');
            var header = $at(li, 'div');
            header.update(pair.key);

            var sublist = $at(li, 'ul');
            pair.value.each(function(amenity, index) {
                $at(sublist, 'li').update(amenity.getId());
            });            
        });
    },

    toElement: function() {
        return this.element;
    }
});
