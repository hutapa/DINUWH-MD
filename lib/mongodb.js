const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
    { key: 'ALIVE_IMG', value: 'https://raw.githubusercontent.com/Dark-Robin/Bot-Helper/refs/heads/main/autoimage/Bot%20robin%20iz%20alive.jpg' },
    { key: 'ALIVE_MSG', value: 'Hello , I am alive now!!\n\n🥶𝐌𝐚𝐝𝐞 𝐛𝐲 𝐒_𝐈_𝐇_𝐈_𝐋_𝐄_𝐋🥶' },
    { key: 'PREFIX', value: '.' },
    { key: 'AUTO_READ_STATUS', value: 'true' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        // Connect to MongoDB with updated options
        await mongoose.connect(config.MONGODB, {
            useNewUrlParser: true, // Still safe for now
            useUnifiedTopology: true, // Required for connection stability
            connectTimeoutMS: 30000,  // Set timeout to 30 seconds
            serverSelectionTimeoutMS: 5000,  // Timeout for server selection
        });

        console.log('🛜 MongoDB Connected ✅');

        // Ensure database operations occur after connection is established
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error("MongoDB Connection Error: ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
