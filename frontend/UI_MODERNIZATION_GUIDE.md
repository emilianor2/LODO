# LODO Map - UI Modernization Guide

## 1. Instalar Dependencias

```bash
cd frontend

# Tailwind CSS + PostCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui dependencies
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-accordion @radix-ui/react-label @radix-ui/react-slot

# React Router (ya instalado, verificar)
npm install react-router-dom

# Leaflet (ya instalado, verificar)
npm install leaflet react-leaflet react-leaflet-cluster

# Utilities
npm install sonner  # Para toast notifications elegantes
```

## 2. Configuración Tailwind

Reemplazar `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

## 3. Estructura de Archivos

```
frontend/src/
├── components/
│   ├── ui/              # shadcn components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── select.jsx
│   │   ├── switch.jsx
│   │   ├── badge.jsx
│   │   ├── accordion.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   └── skeleton.jsx
│   ├── layout/
│   │   ├── AppHeader.jsx
│   │   └── AppShell.jsx
│   ├── map/
│   │   ├── MapView.jsx
│   │   └── MapLoading.jsx
│   ├── filters/
│   │   ├── FiltersPanel.jsx
│   │   ├── FilterSection.jsx
│   │   └── ActiveFilters.jsx
│   ├── results/
│   │   ├── ResultsList.jsx
│   │   └── ResultCard.jsx
│   ├── detail/
│   │   └── OrgDetailDrawer.jsx
│   └── admin/
│       ├── AdminTable.jsx
│       ├── OrgFormDrawer.jsx
│       └── LifecycleButtons.jsx
├── pages/
│   ├── MapPage.jsx
│   └── AdminPage.jsx
├── lib/
│   └── utils.js
├── services/
│   └── api.js (mantener existente)
├── App.jsx
├── main.jsx
└── index.css (reemplazar)
```

## 4. Próximos Pasos

1. Aplicar configuración Tailwind
2. Crear componentes UI base (shadcn)
3. Refactorizar páginas principales
4. Implementar nuevos componentes
5. Testing manual

---

**Nota**: Voy a generar el código completo en los siguientes mensajes.
