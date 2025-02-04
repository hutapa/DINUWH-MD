const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const l = console.log;
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
} = require("./lib/functions");
const fs = require("fs");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const util = require("util");
const { sms, downloadMediaMessage } = require("./lib/msg");
const axios = require("axios");
const { File } = require("megajs");

const ownerNumber = config.OWNER_NUM;

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("Please add your session to SESSION_ID env !!");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
  //mongo connect
  const connectDB = require("./lib/mongodb");
  connectDB();
  //=======================
  const { readEnv } = require("./lib/database");
  const config = await readEnv();
  const prefix = config.PREFIX;
  //===========================

  console.log("Connecting DINUWH MD");
  const { state, saveCreds } = await useMultiFileAuthState(
    __dirname + "/auth_info_baileys/"
  );
  var { version } = await fetchLatestBaileysVersion();

  const robin = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
  });

  robin.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      if (
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
      ) {
        connectToWA();
      }
    } else if (connection === "open") {
      console.log(" Installing... ");
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("DINUWH MD  installed successful ✅");
      console.log("DINUWH MD  connected to whatsapp ✅");

      let up = `DINUWH MD CONNECTED ✅`;
      let up1 = `Hello 🫣💝`;

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://i.ibb.co/Lz5FJpbT/fdf7cad162277507.jpg`
        },
        caption: up1,
      });
    }
  });

  robin.ev.on("creds.update", saveCreds);

  //=================== STATUS AUTO READ ===================
  robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    // Auto Read Status
    if (mek.key.remoteJid === "status@broadcast") {
      await robin.readMessages([mek.key]);
    }

    mek.message =
      getContentType(mek.message) === "ephemeralMessage"
        ? mek.message.ephemeralMessage.message
        : mek.message;

    if (
      mek.key &&
      mek.key.remoteJid === "status@broadcast") return;
    
    const m = sms(robin, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;
    const quoted =
      type == "extendedTextMessage" &&
      mek.message.extendedTextMessage.contextInfo != null
        ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
        : [];
    const body =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : type == "imageMessage" && mek.message.imageMessage.caption
        ? mek.message.imageMessage.caption
        : type == "videoMessage" && mek.message.videoMessage.caption
        ? mek.message.videoMessage.caption
        : "";
    const isCmd = body.startsWith(prefix);
    const command = isCmd
      ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
      : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.fromMe
      ? robin.user.id.split(":")[0] + "@s.whatsapp.net" || robin.user.id
      : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const botNumber = robin.user.id.split(":")[0];
    const pushname = mek.pushName || "Sin Nombre";
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;

    // Work Mode Restrictions
    if (!isOwner && config.MODE === "private") return;
    if (!isOwner && isGroup && config.MODE === "inbox") return;
    if (!isOwner && !isGroup && config.MODE === "groups") return;
  });

  //=================== AUTO REJECT CALLS ===================
  robin.ev.on("call", async (call) => {
    if (call.isGroup) return; // Group calls ignore

    console.log(`Incoming call from ${call.from}, rejecting...`);

    await robin.rejectCall(call.id, call.from);

    // Notify the caller
    let warningMessage = "අපගේ bot මගින් call ලබාගැනීම නොහැක 🚫";
    await robin.sendMessage(call.from, { text: warningMessage });
  });
}

//=============================================

app.get("/", (req, res) => {
  res.send("hey, DINUWH MD started✅");
});

app.listen(port, () =>
  console.log(`Server listening on port http://localhost:${port}`)
);

setTimeout(() => {
  connectToWA();
}, 4000);
