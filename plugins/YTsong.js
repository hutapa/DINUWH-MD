const { cmd, commands } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("@vreden/youtube_scraper");

cmd(
  {
    pattern: "song",
    alias: "ytmp3",
    react: "🎵",
    desc: "Download Song",
    category: "download",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, body, q, reply }) => {
    try {
      if (!q) return reply("*🎶 Song request format is missing! Please send a link or song name. Example: `.song [Song Name]`*");

      // Search for the song
      const search = await yts(q);
      if (!search.videos.length) return reply("❌ Video not found!");

      const data = search.videos[0];
      const url = data.url;

      // Song metadata description
      let desc = `
⛶𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚂𝙾𝙽𝙶 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁⛶
✇━━━━━━━━━━━━━━━━━━━━✇

⛛
⛛
⛛
╔═══◈ 🎧 *Now Playing...* ◈═══╗  
═════════════════════

  📌 *Title:*  ${data.title}  
✇━━━━━━━━━━━━━━━━━━━
  ⏳ *Duration:*  ${data.timestamp}  
✇━━━━━━━━━━━━━━━━━━━
  📅 *Uploaded:*  ${data.ago} 
✇━━━━━━━━━━━━━━━━━━━
  👀 *Views:*  ${data.views}  
✇━━━━━━━━━━━━━━━━━━━
  🔗 *Listen Here:*  ${data.url}  
✇━━━━━━━━━━━━━━━━━━━

╠═══════════════════════════╣  
  ⬇️ *Fetching & Downloading...*  
╚═══════════════════════════╝  

🚀 *𝚙𝚘𝚠𝚎𝚛𝚍 𝚋𝚢 𝚍𝚒𝚗𝚞𝚠𝚑 𝚖𝚍*  
🚀 *𝚖𝚊𝚔𝚎 𝚋𝚢 𝙳𝙸𝙽𝚄𝚆𝙷*
`;

      // Send externalAdReply with views under channel name
      await robin.sendMessage(
        from,
        {
          text: desc,
          contextInfo: {
            externalAdReply: {
              title: "𝙳𝙸𝙽𝚄𝚆 𝙼𝙳 𝚃𝙴𝙲𝙷 𝙲𝙷𝙰𝙽𝙽𝙴𝙻",
              body: `👀 Views: ${data.views}`, // Views count below the channel name
              thumbnail: { url: data.thumbnail },
              sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: mek }
      );

      // Send metadata thumbnail message
      await robin.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );

      // Ask user to choose format: 1 (Voice Message), 2 (Audio), 3 (Document)
      await robin.sendMessage(from, {
        text: `
          *🎶 Song Available! Please choose the format:*
          1️⃣ *Voice Message*
          2️⃣ *Audio File*
          3️⃣ *MP3 Document*

          *Example Response:* 1, 2, or 3
        `,
      });

      // Wait for user input (1, 2, or 3)
      const filter = (m) => m.key.fromMe === false && m.key.remoteJid === from;
      const userResponse = await robin.waitForMessage(from, filter);

      let userChoice = userResponse.text;

      // Handle the user's choice for download type
      if (userChoice === "1") {
        // Send Voice Message (PTT)
        const songData = await ytmp3(url);
        if (!songData || !songData.download || !songData.download.url) return reply("❌ Failed to fetch song!");

        await robin.sendMessage(from, {
          audio: { url: songData.download.url },
          mimetype: "audio/mpeg",
          ptt: true, // Sends as voice message
        });

        return reply("*✅ Voice message sent successfully!*");

      } else if (userChoice === "2") {
        // Send Audio File
        const songData = await ytmp3(url);
        if (!songData || !songData.download || !songData.download.url) return reply("❌ Failed to fetch song!");

        await robin.sendMessage(from, {
          audio: { url: songData.download.url },
          mimetype: "audio/mpeg",
        });

        return reply("*✅ Audio file sent successfully!*");

      } else if (userChoice === "3") {
        // Send MP3 as Document
        const songData = await ytmp3(url);
        if (!songData || !songData.download || !songData.download.url) return reply("❌ Failed to fetch song!");

        await robin.sendMessage(from, {
          document: { url: songData.download.url },
          mimetype: "audio/mpeg",
          fileName: `${data.title}.mp3`,
          caption: "🎶 *MP3 File Downloaded by 𝐃𝐈𝐍𝐔𝐖𝐇 𝐌𝐃*",
        });

        return reply("*✅ MP3 document sent successfully!*");

      } else {
        return reply("❌ Invalid choice! Please choose 1, 2, or 3.");
      }
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
