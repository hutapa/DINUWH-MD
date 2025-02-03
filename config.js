const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "33gW1SqY#87ZsRHDkMF0R4578o24tNZ7AsiMa4Yyz3Oehp2MUSMs",
  MONGODB: process.env.MONGODB || "mongodb://mongo:cDcUmTPFlGXoMrEwOkiPaJkvYYhBKveq@junction.proxy.rlwy.net:48589",
  OWNER_NUM: process.env.OWNER_NUMBER || "94764582504",
  MODE: process.env.MODE || "public"
};
