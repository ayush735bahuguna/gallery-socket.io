const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        mongoose.set('strictQuery', true);
        const connect = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`MongoDB Connected ${connect?.connection?.host}`);

    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit();
    }

}



module.exports = connectDB;