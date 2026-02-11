import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Globe2,
    Layers3,
    MapPinned,
    PieChart,
    ShieldX
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { adminFetchOrganizations as listOrganizations } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CHART_COLORS = ['#2f8f39', '#42ab49', '#63cc66', '#8fcc8c', '#bdecb8', '#d9f5d6'];

function normalize(value, fallback = 'Sin dato') {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text === '' ? fallback : text;
}

function countBy(items, selector) {
    const counts = new Map();
    for (const item of items) {
        const key = normalize(selector(item));
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
}

function topEntries(countMap, limit = 8) {
    return [...countMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([label, value]) => ({ label, value }));
}

function HorizontalBars({ title, data, icon: Icon }) {
    const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 1;

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h3>
            </div>

            <div className="space-y-3">
                {data.length === 0 && <p className="text-sm text-slate-500">Sin datos</p>}
                {data.map((item, idx) => (
                    <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="truncate font-semibold text-slate-700">{item.label}</span>
                            <span className="font-black text-slate-900">{item.value}</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                    backgroundColor: CHART_COLORS[idx % CHART_COLORS.length]
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DonutChart({ title, data }) {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const radius = 58;
    const stroke = 18;
    const center = 80;
    const circumference = 2 * Math.PI * radius;
    let accumulator = 0;

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h3>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative h-40 w-40 shrink-0">
                    <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth={stroke}
                        />
                        {data.map((segment, idx) => {
                            const fraction = total > 0 ? segment.value / total : 0;
                            const length = fraction * circumference;
                            const dashOffset = circumference - accumulator;
                            accumulator += length;
                            return (
                                <circle
                                    key={segment.label}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="none"
                                    stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                                    strokeWidth={stroke}
                                    strokeDasharray={`${length} ${circumference - length}`}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="butt"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900">{total}</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Startups</span>
                    </div>
                </div>

                <div className="grid flex-1 gap-2">
                    {data.map((item, idx) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                                />
                                <span className="truncate text-sm font-semibold text-slate-700">{item.label}</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AdminStatsPage() {
    const navigate = useNavigate();
    const { isAdmin, loading: authLoading, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const data = await listOrganizations();
                setOrganizations(data || []);
                setError(null);
            } catch (err) {
                setError('No se pudieron cargar las estadisticas.');
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    const stats = useMemo(() => {
        const total = organizations.length;
        const mappable = organizations.filter((o) => o.lat && o.lng).length;
        const published = organizations.filter((o) => normalize(o.status) === 'PUBLISHED').length;
        const topCountries = topEntries(countBy(organizations, (o) => o.country), 10);
        const topSectors = topEntries(countBy(organizations, (o) => o.sectorPrimary), 8);
        const byStage = topEntries(countBy(organizations, (o) => o.stage), 6);
        const byType = topEntries(countBy(organizations, (o) => o.organizationType), 6);
        return {
            total,
            mappable,
            published,
            mappablePct: total > 0 ? Math.round((mappable / total) * 100) : 0,
            publishedPct: total > 0 ? Math.round((published / total) * 100) : 0,
            topCountries,
            topSectors,
            byStage,
            byType
        };
    }, [organizations]);

    if (authLoading) {
        return (
            <AppShell>
                <div className="flex h-full items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
                        <p className="text-slate-500">Verificando acceso...</p>
                    </div>
                </div>
            </AppShell>
        );
    }

    if (!isAdmin) {
        return (
            <AppShell>
                <div className="flex h-full items-center justify-center bg-slate-50">
                    <div className="max-w-md p-8 text-center">
                        <div className="mx-auto mb-6 w-fit rounded-full bg-rose-100 p-4">
                            <ShieldX className="h-12 w-12 text-rose-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-slate-900">Acceso Denegado</h2>
                        <p className="mb-6 text-slate-500">
                            Esta vista es solo para administradores.
                            <br />
                            <span className="text-sm">Conectado como: {user?.email}</span>
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" onClick={() => navigate('/map')}>Volver al mapa</Button>
                            <Button variant="outline" onClick={() => navigate('/')}>Inicio</Button>
                        </div>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="min-h-full bg-slate-50/60 p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Admin Stats
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Estadisticas del Ecosistema
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
                        Cargando estadisticas...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
                                <p className="mt-2 text-3xl font-black text-slate-900">{stats.total}</p>
                            </div>
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Con Coordenadas</p>
                                <p className="mt-2 text-3xl font-black text-slate-900">{stats.mappable}</p>
                                <p className="text-xs font-semibold text-slate-500">{stats.mappablePct}% del total</p>
                            </div>
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Publicadas</p>
                                <p className="mt-2 text-3xl font-black text-slate-900">{stats.published}</p>
                                <p className="text-xs font-semibold text-slate-500">{stats.publishedPct}% del total</p>
                            </div>
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cobertura Geografica</p>
                                <p className="mt-2 text-3xl font-black text-slate-900">{stats.topCountries.length}</p>
                                <p className="text-xs font-semibold text-slate-500">Paises con actividad</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <HorizontalBars title="Top Paises" data={stats.topCountries} icon={Globe2} />
                            <HorizontalBars title="Top Sectores" data={stats.topSectors} icon={Layers3} />
                            <DonutChart title="Distribucion por Etapa" data={stats.byStage} />
                            <HorizontalBars title="Tipos de Organizacion" data={stats.byType} icon={MapPinned} />
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
