
import { UserDataContext } from '../context/UserCont.jsx';
import  { useContext } from 'react'


const Card = ({image}) => {
     const{  serverUrl,SelectedImage,setSelectedImage,
        BackendImage,setBackendImage,
        FrontendImage,setFrontendImage} =useContext(UserDataContext)
  return (
    <div className={`w-[100px] h-[160px] [lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${SelectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`} onClick={()=>{setSelectedImage(image),setBackendImage(null),setFrontendImage(null)}}>
      <img src={image} className='h-full object-cover'></img>
    </div>
  )
}

export default Card

