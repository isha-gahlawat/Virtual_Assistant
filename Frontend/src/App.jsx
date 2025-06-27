
import {Navigate, Route,Routes} from 'react-router-dom'
import Signin from './pages/Signin.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Costumize from './pages/Costumize.jsx'
import Costumize2 from './pages/Costumize2.jsx'
import { useContext, useEffect,useRef } from 'react'
import {UserDataContext} from './context/UserCont.jsx'

function App() {
  const {userData,setUserData}=useContext(UserDataContext)
  return (
    <Routes>
      <Route path="/" element={(userData?.AssistantName && userData?.assistantImage)?<Home/>:<Navigate to={"/login"}/>}></Route>
      <Route path="/login" element={(!userData?<Signin/>:<Navigate to={"/"}/>)}></Route>
      <Route path="/signup" element={(!userData? <Signup/>:<Navigate to={"/"}/>)}></Route>
      <Route path="/customize" element={(userData? <Costumize/>:<Navigate to={"/login"}/>)}></Route>
      <Route path="/customize2" element={(userData? <Costumize2/>:<Navigate to={"/login"}/>)}></Route>
    
    </Routes>
  )
}

export default App

