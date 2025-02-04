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
      quoted,
      isGroup,
      sender,
      isOwner,
      groupMetadata,
      participants,
      isBotAdmins,
      isAdmins,
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

      // Create the mention text for all group members
      const mentions = participants.map((p) => `@${p.id.split('@')[0]}`).join(' ');

      // Default values for message and image (without database)
      const ALIVE_MSG = "The bot is alive and running!";
      const ALIVE_IMG = "https://via.placeholder.com/300"; // Default image

      // Send the message
      return await robin.sendMessage(
        from,
        {
          image: { url: ALIVE_IMG },
          caption: `${mentions}\n\n${ALIVE_MSG}`,
          mentions: participants.map((p) => p.id),
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
  }
);
