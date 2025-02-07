const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const { sleep } = require("./lib/functions");
const { parseMessage } = require("./lib/command"); // Command parser එක import කරමු
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const ownerNumber = config.OWNER_NUMBER;

//=================== SESSION AUTH ============================
if (!fs.existsSync(__dirname + "/auth_info_baileys/creds.json")) {
  if (!config.SESSION_ID)
    return console.log("Please add your session to SESSION_ID env !!");

  const { File } = require("megajs");
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);

  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/auth_info_baileys/creds.json", data, () => {
      console.log("DINUWH MD SESSION DOWNLOAD COMPLETE ✅");
    });
  });
}

//=============================================

async function connectToWA() {
  console.log("Connecting DINUWH MD...");
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
    keepAliveIntervalMs: 30_000, // Keep Alive Every 30 Seconds
  });

  // Connection Status
  robin.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log("Session expired. Please re-authenticate.");
        process.exit();
      } else {
        console.log(`Reconnecting due to ${reason || "unknown reason"}`);
        await sleep(5000); // Delay before reconnecting
        await connectToWA();
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

      await sleep(2000); // 2 seconds delay before sending messages
      await robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/Dark-Robin/Bot-Helper/refs/heads/main/autoimage/Bot%20robin%20cs.jpg`,
        },
        caption: up,
      });

      await sleep(2000);
      await robin.sendMessage("94728896048@s.whatsapp.net", {
        image: {
          url: `https://raw.githubusercontent.com/Dark-Robin/Bot-Helper/refs/heads/main/autoimage/Bot%20robin%20cs.jpg`,
        },
        caption: up1,
      });
    }
  });

  // Messages Upsert - Command Handling
  robin.ev.on("messages.upsert", async (mek) => {
    try {
      mek = mek.messages[0];
      if (!mek.message) return;

      mek.message =
        getContentType(mek.message) === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;

      if (mek.key && mek.key.remoteJid === "status@broadcast") return;

      const msg = await parseMessage(robin, mek, config.PREFIX);
      if (!msg) return;

      // Plugin Load & Execute Commands
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (plugin.endsWith(".js")) {
          require("./plugins/" + plugin)(robin, msg);
        }
      });
    } catch (err) {
      console.error("Message Upsert Error:", err);
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
