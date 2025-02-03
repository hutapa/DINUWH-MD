const { readEnv } = require('../lib/database');
const { cmd } = require('../command');
const si = require('systeminformation'); // Import system information

cmd(
  {
    pattern: "system",
    desc: "Show bot system details like ping, uptime, and time",
    category: "utility",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply }) => {
    try {
      const config = await readEnv();

      // Bot uptime calculation
      const uptime = process.uptime(); // Uptime in seconds
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // Calculate ping
      const start = Date.now();
      await reply("🔄 Calculating ping...");
      const ping = Date.now() - start;

      // Get current time
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      // Greeting message based on time
      const hourNow = new Date().getHours();
      const greeting =
        hourNow >= 5 && hourNow < 12
          ? "🌅 Good Morning"
          : hourNow >= 12 && hourNow < 18
          ? "☀️ Good Afternoon"
          : "🌙 Good Evening";

      // System Information Fetching
      const cpu = await si.cpu();
      const mem = await si.mem();
      const os = await si.osInfo();

      // Response message
      const message = `
${greeting} 👋

🤖 *𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼 𝙸𝙽𝙵𝙾*:

  
🔹 *Uptime:* ${hours}h ${minutes}m ${seconds}s    
🔹 *Ping:* ${ping}ms  
🔹 *Current Time:* ${currentTime}  
🔹 *CPU*: ${cpu.manufacturer} ${cpu.brand} (${cpu.cores} Cores)  
🔹 *RAM*: ${(mem.total / 1e9).toFixed(2)} GB  
🔹 *OS*: ${os.distro} ${os.release}  

> *°•° POWERED BY 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 ☊°_°🖤*
`;

      // Sending the message
      return await robin.sendMessage(
        from,
        {
          image: { url: config.ALIVE_IMG || "https://via.placeholder.com/300" }, // Default image if ALIVE_IMG not set
          caption: message,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e); // Log any errors
      reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
  }
);
