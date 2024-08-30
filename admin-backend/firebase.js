const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "pearl-project-2c336"
});

const db = admin.firestore();

module.exports = db;
