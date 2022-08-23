const path = require('path')

const multer = require('multer');
const DataUri = require('datauri/parser');

const dUri = new DataUri();


const dataUri = req => 
	dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

const storage = multer.memoryStorage();
const multerUpload = multer({storage});



module.exports = {multerUpload, dataUri};
