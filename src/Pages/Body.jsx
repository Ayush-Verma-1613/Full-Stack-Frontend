import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - Sticky on mobile */}
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      
      {/* Main Content Area - Flexible growth */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </main>
      
      {/* Footer - Always at bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Body;