import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Zap, Search, Network, BarChart3, Globe } from 'lucide-react';

const Card = ({ title, subtitle, icon: Icon, features, colorClass }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-10 -mt-10 ${colorClass}`} />
        <div className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">{subtitle}</p>

            <div className="grid grid-cols-1 gap-4">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-300">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('bg-', 'bg-opacity-100 bg-')}`} />
                        <span className="text-sm font-medium">{f}</span>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

const Features = () => {
    const roadmapSteps = [
        { label: "Convocatoria", icon: Search },
        { label: "Selección", icon: Target },
        { label: "Mentoría", icon: Users },
        { label: "Inversión", icon: Zap },
        { label: "Escala", icon: Globe }
    ];

    return (
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
                <Card
                    title="LODO"
                    subtitle="La plataforma centralizada para el descubrimiento y mapeo del ecosistema. Datos en tiempo real para decisiones estratégicas."
                    icon={Network}
                    colorClass="bg-primary"
                    features={[
                        "Mapa interactivo de organizaciones",
                        "Filtros avanzados por sector y tipo",
                        "Directorio de startups y proveedores",
                        "Análisis de clusters por región"
                    ]}
                />
                <Card
                    title="LODAR"
                    subtitle="Nuestro brazo ejecutor y acelerador. Programas diseñados para potenciar el crecimiento de startups de alto impacto."
                    icon={Rocket}
                    colorClass="bg-emerald-500"
                    features={[
                        "Programas de aceleración a medida",
                        "Red de mentores especializados",
                        "Acceso a capital semilla y venture",
                        "Validación técnica y comercial"
                    ]}
                />
            </div>

            {/* Timeline / Roadmap */}
            <div className="relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">El camino al éxito</h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto">Nuestro proceso está diseñado para transformar ideas innovadoras en empresas líderes en el mercado global.</p>
                </div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                    {roadmapSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col items-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors shadow-xl">
                                <step.icon className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm font-semibold text-zinc-500 group-hover:text-white transition-colors">{step.label}</span>
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                {idx + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
