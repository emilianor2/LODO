import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Map, Settings, Search, Menu, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AppShell({ children, onSearchChange, searchValue, resultsCount }) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const { isAdmin, isAuthenticated } = useAuth();

    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-[2200] w-full border-b bg-background/100 backdrop-blur-sm shadow-sm">
                <div
                    className={`flex ${
                        location.pathname.startsWith('/map')
                            ? 'h-[52px]'
                            : location.pathname.startsWith('/contacto') || location.pathname.startsWith('/admin')
                                ? 'h-16'
                                : 'h-10'
                    } items-center justify-between px-3`}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group transition-all duration-300 active:scale-95">
                        {location.pathname.startsWith('/map') ||
                        location.pathname.startsWith('/contacto') ||
                        location.pathname.startsWith('/admin') ? (
                            <img
                                src="/lodo1.png"
                                alt="LODO"
                                className={`object-contain ${
                                    location.pathname.startsWith('/contacto') || location.pathname.startsWith('/admin')
                                        ? 'h-[96px] w-[96px]'
                                        : 'h-20 w-20'
                                }`}
                            />
                        ) : (
                            <div className="p-0.5 rounded-lg shadow-primary/20 shadow-lg group-hover:rotate-6 transition-transform bg-transparent">
                                <img src="/lodo.png" alt="LODO" className="h-10 w-10 object-contain" />
                            </div>
                        )}
                    </Link>

                    {/* Search (visible on map page) */}
                    {!isAdmin && onSearchChange !== undefined && (
                        <div className="flex-1 max-w-xl mx-12 hidden md:block">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="search"
                                    placeholder="Buscar por nombre, etiquetas, sector..."
                                    className="pl-10 h-10 bg-muted/50 border-transparent focus:bg-background transition-all duration-200"
                                    value={searchValue || ''}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Right section */}
                    <div className="flex items-center gap-3">
                        {location.pathname.startsWith('/map') ? (
                            <Link to="/">
                                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-colors">
                                    <Home className="h-4 w-4 mr-2" />
                                    Volver al Inicio
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/map">
                                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-colors">
                                    <Map className="h-4 w-4 mr-2" />
                                    Ver Mapa
                                </Button>
                            </Link>
                        )}
                        {/* Add Company button for non-admin users on map page */}
                        {!isAdmin && isAuthenticated && location.pathname.startsWith('/map') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-colors"
                                onClick={() => navigate('/contacto')}
                            >
                                <Map className="h-4 w-4 mr-2" />
                                Agregar Empresa
                            </Button>
                        )}
                        {isAdmin && !isAdminRoute && (
                            <Link to="/admin">
                                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-colors">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        {/* Mobile menu (simulated) */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main
                className={`flex-1 relative ${
                    location.pathname.startsWith('/map') ? 'overflow-hidden' : 'overflow-y-auto'
                }`}
            >
                {children}
            </main>
        </div>
    );
}
