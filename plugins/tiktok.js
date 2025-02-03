/* 
Thenux-AI 
   Give credit.*/



const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tt2",
    alias: ["tiktokdl"],
    react: "🎬",
    desc: "Download TikTok video using the provided URL",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        // Check if URL is provided
        if (!args[0]) {
            return await reply("📥 Please provide a TikTok video URL.");
        }

        const tiktokUrl = args[0];
        const apiUrl = `https://manul-official-api.vercel.app/scrape-tiktok?url=${encodeURIComponent(tiktokUrl)}&apikey=Manul-Official`;

        // Send request to the API
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.data.status) {
            const data = response.data.data.data;

            // Prepare the message with video details and options
            const message = `
🎬 *乂 THENU-MD TIKTOK DOWNLOADER ◉◉►*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
1. *Title:* ${data.title}\n
2. *Author:* ${data.author}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

*乂◉◉► REPLY THE DOWNLOAD OPTION* 

┌───────────────────────────────────

📥 *Download Options:*

1. *No Watermark Video*

2. *Watermark Video*

3. *Audio*

4. *Thumbnail*

└───────────────────────────────────

Reply with the number of the option you want to download.

> ©ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ʙʏ Thenu-MD (WOLF-MD)
> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Thenux AI*`;

            // Send the message and save the message ID
            const sentMsg = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: message }, { quoted: mek });
            const messageID = sentMsg.key.id; // Save the message ID for later reference

            // Listen for the user's response
            conn.ev.on("messages.upsert", async (messageUpdate) => {
                const mek = messageUpdate.messages[0];
                if (!mek.message) return;
                const messageType =
                    mek.message.conversation ||
                    mek.message.extendedTextMessage?.text;
                const from = mek.key.remoteJid;

                // Check if the message is a reply to the previously sent message
                const isReplyToSentMsg =
                    mek.message.extendedTextMessage &&
                    mek.message.extendedTextMessage.contextInfo.stanzaId ===
                        messageID;

                if (isReplyToSentMsg) {
                    // React to the user's reply (the "1", "2", "3", or "4" message)
                    await conn.sendMessage(from, {
                        react: { text: "🌟", key: mek.key },
                    });

                    switch (messageType) {
                        case '1':
                            // Handle option 1 (No Watermark Video)
                            await conn.sendMessage(
                                from,
                                { video: { url: data.nowm }, caption: "Here's your TikTok video without watermark.\n> 👾 THENUX  |   AI ジ" },
                                { quoted: mek }
                            );
                            break;
                        case '2':
                            // Handle option 2 (Watermark Video)
                            await conn.sendMessage(
                                from,
                                { video: { url: data.watermark }, caption: "Here's your TikTok video with watermark.\n> 👾 THENUX  |   AI ジ" },
                                { quoted: mek }
                            );
                            break;
                        case '3':
                            // Handle option 3 (Audio)
                            await conn.sendMessage(
                                from,
                                { audio: { url: data.audio }, mimetype: 'audio/mp4', caption: "Here's the TikTok audio." },
                                { quoted: mek }
                            );
                            break;
                        case '4':
                            // Handle option 4 (Thumbnail)
                            await conn.sendMessage(
                                from,
                                { image: { url: data.thumbnail }, caption: "Here's the TikTok thumbnail.\n> 👾 THENUX  |   AI ジ" },
                                { quoted: mek }
                            );
                            break;
                        default:
                            // Handle invalid input (not 1, 2, 3, or 4)
                            await conn.sendMessage(from, {
                                react: { text: "❓", key: mek.key },
                            });
                            await reply("❌ Invalid option. Please reply with a number between 1 and 4.");
                            break;
                    }

                    // React to the successful completion of the task
                    await conn.sendMessage(from, {
                        react: { text : "✅", key: mek.key },
                    });

                    // Clear the stored TikTok data
                    delete conn.tiktokData;
                }
            });
        } else {
            await reply("❌ Unable to fetch TikTok video details. Please check the URL.");
        }
    } catch (error) {
        console.error("Error fetching TikTok video:", error);

        // Enhanced error handling
        if (error.response) {
            await reply(`❌ Error: ${error.response.data.message || 'Unable to fetch TikTok video.'}`);
        } else if (error.request) {
            await reply("❌ Error: No response received from the TikTok API. Please check your internet connection.");
        } else {
            await reply(`❌ Error: ${error.message}`);
        }
    }
});
