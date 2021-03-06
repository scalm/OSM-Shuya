/**
 * @param {String} baseDir
 * @param {Array} files Array of string
 * @type void
 */
function loadScripts(baseDir, files) {
    if (!baseDir) baseDir = "";
    var agent = navigator.userAgent;
    var docWrite = (agent.match("MSIE") || agent.match("Safari"));
    if(docWrite) {
        var allScriptTags = new Array(files.length);
    }
    for (var i=0, len=files.length; i<len; i++) {
        var fileName = baseDir + files[i];
        //console.log('load script ', fileName);
        if (docWrite) {
            allScriptTags[i] = "<script src='" + fileName + "'></script>";
        } else {
            var s = document.createElement("script");
            s.src = fileName;
            var h = document.getElementsByTagName("head").length ?
                       document.getElementsByTagName("head")[0] :
                       document.body;
            h.appendChild(s);
        }
    }
    if (docWrite) {
        document.write(allScriptTags.join(""));
    }
}

/**
 * @param {String} scriptName
 * @param {Array} files
 * @type void
 */
function loadLinkedScripts(scriptName, files) {
    loadScripts(getScriptLocation(scriptName), files);
}

/**
 * @param {String} scriptName
 * @type String
 */
function getScriptLocation (scriptName) {
    var scriptLocation = "";
    var isOL = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)");

    var scripts = document.getElementsByTagName('script');
    for (var i=0, len=scripts.length; i<len; i++) {
        var src = scripts[i].getAttribute('src');
        if (src) {
            var match = src.match(isOL);
            if(match) {
                scriptLocation = match[1];
                break;
            }
        }
    }
    return scriptLocation;
}

/**
 * @param {Funtion} iterator
 * @param {Object} context
 * @param {Function} filter
 * @param {Object} filterContext
 * @type Hash
 */
Hash.prototype.eachFilter = function(iterator, context, filter, filterContext) {
    try {
    if (!(filter instanceof Array)) {
        filter = [filter];
        filterContext = [filterContext];
    }

    this.each(function(p) {
        var f = function(f, i) {
                return !f || f.call(filterContext[i], p);
        };

        if (!filter || filter.all(f)) iterator.call(context, p);
    });
    }
    catch(e) {
        console.error("eachFilter error");
        throw e;
    }
    return this;
}

/**
 * @param {string} s
 * @type Boolean
 */
String.prototype.containsIgnoreCase = function(s) {
        return this.toUpperCase().indexOf(s.toUpperCase()) >=0;
};

Element.prototype.observeA = function(callbacks) {
    for ( var c in callbacks) {
        if (callbacks.hasOwnProperty(c)) {
            this.observe(c, callbacks[c]);
        }
    }
}

Element.prototype.appendElement = function(tagName, params) {
    return this.appendChild(new Element(tagName, params));
}

Element.prototype.appendText = function(text) {
    return this.appendChild(document.createTextNode(text));
}

/**
 * @class
 * @name EventSupport
 *
 * Class provides function for named event support. Classes must not
 * derived from this class. They must extends it.
 *
 * <code>
 * var DerivedClass = Class.create(ParentClass, {
 *     \/* method of DerivedClass *\/
 * }, EventSupport); *
 * </code>
 */
var EventSupport = {

    /**
     * Observe named event
     *
     * @public
     * @param {String|Object} eventOrObject Name of event.
     * @param {Function} [handler] Event handler.
     * @type void
     */
    observe: function(eventOrObject, handler) {
        if (typeof(eventOrObject)=="string") {
            var event = eventOrObject;
            if (this.events.hasOwnProperty(event)) {
                this.events[event].push(handler);
            }
        } else if (eventOrObject instanceof Object) {
            for(var prop in eventOrObject) {
                this.observe(prop, eventOrObject[prop]);
            }
        }
    },

    /**
     * Fire named event
     *
     * @public
     * @param {String} event Name of event.
     * @type void
     */
    fire: function(event) {
        var _arg = $A(arguments);
        _arg.shift();
        _arg.unshift(this);
        this.events.hasOwnProperty(event) && this.events[event].each(
            /** @param {Function} value */
            function(value) {
                value.apply(undefined, _arg);
            }
        );
    }
};


/**
 * @namespace
 */
var Application = {
    initialize: function() {
        //console.log("Application.initialize");
        new Tab.Bar($("tabBar"));
        //OpenLayers.ImgPath = 'lib/img/';

        /** @type Application.Map */
        this.map = null;
        /** @type OpenLayers.Projection */
        this.epsg4326 = new OpenLayers.Projection("EPSG:4326");
        /** @type OSM */
        this.osm = new OSM();
        application = this;
        this.createMap('map',{});
    },

    /** @param {String} divName
     * @param {Object} options
     */
    createMap: function (divName, options) {
        OpenLayers.Lang.setCode('ru');
        options = options || {};

        this.map = new Application.Map(divName, {});

        //this.initLayers();
        //this.initControls();

        /** @type Application.Amenity */
        this.amenity = new Application.Amenity(this);
        this.amenityManager = new Application.AmenityManager(this.amenity);
        this.amenity.load();

        this.route = new Application.Route(this);
        this.routeManager = new Application.RouteManager(this.route);
        this.route.load();
    },

    /** @param {String} url
     * @param {Function} success
     * @type void
     */
    loadOSM: function(url) {
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(req) {
                var document = req.responseXML;
                var osm = new OSM(document);
                application.osm.update(osm);
            }
        });
    }
};

(function() {
    var appFiles = [
        "OSM/OSM.js",
        'OSM/Tags.js',
        'OSM/Entity.js',
        'OSM/Node.js',
        'OSM/Way.js',
        'OSM/Relation.js',
        'OSM/Geometry.js',

        "Application/SelectFeatureEx.js",
        "Application/MeasureControl.js",
        "Application/MeasureValueControl.js",
        "Application/EntityLayer.js",
        "Application/EntityPopup.js",

        "EntityList.js",
        "Application/EntityFilter.js",
        
        "Application/Map.js",
        "Application/ToolWindow.js",
        "Application/Views.js",
        

        "Application/AmenityManager/init.js",
        "Application/AmenityManager/View.js",
        "Application/AmenityManager/ToolWindow.js",

        "Application/Amenity.js",
        "Application/Amenity/Lang.js",
        "Application/Amenity/Filter.js",

        "Application/Route.js",
        "Application/Route/Lang.js",

        "Application/RouteManager/init.js",
        "Application/RouteManager/View.js",
        "Application/RouteManager/ToolWindow.js",

        "Tab/init.js",
        "Tab/Tab.js",
        "Tab/Bar.js"
    ];
    loadScripts("js/", appFiles);
})();
