require('dotenv').config();
const express = require('express'),
	router = express.Router();

const fetchProducts = require('../controllers/fetchProducts');
const fetchRandomProducts = require('../controllers/fetchRandomProducts');
const fetchDeals = require('../controllers/fetchDeals');
const mongoose = require('mongoose');
const signInAdmin = require('../controllers/signInAdmin');
const loginUser = require('../controllers/loginUser');
const registerUser = require('../controllers/registerUser');
const processCart = require('../controllers/processCart')


const { multerUpload } = require('../controllers/multer');
const insertProduct = require('../controllers/insertProduct');


router.get('/', (req, res) => {
	res.send('Hello from node server!');
});
router.post('/', (req, res) => {
	res.send('Hello from node server using post request!');
});

// For Fetching Products
router.route('/products').get(fetchProducts).post(fetchProducts);

router.post('/random-products', fetchRandomProducts);

router.post('/fetch-deals', fetchDeals)


// Sign In Admin
router.post("/authenticate-admin", signInAdmin);

// Login and Register User
router.post('/login', loginUser);
router.post('/register', registerUser);

// For stripe payments
//router.post('/pay', stripePay);

// Insert Product Route
router.post('/insert', multerUpload.single('image'), insertProduct);



router.post('/process-cart', processCart);

module.exports = router;
