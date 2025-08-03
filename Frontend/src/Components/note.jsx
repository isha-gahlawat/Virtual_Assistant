import React, { useEffect, useState,useContext,useRef } from 'react'
import { UserDataContext } from '../context/UserCont'
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


function NotePad() {

  const {userData,serverUrl,setUserData} =useContext(UserDataContext)
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
 
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

 const handleDeleteNote=async(noteid)=>{
    try{
      console.log(noteid);
      await axios.delete(`${serverUrl}/api/user/deletenote/${noteid}`,{withCredentials:true})
       setNotes(prev => prev.filter(note => note._id !== noteid));   
      }catch(error){
    console.error("Failed to delete a note",error); 
  }
  };

  const handledeleteCompleteNotes=async()=>{
     const confirm = window.confirm("⚠️ Are you sure you want to clear all history?");
      if (!confirm) return;
      try{
        await axios.delete(`${serverUrl}/api/user/allnotesdelete`, { withCredentials: true });
        setNotes([]);
      } catch (err) {
        console.error("Clear all error:", err); 
      }
   }

   const fetchNotes = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/note`, { withCredentials: true });
      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

 const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };
   useEffect(() => {
    fetchNotes();
  }, []);
return (
  <>
        <h1 className="text-white text-2xl font-bold mb-4">Notes</h1>
    <div className="relative flex  justify-center flex-col h-[500px] w-full max-w-full px-6 py-6">
       {notes.length != 0 && <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-[50%] transform -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full hover:bg-white/40 cursor-pointer text-white"
      >
      <FaChevronLeft size={20} />
      </button>}

       {notes.length != 0  && <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-[50%] transform -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full hover:bg-white/40 cursor-pointer text-white"
      >
        <FaChevronRight size={20} />
      </button>}

      <div
        ref={scrollRef}
        className="flex gap-5 ml-6 mr-5  overflow-x-auto pt-3 pb-3 hide-scrollbar scroll-smooth px-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        {notes.length === 0 ? (
          <p className="text-white font-semibold text-[30px]">No notes saved yet.</p>
        ) : (
          notes.map(note => (
            <div
              key={note._id}
              className="min-w-[150px] max-w-[250px] h-[180px] bg-gradient-to-br from-pink-600 via-orange-400 to-red-500 rounded-xl shadow-lg p-4 relative hover:scale-[1.02] transition-transform duration-200 ease-in-out relative"
            >
              <span className="absolute top-2 right-3 text-white text-xs italic">
                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
              </span>
              <div className="mt-6 h-[120px] overflow-hidden overflow-y-auto hide-scrollbar">
                <p className="text-white text-sm font-semibold">
                  {note.content}
                </p>
              </div>
              <RiDeleteBin6Line
                className="absolute bottom-3 right-3 text-white cursor-pointer hover:text-red-300"
                onClick={() => handleDeleteNote(note._id)}
              />
            </div>
          ))
        )}
      </div> </div>
      <div className='w-full flex  justify-between '>
      <button className="min-w-[180px] h-[30px] mt-[40px]  text-black font-semibold bg-white cursor-pointer rounded-full  text-[19px] transition-transform hover:scale-110 "onClick={()=>handledeleteCompleteNotes()}>Remove all Notes</button>
      <button className="min-w-[150px] h-[30px] mt-[40px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] transition-transform hover:scale-110"onClick={()=>handleDeleteUser()}>Delete User</button>
      </div> 
   
    </>
  );
}

export default NotePad