const User = require("../models/usermodel.js")
const Note=require("../models/notesmodel.js")
const Alarm=require("../models/alarmmodel.js")
const moment=require('moment')
const uploadOnCloudinary=require("../config/cloudinary.js")
const geminiResponse = require("../gemini.js")
const sendEmail=require('../sendEmail.js')
const chrono = require('chrono-node');

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.UserId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
      console.error("Update Assistant Error:", error.message);
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

    const getFormattedDateInfo = () => ({
      date: moment.utc().format("YYYY-MM-DD"),
      time: moment.utc().format("hh:mm A"),
      day: moment.utc().format("dddd"),
      month: moment.utc().format("MMMM")
    });

    const result = await geminiResponse(command, AssistantName, userName);
    console.log("Gemini raw response:", result);
    const cleanedResult = result.replace(/```json|```/g, '').trim();

    const gemresult = JSON.parse(cleanedResult);
    const type = gemresult.type;

    switch (type) {
      case 'get_date':
      case 'get_time':
      case 'get_day':
      case 'get_month': {
        const { date, time, day, month } = getFormattedDateInfo();
        let responseText = "";

        if (type === 'get_date') responseText = `Current date is ${date}`;
        if (type === 'get_time') responseText = `Current time is ${time} (UTC)`;
        if (type === 'get_day') responseText = `Today is ${day}`;
        if (type === 'get_month') responseText = `This month is ${month}`;

        return res.json({
          type,
          userinput: gemresult.userinput,
          response: responseText
        });
      }

      case 'note_create': {
        const { note, userinput } = gemresult;
        if (!note) return res.status(400).json({ response: "No note found in input" });
        await Note.create({ user: req.UserId, content: note });
        return res.json({ type, userinput, response: "📝 Note saved!" });
      }

      case 'set_alarm': {
        const { time, message ,userinput} = gemresult;
        if (!time || !message) {
          return res.status(400).json({ response: "Missing time or note for reminder." });
        }
  
        const parsedLocalTime = chrono.parseDate(time, new Date());
        if (!parsedLocalTime || isNaN(parsedLocalTime.getTime())) {
          return res.status(400).json({ response: "Invalid time format for alarm." });
        }
         const now = new Date();
if (parsedLocalTime < now) {
  parsedLocalTime.setFullYear(now.getFullYear());

  // Edge case: still in past? (e.g., January 1 when today is July)
  if (parsedLocalTime < now) {
    parsedLocalTime.setFullYear(now.getFullYear() + 1);
  }
}
        const parsedUTC = moment(parsedLocalTime).utc();

        try {
          await Alarm.create({
            user: req.UserId,
            message,
            time: parsedUTC.toDate(),
          });

          return res.json({
            type,
            userinput,
            response: gemresult.response,
          });
        } catch (err) {
          console.error("Alarm set error:", err);
          return res.status(500).json({ response: "Failed to set alarm." });
        }
      }

      case 'general':
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'calculator_open':
      case 'instagram_open':
      case 'facebook_open':
      case 'weather_show':
      case 'note_show':
      case 'show_alarm':
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
  const user= await User.findByIdAndDelete(userId);
   res.clearCookie('token',{path:"/"});

    try {
        await sendEmail(
          user.email,
          'Sorry to see you go',
          `<h1>GoodBye ${user.name},</h1><p>Your account has been successfully deleted. If this was a mistake, feel free to sign up again.</p>`
        );
      } catch (error) {
        console.warn("Email failed to send:", error.message);
      }

      return res.status(200).json({ message: "User deleted sucessfully"});
    }catch(error){
    res.status(500).json({ message: "Failed to delete user" }); 
  }
};

deleteHistoryitem =async(req,res)=>{
 try {
    const userId = req.UserId;
    const historyId = req.params.historyId;
    console.log("dele")
    await User.findByIdAndUpdate(userId, {
      $pull: { history: { _id: historyId } }
    });
      res.status(200).json({ message: "History item deleted" });
  } catch (error) {
    console.error("Error deleting history item:", error);
    res.status(500).json({ message: "Failed to delete history item" });
  }
};

deleteHistory =async(req,res)=>{
  try{
    const userId = req.UserId; 
     await User.findByIdAndUpdate(userId, {
        history:[]});
    res.status(200).json({ message: "All history cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear history" });  
}
};

module.exports={getCurrentUser,updateAssistant,askToGemini,deleteUser,deleteHistoryitem,deleteHistory}