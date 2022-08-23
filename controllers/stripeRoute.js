require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.toString());
const user = require('../models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const stripePay = (req, res, next) => {
	const { token, product } = req.body;

	// Check if logged in
	if (!token)
		return res.json({
			success: false,
			msg: 'For transaction token is required!'
		});


		console.log("TOKEN: ", token);

		const idempotencyKey = uuidv4();

		return stripe.customers.create({
			name: 'Ahsan Mughal',
			email: 'mirzajack1995@gmail.com',
			source: token.id

		})
		.then(async (customer) => {
			await stripe.charges.create(
				{
					amount: product.price * 100,
					currency: 'usd',
					customer: customer.id,
					receipt_email: customer.email,
				},
				{idempotencyKey}
			);
		}).then(result => {
			res.json(result)
		}).catch(err => console.log("Error: ", err));

};

module.exports = stripePay;
