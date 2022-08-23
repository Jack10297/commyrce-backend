const jwt = require('jsonwebtoken');
const user = require('../models/User');

const authenticateUser = async (req, res, next) => {
	try {
		// Get the Token from headers
		const { token } = req.headers;

		// if(token) return res.json({
		// 	success: false,
		// 	msg: "Please sign up!",
		// 	status: 412
		// })

		// Verify the user token
		const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
		const found = await user.findOne({ username: decoded.username }, 'name').exec();

		if (!found) return res.json({
			success: false,
			msg: "Invalid credentials!",
			details: err.message,
			status: 412
		})

		return res.send('User authenticated!')

	} catch (err) {
		return res.json({
			success: false,
			msg: "Error login! Login again or register!",
			details: err.message,
			status: 413
		})
	} finally {
		return next();
	}
};

module.exports = authenticateUser;
