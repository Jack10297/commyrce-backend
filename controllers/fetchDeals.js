const product = require('../models/Product');

const fetchDeals = async (req, res) => {
	const { discountGreaterThanOrEqualTo, noOfProducts } = req.body;

	try {
		if (noOfProducts <= 0 || discountGreaterThanOrEqualTo < 0)
			return res.send({
				success: false,
				msg: 'Invalid request parameters!'
			});

		const products = await product.aggregate([
			{
				$project: {
					productName: 1,
					price: 1,
					discount: 1,
					category: 1,
					description: 1,
					discountedPrice: 1,
					image: 1,
					dealCondition: {$gte: ["$discount", discountGreaterThanOrEqualTo]}
				}
			},
			{
				$match: {dealCondition: true}
			},
			{
				$sample: {size: noOfProducts}
			}

		]);

		return res.json({
			success: true,
			products
		});
	} catch (err) {
		//console.log(err.message);
		return res.json({
			success: false,
			msg: 'Something Went Wrong!'
		});
	}
};

module.exports = fetchDeals;
