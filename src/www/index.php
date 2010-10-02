<?php
    require_once('config/config.php');
    header('Content-Type: text/html; charset=utf-8');

    // init coordinates
    // zoom=12&lat=56.8538&lon=41.3947&layers=B00TT
    if( isset($_GET['lat']) && isset($_GET['lon']) ) {
        $lat = floatval($_GET['lat']);
        $lon = floatval($_GET['lon']);
    } else {
        $lat = 56.8538;
        $lon = 41.3947;
    }
    if(isset($_GET['zoom'])) {
        $zoom = intval($_GET['zoom']);
    } else {
        $zoom = 12;
    }

    if(isset($_GET['layers'])) {
        $layers = $_GET['layers'];
    } else {
        $layers = null;
    }
?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="description" content="Карта города Шуя Ивановской области." />
        <meta name="keywords" content="Карта,Шуя,Map,Shuya,OSM,OpenStreetMap" />
        <title>Карта города Шуя Ивановской области</title>
        <link rel="stylesheet" href="theme/default/style.css" type="text/css" />
        <link rel="stylesheet" href="css/styles.css" type="text/css" />
        <link rel="stylesheet" href="css/search.css" type="text/css" />

        <!-- Libraries -->
        <script type="text/javascript" src="<?= LIB_PROTOTYPEJS ?>"></script>
        <script type="text/javascript" src="<?= LIB_OPENLAYERS ?>"></script>
        <script type="text/javascript" src="js/OpenLayers.Layer.OSM.js"></script>

        <!-- Core -->
        <script type="text/javascript" src="js/Application.js"></script>
        

        <!--script type="text/javascript" src="js/MyMeasure.js"></script-->

        <!--script type="text/javascript" src="js/OSMTransport.js"></script-->

        <!--script type="text/javascript" src="js/searchmanager.js"></script>
        <script type="text/javascript" src="js/SearchNameManager.js"></script>
        <script type="text/javascript" src="js/RouteManager.js"></script>
        
        <script type="text/javascript" src="js/TextMarkers.js"></script>
        <script type="text/javascript" src="js/TextMarker.js"></script-->


    </head>
    <body onload ="loaded()">
        <div id="windowContainer"></div>
            <div id="searchBar" style="display:none" class="toolWindow">
                <div>
                    <div class="title">
                        <a href="#" onClick="javascript:SearchManager.closeSidebar(); return false;" style="float:right;">
                            <img src="openlayers/theme/default/img/close.gif" alt="закрыть" title="Закрыть" style="border:none;"/>
                        </a>
                        <div>Поиск</div>
                    </div>
                    <div>Поиск по названию населенного пункта</div>
                    <form onSubmit="javascript:SearchManager.doSearch(this); return false;" action="">
                        <input id="querystring" />
                        <input id="search" type="submit" value="Найти" />
                    </form>

                </div>
                <div id="results">
                    <div id="totalResultsCount" ></div>
                    <div id="resultsList" ></div>
                </div>

            </div>
            <div id="routeBar" style="display: none;" class="toolWindow">
                    <div class="title">
                        <a href="#" onClick="javascript:RouteManager.closeSidebar(); return false;" style="float:right;">
                            <img src="openlayers/theme/default/img/close.gif" alt="закрыть" title="Закрыть" style="border:none;"/>
                        </a>
                        <div>Маршруты</div>
                    </div>
                <div id="routes">
                    <div id="routeList">

                    </div>
                </div>
            </div>
            <div id="searchNameBar" style="display:none" class="toolWindow">
                <div>
                    <div class="title">
                        <a href="#" onClick="javascript:SearchNameManager.closeSidebar(); return false;" style="float:right;">
                            <img src="openlayers/theme/default/img/close.gif" alt="закрыть" title="Закрыть" style="border:none;"/>
                        </a>
                        <div>Поиск</div>
                    </div>
                    <div>Поиск по названию населенного пункта</div>
                    <form onSubmit="javascript:SearchNameManager.doSearch(this); return false;" action="">
                        <input id="nquerystring" />
                        <input id="nsearch" type="submit" value="Найти" />
                    </form>

                </div>
                <div id="nresults">
                    <div id="ntotalResultsCount" ></div>
                    <div id="nresultsList" ></div>
                </div>

            </div>

        <div>
            <ul id="tabBar"></ul>
            <div id="map" style="position: absolute; top: 40px; left:0; right:0; bottom:0px"></div>
        </div>
    </body>


    <script type="text/javascript">
        function loaded() {
            Application.initialize();
            var position = new OpenLayers.LonLat(<?=$lon?>,<?=$lat?>);
            var zoom = <?=$zoom ?>;
            application.map.setMapCenter(position, zoom);

            <? if ($layers) { ?> shuya.map.setMapLayers('<?=$layers?>'); <? } ?>
        }
    </script>
</html>

