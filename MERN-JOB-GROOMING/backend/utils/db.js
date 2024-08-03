const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URL;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }

        await mongoose.connect(uri, {
           
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
