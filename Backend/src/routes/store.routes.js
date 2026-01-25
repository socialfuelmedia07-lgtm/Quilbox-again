const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

router.get('/', storeController.getStores);
router.get('/:storeId', storeController.getStoreById);
router.get('/:storeId/categories', storeController.getStoreCategories);
router.get('/:storeId/products', storeController.getStoreProducts);

module.exports = router;
