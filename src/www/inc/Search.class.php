<?php

/**
 * Description of Search
 *
 * @author scalm
 */
class Search {

    public function __construct()
    {
        ;
    }

    /**
     *
     * @param string $string
     * @return array
     */
    public function find($string)
    {
        $xmldoc = new DOMDocument();
        $result = $xmldoc->load('data/Map.xml');
        

        $xsldoc = new DOMDocument();
        $xsldoc->load('xsl/SearchName.xsl');

        $xslt = new XSLTProcessor();
        $xslt->importStylesheet($xsldoc);
        $xslt->setParameter('', array('name' => $string));
        $xslt->registerPHPFunctions();

        $result = $xslt->transformToXml($xmldoc);

        return $result;

    }
}
?>
