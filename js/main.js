let submitServer = document.getElementById("submitServer");
let errorAudioServer = document.createElement("p");
errorAudioServer.className = "errorAudioServer";
let errorAudioClient = document.createElement("p");
errorAudioClient.className = "errorAudioClient";
let id_file = document.getElementById("id_file");
let fileServer = document.getElementById("fileServer");
let telNumber = document.getElementById("telNumber");
let audioServer = document.getElementById("audioServer");
let audioClient = document.getElementById("audioClient");
let fileUploadButton = document.getElementById("file-upload-button");

/**
 * Chargement du contenu du fichier smsbox-service.js pour utiliser les fonctions s'y trouvant. Pour mieux découper le code.
 */
import * as service from "./smsbox-service";
/**
 * Petit test pour vérifier la connextion entre les 2 fichiers
 */
let serviceSms = service.test();

/**
 * Permet de récupérer le chemin du fichier découpé, puis d'isoler la partie essentielle "nomAudio.wav". En revanche, ça renvoie un 'string' alors que le serveur attend un type 'fichier'
 */
let fileServerSplit = fileServer.value.split("\\");
let fileServerValue = fileServerSplit[2];

/**
 * Permet de récupérer le fichier audio sous type 'fichier' et non juste string, comme le serveur attend
 */
let file;
let AudioFile;
AudioFile = (e) => {
  file = e.target.files;
  for (let i = 0; i <= file.length - 1; i++) {
    file = file[i];
  }
};
fileServer.addEventListener("change", AudioFile);

/**
 * Chargement du fichier config.json (dans un dossier à part pour pouvoir ensuite demander à gitHub de le masquer)
 */
async function loadConfig() {
  const response = await fetch("./config/config.json");
  return response.json();
}

// On récupère la clé API avant de lancer l'application
loadConfig().then((data) => {
  const apiKey = data.apiKey;
  run(apiKey);
});

/**
 * Démarrage de l'application aprés récupération de la clé API. Les requêtes sont mises à l'intérieur de la fonction API pour pouvoir la renseigner
 * Alert en cas d'api manquante, si le dossier est cloné mais sans le fichier 'config.json' masqué par github
 */
function run(apiKey) {
  // console.log("API : " + apiKey);
  if (!apiKey) {
    alert("la clé api est obligatoire");
  } else {
    /**
     * Event lors de l'envoi du fichier audio vers le serveur
     */
    submitServer.addEventListener("click", () => {
      console.log("submitServer");
      /**
       * Slipt du type de fichier pour ne récupérer que le nom de l'extension pour le comparer ensuite avec celle du fichier sélectionné
       */
      let fileSplit = file.type.split("/")
      let fileType = fileSplit[1]
      
      if (fileServer.value == "") {
        errorAudioServer.innerText = "Choisir un fichier";
        audioServer.append(errorAudioServer);
        }else if(fileType != 'wav' && fileType != 'mp3' && fileType != 'ogg' && fileType != 'wma' && fileType != 'webm'){
            errorAudioServer.innerText = "Mauvais format (seuls WAV, MP3, OGG, WMA, et WEBM sont acceptés)";
            audioServer.append(errorAudioServer);
            console.log(fileType);
        }else if(file.size > 5000000){
          errorAudioServer.innerText = "Taille max. dépassée (5 Mo)";
          audioServer.append(errorAudioServer);
          console.log(file.size + ' Ko');
        }  else {
        errorAudioServer.innerText = "Fichier envoyé";
        errorAudioServer.style.color = 'green';
        audioServer.append(errorAudioServer);
        let importFile = service.importFile(file, apiKey); // exécution de la fonction 'importFile' du fichier 'smsbox-service'
      }
    });

    
    /**
     * Event lors de l'envoi d'un id_fichier et d'un numéro de téléphone vers le serveur qui enverra au destinataire
     */
    submitClient.addEventListener("click", () => {
      console.log("test event submitClient");
      if (id_file.value == "") {
        errorAudioClient.innerText = "Rentrer un id_file";
        audioClient.append(errorAudioClient);
      } else if (telNumber.value == "") {
        errorAudioClient.innerText = "Rentrer un numéro de téléphone";
        audioClient.append(errorAudioClient);
      } else {
        let sendFile = service.sendFile('id-xxxxx', '06xxxxxxxx', apiKey); // exécution de la fonction 'sendFile' du fichier 'smsbox-service'
        errorAudioClient.innerText = "Votre message a bien été envoyé";
        errorAudioClient.style.color = 'green';
        audioClient.append(errorAudioClient);
      }      
    });
  }
}

