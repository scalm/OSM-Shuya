var SearchManager = {

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

    form: null,

    doSearch: function(form)
    {
        this.form = form;
        var uri = "http://ws.geonames.org/searchJSON";
        var params = "?style=full&lang=ru&country=RU&maxRows=20&name="+form.querystring.value;
        OpenLayers.loadURL(uri, params, this, this.onComplete, this.onFailure);
        document.getElementById('totalResultsCount').innerHTML = "Ищу...";
    },

    onComplete: function(request, config, requestUrl)
    {
        alert(requestUrl);
        var json = new OpenLayers.Format.JSON();
        var jsondata = json.read(request.responseText);
        if(!jsondata) {
            document.getElementById('totalResultsCount').innerHTML = "Ошибка";
            return;
        }
        var results = document.getElementById('results');
        OpenLayers.Element.show(results);
        document.getElementById('totalResultsCount').innerHTML = "Найдено "+jsondata.totalResultsCount;

        var resultsList = document.getElementById('resultsList');
        while(resultsList.firstChild) {
            resultsList.removeChild(resultsList.firstChild);
        }


        var rowTrigger = 1;
        for(var k in jsondata.geonames) {
            var geoname = jsondata.geonames[k];
            var e = document.createElement('div');
            e.className = 'searchResult';
            if(rowTrigger == 2)
                e.className = e.className + " listItem2";
            else
                e.className = e.className + " listItem1";

            var name = null;
            if(geoname.alternateNames) {

                for(var alNameKey in geoname.alternateNames) {
                    var alName = geoname.alternateNames[alNameKey];
                    if(alName.lang == 'ru') {
                        name = alName.name;
                        break;
                    }
                }
            }
            if(name == null) {
                name = geoname.name;

            }

            var countryName = geoname.countryName;
            var fcodeName = geoname.fcodeName;
            var adminName1 = geoname.adminName1;
            var t = [countryName, adminName1].join(',');


            var nameElement = document.createElement('a');
            nameElement.className = 'searchResultName';
            nameElement.innerHTML = name;
            nameElement.onclick = OpenLayers.Function.bind(SearchManager.show, geoname);
            nameElement.href="#";

            var fcodeElement = document.createElement('div');
            fcodeElement.className = 'searchResultFCode';
            fcodeElement.innerHTML = fcodeName;


            if(t) {
                var adminElement = document.createElement('div');
                adminElement.className = 'searchResultAdmin';
                adminElement.innerHTML = countryName + ', ' + adminName1;
            }

            e.appendChild(nameElement);
            e.appendChild(fcodeElement);
            if(adminElement) {
                e.appendChild(adminElement);
            }



            resultsList.appendChild(e);
            rowTrigger = 3-rowTrigger;
        }
    },

    onFailure: function()
    {
        document.getElementById('totalResultsCount').innerHTML = 'Ошибка';
    },

    show: function(event) {
        Shuya.setMapCenter(
            new OpenLayers.LonLat(this.lng, this.lat),
            Shuya.getMapZoom()
        );
        return false;
    }

}