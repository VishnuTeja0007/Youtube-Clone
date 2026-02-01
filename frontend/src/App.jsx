import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useState } from "react";

import { AuthProvider } from "./contexts/userContext";
import  YouTubeSidebar  from "./components/Sidebar";


function App() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
    {/* bg-yt-bg automatically handles Light/Dark based on the <html> class */}
    <div className="min-h-screen bg-yt-bg transition-colors duration-300">
      
      {/* 1. Header: Pass the toggle function */}
      <Header onMenuClick={()=>{toggleSidebar(); console.log("toggled",isSidebarOpen);}} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex pt-14 ">
        
        {/* 2. Sidebar: Pass the open state and close function (for mobile overlay) */}
        <YouTubeSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* 3. Main Content Area */}
      <main className={`
          flex-1 transition-all duration-300 ease-in-out bg-yt-surface
          ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
        `}>
          <div className="mx-auto max-w-[1600px] p-4 md:p-6">
           <Outlet context={{ searchTerm }}/>
          </div>
        </main>
      </div>
    </div>
    </AuthProvider>
  );
}

export default App;
