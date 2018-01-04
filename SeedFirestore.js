// Thanks to https://hackernoon.com/filling-cloud-firestore-with-data-3f67d26bd66e
const admin = require('./node_modules/firebase-admin');
const serviceAccount = require("./service-key.json");

const data = require("./data.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://app-builders-e1ae7.firebaseio.com"
});

data && Object.keys(data).forEach(key => {
  const nestedContent = data[key];
  if (typeof nestedContent === "object") {
    Object.keys(nestedContent).forEach(docTitle => {
      admin.firestore()
        .collection(key)
        .doc(docTitle)
        .set(nestedContent[docTitle])
        .then((res) => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    });
  }
});
