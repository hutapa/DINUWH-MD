const { cmd, commands } = require('../command');

cmd(
  {
    pattern: "tagall",
    alias: ["mentionall", "pingall"],
    desc: "Mention all members in the group",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      isGroup,
      isAdmins,
      isOwner,
      isBotAdmins,
      participants,
      botNumber,
      reply,
    }
  ) => {
    try {
      if (!isGroup) {
        return reply("This command can only be used in a group!");
      }

      // Check if the sender is an admin
      if (!isAdmins && !isOwner && !isBotAdmins) {
        return reply("You need to be an admin to use this command.");
      }

      // Remove bot from the mention list
      const filteredParticipants = participants.filter((p) => p.id !== botNumber);

      // Create mention text
      const mentions = filteredParticipants.map((p) => `@${p.id.split('@')[0]}`).join(' ');

      // Send the message
      return await robin.sendMessage(
        from,
        {
          text: mentions,
          mentions: filteredParticipants.map((p) => p.id),
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
  }
);
