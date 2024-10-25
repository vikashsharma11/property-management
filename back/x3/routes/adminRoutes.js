const express = require('express');
const { signupAdmin, login } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { getcustomer, addCustomer, deleteCustomer, updateCustomer } = require('../controllers/customerController')
const router = express.Router();

router.post('/signup', verifyToken, isAdmin, signupAdmin);
router.post('/create', signupAdmin); // Admin can create new admins
router.post('/login',login);
router.get('/customer',verifyToken, isAdmin, getcustomer);
router.post('/addcustomer',verifyToken, isAdmin, addCustomer);
router.delete('/deletecustomer/:id',verifyToken, isAdmin, deleteCustomer);
router.put('/updatecustomer/:id',verifyToken, isAdmin, updateCustomer);


module.exports = router;
