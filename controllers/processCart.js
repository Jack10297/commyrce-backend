require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY.toString());
const { v4: uuidv4 } = require('uuid');

const processCart = async (req, res) => {
	const {cartItems} = req.body
	const session = await stripe.checkout.sessions.create({
		line_items: cartItems.map(item => {
				return {
					price_data: {
					currency: 'usd',
					product_data: {
						name: item.name,
						description: item.description,
						images: [
							decodeURIComponent(item.image)
						]
					},
					unit_amount: item.price * 100
	
				},
				quantity: item.pieces,
				adjustable_quantity: {
					enabled: true
				}
			}
		}),
		mode: 'payment',
		success_url: `${process.env.FRONTEND_ORIGIN}`,
		cancel_url: `${process.env.FRONTEND_ORIGIN}/products`

	})
	
	return res.json({url: session.url})
}


module.exports = processCart;