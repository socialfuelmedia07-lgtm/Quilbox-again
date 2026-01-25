const mongoose = require('mongoose');
const Store = require('./src/models/Store');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quilbox');
        const count = await Store.countDocuments();
        const stores = await Store.find({});
        console.log(`--- Store Count: ${count} ---`);
        console.log(JSON.stringify(stores, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
