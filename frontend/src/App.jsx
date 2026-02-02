import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useState, Suspense } from "react";

import { AuthProvider } from "./contexts/userContext";
import  YouTubeSidebar  from "./components/Sidebar";
import Loading from "./components/Loading";


function App() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
    {/* bg-yt-bg automatically handles Light/Dark based on the <html> class */}
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
    </AuthProvider>
  );
}

export default App;
