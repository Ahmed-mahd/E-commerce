const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');  // Fixed typo here

// Define routes
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:categoryId', productController.getProductsByCategory); // Handle category route
router.get('/:productId', productController.getProductDetails);

module.exports = router;
