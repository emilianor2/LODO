# 🧪 Guía de Testing - Fase 1

## Antes de Probar

### 1. Verifica que MapView.jsx exista
El archivo `src/components/MapView.jsx` debe existir con tu código de Leaflet.

Si falta, aquí está una versión compatible:

```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ organizations, onBboxChange, onMarkerClick, centeredLocation }) {
    const center = centeredLocation || [0, 0];
    const zoom = centeredLocation ? 13 : 2;

    return (
        <div className="h-full w-full">
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                whenReady={(map) => {
                    if (onBboxChange) {
                        const updateBbox = () => {
                            const bounds = map.target.getBounds();
                            const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
                            onBboxChange(bbox);
                        };
                        map.target.on('moveend', updateBbox);
                    }
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MarkerClusterGroup chunkedLoading>
                    {organizations.map(org => {
                        if (!org.lat || !org.lng) return null;
                        return (
                            <Marker
                                key={org.id}
                                position={[org.lat, org.lng]}
                                eventHandlers={{
                                    click: () => onMarkerClick?.(org.id)
                                }}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        <strong>{org.name}</strong>
                                        <br />
                                        {org.city}, {org.country}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
```

---

## Pasos de Testing

### 1. Inicia el Dev Server
```bash
cd frontend
npm run dev
```

### 2. Abre el Navegador
Navega a `http://localhost:5173`

### 3. Checklist Visual

#### Header
- [ ] Logo "LODO Map" visible
- [ ] Búsqueda funciona (campo de texto)
- [ ] Contador de resultados actualiza
- [ ] Botón "Admin" presente

#### Sidebar (Filtros)
- [ ] Panel de filtros visible a la izquierda
- [ ] Dropdowns muestran opciones con counts
- [ ] Cambiar un filtro muestra el chip activo
- [ ] Click en X del chip quita el filtro
- [ ] Botón "Resetear" limpia todos los filtros
- [ ] Checkbox "Solo con coordenadas" funciona

#### Lista de Resultados
- [ ] Aparece debajo de los filtros
- [ ] Cards con nombre, ubicación y badges
- [ ] Click en card centra el mapa y abre detalle
- [ ] Scroll funciona si hay +20 resultados

#### Mapa
- [ ] Mapa ocupa el espacio principal
- [ ] Markers visibles
- [ ] Clustering funciona (zoom in/out)
- [ ] Click en marker abre detalle
- [ ] Popup muestra nombre y ubicación

#### Modal de Detalle
- [ ] Se abre al click en resultado o marker
- [ ] Muestra descripción
- [ ] Muestra clasificación (tipo, sector, etapa, estado)
- [ ] Muestra ubicación
- [ ] Links funcionan (website, LinkedIn, etc.)
- [ ] Tags/tecnología/impacto visible si existen
- [ ] Botón X cierra el modal

---

## Problemas Comunes

### ❌ Problema: Pantalla en blanco
**Solución**: Abre la consola del navegador (F12) y busca errores.
- Si dice "Cannot find module 'MapView'", crea el archivo como arriba
- Si dice error de Leaflet, verifica que esté en package.json

### ❌ Problema: Estilos no se aplican
**Solución**: 
```bash
# Detén el servidor y reinicia
npm run dev
```

### ❌ Problema: Markers no aparecen
**Solución**: Verifica que:
1. Backend esté corriendo (`go run ./cmd/api`)
2. Organizaciones tengan lat/lng
3. Consola no muestre errores de CORS

### ❌ Problema: Filtros no funcionan
**Solución**: Verifica la consola. Debería hacer requests a:
- `GET /public/organizations/aggregates`
- `GET /public/organizations?country=...`

---

## Si Todo Funciona ✅

Deberías ver:
- ✨ UI moderna y limpia
- 🎨 Colores azules (primary)
- 📱 Sidebar organizada
- 🗺️ Mapa prominente
- 🎯 Interacciones suaves
- 💬 Modal de detalle elegante

---

## Si Hay Problemas ⚠️

1. **Lee los errores de consola** (F12)
2. **Verifica que el backend esté corriendo**
3. **Comprueba que los componentes existan**:
   ```
   src/components/MapView.jsx
   src/components/FiltersPanel.jsx
   src/components/ResultsList.jsx
   src/components/OrgDetailModal.jsx
   ```

---

## Siguiente Paso

Una vez que confirmes que la Fase 1 funciona, avísame para:

🚀 **Fase 2: Admin Dashboard Completo**
- Tabla moderna con sorting
- Formulario en drawer/modal
- Botones de lifecycle
- Estados de carga
- Validaciones visuales

---

**Tiempo estimado de testing**: 5-10 minutos

¡Avísame cómo te va! 🎉
