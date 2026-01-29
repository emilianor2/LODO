import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

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

            <MarkerClusterGroup chunkedLoading>
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
