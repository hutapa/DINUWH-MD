const config = require('../config');
const { cmd, commands } = require('../command');
 // Assuming these functions are available

// Define the tg sticker download command
cmd({
  pattern: 'tg', // Command pattern to match 'tg <url>'
  desc: 'Download Telegram sticker pack', // Description of the command
  category: 'media', // Categorize the command (optional)
  react: '📥', // React with an emoji after the command is executed
  filename: __filename // Reference to the current file (optional)
}, async (conn, mek, m, { from, reply }) => {
  const match = m.text.split(' ')[1]; // Extract the URL from the command input
  const url = isUrl(match || m.reply_message.text); // Check if the input or the reply is a valid URL

  if (!url) return reply('*Example :* tg https://t.me/addstickers/sticker'); // If no URL, send an example message

  try {
    const results = await getTelegramStickers(match); // Fetch stickers from the Telegram sticker URL
    const stickersCount = results.stickers.length; // Get the number of stickers in the pack

    if (stickersCount === 0) return reply('Stickers not supported'); // If no stickers are found

    await reply(`Downloading ${stickersCount} stickers from ${results.title}`); // Notify about the download

    // Loop through the stickers and send them one by one
    for (const s of results.stickers) {
      try {
        if (s.name.endsWith('webp')) {
          await conn.sendMessage(from, { sticker: { url: s.url } }); // Send webp sticker directly
        } else {
          const buffer = await getBuffer(s.url); // Get the buffer for non-webp stickers
          await conn.sendMessage(from, await sticker('str', buffer.name, 2, m.id), { isAnimated: buffer.type === 'video' }, 'sticker'); // Send sticker
        }
      } catch (e) {
        await reply('Error: An issue occurred while downloading a sticker!');
      }
      await sleep(1000); // Sleep to avoid flooding the server
    }
  } catch (e) {
    await reply('Error: Could not process the sticker pack.');
    console.log(e);
  }
});
