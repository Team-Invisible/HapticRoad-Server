const admin = require("firebase-admin");
const serviceAccount = require("./invisible-hapticroad-firebase-adminsdk-yajf6-48f4c5c271");
const dotenv = require("dotenv");

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require("./api"),
};
