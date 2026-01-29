import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Settings, Search, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AppShell({ children, onSearchChange, searchValue, resultsCount }) {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="flex h-16 items-center justify-between px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 font-bold text-xl group transition-all duration-300 active:scale-95">
                        <div className="bg-primary p-1.5 rounded-lg shadow-primary/20 shadow-lg group-hover:rotate-6 transition-transform">
                            <Map className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="tracking-tight text-foreground/90">LODO <span className="text-primary">Map</span></span>
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
                        {!isAdmin ? (
                            <Link to="/admin">
                                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-colors">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/">
                                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/5 hover:text-primary transition-colors">
                                    <Map className="h-4 w-4 mr-2" />
                                    Ir al Mapa
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
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    );
}
