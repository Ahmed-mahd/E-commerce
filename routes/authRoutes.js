const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authMiddleware} = require('../middleware/authmiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/users/:id', authMiddleware, authController.getUserById);
router.put('/users/:id', authMiddleware, authController.updateUser);
router.delete('/users/:id', authMiddleware, authController.deleteUser);

module.exports = router;