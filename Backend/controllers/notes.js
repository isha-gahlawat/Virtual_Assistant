const Note=require("../models/notesmodel.js")

const createNote=async (req,res)=>{
   try{
    const note= await Note.create({
        user:req.UserId,
        content:req.body.content,
    });
      res.status(201).json(note);
   } catch (err) {
    res.status(500).json({ message: "Failed to create note" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.UserId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.noteid, user: req.UserId });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};

const deleteAllNotes = async (req, res) => {
  try {
    const userId = req.UserId;
    await Note.deleteMany({ user: userId }); 
    res.status(200).json({ message: "All notes cleared" });
  } catch (error) {
    console.error("Error clearing notes:", error.message);
    res.status(500).json({ message: "Failed to clear notes" });
  }
};


module.exports={createNote, getNotes, deleteNote,deleteAllNotes }