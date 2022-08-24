const Product = require('../models/Product')

// Fetch Products
const fetchRandomProducts = async (req, res) => {
	try {
		const body = req.body;

		if (body.noOfProducts && body.category) {
			if (body.noOfProducts <= 0) {
				return res.json({
					success: false,
					msg: "No products returned!"
				})
			}
			else {
				const products = await Product.aggregate([{$match: {category: body.category}} ,{$sample: {size: body.noOfProducts}}]);
				return res.json(products)
			}
		}
		else if(body.noOfProducts > 0 && !body.category) {
			const products = await Product.aggregate([{$sample: {size: body.noOfProducts}}]);
			return res.json(products)
		}
		else {
			res.end("No Product Fetched!");
		}
	
	}
	catch (error) {
		return res.json({
			success: false,
			msg: "Internal Server Error!",
			details: error.message
		})
	}
	
	return;
}


module.exports = fetchRandomProducts;
