const Category = require('../models/categoryModel');

exports.getAllCategories = async (req , res) => {
    try{
        console.log("Fetching categories....");
        const categories = await Category.getAllCategories();
        if(!categories || categories.length === 0 ) {
            return res.status(404)/json({error: 'No categories found.'});
        }
        res.status(200).json(categories);
    }   catch(err) {
        console.error("Error fetching categories:" , err.message);
        res.status(500).json({eroor: ' Failed to fetch categories.' , details: err.message});
    }

};