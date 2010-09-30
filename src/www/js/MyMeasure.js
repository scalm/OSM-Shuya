Application.MeasureControl = OpenLayers.Class(OpenLayers.Control.Measure, {
    layer: null,
    
    initialize: function() {
        OpenLayers.Control.Measure.prototype.initialize.call(
            this,            
            OpenLayers.Handler.Path,
            {
                persist: true,
                displayClass: "olControlDrawFeatureRuler",
                handlerOptions: {
                    layerOptions: {
                        styleMap: this.getStyleMap()
                    }
                },
                geodesic: true,
                measurePartial: this.handlePointMeasurements,
                callbacks: {
                    "modify": this.handleModifyMeasurements
                }
            }
            
        );

        this.events.on({
            "measure": this.handleMeasurements,
            "measurepartial": this.handleMeasurements
        });

    },

    getStyleMap: function() {
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#666666",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({
                symbolizer: sketchSymbolizers
            })
        ]);
        var styleMap = new OpenLayers.StyleMap({
            "default": style
        });
        return styleMap;
    },


    initLayer: function() {
        this.layer = new OpenLayers.Layer.Vector("Measurements", {
            displayInLayerSwitcher: false,
            maxResolution: 156543,
            units: "m",
            projection: "EPSG:4326"
        });

        this.layer.events.on({
            featureremoved: function(event) {
               if(event.feature.tm!=undefined) {
                   //Shuya.layers.markers.removeMarker(event.feature.tm);
               }
            }
        })
        this.map.addLayer(this.layers.measurements);
    },

    
    handleMeasurements: function (event) {
        var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var element = $('output');
        var out = "";
        if(order == 1) {
            out += "measure: " + measure.toFixed(3) + " " + units;
        } else {
            out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
        }
        element.innerHTML = out;

        /*var point = geometry.getVertices(true)[1];

        var markersLayer = Shuya.map.getLayersByName("Markers")[0];
        var ll = new OpenLayers.LonLat(point.x, point.y);
        //markersLayer.addMarker(new OpenLayers.Marker(ll));
        var tm  = new OpenLayers.TextMarker(ll, measure.toFixed(3) + "&nbsp;" + units);
        markersLayer.addMarker(tm);

        Shuya.layers.measurements.removeFeatures(Shuya.layers.measurements.features);
        var ng = geometry.clone();
        var f = new OpenLayers.Feature.Vector(ng);
        var f2 = new OpenLayers.Feature.Vector(ng.getVertices(true)[0].clone());
        var f3 = new OpenLayers.Feature.Vector(ng.getVertices(true)[1].clone());
        f3.tm = tm;
        this.layers.measurements.addFeatures([f, f2, f3]);
*/

    },

    handlePointMeasurements: function (point, geometry) {
        this.measure(geometry, "measurepartial");
    },

    //tm2: null,

    handleModifyMeasurements: function (point, geometry) {
        /*var markersLayer = Shuya.map.getLayersByName("Markers")[0];

        if(this.tm2!=null) {
            markersLayer.removeMarker(Shuya.tm2);
        }
        var ll = new OpenLayers.LonLat(point.x, point.y);
        var stat = this.getBestLength(geometry.geometry);

        this.tm2  = new OpenLayers.TextMarker(ll, stat[0].toFixed(3) + "&nbsp;"+stat[1]);
        this.tm2.offset = new OpenLayers.Pixel(10, 10);
        markersLayer.addMarker(this.tm2);
/**/


    }




});






