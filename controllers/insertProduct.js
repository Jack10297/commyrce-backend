const cloudinary = require('cloudinary').v2;
const { dataUri } = require('./multer');
const Product = require('../models/Product')

const insertProduct = async (req, res) => {
	const file = dataUri(req).content;
	const fileType = req.file.mimetype.split('/')[0];
	var isImageUploaded = false;

	// Validation
	if (!req.file)
		return res.json({
			success: false,
			msg: 'Image is required!'
		});

	if (fileType !== 'image')
		return res.json({
			success: false,
			msg: 'Only image type files are allowed!'
		});

	// Upload image to cloudinary
	const image = await cloudinary.uploader.upload(
		file,
		{ 
			resource_type: 'image', 
			secure: true,
			folder: 'products', filename_override: req.file.originalname.toString(),
		 },
		async (err, result) => {
			if (err) return res.status(404).json({
				success: false,
				msg: "Image Service Error!"
			})

			if(!err) isImageUploaded = true;
		}
	);


	// Add credentials to Product database
	const product = await new Product({
		productName: req.body.productName,
		category: req.body.category,
		price: req.body.price,
		description: req.body.description,
		discount: req.body.discount,
		discountedPrice: req.body.discountedPrice,
		image: image.secure_url
	})

	// save product in database
	await product.save((err) => {
		if (err) {
			if (err.code === 11000) return res.send({
				success: false,
				msg: "Product with given name already exist!",
			})

			return res.json({
				success: false,
				msg: err.message,
			})

		}
		
		if(!err && isImageUploaded) return res.json({
			success: true,
			msg: "Product added Successfully!",
		})
		
		
	})


};

module.exports = insertProduct;
