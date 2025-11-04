import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

const formInitialState = {
  name: "",
  email: "",
  message: "",
};

const MessageStatus = ({ status, onClose }) => {
    const isSuccess = status === 'success';
    const Icon = isSuccess ? CheckCircle : XCircle;
    const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
    const messageText = isSuccess 
        ? "Your message has been successfully received. We will get back to you shortly!" 
        : "Failed to send message. Please check your network connection or try again.";

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`${bgColor} text-white p-6 rounded-xl shadow-2xl max-w-sm w-full relative z-10 transform`}>
                <div className="flex items-center space-x-3 mb-4">
                    <Icon className="w-8 h-8" />
                    <h3 className="text-xl font-bold">{isSuccess ? "Success!" : "Error"}</h3>
                </div>
                <p className="mb-4">{messageText}</p>
                <button
                    onClick={onClose}
                    className="w-full py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Close
                </button>
            </div>
        </motion.div>
    );
};


export default function Contact() {
  const [formData, setFormData] = useState(formInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log("Mock Submission Data:", formData);
    setSubmitStatus('success'); 
    setFormData(formInitialState);

    setIsSubmitting(false);
  };
  
  const handleReset = () => {
    setSubmitStatus(null);
    setFormData(formInitialState);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-16 px-4 relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>


      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-5xl w-full bg-gray-800 rounded-3xl shadow-2xl shadow-indigo-500/50 p-6 md:p-12 border border-indigo-700/50"
      >
        <header className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300">
              {submitStatus === 'success' ? 'Thank You for Reaching Out!' : 'Get in Touch'} 
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            {submitStatus === 'success' 
                ? "Your query has been successfully received. We appreciate your patience." 
                : "We're here to answer your questions and help you navigate the cinematic universe."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-1 space-y-8 p-4 border-b lg:border-b-0 lg:border-r border-indigo-700/50">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start space-x-4"
                >
                    <Mail className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-xl text-white">Email Us</h4>
                        <p className="text-gray-400">For general inquiries and support.</p>
                        <p className="text-yellow-300 font-medium">support@moviehub.com</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start space-x-4"
                >
                    <Phone className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-xl text-white">Call Us</h4>
                        <p className="text-gray-400">For partnership and media opportunities.</p>
                        <p className="text-yellow-300 font-medium">+995 568 42 60 13</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start space-x-4"
                >
                    <MapPin className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-xl text-white">Our Location</h4>
                        <p className="text-gray-400">We operate remotely, ensuring global support.</p>
                        <p className="text-yellow-300 font-medium">Digital Sphere, World</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-6"
                >
                    <h4 className="font-semibold text-xl text-white mb-3">Connect With Us</h4>
                    <div className="flex space-x-4">
                        <SocialLink Icon={FaFacebookF} href="https://www.facebook.com/robert.fasanidze.1" color="hover:text-blue-500" />
                        <SocialLink Icon={FaTwitter} href="https://twitter.com" color="hover:text-cyan-400" />
                        <SocialLink Icon={FaInstagram} href="https://instagram.com" color="hover:text-pink-500" />
                        <SocialLink Icon={FaLinkedinIn} href="https://linkedin.com" color="hover:text-blue-700" />
                    </div>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 flex flex-col justify-center items-center p-4 lg:p-0"
            >
                {submitStatus === 'success' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-8 md:p-12 bg-green-800/20 border-2 border-green-500 rounded-2xl max-w-lg w-full"
                    >
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-3">Success!</h3>
                        <p className="text-lg text-green-200 mb-6">
                            Your message was successfully sent! **Our team will contact you shortly** to address your inquiry.
                        </p>
                        <button
                            onClick={handleReset}
                            className="w-full sm:w-auto py-3 px-8 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Send Another Message
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6 w-full">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message or Inquiry"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 min-h-[150px]"
                                rows={5}
                                required
                            />
                            
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 
                                        ${isSubmitting 
                                            ? 'bg-indigo-600/50 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50'
                                        }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="ph-bold ph-circle-notch animate-spin"></i>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <span>Send Message</span>
                                )}
                            </motion.button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
      </motion.div>
      
      <footer className="z-10 mt-12 text-gray-500 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Movie Hub. All rights reserved. Data powered by IMDb.</p>
      </footer>
    </div>
  );
}

const SocialLink = ({ Icon, href, color }) => (
    <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        whileHover={{ scale: 1.2, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className={`text-gray-400 ${color} transition-all duration-300`}
        aria-label={href.includes('facebook') ? 'Facebook' : href.includes('twitter') ? 'Twitter' : href.includes('instagram') ? 'Instagram' : 'LinkedIn'}
    >
        <Icon size={24} />
    </motion.a>
);

const style = document.createElement('style');
style.textContent = `
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
`;
document.head.appendChild(style);
