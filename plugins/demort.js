const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["member"],
    react: "⚠️",
    desc: "ඇඩ්මින් කෙනෙක් මැම්බර් එකක් කරන්න.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, quoted }) => {
    try {
        // ගෘප් එකක් ද?
        if (!isGroup) return reply("⚠️ *මේක ගෘප් එකක්ද utto!*");

        // Command පවත්වා ගැනීමේ අවසරය තිබේද?
        if (!isAdmins) return reply("⚠️ *ඇඩ්මින් කමෙන් අයින් කරන්න බෑහ්!*");

        // Bot එක admin කෙනෙක් දැයි පරීක්ෂා කරන්න
        if (!isBotAdmins) return reply("⚠️ *මාව ඇඩ්මින් කරපම්🥲*");

        // Reply කරන ලද පණිවිඩයේ අයෙක් admin එකෙන් ඉවත් කරන්න
        if (!quoted) return reply("⚠️ *ඕනි එකාව මේන්ශන් කරලා දාපම්😑!*");

        const target = quoted.sender;

        // ඔයාගේ admin privileges ඉවත් කරන්න බෑ
        if (target === from) return reply("⚠️ *ඌගෙ ඇඩ්මින් අයින් කරන්න බෑ💀!*");

        // Admin කෙනෙක් ද කියලා පරීක්ෂා කරන්න
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);

        if (!groupAdmins.includes(target)) {
            return reply("⚠️ *මෙම කෙනා admin කෙනෙක් නෑ!*");
        }

        // Admin privileges ඉවත් කිරීම
        await robin.groupParticipantsUpdate(from, [target], "demote");

        return reply(`✅ *ඇඩ්මින් අයින් කලා උගේ!* @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Demote Error:", e);
        reply(`❌ *Admin ඉවත් කිරීමේදී error එකක් හෝ සිදු වුණා!*`);
    }
});
