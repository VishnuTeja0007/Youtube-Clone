import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useState, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuth, clearAuth, setLoading } from "./store/authSlice";

import  YouTubeSidebar  from "./components/Sidebar";
import Loading from "./components/Loading";


function App() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setAuth({ user: res.data, token }));
      } catch (error) {
        console.error("Auth initialization failed:", error);
        dispatch(clearAuth());
      }
    };

    initAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="mt-[25vh]">
        <Loading variant="spinner" size="lg" text="Initializing..." />
      </div>
    );
  }

  return (
    <div className=" bg-yt-bg transition-colors duration-300">
      
      {/* 1. Header: Pass the toggle function */}
      <Header onMenuClick={()=>{toggleSidebar(); console.log("toggled",isSidebarOpen);}} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex h-screen pt-14 ">
        
        {/* 2. Sidebar: Pass the open state and close function (for mobile overlay) */}
        <YouTubeSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* 3. Main Content Area */}
      <main className={`
          flex-1 transition-all overflow-y-auto duration-300 ease-in-out bg-yt-surface
          ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
        `}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading..." />}>
            <Outlet context={{ searchTerm }}/>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
