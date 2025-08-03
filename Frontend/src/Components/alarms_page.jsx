import { useEffect, useState, useContext, useRef } from 'react';
import Calendar from 'react-calendar';
import { UserDataContext } from '../context/UserCont';
import axios from 'axios';
import './alarmcalendar.css';
import 'react-calendar/dist/Calendar.css';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
import { RxCross2 } from "react-icons/rx";
import { setDate } from 'date-fns';

const Alarm_cal = () => {
  const { serverUrl } = useContext(UserDataContext);
  const [alarms, setAlarms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newTime, setNewTime] = useState('');
  const popupRef = useRef();

  const formatDateKey = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
  };

  const fetchAlarms = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/alarm`, {
        withCredentials: true,
      });
      setAlarms(res.data);
    } catch (err) {
      console.error('Failed to load alarms', err);
    }
  };

 useEffect(() => {
  fetchAlarms(); 

  const interval = setInterval(() => {
    fetchAlarms();
  }, 10000); 

  return () => clearInterval(interval);
}, []);



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (date) => {
    const clickedKey = formatDateKey(date);
    const selectedKey = selectedDate ? formatDateKey(selectedDate) : null;
    setSelectedDate(clickedKey === selectedKey ? null : date);
  };

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

  const handledeleteCompleteAlarms=async()=>{
   const confirm = window.confirm("⚠️ Are you sure you want to clear all Alarms?");
    if (!confirm) return;
    try{
      await axios.delete(`${serverUrl}/api/user/deleteAllalarm`, { withCredentials: true });
      await fetchAlarms();
    } catch (err) {
      console.error("Clear all error:", err); 
    }
 }

  const alarmsForSelectedDate = selectedDate
    ? alarms.filter(
        (alarm) =>
          formatDateKey(new Date(alarm.time)) === formatDateKey(selectedDate)
      )
    : [];

  const handleAddAlarm = async (e) => {
    e.preventDefault();
    try {
      const localDate = new Date(selectedDate);
      const [hours, minutes] = newTime.split(':');
      localDate.setHours(Number(hours));
      localDate.setMinutes(Number(minutes));
      localDate.setSeconds(0);

      const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      );

      await axios.post(
        `${serverUrl}/api/user/setalarm`,
        {
          time: utcDate.toISOString(),
          message: newMessage,
        },
        { withCredentials: true }
      );

      await fetchAlarms();
      setNewMessage('');
      setNewTime('');
      setSelectedDate(new Date(selectedDate)); 
    } catch (err) {
      console.error('Failed to add alarm', err);
    }
  };

  const handleDeleteAlarm = async (alarmId) => {
    try {
      console.log("alarertyuiolpm");
      await axios.delete(`${serverUrl}/api/user/deletealarm/${alarmId}`, {
        withCredentials: true,
      });
      await fetchAlarms();
    } catch (err) {
      console.error('Failed to delete alarm', err);
    }
  };

  return (
    <div className="calendar-container w-full h-[500px]">
      <div className="calendar-wrapper h-[450px]  ">
        <Calendar
          key={alarms.length} 
          onClickDay={handleDateClick}
          tileClassName={({ date, view }) => {
            if (view !== 'month') return null;
            const has = alarms.some(
              (alarm) =>
                formatDateKey(new Date(alarm.time)) === formatDateKey(date)
            );
            return has ? 'alarm-circle' : null;
          }}
          
          tileContent={({ date, view }) => {
            if (view !== 'month') return null;

            const dateKey = formatDateKey(date);
            const matchingAlarms = alarms.filter(
              (alarm) =>
                formatDateKey(new Date(alarm.time)) === dateKey
            );

            if (matchingAlarms.length === 0) return null;

            const tooltipId = `tooltip-${uuidv4()}`;
            const tooltipContent = matchingAlarms
              .map(
                (a) =>
                  `🕒 ${new Date(a.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} – ${a.message}`
              )
              .join('<br/>');

            return (
              <>
                <div
                  data-tooltip-id={tooltipId}
                  data-tooltip-html={tooltipContent}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                  }}
                />
                <Tooltip
                  id={tooltipId}
                  className="custom-tooltip"
                  float={true}
                  opacity={1}
                  delayShow={100}
                  delayHide={100}
                  place="top"
                />
              </>
            );
          }}
        />

       <AnimatePresence>
  {selectedDate && (
     <div className="fixed  inset-0  z-50 flex  items-center justify-center">
    <motion.div
      className="alarm-popup bg-white rounded-2xl  shadow-xl w-[320px] p-6 relative z-50"
      ref={popupRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      {/* Close Button */}
      <RxCross2
        className="absolute top-2 right-2 w-5 h-5 text-gray-700 cursor-pointer hover:text-red-500 "
        onClick={() => setSelectedDate(null)}
      />

      <h4 className="text-lg font-semibold text-center pt-5 mb-4">
        Alarms for {selectedDate.toDateString()}
      </h4>

      {/* Alarm List */}
      {alarmsForSelectedDate.length > 0 ? (
      <ul className="space-y-3 mb-4">
  {alarmsForSelectedDate.map((alarm) => (
    <li
      key={alarm._id}
      className="relative bg-gradient-to-br from-pink-600 via-orange-400 to-red-500 px-4 py-3 rounded-lg shadow-md"
    >
      <RiDeleteBin6Line
        className="absolute top-2 right-2 w-4 h-4 text-black hover:text-red-800 cursor-pointer"
        onClick={() => handleDeleteAlarm(alarm._id)}
      />
      <div className="pr-6"> {/* padding-right to avoid overlap with icon */}
        <div className="text-sm font-semibold break-words text-black">
          {alarm.message}
        </div>
        <div className="text-sm font-medium mt-1 text-black">
          @ {new Date(alarm.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </li>
  ))}
</ul>

      ) : (
        <p className="text-gray-500 text-center mb-4">No alarms</p>
      )}

      {/* Add Alarm Form */}
      <form onSubmit={handleAddAlarm} className="space-y-3">
        <input
          type="text"
          placeholder="Alarm message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Alarm
        </button>
      </form>
    </motion.div>
    </div>
  )}
</AnimatePresence>
      </div>
       <div className='w-full   flex  justify-between '>
      <button className="min-w-[180px] h-[30px] mt-[50px]  text-black font-semibold bg-white cursor-pointer rounded-full  text-[19px] transition-transform hover:scale-110"onClick={()=>handledeleteCompleteAlarms()}>Remove all Alarms</button>
      <button className="min-w-[150px] h-[30px] mt-[50px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] transition-transform hover:scale-110"onClick={()=>handleDeleteUser()}>Delete User</button>
      </div> 
    </div>
    

  );
};

export default Alarm_cal;







