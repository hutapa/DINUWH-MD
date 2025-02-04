const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "yEd0lLTD#_24nGY4NeV-BNVwTeNxCR2toIVRIzsFfXIc_FNeBTPo",
  MONGODB: process.env.MONGODB || "mongodb://mongo:VnmPKQRScPrTMnbDGTEixTPCUTzxlmyD@viaduct.proxy.rlwy.net:20822",
  OWNER_NUM: process.env.OWNER_NUM || "94764582504",
};

