const { cmd } = require('../command'); 

cmd({
    pattern: "ping2",
    alias: ["pong"],
    react: "📌",
    desc: "Check the bot's responsiveness",
    category: "utility",
    use: '.ping',
    filename: __filename
},
async(conn, mek, m, { from, reply }) => {
    const start = Date.now();
    await reply("*DINUWH MD SPEED CALCULATING...*"); 
    const end = Date.now();
    
    const latency = end - start; 
    await reply(`DINUWH-MD speed: ${latency}m.second`);
});
