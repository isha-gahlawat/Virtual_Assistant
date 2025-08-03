import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserDataContext } from '../context/UserCont';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import infiniteimg from "../assets/infinite.gif";
import { MdOutlineMenuOpen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import History from "../Components/history.jsx";
import NotePad from '../Components/note.jsx';
import { BiSolidUserVoice } from "react-icons/bi";
import { GrNotes } from "react-icons/gr";
import { IoAlarmSharp } from "react-icons/io5";
import Alarm_cal from "../Components/alarms_page.jsx";
import FloatingSuggestion from "../Components/suggestion.jsx";
import FactBubbles from "../Components/cloudFacts.jsx"
import BgImage from "../assets/download.jpeg";

const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setham] = useState("");
  const[open ,setopen]=useState(false);
  const [showVoicePopover, setShowVoicePopover] = useState(false);
  const [selectedGender, setSelectedGender] = useState("default");
  const [openPanel, setOpenPanel] = useState(null);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const isspeakingRef = useRef(false);
  const assistantNameRef = useRef(""); 
   const selectedGenderRef = useRef("default");
  const synth = window.speechSynthesis;

  let recognitionLocked = false;

  useEffect(() => {
    assistantNameRef.current = userData?.AssistantName || "";
  }, [userData?.AssistantName]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
    } catch (error) {
      console.log(error);
    } finally {
      setUserData(null);
      navigate("/login");
    }
  };

  const startRecognition = () => {
    if (recognitionLocked || isspeakingRef.current || isRecognizingRef.current) return;
    const recognition = recognitionRef.current;
    try {
      recognitionLocked = true;
      recognition.start();
      isRecognizingRef.current = true;
      setListening(true);
      setAiText(""); 
      setTimeout(() => (recognitionLocked = false), 1000);
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Recognition start error:", error);
      }
    }
  };

  const restartRecognition = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.abort();
      setTimeout(() => {
        if (!isspeakingRef.current) {
          startRecognition();
        }
      }, 500);
    }
  };

  const speak = (text) => {
     console.log("🔊 speak() called with:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
   const voices = window.speechSynthesis.getVoices();
    let voice = null;
    const gender = selectedGenderRef.current;
    
     if (gender === 'male') {
    voice = voices.find(v => v.name.toLowerCase().includes("madhur"));
    if (voice) utterance.voice = voice;
  } else {
     voice = voices.find(v => v.name.toLowerCase().includes("swara"));}
    
     if (!voice) {
    voice = voices.find(v => v.lang === 'hi-IN');
    console.warn("⚠️ No exact match, using fallback voice:", voice?.name);
  }
    if (voice) {
    utterance.voice = voice;
    console.log("🎤 Using voice:", voice.name);
  } else {
    console.warn(" No Hindi voice available at all");
  }
 

    utterance.onend = () => {
      isspeakingRef.current = false;
      if (aiText !== "") setAiText(""); 
      startRecognition();
    };
   isspeakingRef.current = true;
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
      console.log("📥 handleCommand input:", data);
    const { type, userinput, response } = data;
    speak(response);

    const query = encodeURIComponent(userinput);
    const urlMap = {
      google_search: `https://www.google.com/search?q=${query}`,
      calculator_open: `https://www.google.com/search?q=calculator`,
      facebook_open: `https://www.facebook.com/`,
      instagram_open: `https://www.instagram.com/`,
      weather_show: `https://www.google.com/search?q=weather`,
      youtube_search: `https://www.youtube.com/results?search_query=${query}`,
      youtube_play: `https://www.youtube.com/results?search_query=${query}`,
    };
    
     if (type === "note_show") {
      setham("notes");   
      setopen(true);        
      return;
           }
     if(type==="show_alarm"){
      setham("alarm");
      setopen(true);
      return;
     }      

    if (urlMap[type]) window.open(urlMap[type], '_blank');
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    const refreshMic = setInterval(() => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log("Mic refreshed");
          restartRecognition();
        })
        .catch(() => console.warn("Mic access blocked"));
    }, 60_000);

    const fallbackLoop = setInterval(() => {
      if (!isspeakingRef.current && !isRecognizingRef.current) {
        startRecognition();
      }
    }, 10_000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isspeakingRef.current) {
        setTimeout(startRecognition, 500);
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isspeakingRef.current) {
        restartRecognition();
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
        console.log("User Question:", transcript);
      const name = assistantNameRef.current.toLowerCase();
      if (name && transcript.toLowerCase().includes(name)) {
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        setAiText("");
        setUserText(transcript);

        const data = await getGeminiResponse(transcript);

        if (data?.response) {
          setAiText(data.response);
          handleCommand(data);
          } 
        setUserText("");
      }
    };

    setTimeout(startRecognition, 1000);

    return () => {
      recognition.stop();
      recognition.abort();
      synth.cancel();
      clearInterval(refreshMic);
      clearInterval(fallbackLoop);
      isRecognizingRef.current = false;
      isspeakingRef.current = false;
      recognitionRef.current = null;
      setListening(false);
    };
  }, []);

   useEffect(() => {
    selectedGenderRef.current = selectedGender;
  }, [selectedGender]);

const togglePanel = (panel) => {
    if (openPanel === panel) {
      setOpenPanel(null);
    } else {
      setOpenPanel(panel);
      setShowVoicePopover(false); 
    }
  };

  return (
  <div>
      <div className='z-10 w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col relative gap-[10px] sm:gap-[15px]'>

        <img
          src={BgImage}
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30 -z-10"
        />

        {/* === ICONS (show only if no panel/popover is open) === */}
        {!openPanel && !showVoicePopover && (
          <>
          <MdOutlineMenuOpen
  className='text-white cursor-pointer absolute top-[20px] right-[5px] sm:right-[10px] md:right-[20px] lg:right-[30px] w-[25px] h-[25px] transition-transform hover:scale-135'
  onClick={() => togglePanel("history")}
/>



<IoAlarmSharp
  className='text-white absolute top-[100px] right-[5px] sm:right-[10px] md:right-[20px] lg:right-[30px] w-[25px] h-[25px] cursor-pointer transition-transform hover:scale-135'
  onClick={() => togglePanel("alarm")}
/>

<GrNotes
  className='text-white absolute top-[140px] right-[5px] sm:right-[10px] md:right-[20px] lg:right-[30px] w-[25px] h-[25px] cursor-pointer transition-transform hover:scale-135'
  onClick={() => togglePanel("notes")}
/>
          </>
        )}

        {/* === HISTORY PANEL === */}
        {openPanel === "history" && (
          <div className="absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-4 sm:p-[20px] flex flex-col gap-3 sm:gap-[20px] items-start transition-transform translate-x-0 z-50">
            <RxCross2
              className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer transition-transform hover:scale-130'
              onClick={() => setOpenPanel(null)}
            />
            <button
              className="min-w-[80px] sm:min-w-[100px] h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[16px] sm:text-[19px] transition-transform hover:scale-110"
              onClick={handleLogOut}
            >
              Log Out
            </button>
            <button
              className="min-w-[200px] sm:min-w-[250px] h-[30px] text-black font-semibold bg-white cursor-pointer rounded-full text-[16px] sm:text-[19px] transition-transform hover:scale-110"
              onClick={() => navigate("/customize")}
            >
              Customize Your Assistant
            </button>
            <div className='w-full h-[2px] bg-gray-400'></div>
            <History />
          </div>
        )}

        {/* === ALARM PANEL === */}
        {openPanel === "alarm" && (
          <div className="absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-4 sm:p-[20px] flex flex-col gap-3 sm:gap-[20px] items-start transition-transform translate-x-0 z-50">
            <RxCross2
              className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer transition-transform hover:scale-130'
              onClick={() => setOpenPanel(null)}
            />
            <button
              className="min-w-[80px] sm:min-w-[100px] h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[16px] sm:text-[19px] transition-transform hover:scale-110"
              onClick={handleLogOut}
            >
              Log Out
            </button>
            <button
              className="min-w-[200px] sm:min-w-[250px] h-[30px] text-black font-semibold bg-white cursor-pointer rounded-full text-[16px] sm:text-[19px] transition-transform hover:scale-110"
              onClick={() => navigate("/customize")}
            >
              Customize Your Assistant
            </button>
            <div className='w-full h-[2px] bg-gray-400'></div>
            <Alarm_cal />
          </div>
        )}

        {/* === NOTES PANEL === */}
        {openPanel === "notes" && (
          <div className="absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-4 sm:p-[20px] flex flex-col gap-3 sm:gap-[20px] items-start transition-transform translate-x-0 z-50">
            <RxCross2
              className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer transition-transform hover:scale-130'
              onClick={() => setOpenPanel(null)}
            />
            <button
              className="min-w-[80px] sm:min-w-[100px] h-[30px] mt-[10px] text-black font-semibold bg-white cursor-pointer rounded-full text-[16px] sm:text-[19px] transition-transform hover:scale-110"
              onClick={handleLogOut}
            >
              Log Out
            </button>
            <button
              className="min-w-[200px] sm:min-w-[250px] h-[30px] text-black font-semibold bg-white cursor-pointer rounded-full text-[16px] sm:text-[19px] transition-transform hover:scale-110"
              onClick={() => navigate("/customize")}
            >
              Customize Your Assistant
            </button>
            <div className='w-full h-[2px] bg-gray-400'></div>
            <NotePad />
          </div>
        )}
        
        <BiSolidUserVoice
  className='text-white cursor-pointer absolute top-[60px] right-[5px] sm:right-[10px] md:right-[20px] lg:right-[30px] w-[25px] h-[25px] transition-transform hover:scale-135'
  onClick={() => {
    setham("voicepop");
    setShowVoicePopover(true);
    setOpenPanel(null);
  }}
/>

        {/* === VOICE POPOVER === */}
        {showVoicePopover && ham === "voicepop" && (
          <div className="absolute z-50 top-[100px] right-[10px] sm:right-[20px] lg:right-[30px] bg-gray-800 border border-white rounded-lg p-4 shadow-lg z-50 w-[180px] sm:w-[200px]">
            <RxCross2
              className='text-white absolute top-[5px] right-[5px] w-[20px] h-[20px] cursor-pointer transition-transform hover:scale-130'
              onClick={() => setShowVoicePopover(false)}
            />
            <label className="text-white font-semibold text-[16px] block mb-3 mt-4">Select Voice:</label>
            <label className="flex items-center gap-3 cursor-pointer mb-2">
              <input
                type="radio"
                name="voice"
                value="male"
                checked={selectedGender === "male"}
                onChange={() => setSelectedGender("male")}
                className="appearance-none w-5 h-5 border-2 border-white rounded-full checked:bg-white checked:border-white cursor-pointer"
              />
              <span className="text-white text-sm">Male Voice</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="voice"
                value="female"
                checked={selectedGender === "female"}
                onChange={() => setSelectedGender("female")}
                className="appearance-none w-5 h-5 border-2 border-white rounded-full checked:bg-white checked:border-white cursor-pointer"
              />
              <span className="text-white text-sm">Female Voice</span>
            </label>
          </div>
        )}

        <div className="w-[350px] sm:w-[250px] md:w-[300px] h-[500px] sm:h-[350px] md:h-[400px] mt-[30px] flex justify-center items-center flex-col overflow-hidden rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-transform hover:scale-105">
          <img
            src={userData?.assistantImage}
            alt="Assistant"
            className="w-full h-full object-top object-cover"
          />
        </div>

        <h1 className="text-white font-semibold text-[16px] sm:text-[18px] text-center mt-2">
          Hi! I am {userData?.AssistantName}
        </h1>
        <h1 className="text-white font-semibold text-[14px] sm:text-[14px] text-center mt-2">
         Always take my name to serve you !!
        </h1>

        <img
          src={infiniteimg}
          alt="Infinite"
          className="w-[80px] sm:w-[100px] mt-2"
        />

        <h1 className="text-white text-[16px] sm:text-[18px] font-semibold text-center mt-2 px-4 break-words">
          {userText || aiText || null}
        </h1>

      </div>


      {openPanel === null && <FactBubbles />}
      {openPanel === null && !showVoicePopover && <FloatingSuggestion aiText={aiText} userText={userText} />}

    </div>
  );
}

export default Home;