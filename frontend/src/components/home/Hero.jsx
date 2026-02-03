import React from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();


    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
            {/* Background Abstract Map Glow */}
            <div className="absolute inset-0 flex items-center justify-center -z-0 opacity-40">
                <div className="relative w-[800px] h-[800px]">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15)_0%,rgba(5,5,5,0)_70%)] blur-3xl"
                    />
                    <svg viewBox="0 0 200 200" className="w-full h-full text-primary/10">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <circle cx="100" cy="100" r="80" fill="url(#grid)" className="opacity-20" />
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 3, delay: 0.5 }}
                            d="M40,100 Q70,40 100,100 T160,100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                        />
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 3, delay: 1 }}
                            d="M60,60 Q100,20 140,60 T100,140"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                        />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center px-4 py-1.5 mt-12 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
                        El ecosistema AgriFoodTech en un solo lugar
                    </span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                        LODO: Hub de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400">
                            Innovación AgriFoodTech
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Visualizá, conectá y escalá. El mapa dinámico que reúne a los principales actores del sector agroindustrial y tecnológico de la región.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/map')}
                            className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-semibold flex items-center transition-all overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <Map className="w-5 h-5 mr-3" />
                            Explorar el mapa
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        {/* Removed "Cómo funciona" button per request */}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
