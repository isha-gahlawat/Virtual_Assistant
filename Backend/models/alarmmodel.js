const mongoose=require ('mongoose');

const alarmSchema=new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  time: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});


const Alarm=mongoose.model("Alarm",alarmSchema)
module.exports=Alarm