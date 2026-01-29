import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, Menu, X, LogIn, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    if (!isHome) return null;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className={`flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-300 ${isScrolled
                            ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl'
                            : 'bg-transparent border-transparent'
                        }`}
                >
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-xl">L</div>
                        <span className="text-xl font-bold text-white tracking-tight">LODO</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Admin Link - Solo visible para admins */}
                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/admin')}
                                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                            >
                                <Settings className="w-4 h-4" />
                                Admin
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/map')}
                            className="px-5 py-2.5 bg-white text-black rounded-xl font-bold text-sm flex items-center transition-all"
                        >
                            <Map className="w-4 h-4 mr-2" />
                            VER MAPA
                        </motion.button>

                        {/* Auth Button */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-400 flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {user?.name}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-zinc-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsLoginOpen(true)}
                                className="px-4 py-2 bg-primary text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Iniciar Sesión
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 px-6 pt-4 pb-8 md:hidden"
                    >
                        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                            {/* Admin Link Mobile */}
                            {isAdmin && (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/admin');
                                    }}
                                    className="text-lg font-medium text-emerald-400 flex items-center gap-2"
                                >
                                    <Settings className="w-5 h-5" />
                                    Panel Admin
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate('/map');
                                }}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center"
                            >
                                <Map className="w-5 h-5 mr-2" />
                                VER MAPA
                            </button>

                            {/* Auth Button Mobile */}
                            {isAuthenticated ? (
                                <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                                    <span className="text-sm text-zinc-400 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {user?.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="w-full py-3 bg-zinc-800 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsLoginOpen(true);
                                    }}
                                    className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Iniciar Sesión
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </nav>
    );
};

export default NavBar;
