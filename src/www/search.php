<?php

require_once('inc/Search.class.php');

header('Content-Type: text/xml; charset=UTF-8');
mb_internal_encoding("UTF-8");
//setlocale(LC_ALL, 'ru_RU.UTF8');

$search = new Search();
$result = $search->find($_REQUEST['name']);
if($result) {
    echo $result;
} else {
    echo 'Error';
}

?>
