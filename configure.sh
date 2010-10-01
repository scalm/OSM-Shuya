#!/bin/bash

# Directories
BASE_DIR=$PWD
WWW_DIR=$PWD/src/www
DIST_WWW_DIR=$BASE_DIR/dist/www
VENDOR_DIR=$BASE_DIR/vendor

# Vendors
mkdir -p "$VENDOR_DIR"
cd "$VENDOR_DIR"

# Vendors > Prototype.js
if [ ! -e prototype ]
then
	git clone git://github.com/sstephenson/prototype.git
fi

if [ ! -e prototype/dist/prototype.js ]
then
	cd prototype
	rake
	cd ..
fi

ln -sf -t "$WWW_DIR/lib" ../../../vendor/prototype/dist/prototype.js

# Vendors > OpenLayers

if [ ! -e openlayers ]
then
	svn checkout http://svn.openlayers.org/trunk/openlayers/
	cd openlayers/build
	build.py
	cd ../..
fi

DIR=$WWW_DIR/lib/openlayers
REL_VENDOR_DIR=../../../../vendor
mkdir -p "$DIR"
cd "$DIR"
ln -sf "$REL_VENDOR_DIR/openlayers/lib"
ln -sf "$REL_VENDOR_DIR/openlayers/img"
ln -sf "$REL_VENDOR_DIR/openlayers/theme"


# Distribution
if [ "$1" = "dist" ]
then
	# Source code
	mkdir -p "$DIST_WWW_DIR" # to (dest-dir)
	cd "$WWW_DIR" # from (src-dir)

    cp -Lu *.php "$DIST_WWW_DIR"   # source code
	cp -LRu "inc" "$DIST_WWW_DIR"
	cp -LRu "js" "$DIST_WWW_DIR"
	cp -LRu "css" "$DIST_WWW_DIR"  # styles
    cp -LRu "img" "$DIST_WWW_DIR"
	cp -LRu "data" "$DIST_WWW_DIR" # data
    cp -LRu "xsl" "$DIST_WWW_DIR"

    # Libraries
    mkdir -p "$DIST_WWW_DIR/lib" # dest-dir
    cd "$DIST_WWW_DIR/lib/"

    # Libraries > Prototype.js
    cp -Lu "$VENDOR_DIR/prototype/dist/prototype.js" .

    # Libraries > OpenLayers
    cp -Lu "$VENDOR_DIR/openlayers/build/OpenLayers.js" .
    cp -LRu "$VENDOR_DIR/openlayers/img" .
    cp -LRu "$VENDOR_DIR/openlayers/theme" .

    # Configuration
	mkdir -p "$DIST_WWW_DIR/config"
	cp -Lu "$WWW_DIR/config/config.dist.php" "$DIST_WWW_DIR/config/config.php"

    echo "configure dist done."
else
    echo "configure done."
fi