import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserCont'
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import infiniteimg from "../assets/infinite.gif"
import speakimg from "../assets/speak.gif"
import { MdOutlineMenuOpen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import History from "../Components/history.jsx"

const Home = () => {
  const navigate=useNavigate()
  const {userData,serverUrl,setUserData, getGeminiResponse} =useContext(UserDataContext)
  const[listening,setListening]=useState(false)
  const[userText,setUserText]=useState("");
  const[aiText,setAiText]=useState("");
  const[ham,setham]=useState(false)

  const isspeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const isRecognizingRef=useRef(false)
  const synth=  window.speechSynthesis

  // Handledeletehist=()=>{

  // }

  const handleLogOut = async () => {
  try {
    await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
  } catch (error) {
    console.log(error);
  } finally {
    setUserData(null);
    navigate("/login");
  }
}

const startRecognition = () => {
  const recognition = recognitionRef.current;
  if (recognition && !isspeakingRef.current && !isRecognizingRef.current) {
    try {
      recognition.start();
      isRecognizingRef.current = true;
      setListening(true);
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Recognition start error:", error);
      }
    }
  }
};
const restartRecognition = () => {
  const recognition = recognitionRef.current;
  if (recognition) {
    recognition.abort(); // Safely cancel any existing session
    setTimeout(() => {
      if (!isspeakingRef.current) {
        recognition.start();
        isRecognizingRef.current = true;
        setListening(true);
      }
    }, 500);
  }
};
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang='hi-IN';
  const voices=synth.getVoices()
  const hindiVoice=voices.find(v=>v.lang==='hi-IN');
  if(hindiVoice){
    utterance.voice=hindiVoice
  }

   isspeakingRef.current=true

   utterance.onend=()=>{
    isspeakingRef.current=false
    setAiText("")
   startRecognition()
   }

  synth.speak(utterance)
};

const handleCommand=(data)=>{
  const{type,userinput,response}=data
  speak(response);

  if(type==='google_search'){
    const query=encodeURIComponent(userinput);
    window.open(`https://www.google.com/search?q=${query}`,'_blank');
  }
  if(type==='calculator_open'){
    window.open(`https://www.google.com/search?q=q=calculator`,'_blank');
  }
  if(type==='facebook_open'){
    window.open(`https://www.facebook.com/`,'_blank');
  }
  if(type==='instagram_open'){
    window.open(`https://www.instagram.com/`,'_blank');
  }
  if(type==='weather_show'){
    window.open(`https://www.google.com/search?q=weather`,'_blank');
  }
  if(type==='youtube_search'|| type==='youtube_play'){
    const query=encodeURIComponent(userinput);
    window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
  }
}

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognitionRef.current = recognition;

  const refreshMic = setInterval(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {console.log("Mic refreshed");  restartRecognition();})
      .catch(() => console.warn("Mic access blocked"));
  }, 60_000); // every 1 min

  const fallbackLoop = setInterval(() => {
    if (!isspeakingRef.current && !isRecognizingRef.current) {
      startRecognition();
    }
  }, 10_000); // every 10 sec

  recognition.onstart = () => {
    console.log("recognition started");
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    console.log("recognition ended");
    isRecognizingRef.current = false;
    setListening(false);
    if (!isspeakingRef.current) {
      setTimeout(() => startRecognition(), 500);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && !isspeakingRef.current) {
       restartRecognition(); 
    }
  };

  recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    console.log("heard: " + transcript);

    if (userData?.AssistantName && transcript.toLowerCase().includes(userData.AssistantName.toLowerCase())) {
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      setAiText("")
      setUserText(transcript);
      const data = await getGeminiResponse(transcript);
      if (data) {
        setAiText(data.response);
        handleCommand(data);
      }
      setUserText("");
    }
  };
    setTimeout(() => startRecognition(), 1000);

  return () => {
    recognition.stop();
     recognition.abort();
    synth.cancel();
    clearInterval(refreshMic);
    clearInterval(fallbackLoop);
    setListening(false);
    isRecognizingRef.current = false;
  };
}, []);
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col relative gap-[15px]'>
      <MdOutlineMenuOpen className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setham(true)}></MdOutlineMenuOpen>
      <div className={`absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
      <RxCross2 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'onClick={()=>setham(false)}></RxCross2>
      <button className="min-w-[100px]  h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] " onClick={()=>handleLogOut()}>Log Out</button>
      <button className="min-w-[250px] h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] "onClick={()=>navigate("/customize")}>Customize Your Assistant</button>
      <div className='w-full h-[2px] bg-gray-400'></div>
  <History></History>
  </div>
      <button className="min-w-[100px] hidden lg:block h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] absolute top-[10px] right-[15px]" onClick={()=>handleLogOut()}>Log Out</button>
      <button className="min-w-[250px] hidden lg:block h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] absolute top-[60px]  right-[15px] "onClick={()=>navigate("/customize")}>Customize Your Assistant</button>
      <div className='w-[300px] h-[400px] mt-[30px] flex justify-center items-center flex-col overflow-hidden rounded-4xl shadow-lg shadow-white'>
      <img src={userData?.assistantImage} alt="" className=" w-full h-full object-top object-cover"></img>   
      </div> 
      <h1 className='text-white  font-semibold text-[18px]'>Hi! I am {userData?.AssistantName}</h1>
     {!aiText && <img src={infiniteimg} alt="" className="w-[100px]"></img>}
     {aiText && <img src={speakimg} alt="" className="w-[200px]"></img>}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
    </div>

  )
}

export default Home
