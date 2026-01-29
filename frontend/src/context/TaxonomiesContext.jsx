import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTaxonomies } from '../services/api';

const TaxonomiesContext = createContext();

export const useTaxonomies = () => {
    const context = useContext(TaxonomiesContext);
    if (!context) {
        throw new Error('useTaxonomies must be used within a TaxonomiesProvider');
    }
    return context;
};

export const TaxonomiesProvider = ({ children }) => {
    const [taxonomies, setTaxonomies] = useState({
        organizationType: [],
        sectorPrimary: [],
        sectorSecondary: [],
        stage: [],
        outcomeStatus: [],
        technology: [],
        impactArea: [],
        badge: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTaxonomies = async () => {
            try {
                const data = await fetchTaxonomies();
                // Ensure all expected keys exist even if API returns partial data
                setTaxonomies(prev => ({ ...prev, ...data }));
                setLoading(false);
            } catch (err) {
                console.error("Failed to load taxonomies", err);
                setError(err);
                setLoading(false);
            }
        };

        loadTaxonomies();
    }, []);

    // Helper functions to get options for Select components
    // Map { value, label } -> { value, label } (already in that format from API usually)
    const getOptions = (category) => {
        return taxonomies[category] || [];
    };

    const getValue = (category, value) => {
        const list = taxonomies[category] || [];
        return list.find(item => item.value === value);
    };

    return (
        <TaxonomiesContext.Provider value={{ taxonomies, loading, error, getOptions, getValue }}>
            {children}
        </TaxonomiesContext.Provider>
    );
};
