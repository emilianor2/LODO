import React, { useState, useEffect } from 'react';
import {
    adminCreateOrganization as createOrganization,
    adminGeocodeOrganization as geocodeOrganization,
    adminUpdateOrganization as updateOrganization
} from '../../services/api';
import { Button } from '../ui/button';

export default function OrgForm({ onCreated, editingOrg, onClear }) {
    const initialForm = {
        id: '',
        name: '',
        organizationType: '',
        sectorPrimary: '',
        sectorSecondary: '',
        stage: '',
        outcomeStatus: '',
        country: '',
        region: '',
        city: '',
        description: '',
        yearFounded: '',
        logoUrl: '',
        website: '',
        linkedinUrl: '',
        instagramUrl: '',
        contactEmail: '',
        contactPhone: '',
        tags: '',
        technology: '',
        impactArea: '',
        notes: '',
        lat: '',
        lng: ''
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingOrg) {
            setForm({
                ...editingOrg,
                lat: editingOrg.lat || '',
                lng: editingOrg.lng || '',
                sectorSecondary: editingOrg.sectorSecondary || '',
                stage: editingOrg.stage || '',
                website: editingOrg.website || '',
                notes: editingOrg.notes || '',
                description: editingOrg.description || '',
                yearFounded: editingOrg.yearFounded || '',
                logoUrl: editingOrg.logoUrl || '',
                linkedinUrl: editingOrg.linkedinUrl || '',
                instagramUrl: editingOrg.instagramUrl || '',
                contactEmail: editingOrg.contactEmail || '',
                contactPhone: editingOrg.contactPhone || '',
                tags: Array.isArray(editingOrg.tags) ? editingOrg.tags.join(', ') : '',
                technology: Array.isArray(editingOrg.technology) ? editingOrg.technology.join(', ') : '',
                impactArea: Array.isArray(editingOrg.impactArea) ? editingOrg.impactArea.join(', ') : ''
            });
        } else {
            setForm(initialForm);
        }
    }, [editingOrg]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...form,
            yearFounded: form.yearFounded ? parseInt(form.yearFounded) : 0,
            lat: form.lat ? parseFloat(form.lat) : null,
            lng: form.lng ? parseFloat(form.lng) : null,
            tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(t => t !== '') : [],
            technology: form.technology ? form.technology.split(',').map(t => t.trim()).filter(t => t !== '') : [],
            impactArea: form.impactArea ? form.impactArea.split(',').map(t => t.trim()).filter(t => t !== '') : []
        };

        try {
            if (editingOrg) {
                await updateOrganization(payload.id, payload);
                alert("Organización actualizada!");
            } else {
                await createOrganization(payload);
                alert("Organización creada exitosamente (DRAFT)");
            }
            onCreated();
            if (!editingOrg) setForm(initialForm);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGeocode = async () => {
        if (!editingOrg) return;
        setLoading(true);
        setError(null);
        try {
            const updated = await geocodeOrganization(editingOrg.id);
            setForm(prev => ({ ...prev, lat: updated.lat, lng: updated.lng }));
            alert("Coordenadas detectadas!");
            onCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card p-8 rounded-[2.5rem] border shadow-2xl max-w-4xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter italic">
                        {editingOrg ? 'EDITAR' : 'NUEVA'} <span className="text-primary">STARTUP</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Portal de administración</p>
                </div>
                {editingOrg && (
                    <Button variant="ghost" onClick={onClear} className="rounded-2xl hover:bg-destructive/10 hover:text-destructive font-bold text-xs uppercase tracking-widest">
                        Cancelar Edición
                    </Button>
                )}
            </div>

            {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-xl mb-6 text-sm font-bold">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ID & Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Identificador (ID) *</label>
                        <input name="id" value={form.id} onChange={handleChange} required disabled={!!editingOrg} className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all disabled:opacity-50" placeholder="slug-de-la-startup" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Nombre Comercial *</label>
                        <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="Nombre de la empresa" />
                    </div>
                </div>

                {/* Clasificación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Tipo de Org *</label>
                        <input name="organizationType" value={form.organizationType} onChange={handleChange} required className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="Startup, VC, Hub..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Sector Primario *</label>
                        <input name="sectorPrimary" value={form.sectorPrimary} onChange={handleChange} required className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="Fintech, Agtech..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Madurez / Stage</label>
                        <input name="stage" value={form.stage} onChange={handleChange} className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="Seed, Series A..." />
                    </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Descripción del Proyecto</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-muted/30 border-none p-6 rounded-[2rem] focus:ring-2 ring-primary/20 font-medium transition-all min-h-[120px]" placeholder="Breve descripción de lo que hacen..." />
                </div>

                {/* Ubicación Avanzada */}
                <div className="bg-muted/20 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs tracking-tighter font-black">GEO</span>
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest">Localización Geográfica</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="country" value={form.country} onChange={handleChange} placeholder="País" className="bg-background border-none h-12 px-5 rounded-xl font-bold text-sm" />
                        <input name="region" value={form.region} onChange={handleChange} placeholder="Provincia/Estado" className="bg-background border-none h-12 px-5 rounded-xl font-bold text-sm" />
                        <input name="city" value={form.city} onChange={handleChange} placeholder="Ciudad" className="bg-background border-none h-12 px-5 rounded-xl font-bold text-sm" />
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitud" className="bg-background border-none h-12 px-5 rounded-xl font-bold text-sm" />
                            <input name="lng" value={form.lng} onChange={handleChange} placeholder="Longitud" className="bg-background border-none h-12 px-5 rounded-xl font-bold text-sm" />
                        </div>
                        {editingOrg && (
                            <Button type="button" onClick={handleGeocode} disabled={loading} className="h-12 rounded-xl bg-white text-primary hover:bg-primary hover:text-white shadow-sm font-black text-[10px] uppercase tracking-widest px-6 transition-all border">
                                {loading ? '...' : 'Auto-Geocode'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Redes y Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Website URL</label>
                        <input name="website" value={form.website} onChange={handleChange} className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">LinkedIn</label>
                        <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="https://linkedin.com/company/..." />
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Etiquetas / Tags (separados por coma)</label>
                    <input name="tags" value={form.tags} onChange={handleChange} className="w-full bg-muted/30 border-none h-14 px-6 rounded-2xl focus:ring-2 ring-primary/20 font-bold transition-all" placeholder="agtech, lot, satelital..." />
                </div>

                <div className="pt-8 flex gap-4">
                    <Button type="submit" disabled={loading} className="flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 text-sm active:scale-95 transition-all">
                        {loading ? 'Procesando...' : (editingOrg ? 'Actualizar Startup' : 'Crear en Borrador')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
