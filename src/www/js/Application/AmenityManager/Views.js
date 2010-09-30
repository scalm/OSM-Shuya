/**
 * @class View of list item of amenity
 */
Application.AmenityManager.ListItemView = Class.create({

    /**
     * @constructor
     * @param {OSM.Entity} amenity Entity.
     * @param {Object} callbacks Object of callbacks. Support 'click', 'over'
     * and 'out'.
     */
    initialize: function(amenity, callbacks) {
        this.callbacks = callbacks || {};
        /**
         * @type OSM.Entity
         */
        this.amenity = amenity;

        /** @type Element */
        this.element = new Element('li');
        this.element.addClassName("amenityListItem");
        this.element.observe('mouseover', this.onOverItem.bind(this));
        this.element.observe('mouseout', this.onOutItem.bind(this));

        /** @type Element */
        var anchor = new Element('a',  {
            href: "#"
        });
        anchor.observe('click', this.onClickItem.bind(this));

        // image
        var imgSrc = this.getEntityImage(amenity);
        if (imgSrc) anchor.appendChild(new Element('img', {
            src: imgSrc
        }));

        // text
        var name = amenity.getTag("name");
        var text = (name!=null) ? " " + name : "#"+amenity.getId();
        anchor.appendChild(document.createTextNode(text));

        this.element.appendChild(anchor);
    },

    /**
     * @param {OSM.Entity} entity
     * @type String
     */
    getEntityImage: function(entity) {
        if (entity instanceof OSM.Node) {
            return 'img/Node.png';
        }
        if (entity instanceof OSM.Way) {
            return (entity.isClosed()) ? 'img/Area.png' : 'img/Way.png';
        }
        if (entity instanceof OSM.Relation) {
            return 'img/Relation.png';
        }
        return "";
    },

    /**
     * @private @event
     * @param {Event} event
     * @type Boolean
     */
    onClickItem: function(event) {
        this.callbacks.click && this.callbacks.click(this, event);
        return false;
    },

    /**
     * @private @event
     * @param {Event} event
     * @type Boolean
     */
    onOverItem: function(event) {
        this.element.addClassName('hoverListItem');
        this.callbacks.over && this.callbacks.over(this, event);
        return false;
    },

    /**
     * @private @event
     * @param {Event} event
     * @type Boolean
     */
    onOutItem: function(event) {
        this.element.removeClassName('hoverListItem');
        this.callbacks.out && this.callbacks.out(this, event);
        return false;
    },

    /**
     * @type Element
     */
    toElement: function() {
        return this.element;
    }
});

/**
 * @class View of amenity list.
 */
Application.AmenityManager.ListView = Class.create({

    /**
     * @constructor
     * @param {OSM.Entity[]} list Array of entity.
     * @param {Function} listItemViewConstructor Constructor for view of list
     * item. Signature is
     * <p><code>function(OSM.Entity amenity) : View </code></p>
     */
    initialize: function(list, listItemViewConstructor) {
        try {
            /** @type Element */
            this.element = new Element('ul');
            /** @type OSM.Entity[] */
            this.list = list;
            list.each(function(amenity, index) {
                var li = listItemViewConstructor(amenity);
                if (li) {
                    li.toElement().addClassName('listItem'+(index%2+1));
                    this.element.appendChild(li.toElement());
                }
            }, this);
        }
        catch(e) {
            console.error(e);
        }
    },

    /**
     * @type Element
     */
    toElement: function() {
        return this.element;
    }

});


/**
 * @class View of list item of amenity group.
 */
Application.AmenityManager.GroupListItemView = Class.create({

    /**
     * @constructor
     * @param {String} group Name of group.
     * @param {OSM.Entity[]} sublist Array of entity for sublist.
     * @param {Object} callbacks Object of callbacks. Support 'over' and 'out'.
     * @param {Function} sublistViewConstructor Constructor for view of sublist.
     * Signature is:
     * <p><code> function (String group, OSM.Entity[] list) : View</code></p>
     */
    initialize: function(group, sublist, callbacks, sublistViewConstructor) {
        /** @private @type String */
        this.group = group;
        /** @private @type OSM.Entity[] */
        this.sublist = sublist;
        /** @private @type Object */
        this.callbacks = callbacks || {}
        /** @private @type String */
        this.groupTranslated = Application.Amenity.Lang.translate(this.group);
        /** @private @type Element */
        this.element = new Element('div', {
            'class': 'amenityGroup'
        });

        var groupText = this.groupTranslated + " ("+sublist.size()+")";
        /** @private @type Element */
        this.headerElement = new Element('div', {
            'class': 'header'
        });
        this.headerElement.observe('mouseover', this.onOverItem.bind(this));
        this.headerElement.observe('mouseout', this.onOutItem.bind(this));
        this.headerElement.observe('click', this.onClickItem.bind(this));
        this.headerElement.appendChild(new Element('span', {
            'class': 'markclosed'
        }));
        this.headerElement.appendChild(new Element('span', {
            'class': 'markopened'
        }));

        var headerA = new Element('a', {
            href: '#'
        });
        headerA.update(groupText);
        this.headerElement.appendChild(headerA);

        var eList = sublistViewConstructor(sublist);
        this.element.appendChild(this.headerElement);
        this.element.appendChild(eList.toElement());
    },

    /**
     * @type Element
     */
    toElement: function() {
        return this.element;
    },

    /** @type Element */
    getHeaderElement: function() {
        return this.headerElement;
    },

    /**
     * @private @event
     * @param {Event} event
     * @type Boolean
     */
    onClickItem: function(event) {
        this.element.toggleClassName("opened");
        return false;
    },

    /**
     * @private @event
     * @param {Event} event
     * @type Boolean
     */
    onOverItem: function(event) {
        this.headerElement.addClassName('hoverListItem');
        this.callbacks.over && this.callbacks.over(this, event);
        return false;
    },

    /**
     * @private @event
     * @param {Event} event
     * @type Boolean
     */
    onOutItem: function(event) {
        this.headerElement.removeClassName('hoverListItem');
        this.callbacks.out && this.callbacks.out(this, event);
        return false;
    }

});

/**
 * @class View of amenity group list
 */
Application.AmenityManager.GroupListView = Class.create({

    /**
     * @constructor
     * @param {Hash} hash Hash of { group => entityList }, that is instance of
     * <code>Hash&lt;String, OSM.Entity&gt; </code>
     * @param {Function} listItemViewConstructor Constructor for view of list
     * item. Signature is:
     * <p><code> function (String group, OSM.Entity[] list) : View</code></p>
     */
    initialize: function(hash, listItemViewConstructor) {
        /** @private @type Hash */
        this.hash = hash;
        /** @private @type Element */
        this.element = new Element('div');

        hash.each(function(pair, index) {
            var group = pair.key;
            var list = pair.value;
            var eGroup = listItemViewConstructor(group, list);
            eGroup.getHeaderElement && eGroup.getHeaderElement().addClassName("listItem"+(index%2+1));
            this.element.appendChild(eGroup.toElement());
        }, this);
    },

    /** @type Element */
    toElement: function() {
        return this.element;
    }

});