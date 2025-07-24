const User = require("../models/usermodel.js")
const bcrypt =require('bcryptjs')
const  gentoken=require('../config/token.js')
const sendEmail=require('../sendEmail.js')

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existemail = await User.findOne({ email });
    if (existemail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashpswd = await bcrypt.hash(password, 10);
    const createduser = await User.create({
      name,
      password: hashpswd,
      email
    });

    const token = gentoken(createduser._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    });

    try {
      await sendEmail(
        email,
        'Welcome to AI Robo!',
        `<h1>Hello ${name},</h1><p>Thanks for signing up. We're excited to have you on board!</p>`
      );
    } catch (error) {
      console.warn("Email failed to send:", error.message);
    }

  
    return res.status(201).json({ message: "Signup successful", user: createduser });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};


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
            sameSite:"None",
            secure:true
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
      sameSite: "None", 
      secure: true,
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};


module.exports={signup,login,logout};
