/**
 * @class Class manage list of routes
 */
Application.RouteManager.ListView = Class.create({

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
  /*      var groups = $H();

        var f = function(pair) {
            var type = pair.value.getTag("amenity");
            if (groups.get(type) == undefined) {
                groups.set(type, $A());
            }
            groups.get(type).push(pair.value);
        };

        hash.eachFilter(f, this, this.manager.filter ? this.manager.filter.filter : null, this.manager.filter);
*/
        var oldElement = this.element;
        this.element = new Element('ul', {'class': 'routeList'});
        if(oldElement) oldElement.replace(this.element);

        hash.each(this.processHash, this);
    },

    processMembers: function(member, index) {
        var li = this.container.appendElement('li', {'class' : 'member listItem'+((index) % 2 + 1)});

        console.log(this, this.view, this.view.manager.osm, member.getRef());
        var entity = this.view.manager.osm.get(member.getRef());
        // image
        var imgSrc = entity.getImage();
        if (imgSrc) li.appendChild(new Element('img', {
            src: imgSrc
        }));

        // text
        var name = entity.getTag("name");
        var text = (name!=null) ? " " + name : "#"+entity.getId();
        li.appendChild(document.createTextNode(text));

        Object.extend(li, {
            manager: this.view.manager,
            entity: entity
        })
        li.observeA(this.view.itemCallbacks);
    },

    processHash: function(pair, index) {
        var id = pair.key;
        var relation = pair.value;
        var li = this.element.appendElement('li', {'class' : 'group listItem'+(index % 2 + 1)});

        var header = li.appendElement('div', {'class' : 'header'});
        
        header.appendElement('div', {'class' : 'togglemark'});
        var name = relation.getTag('name');
        var ref = relation.getTag('ref');
        var text = "";
        if(name!=null) {
            text = text + name;
            if(ref) {
                text = text + " ("+ref+")";
            }
        } else {
            if(ref)
                text = "Маршрут "+ref;
        }

        header.appendText(text);

        Object.extend(header, {
            view: this,
            li: li,
            relation: relation
        });
        
        header.observeA(this.headerCallbacks);       

        var sublist = li.appendElement('ul');
        relation.getMembers().each(this.processMembers, {
            view: this,
            relation: relation,
            container: sublist
        });
    },

    headerCallbacks: {
        mouseover: function(event) {
            this.li.addClassName('hoverListItem');
            this.view.manager.layer && this.view.manager.layer.highlightEntity(this.list);
        },

        mouseout: function(event) {
            this.li.removeClassName('hoverListItem');
            this.view.manager.layer && this.view.manager.layer.unhighlightEntity(this.list);
        },

        click: function(event) {
            this.li.toggleClassName('opened');
            event.stop();
        }
    },

    itemCallbacks: {
        mouseover: function(event) {
            this.addClassName('hoverListItem');
            this.manager.layer && this.manager.layer.highlightEntity(this.amenity);
        },

        mouseout: function(event) {
            this.removeClassName('hoverListItem');
            this.manager.layer && this.manager.layer.unhighlightEntity(this.amenity);
        },

        click: function(event) {
            this.manager.layer && this.manager.layer.zoomToEntity(this.amenity);
        }
    },

    /** @type Element */
    toElement: function() {
        return this.element;
    }
});