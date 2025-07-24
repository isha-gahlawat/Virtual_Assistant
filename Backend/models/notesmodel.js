const mongoose=require ('mongoose');

const notesSchema=new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const Note=mongoose.model("Note",notesSchema)
module.exports=Note