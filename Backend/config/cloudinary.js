const cloudinary = require('cloudinary').v2;
const dotenv= require ('dotenv');
dotenv.config()
const fs =require ("fs")


const uploadOnCloudinary=async (filepath)=>{
     cloudinary.config({ 
        cloud_name:  process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.API_SECRET_CLOUDINARY 
    });

    try{
    const uploadResult = await cloudinary.uploader
       .upload(filepath)
       fs.unlinkSync(filepath)
       return uploadResult.secure_url
    }

    catch(error){
   fs.unlinkSync(filepath)
   return res.status(500).json({message:"cloudinary error"})
    }
}
module.exports=uploadOnCloudinary