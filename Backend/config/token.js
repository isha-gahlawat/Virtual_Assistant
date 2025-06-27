const jwt=require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const gentoken= (userId)=>{
try{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;
}catch(error){
  console.log(error)
}
}
module.exports=gentoken;