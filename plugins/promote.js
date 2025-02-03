const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["admin", "makeadmin"],
    react: "⚡",
    desc: "අයෙකා admin කෙනෙක් කරන්න.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, quoted }) => {
    try {
        // ගෘප් එකක් ද? 
        if (!isGroup) return reply("⚠️ *මේක ගෘප් එකක්ද!*");

        // Command පවත්වා ගැනීමේ අවසරය තිබේද?
        if (!isAdmins) return reply("⚠️ *ඉතින් උබට admin කෙනෙක් වෙන්න අයිති නැහැ!*");

        // Bot එක admin කෙනෙක් දැයි පරීක්ෂා කරන්න
        if (!isBotAdmins) return reply("⚠️ *මාව admin කරපම්කෝ ඉස්සෙල්ලා😑✌️*");

        // Reply කරන ලද පණිවිඩයේ අයෙක් admin කරන්න
        if (!quoted) return reply("⚠️ *ඕනි කෙනාව මේන්ශන් නොකර ඉදියම මන් දන්නෙ කෝමද මොකාවද කියලා😑✌️*");

        const target = quoted.sender;

        // දැන් admin කෙනෙක්ද කියලා පරීක්ෂා කරන්න
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);

        if (groupAdmins.includes(target)) {
            return reply("⚠️ *දේපරක් ඇඩ්මින් කරන්නෙ මොකටද utto😑👌!*");
        }

        // Admin privilege එක ලබාදීම
        await robin.groupParticipantsUpdate(from, [target], "promote");

        return reply(`✅ *ඇඩ්මින් කෙනෙක්ව කලා😑!* @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Promote Error:", e);
        reply(`❌ *කෙනෙක් Admin කරන්නෙයි error එකක් හෝ සිදු වුණා!*`);
    }
});
