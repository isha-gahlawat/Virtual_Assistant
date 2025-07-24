const Alarm = require("../models/alarmmodel.js")

const getAlarm= async (req,res)=>{
try{
const ala =await Alarm.find({ user: req.UserId })
res.json(ala)
}catch(error){
 res.status(500).json({message:"Failed to fetch an alarm"});
}
};

const setAlarm=async (req,res)=>{
   try{
    const ala= await Alarm.create({
        user:req.UserId,
        message:req.body.message,
        time:req.body.time 
    });
      res.status(201).json(ala);
   } catch (err) {
    res.status(500).json({ message: "Failed to set Alarm" });
  }
};

const deleteAlarm = async (req, res) => {
  try {
    await Alarm.findOneAndDelete({ _id: req.params.alarm_id, user: req.UserId });
    res.json({ message: "Alarm deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Alarm" });
  }
};

const deleteAllAlarm = async (req, res) => {
  try {
    const userId = req.UserId;
    await Alarm.deleteMany({ user: userId }); 
    res.status(200).json({ message: "All Alarm cleared" });
  } catch (error) {
    console.error("Error deleting alarms:", error.message);
    res.status(500).json({ message: "Failed to clear alarms" });
  }
};



module.exports={getAlarm,setAlarm,deleteAlarm,deleteAllAlarm }