const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

// 🎥 MOVIE SEARCH COMMAND 🎥
cmd({
    pattern: "film",
    desc: "Search and download Sinhala-subbed movies.",
    category: "movie",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("📌 Please enter a movie name to search!");

        // 🔍 Step 1: Search for the Movie
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) 
            return reply("🚫 No results found for your search!");

        let message = "🎥 *DINUWH MD MOVIE SEARCH*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. 🎬 *${item.title}*\n📌 *Type:* ${item.type}\n🔗 *Link:* ${item.link}\n\n`;
        });

        // 🔥 Send Movie List
        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://i.ibb.co/ByN33Zx/b776be1f09d94bc6.jpg` },
            caption: message
        }, { quoted: mek });

        // 🚀 Step 2: Wait for User Selection
        const movieSelectionListener = async (update) => {
            const message = update.messages[0];

            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();
            const selectedMovieIndex = parseInt(userReply) - 1;

            // 🔴 Check if the selected index is valid
            if (selectedMovieIndex < 0 || selectedMovieIndex >= result.results.length) {
                return reply("❌ Invalid selection. Choose a valid number.");
            }

            const selectedMovie = result.results[selectedMovieIndex];
            const link = selectedMovie.link;

            // 🔍 Step 3: Fetch Movie Details
            const movieDetails = await SinhalaSub.movie(link);
            if (!movieDetails || !movieDetails.status || !movieDetails.result) {
                return reply("❗ Movie details not found. Try another movie.");
            }

            const movie = movieDetails.result;
            let movieMessage = `🎬 *${movie.title}*\n\n`;
            movieMessage += `🗓️ *Release Date:* ${movie.release_date}\n`;
            movieMessage += `🌍 *Country:* ${movie.country}\n`;
            movieMessage += `⏳ *Duration:* ${movie.duration}\n`;
            movieMessage += `⭐ *IMDb Rating:* ${movie.IMDb_Rating}\n`;
            movieMessage += `📀 *Director:* ${movie.director.name}\n\n`;
            movieMessage += `🛠️ *Select Quality:*\n\n`;
            movieMessage += `🔹 *SD | SD 480p*\n`;
            movieMessage += `🔹 *HD | HD 720p*\n`;
            movieMessage += `🔹 *FHD | FHD 1080p*\n\n`;
            movieMessage += `💾 Reply with the quality to get the download link!`;

            const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

            // 🔥 Step 4: Send Movie Details
            const movieDetailsMessage = await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: movieMessage
            }, { quoted: mek });

            // 🎥 Step 5: Listen for User's Quality Selection
            const qualityListener = async (update) => {
                const message = update.messages[0];

                if (!message.message || !message.message.extendedTextMessage) return;

                const userReply = message.message.extendedTextMessage.text.trim();

                if (message.message.extendedTextMessage.contextInfo.stanzaId === movieDetailsMessage.key.id) {
                    let quality;
                    switch (userReply.toUpperCase()) {
                        case 'SD':
                            quality = "SD 480p";
                            break;
                        case 'HD':
                            quality = "HD 720p";
                            break;
                        case 'FHD':
                            quality = "FHD 1080p";
                            break;
                        default:
                            return reply("❌ Invalid option. Please select SD, HD, or FHD.");
                    }

                    try {
                        // 🔗 Step 6: Get Direct Download Link
                        const directLink = await PixaldrainDL(link, quality, "direct");
                        if (directLink) {
                            await conn.sendMessage(from, {
                                document: {
                                    url: directLink
                                },
                                mimetype: 'video/mp4',
                                fileName: `${movie.title}.mp4`,
                                caption: `🎬 *${movie.title}*\n\n✅ *Download Link Ready!*`
                            }, { quoted: mek });
                        } else {
                            return reply(`❗ No ${quality} download link found.`);
                        }
                    } catch (err) {
                        return reply("❗ An error occurred while processing your request.");
                    }
                }
            };

            // 🔄 Register the Quality Selection Listener
            conn.ev.on("messages.upsert", qualityListener);
            setTimeout(() => {
                conn.ev.off("messages.upsert", qualityListener);
            }, 60000);
        };

        // 🔄 Register the Movie Selection Listener
        conn.ev.on("messages.upsert", movieSelectionListener);
        setTimeout(() => {
            conn.ev.off("messages.upsert", movieSelectionListener);
        }, 60000);

    } catch (e) {
        return reply(`❗ Error: ${e.message}`);
    }
});
