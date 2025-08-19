import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import SearchDropdown from './SearchDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  // Scroll-aware navbar state
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  // Animate-in state for floating action button (FAB)
  const [fabIn, setFabIn] = useState(false);
  // Profile submenu inside floating menu
  const [showProfileSubmenu, setShowProfileSubmenu] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleGlobalDown = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
      if (showProfileMenu && profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
        setIsMenuOpen(false);
        setShowFloatingMenu(false);
        setShowProfileSubmenu(false);
      }
    };
    document.addEventListener('mousedown', handleGlobalDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleGlobalDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isMenuOpen, showProfileMenu]);

  // Auto-close all menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
    setShowFloatingMenu(false);
  }, [location.pathname]);

  // Auto-close menus on auth user change (e.g., logout/login)
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
    setShowFloatingMenu(false);
  }, [user]);

  // Detect scroll direction to hide/show navbar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const last = lastScrollY.current;
      const delta = y - last;
      // Threshold to avoid jitter
      if (y > 40 && delta > 5) {
        setIsScrollingDown(true);
      } else if (delta < -5) {
        setIsScrollingDown(false);
      }
      // Close any open menus on meaningful scroll movement
      if (Math.abs(delta) > 5) {
        setShowFloatingMenu(false);
        setShowProfileSubmenu(false);
      }
      // Only show full navbar when at the very top
      setAtTop(y <= 10);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Also close menus when scroll direction toggles
  useEffect(() => {
    setShowFloatingMenu(false);
    setShowProfileMenu(false);
  }, [isScrollingDown]);

  // When returning to top (full navbar visible), ensure floating and profile menus are closed
  useEffect(() => {
    if (atTop) {
      setShowFloatingMenu(false);
      setShowProfileMenu(false);
      setShowProfileSubmenu(false);
      setFabIn(false);
    } else {
      // Delay to allow mount before animating in
      const id = requestAnimationFrame(() => setFabIn(true));
      return () => cancelAnimationFrame(id);
    }
  }, [atTop]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  const handleSearchBlur = (e) => {
    // Delay hiding to allow clicking on dropdown items
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setShowSearchDropdown(false);
      }
    }, 200);
  };

  return (
    <>
      {/* Dynamic Island Style Navbar (only visible at top) */}
      <nav
        className={`dynamic-island transition-all duration-300 ease-out ${
          atTop
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-lg font-bold gradient-text hover:scale-105 transition-transform duration-200"
          >
            NEST
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties, owners, tenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-48 lg:w-64 xl:w-72 pl-4 pr-4 py-2 bg-white/80 dark:bg-neutral-800/80 border border-white/30 dark:border-neutral-700/50 rounded-full text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
              </div>
              {showSearchDropdown && (
                <SearchDropdown 
                  query={searchQuery} 
                  onClose={() => setShowSearchDropdown(false)}
                />
              )}
            </div>

            {/* Navigation Links */}
            <Link
              to="/"
              className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
            >
              Properties
            </Link>
            <Link
              to="/map"
              className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
            >
              Map
            </Link>
            {user && (
              <Link
                to="/notifications"
                className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
              >
                Notifications
              </Link>
            )}
            <Link
              to="/owners"
              className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
            >
              Owners
            </Link>
            <Link
              to="/tenants"
              className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
            >
              Tenants
            </Link>
            {user?.role === 'tenant' && (
              <Link
                to="/favourites"
                className="px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
              >
                Favourites
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-all duration-200"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-cyan-400/60"
                >
                  Dashboard
                </Link>
                {/* Authenticated users should not see Sign Up here */}
                <div
                  className="relative"
                  ref={profileRef}
                >
                  <button
                    onClick={() => setShowProfileMenu((v) => !v)}
                    className="flex items-center justify-center h-9 w-9 rounded-full border border-white/30 dark:border-neutral-700 overflow-hidden bg-neutral-200 dark:bg-neutral-700 hover:ring-2 hover:ring-cyan-400/60"
                    title={user?.name || 'Profile'}
                    aria-haspopup="menu"
                    aria-expanded={showProfileMenu}
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                        {(user?.name || 'U')
                          .split(' ')
                          .map(s => s[0])
                          .join('')
                          .slice(0,2)
                          .toUpperCase()}
                      </span>
                    )}
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-white/30 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden z-50"
                         onMouseDown={(e) => e.stopPropagation()}>
                      <div className="px-4 py-3 border-b border-white/30 dark:border-neutral-700 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt="avatar" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                              {(user?.name || 'U')
                                .split(' ')
                                .map(s => s[0])
                                .join('')
                                .slice(0,2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{user?.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile-status"
                          onClick={() => setShowProfileMenu(false)}
                          className="block w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 text-left rounded-lg"
                        >
                          Profile Status
                        </Link>
                        <Link
                          to="/profile-settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="block w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 text-left rounded-lg"
                        >
                          Settings
                        </Link>
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-full transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap inline-flex"
                >
                  {"Sign\u00A0Up"}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden px-3 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900/80 transition-all duration-200 border border-transparent hover:border-cyan-200 dark:border-neutral-700"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Floating round button (top-right) when not at top */}
      {!atTop && (
        <>
          <button
            onClick={() => setShowFloatingMenu((v) => !v)}
            className={`fixed top-4 right-4 z-[60] h-10 w-10 rounded-full bg-cyan-600 text-white shadow-xl hover:bg-cyan-700 transition-all duration-300 ease-out ring-2 ring-cyan-400/30 drop-shadow-[0_8px_16px_rgba(34,211,238,0.35)] ${
              showFloatingMenu ? 'scale-110 drop-shadow-[0_10px_20px_rgba(34,211,238,0.45)]' : 'scale-100'
            } ${fabIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
            title="Open Menu"
            aria-label="Open Menu"
          >
            {/* Simple hamburger */}
            <span className="block w-5 h-0.5 bg-white mx-auto mb-1.5 rounded"></span>
            <span className="block w-5 h-0.5 bg-white mx-auto mb-1.5 rounded"></span>
            <span className="block w-5 h-0.5 bg-white mx-auto rounded"></span>
          </button>

          {/* Vertical menu panel opened by floating button */}
          {showFloatingMenu && (
            <div className="fixed top-20 right-4 z-[55] w-64 max-h-[70vh] overflow-auto rounded-2xl border shadow-xl p-4 animate-slide-up bg-white/98 dark:bg-neutral-900/98 border-white/30 dark:border-neutral-700/70 backdrop-blur-xl"
                 onMouseDown={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                <Link to="/" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Home</Link>
                <Link to="/properties" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Properties</Link>
                <Link to="/map" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Map</Link>
                <Link to="/owners" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Owners</Link>
                <Link to="/tenants" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Tenants</Link>
                {user?.role === 'tenant' && (
                  <Link to="/favourites" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Favourites</Link>
                )}
                {user && (
                  <Link to="/notifications" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">Notifications</Link>
                )}
                <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />
                {user ? (
                  <>
                    {/* Profile submenu */}
                    <button
                      onClick={() => setShowProfileSubmenu((v) => !v)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-cyan-600 dark:text-cyan-400"
                      aria-expanded={showProfileSubmenu}
                      aria-controls="profile-submenu"
                    >
                      Profile
                    </button>
                    {showProfileSubmenu && (
                      <div id="profile-submenu" className="pl-3 space-y-1">
                        <button
                          onClick={() => { navigate('/profile-status'); setShowFloatingMenu(false); setShowProfileSubmenu(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-200"
                        >
                          Profile Status
                        </button>
                        <button
                          onClick={() => { navigate('/profile-settings'); setShowFloatingMenu(false); setShowProfileSubmenu(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-200"
                        >
                          Settings
                        </button>
                        <button
                          onClick={async () => { await logout(); navigate('/'); setShowFloatingMenu(false); setShowProfileSubmenu(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-error-50/60 dark:hover:bg-error-900/20 text-sm font-medium text-error-700 dark:text-error-400"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                    <Link to="/dashboard" onClick={() => { setShowFloatingMenu(false); setShowProfileSubmenu(false); }} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-cyan-600 dark:text-cyan-400">Dashboard</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-cyan-600 dark:text-cyan-400">Login</Link>
                    <Link to="/register" onClick={() => setShowFloatingMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-cyan-600 dark:text-cyan-400 whitespace-nowrap">{"Sign\u00A0Up"}</Link>
                  </>
                )}
                <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />
                <button onClick={() => { toggleTheme(); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`mobile-menu fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-neutral-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } border-l border-neutral-200 dark:border-neutral-700`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="p-2 space-y-1">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-cyan-600 dark:text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <Link
              to="/properties"
              className="flex items-center px-4 py-3 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v16l-6-3-6 3V4z" clipRule="evenodd" />
              </svg>
              Properties
            </Link>
            <Link
              to="/map"
              className="flex items-center px-4 py-3 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Map
            </Link>
            {user && user.role === 'tenant' && (
              <Link
                to="/favourites"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Favourites
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 w-full text-left rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors duration-200 mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  </svg>
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="flex items-center px-4 py-3 w-full text-left rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-cyan-50 dark:hover:bg-neutral-800 font-medium"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-5 h-5 mr-3 text-amber-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 mr-3 text-indigo-500" />
                  Dark Mode
                </>
              )}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;