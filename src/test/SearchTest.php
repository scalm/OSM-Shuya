<?php

require_once 'PHPUnit/Framework.php';

require_once dirname(__FILE__) . '/../../../../../var/www/maps/Search.class.php';

/**
 * Test class for Search.
 * Generated by PHPUnit on 2010-09-09 at 16:00:06.
 */
class SearchTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var Search
     */
    protected $object;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp()
    {
        $this->object = new Search;
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {

    }

    /**
     * @todo Implement testSearch().
     */
    public function testSearch()
    {
        $this->assertEquals(0, 1);
    }

}

?>
