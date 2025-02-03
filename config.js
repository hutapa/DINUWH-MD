const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "kNoDiQQT#aJmyx45Nrkjr8AJom1_bwViVk4DJ40rNGnzNo5yahLc",
  MONGODB: process.env.MONGODB || "mongodb://mongo:cDcUmTPFlGXoMrEwOkiPaJkvYYhBKveq@junction.proxy.rlwy.net:48589",
  OWNER_NUM: process.env.OWNER_NUM || "94720244981",
};
