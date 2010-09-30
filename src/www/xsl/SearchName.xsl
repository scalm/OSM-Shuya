<?xml version="1.0" encoding="UTF-8"?>
<!--
    Document   : selectRelations.xsl
    Created on : 10 Август 2010 г., 16:02
    Author     : scalm
    Description:
        Purpose of transformation follows.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
xmlns:php="http://php.net/xsl"
>
    <xsl:output method="xml" encoding="utf-8" indent="yes"/>
    <xsl:param name="name" />
    <xsl:template match="/">
        <xsl:apply-templates select="/osm"/>
    </xsl:template>
    
    <xsl:template match="/osm">
        <xsl:element name="{name()}">
            <xsl:for-each select="@*">
                <xsl:copy/>
            </xsl:for-each>

            <xsl:variable name="found" select="/osm/*[(name()='way' or name()='node' or name()='relation') and tag[@k='name' and (string-length($name)=0 or php:functionString('mb_stripos', @v, $name)!=boolean(false))]]" />
            <xsl:apply-templates select="$found" mode="copytags"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="*" mode="copy">
        <xsl:copy-of select='.' />
    </xsl:template>

    <xsl:template match="*" mode="copytags">
        <xsl:element name="{name()}">
            <xsl:for-each select="@id">
                <xsl:copy/>
            </xsl:for-each>

            <xsl:for-each select="@lat">
                <xsl:copy/>
            </xsl:for-each>

            <xsl:for-each select="@lon">
                <xsl:copy/>
            </xsl:for-each>

            <xsl:apply-templates select="./tag" mode="copy" />
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>

