import { useEffect, useState, createContext, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // ✅ Import for route detection

export const UserDataContext = createContext();

function UserCont({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [BackendImage, setBackendImage] = useState(null);
  const [FrontendImage, setFrontendImage] = useState(null);
  const [SelectedImage, setSelectedImage] = useState(null);

  const location = useLocation(); // ✅ Get current route path

  const HandleCurrentUser = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true, // ✅ For sending cookies
      });
      setUserData(result.data);
      console.log("Fetched user:", result.data);
    } catch (error) {
      console.log("User fetch error:", error);
      if (error.response?.status === 401) {
        setUserData(null); // Unauthenticated
      }
    } finally {
      setLoadingUser(false);
    }
  }, [serverUrl]);

  const getGeminiResponse = useCallback(async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error("Gemini API error:", error?.response?.data || error.message);
      return {
        error: true,
        response: "Something went wrong while processing the command.",
      };
    }
  }, [serverUrl]);

  useEffect(() => {
    const publicPaths = ["/login", "/signup"];
    const isPublic = publicPaths.includes(location.pathname);

    if (userData === null && !isPublic) {
      HandleCurrentUser();
    } else {
      setLoadingUser(false);
    }
  }, [userData, location.pathname, HandleCurrentUser]);

  const value = {
    serverUrl,
    userData,
    setUserData,
    HandleCurrentUser,
    BackendImage,
    setBackendImage,
    FrontendImage,
    setFrontendImage,
    SelectedImage,
    setSelectedImage,
    getGeminiResponse,
    loadingUser,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserCont;


