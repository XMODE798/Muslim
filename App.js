import React, { useState, useEffect, useRef, useCallback } from 'react';

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // State to manage theme, starts in dark mode

  // Simulate loading with skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500); // Adjust loading time as needed
    return () => clearTimeout(timer);
  }, []);

  // Utility function for smooth scrolling
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle page navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
    scrollToTop(); // Scroll to top on page change
  };

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Helper for smart YouTube link
  const handleYouTubeLink = () => {
    const youtubeChannelHandle = '@x_mode798';
    const youtubeUrl = `https://youtube.com/${youtubeChannelHandle}?si=iyxMKb6fuEp9hQ-G`;

    // Attempt to open in YouTube app for iOS
    if (navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
      window.location.href = `youtube://${youtubeChannelHandle}`;
      setTimeout(() => {
        window.open(youtubeUrl, '_blank'); // Fallback to web if app doesn't open
      }, 500);
      return;
    }

    // Attempt to open in YouTube app for Android (more robust intent)
    if (navigator.userAgent.match(/Android/i)) {
      const androidIntentUrl = `intent://${youtubeChannelHandle}#Intent;scheme=https;package=com.google.android.youtube;action=android.intent.action.VIEW;end;`;
      window.location.href = androidIntentUrl;
      setTimeout(() => {
        window.open(youtubeUrl, '_blank'); // Fallback to web if app doesn't open
      }, 500);
      return;
    }

    // For desktop or other devices, open in new tab
    window.open(youtubeUrl, '_blank');
  };

  return (
    <div className={`min-h-screen flex flex-col custom-scrollbar`}>
      {/* Global CSS for custom properties and theme switching */}
      <style jsx>{`
        /* Default (Light) theme colors */
        :root {
          --bg-primary: #F5F5F5;
          --bg-secondary: #E0E0E0;
          --bg-card: #FFFFFF;
          --text-primary: #111111;
          --text-secondary: #444444;
          --border-neutral: #CCCCCC;
        }
        /* Dark theme colors, applied when .dark-theme class is present on the body */
        body.dark-theme {
          --bg-primary: #111111;
          --bg-secondary: #1A1A1A;
          --bg-card: #1C1C1C;
          --text-primary: #FFFFFF;
          --text-secondary: #888888;
          --border-neutral: #888888;
        }
        /* Common accent colors that don't change with theme */
        :root, body.dark-theme {
          --accent-blue: #007BFF;
          --accent-red: #FF4655;
        }

        /* Apply variables to component styles */
        body {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'Tajawal', sans-serif;
        }
        .bg-primary { background-color: var(--bg-primary); }
        .bg-secondary { background-color: var(--bg-secondary); }
        .bg-card { background-color: var(--bg-card); }
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .border-neutral { border-color: var(--border-neutral); }
        .text-accent-blue { color: var(--accent-blue); }
        .bg-accent-blue { background-color: var(--accent-blue); }
        .border-accent-blue { border-color: var(--accent-blue); }
        .text-accent-red { color: var(--accent-red); }
        .bg-accent-red { background-color: var(--accent-red); }
        .hover-text-accent-blue:hover { color: var(--accent-blue); }
        .hover-border-accent-blue:hover { border-color: var(--accent-blue); }
        .focus-border-accent-blue:focus { border-color: var(--accent-blue); }
        .focus-ring-accent-blue:focus { --tw-ring-color: var(--accent-blue); }
        .bg-accent-red-hover:hover { background-color: #E03A48; } /* Specific hover for red */
        .bg-accent-blue-hover:hover { background-color: #0056b3; } /* Specific hover for blue */


        /* Custom Scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--border-neutral); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0056b3; } /* Darker blue on hover */

        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
      `}</style>
      {/* Ensure body class is toggled */}
      <Updater isDarkMode={isDarkMode} />

      {/* Theme toggle button - positioned at top right */}
      <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-grow pb-32 bg-primary text-primary"> {/* Increased padding bottom for fixed footer nav clearance */}
        {showSkeleton ? <LoadingSkeleton /> : (
          <div className="container mx-auto px-4 py-8">
            {/* Page content based on current page state */}
            {currentPage === 'home' && <HomePage onNavigate={navigateTo} onYouTubeClick={handleYouTubeLink} />}
            {currentPage === 'projects' && <ProjectsPage />}
            {currentPage === 'store' && <StorePage />}
            {currentPage === 'about' && <AboutMePage />}
          </div>
        )}
        {/* Main Footer is now part of the scrollable main content */}
        <MainFooter />
      </main>

      {/* Sticky Footer Navigation Bar */}
      <FooterNav onNavigate={navigateTo} currentPage={currentPage} onYouTubeClick={handleYouTubeLink} />
    </div>
  );
}

// Component to apply dark-theme class to body
const Updater = ({ isDarkMode }) => {
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);
  return null;
};

// Theme Toggle Button Component
const ThemeToggleButton = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 left-4 z-50 p-3 rounded-full bg-secondary shadow-lg
        text-accent-blue transition-colors duration-300 ease-in-out
        hover:bg-primary-hover active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-accent-blue"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="M4.93 4.93l1.41 1.41"/>
          <path d="M17.66 17.66l1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="M4.93 19.07l1.41-1.41"/>
          <path d="M17.66 6.34l1.41-1.41"/>
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  );
};


// Loading Skeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="bg-secondary h-48 rounded-lg mb-8"></div>
      <div className="space-y-4">
        <div className="bg-secondary h-6 w-3/4 rounded"></div>
        <div className="bg-secondary h-6 rounded"></div>
        <div className="bg-secondary h-6 w-5/6 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-secondary h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Navigation Bar Component
const FooterNav = ({ onNavigate, currentPage, onYouTubeClick }) => {
  const navItems = [
    { id: 'about', label: 'من أنا؟', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-circle-2">
        <path d="M18 20a6 6 0 0 0-12 0"/>
        <circle cx="12" cy="10" r="4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    )},
    { id: 'youtube', label: 'YouTube', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z"/>
        <path d="m10 15 5-3-5-3v6Z"/>
      </svg>
    ), action: onYouTubeClick },
    { id: 'home', label: 'الرئيسية', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id: 'projects', label: 'المشاريع', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    )},
    { id: 'store', label: 'المتجر', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag">
        <path d="M6 2L3 7v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5Z"/>
        <path d="M3 7h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    )},
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] bg-opacity-80 backdrop-blur-md p-4 shadow-lg rounded-t-lg">
      <div className="container mx-auto flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action ? item.action : () => onNavigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ease-in-out group
              ${currentPage === item.id ? 'text-primary' : 'text-secondary'}
              hover-text-accent-blue focus:outline-none focus:ring-2 focus-ring-accent-blue active:scale-[0.98]
            `}
          >
            <div className="w-6 h-6 mb-1 transition-all duration-300 ease-in-out hover-text-accent-blue">
              {item.icon}
            </div>
            <span className={`text-xs font-tajawal font-normal transition-all duration-300 ease-in-out hover-text-accent-blue
              ${currentPage === item.id ? 'text-primary' : 'text-secondary'}`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Main Footer Component
const MainFooter = () => {
  const socialIcons = [
    { name: 'TikTok', url: 'https://www.tiktok.com/@x_mode798', svg: ( // Updated TikTok link
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.75 3.84a8.07 8.07 0 0 0-2.88-1.57c-.72-.18-1.46-.27-2.22-.27a7.7 7.7 0 0 0-6.12 3.19V14.33a3.5 3.5 0 1 1-3.5-3.5c.34 0 .66.07.96.17a3.5 3.5 0 0 1 2.54 3.33V7.27c2.25-.66 4.7-.68 6.94-.04.47.13.92.29 1.34.48.5-.83.82-1.74 1.15-2.67.14-.38.28-.75.4-1.12.1-.28.16-.57.16-.86a.25.25 0 0 0-.25-.25Z" fill="#202020"/>
        <path d="M16.92 1.64c-.72-.18-1.46-.27-2.22-.27a7.7 7.7 0 0 0-6.12 3.19V14.33a3.5 3.5 0 1 1-3.5-3.5c.34 0 .66.07.96.17a3.5 3.5 0 0 1 2.54 3.33V7.27c2.25-.66 4.7-.68 6.94-.04.47.13.92.29 1.34.48.5-.83.82-1.74 1.15-2.67.14-.38.28-.75.4-1.12.1-.28.16-.57.16-.86a.25.25 0 0 0-.25-.25Z" fill="#FFFFFF"/>
        <path d="M19.75 3.84a8.07 8.07 0 0 0-2.88-1.57c-.72-.18-1.46-.27-2.22-.27a7.7 7.7 0 0 0-6.12 3.19V14.33a3.5 3.5 0 1 1-3.5-3.5c.34 0 .66.07.96.17a3.5 3.5 0 0 1 2.54 3.33V7.27c2.25-.66 4.7-.68 6.94-.04.47.13.92.29 1.34.48.5-.83.82-1.74 1.15-2.67.14-.38.28-.75.4-1.12.1-.28.16-.57.16-.86a.25.25 0 0 0-.25-.25Z" fill="url(#tiktok_gradient)" stroke="black" strokeWidth="0.5"/>
        <defs>
          <linearGradient id="tiktok_gradient" x1="10.875" y1="1.375" x2="10.875" y2="22.625" gradientUnits="userSpaceOnUse">
            <stop stopColor="#69C9D0"/>
            <stop offset="1" stopColor="#EE1D52"/>
          </linearGradient>
        </defs>
      </svg>
    )},
    { name: 'Instagram', url: 'https://www.instagram.com/x_mode798?igsh=aDliemtjcTAxeXNw', svg: ( // Updated Instagram link
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#instagram_gradient)"/>
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="white"/>
        <path d="M17.5 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="white"/>
        <defs>
          <linearGradient id="instagram_gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEDA75"/>
            <stop offset="0.3" stopColor="#FA7E1E"/>
            <stop offset="0.6" stopColor="#D62976"/>
            <stop offset="0.9" stopColor="#962FBF"/>
            <stop offset="1" stopColor="#4F5BD5"/>
          </linearGradient>
        </defs>
      </svg>
    )},
    { name: 'YouTube', url: 'https://youtube.com/@x_mode798?si=iyxMKb6fuEp9hQ-G', svg: ( // Updated YouTube link
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.61 5.92A3.2 3.2 0 0 0 17.3 3.61C15.86 3.22 12 3.22 12 3.22s-3.86 0-5.3.39A3.2 3.2 0 0 0 4.39 5.92C4 7.36 4 12 4 12s0 4.64.39 6.08a3.2 3.2 0 0 0 2.31 2.31c1.44.39 5.3.39 5.3.39s3.86 0 5.3-.39a3.2 3.2 0 0 0 2.31-2.31c.39-1.44.39-6.08.39-6.08s0-4.64-.39-6.08Z" fill="#FF0000"/>
        <path d="m10 15 5-3-5-3v6Z" fill="#FFFFFF"/>
      </svg>
    )},
    { name: 'WhatsApp', url: 'https://wa.me/9647850572326', svg: ( // Updated WhatsApp link
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.777.464 3.447 1.272 4.887L2 22l5.113-1.272A9.95 9.95 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z" fill="#25D366"/>
        <path d="M17.5 15.6c-.2-.1-.8-.4-1-.5-.2-.1-.4-.1-.6.1-.2.2-.8.9-.9 1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-1.2-1-2-2-2.3-2.6-.2-.4 0-.6.1-.6.1-.1.2-.2.3-.3.1-.1.2-.2.3-.3.1-.1.1-.2 0-.3-.1-.1-.6-.8-.8-1s-.2-.3-.5-.6-.6-.5-.9-.5-.6-.1-.9-.1c-.2 0-.5.1-.7.3s-.7.8-.7 1.9c0 1.1.7 2.1.8 2.2.1.1 1.4 2.2 3.4 3.1 1.9.8 2.8.7 3.3.6.5-.1.8-.4 1-.6.2-.2.4-.4.6-.6.2-.2.4-.4.4-.6s.1-.4-.2-.6Z" fill="#FFFFFF"/>
      </svg>
    )},
    { name: 'Telegram', url: 'https://t.me/x_Mode798', svg: ( // Updated Telegram link
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" fill="#229ED9"/>
        <path d="m18.06 6.84-2.51 11.75c-.27 1.25-.94 1.57-2.05.99L9.57 15.02l-2.45 2.37c-.38.37-.69.66-1.36.43L4.2 16.5c-.71-.24-.49-.78.15-1.03l12.75-5.06c.54-.21 1.05-.1 1.48.24.43.34.61.8.48 1.4Z" fill="#FFFFFF"/>
      </svg>
    )},
  ];

  return (
    <footer className="bg-primary p-8 text-center border-t border-neutral">
      <div className="container mx-auto">
        <div className="mb-4">
          <h3 className="text-xl font-bold font-tajawal mb-2 text-primary">X-MODE</h3>
          <p className="text-primary text-sm font-tajawal mb-4">
            لأننا نُبرمج المستقبل، ولا ننتظره.
          </p>
        </div>
        <div className="flex justify-center space-x-6 rtl:space-x-reverse mb-6">
          {socialIcons.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition-transform duration-200 ease-out hover:scale-[1.05] active:scale-[0.98]"
            >
              {item.svg}
            </a>
          ))}
        </div>
        <p className="text-secondary text-xs font-tajawal">
          © 2024 X-MODE. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};

// HomePage Component
const HomePage = ({ onNavigate, onYouTubeClick }) => {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up-visible');
            observer.unobserve(entry.target); // Unobserve once visible
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Animated counting for achievement numbers
  const AnimatedCounter = ({ endValue, duration }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
      let observer;
      const currentRef = ref.current;

      if (currentRef) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              let startTimestamp;
              const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                setCount(Math.floor(progress * endValue));
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                }
              };
              window.requestAnimationFrame(step);
              observer.unobserve(currentRef); // Stop observing once animated
            }
          },
          { threshold: 0.5 } // Trigger when 50% of the element is visible
        );
        observer.observe(currentRef);
      }
      return () => {
        if (observer && currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [endValue, duration]);

    return <span ref={ref}>{count}</span>;
  };

  // News Ticker Component
  const NewsTicker = () => {
    const newsItems = [
      "مرحباً بكم في منصة X-MODE!",
      "ترقبوا مشاريع برمجية جديدة قريباً.",
      "شاهدوا أحدث تحليلات الألعاب على قناة X-MODE.",
      "المتجر الإلكتروني قيد الإنشاء - تابعونا!"
    ];

    return (
      <div className="relative w-full overflow-hidden my-8 rounded-lg bg-secondary py-3 shadow-inner group">
        <style jsx>{`
          @keyframes ticker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .news-ticker-content {
            white-space: nowrap;
            animation: ticker 25s linear infinite; /* Increased speed */
          }
          .group:hover .news-ticker-content {
            animation-play-state: paused;
          }
        `}</style>
        <div className="news-ticker-content flex items-center">
          {newsItems.map((item, index) => (
            <span key={index} className="text-primary text-sm md:text-base px-10 font-tajawal"> {/* Increased padding */}
              {item}
            </span>
          ))}
          {/* Duplicate items to create a continuous loop */}
          {newsItems.map((item, index) => (
            <span key={`dup-${index}`} className="text-primary text-sm md:text-base px-10 font-tajawal"> {/* Increased padding */}
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-12">
      {/* CSS for Fade In Up Animation */}
      <style jsx>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in-up-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Section 1: Hero Section */}
      <div ref={heroRef} className="text-center fade-in-up rounded-lg p-6 md:p-10 shadow-lg bg-primary">
        <h1 className="text-4xl md:text-5xl font-tajawal font-bold text-primary mb-4 leading-tight">
          مرحباً بك في <span className="text-accent-blue">X-MODE</span>
        </h1>
        <p className="text-md md:text-lg text-primary mb-6 max-w-3xl mx-auto font-tajawal leading-relaxed">
          مرحباً بك في الموقع الرسمي لمسلم، الشاب العراقي الطموح الذي يجمع بكل احتراف بين شغف البرمجة وعمق عالم الألعاب. أسستُ هذه المنصة كواجهة موحدة لإبراز مشاريعي البرمجية، أفكاري التطبيقية، ومستقبل مشوّق ينبض بالإبداع. كما تدعوك قناة X‑MODE على YouTube للاستمتاع بتحليلات تقنية ومحتوى ترفيهي يعكس روح الشباب والحماس.
        </p>
        <p className="text-lg md:text-xl font-tajawal font-medium text-accent-blue mb-8 max-w-3xl mx-auto">
          هنا، أصمم المستقبل، أحلل الألعاب، وأشارك شغفي بكل ما هو تقني ومثير.
        </p>
        <NewsTicker />
      </div>

      {/* Section 2: Featured Sections Links */}
      <div ref={el => sectionsRef.current[0] = el} className="fade-in-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <FeatureLink icon={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z"/>
              <path d="m10 15 5-3-5-3v6Z"/>
            </svg>
          )}
          text="قناة X-MODE للألعاب"
          onClick={onYouTubeClick}
          isExternal={true}
        />
        <FeatureLink icon={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2Z"/>
              <path d="M2 12h20"/>
            </svg>
          )}
          text="معرض مشاريعنا"
          onClick={() => onNavigate('projects')}
        />
        <FeatureLink icon={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-store">
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
              <path d="M2 7h20"/>
              <path d="M12 7v15"/>
            </svg>
          )}
          text="متجرنا الإلكتروني"
          onClick={() => onNavigate('store')}
        />
        <FeatureLink icon={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          )}
          text="تواصل معنا"
          onClick={() => onNavigate('about')}
        />
      </div>

      {/* Section 3: About Me Summary */}
      <div ref={el => sectionsRef.current[1] = el} className="fade-in-up bg-secondary p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-6 text-center">نبذة سريعة</h2>
        <div className="space-y-6">
          <p className="text-primary leading-relaxed font-tajawal mb-6">
            أنا مسلم، شاب عراقي طموح، أجمع بين شغفي العميق بالبرمجة وعالم الألعاب. في هذه المنصة، أشارك رحلتي في بناء مشاريع برمجية مبتكرة، وأقدم تحليلات شيقة لمختلف الألعاب على قناتي X-MODE على يوتيوب.
          </p>
          <hr className="border-neutral border-t-1 my-4" />
          <p className="text-primary leading-relaxed font-tajawal mb-6">
            <strong className="text-accent-blue font-medium">الرؤية:</strong> أن أكون جسراً بين أحدث التقنيات وعالم الشباب العربي، مقدماً محتوىً هادفاً ومشاريع ملهمة تدفع نحو مستقبل رقمي واعد.
          </p>
          <hr className="border-neutral border-t-1 my-4" />
          <p className="text-primary leading-relaxed font-tajawal">
            <strong className="text-accent-blue font-medium">الرسالة:</strong> تمكين الشباب من خلال مشاركة المعرفة والخبرة في مجالات البرمجة والألعاب، وتشجيعهم على الابتكار والتعبير عن إبداعاتهم الرقمية.
          </p>
        </div>
        <button
          onClick={() => onNavigate('about')}
          className="mt-8 px-6 py-3 bg-accent-red text-primary font-tajawal font-medium rounded-full shadow-lg bg-accent-red-hover transition-all duration-200 ease-in-out transform active:scale-[0.98]"
        >
          اكتشف المزيد عني
        </button>
      </div>

      {/* Section 4: Achievement Counter */}
      <div ref={el => sectionsRef.current[2] = el} className="fade-in-up bg-secondary p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-8">إنجازاتنا بالأرقام</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-primary rounded-lg shadow-inner">
            <p className="text-5xl font-bold font-tajawal text-primary">
              <AnimatedCounter endValue={10} duration={1000} />+
            </p>
            <p className="text-secondary text-sm font-tajawal mt-2">مشاريع مكتملة</p>
          </div>
          <div className="p-4 bg-primary rounded-lg shadow-inner">
            <p className="text-5xl font-bold font-tajawal text-primary">
              <AnimatedCounter endValue={5000} duration={1500} />+
            </p>
            <p className="text-secondary text-sm font-tajawal mt-2">مشترك في يوتيوب</p>
          </div>
          <div className="p-4 bg-primary rounded-lg shadow-inner">
            <p className="text-5xl font-bold font-tajawal text-primary">
              <AnimatedCounter endValue={20} duration={1200} />+
            </p>
            <p className="text-secondary text-sm font-tajawal mt-2">مقالات وتحليلات</p>
          </div>
          <div className="p-4 bg-primary rounded-lg shadow-inner">
            <p className="text-5xl font-bold font-tajawal text-primary">
              <AnimatedCounter endValue={3} duration={800} />+
            </p>
            <p className="text-secondary text-sm font-tajawal mt-2">سنوات خبرة</p>
          </div>
        </div>
      </div>

      {/* Section 5: Social Call to Action (brief) */}
      <div ref={el => sectionsRef.current[3] = el} className="fade-in-up text-center pt-8">
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-4">
          تواصلوا معنا عبر منصات التواصل الاجتماعي
        </h2>
        <p className="text-secondary font-tajawal text-md">
          تابعوا آخر التحديثات والمحتوى الحصري. الروابط متوفرة في الأسفل!
        </p>
      </div>
    </section>
  );
};

// Feature Link Component for Homepage
const FeatureLink = ({ icon, text, onClick, isExternal = false }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-6 bg-secondary rounded-lg shadow-md transition-all duration-300 ease-in-out transform
        hover:bg-card hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
        border border-transparent hover-border-accent-blue
      "
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <div className="text-accent-blue mb-3 text-4xl">{icon}</div>
      <span className="text-primary text-lg font-tajawal font-medium">{text}</span>
    </button>
  );
};


// Projects Gallery Page Component
const ProjectsPage = () => {
  // All project cards removed as per user request
  const projectCards = [];

  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) observer.unobserve(pageRef.current);
    };
  }, []);

  return (
    <section ref={pageRef} className="min-h-screen text-center fade-in-up bg-primary">
      <style jsx>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in-up-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <h1 className="text-4xl md:text-5xl font-tajawal font-bold text-primary mb-8">
        معرض مشاريعنا
      </h1>
      <p className="text-secondary text-xl mb-12">
        ترقبوا المزيد من المشاريع المبتكرة قريباً!
      </p>

      {projectCards.length === 0 && (
        <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <p className="text-primary text-lg font-tajawal mb-4">
            لا توجد مشاريع لعرضها حاليًا.
          </p>
          <p className="text-secondary text-sm font-tajawal">
            اعمل بجد على مشاريع جديدة ومثيرة، وسأضيفها هنا فور انتهائي منها.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {/* No project cards will be rendered here as projectCards array is empty */}
      </div>
    </section>
  );
};

// Online Store Page Component
const StorePage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) observer.unobserve(pageRef.current);
    };
  }, []);

  const handleNotifyMe = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.email;
    if (emailInput.value && emailInput.checkValidity()) {
      alert("شكرًا لك! سنعلمك عند إطلاق المتجر."); // Using alert() as per instructions, will replace with custom modal if needed
      emailInput.value = '';
    } else {
      alert("الرجاء إدخال بريد إلكتروني صحيح.");
    }
  };

  return (
    <section ref={pageRef} className="min-h-screen text-center fade-in-up bg-primary">
      <style jsx>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in-up-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <h1 className="text-4xl md:text-5xl font-tajawal font-bold text-primary mb-8">
        متجرنا الإلكتروني
      </h1>
      <p className="text-secondary text-xl mb-12">
        قريباً جداً! احرص على متابعة آخر التحديثات عبر وسائل التواصل.
      </p>

      <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-lg mx-auto mb-12">
        <h2 className="text-2xl font-tajawal font-medium text-accent-blue mb-4">
          أعلمني عند الإطلاق
        </h2>
        <p className="text-secondary mb-6">
          كن أول من يعلم بفتح أبواب متجر X-MODE!
        </p>
        <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            name="email"
            placeholder="أدخل بريدك الإلكتروني هنا"
            className="flex-grow p-3 rounded-lg bg-primary border border-neutral text-primary
              placeholder-secondary focus:outline-none focus-border-accent-blue focus-ring-accent-blue
              transition-all duration-200 ease-in-out
            "
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent-red text-primary font-tajawal font-medium rounded-lg shadow-md
              bg-accent-red-hover transition-all duration-200 ease-in-out transform active:scale-[0.98]
            "
          >
            أعلمني عند الإطلاق
          </button>
        </form>
      </div>

      {/* Removed all structural elements for future store as per user request */}
    </section>
  );
};

// About Me Page Component
const AboutMePage = () => {
  const pageRef = useRef(null);
  const contactFormRef = useRef(null);
  const skillRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up-visible');
            // For skill bars, trigger animation when visible
            if (entry.target.classList.contains('skill-item')) {
              const progressBar = entry.target.querySelector('.skill-progress-fill');
              if (progressBar) {
                const level = parseInt(progressBar.dataset.level);
                progressBar.style.width = `${level}%`;
              }
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }
    if (contactFormRef.current) {
      observer.observe(contactFormRef.current);
    }
    skillRefs.current.forEach(skillItem => {
      if (skillItem) observer.observe(skillItem);
    });

    return () => {
      if (pageRef.current) observer.unobserve(pageRef.current);
      if (contactFormRef.current) observer.unobserve(contactFormRef.current);
      skillRefs.current.forEach(skillItem => {
        if (skillItem) observer.unobserve(skillItem);
      });
    };
  }, []);


  const skills = [
    { name: 'HTML5', level: 95 },
    { name: 'CSS3 / Tailwind CSS', level: 90 },
    { name: 'JavaScript (ES6+)', level: 85 },
    { name: 'React.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'Data Analysis', level: 70 },
    { name: 'Game Development (Unity/Godot)', level: 60 },
  ];

  // Modified to open email client directly
  const handleEmailClick = () => {
    window.location.href = 'mailto:muslimmax798@gmail.com';
  };

  return (
    <section ref={pageRef} className="min-h-screen space-y-12 fade-in-up bg-primary">
      <style jsx>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in-up-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .skill-progress-bar {
          background-color: var(--border-neutral); /* Light grey for empty part */
          border-radius: 9999px; /* Full rounded corners */
          height: 10px;
          overflow: hidden;
        }
        .skill-progress-fill {
          background: linear-gradient(to right, var(--accent-blue), #0056b3); /* Technical blue gradient */
          height: 100%;
          width: 0%; /* Start at 0% for animation */
          transition: width 1.5s ease-out; /* Smooth transition */
          border-radius: 9999px;
        }
        .fade-in-up-visible .skill-progress-fill {
          /* width will be set by JS dynamically for animation */
        }
      `}</style>
      <h1 className="text-4xl md:text-5xl font-tajawal font-bold text-primary mb-8 text-center">
        من أنا؟
      </h1>

      {/* About Me Details */}
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-6">👤 نبذة عني</h2>
        <p className="text-primary leading-relaxed font-tajawal mb-6">
          أنا مسلم، شاب عراقي من ذي قار، مبرمج ومحلل تقني مهتم بصناعة محتوى شبابي احترافي يجمع بين التقنية والإعلام. أؤمن أن البرمجة ليست مجرد أكواد، بل وسيلة للتعبير، للتحليل، ولصناعة واقع رقمي يليق بطموحات الجيل القادم. أعمل على بناء هوية رقمية تجمع بين مشاريعي البرمجية، محتواي التحليلي، ومتجري الإلكتروني، ضمن منصة واحدة: X-MODE.
        </p>
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-6">🌌 الرؤية</h2>
        <p className="text-primary leading-relaxed font-tajawal mb-6">
          أن أكون من أوائل الشباب العرب الذين يجمعون بين البرمجة، التحليل التقني، وصناعة المحتوى الشبابي، عبر منصة ذكية مؤثرة، تجعل من كل مشروع خطوة نحو التميّز، ومن كل فكرة واقع رقمي فعّال.
        </p>
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-6">🎯 الرسالة</h2>
        <p className="text-primary leading-relaxed font-tajawal">
          بناء منصة رقمية شخصية تعكس هويتي كمبرمج ومحلل، توثّق مشاريعي، تعزز قناتي، وتفتح أبوابًا للتواصل المهني مع جمهوري، مع توفير تجربة رقمية فريدة تليق بتطلعات الشباب العربي الطموح في عالم التقنية والميديا.
        </p>
      </div>

      {/* Skills Section */}
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-6 text-center">مهاراتي</h2>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index} ref={el => skillRefs.current[index] = el} className="flex flex-col skill-item">
              <div className="flex justify-between items-center mb-2">
                <span className="text-primary font-tajawal font-medium text-lg">{skill.name}</span>
                <span className="text-accent-blue font-tajawal font-medium">{skill.level}%</span>
              </div>
              <div className="skill-progress-bar">
                <div
                  className="skill-progress-fill"
                  data-level={skill.level} // Use data attribute to store level
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Email Section */}
      <div className="bg-secondary p-6 rounded-lg shadow-lg text-center fade-in-up">
        <h2 className="text-3xl font-tajawal font-medium text-accent-blue mb-4">تواصل معنا</h2>
        <p className="text-secondary mb-8">يمكنك التواصل معي مباشرة عبر البريد الإلكتروني:</p>
        <button
          onClick={handleEmailClick}
          className="px-6 py-3 bg-accent-red text-primary font-tajawal font-medium rounded-lg shadow-md
            bg-accent-red-hover transition-all duration-200 ease-in-out transform active:scale-[0.98]
            flex items-center justify-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-2 rtl:ml-2 rtl:mr-0">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          muslimmax798@gmail.com
        </button>
      </div>

      {/* Direct Contact Methods section removed */}
    </section>
  );
};

export default App;