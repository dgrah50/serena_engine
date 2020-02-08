import * as lzstring from "lz-string";
import * as np from "numj";
const admin = require("../middleware/firebase-admin/admin");
const sqlite3 = require("sqlite3").verbose();
const w2v = require("word2vec");
const topicToOSIS = require("./verseDependencies/constants/topicToOSIS.json");
const parseQuery = require("./verseDependencies/libs/bibleQueryParser.js");
const knowntopics = require("./verseDependencies/constants/knowntopics.json");
const sermondata = require("./verseDependencies/constants/sermondata.json");
const keywords = require("./verseDependencies/libs/keywords.js").keywords;
let _ = require("underscore");
const sermonTopics = Object.keys(sermondata);
let db = {};
let model = {};

const unpackVectors = function(data, type) {
  let jsonData = JSON.parse(lzstring.decompressFromBase64(data));
  let npArray = np.array(jsonData.vectors, type);
  npArray = np.NdArray.prototype.reshape.apply(npArray, jsonData.shape);
  return npArray;
};

const fetchModel = async function(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
};

const osisToEng = function(verseosis) {
  if (verseosis == "0") {
    return "";
  }
  if (verseosis.length == 7) {
    verseosis = "0" + verseosis;
  }

  let en_names = {
    "01": "Genesis",
    "02": "Exodus",
    "03": "Leviticus",
    "04": "Numbers",
    "05": "Deuteronomy",
    "06": "Joshua",
    "07": "Judges",
    "08": "Ruth",
    "09": "1 Samuel",
    "10": "2 Samuel",
    "11": "1 Kings",
    "12": "2 Kings",
    "13": "1 Chronicles",
    "14": "2 Chronicles",
    "15": "Ezra",
    "16": "Nehemiah",
    "17": "Esther (Hebrew)",
    "18": "Job",
    "19": "Psalms",
    "20": "Proverbs",
    "21": "Ecclesiastes",
    "22": "Song of Songs",
    "23": "Isaiah",
    "24": "Jeremiah",
    "25": "Lamentations",
    "26": "Ezekiel",
    "27": "Daniel (Hebrew)",
    "28": "Hosea",
    "29": "Joel",
    "30": "Amos",
    "31": "Obadiah",
    "32": "Jonah",
    "33": "Micah",
    "34": "Nahum",
    "35": "Habakkuk",
    "36": "Zephaniah",
    "37": "Haggai",
    "38": "Zechariah",
    "39": "Malachi",
    "40": "Matthew",
    "41": "Mark",
    "42": "Luke",
    "43": "John",
    "44": "Acts",
    "45": "Romans",
    "46": "1 Corinthians",
    "47": "2 Corinthians",
    "48": "Galatians",
    "49": "Ephesians",
    "50": "Philippians",
    "51": "Colossians",
    "52": "1 Thessalonians",
    "53": "2 Thessalonians",
    "54": "1 Timothy",
    "55": "2 Timothy",
    "56": "Titus",
    "57": "Philemon",
    "58": "Hebrews",
    "59": "James",
    "60": "1 Peter",
    "61": "2 Peter",
    "62": "1 John",
    "63": "2 John",
    "64": "3 John",
    "65": "Jude",
    "66": "Revelation"
  };

  let bookname =
    en_names[verseosis.substring(0, 2)] +
    " " +
    verseosis.substring(3, 5) +
    ":" +
    verseosis.substring(6, 8);
  return bookname;
};

const fetchSermon = function(topic) {
  let ret = model
    .getNearestWords(model.getVector(topic), 40)
    .filter(nearestWord => {
      return sermonTopics.includes(nearestWord.word);
    });
  if (ret.length != 0) {
    let wrd = ret[0].word;
    return {
      current: _.sample(sermondata[wrd], 5),
      nextrecs: _.sample(sermondata[wrd], 3)
    };
  } else {
    return {
      current: _.sample(sermondata["faith"], 5),
      nextrecs: _.sample(sermondata["faith"], 3)
    };
  }
};
//Returns list of verses related to a topic
const topicToVerse = async function(bibleVersion, topic, db) {
  let osisCodes = topicToOSIS[topic]; //returns a list of OSIS codes
  let verseList = await osisToVerse(bibleVersion, osisCodes, db);
  return verseList;
};
//Given an OSIS this function return the verse from the Bible
//params : Bible Version and OSIS
const osisToVerse = async function(bibleVersion, osisCodes, db) {
  let verseList = [];
  for (let index in osisCodes) {
    let osis = osisCodes[index];
    let sql = "SELECT * FROM " + bibleVersion + " WHERE id=" + osis;
    db.get(sql, [], (err, row) => {
      verseList.push({ osis: osis, verse: row.t, bookname: osisToEng(osis) });
    });
  }
  return new Promise((res, rej) => {
    setTimeout(() => res(_.sample(verseList, 3)), 200);
  });
};
//Given an Bible verse reference in English this function returns the osis
//params : Bible verse reference in English
const engToOsis = function(eng) {
  eng = eng.split(".");
  let convertEngToOsis = {
    Gen: 1,
    Exod: 2,
    Lev: 3,
    Num: 4,
    Deut: 5,
    Josh: 6,
    Judg: 7,
    Ruth: 8,
    "1Sam": 9,
    "2Sam": 10,
    "1Kgs": 11,
    "2Kgs": 12,
    "1Chr": 13,
    "2Chr": 14,
    Ezra: 15,
    Neh: 16,
    Esth: 17,
    Job: 18,
    Ps: 19,
    Prov: 20,
    Eccl: 21,
    Song: 22,
    Isa: 23,
    Jer: 24,
    Lam: 25,
    Ezek: 26,
    Dan: 27,
    Hos: 28,
    Joel: 29,
    Amos: 30,
    Obad: 31,
    Jonah: 32,
    Mic: 33,
    Nah: 34,
    Hab: 35,
    Zeph: 36,
    Hag: 37,
    Zech: 38,
    Mal: 39,
    Matt: 40,
    Mark: 41,
    Luke: 42,
    John: 43,
    Acts: 44,
    Rom: 45,
    "1Cor": 46,
    "2Cor": 47,
    Gal: 48,
    Eph: 49,
    Phil: 50,
    Col: 51,
    "1Thess": 52,
    "2Thess": 53,
    "1Tim": 54,
    "2Tim": 55,
    Titus: 56,
    Phlm: 57,
    Heb: 58,
    Jas: 59,
    "1Pet": 60,
    "2Pet": 61,
    "1John": 62,
    "2John": 63,
    "3John": 64,
    Jude: 65,
    Rev: 66
  };
  eng = convertEngToOsis[eng[0]] + padToThree(eng[1]) + padToThree(eng[2]);
  return eng;
  function padToThree(str) {
    if (str.length == 1) {
      return "00" + str;
    } else if (str.length == 2) {
      return "0" + str;
    } else {
      return str;
    }
  }
};

//  function to load the word vectors and Bible db
export const init = function() {
  console.log("Loading vectors");
  w2v.loadModel(
    "./services/verseDependencies/db/gnews.bin",
    (error, loadedmodel) => {
      model = loadedmodel;
      console.log("Finished loading vectors");
    }
  );
  db = new sqlite3.Database(
    "./services/verseDependencies/db/bible.db",
    sqlite3.OPEN_READONLY,
    err => {
      if (err) {
        console.error(err.message);
      }
    }
  );
};

// Main function to search and obtain result to be returned over API
export const verseSearch = async function(userID, query, addToDB) {
  let queryParsed = parseQuery(query);
  if (queryParsed.recommend == "osis") {
    //this path is taken if the query is assumed to be asking for a specific verse
    let verse = await osisToVerse(
      "t_kjv",
      [engToOsis(queryParsed.components[0].osis)],
      db
    );
    return {
      keyword: "osis",
      verses: verse,
      sermons: fetchSermon("faith")
    };
  } else {
    //this path is take if the query is a general prayer
    let extractedKeywords = keywords(query);
    try {
      if (extractedKeywords != null) {
        for (const topic of extractedKeywords) {
          if (knowntopics.indexOf(topic) >= 0) {
            if (addToDB) {
              let db = admin
                .firestore()
                .collection("users")
                .doc("" + userID)
                .collection("Info")
                .doc("history");
              try {
                await db.set(
                  {
                    history: admin.firestore.FieldValue.arrayUnion(topic)
                  },
                  { merge: true }
                );
              } catch (err) {
                console.log(err);
              }
            }
            return {
              keyword: topic,
              verses: await topicToVerse("t_kjv", topic, db),
              sermons: fetchSermon(topic)
            };
          }
        }
      } else {
        let bestTopic = model
          .getNearestWords(model.getVector(extractedKeywords[0]), 40)
          .filter(nearestWord => {
            return knowntopics.includes(nearestWord.word);
          })
          .map(nearestWord => nearestWord.word)[0];
        if (addToDB) {
          let db = admin
            .firestore()
            .collection("users")
            .doc("" + userID)
            .collection("Info")
            .doc("history");
          try {
            await db.set(
              {
                history: admin.firestore.FieldValue.arrayUnion(bestTopic)
              },
              { merge: true }
            );
          } catch (err) {
            console.log(err);
          }
        }
        return {
          keyword: bestTopic,
          verses: await topicToVerse("t_kjv", bestTopic, db),
          sermons: fetchSermon(bestTopic)
        };
      }
    } catch (error) {
      return verseSearch(userID, "faith", false);
    }

    return verseSearch(userID, "faith", false);
  }
};

//NEED TO LOG SEARCH VECTORS

//TO BE IMPLEMENTED
export const getRecommendedSermons = async function(userID) {
  userID = "" + userID;
  let db = admin
    .firestore()
    .collection("users")
    .doc("" + userID)
    .collection("Info")
    .doc("history");
  return db
    .get()
    .then(res => {
      return res.data();
    })
    .then(history => {
      return calculateMeanVec(userID, history);
    });
};

const calculateMeanVec = function(userID, history) {
  if (history) {
    history = history.history;
    history = history.slice(-10);
    let meanword = history
      .map(word => {
        let interm = model.getVector(word);

        if (interm) {
          return Array.from(interm.values);
        } else {
          return null;
        }
      })
      .filter(x => {
        return x;
      })
      .reduce((a, b) => a.map((val, i) => val + b[i]), new Array(300).fill(0));

    meanword = model.getNearestWord(meanword).word;
    return verseSearch(userID, meanword, false);
  }
  return verseSearch(userID, "faith", false);
};
