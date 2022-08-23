const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const SignInAdmin = async (req, res) => {
	const {username, password} = req.body;

	const found = await Admin.findOne({username, password});
	
	if(!found) 
		return res.status(404).json({
			state: "NOT_LOGGED_IN",
			success: false,
			msg: "Invalid UserName or Password!"
		})
	


	const admin_token = jwt.sign({username, password}, process.env.TOKEN_KEY, {expiresIn: "60m"})

	res.cookie('_aid', admin_token, {
		expires: new Date(Date.now() + 1000 * 60 * 60),
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development"
	})

	return res.status(200).json({
		state: "LOGGED_IN",
		success: true,
		msg: "Logged In!",
	});
}

module.exports = SignInAdmin;