if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const User = require('./models/user');
const Entry = require('./models/entry');
const sendEmailNotification = require('./utils/sendEmailNotification');

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/track-my-warranties';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", async () => {
    console.log(`${new Date().toString()}: database connected`);
    const currentDate = new Date();
    // const currentDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    // console.log('Before set UTC:', currentDate);
    currentDate.setUTCHours(0, 0, 0, 0);
    // console.log('After set UTC:', currentDate);
    const entries = await Entry.find({
        $or: [
            { date12weekNotification: currentDate },
            { date4weekNotification: currentDate },
            { date1weekNotification: currentDate }
        ]
    }).populate('user');
    for (let entry of entries) {
        if (entry.date12weekNotification && entry.date12weekNotification.getTime() === currentDate.getTime()) {
            await sendEmailNotification(entry.user.username, entry.productName, entry.dateExpired, entry._id);
            entry.date12weekNotification = null;
            await entry.save();
        }
        if (entry.date4weekNotification && entry.date4weekNotification.getTime() === currentDate.getTime()) {
            await sendEmailNotification(entry.user.username, entry.productName, entry.dateExpired, entry._id);
            entry.date4weekNotification = null;
            await entry.save();
        }
        if (entry.date1weekNotification && entry.date1weekNotification.getTime() === currentDate.getTime()) {
            await sendEmailNotification(entry.user.username, entry.productName, entry.dateExpired, entry._id);
            entry.date1weekNotification = null;
            await entry.save();
        }
    }
    // console.log(entries);
    db.close();
});