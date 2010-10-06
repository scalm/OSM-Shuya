/**
 * @class Popup with amenity details.
 */
Application.AmenityManager.Popup = {

    /**
     * @constructor
     * @param {Application.Map} map Map.
     * @param {OSM.Entity} amenity OSM Entity.
     * @param {Object} callbacks Object with callbacks. Supports 'zoom'.
     */
    initialize: function(map, amenity, callbacks) {
        /** @type Object */
        this.callbacks = callbacks || {};

        var g = amenity.getGeometry().getCentroid();
        g = map.transformTo(g);
        var pp = new OpenLayers.LonLat(g.x, g.y);
        var pix = map.getPixelFromLonLat(pp);
        pix.x += 10;
        pix.y += 10;
        pp = map.getLonLatFromPixel(pix);

        OpenLayers.Popup.prototype.initialize.call(this, null, pp, new OpenLayers.Size(200,200),
            null, true, null);

        var details = this.getAmenityDetailText(amenity);
        this.contentDiv.update(details);
        OpenLayers.Util.extend(this, {
            opacity: 0.8,
            border: "black solid 1px",
            autoSize: true,
            //panMapIfOutOfView: false,
            //keepInMap: true,
            closeOnMove: true
        });
        this.updateSize();
    },

    /**
     * @private
     * @param {OSM.Entity} amenity
     * @type Element
     */
    getAmenityDetailText: function(amenity) {
        var text = "";
        var tags = amenity.getTags();

        if(tags.get('name')) text += "<div style='font-weight: bold;'>"+tags.get('name')+"</div>";

        var amenityType = Application.Amenity.Lang.translate(tags.get('amenity'));

        if(amenityType) {
            text += "<div>";
            text += amenityType;
            text += "</div>";
        }

        text += "<div>";
        if(tags.get("addr:streetname")) {
            text += tags.get("addr:streetname");
        }
        if(tags.get("addr:housenumber")) {
            if(tags.get("addr:streetname")) text += ", ";
            text += tags.get("addr:housenumber");
        }
        text += "</div>";

        if(tags.get('description')) {
            text += "<div>Описание: "+tags.get('description')+"</div>";
        }

        if(tags.get('url')) {
            text += "<div>URL: <a href='"+tags.get('url')+"'>"+tags.get('url')+"</a></div>";
        }

        if(tags.get('website')) {
            text += "<div>Website: <a href='"+tags.get('website')+"'>"+tags.get('website')+"</a></div>";
        }

        if(tags.get('wikipedia')) {
            text += "<div>Wikipedia: <a href='"+tags.get('wikipedia')+"'>"+tags.get('wikipedia')+"</a></div>";
        }

        var wikipedia = [];
        var re = /^wikipedia:(.*)$/;
        tags.getList().each(function(pair) {
            var found = re.exec(pair.key);
            if(found!=null) {
                wikipedia.push(found[1]);
            }
        });
        wikipedia.each(function(w){
            var wurl = tags.get("wikipedia:"+w);
            if(!wurl.startsWith("http:// ")) wurl= 'http://'+w+'.wikipedia.org/wiki/'+wurl;
            text += "<a href='"+wurl+"'>"+w+"<a>" ;
        });


        var e = new Element('div');
        e.update(text);

        var div = new Element('div');

        var g = amenity.getGeometry().getCentroid();
        div.appendChild(new Element('div').update('Координаты: '+g.x.toFixed(5)+" "+g.y.toFixed(5)));
        e.appendChild(div);

        if (this.callbacks.zoom) {
            var a = new Element('a', {
                href: '#'
            });
            a.observe('click', this.callbacks.zoom.bind(undefined, amenity));
            a.update('Приблизить');
            e.appendChild(a);
        }

        e.appendChild(document.createTextNode(' '));
        e.appendChild(new Element('a', {
            href : '/maps/?zoom=17&lat="+g.y+"&lon="+g.x+"&layers=B00TTFT'
        })
        .update('ссылка'));
        
        return e;
    },

    CLASS_NAME: "Application.AmenityPopup"
};
Application.AmenityManager.Popup = OpenLayers.Class(OpenLayers.Popup, Application.AmenityManager.Popup);