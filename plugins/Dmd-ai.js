const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "prabathai", // Command එක "ප්‍රභාත් MD" bot එකට අදාලව update කරලා
    alias: ["aiimg", "generateimg", "aiimage"],
    desc: "Generate AI Images using Stable Diffusion",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`
*🤖 ප්‍රභාත් MD AI IMAGE GENERATOR 🖼️*

📝 *විදියට භාවිතා කරන්න:*  
  _Example: .prabathai Cyberpunk city at night with neon lights_

📌 *පෙරහන්:*  
  - Specific වර්ණ, Background දක්වන්න  
  - 3D, Anime, Pixel Art වගේ styles එකතු කරන්න  
  - Mood (Happy, Dark, Calm) කියන්න  

🚀 *POWERED BY ප්‍රභාත් MD*
        `);

        // React to show processing
        await conn.sendMessage(from, { text: "🔄 *Generating AI Image...* ⏳" });

        // Stable Diffusion API URL (අලුත් API එකක් ගන්න පුළුවන්)
        const apiUrl = `https://api.thenux.dev/stablediffusion?prompt=${encodeURIComponent(q)}`;

        // API request
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });

        if (!response.data) {
            return reply("❌ *AI Image Generate කළ නොහැක. Server Error.*");
        }

        // Send the AI-generated image
        await conn.sendMessage(from, {
            image: response.data,
            caption: `*🤖 ප්‍රභාත් MD AI IMAGE GENERATOR 🖼️*\n\n*📝 Prompt:* ${q}\n\n🚀 *POWERED BY ප්‍රභාත් MD*`,
            quoted: mek
        });

        await conn.sendMessage(from, { text: "✅ *AI Image Generated Successfully!*" });

    } catch (error) {
        console.error("AI Image Generation Error:", error);

        let errorMsg = "❌ *AI Image Generate කිරීම අසාර්ථකයි.*";
        if (error.response) {
            if (error.response.status === 429) {
                errorMsg = "⏳ *ඔබ request වැඩියෙන් යවලා! පසුව උත්සහ කරන්න.*";
            } else if (error.response.status === 500) {
                errorMsg = "🚫 *Server-side Error! AI Image Generate කළ නොහැක.*";
            } else {
                errorMsg = `❌ *Error:* ${error.response.status} - ${error.response.statusText}`;
            }
        } else if (error.request) {
            errorMsg = "🌐 *Server response එකක් ලැබී නැහැ. Internet Check කරන්න.*";
        } else {
            errorMsg = `❌ *Unexpected Error:* ${error.message}`;
        }

        return reply(errorMsg);
    }
});
