import { useState, useEffect } from "react";
import UseMovies from "../Data/UseMovies"; 
import { useLocation, Link } from "react-router-dom"; 
import { History, Film, Trash, ArrowLeft, Star, Mail, Copyright } from 'lucide-react'; 
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionLink = motion(Link); 

export default function Movies() {
  const { movies: allMovies, loading, error } = UseMovies();
  
  const [history, setHistory] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('search') || '';
    setSearchQuery(urlQuery.toLowerCase().trim());

    try {
      const storedHistory = JSON.parse(localStorage.getItem("viewedMovies")) || [];
      setHistory(storedHistory);
    } catch (e) {
      console.error("Failed to load viewed movies history:", e);
    }
    
  }, [location.search]); 

  const filteredMovies = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery) ||
    movie.overview.toLowerCase().includes(searchQuery)
  );

  const displayedMovies = viewingHistory ? history : filteredMovies;

  const handleClick = (movie) => {
    const movieWithTime = { ...movie, viewedAt: new Date().toISOString() };
    
    const updatedHistory = [
      movieWithTime, 
      ...history.filter(m => m.id !== movie.id)
    ];

    setHistory(updatedHistory);
    localStorage.setItem("viewedMovies", JSON.stringify(updatedHistory));
    
    if (movie.imdb_link) {
      window.open(movie.imdb_link, "_blank");
    }
  };

  const handleClearHistory = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to clear history?"
    );

    if (isConfirmed) {
      setHistory([]);
      localStorage.removeItem("viewedMovies");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-4 text-xl">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p className="text-xl">Error loading movies: {error.message}</p>
      </div>
    );
  }

  const HistoryItemCard = ({ movie }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-700 p-3 xs:p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-pink-500 transition duration-300 hover:bg-gray-600"
    >
        <div className="flex-grow">
            <h3 className="text-lg xs:text-xl font-bold text-white mb-1 truncate">{movie.title}</h3>
            <div className="flex items-center text-sm text-gray-400 mt-1">
                 <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                 Rating: {movie.vote_average || 'N/A'}
            </div>
             {movie.viewedAt && (
                <p className="text-xs text-gray-500 mt-2">
                    Viewed: {new Date(movie.viewedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                </p>
             )}
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
            <a 
                href={movie.imdb_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-pink-300 hover:text-pink-400 font-medium text-sm transition-colors"
                onClick={(e) => e.stopPropagation()} 
            >
                View on IMDb
            </a>
        </div>
    </motion.div>
  );

  const SocialLink = ({ Icon, href, color }) => (
    <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        whileHover={{ scale: 1.2, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className={`text-gray-400 ${color} transition-all duration-300`}
    >
        <Icon size={14} className="w-4 h-4" />
    </motion.a>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter w-full">
      <div className="w-full mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 xs:py-5 sm:py-6">
        
        {/* Header Section */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center mb-6 xs:mb-8 pt-2 xs:pt-4 tracking-wider"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 break-words">
            {viewingHistory ? "Viewing History" : "Movie List"}
          </span>
        </motion.h2>

        {/* Control Buttons */}
        <div className="flex flex-col xs:flex-row justify-center items-center mb-6 xs:mb-8 sm:mb-10 space-y-3 xs:space-y-0 xs:space-x-3 sm:space-x-4 max-w-xl mx-auto">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setViewingHistory(!viewingHistory)}
            className="px-4 xs:px-5 sm:px-6 py-2 xs:py-3 flex items-center bg-indigo-600 text-white rounded-lg xs:rounded-xl shadow-lg shadow-indigo-600/50 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.03] font-semibold text-sm xs:text-base w-full xs:w-auto justify-center"
          >
            {viewingHistory ? (
              <>
                <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
                View Movie List
              </>
            ) : (
              <>
                <History className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
                View History ({history.length})
              </>
            )}
          </motion.button>

          {viewingHistory && history.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handleClearHistory}
              className="px-4 xs:px-5 sm:px-6 py-2 xs:py-3 flex items-center bg-red-600 text-white rounded-lg xs:rounded-xl shadow-lg shadow-red-600/50 hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.03] font-semibold text-sm xs:text-base w-full xs:w-auto justify-center"
            >
              <Trash className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
              Clear History
            </motion.button>
          )}
        </div>

        {/* Search Query Display */}
        {searchQuery && !viewingHistory && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-base xs:text-lg text-gray-400 mb-4 xs:mb-5 sm:mb-6"
          >
            Showing results for: "<span className="text-yellow-400 font-bold">{searchQuery}</span>"
          </motion.p>
        )}

        {/* Movies Grid */}
        <div className="w-full">
          {displayedMovies.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center col-span-full text-gray-400 text-lg xs:text-xl py-8 xs:py-10 sm:py-12 bg-gray-800 rounded-xl shadow-inner"
            >
              {viewingHistory ? (
                <>
                  <History className="w-6 h-6 xs:w-8 xs:h-8 mx-auto mb-2 xs:mb-3 text-gray-500" />
                  No movies in the history.
                </>
              ) : (
                <>
                  <Film className="w-6 h-6 xs:w-8 xs:h-8 mx-auto mb-2 xs:mb-3 text-gray-500" />
                  No movies found matching "{searchQuery}".
                </>
              )}
            </motion.p>
          ) : (
            <div className={`grid gap-4 xs:gap-5 sm:gap-6 ${
              viewingHistory 
                ? 'grid-cols-1 lg:grid-cols-2' 
                : 'grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {displayedMovies.map((movie, index) => (
                viewingHistory ? (
                  <HistoryItemCard key={movie.id} movie={movie} />
                ) : (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleClick(movie)}
                    className="bg-gray-800 rounded-lg xs:rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer border border-gray-700 hover:border-pink-500"
                  >
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x600/1f2937/9ca3af?text=POSTER+N%2FA"; }}
                      className="w-full h-48 xs:h-56 sm:h-64 object-cover object-center"
                    />
                    <div className="p-3 xs:p-4">
                      <h3 className="text-base xs:text-lg text-white font-bold truncate">{movie.title}</h3>
                      <p className="text-gray-400 text-xs xs:text-sm mt-1 line-clamp-3">{movie.overview}</p>
                      <a
                        href={movie.imdb_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 mt-2 block font-medium text-right transition-colors text-xs xs:text-sm"
                        onClick={(e) => e.stopPropagation()} 
                      >
                        View on IMDb
                        <Star className="w-3 h-3 xs:w-4 xs:h-4 ml-1 inline-block text-yellow-400 fill-yellow-400" />
                      </a>
                  </div>
                  </motion.div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 xs:mt-10 sm:mt-12 py-6 xs:py-8 border-t-2 border-gray-700/50 text-gray-400 w-full"
        >
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 mb-4 xs:mb-5 sm:mb-6 w-full">
            
            <div className="w-full">
              <h4 className="text-base xs:text-lg sm:text-xl font-black text-white mb-1 xs:mb-2 break-words">MOVIES HUB</h4>
              <p className="text-xs xs:text-sm break-words">Your digital guide to cinematic exploration. Created with React & Tailwind.</p>
            </div>
            
            <div className="w-full">
              <h4 className="text-base xs:text-lg sm:text-xl font-black text-white mb-1 xs:mb-2 break-words">Quick Links</h4>
              <ul className="space-y-1 xs:space-y-2">
                <li><Link to="/" className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">Home</Link></li>
                <li><Link to="/movies" className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">Movies</Link></li>
                <li><Link to="/about" className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">About</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">Contact Us</Link></li>
              </ul>
            </div>
            
            <div className="w-full">
              <h4 className="text-base xs:text-lg sm:text-xl font-black text-white mb-1 xs:mb-2 break-words">Legal</h4>
              <ul className="space-y-1 xs:space-y-2">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">Terms of Use</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition text-xs xs:text-sm break-words">Cookie Settings</a></li>
              </ul>
            </div>
            
            <div className="w-full flex flex-col items-start">
              <h4 className="text-base xs:text-lg sm:text-xl font-black text-white mb-1 xs:mb-2 break-words">Connect</h4>
              <p className="text-xs xs:text-sm text-gray-400 mb-2 xs:mb-3 break-words">Join our newsletter for the latest movie news and updates.</p>
              
              <MotionLink
                to="/register" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-3 xs:px-4 py-1 xs:py-2 bg-indigo-600 text-white font-bold rounded-full text-xs xs:text-sm hover:bg-indigo-700 transition duration-300 break-words mb-2 xs:mb-3 text-center inline-block"
              >
                <Mail className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 inline" />
                Sign Up Now
              </MotionLink>

              <div className="flex space-x-2 xs:space-x-3 w-full justify-start">
                <SocialLink Icon={FaFacebookF} href="https://facebook.com" color="hover:text-blue-500" />
                <SocialLink Icon={FaTwitter} href="https://twitter.com" color="hover:text-cyan-400" />
                <SocialLink Icon={FaInstagram} href="https://instagram.com" color="hover:text-pink-500" />
                <SocialLink Icon={FaLinkedinIn} href="https://linkedin.com" color="hover:text-blue-700" />
              </div>
            </div>
          </div>
          
          <div className="text-center pt-3 xs:pt-4 border-t border-gray-700/50 mt-3 xs:mt-4 w-full">
            <p className="text-xs xs:text-sm break-words flex items-center justify-center">
              <Copyright className="w-3 h-3 mr-1" />
              {new Date().getFullYear()} Movie Hub. All rights reserved. Data powered by IMDb.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
