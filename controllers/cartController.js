const Cart = require('../models/cartModel');

exports.createCart = async (userID) => {
    try {
        // Check if a cart already exists for the user
        const existingCart = await Cart.find(userID);
        if (existingCart) {
            console.log("Cart already exists for this user.");
            return { message: "Cart already exists for this user." };
        }

        // Create a new cart
        await Cart.createCart(userID);
        console.log("Cart created successfully for user:", userID);
        return { message: "Cart created successfully." };
    } catch (error) {
        console.error("Error creating cart:", error.message);
        throw new Error("Error creating cart.");
    }
};


exports.getCartByUserId = async (req, res) =>
{
    const { userId } = req.params;

    try
    {
        if (req.user.role !== 'admin' && req.user.id !== parseInt(userId))
        {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const cart = await Cart.findCartByUserId(userId);
        if (!cart)
        {
            return res.status(404).json({ error: 'Cart not found.' });
        }
        res.status(200).json(cart);
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to fetch cart.' });
    }
};

exports.updateCart = async (req, res) =>
{
    const { userId } = req.params;
    const { subtotal, totalCost, discount } = req.body;

    try
    {
        if (req.user.role !== 'admin' && req.user.id !== parseInt(userId))
        {
            return res.status(403).json({ error: 'Access denied.' });
        }

        await Cart.updateCart(userId, subtotal, totalCost, discount);
        res.status(200).json({ message: 'Cart updated successfully.' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to update cart.' });
    }
};

exports.deleteCart = async (req, res) =>
{
    const { userId } = req.params;

    try
    {
        await Cart.deleteCart(userId);
        res.status(200).json({ message: 'Cart deleted successfully.' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to delete cart.' });
    }
};

exports.addItem = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity} = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if the cart exists
        const cart = await Cart.findCartByUserId(userId);
        if (!cart) {
            console.log('Cart not found. Creating a new cart.');
            const newCartId = await Cart.createCart(userId);
            cart = { cartID: newCartId };
        }

        // Add item to cart
        await Cart.addItem(cart.cartID, productId, quantity);
        res.status(201).json({ message: 'Item added to cart successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add item to cart.', err });
    }
};

exports.getUserSpecificItems = async (req, res) =>
{
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId))
    {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try
    {
        const items = await Cart.getUserspecificItems(userId);
        if(items.length === 0)
        {
            return res.status(404).json({ error: 'No items found for this user.' });
        }
        res.status(200).json(items);
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to fetch user-specified cart items.', err });
    }
};

exports.updateItem = async (req, res) =>
{
    console.log('update cart item was invoked.');
    const { quantity } = req.body;

    if ( !quantity )
    {
        return res.status(400).json({ error: 'No quantity was provided.' });
    }

    try
    {
        await Cart.updateItem(quantity);
        res.status(200).json({ message: 'Cart item updated successfully.' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to update cart item.', err });
    }
}

exports.deleteItem = async (req, res) =>
{
    const { cartId, cartItemID } = req.params;

    try
    {
        await Cart.deleteItem(cartId, cartItemID);
        res.status(200).json({ message: 'Cart item deleted successfully.' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to delete cart item.', err });
    }
};

exports.clearUserCart = async (req, res) =>
{
    const { userId } = req.params;

    try
    {
        await Cart.clearUserCart(userId);
        res.status(200).json({ message: 'User cart cleared successfully.' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to clear user cart.' });
    }
}