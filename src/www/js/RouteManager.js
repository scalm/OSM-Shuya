var RouteManager = {

    element: null,

    initialize: function(element)
    {
        this.element = element;
    },

    openSidebar: function()
    {
        OpenLayers.Element.show(this.element);
    },

    closeSidebar: function()
    {
        OpenLayers.Element.hide(this.element);
    },

    toggleSidebar: function()
    {
        OpenLayers.Element.toggle(this.element);
    },

    show: function(event) {
        var visible = OSMTransport.toogle(this);
        var relId = this.relation.getAttribute('id');
        var routeElement = document.getElementById('route'+relId);
        var e = routeElement.firstChild;
        while(e) {
            if(OpenLayers.Element.hasClass(e, 'routeColor')) {
                break;
            }
            e = e.nextSibling;
        }
        if(e) {
            if(visible) {
                e.style.backgroundColor = this.color;
            } else {
                e.style.backgroundColor = '';
            }
        }
        return false;
    },

    updateList: function() {
        var routeList = document.getElementById('routeList');
        while(routeList.firstChild) {
            routeList.removeChild(routeList.firstChild);
        }

        var zebra1 = 1;
        for(var i in OSMTransport.routes) {
            var route = OSMTransport.routes[i];
            var ref = OSMXML.getTag(route.relation, "ref");
            var name = OSMXML.getTag(route.relation, "name");
            var text = "#rel"+route.relation.getAttribute('id')+" ";
            if(name!=null) {
                text = text + name;
                if(ref) {
                    text = text + " ("+ref+")";
                }
            } else {
                if(ref)
                    text = "Маршрут "+ref;
            }

            var e = $tag('div', {className: 'listItem'+zebra1});
            e.id = 'route'+route.relation.getAttribute('id');

            var aColorElement = $tag('a', {
                onclick: OpenLayers.Function.bind(RouteManager.show, route),
                href: "#"
            });

            var colorElement = $tag('div', { className: 'routeColor' });
            colorElement.style.backgroundColor = route.color;

            aColorElement.appendChild(colorElement);


            var aElement = $tag('a', {
                innerHTML: text,
                onclick: OpenLayers.Function.bind(RouteManager.showRouteData, route),
                href: "#route"+route.relation.getAttribute('id')
            });

            e.appendChild(aColorElement);
            e.appendChild(aElement);
            routeList.appendChild(e);

            var routeDataElement = $tag('ul', {
                id: 'routeData'+route.relation.getAttribute('id'),
                className: 'routeData'
            });
            routeDataElement.style.display = 'none';

            var routeType = OSMXML.getTag(route.relation, "route");
            
            if(routeType) routeDataElement.innerHTML =  routeType;

            var members = OSMTransport.getRouteMembers(route);

            var zebra = 1;
            for(var i in members) {
                var member = members[i];
                var mtext = "";
                //mtext = mtext + member.tagName + " ";
                var mname = OSMXML.getTag(member, "name");
                if(mname) {
                    mtext = mtext + " " + mname;
                }
                var mElement = $tag('div', {
                    className: 'listItem'+zebra
                });

                if(OSMXML.getTag(member, 'highway')=='bus_stop') {
                    mElement.appendChild($tag('img', {src: 'img/bus_stop.p.12.png'}));
                }

                var maElement = $tag('a', {
                    href: '#',
                    innerHTML: mtext ? mtext : "#"+member.getAttribute("id"),
                    onmouseover: OpenLayers.Function.bind(RouteManager.showRouteMember, route, member),
                    onmouseout: OpenLayers.Function.bind(RouteManager.showRouteMember, route, null)
                });
                mElement.appendChild(maElement);
                routeDataElement.appendChild(mElement);
                zebra = 3 - zebra;
            }
            routeList.appendChild(routeDataElement);
            zebra1 = 3 - zebra1;
        }

    },
    
    showRouteData: function(event) {
        var relId = this.relation.getAttribute('id');
        var routeDataElement = document.getElementById('routeData'+relId);
        OpenLayers.Element.toggle(routeDataElement);
        return false;
    },

    showRouteMember: function(member, event) {
        OSMTransport.selectMember(member);
    },

    showRouteDataById: function(relId) {
        var routeDataElement = document.getElementById('routeData'+relId);
        if(routeDataElement) {
            OpenLayers.Element.show(routeDataElement);
        }

    }

}