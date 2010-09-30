/**
 * @class Amenity filter
 */
Application.Amenity.Filter = Class.create(Application.EntityFilter, {

    /*
     * @param {Pair} pair
     */
    filter: function(pair) {
        var entity = pair.value;
        var name = entity.getTag('name') || "";

        if (this.name) {
            if (!name.containsIgnoreCase(this.name) &&
                    !Application.Amenity.Lang.translate(entity.getTag('amenity')).containsIgnoreCase(this.name))
                return false;
        }
        return true;
    }
});