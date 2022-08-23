const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
	const { username, password } = req.body;

	// Validate User
	if (!(username && password)) {
		return res.status(401).send('Username fields cannot be empty!');
	}

	const salt = await bcrypt.genSalt(10);
	User.findOne({ name: username }, async (err, doc) => {
		if (err)
			return res.status(402).json({
				success: false,
				msg: "Invalid Credentials!"
			});

		if (doc) {
			const isMatch = await bcrypt.compare(password, doc.password);
			if (isMatch) {
				const token = jwt.sign({ username, password }, process.env.TOKEN_KEY, { expiresIn: "60m" });

				
				// await res.cookie('commyrce', token, {
				// 	maxAge: 60000 * 30,
				// 	httpOnly: true,
				// 	//secure: process.env 
				// });

				
				return res.status(200).json({
					success: true,
					msg: 'User found!',
					token: token
				});

				
			} else {
				return res.status(410).json({
					success: false,
					msg: 'Incorrect Password!'
				});
			}
		} else {
			return res.status(404).json({
				success: false,
				msg: 'User not found!'
			});
		}
	});
};

module.exports = loginUser;
