const services = require("../services");

const { getVerse, generateToken, enrichUser, getVerseRecs, createGroup } = services; ;

/*
 * call other imported services, or same service but different functions here if you need to
 */
const postSearch = async (req, res, next) => {
  const { userID, content } = req.body;
  try {
    res.send(await getVerse(userID,content));
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const getToken = async (req, res, next) => {
  const {content } = req.body;
  try {
    res.send( await generateToken(content));
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const getRecs = async (req, res, next) => {
  const {userID} = req.body;
  try {
    res.send( await getVerseRecs(userID));
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const postUser = async (req, res, next) => {
  const {userID,userName} = req.body;
  try {
    res.send( await enrichUser(userID,userName));
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const postGroupCreation = async (req, res, next) => {
  const { userID, groupName, groupDesc} = req.body;
  try {
    res.send(await createGroup(userID, groupName, groupDesc));
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};



module.exports = {
  postSearch,
  getToken,
  postUser,
  getRecs,
  postGroupCreation
};
