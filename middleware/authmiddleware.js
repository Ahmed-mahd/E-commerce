const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) =>
{
    console.log('middleware is executed');
    const token = req.header('Authorization');

    if(!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try
    {
        const bearerToken = token.split(' ')[1];
        const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err)
    {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = { authMiddleware};