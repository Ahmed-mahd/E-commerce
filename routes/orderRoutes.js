const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authmiddleware'); // Ensure correct path

// Create a new order
router.post('/', authMiddleware, orderController.createOrder);

// Get all orders for a specific user
router.get('/:userId', authMiddleware, orderController.getOrdersByUserId);

// Get details of a specific order
router.get('/details/:orderId', authMiddleware, orderController.getOrderDetails);

// Update order status
router.put('/:orderId', authMiddleware, orderController.updateOrderStatus);

// Delete an order
router.delete('/:orderId', authMiddleware, orderController.deleteOrder);

// Add item to an order
router.post('/addItem/:orderId', authMiddleware, orderController.addItemToOrder);

// Delete an item from an order
router.delete('/deleteItem/:orderId/:orderItemId', authMiddleware, orderController.deleteOrderItem);

module.exports = router;
