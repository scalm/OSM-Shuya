<?xml version="1.0" encoding="UTF-8"?>
<!--
    Document   : selectRelations.xsl
    Created on : 10 Август 2010 г., 16:02
    Author     : scalm
    Description:
        Purpose of transformation follows.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="xml" encoding="utf-8" indent="yes"/>
    <xsl:template match="/">
           <xsl:apply-templates select="/osm"/>
     </xsl:template>   
    
    <xsl:template match="/osm">
        <xsl:element name="{name()}">
         <xsl:for-each select="@*">
           <xsl:copy/>
         </xsl:for-each>

        <xsl:variable name="amenityWays" select="/osm/way[tag[@k='amenity']]" />
        <xsl:apply-templates select="$amenityWays" mode="copy"/>

        <xsl:variable name="amenityWayNodes" select="$amenityWays/nd[@ref]" />

        <xsl:variable name="amenityNodes" select="/osm/node[tag[@k='amenity'] or @id=$amenityWayNodes/@ref]" />

        <xsl:apply-templates select="$amenityNodes" mode="copy"/>
        
        </xsl:element>
    </xsl:template>

    <xsl:template match="*" mode="copy">
        <xsl:copy-of select='.' />
    </xsl:template>

</xsl:stylesheet>

