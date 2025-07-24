import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Costumize from './pages/Costumize.jsx';
import Costumize2 from './pages/Costumize2.jsx';
import { useContext } from 'react';
import { UserDataContext } from './context/UserCont.jsx'
import './index.css'

function App() {
  const { userData, loadingUser } = useContext(UserDataContext);

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.AssistantName
            ? <Home />
            : <Navigate to="/customize" />
        }
      />
      <Route
        path="/login"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/customize" />}
      />
      <Route
        path="/customize"
        element={
          !userData
            ? <Navigate to="/login" />
              : <Costumize />
        }
      />
      <Route
        path="/customize2"
        element={
          !userData
            ? <Navigate to="/login" />
              : <Costumize2 />
           
        }
      />
    </Routes>
  );
}

export default App;



