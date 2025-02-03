
// group.js - All Group Related Commands

const { cmd, commands } = require('../command');
const config = require('../config');
const { fetchJson, getBuffer, getGroupAdmins } = require('../lib/functions');
const fs = require('fs');



// Helper function to check permissions
const checkPermissions = (isGroup, isAdmins, isOwner, isBotAdmins) => {
    if (!isGroup) return 'This command can only be used in groups.';
    if (!isAdmins && !isOwner) return 'This command can only be used by group admins.';
    if (!isBotAdmins) return 'Bot must be admin to use this command.';
    return null;
};


cmd({
pattern: "del",
react: "❌",
alias: ["del"],
desc: "delete message",
category: "group",
use: '.del',
filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if (!isOwner ||  !isAdmins) return;
try{
if (!m.quoted) return reply(mg.notextfordel);
const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        }
        await conn.sendMessage(m.chat, { delete: key })
} catch(e) {
console.log(e);
reply('successful..✅')
} 
})






cmd({
    pattern: "join",
    fromMe: true,  // Only bot owner can use this command
    desc: "Make the bot join a group using an invite link.",
    category: "group",
    react: "🌀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        // Check if invite link is provided
        if (!q || !q.includes("chat.whatsapp.com")) {
            return await reply("*මොකෙන් ජොයින් වෙන්නද😑*.");
        }
        // Extract the group code from the invite link
        const inviteCode = q.split("chat.whatsapp.com/")[1];
        // Make the bot join the group using the invite code
        const response = await conn.groupAcceptInvite(inviteCode);
        // Send confirmation message if successfully joined
        if (response) {
            await reply("⛔ Successfully joined the group!⛔");
        } else {
            await reply("*❎Failed to join the group. Please check the invite link.*");
        }
    } catch (e) {
        console.error("Error while joining group:", e);
        await reply("❗ An error occurred while trying to join the group.");
    }
});
//============================================================================================================================
// Leave Command
cmd({
    pattern: "left",
    fromMe: true,  // Only bot owner can use this command
    desc: "Make the bot leave the group.",
    category: "group",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) {
            return await reply("*මේ ගෘප් එකක්ද😑*");
        }
        // Make the bot leave the group
        await conn.groupLeave(from);
        // Send confirmation message after leaving the group
        console.log(`Bot left the group: ${from}`);
    } catch (e) {
        console.error("Error while leaving group:", e);
        await reply(" An error occurred while trying to leave the group.❎");
    }
});
//============================================================================================================================
// Hidetag Command
cmd({
    pattern: "hidetag",
    fromMe: true,  // Only bot owner can use this command
    desc: "Send a message with hidden tags to all group members.",
    category: "group",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, args, q, participants, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) {
            return await reply("❌ This command can only be used in a group.");
        }
        // Check if a message is provided
        if (!q) {
            return await reply("❗ Please provide a message to send.");
        }
        // Extract group participants' contact IDs
        const participantIds = participants.map((participant) => participant.id);
        // Send the message with hidden tags
        await conn.sendMessage(from, { 
            text: q, 
            mentions: participantIds 
        });
        console.log("Hidetag message sent to all group members.");
    } catch (e) {
        console.error("Error while sending hidetag message:", e);
        await reply("❗ An error occurred while trying to send the hidetag message.");
    }
});





// Mute Group Command
cmd({
    pattern: "mute",
    react: "🔇",
    desc: "close a group",
    category: "group",
    use: '.mute',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{                   
if (!isGroup) return reply(ONLGROUP)
if (!isBotAdmins) return reply(botAdmin)
if (!isAdmins) return reply(ADMIN)

        await conn.groupSettingUpdate(mek.chat, 'announcement')
        const sendmsg = await conn.sendMessage(mek.chat.G_MUTE)
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('⛔𝙶𝚁𝙾𝚄𝙿 𝙲𝙻𝙾𝚂𝙴𝙳 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳⛔')
l(e)
}
})

// Unmute Group Command
cmd({
    pattern: "unmute",
    react: "🔊",
    desc: "open a group",
    category: "group",
    use: '.unmute',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{                   
if (!isGroup) return reply(ONLGROUP)
if (!isBotAdmins) return reply(botAdmin)
if (!isAdmins) return reply(ADMIN)

        await conn.groupSettingUpdate(mek.chat, 'not_announcement')
        const sendmsg = await conn.sendMessage(mek.chat.G_UNMUTE)
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('⛔𝙶𝚁𝙾𝚄𝙿 𝙾𝙿𝙴𝙽 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳⛔')
l(e)
}
})

// Promote Command
cmd({
    pattern: "promote",
    react: "📍",
    desc: "promote admin to a member",
    category: "group",
    use: '.promote',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{                   
if (!isGroup) return reply(ONLGROUP)
if (!isBotAdmins) return reply(botAdmin)
if (!isAdmins) return reply(ADMIN)

         let users = mek.mentionedJid ? mek.mentionedJid : mek.quoted ? mek.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
                await conn.groupParticipantsUpdate(mek.chat, [users], 'promote').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
        reply('🛑 GROUP ADMIN PROMOTE BY MY BOT OWNER')
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*Done ✓✓*')
l(e)
}
})

// Demote Command
cmd({
    pattern: "demote",
    react: "📍",
    desc: "demote admin to a member",
    category: "group",
    use: '.demote',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{                   
if (!isGroup) return reply(ONLGROUP)
if (!isBotAdmins) return reply(botAdmin)
if (!isAdmins) return reply(ADMIN)

                 let users = mek.mentionedJid ? mek.mentionedJid : mek.quoted ? mek.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
                await conn.groupParticipantsUpdate(mek.chat, [users], 'demote').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
reply('🛑 GROUP ADMIN DEMOTE BY MY BOT OWNER')
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*Done ✓✓*')
l(e)
}
})

// Remove Member Command
cmd({
    pattern: "remove",
    desc: "Remove a member from the group.",
    category: "group",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.')
        if (!isAdmins) return reply('You must be an admin to use this command.')

        const user = m.mentioned[0] || m.quoted?.sender
        if (!user) return reply('Please tag or reply to a user to remove.')

        await conn.groupParticipantsUpdate(from, [user], 'remove')
        await reply(`@${user.split('@')[0]} has been removed from the group.`, { mentions: [user] })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

// Add Member Command
cmd({
    pattern: "add",
    desc: "Add a member to the group.",
    category: "group",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('*ගෘප් එකක ගහපන් බම්*.')
        if (!isBotAdmins) return reply('*ඇඩ්මින් දීලා ගහමු නේද ඕක🥲👌*.')
        if (!isAdmins) return reply('*උබ ඇඩ්මින් වෙලා ගහන්න🤫✌️*.')

        const user = q.split(' ')[0]
        if (!user) return reply('*ෆෝන් නම්බර් එක ගහන්නෙ මමද😑*.')

        await conn.groupParticipantsUpdate(from, [`${user}@s.whatsapp.net`], 'add')
        await reply(`@${user} has been added to the group.`, { mentions: [`${user}@s.whatsapp.net`] })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

// Group Info Command
cmd({
    pattern: "groupinfo",
    desc: "Get information about the group.",
    category: "group",
    filename: __filename,
    react: "ℹ️"
},
async(conn, mek, m, { from, isGroup, groupMetadata, groupName, participants, groupAdmins, reply }) => {
    try {
        if (!isGroup) return reply('*කමාන්ඩ් එක ගෘප් එකක ගහපම්කෝ🥲*');

        const groupInfo = 
📋 *Group Information*
👥 *Name:* ${groupName}
📝 *Description:* ${groupMetadata.desc || 'No description'}
🆔 *ID:* ${from}
👑 *Owner:* ${groupMetadata.owner || 'Not available'}
👤 *Members:* ${participants.length}
👮 *Admins:* ${groupAdmins.length}
📅 *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}\n\n𝚙𝚘𝚠𝚎𝚛𝚍 𝚋𝚢 𝙳𝙸𝙽𝚄𝚆𝙷 𝚖𝚍 💀✌️\n\n⚋⛚𝙼𝙰𝙺𝙴 𝙱𝚈 𝙳𝙸𝙽𝚄𝙴𝙷 𝙼𝙳⛚⚋
        `;
        reply(groupInfo);
    } catch(e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
})

// Tag Admins Command
cmd({
    pattern: "tagadmin",
    alias: "admin",
    alais:["tagadmins"],
    react: "🙀",
    desc: "Tags all the admins in the group.",
    category: "group",
    filename: __filename,
},           
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
        if (!isGroup) return reply(`This command is only for groups.`);
        if (!isAdmins) return reply(`This command is only for group admin.`);

        const admins = groupAdmins;
        if (admins.length === 0) {
            return reply('There are no admins in this group.');
        }
        let adminTagMessage = '*𝙰𝙳𝙼𝙸𝙽 𝚃𝙰𝙶 𝙰𝙻𝙻:*\n\n';
        for (let admin of admins) {
            adminTagMessage += `@${admin.split('@')[0]}\n`;
        }
        await conn.sendMessage(from, { text: adminTagMessage, mentions: admins }, { quoted: mek });
    } catch (e) {
        console.error('Error tagging admins:', e);
        reply('you are not an admin.');
    }
})

// Open Time Command
cmd({
    pattern: "opentime",
    react: "🔖",
    desc: "To open group to a time",
    category: "group",
    use: '.opentime',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{   
if (!isGroup) return reply(ONLGROUP)
if (!isAdmins) return reply(ADMIN)        
  if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return reply('*select:*\nsecond\nminute\nhour\n\n*example*\n10 second')
                }
                reply(`Open time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = mek.participant
                    const open = `*OPEN TIME* THE GROUP WAS OPENED BY AWAIS MD TO APPROVED ADMIN\n NOW MEMBERS CAN SEND MESSAGES 🔓`
                    conn.groupSettingUpdate(from, 'not_announcement')
                    reply(open)
                }, timer)
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*Error !!*')
l(e)
}
})

// Close Time Command
cmd({
    pattern: "closetime",
    react: "🔖",
    desc: "To close group to a time",
    category: "group",
    use: '.closstime',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{   
if (!isGroup) return reply(ONLGROUP)
if (!isAdmins) return reply(ADMIN)        
                if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return reply('*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second')
                }
                reply(`Close time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = m.participant
                    const close = `*CLOSE TIME* GROUP CLOSED BY AWAIS MD AT APPROVED ADMIN\nNOW ONLY ADMIN CAN SEND MESSAGES 🔐`
                    conn.groupSettingUpdate(from, 'announcement')
                    reply(close)
                }, timer)
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*Error !!*')
l(e)
}
})
