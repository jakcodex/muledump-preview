<?php

//  super simple time service api

$runtime = (integer)number_format(microtime(true)*1000, 0, '.', '');
$result = array();
if ( in_array($_REQUEST['apiPath'], ['time', 'tz']) && $_REQUEST['data'] ) {

    $epoch = false;
    $tz = 'UTC';

    if ( preg_match("/^([0-9]+)\/(.*)\/?/", $_REQUEST['data'], $matches) ) {

        $tz = $matches[2];
        $epoch = $matches[1];

    } else if ( preg_match("/^(.*)\/([0-9]+)\/?/", $_REQUEST['data'], $matches) ) {

        $tz = $matches[1];
        $epoch = $matches[2];

    } else {

        if ( preg_match("/^([0-9]+)$/", $_REQUEST['data']) ) {
            $epoch = $_REQUEST['data'];
        } else {
            $tz = $_REQUEST['data'];
        }

    }

    if ( in_array($_REQUEST['data'], timezone_identifiers_list()) ) {

        date_default_timezone_set($tz);
        $result['tz'] = $tz;
        $result['localtime'] = $runtime;
        $result['localdate'] = date('c', $result['localtime']/1000);

    }

    if ( preg_match("/^([0-9]+)$/", $epoch) ) {

        date_default_timezone_set($tz);
        $result['tz'] = $tz;
        $result['localtime'] = $epoch;
        if ( strlen($epoch) < 11 ) $result['localtime'] = $result['localtime']*1000;
        $result['localdate'] = date('c', ($epoch/1000));

    }
}

if ( $_REQUEST['apiPath'] === 'index' || !$_REQUEST['apiPath'] ) {

    $result['notice'] = 'All requests should be made thru /api (ex: /api/time)';
    $result['help'] = 'https://time.jakcodex.io/help';

} else {

    date_default_timezone_set('UTC');
    $result['date'] = date('c');
    $result['epoch'] = $runtime;
    if ( $result['localtime'] ) $result['offset'] = $result['epoch']-$result['localtime'];

}

header('Content-Type: application/json');
header('Cache-Control: no-cache');
header('X-Powered-By: Jakcodex/SimpleTimeAPI');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
print json_encode($result, JSON_PRETTY_PRINT) . "\n";
