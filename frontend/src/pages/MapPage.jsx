import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import AppShell from '../components/layout/AppShell';
import MapView from '../components/Map/MapView';
import OrgDetailDrawer from '../components/Detail/OrgDetailDrawer';
import MapShellLayout from '../components/Map/MapShellLayout';
import { fetchOrganizations } from '../services/api';
import { useFacets } from '../hooks/useFacets';
import { useSearchParams } from 'react-router-dom';

// Debounce helper
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function MapPage() {
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState(() => {
        const initialFilter = searchParams.get('filter') || '';
        return {
            country: '',
            sectorPrimary: initialFilter,
            organizationType: '',
            stage: '',
            outcomeStatus: '',
            q: '',
            onlyMappable: false
        };
    });

    const [bbox, setBbox] = useState(null);
    const debouncedFilters = useDebounce(filters, 400);
    const debouncedBbox = useDebounce(bbox, 400);

    const [organizations, setOrganizations] = useState([]);
    const { facets: aggregates, loading: facetsLoading } = useFacets(debouncedFilters);

    const [loadingResults, setLoadingResults] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState(null);
    const [centeredLocation, setCenteredLocation] = useState(null);

    const abortControllerRef = useRef(null);

    // Fetch Organizations (Results)
    useEffect(() => {
        const loadResults = async () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            setLoadingResults(true);
            try {
                const params = { ...debouncedFilters };
                // Don't filter by bbox - show all organizations matching filters

                const data = await fetchOrganizations(params, controller.signal);
                if (!controller.signal.aborted) {
                    setOrganizations(data || []);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(err);
                    toast.error("Error al cargar organizaciones");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingResults(false);
                }
            }
        };

        loadResults();

        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [debouncedFilters]); // Removed debouncedBbox from dependencies

    const handleMarkerClick = useCallback((id) => {
        setSelectedOrgId(id);
    }, []);

    const handleResultClick = useCallback((org) => {
        if (org.lat && org.lng) {
            setCenteredLocation({ lat: org.lat + 0.001, lng: org.lng });
            setTimeout(() => setCenteredLocation({ lat: org.lat, lng: org.lng }), 50);
        }
        setSelectedOrgId(org.id);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            country: '',
            sectorPrimary: '',
            organizationType: '',
            stage: '',
            outcomeStatus: '',
            q: '',
            onlyMappable: false
        });
    };

    return (
        <AppShell
            onSearchChange={(value) => handleFilterChange('q', value)}
            searchValue={filters.q}
            resultsCount={organizations.length}
        >
            <MapShellLayout
                filters={filters}
                onFilterChange={handleFilterChange}
                aggregates={aggregates}
                onResetFilters={handleResetFilters}
                organizations={organizations}
                onSelectOrg={handleResultClick}
                loading={loadingResults}
                loadingResults={loadingResults}
                loadingFacets={facetsLoading}
                searchQuery={filters.q}
                onSearchChange={(val) => handleFilterChange('q', val)}
                isDetailModalOpen={!!selectedOrgId}
            >
                <MapView
                    organizations={organizations}
                    onBboxChange={setBbox}
                    onMarkerClick={handleMarkerClick}
                    centeredLocation={centeredLocation}
                    isSidebarOpen={false}
                />
            </MapShellLayout>

            {selectedOrgId && (
                <OrgDetailDrawer
                    orgId={selectedOrgId}
                    onClose={() => setSelectedOrgId(null)}
                />
            )}
        </AppShell>
    );
}
