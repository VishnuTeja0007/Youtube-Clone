import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';
import { LogOut, Search, Sun, Moon, UserCircle } from 'lucide-react';

import {  Settings, UserPen, MonitorPlay } from 'lucide-react';
/**
 * Header Component
 * Uses Tailwind v4.1 @theme variables and responsive custom breakpoints.
 */
const Header = ({ onMenuClick,searchTerm,setSearchTerm }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  function handleChange(e){
    let query=e.target.value
    console.log(query)
    setSearchTerm(query)
  }
  // Sync state with HTML class for Tailwind v4 logic
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-yt-border bg-yt-bg px-2 transition-colors duration-300 xs:px-4">

      {/* Left Section: Menu and Logo */}
      <div className="flex items-center gap-1 xs:gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-full p-2 text-yt-text transition-colors hover:bg-yt-surface active:bg-yt-border/30"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex min-w-fit items-center gap-1">
          <div className="rounded-lg bg-yt-primary p-1">
            <svg className="h-3.5 w-5 text-white xs:h-4 xs:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <span className="hidden font-bold tracking-tighter text-yt-text text-lg xs:block xs:text-xl">
            YouTube<sup className="ml-0.5 font-normal text-yt-muted text-[10px] uppercase">In</sup>
          </span>
        </Link>
      </div>

      {/* Center Section: Search Bar (Responsive) */}
      <div className="mx-4 hidden max-w-[600px] flex-grow items-center sm:flex">
        <div className="flex w-full overflow-hidden rounded-full border border-yt-border bg-yt-bg transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
          onChange={handleChange}
            type="text"
            placeholder="Search"
            className="w-full bg-transparent px-4 py-1 text-sm text-yt-text outline-none placeholder-yt-muted"
          />
          <button className="border-l border-yt-border bg-yt-surface px-5 py-1 hover:bg-yt-border/50 transition-colors">
            <Search className="h-5 w-5 text-yt-text" />
          </button>
        </div>
      </div>

      {/* Right Section: Actions & Theme Toggle */}
      <div className="flex items-center gap-1 xs:gap-2">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="active:scale-90 rounded-full p-2 text-yt-text transition-all duration-300 hover:bg-yt-surface"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <Sun size={20} className="fill-yellow-500/10 text-yellow-500" />
          ) : (
            <Moon size={20} className="fill-slate-700/10 text-slate-700" />
          )}
        </button>

        {/* Mobile-only Search Button */}
        <button className="p-2 text-yt-text hover:bg-yt-surface rounded-full sm:hidden">
          <Search size={20} />
        </button>
<div className="flex items-center gap-1 xs:gap-3">
      {!user ? (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 rounded-full border border-yt-border px-2 py-1.5 text-yt-primary transition-colors hover:bg-yt-primary/10 xs:px-3 active:scale-95"
        >
          <span className="text-xs font-medium xs:text-sm">Sign in</span>
        </button>
      ) : (
        <div className="flex items-center gap-1 xs:gap-3">
          
          {/* 1. Profile Avatar & Hover Panel Wrapper */}
          <div className="relative group py-2">
            {/* The Trigger: Avatar */}
            <img
              src={user.avatar || 'https://via.placeholder.com/32'}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-yt-border object-cover cursor-pointer hover:ring-2 hover:ring-yt-primary/20 transition-all"
            />

            {/* 2. The Popover Panel */}
            <div className="absolute right-0 top-full mt-1 w-64 xxs:w-72 bg-yt-bg border border-yt-border shadow-2xl rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[200] transform group-hover:translate-y-0 translate-y-2">
              
              {/* Profile Header Section */}
              <div className="flex flex-col items-center p-6 bg-yt-surface/50 border-b border-yt-border">
                <img 
                  src={user.avatar} 
                  className="w-20 h-20 rounded-full border-4 border-yt-bg shadow-lg object-cover mb-3" 
                  alt="Large Avatar" 
                />
                <h3 className="text-yt-text font-bold text-lg leading-tight">{user.username}</h3>
                <p className="text-yt-muted text-xs truncate w-full text-center mt-1">{user.email}</p>
              </div>

              {/* Hyperlinks Section */}
              <div className="p-2">
                <Link 
                  to="/settings/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-sm text-yt-text hover:bg-yt-surface rounded-xl transition-colors font-medium"
                >
                  <Settings size={18} className="text-yt-muted" /> Manage Profile
                </Link>

                <Link 
                  to="/studio/updateProfile" 
                  className="flex items-center gap-3 px-4 py-3 text-sm text-yt-text hover:bg-yt-surface rounded-xl transition-colors font-medium"
                >
                  <UserPen size={18} className="text-yt-muted" /> Update Profile
                </Link>

                {/* Conditional View or Create Channel */}
                <Link 
                  to={user.channel ? `/channel/${user.channel}` : "/studio/createChannel"} 
                  className="flex items-center gap-3 px-4 py-3 text-sm text-yt-text hover:bg-yt-surface rounded-xl transition-colors font-medium border-t border-yt-border mt-1 pt-3"
                >
                  <MonitorPlay size={18} className="text-yt-primary" />
                  {user.channel ? "View Your Channel" : "Create a Channel"}
                </Link>
                
                {/* Logout inside panel for mobile convenience */}
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/5 rounded-xl transition-colors font-bold mt-1"
                >
                  <LogOut size={18} /> Sign out
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
      </div>
    </nav>
  );
};

export default Header;