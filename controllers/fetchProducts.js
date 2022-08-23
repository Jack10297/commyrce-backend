const Product = require('../models/Product')

// Fetch Products
const fetchProducts = async (req, res) => {
	try {
		const {noOfProducts, category, skipItems} = req.body;

		if(noOfProducts > 0 && skipItems) {
			console.log("SKIP ITEMS: ", skipItems);
			const products = await Product.find().skip(skipItems).limit(noOfProducts).exec();
			return res.json(products)
		}

		if (noOfProducts && category) {
			if (noOfProducts <= 0) {
				return res.json({
					success: false,
					msg: "no products returned!"
				})
			}
			else if(category === "all") {
				const products = await Product.find().limit(noOfProducts).exec();
				return res.json(products)
			}
			else {
				const products = await Product.find({category}).limit(noOfProducts).exec();
				return res.json(products)
			}
		}
		else if(noOfProducts > 0 && !category) {
			const products = await Product.find().limit(noOfProducts).exec();
			return res.json(products)
		}
		else {
			res.end("No Product Fetched!");
		}
	
	}
	catch (error) {
		return res.json({
			success: false,
			msg: "Internal Server Error!"
		})
	}
}


module.exports = fetchProducts;
