const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        bannerImage: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        location: {
            lat: { type: Number, required: true, default: 23.0225 }, // Default to Ahmedabad
            lng: { type: Number, required: true, default: 72.5714 }
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Store', storeSchema);
