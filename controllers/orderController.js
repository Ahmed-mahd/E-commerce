const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
    const { userId, totalCost } = req.body;

    try {
        const orderId = await Order.createOrder(userId, totalCost);
        res.status(201).json({ message: 'Order created successfully.', orderId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create order.', details: err.message });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    const userId = req.user.id; // Get userId from the decoded JWT
    console.log('User ID from token:', userId); // Debugging log

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const orders = await Order.findOrdersByUserId(userId); // Fetch orders based on userId
        console.log('Fetched Orders:', orders); // Debugging log
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders.', details: err.message });
    }
};

exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOrderById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const items = await Order.getOrderItems(orderId);
        res.status(200).json({ order, items });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch order details.', details: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        await Order.updateOrderStatus(orderId, status);
        res.status(200).json({ message: 'Order status updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order status.', details: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        await Order.deleteOrder(orderId);
        res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order.', details: err.message });
    }
};

exports.addItemToOrder = async (req, res) => {
    const { orderId } = req.params;
    const { scarfId, quantity, price } = req.body;

    console.log(`Adding item to order ${orderId}, Scarf ID: ${scarfId}, Quantity: ${quantity}, Price: ${price}`); // Debugging log

    try {
        await Order.addItemToOrder(orderId, scarfId, quantity, price);
        res.status(201).json({ message: 'Item added to order successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add item to order.', details: err.message });
    }
};

// Fixing this part of the code
exports.deleteOrderItem = async (req, res) => {
    const { orderId, orderItemId } = req.params;  // Note we use orderItemId, not scarfId

    try {
        const result = await Order.deleteOrderItem(orderId, orderItemId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order item not found in the specified order' });
        }

        res.status(200).json({ message: 'Order item deleted successfully' });
    } catch (error) {
        console.error('Error deleting order item:', error);
        res.status(500).json({ error: 'An error occurred while deleting the order item' });
    }
};
