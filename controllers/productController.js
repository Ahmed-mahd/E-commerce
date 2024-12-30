const Product = require('../models/productModel');  // Import the Product model

exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.gerFeaturedProducts(); // Make sure the method name matches
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ error: 'Failed to fetch featured products.' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;  // Category ID from request params

    // Check if categoryId exists and is valid
    console.log(`Fetching products for categoryId: ${categoryId}`);
    if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid categoryId provided" });
    }

    try {
        // Fetching products by category
        const products = await Product.getProductByCategory(categoryId);
        console.log("Products fetched:", products);

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found for this category.' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
};

exports.getProductDetails = async (req, res) => {
    const { productId } = req.params;  // Fixed typo here: "productId" (not "producId")

    // Check if productId exists and is valid
    if (!productId || isNaN(productId)) {
        return res.status(400).json({ error: "Invalid productId provided" });
    }

    try {
        const product = await Product.getProductDetails(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ error: 'Failed to fetch product details.' });
    }
};
