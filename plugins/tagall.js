const handler = async (m, { conn, text, participants }) => {
    let message = text ? text : "📢 *Mentioning All Members*";
    let users = participants.map(u => u.id);
    
    await conn.sendMessage(
        m.chat,
        { text: message, mentions: users },
        { quoted: m }
    );
};

handler.command = ['tagall'];
handler.group = true;
handler.admin = true; // Only Admins Can Use

export default handler;
