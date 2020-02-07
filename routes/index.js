const express = require("express");
const {
  postSearch,
  getToken,
  postUser,
  getRecs,
  postGroupCreation
} = require("../controllers");
const router = express.Router();

router.post("/verses", postSearch);
router.post("/verses/recs", getRecs);
router.post("/users/token", getToken);
router.post("/users/create", postUser);
router.post("/groups/create", postGroupCreation);

module.exports = router;
