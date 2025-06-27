const jwt =require('jsonwebtoken')
const dotenv= require ('dotenv');
dotenv.config()

const isAuth= async(req,res,next)=>{
    try{
      const token=req.cookies.token
      if(!token){
        return res.status(400).json({message:"token not found"})
      }
     const verifiedToken= await jwt.verify(token,process.env.JWT_SECRET)
     req.UserId=verifiedToken.userId
     next()
    }
    catch(error){
     console.log(error)
      return res.status(500).json({message:"is Auth error"})
    }
}
module.exports=isAuth