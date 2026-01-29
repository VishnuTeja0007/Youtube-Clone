import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';
import { LogOut, Search, Sun, Moon, UserCircle } from 'lucide-react';

/**
 * Header Component
 * Uses Tailwind v4.1 @theme variables and responsive custom breakpoints.
 */
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

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

        {!user ? (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 rounded-full border border-yt-border px-2 py-1.5 text-yt-primary transition-colors hover:bg-yt-primary/10 xs:px-3 active:scale-95"
          >
            <span className="text-xs font-medium xs:text-sm">Sign in</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 xs:gap-3">
            
            {/* Channel Link */}
            <Link 
              to={`/channel/${user.id || 'me'}`}
              className="flex items-center gap-2 rounded-full p-2 text-yt-text transition-colors hover:bg-yt-surface md:px-3 group"
              title="Your Channel"
            >
              <UserCircle size={20} strokeWidth={1.5} className="group-hover:text-yt-primary transition-colors" />
              <span className="hidden text-xs font-semibold md:block">Channel</span>
            </Link>

            {/* Profile Avatar */}
            <div className="flex items-center">
              <img
                src={user.avatar || 'https://via.placeholder.com/32'}
                alt="Profile"
                className="h-7 w-7 rounded-full border border-yt-border object-cover xs:h-8 xs:w-8 hover:opacity-90 cursor-pointer"
              />
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="group flex items-center gap-1 rounded-lg px-2 py-1.5 text-yt-muted transition-all hover:text-yt-primary hover:bg-yt-primary/5 text-[10px] xs:text-xs"
            >
              <LogOut size={14} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden xs:block font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;