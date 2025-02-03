
// group.js - All Group Related Commands

const { cmd, commands } = require('../command');
const config = require('../config');
const { fetchJson, getBuffer, getGroupAdmins } = require('../lib/functions');
const fs = require('fs');

cmd({
    pattern: "kickall",
    desc: "Kicks all non-admin members from the group.",
    react: "👏",
    category: "group",
    filename: __filename,
},           
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
      if (!isAdmins) return reply(`*ඇඩ්මින් කෝ wutto💀*`)
      if (!isOwner) return reply(`*උබ මගේ ඔව්නර්ද😑✌️*`)

        if (!isGroup) return reply(`*මේක ගෘප් එකක්ද ගvaයෝ😂👌.*`);
        if (!isBotAdmins) return reply(`*මට ඇඩ්මින් නොදී කමාන්ඩ් එක භාවිත කරන්නෙ කොහොම🥲✌️*`);
        
        const allParticipants = groupMetadata.participants;
        const nonAdminParticipants = allParticipants.filter(member => !groupAdmins.includes(member.id));
        
        if (nonAdminParticipants.length === 0) {
            return reply('There are no non-admin members to kick.');
        }
        
        for (let participant of nonAdminParticipants) {
            await conn.groupParticipantsUpdate(m.chat, [participant.id], "remove");
        }
        
        reply(`*Group is Del..all users kick successfully*\n> *𝚙𝚘𝚠𝚎𝚛𝚍 𝚋𝚢 𝙳𝙸𝙽𝚄𝚆𝙷-𝙼𝙳*`);

    } catch (e) {
        console.error('𝚎𝚛𝚛𝚘𝚛🥲✌️:', e);
        reply('*විය නොහැකි නමුත් වී ඇති එරර් එකක්😂... Please try again.*');
    }
})

module.exports = {
    // Export any necessary functions or variables
};
