const { cmd } = require('../command');

cmd({
    pattern: "tagall",
    alias: ["mentionall", "everyone"],
    desc: "Mention all members in the group.",
    category: "main",
    filename: __filename
}, 
async (robin, mek, m, { from, isGroup, participants, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Get all members
        let members = participants.map(u => u.id);

        // Create mention message
        let message = `👥 *Mentioning All Members:*\n\n`;
        message += members.map(m => `@${m.split('@')[0]}`).join(' ');

        // Send the message with mentions
        await robin.sendMessage(from, { text: message, mentions: members });

        console.log(`✅ Tagall command used in: ${from}`);
    } catch (e) {
        console.error("Tagall Error:", e);
        reply(`❌ Failed to tag all members. Error: ${e.message}`);
    }
});
