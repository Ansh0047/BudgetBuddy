const mongoose = require('mongoose');

// database connection
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Server Running on ${mongoose.connection.host}`);
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb