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
        <!--xsl:apply-templates select="/osm/relation[tag[@k='type' and @v='route']]"/-->
        <!--xsl:apply-templates select="/osm/*[self::way or self::node]"/-->

        <!-- all route relations with type=route -->
        <xsl:variable name="rrels" select="/osm/relation[tag[@k='type' and @v='route']]" />
        <!--xsl:apply-templates select="$rrels" mode="copyRelation"/-->
        <xsl:apply-templates select="$rrels" mode="copy"/>

        <!-- its member ways -->
        <xsl:variable name="rrelmemberways" select="$rrels/member[@ref and @type='way']" />
        <!-- its member nodes -->
        <xsl:variable name="rrelmembernodes" select="$rrels/member[@ref and @type='node']" />

        <!-- all way where @id in {rrels@id } -->
        <xsl:variable name="rrelways" select="/osm/way[@id=$rrelmemberways/@ref]" />
        <xsl:apply-templates select="$rrelways" mode="copy"/>


        <!-- all its nodes -->
        <xsl:variable name="rrelwaynodes" select="$rrelways/nd[@ref]" />
        <!-- all nodes where @id in {rrelmembernodes.@id} or {rrelways.@id} -->
        <xsl:variable name="rrelnodes" select="/osm/node[@id=$rrelwaynodes/@ref or @id=$rrelmembernodes/@ref]" />
        <xsl:apply-templates select="$rrelnodes" mode="copy"/>
        
        </xsl:element>
    </xsl:template>

    <xsl:template match="*" mode="copy">
        <xsl:copy-of select='.' />
    </xsl:template>

</xsl:stylesheet>

