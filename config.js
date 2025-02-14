const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || "true",
STATUS_READ_MSG: process.env.STATUS_READ_MSG || "Didula MD V2 💚",
FOOTER: process.env.FOOTER || "Didula MD V2 💚",
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
IMAGE_LIMIT: process.env.IMAGE_LIMIT || "3",
ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/tC37Q7B/20241220-122443.jpg",
SESSION_ID: process.env.SESSION_ID || "𝙰𝚂𝙸𝚃𝙷𝙰-𝙼𝙳=nzZAmQCS#NxXNtSfnHtzOeBSy5XNJUAFSShy915l0ftrwen7kcMI",
OWNER_NUMBER: process.env.SESSION_ID || "94740617415",
PREFIX: process.env.PREFIX || "."
};



