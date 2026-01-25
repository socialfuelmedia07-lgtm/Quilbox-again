const mongoose = require('mongoose');

const storeInventorySchema = new mongoose.Schema(
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
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one product per store
storeInventorySchema.index({ store: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('StoreInventory', storeInventorySchema);
