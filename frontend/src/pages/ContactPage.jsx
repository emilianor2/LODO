import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        location: '',
        address: '',
        website: '',
        companyType: '',
        otherType: '',
        email: '',
        phone: ''
    });

    const companyOptions = [
        { value: 'AGTECH', label: 'AGTECH' },
        { value: 'FOODTECH', label: 'FOODTECH' },
        { value: 'CLIMATECH', label: 'CLIMATECH' },
        { value: 'CIRCULAR_ECONOMY', label: 'CIRCULAR ECONOMY' },
        { value: 'OTHER', label: 'OTRO' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelect = (val) => setForm(prev => ({ ...prev, companyType: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const type = form.companyType === 'OTHER' ? form.otherType : form.companyType;
        const body = `Nombre: ${form.firstName} ${form.lastName}\nEmpresa: ${form.companyName}\nTipo: ${type}\nUbicación: ${form.location}\nDirección: ${form.address}\nWebsite: ${form.website}\nEmail: ${form.email}\nTeléfono: ${form.phone}`;
        const mailto = `mailto:emilianor92@gmail.com?subject=${encodeURIComponent('Nuevo envío - Agregar Empresa LODO')}&body=${encodeURIComponent(body)}`;

        try {
            window.location.href = mailto;
            toast.success('Se abrió el cliente de correo para enviar la solicitud');
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('No se pudo abrir el cliente de correo. Copiando contenido al portapapeles.');
            navigator.clipboard?.writeText(body);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="w-full max-w-3xl bg-background/80 p-8 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">Agregar Empresa / Contacto</h1>
                    <p className="text-sm text-muted-foreground mb-6">Completa el formulario y se abrirá tu cliente de correo para enviar la solicitud.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label className="flex items-center gap-2">Nombre</Label>
                                <Input name="firstName" value={form.firstName} onChange={handleChange} required className="h-11" />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2">Apellido</Label>
                                <Input name="lastName" value={form.lastName} onChange={handleChange} required className="h-11" />
                            </div>
                        </div>

                        <div>
                            <Label>Nombre de la Empresa</Label>
                            <Input name="companyName" value={form.companyName} onChange={handleChange} required className="h-11" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label>Ubicación (Ciudad / País)</Label>
                                <Input name="location" value={form.location} onChange={handleChange} required className="h-11" />
                            </div>
                            <div>
                                <Label>Dirección</Label>
                                <Input name="address" value={form.address} onChange={handleChange} className="h-11" />
                            </div>
                        </div>

                        <div>
                            <Label>Website</Label>
                            <Input name="website" value={form.website} onChange={handleChange} placeholder="https://..." className="h-11" />
                        </div>

                        <div>
                            <Label>Tipo de Empresa</Label>
                            <Select onValueChange={handleSelect}>
                                <SelectTrigger className="bg-muted/30 h-11">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {companyOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {form.companyType === 'OTHER' && (
                            <div>
                                <Label>Otro (especificar)</Label>
                                <Input name="otherType" value={form.otherType} onChange={handleChange} className="h-11" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label>Email</Label>
                                <Input name="email" type="email" value={form.email} onChange={handleChange} required className="h-11" />
                            </div>
                            <div>
                                <Label>Teléfono</Label>
                                <Input name="phone" value={form.phone} onChange={handleChange} className="h-11" />
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground">Al enviar se abrirá tu cliente de correo para enviar la información a LODO.</div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button variant="ghost" onClick={() => navigate(-1)} disabled={loading}>Cancelar</Button>
                            <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}
