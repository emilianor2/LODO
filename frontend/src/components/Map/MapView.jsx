import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

const getClusterSizeClass = (count) => {
    if (count < 10) return 'small';
    if (count < 100) return 'medium';
    return 'large';
};

const hexToRgba = (hex, alpha) => {
    const value = hex.replace('#', '');
    const r = parseInt(value.substring(0, 2), 16);
    const g = parseInt(value.substring(2, 4), 16);
    const b = parseInt(value.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getClusterColors = (count) => {
    const palette = ['#cfffca', '#a5eea0', '#77dd77', '#5dc460', '#42ab49'];
    let index = 0;

    if (count >= 6 && count <= 10) index = 1;
    if (count >= 11 && count <= 15) index = 2;
    if (count >= 16 && count <= 20) index = 3;
    if (count >= 21) index = 4;

    const fill = palette[index];

    return {
        fill,
        halo: hexToRgba(fill, 0.35)
    };
};

const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount();
    const { fill, halo } = getClusterColors(count);
    const sizeClass = getClusterSizeClass(count);

    return L.divIcon({
        html: `<div style="--cluster-fill:${fill}; --cluster-halo:${halo};"><span>${count}</span></div>`,
        className: `marker-cluster marker-cluster-${sizeClass}`,
        iconSize: L.point(40, 40)
    });
};

// Fix for default marker icon missing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle bbox changes
function MapEvents({ onBboxChange }) {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            const bbox = [
                bounds.getSouthWest().lat,
                bounds.getSouthWest().lng,
                bounds.getNorthEast().lat,
                bounds.getNorthEast().lng,
            ].join(',');
            onBboxChange(bbox);
        },
    });
    return null;
}

// Component to fly to coordinates when updated
function FlyToLocation({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 16, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [lat, lng, map]);
    return null;
}

// Component to handle map resizing ultra-smoothly using ResizeObserver with throttling
function ResizeMap() {
    const map = useMap();
    const container = map.getContainer();
    const requestRef = useRef();

    useEffect(() => {
        if (!container) return;

        const observer = new ResizeObserver(() => {
            if (requestRef.current) return;
            requestRef.current = requestAnimationFrame(() => {
                map.invalidateSize({ animate: false }); // animate: false is smoother for continuous resizing
                requestRef.current = null;
            });
        });

        observer.observe(container);

        // Initial sync
        map.invalidateSize();

        return () => {
            observer.disconnect();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [map, container]);

    return null;
}

export default function MapView({ organizations, onBboxChange, onMarkerClick, centeredLocation }) {
    // Center of South America approx
    const defaultPosition = [-20, -10];
    const defaultZoom = 3;

    // Memoize markers to prevent unnecessary re-renders
    const markers = useMemo(() => {
        return organizations.map(org => {
            if (!org.lat || !org.lng) return null;
            return (
                <Marker
                    key={org.id}
                    position={[org.lat, org.lng]}
                    eventHandlers={{
                        click: () => onMarkerClick(org.id),
                    }}
                >
                    <Popup className="custom-popup">
                        <div
                            className="p-1 min-w-[180px] cursor-pointer group/popup"
                            onClick={() => onMarkerClick(org.id)}
                        >
                            <h3 className="font-bold text-sm text-foreground decoration-primary group-hover/popup:underline transition-all">
                                {org.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                {org.city || 'Ciudad desconocida'}, {org.country}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                                    {org.sectorPrimary}
                                </span>
                            </div>
                            <p className="text-[10px] font-medium text-primary mt-2 flex items-center justify-end uppercase tracking-wider">
                                Detalles →
                            </p>
                        </div>
                    </Popup>
                </Marker>
            );
        });
    }, [organizations, onMarkerClick]);

    return (
        <div className="w-full h-full relative group bg-[#cbd2d3]">
            <MapContainer
                center={defaultPosition}
                zoom={defaultZoom}
                minZoom={3}
                maxBounds={[[-85, -180], [85, 180]]}
                maxBoundsViscosity={1.0}
                worldCopyJump={false}
                scrollWheelZoom={true}
                className="w-full h-full z-0 bg-transparent"
                zoomControl={false}
                preferCanvas={true} // Improves performance for many markers
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    noWrap={true}
                    bounds={[[-85, -180], [85, 180]]}
                />

                <ZoomControl position="bottomright" />

                <MapEvents onBboxChange={onBboxChange} />
                <ResizeMap />

                {centeredLocation && <FlyToLocation lat={centeredLocation.lat} lng={centeredLocation.lng} />}

                <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={40}
                    spiderfyOnMaxZoom={true}
                    showCoverageOnHover={false}
                    singleMarkerMode={true}
                    iconCreateFunction={createClusterIcon}
                    polygonOptions={{
                        fillColor: '#16a34a',
                        color: '#16a34a',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.12
                    }}
                >
                    {markers}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
