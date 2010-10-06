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
        var groups = $H();

        // assume tag 'type'='route'
        var f = function(pair) {
            var type = pair.value.getTag('route');
            if (groups.get(type) == undefined) {
                groups.set(type, $A());
            }
            groups.get(type).push(pair.value);
        };

        hash.eachFilter(f, this, this.manager.filter ? this.manager.filter.filter : null, this.manager.filter);

        var oldElement = this.element;
        this.element = new Element('ul', {'class': 'routeList'});
        if(oldElement) oldElement.replace(this.element);
        groups.each(this.processGroups, {
            view: this,
            container: this.element
        });
    },

    processGroups: function(pair, index) {
        var group = pair.key;
        var relList = pair.value;

        var li = this.container.appendElement('li', {'class' : 'group listItem'+(index % 2 + 1)});

        /** @type Element */
        var header = li.appendElement('div', {'class' : 'header'});
        header.appendElement('div', {'class' : 'togglemark'});
        header.appendText(Application.Route.Lang.translate(group));

        Object.extend(header, {
            view: this.view,
            li: li,
            group: group
        });

        header.observeA(this.view.groupCallbacks);
        var sublist = li.appendElement('ul', { 'class': 'routeList' });
        relList.each(this.view.processRoutes, {
            view: this.view,
            container: sublist
        });        
    },

    processRoutes: function(relation, index) {
        //var id = pair.key;
        //var relation = pair.value;
        var li = this.container.appendElement('li', {'class' : 'group listItem'+(index % 2 + 1)});

        /** @type Element */
        var header = li.appendElement('div', {'class' : 'header'});

        header.appendElement('div', {'class' : 'togglemark'});

        var color = relation.getTag("colour");
        if (color ===null) {
            var colors = ['red', 'green', 'blue', 'yellow', 'maroon', 'navy'];
            color = colors[Math.round(Math.random()*colors.length)];
        }

        header.appendElement('div', {
            'class' : 'routeColor',
            'style': 'background-color:'+color
        });

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
            view: this.view,
            li: li,
            relation: relation
        });

        header.observeA(this.view.headerCallbacks);
        var sublist = li.appendElement('ul');
        relation.getSorted().each(this.view.processMembers, {
            view: this.view,
            relation: relation,
            container: sublist
        });
    },

    processMembers: function(member, index) {
        var li = this.container.appendElement('li', {'class' : 'member listItem'+((index) % 2 + 1)});

        var entity = this.view.manager.osm.get(member.getRef());
        // image
        var imgSrc = entity.getImage();
        if (imgSrc) li.appendElement('img', {
            src: imgSrc
        });

        if(entity.getTag('highway').match(/^bus_stop/)) {
            li.appendElement('img', {src: 'img/bus_stop.p.12.png'});
        }

        // text
        var name = entity.getTag("name");
        var text = (name!=null) ? " " + name : "#"+entity.getId();
        li.appendText(text);

        Object.extend(li, {
            view: this.view,
            entity: entity
        })
        li.observeA(this.view.itemCallbacks);
    },

    groupCallbacks: {
        mouseover: function(event) {
            this.li.addClassName('hoverListItem');
        },

        mouseout: function(event) {
            this.li.removeClassName('hoverListItem');
        },

        click: function(event) {
            this.li.toggleClassName('opened');
            event.stop();
        }
    },

    headerCallbacks: {
        mouseover: function(event) {
            this.li.addClassName('hoverListItem');
            this.relation.getMembers().each(function(pair) {
                var entity = this.osm.get(pair.value.getRef());
                this.layer.highlightEntity(entity);
            }, this.view.manager);            
        },

        mouseout: function(event) {
            this.li.removeClassName('hoverListItem');
            this.relation.getMembers().each(function(pair) {
                var entity = this.osm.get(pair.value.getRef());
                this.layer.unhighlightEntity(entity);
            }, this.view.manager);
        },

        click: function(event) {
            this.li.toggleClassName('opened');
            event.stop();
        }
    },

    itemCallbacks: {
        mouseover: function(event) {
            this.addClassName('hoverListItem');
            this.view.manager.layer && this.view.manager.layer.highlightEntity(this.entity);
        },

        mouseout: function(event) {
            this.removeClassName('hoverListItem');
            this.view.manager.layer && this.view.manager.layer.unhighlightEntity(this.entity);
        },

        click: function(event) {
            this.view.manager.layer && this.view.manager.layer.zoomToEntity(this.entity);
        }
    },

    /** @type Element */
    toElement: function() {
        return this.element;
    }
});
