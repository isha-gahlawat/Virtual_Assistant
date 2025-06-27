const User = require("../models/usermodel.js")
const bcrypt =require('bcryptjs')
const  gentoken=require('../config/token.js')

const signup=async(req,res)=>{
    try{
         const {name,email,password}=req.body

         const existemail=await User.findOne({email})
         if(existemail){
           return res.status(400).json({message:"Email already exist!"}) 
         }
         if(password.length<6){
           return res.status(400).json({message:"Password must be atleast be  6 characters"}) 
         }
         const hashpswd= await bcrypt.hash(password,10)
         const createduser=await User.create({
            name,
            password:hashpswd,
            email
         })
         const token= gentoken(createduser._id)
         res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"lax",
            secure:false
         })
         res.status(201).json(createduser)
    }
    catch(error){
      return res.status(500).json({message:`sign up error ${error}`})
    }
}
const login=async(req,res)=>{
    try{
         const {email,password}=req.body

         const user=await User.findOne({email})
         if(!user){
           return res.status(400).json({message:"Email does not exist!"}) 
         }
         const match= await bcrypt.compare(password,user.password)
         if(!match){
           return res.status(400).json({message:"Password incorrect"}) 
         }
         const token= gentoken(user._id)
         res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false
         })
         res.status(200).json(user)
    }
    catch(error){
      return res.status(500).json({message:`login error $(error)`})
    }
}

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax", 
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};


module.exports={signup,login,logout};