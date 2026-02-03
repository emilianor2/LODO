import React, { useEffect } from 'react';
import GradientMesh from '../components/home/GradientMesh';
import NavBar from '../components/home/NavBar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Stats from '../components/home/Stats';
import CategoryExplorer from '../components/home/CategoryExplorer';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';

const HomePage = () => {
    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        // Add smooth scroll behavior to html
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
            <GradientMesh />
            <NavBar />

            <main>
                <Hero />

                <div className="relative z-10">
                    <Features />
                    <Stats />
                    <CategoryExplorer />
                    <FinalCTA />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
