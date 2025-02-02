const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "bRoBkDCI#TuuV90-MSfivlBGsQzhZ0tMzYZp8Wj68C-m7aaI0Mk4",
  MONGODB: process.env.MONGODB || "mongodb://mongo:VnmPKQRScPrTMnbDGTEixTPCUTzxlmyD@viaduct.proxy.rlwy.net:20822",
  OWNER_NUM: process.env.OWNER_NUM || "94764582504",
};
