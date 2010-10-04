OpenLayers.TextMarker = OpenLayers.Class({

    div: null,

    text: null,

    /**
     * Property: lonlat
     * {<OpenLayers.LonLat>} location of object
     */
    lonlat: null,

    /**
     * Property: events
     * {<OpenLayers.Events>} the event handler.
     */
    events: null,

    /**
     * Property: map
     * {<OpenLayers.Map>} the map this marker is attached to
     */
    map: null,

    /**
     * Constructor: OpenLayers.Marker
     * Parameters:
     * lonlat - {<OpenLayers.LonLat>} the position of this marker
     * icon - {<OpenLayers.Icon>}  the icon for this marker
     */
    initialize: function(lonlat, text) {
        this.lonlat = lonlat;

        this.div = OpenLayers.Util.createDiv(null, null, null, null, null);
        this.div.innerHTML = text;
        this.div.className = 'textMarker';
        this.events = new OpenLayers.Events(this, this.div, null);
    },

    /**
     * APIMethod: destroy
     * Destroy the marker. You must first remove the marker from any
     * layer which it has been added to, or you will get buggy behavior.
     * (This can not be done within the marker since the marker does not
     * know which layer it is attached to.)
     */
    destroy: function() {
        // erase any drawn features
        this.erase();

        this.map = null;

        this.events.destroy();
        this.events = null;
        
        if (this.div != null) {
            this.div.destroy();
            this.div = null;
        }
    },

    /**
    * Method: draw
    * Calls draw on the icon, and returns that output.
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>}
    *
    * Returns:
    * {DOMElement} A new DOM Image with this marker's icon set at the
    * location passed-in
    */
    draw: function(px) {
        this.moveTo(px);
        return this.div;
    },

    /**
    * Method: erase
    * Erases any drawn elements for this marker.
    */
    erase: function() {
        if (this.div != null && this.div.parentNode != null) {
            OpenLayers.Element.remove(this.div);
        }
    },

    /**
    * Method: moveTo
    * Move the marker to the new location.
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>} the pixel position to move to
    */
    moveTo: function (px) {
        //if no px passed in, use stored location
        if (px != null) {
            this.px = px;
        }

        if (this.div != null) {
            if (this.px == null) {
                this.display(false);
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size);
                }
                var offsetPx = this.px.offset(this.offset);
                OpenLayers.Util.modifyDOMElement(this.div, null, offsetPx);
            }
        }
        this.lonlat = this.map.getLonLatFromLayerPx(px);
    },

    /**
     * APIMethod: isDrawn
     *
     * Returns:
     * {Boolean} Whether or not the marker is drawn.
     */
    isDrawn: function() {
        var isDrawn = (this.div && this.div.parentNode &&
                       (this.div.parentNode.nodeType != 11));
        return isDrawn;
    },

    /**
     * Method: onScreen
     *
     * Returns:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {

        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }
        return onScreen;
    },

    /**
     * Method: display
     * Hide or show the icon
     *
     * display - {Boolean}
     */
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.TextMarker"
});


