const express= require('express');
const {getCurrentUser,updateAssistant,askToGemini,deleteUser} =require('../controllers/user_controller.js');
const isAuth = require('../middlewares/isAuth.js');
const upload = require('../controllers/multer.js');

const userRouter= express.Router()


userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToGemini)
userRouter.delete("/deleteUser",isAuth,deleteUser)



module.exports=userRouter