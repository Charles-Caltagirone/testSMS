<?php
// phpinfo();

require 'vendor/autoload.php';

use GuzzleHttp\Client; //bibliotèque Guzzle importée
use GuzzleHttp\Psr7\Request;

$client  = new Client();
$apiKey = 'Rentez votre API';
$telNumber = '0671084538'; // $_POST['telNumber']
$fileId = 'testMsg'; // $_POST['id_file']


/**
 * Fonction test qui envoie un SMS au destinataire
 */
function sendSMS($apiKey, $telNumber, $client)
{
    $headers = [
        'Authorization' => 'App ' . $apiKey,
        'Content-Type'  => 'application/x-www-form-urlencoded'
    ];
    $options = [
        'form_params' => [
            'dest' => $telNumber,
            'msg'    => 'testmsg',
            'mode' => 'standard'
        ]
    ];
    $request = new Request('POST', 'https://api.smsbox.net/api.php', $headers);
    $res     = $client->sendAsync($request, $options)->wait();
    echo $res->getBody();
}
// sendSMS($apiKey, $telNumber, $client); // Pour exécuter la requête d'envoie de SMS


/**
 * Effectue la requete 'import' pour envoyer le fichier vocal vers le serveur
 */
if (isset($_POST['submitServer'])) {
    $fileServerName = $_FILES['fileServer']['name'];
    $fileServer = $_FILES['fileServer'];
    $fileServerJson = json_encode($fileServer);

    $fileTypeSplit = explode("/", $fileServer["type"]); // split pour couper en 2 le 'type : audio/wav'
    $fileType = $fileTypeSplit[1]; // on garde que l'extension pour s'en servir en condition
    // var_dump($fileTypeSplit);

    if ($fileServerName == null) {
        var_dump('choisir fichier');
    } elseif ($fileType != 'wav' && $fileType != 'mp3' && $fileType != 'ogg' && $fileType != 'wma' && $fileType != 'webm') {
        var_dump("Mauvais format (seuls WAV, MP3, OGG, WMA, et WEBM sont acceptés)");
    } elseif ($fileServer["size"] > 5000000) {
        var_dump("fichier trop volumieux (max. 5 Mo");
    } else {
        var_dump($fileServer);
        $headers = [
            "Authorization" => "App " . $apiKey, // clé API "pub-xxxxxxxx"
            "Content-Type" => "multipart/form-data" //En cas d’utilisation de la méthode POST, les données doivent être transmises sous le format application/x-www-form-urlencoded, ou multipart/form-data pour la méthode import.
        ];
        $options = [
            'multipart' => [ // 'multipart' au lieu de 'form_params' car le "Content-Type" => "multipart/form-data"
                'file' => $fileServer,
                // 'contents' => fopen($fileServer['tmp_name'], 'r'), // Pas sûr mais cette fonction est peut-être utile pour envoyer le contenu du 'file'
            ]
        ];
        $request = new Request('POST', 'https://api.smsbox.net/vmm/1.0/json/import', $headers);
        // var_dump($request);
        $res = $client->sendAsync($request, $options)->wait();
        // var_dump($res);
        echo $res->getBody();
    }
}

/**
 * Effectue la requête 'send' pour envoyer le vocal sur la messagerie du destinataire
 */
if (isset($_POST['submitClient'])) {
    if ($_POST['id_file'] == null || $_POST['telNumber'] == null) {
        var_dump('Remplir les chants');
    } else {
        var_dump('submitclient');
        $headers = [
            'Authorization' => 'App ' . $apiKey,
            'Content-Type'  => 'application/x-www-form-urlencoded'
        ];
        $options = [
            'form_params' => [
                'recipients' => $telNumber,
                'file_id'    => $fileId
            ]
        ];
        $request = new Request('POST', 'https://api.smsbox.net/vmm/1.0/json/send', $headers);
        $res     = $client->sendAsync($request, $options)->wait();
        echo $res->getBody();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TEST SMSBOX</title>
    <link rel="stylesheet" href="./css/style.css">
    <script src="./js/record.js" defer></script> <!-- 'defer' permet de placer le script dans le head mais tout en l'exécutant après -->
    <script type="module" src="./js/main.js" defer></script> <!-- 'type module' permet de faire communiquer ce script avec un autre -->
</head>

<body>
    <div class="container">
        <div class="entete">
            <img src="./assets/logo.png" alt="" srcset="">
        </div>
        <div class="rubrique" id="recordAudio">
            <h2>1 - Effectuer un nouvel enregistrement :</h2>
            <div class="display"> <!-- lecteur audio -->
            </div>
            <div class="controllers"> <!-- button pour démarrer, stopper ou recommencer l'audio -->
            </div>
        </div>
        <form action="" method="post" id="formAudioServer" enctype="multipart/form-data">
            <div class="rubrique" id="audioServer">
                <h2>2 - Choisir un audio à envoyer au serveur :</h2>
                <!-- <label for="fileServer">Audio à envoyer (max. 5 Mo) :</label> -->
                <input type="file" id="fileServer" name="fileServer">
                <input type="submit" id="submitServer" name="submitServer" value="Envoyer au server">
            </div>
        </form>
        <form action="" method="post" id="formAudioClient" enctype="multipart/form-data">
            <div class="rubrique" id="audioClient">
                <h2>3 - Choisir un audio à envoyer au client :</h2>
                <input id="id_file" name="id_file" type="text" placeholder="id_file" />
                <input id="telNumber" name="telNumber" type="tel" placeholder="06xxxxxxxx" />
                <span class="validity"></span>
                <div>
                    <input type="submit" id="submitClient" name="submitClient" value="Envoyer au client">
                </div>
            </div>
        </form>
    </div>
</body>

</html>

</body>

</html>