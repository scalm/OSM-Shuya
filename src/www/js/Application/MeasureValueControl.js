/**
 * @class
 */
Application.MeasureValueControl = {

    /**
     * @param {OpenLayers.Control.Measure} measureControl
     * @param {Object} options
     */
    initialize: function(measureControl, options) {
        /** @type OpenLayers.Control.Measure */
        this.measureControl = null;
        options = options || {};

        OpenLayers.Util.extend(options, {
            displayClass: 'olControlMeasureValue'
        });
        OpenLayers.Control.prototype.initialize.call(this, options);
        this.setMeasureControl(measureControl);
    },

    /**
     * @param {OpenLayers.Event} event
     */
    handleMeasurePartial: function (event) {
        var geometry = event.geometry;
        var out = "";
        if(event.order == 1) {
            out += "measure: " + event.measure.toFixed(3) + " " + event.units;
        } else {
            out += "measure: " + event.measure.toFixed(3) + " " + event.units + "<sup>2</" + "sup>";
        }
        this.div.update(out);
    },

    /**
     * @param {OpenLayers.Event} event
     */
    handleMeasureComplete: function(event) {

    },

    /**
     * @param {OpenLayers.Control.Measure} measureControl
     */
    setMeasureControl: function (measureControl) {
        // unregister old
        if (this.measureControl) {
            this.measureControl.events.unregister("activate", this, this.activate);
            this.measureControl.events.unregister("deactivate", this, this.deactivate);
            this.measureControl.events.unregister("measurepartial", this, this.handleMeasurePartial);
            this.measureControl.events.unregister("measure", this, this.handleMeasureComplete);
        }
        this.measureControl = measureControl;
        // register new
        if (this.measureControl) {
            this.measureControl.events.register("activate", this, this.activate);
            this.measureControl.events.register("deactivate", this, this.deactivate);
            this.measureControl.events.register("measurepartial", this, this.handleMeasurePartial);
            this.measureControl.events.register("measure", this, this.handleMeasureComplete);
        }
    }

};
Application.MeasureValueControl = OpenLayers.Class(OpenLayers.Control, Application.MeasureValueControl);