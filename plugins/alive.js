const {readEnv} = require('../config')
const {cmd, commands} = require('../command')

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(robin, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        const config = await readEnv();
        // Sending alive message with image
        await robin.sendMessage(from, { 
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG 
        }, { quoted: mek });
        
        // Sending channel info
        const menuText = "Check out our channel for more updates!";
        await robin.sendMessage(
            from,
            {
                text: menuText,
                contextInfo: {
                    externalAdReply: {
                        title: "𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚃𝙴𝙲𝙷 𝙲𝙷𝙽𝙽𝙻",
                        body: "© 𝙼𝙰𝙳𝙴 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙱𝙾𝚈🫣",
                        thumbnail: { url: "https://i.ibb.co/h1cJpJv4/256ebbe3dd561868.jpg" },
                        sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: mek }
        );
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
