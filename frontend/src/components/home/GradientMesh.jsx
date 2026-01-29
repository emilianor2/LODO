import React from 'react';
import { motion } from 'framer-motion';

const GradientMesh = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(5,5,5,1)_100%)]" />

            {/* Animated Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -150, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 50, 0],
                    y: [0, -100, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]"
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default GradientMesh;
