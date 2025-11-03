// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- მუდმივები (Constants) ---
const USER_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_KEY = 'currentUser'; 

// --- Mock ფუნქციები (პაროლის სიმულაციური დაშიფვრა/გაშიფვრა) ---
const mockEncrypt = (password) => btoa(password);
const mockDecrypt = (encrypted) => atob(encrypted);

// --- დამხმარე ფუნქცია: Local Storage-დან წაკითხვა ---
const readUserFromLocalStorage = () => {
    try {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error reading from Local Storage:", error);
        return null;
    }
};

// 1. Auth Context-ის შექმნა
const AuthContext = createContext(null);

// 2. Auth Provider კომპონენტი: ეს მართავს მდგომარეობას გლობალურად
export const AuthProvider = ({ children }) => {
    // ⭐️ მდგომარეობის ინიციალიზება: იწყება Local Storage-ის მონაცემებით
    const [user, setUser] = useState(readUserFromLocalStorage);

    // ფუნქცია Local Storage-ის ჩასაწერად
    const updateLocalStorage = useCallback((newUser) => {
        if (newUser) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    }, []);

    // 2. ეფექტი: React-ის 'user' მდგომარეობის სინქრონიზაცია Local Storage-თან
    useEffect(() => {
        updateLocalStorage(user);
    }, [user, updateLocalStorage]);

    // 3. ეფექტი: Storage Event Listener (სინქრონიზაცია სხვა ტაბებიდან)
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === CURRENT_USER_KEY) {
                setUser(readUserFromLocalStorage());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // --- ავტორიზაციის ლოგიკა ---

    const register = (username, password, email) => {
        let storedUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        if (storedUsers.some(u => u.email === email)) {
            return { success: false, message: "User with this email already exists." };
        }

        const newUser = { username, email, password: mockEncrypt(password) };
        storedUsers.push(newUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(storedUsers));
        
        // ⭐️ მდგომარეობის განახლება
        setUser({ username, email }); 
        return { success: true, message: "Registration successful! You are now logged in." };
    };

    const login = (email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
        const foundUser = storedUsers.find(u => u.email === email);
        
        if (!foundUser) {
            return { success: false, message: "Invalid email or password." };
        }

        const decryptedPassword = mockDecrypt(foundUser.password);
        if (decryptedPassword === password) {
            // ⭐️ წარმატებული შესვლა: მდგომარეობის განახლება
            setUser({ username: foundUser.username, email: foundUser.email }); 
            return { success: true, message: "Login successful!" };
        } else {
            return { success: false, message: "Invalid email or password." };
        }
    };

    const logout = () => {
        // ⭐️ გასვლა: მდგომარეობის დაყენება null-ზე
        setUser(null);
    };

    const contextValue = {
        user,
        register,
        login,
        logout,
        isAuthenticated: !!user, // ჭეშმარიტია, თუ user ობიექტი არსებობს
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook-ი, რომელიც კომპონენტებს მისცემს წვდომას
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        // ეს უზრუნველყოფს, რომ Hook-ი მხოლოდ Provider-ის შიგნით გამოიყენება
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};