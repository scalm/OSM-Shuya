/**
 * Amenity lang
 */
Application.Route.Lang = {
    /**
     * Translate route type to localized string
     * @static
     * @param {String} name
     * @type String
     */
    translate: function(name) {
        var tr = this.strings.get(name);
        if (tr == undefined) tr = name;
        return tr;
    },

    /**
     * @static
     * @type Hash
     */
    strings: $H({
        'bus': 'Автобус'
    })
};