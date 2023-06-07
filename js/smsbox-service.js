/**
 * FACTORISATION (REFACTORING), le but étant, en découpant le code, de le rendre plus lisible
 */

/**
 * Petit test pour vérifier la connextion entre les 2 fichiers
 */
export function test() {
  console.log(
    "test d'import du fichier 'smsbox-service' dans le fichier 'main.js'"
  );
  return "ok test";
}

/**
 * Methode qui permet de déposer un fichier sonore vers le serveur smsbox
 * @param file : fichier sonore local
 * @param apiKey : clé api, importé dans le fichier main.js depuis le fichier 'config.json'
 * @return file_id : identifiant du fichier sonore déposé sur le serveur
 */
export function importFile(file, apiKey) {
  console.log(
    "test d'import de la fonction 'importFile' depuis le fichier smsbox-service"
  );
  var urlencoded = new FormData(); // FormData et non URLSearchParams car le serveur attend un type 'fichier'
  urlencoded.append("file", file);
  urlencoded.append("user_reference", "1234");

  var requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Authorization": "App " + apiKey, // clé API "pub-xxxxxxxx"
      "Content-Type": "multipart/form-data", //En cas d’utilisation de la méthode POST, les données doivent être transmises sous le format application/x-www-form-urlencoded, ou multipart/form-data pour la méthode import.
    },
    mode: "no-cors", // désactive le contrôle pour faire une requête sur un domaine différent du mien
    body: urlencoded,
    redirect: "follow",
  };
  console.log(requestOptions);
  console.log(file);
  fetch("https://api.smsbox.net/vmm/1.0/json/import?apikey="+ apiKey, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  console.log("fin de la fonction importFile");
}

/**
 * Methode qui permet d'envoyer le message vocal sur le numéro de téléphone du destinataire
 * @param file_id : identifiant du fichier local
 * @param recipients : numero de telephone du destinataire
 */
export async function sendFile(file_id, recipients, apiKey) {
  console.log(
    "test d'import de la fonction 'sendFile' depuis le fichier smsbox-service"
  );

  var urlencoded = new URLSearchParams();
  urlencoded.append("recipients", recipients);
  urlencoded.append("file_id", file_id);

  var requestOptions = {
    method: "POST",
    headers: {
      Authorization: "App " + apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    mode: "no-cors", // désactive le contrôle pour faire une requête sur un domaine différent du mien
    body: urlencoded,
    redirect: "follow",
  };

  fetch("https://api.smsbox.net/vmm/1.0/json/send", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  console.log("fin de la fonction sendFile");
}
