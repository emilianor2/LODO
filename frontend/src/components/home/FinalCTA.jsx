import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map } from 'lucide-react';

const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-32 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-24 text-center"
            >
                {/* Decorative background effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-20 blur-[100px] -ml-48 -mb-48" />

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                        ¿Listo para explorar el ecosistema?
                    </h2>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                        Unite a la red más grande de AgriFoodTech y empezá a descubrir las oportunidades que impulsarán tu crecimiento.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/map')}
                        className="group px-10 py-5 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center mx-auto shadow-2xl transition-all"
                    >
                        <Map className="w-6 h-6 mr-3" />
                        ENTRAR AL MAPA
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>
            </motion.div>
        </section>
    );
};

export default FinalCTA;
