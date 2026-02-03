import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/contacto" element={<ContactPage />} />
            </Routes>
            <Toaster position="top-center" richColors />
        </>
    );
}

export default App;
