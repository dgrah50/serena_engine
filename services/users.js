const dotenv = require("dotenv").config();
const GETSTREAM_APP_KEY = process.env.GETSTREAM_APP_KEY;
const GETSTREAM_APP_ID = process.env.GETSTREAM_APP_ID;
const GETSTREAM_APP_SECRET = process.env.GETSTREAM_APP_SECRET;
const admin = require("../middleware/firebase-admin/admin");
let stream = require("getstream");
const client = stream.connect(
  GETSTREAM_APP_KEY,
  GETSTREAM_APP_SECRET,
  GETSTREAM_APP_ID
);

export const createNewUser = async (userID, userName) => {
  let profImg = null;

  await admin
    .auth()
    .getUser(userID)
    .then(function(userRecord) {
      profImg = userRecord.photoURL;
      console.log("Successfully fetched user data:", profImg);
      console.log(userID)
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
    });

  // try {
  //   client.user(userID).getOrCreate({
  //     name: userName,
  //     profileImage: profImg
  //       ? profImg
  //       : "https://eu.ui-avatars.com/api/?name=" + userName.split(" ").join("+")
  //   });
  //   return "Success";
  // } catch (error) {
  //   console.log(error);
  //   return error;
  // }

};

export const generateUserToken = userID => {
  try {
    return client.createUserToken(userID);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const followOtherUser = (userID, otherUserID) => {
  try {
    let user = client.feed("user", userID);
    user.follow("user", otherUserID);
  } catch (error) {
    throw error;
  }
};

// // TO BE IMPLEMENTED
// export const deleteGroup = userID => {
//   let firestoreref = firebase
//     .firestore()
//     .collection("groups")
//     firestoreref.doc(groupID).delete().then(function() {
//         console.log("Document successfully deleted!");
//     }).catch(function(error) {
//         console.error("Error removing document: ", error);
//     });
// };
// export const unfollowGroup = (userID, groupID) => {
//   try {
//     var user = client.feed("user", userID);
//     user.follow("group", groupID);
//     let firestoreref = firebase
//       .firestore()
//       .collection("users")
//       .doc(firebase.auth().currentUser.uid)
//       .collection("groups");
//     firestoreref.doc(groupID).delete().then(function() {
//         console.log("Document successfully deleted!");
//     }).catch(function(error) {
//         console.error("Error removing document: ", error);
//     });

//   } catch (error) {
//     throw error;
//   }
// };
