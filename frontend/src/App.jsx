import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useState, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuth, clearAuth, setLoading } from "./store/authSlice";

import  YouTubeSidebar  from "./components/Sidebar";
import Loading from "./components/Loading";

/**
 * Main App Component
 * Handles authentication state, layout structure, and global state management
 * Provides the main layout with header, sidebar, and content area
 */
function App() {
  // Local state for UI management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility
  const [searchTerm, setSearchTerm] = useState(""); // Global search term state
  
  // Redux hooks for state management
  const dispatch = useDispatch(); // Action dispatcher for Redux store
  const { loading } = useSelector((state) => state.auth); // Get loading state from auth slice

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  /**
   * Authentication initialization effect
   * Runs on component mount to check for existing authentication token
   * and restore user session if valid
   */
  useEffect(() => {
    const initAuth = async () => {
      // Check for stored authentication token
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, set loading to false
        dispatch(setLoading(false));
        return;
      }

      try {
        // Validate token with backend and get user data
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Token is valid, update auth state with user data
        dispatch(setAuth({ user: res.data, token }));
      } catch (error) {
        // Token is invalid or expired, clear auth state
        console.error("Auth initialization failed:", error);
        dispatch(clearAuth());
      }
    };

    initAuth();
  }, [dispatch]); // Dependency array ensures this runs only once on mount

  // Show loading screen while authentication is being initialized
  if (loading) {
    return (
      <div className="mt-[25vh]">
        <Loading variant="spinner" size="lg" text="Initializing..." />
      </div>
    );
  }

  // Main application layout with responsive design
  return (
    <div className=" bg-yt-bg transition-colors duration-300">
      
      {/* Header component with navigation and search */}
      <Header onMenuClick={()=>{toggleSidebar(); console.log("toggled",isSidebarOpen);}} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex h-screen pt-14 ">
        
        {/* Sidebar navigation - responsive with mobile overlay */}
        <YouTubeSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main content area with dynamic margin based on sidebar state */}
        <main className={`
            flex-1 transition-all overflow-y-auto duration-300 ease-in-out bg-yt-surface
            ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
          `}>
          {/* Suspense wrapper for lazy-loaded components */}
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading..." />}>
            {/* Render child routes with search term context */}
            <Outlet context={{ searchTerm }}/>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
