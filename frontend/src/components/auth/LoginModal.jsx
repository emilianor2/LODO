import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LogIn, UserPlus, Loader2, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginModal({ isOpen, onClose }) {
    const { login, register } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                await register(formData.email, formData.password, formData.name);
                toast.success('¡Cuenta creada exitosamente!');
            } else {
                await login(formData.email, formData.password);
                toast.success('¡Bienvenido!');
            }
            onClose();
            setFormData({ email: '', password: '', name: '' });
        } catch (error) {
            toast.error(error.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setFormData({ email: '', password: '', name: '' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        {isRegister ? (
                            <>
                                <UserPlus className="h-6 w-6 text-primary" />
                                Crear Cuenta
                            </>
                        ) : (
                            <>
                                <LogIn className="h-6 w-6 text-primary" />
                                Iniciar Sesión
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {isRegister && (
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required={isRegister}
                                className="h-11"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                            className="h-11"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 font-bold"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : isRegister ? (
                            <UserPlus className="h-4 w-4 mr-2" />
                        ) : (
                            <LogIn className="h-4 w-4 mr-2" />
                        )}
                        {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        {isRegister ? (
                            <>¿Ya tienes cuenta? <span className="font-semibold text-primary">Inicia sesión</span></>
                        ) : (
                            <>¿No tienes cuenta? <span className="font-semibold text-primary">Regístrate</span></>
                        )}
                    </button>
                </div>

                {/* Demo credentials removed */}
            </DialogContent>
        </Dialog>
    );
}
