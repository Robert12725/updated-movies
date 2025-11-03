import { motion } from "framer-motion";
import { Film, Zap, Globe, Users, Send, Copyright } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
};

const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(79, 70, 229, 0.4)" }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-3 xs:p-4 sm:p-5 md:p-6 text-white w-full">
      {/* ⭐️ FIX: იგივე კონტეინერი რაც Home-ში */}
      <div className="w-full mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full bg-gray-800/95 backdrop-blur-sm rounded-2xl xs:rounded-3xl shadow-2xl shadow-indigo-500/30 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 border border-indigo-700/50"
        >
          {/* Main Title */}
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 xs:mb-8 sm:mb-10 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300 break-words">
              Welcome to the Movie Hub
            </span>
            <p className="text-xs xs:text-sm sm:text-base font-light text-indigo-400 mt-1 xs:mt-2">Where Technology Meets Cinematic Passion</p>
          </h2>

          {/* Section 1: Core Technology Showcase */}
          <motion.section 
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="mb-8 xs:mb-10 sm:mb-12"
          >
              <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-indigo-400 mb-3 xs:mb-4 sm:mb-5 flex items-center">
                  <Zap className="w-5 h-5 xs:w-6 xs:h-6 mr-2 xs:mr-3 text-yellow-400" />
                  Engineering Excellence
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm xs:text-base sm:text-lg border-l-2 xs:border-l-4 border-pink-500 pl-2 xs:pl-3 sm:pl-4 bg-gray-700/50 p-2 xs:p-3 sm:p-4 rounded-lg">
                  This dynamic platform is engineered using the cutting-edge MERN-stack architecture principles, focusing primarily on the **Frontend**. We utilize **React** and **Vite** for blazing fast performance, paired with **TailwindCSS** for rapid, utility-first styling. The entire experience is elevated by **Framer Motion**, delivering smooth, engaging, and professional-grade animations across every user interaction.
              </p>
          </motion.section>

          {/* Section 2: Key Features Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-8 xs:mb-10 sm:mb-12">
              
              <motion.div 
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="p-3 xs:p-4 sm:p-5 md:p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-lg text-center"
              >
                  <Globe className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 mx-auto text-pink-400 mb-2 xs:mb-3" />
                  <h4 className="font-bold text-lg xs:text-xl sm:text-xl mb-1 xs:mb-2 text-white">Dynamic Routing</h4>
                  <p className="text-xs xs:text-sm text-gray-400">Seamless navigation powered by React Router, ensuring a fluid single-page application experience.</p>
              </motion.div>

              <motion.div 
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="p-3 xs:p-4 sm:p-5 md:p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-lg text-center"
              >
                  <Film className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 mx-auto text-yellow-400 mb-2 xs:mb-3" />
                  <h4 className="font-bold text-lg xs:text-xl sm:text-xl mb-1 xs:mb-2 text-white">Real-Time Filtering</h4>
                  <p className="text-xs xs:text-sm text-gray-400">Instantly filter movie results directly from the URL query, enabling powerful header-based search.</p>
              </motion.div>

              <motion.div 
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="p-3 xs:p-4 sm:p-5 md:p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-lg text-center xs:col-span-2 lg:col-span-1"
              >
                  <Users className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 mx-auto text-indigo-400 mb-2 xs:mb-3" />
                  <h4 className="font-bold text-lg xs:text-xl sm:text-xl mb-1 xs:mb-2 text-white">Enhanced UX</h4>
                  <p className="text-xs xs:text-sm text-gray-400">Features like search history and viewing history are stored locally for a personalized user journey.</p>
              </motion.div>
          </div>

          {/* Section 3: Data Source (IMDb Promotion) */}
          <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9 }}
              className="mt-8 xs:mt-10 sm:mt-12 p-4 xs:p-5 sm:p-6 md:p-8 bg-indigo-900/40 rounded-xl border-t-2 xs:border-t-4 border-yellow-500"
          >
              <h3 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-yellow-300 mb-3 xs:mb-4 flex items-center">
                  <span className="text-3xl xs:text-4xl sm:text-5xl mr-1 xs:mr-2">i</span>
                  IMDb: The World's Authority on Film
              </h3>
              <p className="text-gray-200 leading-relaxed mb-3 xs:mb-4 text-sm xs:text-base">
                  Our database is powered by insights derived from **IMDb**, the most popular and authoritative source for movie and TV show content globally. We ensure the information you see is both accurate and comprehensive, covering everything from cast details to plot overviews and ratings.
              </p>
              <p className="text-gray-200 leading-relaxed mb-4 xs:mb-6 italic text-xs xs:text-sm">
                  IMDb is an Amazon company, and we respect the integrity and scope of their data licensing. This project is a demonstration of frontend capabilities, not an official IMDb application.
              </p>
          </motion.section>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row justify-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 mt-8 xs:mt-10">
              <motion.a
                  href="https://www.imdb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-extrabold shadow-xl shadow-yellow-500/30 transition-all duration-300 transform flex-shrink-0 text-center text-sm xs:text-base"
              >
                  Go to IMDb
              </motion.a>
              <motion.a
                  href="https://developer.imdb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-extrabold shadow-xl shadow-indigo-500/30 transition-all duration-300 transform flex-shrink-0 text-center text-sm xs:text-base"
              >
                  View IMDb API Docs
              </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="w-full mt-8 xs:mt-10 sm:mt-12 py-4 xs:py-5 sm:py-6 border-t border-indigo-700/50 text-center text-xs xs:text-sm text-gray-400"
        >
          <div className="flex flex-col xs:flex-row justify-center items-center xs:space-x-4 sm:space-x-6 space-y-2 xs:space-y-0 mb-2 xs:mb-3 text-sm xs:text-base">
            <a href="#" className="hover:text-pink-400 transition-colors text-xs xs:text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-pink-400 transition-colors text-xs xs:text-sm">Terms of Service</a>
            <a href="mailto:support@moviehub.ge" className="hover:text-pink-400 transition-colors flex items-center font-medium text-xs xs:text-sm">
                <Send className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 text-yellow-400" /> 
                support@moviehub.ge
            </a>
          </div>
          <p className="flex justify-center items-center text-gray-600 mt-2 xs:mt-3 text-2xs xs:text-xs">
            <Copyright className="w-3 h-3 mr-1" /> 
            {new Date().getFullYear()} Movie Hub. All Rights Reserved.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}