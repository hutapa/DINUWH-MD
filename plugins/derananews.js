const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "adanews",
    desc: "Get the latest Ada News headlines.",
    category: "news",
    react: "📰",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, q }) => {
    try {
        const response = await axios.get("https://manul-official-api-site-4a4d3aa3fe73.herokuapp.com/ada-news", { timeout: 10000 });

        console.log("API Response Data:", response.data);  // <-- Debugging

        if (!response.data.status || !response.data.data) {
            return reply("❌ Could not fetch Ada News. API response invalid.");
        }

        const newsItems = response.data.data;

        // User එක link එකක් දීලා නම් ඒක සෙවීම
        if (q && q.startsWith("https://")) {
            const article = newsItems.find(news => news.link === q.trim());
            if (!article) return reply("❌ Sorry, this news article was not found in the latest updates!");

            let articleText = `*📰 Ada News Details:*\n\n`;
            articleText += `📌 *${article.title}*\n`;
            articleText += `📖 ${article.description}\n`;
            articleText += `🔗 ${article.link}\n`;

            return reply(articleText);
        }

        // User එක link එකක් දීලා නැත්නම් Latest 5 news return කරනවා
        let newsText = `*📰 Ada News - Latest Headlines:*\n\n`;
        newsItems.slice(0, 5).forEach((news, index) => {
            newsText += `📌 *${index + 1}.* *${news.title}*\n`;
            newsText += `📖 ${news.description}\n`;
            newsText += `🔗 ${news.link}\n\n`;
        });

        reply(newsText);
    } catch (error) {
        console.error("Error fetching Ada News:", error);
        reply(`❌ Could not fetch Ada News. \n\n*Error:* ${error.message}`);
    }
});
