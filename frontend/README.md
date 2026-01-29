# LODO Frontend - Mapa de Startups

Frontend en React + Vite + Leaflet para visualizar el ecosistema de startups.

## Configuración

1.  Asegúrate de tener el Backend corriendo en `http://localhost:8080`.
    *   Este frontend asume que el backend tiene habilitado CORS (ya incluido en el último patch del backend).

2.  Instalar dependencias:
    ```bash
    npm install
    ```

## Ejecución

Para entorno de desarrollo:

```bash
npm run dev
```

Abra el navegador en la URL que indique la terminal (usualmente `http://localhost:5173`).

## Estructura

*   `src/components/MapView.jsx`: Mapa con Leaflet, marcadores y escucha de eventos de movimiento (bbox).
*   `src/components/FiltersPanel.jsx`: Filtros dinámicos basados en la respuesta de `/aggregates`.
*   `src/components/OrgDetailModal.jsx`: Modal que carga el detalle de una organización `/public/organizations/{id}`.
*   `src/services/api.js`: Wrapper para `fetch`.

## API Integration

*   **Listado**: `GET /public/organizations`
*   **Filtros**: `GET /public/organizations/aggregates`
*   **Detalle**: `GET /public/organizations/:id`
