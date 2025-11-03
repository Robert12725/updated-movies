import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const mockEncrypt = (password) => btoa(password); 

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            const userExists = existingUsers.some(user => user.email === email);
            
            if (userExists) {
                setError("A user with this email is already registered.");
                return;
            }

            const newUser = {
                username: username,
                email: email,
                password: mockEncrypt(password)
            };

            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

            setMessage("Registration successful! You can now log in.");
            setUsername('');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError("An error occurred during registration. Please try again.");
            console.error(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center p-4 sm:p-6 w-full h-full"
        >
            <div className="w-full max-w-md bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-pink-700/50">
                <h2 className="text-3xl font-black text-white text-center mb-8">
                    👤 Create Your Account
                </h2>
                
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 mb-4 rounded-lg font-medium text-center bg-green-700 text-green-100"
                    >
                        {message}
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 mb-4 rounded-lg font-medium text-center bg-red-700 text-red-100"
                    >
                        {error}
                    </motion.div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <User size={20} className="absolute left-3 top-[37px] text-gray-500"/>
                        <input
                            type="text"
                            id="username"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-white transition duration-300"
                            placeholder="Choose a username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <Mail size={20} className="absolute left-3 top-[37px] text-gray-500"/>
                        <input
                            type="email"
                            id="email"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-white transition duration-300"
                            placeholder="user@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <Lock size={20} className="absolute left-3 top-[37px] text-gray-500"/>
                        <input
                            type="password"
                            id="password"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-white transition duration-300"
                            placeholder="Choose a secure password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full mt-8 py-3 bg-pink-600 text-white font-bold rounded-lg shadow-lg shadow-pink-600/40 hover:bg-pink-700 transition duration-300 uppercase tracking-wider"
                    >
                        Register
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition duration-200">Login Here</Link>
                </p>
            </div>
        </motion.div>
    );
}

