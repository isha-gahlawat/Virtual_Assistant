const User = require("../models/usermodel.js")
const moment=require('moment')
const uploadOnCloudinary=require("../config/cloudinary.js")
const geminiResponse = require("../gemini.js")

const getCurrentUser=async (req,res)=>{
try{
    const UserId=req.UserId
    const usernow=await User.findById(UserId).select("-password")
    if(!usernow){
       return res.status(400).json({message:"User not found"})
    }
       res.status(200).json(usernow)
}
catch(error){
 return res.status(400).json({message:"get current user error"})
}
}

const updateAssistant=async (req,res)=>{
   try{
    const{AssistantName,imageUrl}=req.body
    let assistantImage;
    if(req.file){
     assistantImage= await uploadOnCloudinary(req.file.path)
    }
    else{
      assistantImage=imageUrl   
    }
    const user=await User.findByIdAndUpdate(req.UserId,{
        AssistantName,assistantImage
    },{new:true}).select("-password")
    res.status(200).json(user)
   } 
   catch(error){
   return res.status(400).json({message:"updateAssistantError"})
   }
}

const askToGemini = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.UserId);
    user.history.push({question:command});
    await user.save()
    const userName = user.name;
    const AssistantName = user.AssistantName;

    const result = await geminiResponse(command, AssistantName, userName);
    console.log("Gemini raw response:", result);
    const cleanedResult = result.replace(/```json|```/g, '').trim();

    const gemresult = JSON.parse(cleanedResult);
    const type = gemresult.type;

    switch (type) {
      case 'get_date':
        return res.json({
          type,
          userinput: gemresult.userinput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });
      case 'get_time':
        return res.json({
          type,
          userinput: gemresult.userinput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });
      case 'get_day':
        return res.json({
          type,
          userinput: gemresult.userinput,
          response: `Today is ${moment().format("dddd")}`
        });
      case 'get_month':
        return res.json({
          type,
          userinput: gemresult.userinput,
          response: `This month is ${moment().format("MMMM")}`
        });
      case 'general':
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'calculator_open':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
        return res.json({
          type,
          userinput: gemresult.userinput,
          response: gemresult.response,
        });
      default:
        return res.status(400).json({ response: "Unsupported command type" });
    }

  } catch (error) {
    console.error("askToGemini error:", error.message);
    return res.status(500).json({ error: "askToGemini internal error" });
  }
};

const deleteUser=async(req,res)=>{
  try{
   const userId=req.UserId;
   await User.findByIdAndDelete(userId);
   res.clearCookie('token');
     res.status(200).json({ message: "User deleted successfully" });
  }
  catch(error){
    res.status(500).json({ message: "Failed to delete user" }); 
  }
}
module.exports={getCurrentUser,updateAssistant,askToGemini,deleteUser}