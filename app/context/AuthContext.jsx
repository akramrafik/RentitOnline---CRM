'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, login, logout } from '@/lib/api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);  // Added error state

    useEffect(() => {
        getUser()
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const signIn = async (email, password) => {
        setAuthError(null);  // Clear previous errors
        setLoading(true);  // Set loading state
        try {
            await login(email, password);
            const res = await getUser();
            setUser(res.data);
        } catch (err) {
            console.error(err);
            setAuthError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setAuthError(null);  
        setLoading(true); 
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed', err);
            setAuthError('An error occurred while logging out');
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading, authError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
