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
const prefix = config.PREFIX;

const ownerNumber = config.OWNER_NUMBER;

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("Please add your session to SESSION_ID env !!");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("DINUWH MD SESSION DOWNLOAD COMPLETE ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
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
      console.log("Installing...");
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log("DINUWH MD server installed successfully ✅");
      console.log("DINUWH MD WABot connected to WhatsApp ✅");

      let up = `DINUWH MD CONNECTED SUCCESSFULLY ✅`;
      let up1 = `HEY I am DINUWH MD 😻💖`;

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/Dark-Robin/Bot-Helper/refs/heads/main/autoimage/Bot%20robin%20cs.jpg`,
        },
        caption: up,
      });

      robin.sendMessage("94728896048@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/Dark-Robin/Bot-Helper/refs/heads/main/autoimage/Bot%20robin%20cs.jpg`,
        },
        caption: up1,
      });
    }
  });

  robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === "ephemeralMessage")
      ? mek.message.ephemeralMessage.message
      : mek.message;

    if (mek.key && mek.key.remoteJid === "status@broadcast") {
      if (config.AUTO_READ_STATUS === "true") {
        await robin.readMessages([mek.key]);

        const emojis = [
          "🧩", "🍉", "💜", "🌸", "🪴", "💊", "💫", "🍂", "🌟", "🎋", "😶‍🌫️",
          "🫀", "🧿", "👀", "🤖", "🚩", "🥰", "🗿", "💜", "💙", "🌝", "📌",
          "🇱🇰", "🔮", "♥️", "🎖️", "💧", "❄️", "🌏", "👍", "💦", "😻",
          "💙", "❤️", "🩷", "💛", "🖤", "💚"
        ];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        await robin.sendMessage(mek.key.remoteJid, {
          react: {
            text: randomEmoji,
            key: mek.key,
          },
        });
      }
    }
  });
}

app.get("/", (req, res) => {
  res.send("DINUWH MD is started ✅");
});
app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);

setTimeout(() => {
  connectToWA();
}, 4000);
