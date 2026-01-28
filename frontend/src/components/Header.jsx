import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';

/**
 * Header Component
 * Fixed SVG paths and nested button issues.
 * [Requirement 1.6, 1.7, 1.60, 1.62]
 */
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-[var(--color-dark-bg)] border-b border-[var(--color-dark-border)]">
      
      {/* Left Section: Menu and Logo */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-[var(--color-dark-surface)] rounded-full text-[var(--color-dark-text)]"
        >
          {/* FIXED: Added 'M' to start of path string */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Link to="/" className="flex items-center gap-1">
          <div className="bg-red-600 rounded-lg p-1">
            <svg className="w-6 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <span className="text-[var(--color-dark-text)] font-bold tracking-tighter text-xl hidden xs:block">
            YouTube<sup className="text-[10px] text-[var(--color-dark-muted)] ml-1 font-normal">IN</sup>
          </span>
        </Link>
      </div>

      {/* Center Section: Search Bar [Requirement 1.67, 1.68] */}
      <div className="flex-grow max-w-[600px] mx-4 flex items-center">
        <div className="flex w-full bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent px-4 py-1 text-[var(--color-dark-text)] focus:outline-none placeholder-[var(--color-dark-muted)]"
          />
          <button className="bg-[var(--color-dark-surface)] px-5 py-1 border-l border-[var(--color-dark-border)] hover:bg-[#303030]">
            <svg className="w-5 h-5 text-[var(--color-dark-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Section: Auth [Requirement 1.60, 1.62] */}
      <div className="flex items-center gap-3">
        {!user ? (
          /* FIXED: Removed nested button. Only one button handles the login navigation. */
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-dark-border)] rounded-full text-[var(--color-dark-accent)] hover:bg-blue-400/10 transition-colors"
          >
            <div className="border border-[var(--color-dark-accent)] rounded-full p-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Sign in</span>
          </button>
        ) : (
          /* FIXED: Using a div here to avoid nested buttons */
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-dark-text)] text-sm font-medium hidden md:block">
                {user.username}
              </span>
              <img 
                src={user.avatar || 'https://via.placeholder.com/32'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-[var(--color-dark-border)]"
              />
            </div>
            <button 
              onClick={logout}
              className="text-xs text-[var(--color-dark-muted)] hover:text-[var(--color-dark-primary)] underline transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;