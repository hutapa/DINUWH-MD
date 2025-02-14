const axios = require('axios');

function isUrl(text) {
  const regex = /^(https?:\/\/)?([\w\d\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
  return regex.test(text);
}

async function getTelegramStickers(url) {
  const packId = url.split('/').pop();  // Extract sticker pack name from the URL
  // Simulate fetching sticker data (in a real case, you might scrape or use Telegram's API)
  return {
    stickers: [
      { name: 'sticker1.webp', url: 'https://example.com/sticker1.webp' },
      { name: 'sticker2.webp', url: 'https://example.com/sticker2.webp' }
    ],
    title: 'Example Sticker Pack'
  };
}

async function getBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return {
    buffer: response.data,
    name: url.split('/').pop(),
    type: response.headers['content-type']
  };
}

async function sticker(type, fileName, quality, messageId) {
  // This is a placeholder for converting a file to a sticker
  return { file: `./path/to/sticker/${fileName}`, type };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { isUrl, getTelegramStickers, getBuffer, sticker, sleep };
