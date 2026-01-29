import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Settings, Search, LogIn, LogOut, User, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

export default function AppHeader({ onSearchChange, searchValue, resultsCount }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdminPage = location.pathname === '/admin';
    const isMapPage = location.pathname === '/map';
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <Map className="h-6 w-6 text-primary" />
                        <span>LODO Map</span>
                    </Link>

                    {/* Search (solo en mapa) */}
                    {!isAdminPage && onSearchChange && (
                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar organizaciones..."
                                    className="pl-10"
                                    value={searchValue || ''}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Right section */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {!isAdminPage && resultsCount !== undefined && (
                            <div className="text-sm text-muted-foreground hidden sm:block">
                                <span className="font-semibold text-foreground">{resultsCount}</span> resultados
                            </div>
                        )}

                        {/* En mapa: Volver al inicio / Cerrar mapa (admin y no admin) */}
                        {isMapPage && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="shrink-0"
                            >
                                <Home className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Volver al inicio</span>
                            </Button>
                        )}

                        {/* Admin button - SOLO visible para usuarios con rol admin */}
                        {isAdmin && !isAdminPage && (
                            <Link to="/admin">
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        )}

                        {/* En admin: volver al mapa */}
                        {isAdminPage && (
                            <Link to="/map">
                                <Button variant="outline" size="sm">
                                    <Map className="h-4 w-4 mr-2" />
                                    Mapa
                                </Button>
                            </Link>
                        )}

                        {/* Auth section */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground hidden sm:flex items-center gap-1 truncate max-w-[120px]">
                                    <User className="h-4 w-4 shrink-0" />
                                    {user?.name}
                                </span>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    <LogOut className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Salir</span>
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" onClick={() => setIsLoginOpen(true)}>
                                <LogIn className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Iniciar Sesión</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}
