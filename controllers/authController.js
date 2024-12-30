const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
require('dotenv').config();

exports.register = async (req, res) =>
{
    const { userName, email, password, role} = req.body;

    if (!userName || !email || !password)
    {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try
    {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userId = await User.createUser(userName, email, hashedPassword, role);

        console.log(userId);

        await Cart.createCart(userId);

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err)
    {
        console.log(err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists.' });
        }

        res.status(500).json({ error: 'Server error', err });
    }
};

exports.login = async (req, res) =>
{
    const { email, password } = req.body;

    try
    {
        const user = await User.findByEmail(email);
        if (!user || user.isDeleted)
        {
            return res.status(401).json('User not found or inactive.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
        {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.userID, role: user.isGuest? 'guest': 'user' }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successfull', token});
    }
    catch (err)
    {
        res.status(500).json({ error: 'Server error during login.' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try
    {
        const user = await User.getUserById(id);
        if (!user)
        {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    }
    catch (err)
    {
        res.status(500).json({ error: 'Database error.' });
    }
};


exports.updateUser = async (req, res) =>
{
    const { id } = req.params;
    const { userName, email } = req.body;

    try
    {
        const result = await User.updateUsers(id, userName, email);
        res.status(200).json({ message: 'User updated successfully.' , result});
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to update user.', err});
    }
};

exports.deleteUser = async (req, res) =>
{
    const { id } = req.params;

    try
    {
        await User.deleteUser(id);
        await Cart.deleteCart(id);
        res.status(200).json({ message: 'User deleted successfully.' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};