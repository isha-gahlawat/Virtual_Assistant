const express= require('express');
const {getCurrentUser,updateAssistant,askToGemini,deleteUser,deleteHistoryitem,deleteHistory} =require('../controllers/user_controller.js');
const {createNote, getNotes, deleteNote,deleteAllNotes }=require("../controllers/notes.js")
const{getAlarm,setAlarm,deleteAlarm,deleteAllAlarm}=require("../controllers/alarm.js")
const isAuth = require('../middlewares/isAuth.js');
const upload = require('../controllers/multer.js');

const userRouter= express.Router()


userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToGemini)
userRouter.delete("/deleteUser",isAuth,deleteUser)
userRouter.delete("/historyitem/:historyId",isAuth,deleteHistoryitem)
userRouter.delete("/history",isAuth,deleteHistory)
userRouter.post("/createnote",isAuth,createNote)
userRouter.get("/note",isAuth,getNotes)
userRouter.delete("/deletenote/:noteid",isAuth,deleteNote)
userRouter.delete("/allnotesdelete",isAuth,deleteAllNotes)
userRouter.get("/alarm",isAuth,getAlarm)
userRouter.post("/setalarm",isAuth,setAlarm)
userRouter.delete("/deletealarm/:alarm_id",isAuth,deleteAlarm)
userRouter.delete("/deleteAllalarm",isAuth,deleteAllAlarm)



module.exports=userRouter