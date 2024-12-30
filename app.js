const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productsRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/products',productsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`);
    next();
});

app.use((err, req, res, next) =>
{
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong.' });
});

const PORT = 3000;
app.listen(PORT, ()=>
{
    console.log(`Server running on port ${PORT}`);
});

console.log('Server successfuly created.');
