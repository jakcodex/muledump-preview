<?php

//  super simple time service restful api

$result = array();
if ( in_array($_REQUEST['apiPath'], ['time', 'tz']) && $_REQUEST['data'] ) {

    if ( in_array($_REQUEST['data'], timezone_identifiers_list()) ) {

        date_default_timezone_set($_REQUEST['data']);
        $result['tz'] = $_REQUEST['data'];
        $result['localtime'] = date('c');

    }

}

if ( $_REQUEST['apiPath'] === 'index' ) {

    $result['notice'] = 'All requests should be made thru /api (ex: /api/time)';
    $result['help'] = 'https://time.jakcodex.io/help';

} else {

    date_default_timezone_set('UTC');
    $result['utc'] = date('c');
    $result['epoch'] = (integer)number_format(microtime(true)*1000, 0, '.', '');

}

header('Content-Type: application/json');
header('Cache-Control: no-cache');
header('X-Powered-By: Jakcodex/SimpleTimeAPI');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
print json_encode($result) . "\n";
