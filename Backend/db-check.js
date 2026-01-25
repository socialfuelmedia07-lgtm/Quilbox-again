const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).sort({ createdAt: -1 }).limit(1);
    console.log('--- Latest User in DB ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit();
};

check();
