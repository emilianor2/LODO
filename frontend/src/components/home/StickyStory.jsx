import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, SlidersHorizontal, Map as MapIcon, Link as LinkIcon } from 'lucide-react';

const steps = [
    {
        title: "Descubrí",
        description: "Navegá por el mapa dinámico y visualizá cientos de organizaciones categorizadas por sector, etapa y ubicación.",
        icon: Search,
        color: "from-blue-500 to-indigo-500"
    },
    {
        title: "Filtrá",
        description: "Utilizá nuestras herramientas avanzadas para encontrar exactamente lo que buscás, desde startups AgTech hasta inversores especializados.",
        icon: SlidersHorizontal,
        color: "from-emerald-500 to-teal-500"
    },
    {
        title: "Compará",
        description: "Analizá el perfil detallado de cada organización, sus hitos, tecnologías y su impacto en el ecosistema regional.",
        icon: MapIcon,
        color: "from-purple-500 to-pink-500"
    },
    {
        title: "Conectá",
        description: "LODO facilita el networking. Ponete en contacto directo con los actores clave y generá nuevas oportunidades de negocio.",
        icon: LinkIcon,
        color: "from-orange-500 to-red-500"
    }
];

const StickyStory = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section id="how-it-works" ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Content */}
                    <div className="relative h-96">
                        {steps.map((step, i) => {
                            const start = i / steps.length;
                            const end = (i + 1) / steps.length;

                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const y = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [20, 0, 0, -20]);

                            return (
                                <motion.div
                                    key={i}
                                    style={{ opacity, y }}
                                    className="absolute inset-0 flex flex-col justify-center"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 shadow-2xl`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter">
                                        {step.title}
                                    </h2>
                                    <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Side: Visual Progress */}
                    <div className="hidden lg:flex justify-center items-center">
                        <div className="relative w-80 h-[500px]">
                            {/* Vertical Progress Line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
                            <motion.div
                                style={{ scaleY: scrollYProgress, originY: 0 }}
                                className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary -translate-x-1/2 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10"
                            />

                            {/* Step Indicators */}
                            <div className="h-full flex flex-col justify-between py-10 relative z-20">
                                {steps.map((_, i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            scale: useTransform(scrollYProgress,
                                                [i / steps.length - 0.1, i / steps.length, i / steps.length + 0.1],
                                                [1, 1.5, 1]
                                            ),
                                            backgroundColor: useTransform(scrollYProgress,
                                                [i / steps.length - 0.1, i / steps.length, i / steps.length + 0.1],
                                                ["#27272a", "#3b82f6", "#27272a"]
                                            )
                                        }}
                                        className="w-4 h-4 rounded-full border border-white/20 self-center"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StickyStory;
