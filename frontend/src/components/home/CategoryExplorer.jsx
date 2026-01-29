import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, Utensils, Cloud, Cpu, FlaskConical, BarChart as ChartBar } from 'lucide-react';

const categories = [
    {
        id: 'AgTech',
        label: 'AgTech',
        icon: Leaf,
        description: 'Tecnología aplicada a la agricultura para mejorar la eficiencia y sostenibilidad del campo.',
        color: 'from-emerald-400 to-emerald-600',
        query: 'AgTech'
    },
    {
        id: 'FoodTech',
        label: 'FoodTech',
        icon: Utensils,
        description: 'Innovación en la producción, distribución y consumo de alimentos.',
        color: 'from-orange-400 to-orange-600',
        query: 'FoodTech'
    },
    {
        id: 'ClimateTech',
        label: 'ClimateTech',
        icon: Cloud,
        description: 'Soluciones tecnológicas para mitigar el impacto ambiental y combatir el cambio climático.',
        color: 'from-blue-400 to-blue-600',
        query: 'ClimateTech'
    },
    {
        id: 'Industry40',
        label: 'Industria 4.0',
        icon: Cpu,
        description: 'Digitalización y automatización de procesos industriales con IoT e IA.',
        color: 'from-purple-400 to-purple-600',
        query: 'IA / IoT'
    },
    {
        id: 'Biotech',
        label: 'Biotech',
        icon: FlaskConical,
        description: 'Aplicación de la biología en el desarrollo de productos y procesos innovadores.',
        color: 'from-pink-400 to-pink-600',
        query: 'Biotech'
    },
    {
        id: 'Marketplace',
        label: 'Fintech / Market',
        icon: ChartBar,
        description: 'Soluciones financieras y plataformas de comercio para el ecosistema productivo.',
        color: 'from-amber-400 to-amber-600',
        query: 'E-commerce'
    }
];

const CategoryExplorer = () => {
    const [selected, setSelected] = useState(categories[0]);
    const navigate = useNavigate();

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Explorá por verticales</h2>
                <p className="text-zinc-500">Filtrá el ecosistema según tu interés y descubrí oportunidades específicas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Category Tiles */}
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            onClick={() => setSelected(cat)}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative p-6 rounded-3xl border transition-all text-left group overflow-hidden ${selected.id === cat.id
                                    ? 'bg-white/10 border-white/20'
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                        >
                            {selected.id === cat.id && (
                                <motion.div
                                    layoutId="active-bg"
                                    className="absolute inset-0 bg-gradient-to-br opacity-10 -z-10"
                                    style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                                />
                            )}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${cat.color} shadow-lg shadow-black/20`}>
                                <cat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`font-bold text-sm uppercase tracking-wider ${selected.id === cat.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                {cat.label}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Category Detail */}
                <div className="lg:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl"
                        >
                            <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${selected.color} text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6`}>
                                Foco Estratégico
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-6">{selected.label}</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                                {selected.description}
                            </p>

                            <button
                                onClick={() => navigate(`/map?filter=${selected.query}`)}
                                className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center hover:bg-zinc-200 transition-colors group"
                            >
                                Ver en el mapa
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="ml-2"
                                >
                                    <Pin className="w-4 h-4 fill-current" />
                                </motion.span>
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    {/* Background Glow */}
                    <div className={`absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-zinc-400/10 rounded-full blur-[100px] transition-colors`} />
                </div>
            </div>
        </section>
    );
};

export default CategoryExplorer;

const Pin = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
