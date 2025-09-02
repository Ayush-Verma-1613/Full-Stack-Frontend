import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Pages/Body";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import { Provider } from "react-redux";

import Feed from "./Pages/Feeds";
import EditProfilePage from "./Pages/EditProfilePage";
import Requests from "./Pages/Requests";
import Connections from "./Pages/Connections";
import Setting from "./Pages/Setting";
import ProtectedRoutes  from "./Pages/ProtectedRoutes";
import AboutUs from "./Pages/About";
import ContactUs from "./Pages/Contact";
import Chat from "./Pages/Chat";




function App() {
  return (
  
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} /> {/* This means / */}
            <Route path="login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            <Route element={<ProtectedRoutes />}>

               <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/settings" element={<Setting />} />
             <Route path="/chat/:targetUserId" element={<Chat />} />
            
            </Route>
           
          </Route>
        </Routes>
      
   
  );
}

export default App;
