import { useEffect } from 'react'
import { useState } from 'react'
import {createContext} from 'react'
import axios from 'axios';

 export const UserDataContext=createContext()
 function UserCont({children}) {
    const serverUrl="http://localhost:8000"
    const [userData,setUserData]=useState(null)
     const [BackendImage,setBackendImage] =useState(null)
     const [FrontendImage,setFrontendImage] =useState(null)
     const [SelectedImage,setSelectedImage] =useState(null)

    const HandleCurrentUser=async()=>{
      try{
     const result= await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
     setUserData(result.data);
     console.log(result.data)
      }catch(error){
       console.log(error)
       setUserData(null);
      }};

      const getGeminiResponse=async(command)=>{
        try{
      const result= await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
       return result.data;
        }
        catch(error){
         console.error("Gemini API error:", error?.response?.data || error.message);
        return { error: true, response: "Something went wrong while processing the command." };
        }
      }
    useEffect(()=>{
     HandleCurrentUser()
    },[])

    const value={
    serverUrl,
    userData,
    setUserData,
    HandleCurrentUser,
    BackendImage,setBackendImage,
    FrontendImage,setFrontendImage,
    SelectedImage,setSelectedImage,
    getGeminiResponse,
    }
  return (
    <div>
     <UserDataContext.Provider value={value}>
     {children} 
     </UserDataContext.Provider>
    </div>
  )
}

export default UserCont
