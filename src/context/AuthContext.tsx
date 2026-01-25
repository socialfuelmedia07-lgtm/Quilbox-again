import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    age: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (userData: User, token?: string) => void;
    logout: () => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Load user from localStorage on init
    useEffect(() => {
        const savedUser = localStorage.getItem('quilbox_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('quilbox_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('quilbox_user');
        localStorage.removeItem('token');
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            login,
            logout,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
