import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BiImageAdd } from "react-icons/bi";
import Card from "../Components/card.jsx"
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image4 from "../assets/image4.png"
import authBg from "../assets/authBg.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { UserDataContext } from '../context/UserCont.jsx';
import { IoMdArrowRoundBack } from "react-icons/io";


function Costumize() {
  const{  serverUrl,SelectedImage,setSelectedImage,
    BackendImage,setBackendImage,
    FrontendImage,setFrontendImage} =useContext(UserDataContext)
  const inputImage=useRef()
  const navigate=useNavigate()
  const HandleInputImage=(e)=>{
  const file= e.target.files[0]
  setBackendImage(file)
  setFrontendImage(URL.createObjectURL(file))
  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col relative'>
    <IoMdArrowRoundBack className=' cursor-pointer text-white w-[50px] h-[50px] absolute top-[30px] left-[30px] mb-[30px] pb-[30px]'onClick={()=>navigate("/")} >  </IoMdArrowRoundBack >
   <h1 className='text-white text-center text-[30px] mb-[50px]'>Select Your <span className="text-blue-500" >Assistant Image</span> </h1>
    <div className='w-[90%] max-w[60%] flex justify-center items-center flex-wrap gap-[20px]'>
      <Card image={image1}/>
      <Card image={image2}/>
      <Card image={image7}/>
      <Card image={authBg}/>
      <Card image={image4}/>
      <Card image={image5}/>
      <Card image={image6}/>
          <div className={`w-[100px] h-[160px] -[lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66]  overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${SelectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`} onClick={()=>{inputImage.current.click(), setSelectedImage("input")}}>
     {!FrontendImage && <BiImageAdd  className='text-white w-[25px] h-[25px] '/>
 }
     {FrontendImage && <img src={FrontendImage} className="h-full object-cover"></img>}
    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={HandleInputImage}></input>
    </div>
    <div>
     {SelectedImage && <button className="min-w-[130px] h-[40px] mt-[30px] text-black font-semibold bg-white cursor-pointer rounded-full text-[19px] "  onClick={()=>navigate("/customize2")} >Next</button>
}
      </div> 
      </div> 
    
  )
}

export default Costumize
