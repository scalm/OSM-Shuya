/**
 * @class Class manage group list of amenity
 */
Application.AmenityManager.ListView = Class.create({

    /**
     * @param {Application.AmenityManager} manager
     */
    initialize: function(manager) {
        /** @private @type Application.AmenityManager */
        this.manager = manager;
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

        var oldElement = this.element;
        this.element = new Element('ul', {'class': 'amenityList'});
        if(oldElement) oldElement.replace(this.element);

        groups.each(this.processHash, this);
    },

    processAmenities: function(amenity, index) {
        var li = this.container.appendElement('li', {'class' : 'amenity listItem'+((index) % 2 + 1)});

        // image
        var imgSrc = amenity.getImage();
        if (imgSrc) li.appendChild(new Element('img', {
            src: imgSrc
        }));

        // text
        var name = amenity.getTag("name");
        var text = (name!=null) ? " " + name : "#"+amenity.getId();
        li.appendChild(document.createTextNode(text));

        Object.extend(li, {
            manager: this.view.manager,
            amenity: amenity
        })
        li.observeA(this.view.itemCallbacks);
    },

    processHash: function(pair, index) {
        var group = pair.key;
        var list = pair.value;
        var li = this.element.appendElement('li', {'class' : 'group listItem'+(index % 2 + 1)});

        var header = li.appendElement('div', {'class' : 'header'});
        
        header.appendElement('div', {'class' : 'togglemark'});
        header.appendText(Application.Amenity.Lang.translate(group)+" ("+list.size()+")");

        Object.extend(header, {
            view: this,
            li: li,
            group: group,
            list: list
        });
        
        header.observeA(this.headerCallbacks);       

        var sublist = li.appendElement('ul');
        pair.value.each(this.processAmenities, {
            view: this,
            container: sublist
        });
    },

    headerCallbacks: {
        mouseover: function(event) {
            this.li.addClassName('hoverListItem');
            this.view.manager.layer.highlightEntity(this.list);
        },

        mouseout: function(event) {
            this.li.removeClassName('hoverListItem');
            this.view.manager.layer.unhighlightEntity(this.list);
        },

        click: function(event) {
            this.li.toggleClassName('opened');
            event.stop();
        }
    },

    itemCallbacks: {
        mouseover: function(event) {
            this.addClassName('hoverListItem');
            this.manager.layer.highlightEntity(this.amenity);
        },

        mouseout: function(event) {
            this.removeClassName('hoverListItem');
            this.manager.layer.unhighlightEntity(this.amenity);
        },

        click: function(event) {
            this.manager.layer.zoomToEntity(this.amenity);
        }
    },

    /** @type Element */
    toElement: function() {
        return this.element;
    }
});
