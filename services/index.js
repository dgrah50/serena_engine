const { verseSearch, getRecommendedSermons } = require("./verses");
const {
  generateUserToken,
  createNewUser
} = require("./users");
const { getOrMakeGroup } = require("./groups")

//  Verse API
const getVerse = async (userID,content) => {
  try {
    return await verseSearch(userID,content,true);
  } catch (e) {
    throw new Error(e.message);
  }
};

const getVerseRecs = async (userID) => {
  try {
    return await getRecommendedSermons(userID);
  } catch (e) {
    throw new Error(e.message);
  }
};

//  User API
const generateToken = async (userID) => {
  try {
    return await generateUserToken(userID);
  } catch (e) {
    throw new Error(e.message);
  }
};

const enrichUser = async (userID,userName) => {
  try {
    return await createNewUser(userID,userName)
  } catch (e) {
    throw new Error(e.message);
  }
};

// Groups API
const createGroup = async (userID, groupName,groupDesc) => {
  try {
    return await getOrMakeGroup(userID,groupName,groupDesc);
  } catch (e) {
    throw new Error(e.message);
  }
};

// const createUserUserRelationship = async (userID) => {
//   try {
//     return await followOtherUser(userID);
//   } catch (e) {
//     throw new Error(e.message);
//   }
// };

// const getFollowedGroups = async (userID) => {
//   try {
//     return await seeFollowedGroups(userID);
//   } catch (e) {
//     throw new Error(e.message);
//   }
// };

module.exports = {
  getVerse,
  generateToken,
  enrichUser,
  getVerseRecs,
  createGroup
};
