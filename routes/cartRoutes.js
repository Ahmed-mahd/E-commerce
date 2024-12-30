const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {authMiddleware} = require('../middleware/authmiddleware');

// Create a cart
router.post('/cart', authMiddleware, cartController.createCart);

// Get user by id
router.get('/:userId', authMiddleware, cartController.getCartByUserId);

// Update cart
router.put('/:userId', authMiddleware, cartController.updateCart);

//Delete cart
router.delete('/:userId', authMiddleware, cartController.deleteCart);

//Add item to cart
router.post('/add-item/:userId', cartController.addItem);

// Get items for a specific user
router.get('/items/:userId',authMiddleware, cartController.getUserSpecificItems);

//Update an item in the cart
router.put('/update-item/:userId',authMiddleware, cartController.updateItem);

// Delete an item from the cart
router.delete('/delete-item/:cartId/:cartItemID',authMiddleware, cartController.deleteItem);

// Clear all items from a user's cart
router.delete('/clear-cart/:userId',authMiddleware, cartController.clearUserCart);

module.exports = router;    