const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { config, uploader } = require('cloudinary');

const cloudinaryConfig = (req,res, next) =>{
  config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  next()
}


module.exports = { cloudinaryConfig, uploader };