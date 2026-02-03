import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

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
            map.flyTo([lat, lng], 14, { duration: 1.5 });
        }
    }, [lat, lng, map]);
    return null;
}

export default function MapView({ organizations, onBboxChange, onMarkerClick, centeredLocation }) {
    // Center of South America approx
    const defaultPosition = [-20, -60];
    const defaultZoom = 3;

    return (
        <MapContainer
            center={defaultPosition}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            className="leaflet-container"
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapEvents onBboxChange={onBboxChange} />

            {centeredLocation && <FlyToLocation lat={centeredLocation.lat} lng={centeredLocation.lng} />}

            <MarkerClusterGroup
                chunkedLoading
                singleMarkerMode={true}
                iconCreateFunction={createClusterIcon}
            >
                {organizations.map(org => {
                    if (!org.lat || !org.lng) return null;
                    return (
                        <Marker
                            key={org.id}
                            position={[org.lat, org.lng]}
                            eventHandlers={{
                                click: () => onMarkerClick(org.id),
                            }}
                        >
                            <Popup>
                                <div style={{ cursor: 'pointer' }} onClick={() => onMarkerClick(org.id)}>
                                    <strong style={{ fontSize: '14px' }}>{org.name}</strong><br />
                                    {org.city && <span style={{ fontSize: '12px' }}>{org.city}, {org.country}<br /></span>}
                                    <span style={{ fontSize: '11px', color: '#666' }}>{org.sectorPrimary}</span>
                                    <br />
                                    <span style={{ fontSize: '11px', color: '#2563eb', textDecoration: 'underline' }}>Ver detalle</span>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MarkerClusterGroup>
        </MapContainer>
    );
}
