# LODO Map - Plan de Modernización UI/UX

## Resumen Ejecutivo

Esta modernización transforma LODO Map de una aplicación funcional a un producto SaaS profesional usando **Tailwind CSS + shadcn/ui**.

### Cambios Visuales Principales:
- ✨ Header moderno con logo, búsqueda global y contador
- 🗺️ Mapa más prominente con sidebar elegante
- 🎨 Filtros en acordeón con chips activos
- 📋 Lista de resultados tipo cards
- 🎭 Modal de detalle con secciones organizadas
- 👨‍💼 Admin dashboard profesional con tabla moderna
- 🎯 Toast notifications (Sonner)
- ⚡ Skeleton loaders y empty states

---

## FASE 1: Setup Inicial (5 min)

### Comandos a ejecutar:

```bash
cd frontend

# Core dependencies
npm install -D tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge lucide-react sonner

# Radix UI (shadcn base)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-accordion @radix-ui/react-label @radix-ui/react-slot
```

### Archivos de configuración ya creados:
- ✅ `tailwind.config.js`
- ✅ `postcss.config.js`

---

## FASE 2: Componentes UI Base (shadcn)

Crear carpeta `src/components/ui/` con componentes reutilizables:

1. **button.jsx** - Botones con variantes
2. **card.jsx** - Cards para resultados y admin
3. **badge.jsx** - Para tags, status, etc.
4. **input.jsx** - Inputs de formulario
5. **label.jsx** - Labels de formulario
6. **select.jsx** - Dropdowns de filtros
7. **switch.jsx** - Toggle "Solo con coordenadas"
8. **dialog.jsx** - Modales
9. **accordion.jsx** - Filtros colapsables
10. **skeleton.jsx** - Loading states

---

## FASE 3: Layout y Estructura

### Crear:
- `src/lib/utils.js` - Helper para className merging
- `src/components/layout/AppHeader.jsx` - Header global
- `src/components/layout/AppShell.jsx` - Layout wrapper

---

## FASE 4: Página del Mapa (Refactor)

### Componentes a crear/refactorizar:
- `src/pages/MapPage.jsx` - Página principal
- `src/components/map/MapView.jsx` - Mapa Leaflet (mantener lógica)
- `src/components/filters/FiltersPanel.jsx` - Panel de filtros moderno
- `src/components/filters/ActiveFilters.jsx` - Chips de filtros activos
- `src/components/results/ResultsList.jsx` - Lista de resultados
- `src/components/results/ResultCard.jsx` - Card individual
- `src/components/detail/OrgDetailDrawer.jsx` - Detalle en drawer

---

## FASE 5: Admin Dashboard

### Componentes a crear/refactorizar:
- `src/pages/AdminPage.jsx` - Dashboard admin
- `src/components/admin/AdminTable.jsx` - Tabla de organizaciones
- `src/components/admin/OrgFormDrawer.jsx` - Formulario en drawer
- `src/components/admin/LifecycleButtons.jsx` - Botones de estado

---

## FASE 6: Estilos Globales

Reemplazar `src/index.css` con:
- Variables CSS de shadcn
- Reset de Tailwind
- Estilos de Leaflet
- Utilidades custom

---

## Decisiones de Diseño

### Colores (Light Mode):
- **Primary**: Blue 600 (#2563eb) - Acciones principales
- **Secondary**: Slate 100 (#f1f5f9) - Backgrounds
- **Accent**: Emerald 500 (#10b981) - Success/Published
- **Destructive**: Red 500 (#ef4444) - Delete/Archive
- **Muted**: Slate 500 (#64748b) - Texto secundario

### Tipografía:
- **Font**: Inter (Google Fonts)
- **Sizes**: text-sm (filtros), text-base (contenido), text-lg (títulos)

### Espaciado:
- **Padding**: p-4 (16px) para cards, p-6 (24px) para modales
- **Gap**: gap-4 entre elementos, gap-6 entre secciones

### Bordes:
- **Radius**: rounded-lg (8px) para cards, rounded-md (6px) para inputs

---

## Compatibilidad Mantenida

✅ **Endpoints**: No se modifican
✅ **Lógica de negocio**: Intacta
✅ **Leaflet**: Funciona igual (iconos, clustering, bbox)
✅ **Debounce**: Mantenido en filtros
✅ **React Router**: Rutas `/` y `/admin`

---

## Testing Checklist

### Mapa Público:
- [ ] Mapa carga correctamente
- [ ] Filtros funcionan (country, sector, type, stage, status)
- [ ] Búsqueda por texto (q)
- [ ] Switch "Solo con coordenadas"
- [ ] Chips de filtros activos se pueden quitar
- [ ] Click en resultado centra mapa
- [ ] Modal de detalle muestra toda la info
- [ ] Links externos funcionan
- [ ] Clustering de markers
- [ ] Responsive en mobile

### Admin Dashboard:
- [ ] Tabla muestra todas las organizaciones
- [ ] Búsqueda funciona
- [ ] Botón "Nueva organización" abre formulario
- [ ] Formulario valida campos requeridos
- [ ] Crear organización (DRAFT)
- [ ] Enviar a revisión (IN_REVIEW)
- [ ] Publicar (PUBLISHED) - valida checklist
- [ ] Archivar (ARCHIVED)
- [ ] Geocoding funciona
- [ ] Toast notifications aparecen
- [ ] Responsive en mobile

---

## Próximos Pasos

1. **Ejecutar comandos de FASE 1**
2. **Revisar archivos generados** (voy a crear los componentes críticos)
3. **Copiar/pegar código** en los archivos correspondientes
4. **Ejecutar `npm run dev`**
5. **Probar checklist**

---

**Nota**: Voy a generar los archivos más importantes en los siguientes pasos. La modernización es grande pero incremental - puedes ir probando cada fase.
