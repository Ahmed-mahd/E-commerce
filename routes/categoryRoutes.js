const express = require('express');
const router = express.Router();
const categorController = require('../controllers/categoryController');

router.get('/' , categorController.getAllCategories);

module.exports = router;
