const { Double, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: true,
		unique: true
	},
	category: {
		type: String,
		required: true
	},
	price: {
		type: Decimal128,
		required: true
	},
	discount: {
		type: Number
	},
	discountedPrice: {
		type: Decimal128
	},
	description: {type: String},
	image: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
