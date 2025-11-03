import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, ClockCounterClockwise, List, X, UserCircle, SignOut } from "@phosphor-icons/react"; 

import SearchIcon from '../assets/search.png'; 
import GeorgianFlag from '../assets/ka.png';
import USFlag from '../assets/en.png';

// ❌ ძველი იმპორტი: import useAuth from '../hooks/useAuth';
// ✅ ახალი იმპორტი: Context Hook-ის იმპორტი
import { useAuth } from '../contexts/AuthContext';

const NavItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  hover: { scale: 1.1, color: '#f97316' },
};

const LogoVariants = {
  initial: { rotate: 0 },
  animate: { rotate: 0 },
  hover: { scale: 1.05, rotate: 5, boxShadow: "0 0 15px rgba(253, 230, 138, 0.8)" }
};

const MobileMenuVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.4 } },
  open: { height: "auto", opacity: 1, transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.05 } }
};

const MobileItemVariants = {
  closed: { y: -10, opacity: 0 },
  open: { y: 0, opacity: 1 },
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const navigate = useNavigate();
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState('en');

  // ⭐️ განახლებული Auth Hook-ის გამოყენება Context-დან
  const { user, isAuthenticated, logout } = useAuth(); 

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    // ... არსებული useEffect ლოგიკა ...

    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('search') || '';
    setSearchQuery(initialQuery);

    try {
      const storedHistory = localStorage.getItem('movieSearchHistory');
      if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
    } catch (error) {
      console.error("Failed to load search history:", error);
    }

    const handleClickOutside = (event) => {
      const desktopSearch = document.getElementById('desktop-search-area');
      const mobileSearch = document.getElementById('mobile-search-area');
      if ((desktopSearch && !desktopSearch.contains(event.target)) &&
          (mobileSearch && !mobileSearch.contains(event.target))) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.search]);

  const saveHistory = (newHistory) => {
    setSearchHistory(newHistory);
    try {
      localStorage.setItem('movieSearchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

  const filteredSuggestions = searchHistory
    .filter(query =>
      query.toLowerCase().includes(searchQuery.toLowerCase()) &&
      query.toLowerCase() !== searchQuery.toLowerCase()
    )
    .slice(0, 5);

  const handleSearch = (e, queryToSearch = searchQuery) => {
    e.preventDefault();
    const query = queryToSearch.trim();

    if (query !== "") {
      const newHistory = [
        query,
        ...searchHistory.filter(item => item.toLowerCase() !== query.toLowerCase())
      ].slice(0, 10);

      saveHistory(newHistory);
      navigate(`/movies?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/movies`);
    }

    setSearchQuery(query);
    setShowSuggestions(false);
    setFocusedSuggestionIndex(-1);
    if (isOpen) setIsOpen(false); 
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setFocusedSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestionIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestionIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === 'Enter' && focusedSuggestionIndex >= 0) {
      e.preventDefault();
      const selectedQuery = filteredSuggestions[focusedSuggestionIndex];
      setSearchQuery(selectedQuery);
      handleSearch(e, selectedQuery);
    }
  };

  // ⭐️ გამოსვლის (Logout) ფუნქცია
  const handleLogout = () => {
    logout();
    setIsOpen(false); // დავხუროთ მობილური მენიუ
    navigate('/');    // გადავიდეთ მთავარ გვერდზე
  };


  const SuggestionsDropdown = () => {
    if (filteredSuggestions.length === 0) return null;

    return (
      <AnimatePresence>
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 w-full mt-2 bg-gray-800 border border-indigo-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((query, index) => (
            <motion.li
              key={query}
              className={`px-4 py-2 cursor-pointer text-sm text-gray-300 transition-colors duration-200
                ${index === focusedSuggestionIndex ? 'bg-indigo-600' : 'hover:bg-indigo-700'}`}
              onClick={(e) => handleSearch({ preventDefault: () => e.preventDefault() }, query)}
            >
              <ClockCounterClockwise size={16} className="inline-block mr-2 text-pink-400" />
              {query}
            </motion.li>
          ))}
          <li
            className="px-4 py-2 text-xs text-center text-red-400 cursor-pointer hover:bg-gray-700"
            onClick={(e) => { e.stopPropagation(); saveHistory([]); setShowSuggestions(false); }}
          >
            Clear History
          </li>
        </motion.ul>
      </AnimatePresence>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950 shadow-2xl shadow-indigo-900/50 border-b border-indigo-900/50">
      
      {/* მთავარი ჰედერის კონტეინერი */}
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 space-x-2 sm:space-x-4 w-full">
        
        {/* 1. Logo */}
        <motion.div initial="initial" animate="animate" whileHover="hover" variants={LogoVariants} 
             className="flex-shrink-0" 
        >
          <Link
            to="/"
            className="text-lg sm:text-xl md:text-2xl font-black text-white px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-xl shadow-yellow-500/30 transition duration-300 transform cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">🎬 MOVIES HUB</span>
            <span className="inline sm:hidden">🎬 M HUB</span>
          </Link>
        </motion.div>

        {/* 2. Desktop Nav */}
        <nav className="hidden sm:flex lg:flex flex-1 justify-center mx-2 md:mx-10 min-w-0">
          <ul className="flex space-x-2">
            <AnimatePresence>
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.name} 
                  initial="hidden" 
                  animate="visible" 
                  whileHover="hover" 
                  variants={NavItemVariants} 
                  transition={{ delay: index * 0.08 }}
                  className="hidden sm:block text-sm" 
                >
                  <Link
                    to={item.path}
                    className={`inline-block px-3 py-1.5 rounded-full font-bold transition-all duration-300 ease-in-out
                      ${location.pathname === item.path ? 'bg-indigo-700 text-pink-400 shadow-lg shadow-indigo-600/50' : 'text-white hover:bg-indigo-700 hover:text-pink-400 hover:shadow-xl'}`}
                  >
                    {item.name.toUpperCase()}
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </nav>
        
        {/* 3. Search + Flags + Auth + Mobile Menu Button Container */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">

            {/* A. AUTH BUTTONS (Login/Register ან User Icon/Logout) */}
            <div className="hidden lg:flex items-center space-x-3 mr-3">
                {isAuthenticated ? (
                    // ⬇️ თუ მომხმარებელი ავტორიზებულია (User Name და Logout ღილაკი)
                    <>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-full border border-pink-500/50 text-white font-medium text-sm shadow-md"
                        >
                            <UserCircle size={22} className="text-pink-400"/>
                            <span className="truncate max-w-[100px]">{user?.username || 'User'}</span> 
                        </motion.div>
                        <motion.button
                            onClick={handleLogout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-full text-sm shadow-md shadow-red-600/40 hover:bg-red-700 transition duration-300 whitespace-nowrap flex items-center"
                        >
                            <SignOut size={18} className="mr-1"/> Logout
                        </motion.button>
                    </>
                ) : (
                    // ⬇️ თუ მომხმარებელი არ არის ავტორიზებული (Login/Register ღილაკები)
                    <>
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-full text-sm shadow-md shadow-indigo-600/40 hover:bg-indigo-700 transition duration-300 whitespace-nowrap"
                            >
                                <UserCircle size={20} className="mr-1" /> Login
                            </motion.button>
                        </Link>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-1.5 bg-pink-600 text-white font-bold rounded-full text-sm shadow-md shadow-pink-600/40 hover:bg-pink-700 transition duration-300 whitespace-nowrap"
                            >
                                Register
                            </motion.button>
                        </Link>
                    </>
                )}
            </div>
          
          {/* B. Desktop Search */}
          <div id="desktop-search-area" className="hidden lg:flex relative z-50 flex-none" onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}>
            <motion.form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-full p-1 border border-indigo-500/50 shadow-inner">
              <MagnifyingGlass size={20} className="ml-2 opacity-60 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search movies..."
                className="px-1 py-1 bg-transparent border-none outline-none text-white font-light placeholder-gray-500 w-full max-w-44 transition-all duration-300 min-w-[120px]"
              />
              <motion.button type="submit" className="w-8 h-8 flex items-center justify-center bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors duration-300 p-1 flex-shrink-0" whileTap={{ scale: 0.9 }}>
                <img src={SearchIcon} alt="Search Icon" className="w-5 h-5" />
              </motion.button>
            </motion.form>
            <AnimatePresence>{showSuggestions && <SuggestionsDropdown />}</AnimatePresence>
          </div>

          {/* C. Language Flags */}
          <div className="flex space-x-1 flex-shrink-0"> 
            <motion.button 
              whileHover={{ scale: 1.2, filter: "brightness(1.1)" }} 
              whileTap={{ scale: 0.9 }} 
              className={`p-0.5 rounded-full overflow-hidden transition-all duration-300 shrink-0 ${currentLang === 'ka' ? 'ring-2 ring-pink-500' : ''}`} 
              onClick={() => setCurrentLang('ka')}
            >
              <img src={GeorgianFlag} alt="Georgian Flag" className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-full shadow-md" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.2, filter: "brightness(1.1)" }} 
              whileTap={{ scale: 0.9 }} 
              className={`p-0.5 rounded-full overflow-hidden transition-all duration-300 shrink-0 ${currentLang === 'en' ? 'ring-2 ring-pink-500' : ''}`} 
              onClick={() => setCurrentLang('en')}
            >
              <img src={USFlag} alt="US Flag" className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-full shadow-md" />
            </motion.button>
          </div>

          {/* D. Mobile menu button */}
          <div className="lg:hidden flex-shrink-0">
            <motion.button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white hover:text-pink-400 transition-colors duration-300 text-2xl" 
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={24} className="sm:size-8" /> : <List size={24} className="sm:size-8" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu content */}
      <motion.div 
        initial={false} 
        animate={isOpen ? "open" : "closed"} 
        variants={MobileMenuVariants} 
        className="lg:hidden bg-gray-900 overflow-hidden shadow-xl"
      >
        <div className="p-4 flex flex-col space-y-3">
          
          {/* 1. Mobile Search Bar */}
          <div className="mt-2 relative z-40" onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}>
            <form onSubmit={handleSearch} className="flex" id="mobile-search-area">
              <div className="relative flex-1 min-w-0">
                  <MagnifyingGlass size={24} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search movies..." 
                    className="w-full pl-11 pr-4 py-2 rounded-l-xl border-none outline-none text-gray-900 font-medium shadow-inner placeholder-gray-500 bg-white" 
                  />
              </div>
              <button type="submit" className="px-5 py-2 bg-pink-600 text-white rounded-r-xl hover:bg-pink-700 font-medium transition-colors duration-300 flex items-center justify-center flex-shrink-0">
                  <img src={SearchIcon} alt="Search Icon" className="w-6 h-6" />
              </button>
            </form>
            <AnimatePresence>
                {showSuggestions && <SuggestionsDropdown />}
            </AnimatePresence>
          </div>

          {/* 2. Mobile ნავიგაციის ლინკები */}
          {navItems.map((item) => (
            <motion.div key={item.name} variants={MobileItemVariants}>
              <Link
                to={item.path}
                className={`block py-3 px-4 rounded-xl font-medium text-lg text-center transition-all duration-300 ease-in-out
                  ${location.pathname === item.path ? 'bg-indigo-700 text-yellow-300 shadow-md' : 'bg-gray-800 text-white hover:bg-indigo-600 hover:text-yellow-300'}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name.toUpperCase()}
              </Link>
            </motion.div>
          ))}

            {/* 3. Mobile AUTH BUTTONS */}
            <motion.div variants={MobileItemVariants} className="mt-3 pt-3 border-t border-gray-700">
                {isAuthenticated ? (
                    // ⬇️ თუ მომხმარებელი ავტორიზებულია (მობილური ვერსია)
                    <div className="flex flex-col space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="py-3 px-4 rounded-xl bg-gray-800 border border-pink-500/50 text-white font-medium text-lg text-center flex items-center justify-center space-x-2"
                        >
                            <UserCircle size={28} className="text-pink-400"/>
                            <span>Welcome, {user?.username || 'User'}!</span>
                        </motion.div>
                        <motion.button
                            onClick={handleLogout}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-red-600 text-white font-bold rounded-xl text-lg shadow-md hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2"
                        >
                            <SignOut size={24}/> <span>LOGOUT</span>
                        </motion.button>
                    </div>

                ) : (
                    // ⬇️ თუ მომხმარებელი არ არის ავტორიზებული (ძველი ღილაკები)
                    <div className="flex space-x-3 justify-between">
                        <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-lg shadow-md hover:bg-indigo-700 transition duration-300"
                            >
                                Login
                            </motion.button>
                        </Link>
                        <Link to="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl text-lg shadow-md hover:bg-pink-700 transition duration-300"
                            >
                                Register
                            </motion.button>
                        </Link>
                    </div>
                )}
            </motion.div>


          {/* 4. Mobile language buttons */}
          <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-700 justify-center">
            <motion.button whileHover={{ scale: 1.2, filter: "brightness(1.1)" }} whileTap={{ scale: 0.9 }} className={`p-0.5 rounded-full overflow-hidden transition-all duration-300 shrink-0 ${currentLang === 'ka' ? 'ring-2 ring-pink-500' : ''}`} onClick={() => setCurrentLang('ka')}>
              <img src={GeorgianFlag} alt="Georgian Flag" className="w-6 h-6 object-cover rounded-full shadow-md" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.2, filter: "brightness(1.1)" }} whileTap={{ scale: 0.9 }} className={`p-0.5 rounded-full overflow-hidden transition-all duration-300 shrink-0 ${currentLang === 'en' ? 'ring-2 ring-pink-500' : ''}`} onClick={() => setCurrentLang('en')}>
              <img src={USFlag} alt="US Flag" className="w-6 h-6 object-cover rounded-full shadow-md" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}