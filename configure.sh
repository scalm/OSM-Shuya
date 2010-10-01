#!/bin/bash

BASE_DIR=$PWD
WWW_DIR=$PWD/src/www

if [ ! -e vendor ]
then
	mkdir vendor
fi

echo OK	Vendor

cd vendor

if [ ! -e prototype ]
then
	git clone git://github.com/sstephenson/prototype.git
fi
echo OK	prototype

if [ ! -e prototype/dist/prototype.js ]
then
	cd prototype
	rake
	cd ..
fi
echo OK	prototype.js
ln -sf -t "$WWW_DIR/lib-dev" ../../../vendor/prototype/dist/prototype.js
ln -sf -t "$WWW_DIR/lib" ../../../vendor/prototype/dist/prototype.js

if [ ! -e openlayers ]
then
	svn checkout http://svn.openlayers.org/trunk/openlayers/
	cd openlayers/build
	build.py
	cd ../..
fi
echo OK	openlayers


DIR=$WWW_DIR/lib-dev/openlayers
mkdir -p "$DIR"
cd "$DIR"
ln -sf ../../../../vendor/openlayers/lib
ln -sf ../../../../vendor/openlayers/img
ln -sf ../../../../vendor/openlayers/theme

DIR=$WWW_DIR/lib/
mkdir -p "$DIR"
cd "$DIR"
ln -sf ../../../vendor/openlayers/build/OpenLayers.js
ln -sf ../../../vendor/openlayers/img
ln -sf ../../../vendor/openlayers/theme


cd "$BASE_DIR"

if [ "$1" = "dist" ]
then
	DIST_WWW_DIR="$BASE_DIR/dist/www"
	mkdir -pv "$DIST_WWW_DIR"
	cd "$WWW_DIR"
	cp -LRuv "css" "$DIST_WWW_DIR"
	cp -LRuv "data" "$DIST_WWW_DIR"
	cp -LRuv "img" "$DIST_WWW_DIR"
	cp -LRuv "inc" "$DIST_WWW_DIR"
	cp -LRuv "js" "$DIST_WWW_DIR"
	find -L "lib" \( ! -regex '.*/\..*' \) -type d -exec mkdir -pv "$DIST_WWW_DIR/{}"  \;
	find -L "lib" \( ! -regex '.*/\..*' \) -type f -exec cp -Luv {} "$DIST_WWW_DIR/{}" \;
	cp -LRuv "xsl" "$DIST_WWW_DIR"
	cp -Luv *.php "$DIST_WWW_DIR"
	
	mkdir -pv "$DIST_WWW_DIR/config"
	cp -Luv config/config.dist.php "$DIST_WWW_DIR/config/config.php"
fi