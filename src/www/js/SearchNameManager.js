var SearchNameManager = {

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
        var uri = "search.php";
        var params = [];
        params['name'] = form.nquerystring.value;
        OpenLayers.loadURL(uri, params, this, this.onComplete, this.onFailure);
        $('ntotalResultsCount').innerHTML = "Ищу...";
    },

    onComplete: function(request, config, requestUrl)
    {
        $('ntotalResultsCount').innerHTML = '';
        $('nresultsList').innerHTML = '';
        var document = request.responseXML;
        var n = document.documentElement.firstChild;
        var count = 0;
        var rowTrigger = 1;
        while(n) {
            if(n.nodeType==Node.ELEMENT_NODE) {
                var name = OSMXML.getTag(n, 'name');
                var element = $tag('div', {className: 'listItem'+rowTrigger});

            var nameElement = $tag('a');
            nameElement.className = 'searchResultName';
            nameElement.innerHTML = name;
            nameElement.onclick = OpenLayers.Function.bind(SearchNameManager.show, this, n);
            nameElement.href="#";

                element.appendChild(nameElement);

                $('nresultsList').appendChild(element);
                count++;
                rowTrigger = 3 - rowTrigger;
            }
            n = n.nextSibling;
        }
        $('ntotalResultsCount').innerHTML = 'Найдено: '+count;
    },

    onFailure: function()
    {
        $('ntotalResultsCount').innerHTML = 'Ошибка';
    },

    show: function(node, event) {
        Shuya.map.setMapCenter(
            new OpenLayers.LonLat(node.getAttribute('lng'), node.getAttribute('lat')),
            Shuya.getMapZoom()
        );
        return false;
    }

}