const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGO_DUPLICATE_ERROR = 11000;

const registerUser = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		// Validate User
		if (!(username && password))
			return res.status(401).send({
				success: false,
				msg: 'User fields cannot be empty!'
			});

		// Encrypt the password using bcrypt
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			name: username,
			password: encryptedPassword
		});

		// Save to database with password encryption
		user.save((err) => {
			if (err) {
				if (err.code === MONGO_DUPLICATE_ERROR)
					return res.status(405).json({
						success: false,
						msg: 'User Name is already occupied!'
					});

				return res.status(400).json({
					success: false,
					msg: 'Something went wrong! Could not insert user!'
				});
			}

			res.status(200).json({
				success: true,
				msg: 'User Registered Successfull!'
			});
		});
	} catch (err) {
		res.status(408).json({
			success: false,
			msg: "Something went wrong!"
		})
	}
};

module.exports = registerUser;
