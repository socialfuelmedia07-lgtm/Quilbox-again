const mongoose = require('mongoose');

const storeProductSchema = new mongoose.Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StoreCategory',
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('StoreProduct', storeProductSchema);
