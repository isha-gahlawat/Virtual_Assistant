import { useState,useContext } from "react"
import bg from "../assets/authBg.png"
import {useNavigate} from "react-router-dom"
import { IoEye,IoEyeOff } from "react-icons/io5";
import {UserDataContext} from '../context/UserCont.jsx'
import axios from 'axios'

function Signin() {
    const [showPassword,setShowPassword]=useState(false)
    const [password,setpassword]=useState("")
    const [loading,setloading]=useState(false)
    const [email,setemail]=useState("")
    const [err,seterr]=useState("")

    const navigate=useNavigate();
    const {serverUrl,HandleCurrentUser} =useContext(UserDataContext)
    const handleSignIn=async(e)=>{
      e.preventDefault()
      seterr("")
      setloading(true)
     try{
      let result=await axios.post(`${serverUrl}/api/auth/login`,{
        email,password
      },{withCredentials:true})
     await HandleCurrentUser();
       setloading(false)
        navigate("/")
     }
     catch(error){
       console.log(error);
       seterr(error.response.data.message)
       setloading(false)
     }
    }
  return (
    <div className="w-full h-[100vh]  bg-cover flex justify-center items-center" style={{backgroundImage:`url(${bg})`}} >
     <form className='w-[90%] px-[10px] h-[500px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-black flex flex-col items-center justify-center gap-[20px]' onSubmit={handleSignIn}>
      <h1 className="text-white text-[30px] font-semibold mb-[30px]">Register to <span className="text-blue-400">Virtual Assistant</span></h1>  
        <input type='email' placeholder='Email'className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] px-[10px]  rounded-full text-[18px]"required onChange={(e)=>setemail(e.target.value)} value={email}></input>
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white  py-[10px] px-[10px]  rounded-full text-[18px] relative " >
        <input type={showPassword?'text':'password'} placeholder='Password' className="w-full h-full outline-none bg-transparent rounded-full placeholder-gray-300 px-[20px]" required onChange={(e)=>setpassword(e.target.value)} value={password}></input>
       {!showPassword && <IoEye className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer" onClick={()=>setShowPassword(true)}/>}
       {showPassword && <IoEyeOff className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white  cursor-pointer" onClick={()=>setShowPassword(false)}/>}
        </div>
        {err.length>0 &&<p className="text-red-500">
          *{err}</p>}
        <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] " disabled={loading}>SignIn</button>
        <p className="cursor-pointer text-[18px] text-white" onClick={()=>navigate("/signup")} >Want to create a new account? <span className="text-blue-600">{loading?"Loading":"SignUp"}</span></p>
    </form>   
    </div>
  )
}

export default Signin