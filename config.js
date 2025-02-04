const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  MONGODB: process.env.MONGODB || "mongodb://mongo:oBCvYzQlfblDyFchIUEfVKgscFwOeVpx@monorail.proxy.rlwy.net:40207",
  OWNER_NUM: process.env.OWNER_NUM || "94720244981",
  SESSION_ID: process.env.SESSION_ID || "o6En3ZSS#Lpwn7gbPa22IQC_ujyCrnKOgPAxRydXxu3a1bDggccE",
};

