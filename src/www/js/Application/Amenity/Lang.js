/**
 * Amenity lang
 */
Application.Amenity.Lang = {
    /**
     * Translate amenity type to localized string
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
        'bank': 'Банки',
        'atm': 'Банкоматы',
        'bank;atm': 'Банки c банкоматами',

        'waste_disposal': 'Мусорки. Помойки',
        'waste_basket': 'Урны для мусора',

        // Инфраструктура
        'bar': 'Бары',

        // Здоровье
        'pharmacy': 'Аптеки',
        'hospital': 'Больницы, госпитали',
        'doctors': 'Медпункты, поликлиники',
        'veterinary': 'Ветеринарные пункты',
        // Досуг, искусство и культура
        'arts_centre': 'Дома творчества, центры искусств',
        'cinema': 'Кинотеатры',
        'fountain': 'Фонтаны',
        'nightclub': 'Ночные клубы, дискотеки',
        'theatre': 'Театры',
        'bus_station': 'Автостанции, автовокзалы',
        'place_of_worship': 'Культовые сооружения',
        'kindergarten': 'Детские сады',
        'school': 'Школы и школьные площадки',
        'library': 'Библиотеки',
        'university': 'Институты, университеты',
        'college' : 'Техникумы, колледжи',
        'fuel': 'АЗС, АГЗС',
        'parking': 'Стоянки',

        // Другое
        'bench': 'Скамейки для отдыха',
        'fire_station': 'Пожарные станции',
        'marketplace':  'Рынки, базары',
        'post_box': 'Почтовые ящики',
        'post_office': 'Почтовые отделения и почтампты',
        'public_building': 'Общественные здания, дворцы культуры',
        'shelter': 'Навесы, шалаши',
        'toilets': 'Туалеты',
        'townhall': 'Городская администрация',

        'grave_yard': 'Кладбища'

    })
};