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
        className="relative cursor-pointer rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-700 hover:border-pink-500 transition duration-500 min-h-[60px] sm:min-h-[80px]"
        onClick={() => openImdbLink(movie.imdb_link)}
    >
        <div className="flex items-center space-x-2 sm:space-x-3 h-full">
            <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-14 h-18 sm:w-16 sm:h-20 object-cover flex-shrink-0 rounded-l-xl"
                loading="lazy"
            />
            <div className="p-1 sm:p-2 flex-grow min-w-0 flex flex-col justify-center">
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">{movie.title}</h3>
                <p className="text-2xs sm:text-xs md:text-sm text-pink-400 mt-0.5">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </p>
            </div>
        </div>
    </motion.div>
);

const MovieCard = ({ movie }) => (
    <motion.div
        variants={CardVariants}
        whileHover="hover"
        className={`rounded-xl overflow-hidden shadow-xl bg-gray-900 transition duration-300 border border-gray-800 hover:border-indigo-600 cursor-pointer w-full`} 
        onClick={() => openImdbLink(movie.imdb_link)}
    >
        <img
            src={movie.poster_path}
            alt={movie.title}
            className={`w-full object-cover transition duration-300 h-52 md:h-64`} 
            loading="lazy"
        />
        <div className="p-2 sm:p-3 text-center min-h-[70px] flex flex-col justify-center">
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate px-1">{movie.title}</h3>
            <p className="text-2xs sm:text-xs md:text-sm text-gray-400 mt-1">
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
        if (moviesData.length === 0) return;
        
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

        const topRatedList = shuffled.slice(0, 4); 
        setTopRatedMovies(topRatedList);

        const trendingList = shuffled.slice(4, 8); 
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
            className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden w-full" 
        >
            <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
                
                <section className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 w-full">
                    
                    <div className="lg:flex-[2] w-full relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)] bg-gray-900">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={featuredMovie.id}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 1.0 }}
                                className="relative cursor-pointer w-full"
                                onClick={() => openImdbLink(featuredMovie.imdb_link)}
                            >
                                <img
                                    src={featuredMovie.poster_path}
                                    alt={featuredMovie.title}
                                    className="w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[550px] xl:h-[600px] object-cover rounded-2xl sm:rounded-3xl brightness-75 hover:brightness-90 transition duration-700"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-end">
                                    <div className="p-3 sm:p-4 backdrop-blur-sm bg-black/40 rounded-xl w-full max-w-full">
                                        <motion.h2
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl leading-tight break-words"
                                        >
                                            {featuredMovie.title}
                                        </motion.h2>
                                        
                                        <motion.p
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 0.9 }}
                                            transition={{ delay: 0.6 }}
                                            className="mt-2 sm:mt-3 text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-3 w-full max-w-full"
                                        >
                                            {featuredMovie.overview}
                                        </motion.p>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: '#4f46e5' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                openImdbLink(featuredMovie.imdb_link);
                                            }}
                                            className="mt-3 sm:mt-4 md:mt-6 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-indigo-600 text-white font-bold rounded-full shadow-xl shadow-indigo-600/40 hover:bg-indigo-700 transition duration-300 tracking-widest text-xs sm:text-sm md:text-base w-full sm:w-auto"
                                        >
                                            <i className="ph-bold ph-arrow-square-out mr-2"></i> View on IMDb
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex space-x-2 bg-black/50 p-2 sm:p-3 rounded-full z-10">
                                    {moviesForSlider.map((_, index) => (
                                        <motion.div
                                            key={index}
                                            className={`cursor-pointer transition-all duration-500 rounded-full ${
                                                currentIndex === index ? 'bg-pink-500' : 'bg-gray-400/50'
                                            }`}
                                            style={{
                                                width: currentIndex === index ? '20px' : '10px',
                                                height: '10px'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFeaturedMovie(moviesForSlider[index]);
                                                setCurrentIndex(index);
                                            }}
                                        />
                                    ))}
                            </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="lg:flex-[1] flex flex-col gap-3 sm:gap-4 md:gap-5 bg-gray-900 p-3 sm:p-4 md:p-5 lg:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-800 lg:max-h-[550px] lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-thumb-gray-700 lg:scrollbar-track-gray-900">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-indigo-400 mb-2 sm:mb-3 md:mb-4 border-b-2 border-gray-700 pb-2 sm:pb-3 sticky top-0 bg-gray-900 z-10">
                            ⭐ TOP PICKS
                        </h3>
                        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                            {otherMovies.map((movie) => (
                                <SuggestedMovieItem key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </div>
                </section>
                
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 1.0 }}
                    className="mt-12 sm:mt-16 md:mt-20 w-full"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-pink-400 mb-4 sm:mb-5 md:mb-6 border-b-2 sm:border-b-3 md:border-b-4 border-pink-700/50 pb-2 sm:pb-3 md:pb-4">
                        🏆 Top Rated Movies
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-4 sm:pb-5">
                        {topRatedMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} /> 
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 1.0, delay: 0.3 }}
                    className="mt-12 sm:mt-16 md:mt-20 w-full"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-indigo-400 mb-4 sm:mb-5 md:mb-6 border-b-2 sm:border-b-3 md:border-b-4 border-indigo-700/50 pb-2 sm:pb-3 md:pb-4">
                        🎬 Trending Now
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-4 lg:pb-0"> 
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
                    className="mt-12 sm:mt-16 md:mt-20 bg-gradient-to-r from-indigo-800 to-purple-900 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl text-center w-full"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 text-white break-words">Find Your Next Obsession!</h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-indigo-200 mb-4 sm:mb-5 md:mb-6 break-words">Explore the full catalog of thousands of movies and TV shows.</p>
                    
                    <motion.a
                        href="https://www.imdb.com/?ref_=tt_nv_home"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-pink-500 text-white font-black rounded-full shadow-lg shadow-pink-500/50 hover:bg-pink-600 transition duration-300 uppercase tracking-widest text-xs sm:text-sm md:text-base inline-block cursor-pointer break-words"
                    >
                        <i className="ph-bold ph-magnifying-glass-plus mr-2"></i> Start Discovering
                    </motion.a>
                </motion.section>

                <footer className="mt-12 sm:mt-16 md:mt-20 py-6 sm:py-8 border-t-2 sm:border-t-3 border-gray-700/50 text-gray-400 w-full">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 w-full">
                        
                        <div className="w-full">
                            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3 break-words">MOVIES HUB</h4>
                            <p className="text-xs sm:text-sm md:text-base break-words">Your digital guide to cinematic exploration. Created with React & Tailwind.</p>
                        </div>
                        
                        <div className="w-full">
                            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3 break-words">Quick Links</h4>
                            <ul className="space-y-1 sm:space-y-2">
                                <li><Link to="/" className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Home</Link></li>
                                <li><Link to="/discover" className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Discover</Link></li>
                                <li><Link to="/favorites" className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Favorites</Link></li>
                                <li><Link to="/contact" className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Contact Us</Link></li>
                            </ul>
                        </div>
                        
                        <div className="w-full">
                            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3 break-words">Legal</h4>
                            <ul className="space-y-1 sm:space-y-2">
                                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Terms of Use</a></li>
                                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Privacy Policy</a></li>
                                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition text-xs sm:text-sm md:text-base break-words">Cookie Settings</a></li>
                            </ul>
                        </div>
                        
                        <div className="w-full flex flex-col items-start">
                            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3 break-words">Connect</h4>
                            <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-2 sm:mb-3 break-words">Join our newsletter for the latest movie news and updates.</p>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert("Sign Up functionality coming soon!");
                                }}
                                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-bold rounded-full text-xs sm:text-sm md:text-base hover:bg-indigo-700 transition duration-300 break-words"
                            >
                                <i className="ph-bold ph-envelope-open-simple mr-2"></i> Sign Up Now
                            </motion.button>

                            <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4 w-full justify-start">
                                <motion.a href="#" whileHover={{ scale: 1.3, color: '#3b82f6' }} className="text-gray-400 transition">
                                    <i className="ph-bold ph-facebook-logo text-xl sm:text-2xl"></i>
                                </motion.a>
                                <motion.a href="#" whileHover={{ scale: 1.3, color: '#ec4899' }} className="text-gray-400 transition">
                                    <i className="ph-bold ph-instagram-logo text-xl sm:text-2xl"></i>
                                </motion.a>
                                <motion.a href="#" whileHover={{ scale: 1.3, color: '#38bdf8' }} className="text-gray-400 transition">
                                    <i className="ph-bold ph-twitter-logo text-xl sm:text-2xl"></i>
                                </motion.a>
                                <motion.a href="#" whileHover={{ scale: 1.3, color: '#f87171' }} className="text-gray-400 transition">
                                    <i className="ph-bold ph-youtube-logo text-xl sm:text-2xl"></i>
                                </motion.a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center pt-4 sm:pt-6 border-t border-gray-700/50 mt-4 sm:mt-6 w-full">
                        <p className="text-xs sm:text-sm md:text-base break-words">&copy; {new Date().getFullYear()} Movies Hub. All rights reserved. Design fully responsive on all devices.</p>
                    </div>
                </footer>
            </div>
        </motion.div>
    );
}