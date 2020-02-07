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



export const getOrMakeGroup = async (userID, groupName, groupDesc) => {
  let firestoreref = admin.firestore().collection("groups");

  try {
    let ingroup = await firestoreref.get().then(snapshot => {
      return snapshot.docs.map(doc => doc.id).includes(groupName);
    });

    console.log(ingroup);

    if (!ingroup) {
      await firestoreref.doc(groupName).set({
        bio: groupDesc,
        creator: "" + userID
      });
      try {
        let firestoreref2 = admin
          .firestore()
          .collection("users")
          .doc("" + userID)
          .collection("Info");
        await firestoreref2.doc("groups").set(
          {
            subscribed: admin.firestore.FieldValue.arrayUnion(groupName)
          },
          { merge: true }
        );
      } catch (error) {
        console.log(error);
      }

      return "Success";
    } else {
      throw "group already exists";
    }
  } catch (error) {
    return error;
  }
};
// // TO BE IMPLEMENTED
// export const deleteGroup = (userID, groupID) => {
//   let firestoreref = admin.firestore().collection("groups");
//   firestoreref
//     .doc(groupID)
//     .get()
//     .then(res => {
//       firestoreref
//         .doc(groupID)
//         .delete()
//         .then(() => {
//           let firestoreref2 = admin
//             .firestore()
//             .collection("users")
//             .doc("" + userID)
//             .collection("Info")
//             .doc("groups");
//           firestoreref2.get().then(res => {
//             console.log(res.data);
//           });
//         });
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
