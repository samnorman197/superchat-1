const functions = require("firebase-functions");
const Filter = require("bad-words");
const firebase = require("firebase/app");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Update this to your file
const firestore = require('firebase/firestore');
// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://palm363d6.firebaseio.com'
})


const app = firebase.initializeApp();
const db = admin.firestore();


exports.detectEvilUsers = functions.firestore
    .document("messages/{msgId}").onCreate(async (doc, ctx) => {
      const filter = new Filter();
      const {text, uid} = doc.data();
      if (filter.isProfane(text)) {
        const cleaned = filter.clean(text);
        await doc.ref.update({
          text: `🤐 I got BANNED for life for saying... ${cleaned}`});
        await db.collection("banned").doc(uid).set({});
      }
      const userRef = db.collection("users").doc(uid);
      const userData = (await userRef.get()).data();
      if (userData.msgCount >= 7) {
        await db.collection("banned").doc(uid).set({});
      } else {
        await userRef.set({msgCount: (userData.msgCount || 0)+1});
      }
    });
