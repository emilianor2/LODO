import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Filter, Layers, Pin, Globe } from 'lucide-react';
import { fetchAggregates } from '../../services/api';

const AnimatedCounter = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && value > 0) {
            let start = 0;
            const end = parseInt(value);
            const duration = 2000;
            const increment = Math.ceil(end / (duration / 16)); // ~60fps

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayValue(end);
                    clearInterval(timer);
                } else {
                    setDisplayValue(start);
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{displayValue}</span>;
};

const Stats = () => {
    const [stats, setStats] = useState({
        organizations: 0,
        countries: 0,
        sectors: 0,
        types: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchAggregates();

                // Calcular totales desde los agregados
                const totalOrgs = data.organizationTypes.reduce((acc, curr) => acc + curr.count, 0);
                const totalCountries = data.countries.filter(c => c.value && c.value !== '').length;
                const totalSectors = data.sectorsPrimary.length;
                const totalTypes = data.organizationTypes.length;

                setStats({
                    organizations: totalOrgs,
                    countries: totalCountries,
                    sectors: totalSectors,
                    types: totalTypes
                });
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const statsConfig = [
        { label: 'Organizaciones', value: stats.organizations, icon: Layers },
        { label: 'Países', value: stats.countries, icon: Globe },
        { label: 'Sectores', value: stats.sectors, icon: Pin },
        { label: 'Tipos', value: stats.types, icon: Search },
    ];

    return (
        <section className="py-24 bg-[#080808]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Mock Map Visual */}
                    <div className="flex-1 relative order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 aspect-video shadow-2xl"
                        >
                            {/* Map UI Elements */}
                            <div className="absolute top-6 left-6 z-20 flex gap-2">
                                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center text-xs text-white">
                                    <Search className="w-3 h-3 mr-2" />
                                    Buscar organización...
                                </div>
                                <div className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center">
                                    <Filter className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 z-20">
                                <div className="flex flex-col gap-2">
                                    <div className="w-10 h-10 bg-white border border-black/5 rounded-xl flex items-center justify-center text-black font-bold">+</div>
                                    <div className="w-10 h-10 bg-white border border-black/5 rounded-xl flex items-center justify-center text-black font-bold">−</div>
                                </div>
                            </div>

                            {/* Fake Map Content */}
                            <div className="absolute inset-0 bg-[#111] grid grid-cols-12 grid-rows-12 opacity-30">
                                {Array.from({ length: 144 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/5" />
                                ))}
                            </div>

                            {/* Animated Pointers */}
                            {[
                                { t: '20%', l: '30%', c: 'bg-primary' },
                                { t: '45%', l: '60%', c: 'bg-emerald-500' },
                                { t: '70%', l: '25%', c: 'bg-amber-500' },
                                { t: '40%', l: '15%', c: 'bg-primary' },
                                { t: '55%', l: '80%', c: 'bg-blue-400' },
                            ].map((p, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2 + i, repeat: Infinity }}
                                    style={{ top: p.t, left: p.l }}
                                    className={`absolute w-3 h-3 rounded-full ${p.c} blur-[2px] z-10`}
                                />
                            ))}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </motion.div>

                        {/* Decor */}
                        <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                    </div>

                    {/* Stats Content */}
                    <div className="flex-1 order-1 lg:order-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Información estratégica en tiempo real</h2>
                        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
                            Accedé al panel interactivo más completo del sector. Identificá tendencias, clusters emergentes y oportunidades de colaboración con datos validados de nuestra base de datos dinámica.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {statsConfig.map((stat, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {loading ? (
                                                <div className="h-8 w-16 bg-white/5 animate-pulse rounded-lg" />
                                            ) : (
                                                <>+<AnimatedCounter value={stat.value} /></>
                                            )}
                                        </div>
                                        <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
