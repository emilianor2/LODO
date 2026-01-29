import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary" />
                        <span className="text-2xl font-black text-white tracking-tighter">LODO</span>
                    </div>
                    <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left">
                        Potenciando el futuro de la alimentación y la agricultura a través de la tecnología y la conexión.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest">Plataforma</h4>
                        <a href="/map" className="text-zinc-500 hover:text-white transition-colors text-sm">Mapa Interactivos</a>
                        <a href="/admin" className="text-zinc-500 hover:text-white transition-colors text-sm">Dashboard Admin</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest">Compañía</h4>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Sobre LODO</a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">LODAR</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest">Legal</h4>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Privacidad</a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Términos</a>
                    </div>
                </div>

                <div className="flex gap-4">
                    {[Linkedin, Twitter, Github, Mail].map((Icon, i) => (
                        <a
                            key={i}
                            href="#"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all hover:-translate-y-1"
                        >
                            <Icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-center">
                <span className="text-zinc-600 text-xs">
                    © {new Date().getFullYear()} LODO Hub. Todos los derechos reservados.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
