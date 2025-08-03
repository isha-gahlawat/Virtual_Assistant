import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserCont'
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function History() {

  const {userData,serverUrl,setUserData} =useContext(UserDataContext)
  const navigate = useNavigate();

  const handleDeleteUser= async ()=>{
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete your account? This action is irreversible!");
  if (!confirmDelete) return;
   try{
     const res= await axios.delete(`${serverUrl}/api/user/deleteUser`,{ withCredentials: true });
   if (res.status === 200) {
  alert("User deleted successfully.");
  setUserData(null);
  navigate("/signup");
} else {
  alert(res.data.message || "Something went wrong.");
}}
   catch (error){
    console.error("Delete error:", error);
    alert("Server error. Please try again later.");
   }
  }

 const handleDeleteHistory=async(historyId)=>{
    try{
      console.log(historyId);
      const res= await axios.delete(`${serverUrl}/api/user/historyitem/${historyId}`,{withCredentials:true})
    setUserData(prev=>({
      ...prev,
      history:prev.history.filter(item=>item._id!==historyId)
    }));
  }catch(error){
    console.error(error); 
  }
  };
  
 const handledeleteCompleteHistory=async()=>{
   const confirm = window.confirm("⚠️ Are you sure you want to clear all history?");
    if (!confirm) return;
    try{
      await axios.delete(`${serverUrl}/api/user/history`, { withCredentials: true });
      setUserData(prev => ({ ...prev, history: [] }));
    } catch (err) {
      console.error("Clear all error:", err); 
    }
 }

 return (
    <>
  <div className='w-full h-[500px] overflow-y-auto rounded pr-[20px] flex flex-col gap-[5px]'>
  <h1 className='text-white font-semibold text-[19px]'>History</h1>
    {[...userData.history]
  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((hist) => (
    <div key={hist._id} className='pl-[20px] pr-[20px] py-[10px] bg-gradient-to-br from-pink-500 via-orange-400 to-red-400 rounded font-semibold text-[18px] flex justify-between items-center '>
      <p className='text-black flex-1'>{hist.question}</p>
      <div className='flex flex-col items-end text-sm min-w-[130px]'>
        <span className='text-blue-700'>
          {formatDistanceToNow(new Date(hist.createdAt), { addSuffix: true })}
        </span>
        <RiDeleteBin6Line
          className='text-black cursor-pointer mt-1 transition-transform hover:scale-135'
          onClick={() => handleDeleteHistory(hist._id)}
        />
      </div>
    </div>
))}
</div>
      <div className='w-full flex justify-between mt-[10px]'>
      <button className="min-w-[150px] h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full  text-[19px] transition-transform hover:scale-110 "onClick={()=>handledeleteCompleteHistory()}>Clear History</button>
      <button className="min-w-[150px] h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] transition-transform hover:scale-110 "onClick={()=>handleDeleteUser()}>Delete User</button>
      </div> 
    </>
  )
}

export default History
