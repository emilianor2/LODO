import React, { useState, useEffect } from 'react';
import { useTaxonomies } from '../../context/TaxonomiesContext';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
    adminCreateOrganization as createOrganization,
    adminUpdateOrganization as updateOrganization,
    fetchOrganizationById as getOrganizationAdmin,
    adminGeocodeOrganization as geocodeOrganization
} from '../../services/api';
import { toast } from 'sonner';
import {
    Globe, MapPin, Info, Tag,
    Save, Search, X, Loader2,
    Link as LinkIcon, Calendar,
    MessageSquare, Briefcase, Plus,
    LayoutGrid, ShieldCheck, Mail, Phone,
    Instagram, Linkedin, Edit
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from '../../lib/utils';

export default function OrgFormDrawer({ isOpen, onClose, onCreated, editingOrg }) {
    const initialForm = {
        id: '',
        name: '',
        description: '',
        organizationType: '',
        sectorPrimary: '',
        sectorSecondary: '',
        stage: '',
        outcomeStatus: '',
        country: '',
        region: '',
        city: '',
        lat: '',
        lng: '',
        website: '',
        logoUrl: '',
        linkedinUrl: '',
        instagramUrl: '',
        contactEmail: '',
        contactPhone: '',
        yearFounded: '',
        notes: '',
        tags: [],
        technology: [],
        impactArea: [],
        badge: []
    };

    const { getOptions } = useTaxonomies();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        const loadOrg = async () => {
            if (editingOrg && isOpen) {
                setLoading(true);
                try {
                    const fullData = await getOrganizationAdmin(editingOrg.id);
                    setForm({
                        ...initialForm,
                        ...fullData,
                        lat: fullData.lat || '',
                        lng: fullData.lng || '',
                        yearFounded: fullData.yearFounded || '',
                        tags: fullData.tags || [],
                        technology: fullData.technology || [],
                        impactArea: fullData.impactArea || [],
                        badge: fullData.badge || []
                    });
                } catch (err) {
                    toast.error("Error al cargar detalle");
                } finally {
                    setLoading(false);
                }
            } else {
                setForm(initialForm);
            }
        };
        loadOrg();
    }, [editingOrg, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value === 'none' ? '' : value }));
    };

    const handleArrayAdd = (field, value) => {
        if (!value.trim()) return;
        if (form[field].includes(value.trim())) return;
        setForm(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }));
    };

    const handleArrayRemove = (field, index) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...form };

        // Clean numbers
        payload.lat = payload.lat ? parseFloat(payload.lat) : null;
        payload.lng = payload.lng ? parseFloat(payload.lng) : null;
        payload.yearFounded = payload.yearFounded ? parseInt(payload.yearFounded) : null;

        try {
            if (editingOrg) {
                await updateOrganization(editingOrg.id, payload);
                toast.success("Organización actualizada correctamente");
            } else {
                await createOrganization(payload);
                toast.success("Organización creada (DRAFT)");
            }
            onCreated();
            onClose();
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGeocode = async () => {
        if (!form.city || !form.country) {
            toast.error("Ciudad y País son necesarios para geocodificar");
            return;
        }
        setLoading(true);
        try {
            const updated = await geocodeOrganization(editingOrg.id);
            setForm(prev => ({ ...prev, lat: updated.lat, lng: updated.lng }));
            toast.success("Ubicación encontrada!");
        } catch (err) {
            toast.error(`No se pudo encontrar la ubicación: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[850px] h-[90vh] p-0 flex flex-col overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 bg-gradient-to-br from-primary/10 via-background to-background border-b relative">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg shadow-primary/20">
                            {editingOrg ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight">
                                {editingOrg ? `Editar ${form.name || 'Organización'}` : 'Nueva Organización'}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium opacity-70">
                                {editingOrg ? 'Actualiza todos los campos del relevamiento.' : 'Registra una nueva entidad en el ecosistema (Estado: BORRADOR).'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1">
                    <form id="org-master-form" onSubmit={handleSubmit} className="p-8 space-y-12">

                        {/* SECCIÓN 1: CORE */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary">
                                    <Info className="h-4 w-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest">Identidad</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase opacity-60">ID Único (Slug)</Label>
                                        <Input name="id" value={form.id} onChange={handleChange} required disabled={!!editingOrg} placeholder="ej: mercadolibre-ar" className="bg-muted/30 focus:bg-background transition-all h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase opacity-60">Nombre de la Organización</Label>
                                        <Input name="name" value={form.name} onChange={handleChange} required placeholder="Nombre oficial" className="bg-muted/30 focus:bg-background transition-all h-11" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary">
                                    <MessageSquare className="h-4 w-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest">Resumen</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <Label className="text-[11px] font-bold uppercase opacity-60">Descripción / Propuesta de Valor</Label>
                                        <span className={cn(
                                            "text-[10px] font-bold",
                                            (form.description?.length || 0) < 20 ? "text-rose-500" : "text-emerald-500"
                                        )}>
                                            {form.description?.length || 0} / 20 min
                                        </span>
                                    </div>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                        className={cn(
                                            "w-full h-[106px] rounded-xl border border-input bg-muted/30 p-4 text-sm focus:ring-2 outline-none transition-all resize-none",
                                            (form.description?.length || 0) < 20 ? "focus:ring-rose-200 border-rose-200" : "focus:ring-primary"
                                        )}
                                        placeholder="Describe la actividad principal, impacto y visión..."
                                    />
                                    {(form.description?.length || 0) < 20 && (
                                        <p className="text-[10px] text-rose-500 font-medium">
                                            * Se requieren al menos 20 caracteres para poder publicar esta organización.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* SECCIÓN 2: CLASIFICACIÓN */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 text-primary">
                                <LayoutGrid className="h-4 w-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Taxonomía y Estado</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Tipo de Organización</Label>
                                    <Select name="organizationType" value={form.organizationType} onValueChange={(v) => handleSelectChange('organizationType', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOptions('organizationType').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Sector Primario</Label>
                                    <Select name="sectorPrimary" value={form.sectorPrimary} onValueChange={(v) => handleSelectChange('sectorPrimary', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOptions('sectorPrimary').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Sector Secundario</Label>
                                    <Select name="sectorSecondary" value={form.sectorSecondary || "none"} onValueChange={(v) => handleSelectChange('sectorSecondary', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Opcional..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Ninguno --</SelectItem>
                                            {getOptions('sectorPrimary').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Etapa (Stage)</Label>
                                    <Select name="stage" value={form.stage || "none"} onValueChange={(v) => handleSelectChange('stage', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Opcional..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Ninguno --</SelectItem>
                                            {getOptions('stage').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Estado de Salida (Outcome)</Label>
                                    <Select name="outcomeStatus" value={form.outcomeStatus} onValueChange={(v) => handleSelectChange('outcomeStatus', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOptions('outcomeStatus').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60 text-primary">Estado Sistema (Lectura)</Label>
                                    <div className="h-11 flex items-center px-4 bg-primary/5 rounded-xl border border-primary/20 text-xs font-black text-primary">
                                        {form.status || 'NUEVO (DRAFT)'}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* SECCIÓN 3: GEOGRAFÍA */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary">
                                    <MapPin className="h-4 w-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest">Geolocalización</h3>
                                </div>
                                {editingOrg && (
                                    <Button type="button" variant="outline" size="sm" onClick={handleGeocode} disabled={loading} className="h-8 text-[10px] font-bold uppercase">
                                        Buscar en el Mapa
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">País</Label>
                                    <Input name="country" value={form.country} onChange={handleChange} required className="bg-muted/30 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Región / Provincia</Label>
                                    <Input name="region" value={form.region} onChange={handleChange} required className="bg-muted/30 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Ciudad</Label>
                                    <Input name="city" value={form.city} onChange={handleChange} required className="bg-muted/30 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Latitud</Label>
                                    <Input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} className="bg-muted/30 h-11" placeholder="-34.60" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Longitud</Label>
                                    <Input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} className="bg-muted/30 h-11" placeholder="-58.38" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Año de Fundación</Label>
                                    <Input name="yearFounded" type="number" value={form.yearFounded} onChange={handleChange} className="bg-muted/30 h-11" placeholder="ej: 2015" />
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* SECCIÓN 4: CONTACTO Y LINKS */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 text-primary">
                                <LinkIcon className="h-4 w-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Presencia Digital y Contacto</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Sitio Web (URL)</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input name="website" value={form.website} onChange={handleChange} className="pl-10 bg-muted/30 h-11" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Logo URL</Label>
                                    <Input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="bg-muted/30 h-11" placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">LinkedIn</Label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                                        <Input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="pl-10 bg-muted/30 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Instagram</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                                        <Input name="instagramUrl" value={form.instagramUrl} onChange={handleChange} className="pl-10 bg-muted/30 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Email Contacto</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className="pl-10 bg-muted/30 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Teléfono</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="pl-10 bg-muted/30 h-11" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* SECCIÓN 5: MULTI-SELECCIÓN */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-2 text-primary">
                                <Tag className="h-4 w-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Etiquetas y Atributos</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Tags */}
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Tags (Presiona Enter para agregar)</Label>
                                    <Input
                                        placeholder="ej: Fintech, IA..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleArrayAdd('tags', e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="bg-muted/30 h-11"
                                    />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {form.tags.map((t, i) => (
                                            <Badge key={i} variant="secondary" className="px-3 py-1 flex items-center gap-2 group">
                                                {t}
                                                <X className="h-3 w-3 cursor-pointer opacity-50 group-hover:opacity-100" onClick={() => handleArrayRemove('tags', i)} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Technology */}
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Tecnologías</Label>
                                    <Select onValueChange={(v) => handleArrayAdd('technology', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Agregar tecnología..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOptions('technology').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {form.technology.map((t, i) => (
                                            <Badge key={i} className="px-3 py-1 flex items-center gap-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none">
                                                {t}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => handleArrayRemove('technology', i)} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* ImpactArea */}
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Áreas de Impacto</Label>
                                    <Select onValueChange={(v) => handleArrayAdd('impactArea', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Agregar área..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOptions('impactArea').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {form.impactArea.map((t, i) => (
                                            <Badge key={i} className="px-3 py-1 flex items-center gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">
                                                {t}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => handleArrayRemove('impactArea', i)} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-bold uppercase opacity-60">Insignias / Badges</Label>
                                    <Select onValueChange={(v) => handleArrayAdd('badge', v)}>
                                        <SelectTrigger className="bg-muted/30 h-11">
                                            <SelectValue placeholder="Agregar badge..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOptions('badge').map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {form.badge.map((t, i) => (
                                            <Badge key={i} className="px-3 py-1 flex items-center gap-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none">
                                                {t}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => handleArrayRemove('badge', i)} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* SECCIÓN 6: NOTAS */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 text-primary">
                                <Briefcase className="h-4 w-4" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">Administración</h3>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase opacity-60">Notas Privadas (Admin)</Label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    className="w-full h-[100px] rounded-xl border border-input bg-muted/30 p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                />
                            </div>
                        </section>

                    </form>
                </ScrollArea>

                <DialogFooter className="p-8 border-t bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="font-bold opacity-50 hover:opacity-100 hover:bg-transparent">
                        Descartar Cambios
                    </Button>
                    <div className="flex gap-4">
                        <Button
                            form="org-master-form"
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                            {editingOrg ? 'Guardar Cambios' : 'Crear Organización'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
