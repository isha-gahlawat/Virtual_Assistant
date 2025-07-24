const express=require ('express');
const dotenv= require ('dotenv');
dotenv.config()
const connectDb = require('./config/db.js');
const authRouter = require('./routes/auth_routes.js');
const cookieParser = require('cookie-parser');
const cors=require ('cors');
const userRouter = require('./routes/user_routes.js');
const geminiResponse = require('./gemini.js');
const cleanInvalidHistory = require('./cleanhistory.js');

const app= express();
const port=process.env.PORT ||3000;

app.use(cors({
    origin:"https://virtual-assistant-frontend-asf6.onrender.com",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)




app.listen(port,async()=>{
    connectDb();
    console.log("server started");
});
