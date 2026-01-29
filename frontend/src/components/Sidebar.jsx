import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';
import { 
  Home, 
  Clock, 
  List, 
  ThumbsUp, 
  Video, 
  ChevronDown, 
  UserCircle 
} from 'lucide-react';

/**
 * YouTubeSidebar Component
 * Integrated with v4.1 custom animations and scrollbar-yt.
 */
export default function YouTubeSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [showAllSubs, setShowAllSubs] = useState(false);

  const subscriptions = [
    { name: 'English With Ran...', avatar: '🎓', isLive: false, hasNotif: true },
    { name: 'SSC Adda247', avatar: '🅰️', isLive: true, hasNotif: false },
    { name: 'Marvel Entertain...', avatar: '🦸', isLive: true, hasNotif: false },
    { name: 'Adda247', avatar: '🅰️', isLive: true, hasNotif: false },
    { name: 'Sansad TV', avatar: '🏛️', isLive: true, hasNotif: false },
    { name: 'UC LIVE', avatar: '🎯', isLive: true, hasNotif: false },
    { name: 'The Canadian Lad', avatar: '🇨🇦', isLive: false, hasNotif: false },
  ];

  const visibleSubs = showAllSubs ? subscriptions : subscriptions.slice(0, 6);

  const youItems = [
    { icon: Clock, label: 'History' },
    { icon: List, label: 'Playlists' },
    { icon: Clock, label: 'Watch Later' },
    { icon: ThumbsUp, label: 'Liked videos' },
    { icon: Video, label: 'Your videos' },
  ];

  return (
    <>
      {/* Mobile Overlay - uses the new animate-fade-in */}
      {isOpen && (
        <div 
          className="animate-fade-in fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - uses the new scrollbar-yt */}
      <aside 
  className={`
    fixed top-14 left-0 
    w-64 h-[calc(100vh-3.5rem)] 
    overflow-y-auto scrollbar-yt
    z-50 
    transition-transform duration-300 ease-in-out
    /* Toggle transform based on isOpen prop */
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    bg-yt-bg border-r border-yt-border
    flex flex-col transition-colors duration-300
  `}
>
        <div className="px-3 py-2 flex-1">
          
          {/* Home Item - First to slide in */}
          <div className="animate-slide-in flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text transition-colors">
            <Home size={22} strokeWidth={2} />
            <span className="text-[14px] font-medium">Home</span>
          </div>

          <div className="h-px my-3 bg-yt-border" />

          {/* You Section - Staggered delay */}
          <div 
            className="animate-slide-in px-3 py-2 text-yt-text"
            style={{ animationDelay: '100ms' }}
          >
            <h2 className="text-[15px] font-semibold">You</h2>
          </div>

          <div className="space-y-0.5 animate-slide-in" style={{ animationDelay: '150ms' }}>
            {user && (
              <Link
                to={`/channel/${user.id || 'me'}`}
                className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text"
              >
                <UserCircle size={22} strokeWidth={2} />
                <span className="text-[14px] font-medium">Your channel</span>
              </Link>
            )}

            {youItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-5 px-3 py-2 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text"
                >
                  <Icon size={22} strokeWidth={2} />
                  <span className="text-[14px] font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="h-px my-3 bg-yt-border" />

          {/* Subscriptions Section - Further staggered */}
          <div 
            className="animate-slide-in px-3 py-2 text-yt-text"
            style={{ animationDelay: '200ms' }}
          >
            <h2 className="text-[15px] font-semibold">Subscriptions</h2>
          </div>

          <div className="space-y-0.5 animate-slide-in" style={{ animationDelay: '250ms' }}>
            {visibleSubs.map((sub, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer hover:bg-yt-surface text-yt-text group"
              >
                <div className="w-6 h-6 flex items-center justify-center text-sm rounded-full bg-yt-surface border border-yt-border">
                  {sub.avatar}
                </div>
                <span className="text-[14px] flex-1 truncate">{sub.name}</span>
                <div className="flex items-center gap-1.5">
                  {sub.hasNotif && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  {sub.isLive && (
                    <div className="flex items-center justify-center animate-live-pulse">
                      <div className="w-2 h-2 rounded-full bg-yt-primary" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setShowAllSubs(!showAllSubs)}
              className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-yt-surface text-yt-text"
            >
              <ChevronDown 
                size={20} 
                className={`transition-transform duration-300 ${showAllSubs ? 'rotate-180' : ''}`} 
              />
              <span className="text-[14px] font-medium">
                {showAllSubs ? 'Show less' : 'Show more'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="animate-slide-in px-6 py-4 mt-auto text-[11px] font-medium text-yt-muted border-t border-yt-border transition-colors duration-300" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
            <a href="#" className="hover:text-yt-text">About</a>
            <a href="#" className="hover:text-yt-text">Press</a>
            <a href="#" className="hover:text-yt-text">Copyright</a>
          </div>
          <p>© 2026 YouTube IN</p>
        </footer>
      </aside>
    </>
  );
}