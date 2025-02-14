const axios = require('axios');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');// tgs-to-webp library to convert tgs to webp
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
  pattern: 'tgs',
  alias: ['tgsticker', 'telegramsticker'],
  react: '🎴',
  desc: 'Download and convert Telegram sticker packs to WhatsApp stickers',
  category: 'Mods',
  filename: __filename
}, async (conn, mek, m, { from, reply, args, sender, isAdmin }) => {
  try {
    if (!args[0]) {
      reply('Please provide a Telegram sticker pack link.\n\n Example `.tgs` https://t.me/addstickers/telegramkerm ');
      return;
    }

    const lien = args.join(' ');
    const name = lien.split('/addstickers/')[1];

    if (!name) {
      reply('Invalid Telegram sticker link.');
      return;
    }

    const api = `https://api.telegram.org/bot7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM/getStickerSet?name=${encodeURIComponent(name)}`;

    // Fetch sticker pack details
    const stickers = await axios.get(api);

    let type = stickers.data.result.is_animated ? 'animated sticker' : 'not animated sticker';

    let message = `*🧩KERM TELEGRAM STICKERS🧩*\n\n` +
                  `*Producer:* ${stickers.data.result.name}\n` +
                  `*Type:* ${type}\n` +
                  `*Length:* ${stickers.data.result.stickers.length}\n\n` +
                  `> Please wait...`;

    await conn.sendMessage(
      from,
      {
        image: { url: `https://i.ibb.co/B2nBXKvx/lordkerm.jpg` },
        caption: message,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363321386877609@newsletter',
            newsletterName: '🐲𝐊𝐄𝐑𝐌 𝐓𝐆𝐒🐲',
            serverMessageId: 143
          }
        }
      },
      { quoted: mek }
    );

    // Loop through each sticker in the pack
    for (let i = 0; i < stickers.data.result.stickers.length; i++) {
      const file = await axios.get(`https://api.telegram.org/bot7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM/getFile?file_id=${stickers.data.result.stickers[i].file_id}`);
      
      const buffer = await axios({
        method: 'get',
        url: `https://api.telegram.org/file/bot7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM/${file.data.result.file_path}`,
        responseType: 'arraybuffer',
      });

      const contentType = file.data.result.file_path.split('.').pop();

      // Check for image formats (webp, png, etc.)
      try {
        if (contentType === 'webp' || contentType === 'png') {
          const sticker = new Sticker(buffer.data, {
            pack: '🐲𝐊𝐄𝐑𝐌 𝐌𝐃 𝐕𝟏🐲',
            author: '𝐋𝐎𝐑𝐃 𝐊𝐄𝐑𝐌',
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: '#000000'
          });

          const stickerBuffer = await sticker.toBuffer();

          // Send the sticker
          await conn.sendMessage(
            from,
            { sticker: stickerBuffer },
            { quoted: mek }
          );
        } else if (contentType === 'tgs') {
          // Handle animated stickers (.tgs) by converting to .webp
          const webpBuffer = await tgsToWebp(buffer.data);  // Convert .tgs to .webp

          const sticker = new Sticker(webpBuffer, {
            pack: '🐲𝐊𝐄𝐑𝐌 𝐌𝐃 𝐕𝟏🐲',
            author: '𝐋𝐎𝐑𝐃 𝐊𝐄𝐑𝐌',
            type: StickerTypes.ANIMATED,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: '#000000'
          });

          const stickerBuffer = await sticker.toBuffer();

          // Send the sticker
          await conn.sendMessage(
            from,
            { sticker: stickerBuffer },
            { quoted: mek }
          );
        }
      } catch (error) {
        console.error(`Error creating sticker from ${file.data.result.file_path}:`, error);
        reply(`Error creating sticker for ${file.data.result.file_path}. Please try again.`);
      }

      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    reply('Sticker pack download complete!');

  } catch (error) {
    console.error('Error processing Telegram sticker pack:', error);
    reply('An error occurred while processing the sticker pack. Please try again.');
  }
});
