import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    // Verificar token al cargar
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Token inválido
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('auth_token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al iniciar sesión');
        }

        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (email, password, name) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al registrarse');
        }

        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
        }
    };

    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
