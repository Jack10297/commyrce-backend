require('dotenv').config
const express = require('express'),
	cors = require('cors'),
	port = process.env.PORT || 3001,
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	router = require('./routes/routes');

const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const {cloudinary, cloundinaryConfig} = require('./controllers/cloundinaryConfig')
const jwt = require('jsonwebtoken')
const user = require('./models/User')
const authenticateUser = require('./middlewares/authenticateUser')
const authenticateAdmin = require('./middlewares/authenticateAdmin')

// Connect Mongoose to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

db.on('connected', () => {
	console.log('Database Connected!');
});

db.on('error', (err) => {
	console.log("ERROR OCCURED: ", err);
});

db.on('disconnected', () => {
	console.log('Database disconnected!');
});


// MiddleWare functions
app.use(cors({ 								// For Cross Origin Requests between diffrent origins
	origin: process.env.FRONTEND_ORIGIN,
	credentials: true
}));

app.use(express.json()); // For parsing application/json from post request into body
app.use(bodyParser.json());
app.use(cookieParser())  
app.use(bodyParser.urlencoded({ extended: true }));
app.use("*", cloundinaryConfig)



// User Authentication MiddleWare
app.use(/\/checkout|\/cart/, authenticateUser)

// Admin Authentication Middleware
app.use('/007', authenticateAdmin)


app.use('/welcome', auth, (req, res) => {
	res.status(200).send('Welcome!');
});

// Use our routes from router object
app.use('/', router);



app.listen(port, () => console.log('Server listening on port:', port));
