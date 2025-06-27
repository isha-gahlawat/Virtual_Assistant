import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserCont'
import axios from 'axios'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const Costumize2 = () => {
     const {  serverUrl,
    userData,
    setUserData,
    HandleCurrentUser,
    BackendImage,
    SelectedImage} =useContext(UserDataContext)
    const[AssistantName,setAssistantName]=useState(userData?.AssistantName || "")
     const [loading,setloading]=useState(false)
     const navigate=useNavigate();
    const handleUpdateAssistant= async()=>{
     try{
       let formData=new FormData()
       setloading(true)
       formData.append("AssistantName",AssistantName)
       if(BackendImage){
        formData.append("assistantImage",BackendImage)
       }
       else{
            formData.append("imageUrl",SelectedImage)   
       }
       const result= await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
     console.log(result)
       setUserData(result.data.data)
       setloading(false)
    }
     catch(error){
       console.log(error)
     }
    }
   
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col relative'>
        <IoMdArrowRoundBack className=' cursor-pointer text-white w-[50px] h-[50px] absolute top-[30px] left-[30px] mb-[30px] pb-[30px]'onClick={()=>navigate("/customize")} >  </IoMdArrowRoundBack >
      <div className='w-[90%] px-[10px] h-[500px] max-w-[500px] flex flex-col items-center justify-center gap-[20px]'>
         <h1 className="text-white text-[30px] font-semibold mb-[30px]">Give name to your <span className="text-blue-400">Virtual Assistant</span></h1>  
         <input type='text' placeholder='eg: Poco' className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] px-[10px]  rounded-full text-[18px]" onChange={(e)=>setAssistantName(e.target.value)} value={AssistantName}></input>
          {AssistantName && <button className="min-w-[300px] h-[40px] mt-[30px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] " disabled={loading}  onClick={()=>handleUpdateAssistant()} >{!loading?"Finally create your Assistant":"Loading..."}</button>}
       </div> 
    </div>
  )
}

export default Costumize2

