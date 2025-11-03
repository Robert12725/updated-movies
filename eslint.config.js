import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import moviesData from "../Data/movies.json"; 

const CardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, y: -5, boxShadow: "0 15px 45px rgba(139, 92, 246, 0.7)" },
};

const openImdbLink = (imdbLink) => {
    if (imdbLink) {
        window.open(imdbLink, '_blank', 'noopener,noreferrer'); 
    }
};

const SuggestedMovieItem = ({ movie }) => (
  <motion.div
    variants={CardVariants}
    whileHover="hover"
    transition={{ duration: 0.3 }}
    className="relative cursor-pointer rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-700 hover:border-pink-500 transition duration-500"
    onClick={() => openImdbLink(movie.imdb_link)}
  >
    <div className="flex items-center space-x-3"> {/* ოპტიმიზირებულია space-x-3-მდე */}
      <img
        src={movie.poster_path}
        alt={movie.title}
        className="w-14 h-20 object-cover flex-shrink-0 rounded-l-xl" {/* ოპტიმიზირებულია w-14 h-20-მდე */}
        loading="lazy"
      />
      <div className="p-1 flex-grow min-w-0"> {/* ოპტიმიზირებულია p-1-მდე */}
        <h3 className="text-white font-bold text-xs sm:text-base truncate">{movie.title}</h3> {/* text-xs მობილურისთვის */}
        <p className="text-xs text-pink-400 mt-1">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </p>
      </div>
    </div>
  </motion.div>
);

const MovieCard = ({ movie, isHorizontal = false }) => (
  <motion.div
    variants={CardVariants}
    whileHover="hover"
    className={`rounded-xl overflow-hidden shadow-xl bg-gray-900 transition duration-300 border border-gray-800 hover:border-indigo-600 cursor-pointer ${
        isHorizontal ? 'w-36 sm:w-48 flex-shrink-0' : 'w-full' /* ოპტიმიზირებულია w-36-მდე */
    }`}
    onClick={() => openImdbLink(movie.imdb_link)}
  >
      <img
        src={movie.poster_path}
        alt={movie.title}
        className={`w-full object-cover ${isHorizontal ? 'h-56 sm:h-64' : 'h-64 sm:h-72'}`}
        loading="lazy"
      />
      <div className="p-3 text-center">
        <h3 className="text-sm sm:text-lg font-bold text-white truncate">{movie.title}</h3>
        <p className="text-xs text-gray-400 mt-1">
          {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
        </p>
      </div>
  </motion.div>
);

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [otherMovies, setOtherMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [moviesForSlider, setMoviesForSlider] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const sortedByRating = [...moviesData].sort((a, b) => b.vote_average - a.vote_average);
    const shuffled = [...moviesData].sort(() => 0.5 - Math.random());
    
    const usedMovieIds = new Set();
    
    const topSliderMovies = sortedByRating.slice(0, 6);
    topSliderMovies.forEach(m => usedMovieIds.add(m.id));
    setMoviesForSlider(topSliderMovies);
    setFeaturedMovie(topSliderMovies[0] || null);

    const sidebarMovies = shuffled.filter(m => !usedMovieIds.has(m.id)).slice(0, 5);
    sidebarMovies.forEach(m => usedMovieIds.add(m.id));
    setOtherMovies(sidebarMovies); 

    const topRatedList = sortedByRating.filter(m => !usedMovieIds.has(m.id)).slice(0, 10);
    topRatedList.forEach(m => usedMovieIds.add(m.id));
    setTopRatedMovies(topRatedList); 

    const trendingList = shuffled.filter(m => !usedMovieIds.has(m.id)).slice(0, 12);
    setTrendingMovies(trendingList); 

  }, []);

  useEffect(() => {
    if (moviesForSlider.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % moviesForSlider.length;
        setFeaturedMovie(moviesForSlider[nextIndex]);
        return nextIndex;
      });
    }, 6000); 

    return () => clearInterval(interval);
  }, [moviesForSlider]);

  if (!featuredMovie) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-950 text-white p-4 sm:p-8 font-sans"
    >
      <div className="max-w-7xl mx-auto max-w-full"> {/* დამატებულია max-w-full */}
        
        <section className="flex flex-col lg:flex-row gap-8 mb-20">

          <div className="lg:flex-[2] relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)] bg-gray-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredMovie.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 1.0 }}
                className="relative cursor-pointer"
              >
                
                  <img
                    src={featuredMovie.poster_path}
                    alt={featuredMovie.title}
                    className="w-full h-72 sm:h-[32rem] md:h-[40rem] object-cover rounded-3xl brightness-[.70] hover:brightness-[.80] transition duration-700" /* h-72 მობილურისთვის */
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                    <div className="p-3 backdrop-blur-sm bg-black/10 rounded-lg">
                      <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight"
                      >
                        {featuredMovie.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.8 }}
                        transition={{ delay: 0.6 }}
                        className="mt-2 text-gray-300 line-clamp-2 text-base max-w-4xl hidden md:block"
                      >
                        {featuredMovie.overview}
                      </motion.p>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#4f46e5' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault(); 
                            openImdbLink(featuredMovie.imdb_link);
                        }}
                        className="mt-4 sm:mt-8 px-8 py-3 sm:px-10 sm:py-4 bg-indigo-600 text-white font-bold rounded-full shadow-xl shadow-indigo-600/40 hover:bg-indigo-700 transition duration-300 uppercase tracking-widest text-sm sm:text-lg"
                      >
                        <i className="ph-bold ph-arrow-square-out mr-3"></i> IMDb-ზე ნახვა
                      </motion.button>
                    </div>
                  </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:w-1/3 flex flex-col gap-4 sm:gap-5 bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-2xl border border-gray-800">
            <h3 className="text-xl sm:text-2xl font-black text-indigo-400 mb-2 border-b-2 border-gray-700 pb-3">
                ⭐ TOP PICKS
            </h3>
            <div className="flex flex-col gap-4">
                {otherMovies.map((movie) => (
                    <SuggestedMovieItem key={movie.id} movie={movie} />
                ))}
            </div>
          </div>
        </section>
        
        <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0 }}
            className="mt-20"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-pink-400 mb-6 border-b-4 border-pink-700/50 pb-3">
            🏆 Top Rated Movies
          </h2>
          <div className="flex space-x-4 sm:space-x-6 overflow-x-scroll pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {topRatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isHorizontal={true} />
            ))}
          </div>
        </motion.section>

        <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="mt-20"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-indigo-400 mb-6 border-b-4 border-indigo-700/50 pb-3">
            🎬 Trending Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </motion.section>
        
        <motion.section 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 bg-gradient-to-r from-indigo-800 to-purple-900 p-8 sm:p-12 rounded-3xl shadow-2xl text-center"
        >
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white">Find Your Next Obsession!</h2>
            <p className="text-base sm:text-xl text-indigo-200 mb-6">Explore the full catalog of thousands of movies and TV shows.</p>
            
            <motion.a
                href="https://www.imdb.com/?ref_=tt_nv_home"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 1 }}
                whileTap={{ scale: 0.9 }}
                className="px-8 py-3 sm:px-12 sm:py-4 bg-pink-500 text-white font-black rounded-full shadow-lg shadow-pink-500/50 hover:bg-pink-600 transition duration-300 uppercase tracking-widest text-sm sm:text-lg inline-block cursor-pointer"
            >
                <i className="ph-bold ph-magnifying-glass-plus mr-3"></i> Start Discovering
            </motion.a>
        </motion.section>

        <footer className="mt-24 py-10 border-t-4 border-gray-700/50 text-gray-400">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                
                <div>
                    <h4 className="text-xl font-black text-white mb-4">MOVIES HUB</h4>
                    <p className="text-sm">Your digital guide to cinematic exploration. Created with React & Tailwind.</p>
                </div>
                
                <div>
                    <h4 className="text-xl font-black text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-indigo-400 transition">Home</Link></li>
                        <li><Link to="/discover" className="hover:text-indigo-400 transition">Discover</Link></li>
                        <li><Link to="/favorites" className="hover:text-indigo-400 transition">Favorites</Link></li>
                        <li><Link to="/contact" className="hover:text-indigo-400 transition">Contact Us</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-xl font-black text-white mb-4">Legal</h4>
                    <ul className="space-y-2">
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition">Terms of Use</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition">Privacy Policy</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition">Cookie Settings</a></li>
                    </ul>
                </div>
                
                <div className="flex flex-col items-start">
                    <h4 className="text-xl font-black text-white mb-4">Connect</h4>
                    <p className="text-sm text-gray-400 mb-4">Join our newsletter for the latest movie news and updates.</p>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault(); 
                            alert("Sign Up functionality coming soon!");
                        }}
                        className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-full text-sm hover:bg-indigo-700 transition duration-300"
                    >
                        <i className="ph-bold ph-envelope-open-simple mr-2"></i> Sign Up Now
                    </motion.button>

                    <div className="flex space-x-4 mt-6">
                        <motion.a href="#" whileHover={{ scale: 1.3, color: '#3b82f6' }} className="text-gray-400 transition">
                            <i className="ph-bold ph-facebook-logo text-2xl"></i>
                        </motion.a>
                        <motion.a href="#" whileHover={{ scale: 1.3, color: '#ec4899' }} className="text-gray-400 transition">
                            <i className="ph-bold ph-instagram-logo text-2xl"></i>
                        </motion.a>
                        <motion.a href="#" whileHover={{ scale: 1.3, color: '#38bdf8' }} className="text-gray-400 transition">
                            <i className="ph-bold ph-twitter-logo text-2xl"></i>
                        </motion.a>
                        <motion.a href="#" whileHover={{ scale: 1.3, color: '#f87171' }} className="text-gray-400 transition">
                            <i className="ph-bold ph-youtube-logo text-2xl"></i>
                        </motion.a>
                    </div>
                </div>
            </div>
            
            <div className="text-center pt-8 border-t border-gray-700/50 mt-8">
                <p className="text-sm">&copy; {new Date().getFullYear()} Movies Hub. All rights reserved. Design fully responsive on all devices.</p>
            </div>
        </footer>
      </div>
    </motion.div>
  );
}