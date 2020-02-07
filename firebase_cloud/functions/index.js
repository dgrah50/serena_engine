const functions = require("firebase-functions");
const dotenv = require("dotenv").config();
const stream = require("getstream");
const client = stream.connect(
  GETSTREAM_APP_KEY,
  GETSTREAM_APP_SECRET,
  GETSTREAM_APP_ID
);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addStreamDetails = functions.auth.user().onCreate(user => {
  // [END onCreateTrigger]
  // [START eventAttributes]
  const photoURL = user.photoURL; // The photo of the user.
  const displayName = user.displayName; // The display name of the user.
  // [END eventAttributes]

  return addStreamDetails(photoURL, displayName);
});

async function addStreamDetails(photoURL, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };
    client.user(userID).getOrCreate({
      name: userName,
      profileImage: photoURL
        ? photoURL
        : "https://eu.ui-avatars.com/api/?name=" + userName.split(" ").join("+")
    });
  return null;
}
