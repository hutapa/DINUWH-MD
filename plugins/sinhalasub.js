const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "tvshow",
    desc: "Get TV show details or download episodes.",
    category: "entertainment",
    react: "📺",
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, reply }) => {
    try {
        if (args.length < 1) {
            return reply("Usage: `.tvshow <action> <query/url>`\nActions: search, info, download\nExample: `.tvshow search new`");
        }

        const action = args[0].toLowerCase();
        const query = args.slice(1).join(" "); // Take the remaining part as the query or URL

        if (action === "search") {
            // Use the search API to find TV shows
            const searchUrl = `https://darksadas-yt-sinhalasub-search.vercel.app/?q=${query}`;
            reply(`🔍 Searching for TV shows: [Click here to search]( ${searchUrl} )`);
        } else if (action === "info" && query) {
            // Use the info API to fetch details about a TV show
            const infoUrl = `https://darksadas-yt-sinhalasub-tv-shows-info.vercel.app/?url=${encodeURIComponent(query)}&apikey=pramashi`;
            const response = await axios.get(infoUrl);
            const data = response.data;
            if (data) {
                let showInfo = `🎬 TV Show Info 🎬\n\n`;
                showInfo += `📅 Title: ${data.title}\n`;
                showInfo += `📌 Description: ${data.description}\n`;
                showInfo += `🖥️ Link: ${query}\n`;
                showInfo += `> ᴘᴀᴡᴇʀᴇᴅ ʙʏ ꜱᴜᴘᴜɴ ᴍᴅ `;
                reply(showInfo);
            } else {
                reply("❌ Could not fetch TV show info. Please check the URL.");
            }
        } else if (action === "download" && query) {
            // Use the download API to get the episode download link
            const downloadUrl = `https://darksadas-yt-sinhalasub-tv-shows-dl.vercel.app/api/episode?url=${encodeURIComponent(query)}`;
            reply(`🔽 Downloading episode from: [Click here to download](${downloadUrl})`);
        } else {
            reply("❌ Invalid action or missing URL.");
        }
    } catch (e) {
        console.error(e);
        reply(`❌ *Error*: ${e.message}`);
    }
});
