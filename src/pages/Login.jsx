import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; 
import { Mail, Lock } from "lucide-react"; // ⬅️ შესწორებული იმპორტი

// იმპორტი თქვენი ახალი AuthContext.jsx ფაილიდან
import { useAuth } from '../contexts/AuthContext'; 

export default function Login() {
    const { login, user } = useAuth(); 
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        if (user && !isError) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 100); 

            return () => clearTimeout(timer);
        }
    }, [user, isError, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false); 
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500)); 

        const result = login(email, password); 

        setIsLoading(false);

        if (result.success) {
            setMessage(result.message + " Redirecting...");
        } else {
            setMessage(result.message);
            setIsError(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center p-4 sm:p-6 w-full h-full"
        >
            <div className="w-full max-w-md bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-indigo-700/50">
                <h2 className="text-3xl font-black text-white text-center mb-8">
                    🔑 Sign In to Your Account
                </h2>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 mb-4 rounded-lg font-medium text-center ${isError ? 'bg-red-700 text-red-100' : 'bg-green-700 text-green-100'}`}
                    >
                        {message}
                    </motion.div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <Mail size={20} className="absolute left-3 top-[37px] text-gray-500"/>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white transition duration-300"
                            placeholder="user@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <Lock size={20} className="absolute left-3 top-[37px] text-gray-500"/>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white transition duration-300"
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-8 py-3 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/40 transition duration-300 uppercase tracking-wider flex items-center justify-center space-x-2 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Logging In...</span>
                            </>
                        ) : (
                            <span>Login</span>
                        )}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-pink-400 hover:text-pink-300 font-medium transition duration-200">Register Here</Link>
                </p>
            </div>
        </motion.div>
    );
}

