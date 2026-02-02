import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, Info, X, 
  Sparkles, Zap, Heart, TrendingUp, Award, Bell
} from 'lucide-react';

/**
 * Cinematic Toast Notification Component
 * Features unique YouTube-inspired animations and effects
 */
const Toast = ({ 
  type = 'success', 
  title = '', 
  message = '', 
  duration = 4000,
  onClose = () => {},
  variant = 'slide',
  icon: CustomIcon,
  celebration = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Progress bar countdown
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 400);
  };

  // Toast type configurations
  const configs = {
    success: {
      icon: CustomIcon || CheckCircle,
      bgGradient: 'from-success/20 to-success/20',
      borderColor: 'border-success/40',
      iconColor: 'text-success',
      glowColor: 'shadow-success/30',
      accentColor: 'bg-success',
    },
    error: {
      icon: CustomIcon || XCircle,
      bgGradient: 'from-error/20 to-error/20',
      borderColor: 'border-error/40',
      iconColor: 'text-error',
      glowColor: 'shadow-error/30',
      accentColor: 'bg-error',
    },
    warning: {
      icon: CustomIcon || AlertTriangle,
      bgGradient: 'from-warning/20 to-warning/20',
      borderColor: 'border-warning/40',
      iconColor: 'text-warning',
      glowColor: 'shadow-warning/30',
      accentColor: 'bg-warning',
    },
    info: {
      icon: CustomIcon || Info,
      bgGradient: 'from-info/20 to-info/20',
      borderColor: 'border-info/40',
      iconColor: 'text-info',
      glowColor: 'shadow-info/30',
      accentColor: 'bg-info',
    },
    milestone: {
      icon: CustomIcon || Award,
      bgGradient: 'from-milestone/20 to-milestone/20',
      borderColor: 'border-milestone/40',
      iconColor: 'text-milestone',
      glowColor: 'shadow-milestone/30',
      accentColor: 'bg-milestone',
    },
    trending: {
      icon: CustomIcon || TrendingUp,
      bgGradient: 'from-trending/20 to-trending/20',
      borderColor: 'border-trending/40',
      iconColor: 'text-trending',
      glowColor: 'shadow-trending/30',
      accentColor: 'bg-trending',
    },
    like: {
      icon: CustomIcon || Heart,
      bgGradient: 'from-like/20 to-like/20',
      borderColor: 'border-like/40',
      iconColor: 'text-like',
      glowColor: 'shadow-like/30',
      accentColor: 'bg-like',
    },
    notification: {
      icon: CustomIcon || Bell,
      bgGradient: 'from-notification/20 to-notification/20',
      borderColor: 'border-notification/40',
      iconColor: 'text-notification',
      glowColor: 'shadow-notification/30',
      accentColor: 'bg-notification',
    }
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  // Animation variants
  const animations = {
    slide: {
      enter: isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      className: 'transition-all duration-400 ease-out'
    },
    bounce: {
      enter: isVisible && !isExiting ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
      className: 'transition-all duration-400 ease-out'
    },
    fade: {
      enter: isVisible && !isExiting ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
      className: 'transition-all duration-400'
    },
    flip: {
      enter: isVisible && !isExiting ? 'rotateX-0 opacity-100' : 'rotateX-90 opacity-0',
      className: 'transition-all duration-500'
    }
  };

  const anim = animations[variant] || animations.slide;

  return (
    <>
      <div 
        className={`fixed top-6 right-6 z-50 ${anim.className} ${anim.enter}`}
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className={`
            relative min-w-[320px] max-w-md
            bg-yt-surface
            backdrop-blur-xl
            border-yt-border border
            rounded-2xl
            shadow-2xl ${config.glowColor}
            overflow-hidden
          `}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-grid-pattern animate-slideDown"></div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>

          {/* Content */}
          <div className="relative p-5">
            <div className="flex items-start gap-4">
              {/* Animated Icon */}
              <div className="relative flex-shrink-0 mt-1">
                {/* Pulsing glow */}
                <div className={`absolute inset-0 ${config.accentColor} rounded-full blur-md opacity-50 animate-pulse`}></div>
                
                {/* Icon container */}
                <div className={`relative ${config.accentColor} p-2 rounded-xl shadow-lg`}>
                  <Icon className="w-6 h-6 text-white animate-iconBounce" />
                </div>

                {/* Celebration sparkles */}
                {(celebration || type === 'milestone') && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="font-bold text-base text-yt-text mb-1.5 animate-slideInLeft">
                    {title}
                  </h4>
                )}
                {message && (
                  <p className="text-sm text-yt-muted leading-relaxed animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                    {message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-yt-muted hover:text-yt-text transition-all p-1.5 hover:bg-yt-border/30 rounded-full hover:rotate-90 duration-300"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Animated Progress Bar */}
            {duration > 0 && (
              <div className="mt-4 h-1.5 bg-yt-border/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${config.accentColor} rounded-full transition-all duration-50 relative overflow-hidden`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer on progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            )}
          </div>

          {/* Accent stripe */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor}`}></div>
        </div>
      </div>

      {/* Confetti effect for celebrations */}
      {celebration && isVisible && !isExiting && (
        <div className="fixed top-6 right-6 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                backgroundColor: [
                  'var(--color-success)', 
                  'var(--color-error)', 
                  'var(--color-warning)', 
                  'var(--color-info)', 
                  'var(--color-yt-primary)'
                ][i % 5],
                left: `${confettiConfig[i].left}px`,
                animationDelay: `${confettiConfig[i].delay}s`,
                animationDuration: `${confettiConfig[i].duration}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }
        @keyframes iconBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes slideInLeft {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes confetti {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(300px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-slideDown {
          animation: slideDown 20s linear infinite;
        }
        .animate-iconBounce {
          animation: iconBounce 2s ease-in-out infinite;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </>
  );
};

export default Toast;