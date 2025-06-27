
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import UserCont from './context/UserCont.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserCont>
    <App />
  </UserCont>
  </BrowserRouter>,
)
