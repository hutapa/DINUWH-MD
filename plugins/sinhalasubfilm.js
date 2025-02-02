const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

// Movie search command
cmd({
    pattern: "film",
    desc: "Search for a movie and get details and download options.",
    category: "movie",
    react: "💭",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        
        const input = q.trim();
        if (!input) return reply("Please provide a movie or TV show name to search.");
    
        // Step 1: Search for the movie
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("No results found.");

        let message = "**🎥  ❮❮  𝗦𝗛𝗔𝗗𝗢𝗪 𝗠𝗢𝗩𝗜𝗘 ✘ 𝗞𝗜𝗟𝗔𝗥  ❯❯  🎥*:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });

        // Step 2: Send the search results to the user
        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://i.ibb.co/ByN33Zx/b776be1f09d94bc6.jpg` },
            caption: message,  // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });

        // Wait for the user to select a movie by number
        const movieSelectionListener = async (update) => {
            const message = update.messages[0];

            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();
            const selectedMovieIndex = parseInt(userReply) - 1;

            // Ensure the user has selected a valid movie index
            if (selectedMovieIndex < 0 || selectedMovieIndex >= result.results.length) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❌ Invalid selection. Please choose a valid number from the search results.");
            }

            const selectedMovie = result.results[selectedMovieIndex];
            const link = selectedMovie.link;

            // Step 3: Fetch movie details from the selected movie's link
            const movieDetails = await SinhalaSub.movie(link);
            if (!movieDetails || !movieDetails.status || !movieDetails.result) {
                return reply("❗ Movie details not try more movie.");
            }

            const movie = movieDetails.result;
            let movieMessage = `*${movie.title}*\n\n`;
            movieMessage += `🗓️ 𝗥𝗘𝗟𝗘𝗔𝗦𝗘 𝗗𝗔𝗧𝗘: ${movie.release_date}\n`;
           
            movieMessage += `🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬: ${movie.country}\n`;
            
            movieMessage += `⏳ 𝗗𝗨𝗥𝗔𝗧𝗜𝗢𝗡: ${movie.duration}\n`;

            // Handling genres properly
            const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres;
           
            movieMessage += `🗃️ 𝗚𝗘𝗡𝗥𝗦𝗘: ${genres}\n`;

            movieMessage += `⭐ 𝗜 𝗠𝗗𝗕 𝗥𝗔𝗧𝗜𝗡𝗚: ${movie.IMDb_Rating}\n`;
           
            movieMessage += `📀 𝗗𝗜𝗥𝗘𝗖𝗧𝗢𝗥: ${movie.director.name}\n\n`;
           
            movieMessage += `🔢 ＲＥＰＬＹ 𝗧𝗛𝗘 𝗤𝗨𝗔𝗟𝗜𝗧𝗬 👨‍💻\n\n`;
           
            movieMessage += `*SD | SD 480p*\n`;
           
            movieMessage += `*HD | HD 720p*\n`;
          
            movieMessage += `*FHD | FHD 1080p*\n\n`;
          
            movieMessage += `> ® ＳＨＡＤＯＷ   ＭＯＶＩＥ   ✘   ＫＩＬＡＲ 🎥`;

            const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

            // Step 4: Send movie details with download options
            const movieDetailsMessage = await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: movieMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            // Listen for the user's reply to select the download quality
            const qualityListener = async (update) => {
                const message = update.messages[0];

                if (!message.message || !message.message.extendedTextMessage) return;

                const userReply = message.message.extendedTextMessage.text.trim();

                // Ensure the user is responding to the right message
                if (message.message.extendedTextMessage.contextInfo.stanzaId === movieDetailsMessage.key.id) {
                    let quality;
                    switch (userReply) {
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
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply("💭❗ Invalid option. Please select from numbras ey÷1,2..3.");
                    }

                    try {
                        // Fetch the direct download link for the selected quality
                        const directLink = await PixaldrainDL(link, quality, "direct");
                        if (directLink) {
                            // Provide download option
                            await conn.sendMessage(from, {
                                document: {
                                    url: directLink
                                },
                                mimetype: 'video/mp4',
                                fileName: `${movie.title}.mp4`,
                                caption: `${movie.title}\n\n>  ® ＳＨＡＤＯＷ   ＭＯＶＩＥ   ✘   ＫＩＬＡＲ 🎥`
                            }, { quoted: mek });

                            // React with success
                            await conn.sendMessage(from, {
                                react: { text: '✅', key: mek.key }
                            });
                        } else {
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply(`❗ Could not find the ${quality} download link. Please check the URL or try another quality.`);
                        }
                    } catch (err) {
                        console.error('Error in PixaldrainDL function:', err);
                        await conn.sendMessage(from, {
                            react: { text: '❌', key: mek.key }
                        });
                        return reply("❗ An error occurred while processing your download request.");
                    }
                }
            };

            // Register the quality listener for this movie
            conn.ev.on("messages.upsert", qualityListener);

            // Clean up the listener after 60 seconds to prevent memory leaks
            setTimeout(() => {
                conn.ev.off("messages.upsert", qualityListener);
            }, 60000);
        };

        // Register the movie selection listener
        conn.ev.on("messages.upsert", movieSelectionListener);

        // Clean up the listener after 60 seconds to prevent memory leaks
        setTimeout(() => {
            conn.ev.off("messages.upsert", movieSelectionListener);
        }, 60000);

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});
