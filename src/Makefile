Makefile: www/data/Map.xml www/data/RouteRelations.xml www/data/Amenity.xml

www/data/Map.xml:
	wget -v "http://api.openstreetmap.org/api/0.6/map?bbox=41.17772,56.793305,41.61168,56.914197" -O www/data/Map.xml

www/data/RouteRelations.xml: www/data/Map.xml
	xsltproc www/xsl/RouteRelations.xsl www/data/Map.xml > www/data/RouteRelations.xml

www/data/Amenity.xml: www/data/Map.xml
	xsltproc www/xsl/Amenity.xsl www/data/Map.xml > www/data/Amenity.xml
