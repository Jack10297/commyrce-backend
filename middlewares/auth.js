const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"];

	if(!token) {
		return res.status(405).send({
			success: false,
			msg: "Token is required for verification!"
		})
	}

	try {
		const decoded = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decoded;
	}
	catch (err) {
		return res.status(406).send({ success: false, msg: "Invalid Token!" })
	}

	return next()
}

module.exports = verifyToken;