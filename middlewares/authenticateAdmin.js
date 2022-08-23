const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const authenticateAdmin = async (req, res, next) => {
	const { _aid } = req.cookies;
	if (!_aid)
		return res.json({
			state: "NOT_SIGNED_IN",
			success: false,
			msg: 'Not Signed In!'
		});

	const decoded = jwt.verify(_aid, process.env.TOKEN_KEY, async (err, decoded) => {
		if (err)
		{
			res.clearCookie("_aid")
			return res.json({
				state: "NOT_AUTHORIZED",
				success: false,
				msg: 'Invalid Token!'
			});
		}
			

		const { username, password } = decoded;
		const admin = await Admin.findOne({ username, password });

		if (!admin)
			return res.json({
				state: "INVALID",
				success: false,
				msg: 'Invalid Credentials!'
			});

		res.json({
			state: "SIGNED_IN",
			success: true,
			msg: 'User Signed In!'
		});

		next();	
	});

	
};

module.exports = authenticateAdmin;
