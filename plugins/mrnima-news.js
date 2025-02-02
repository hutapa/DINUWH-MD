const { cmd } = require("../command");
const { getNews } = require("whatsapp-autonews-sender");

module.exports = {
  name: "news",
  alias: ["autonews"],
  desc: "Get the latest news and send via WhatsApp",
  category: "Utilities",
  async exec(bot, msg, args) {
    try {
      const category = args[0] || "general"; // Category එක set කරන්න, default: "general"
      const newsData = await getNews(category);

      if (!newsData || newsData.length === 0) return msg.reply("😕 No news available!");

      let newsMessage = `📢 *Latest ${category.toUpperCase()} News* 📢\n\n`;
      newsData.slice(0, 5).forEach((news, index) => {
        newsMessage += `📌 *${news.title}*\n📰 ${news.description}\n🔗 ${news.url}\n\n`;
      });

      bot.sendMessage(msg.from, { text: newsMessage });

    } catch (error) {
      console.error(error);
      msg.reply("❌ Error fetching news!");
    }
  },
};
