import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchAggregates } from '../services/api';

/**
 * Hook to manage faceted search filters.
 * It fetches the available options for each filter key, 
 * excluding the current filter value itself (self-excluding facets).
 * 
 * @param {Object} filters - Current active filters
 */
export function useFacets(filters) {
    const [facets, setFacets] = useState({
        countries: [],
        sectorsPrimary: [],
        organizationTypes: [],
        stages: [],
        outcomeStatuses: []
    });
    const [loading, setLoading] = useState(true);

    const abortControllerRef = useRef(null);

    // Serialize filters to prevent infinite loops from object reference changes
    const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

    useEffect(() => {
        const loadFacets = async () => {
            setLoading(true);

            // Cancel previous requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const aborter = new AbortController();
            abortControllerRef.current = aborter;

            try {
                // Parse filters back from the serialized key
                const currentFilters = JSON.parse(filtersKey);

                // Helper to get params without a specific key (for self-excluding)
                const getParamsExcluding = (key) => {
                    const p = { ...currentFilters };
                    delete p[key];
                    return p;
                };

                // Fetch all facets in parallel
                const signal = aborter.signal;
                const [resCountry, resSector, resType, resStage, resStatus] = await Promise.all([
                    fetchAggregates(getParamsExcluding('country'), signal),
                    fetchAggregates(getParamsExcluding('sectorPrimary'), signal),
                    fetchAggregates(getParamsExcluding('organizationType'), signal),
                    fetchAggregates(getParamsExcluding('stage'), signal),
                    fetchAggregates(getParamsExcluding('outcomeStatus'), signal)
                ]);

                if (!signal.aborted) {
                    setFacets({
                        countries: resCountry.countries || [],
                        sectorsPrimary: resSector.sectorsPrimary || [],
                        organizationTypes: resType.organizationTypes || [],
                        stages: resStage.stages || [],
                        outcomeStatuses: resStatus.outcomeStatuses || []
                    });
                    setLoading(false);
                }

            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error loading facets:", err);
                    setLoading(false);
                }
            }
        };

        // Debounce
        const timeoutId = setTimeout(loadFacets, 300);

        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [filtersKey]); // Use serialized key instead of filters object

    return { facets, loading };
}
