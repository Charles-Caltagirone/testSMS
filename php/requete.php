<?php

require 'vendor/autoload.php';
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
$client  = new Client();
$headers = [
    'Authorization' => 'App pub-xxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type'  => 'application/x-www-form-urlencoded'];
$options = [
    'form_params' => [
        'recipients' => '+336xxxxxxxx',
        'file_id'    => 'xxxxxxxxxxxxxxxxxxxxxx'    ]
];
$request = new Request('POST', 'https://api.smsbox.net/vmm/1.0/xml/send', $headers);
$res     = $client->sendAsync($request, $options)->wait();
echo $res->getBody();

$apiKey = 'pub-94273684';

// api pour import sur server
// https://api.smsbox.net/vmm/1.0/json/import?apikey=Apppub-94273684