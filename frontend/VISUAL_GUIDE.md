# Guía Visual - Nuevo Layout de TiCaShop ERP

## 📐 Estructura Completa

```
╔════════════════════════════════════════════════════════════════════╗
║  🛍️ TiCaShop LATAM                    Usuario: admin │ Rol: Admin │ Cerrar ║
╚════════════════════════════════════════════════════════════════════╝
┌────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ ┌─────────────────────────────────────────────┐│
│ │   📋 MENÚ       │ │  Contenido Principal                        ││
│ │                 │ │  ┌──────────────────────────────────────┐   ││
│ │ ┌─────────────┐ │ │  │ Título de la Página              │   ││
│ │ │📦 Productos │ │ │  └──────────────────────────────────────┘   ││
│ │ ├─────────────┤ │ │                                              ││
│ │ │👥 Clientes  │ │ │  ┌──────────────────────────────────────┐   ││
│ │ ├─────────────┤ │ │  │ Tabla o Formulario                │   ││
│ │ │📊 Stock     │ │ │  │                                  │   ││
│ │ ├─────────────┤ │ │  │                                  │   ││
│ │ │💬 Cotiz.    │ │ │  └──────────────────────────────────────┘   ││
│ │ ├─────────────┤ │ │                                              ││
│ │ │📝 Órdenes   │ │ │                                              ││
│ │ ├─────────────┤ │ │                                              ││
│ │ │🧾 Facturas  │ │ │                                              ││
│ │ ├─────────────┤ │ │  (Scroll si hay más contenido)              ││
│ │ │👔 Empleados │ │ │                                              ││
│ │ ├─────────────┤ │ │                                              ││
│ │ │🏖️ Vacac.    │ │ │                                              ││
│ │ ├─────────────┤ │ │                                              ││
│ │ │🎫 Tickets   │ │ │                                              ││
│ │ └─────────────┘ │ │                                              ││
│ │                 │ │                                              ││
│ │ © 2025 TiCaShop │ │                                              ││
│ └─────────────────┘ └─────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

## 🎨 Colores y Estilos

### Topbar
```
Gradiente: #a855f7 → #d946ef
Altura: 56px
Color Texto: Blanco
Sombra: Sutil (--shadow-lg)
```

### Sidebar
```
Ancho: 280px
Fondo: Blanco (#ffffff)
Borde Derecho: 1px sólido #f3e8ff
Hover de Botón: Fondo púrpura 5% + borde púrpura
Activo: Fondo púrpura 10% + borde púrpura 3px izquierdo
```

### Content Area
```
Fondo: Gradiente #f3f0ff → #faf5ff
Padding: 24px
Overflow-Y: Auto
Scrollbar: #d8b4fe (hover: #a855f7)
```

## 📱 Responsive Breakpoints

### Desktop (> 1200px)
```
Sidebar: 280px (fijo)
Content: Flex 1
Layout: Horizontal (sidebar izq, content der)
```

### Tablet (768px - 1200px)
```
Sidebar: 200px
Content: Flex 1
Layout: Horizontal (ajustado)
```

### Mobile (< 768px)
```
Topbar: Flex-wrap activado
Sidebar: Horizontal bajo topbar
  - Dirección: Row
  - Overflow-X: Auto
  - Max-Height: 200px
  - Botones: Sin border-left, border-bottom activo

Content: Full width
```

## 🔤 Tipografía

### Topbar
- Logo: 1.5rem, Bold 800
- Usuario: 0.9rem, Medium 500

### Sidebar
- Header: 0.85rem, Bold 700, UPPERCASE
- Botón: 0.95rem, Medium 500
- Footer: 0.85rem, Light

### Content
- Título Principal: 2rem, Bold 800
- Sección: 1.75rem, Bold 700
- Párrafo: 0.95rem, Regular

## 🎯 Estados de Botones del Sidebar

### Normal
```
Fondo: Transparente
Color: #374151 (gris oscuro)
Border-Left: Transparente 3px
Transición: 0.2s
```

### Hover
```
Fondo: rgba(168, 85, 247, 0.05)
Color: #a855f7 (púrpura)
Border-Left: #a855f7 3px
```

### Active
```
Fondo: linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)
Color: #a855f7 (púrpura)
Border-Left: #a855f7 3px
Font-Weight: 600
```

## 🌍 Comportamiento en Diferentes Dispositivos

### Desktop
- Todo visible simultaneamente
- Sidebar siempre accesible
- Buena usabilidad

### Tablet
- Sidebar más estrecho pero visible
- Contenido se ajusta
- Mantiene navegación fácil

### Móvil
- Sidebar horizontal (tipo tabs)
- Mucho mejor para vertical scrolling
- Navegación horizontal bajo topbar
- Contenido ocupa toda la pantalla

## 💡 Ejemplos de Navegación

### Hacer click en un botón:
```javascript
<Link to="/productos">
  <button className={vista === 'productos' ? 'active' : ''}>
    📦 Productos
  </button>
</Link>
```

### Sidebar se vería así:
```
┌──────────────────────┐
│  📋 MENÚ             │
├──────────────────────┤
│ 📦 Productos (activo)│ ← Border-left púrpura
│ 👥 Clientes         │
│ 📊 Stock            │
│ 💬 Cotizaciones     │
│ ...                 │
└──────────────────────┘
```

## 🖼️ Iconos Utilizados

```
📦 Productos
👥 Clientes
📊 Stock
💬 Cotizaciones
📝 Órdenes de Compra
🧾 Facturas
👔 Empleados
🏖️ Vacaciones
🎫 Tickets
🔧 Recuperación
🌍 Compras Internacionales
```

## 📊 Dimensiones

```
Topbar Height: 56px
Sidebar Width (Desktop): 280px
Sidebar Width (Tablet): 200px
Sidebar Max-Height (Mobile): 200px

Content Padding:
  - Desktop: 24px
  - Tablet: 20px
  - Mobile: 12px-16px

Border Radius: 16px (general)
```

## ✨ Efectos y Animaciones

### Transiciones suaves:
```css
transition: all 0.2s ease;    /* Botones sidebar */
transition: all 0.3s ease;    /* Formularios */
box-shadow: 0.3s ease;        /* Cards y elementos */
```

### Hover Effects:
```
Botones: Cambio color + hover visual
Cards: Sombra aumenta + elevación
Inputs: Border color cambia
```

## 🎯 UX Tips

1. **Navegación Clara**: El sidebar siempre visible (desktop)
2. **Indicadores**: Botón activo resaltado
3. **Espaciado**: Suficiente para no sentir apretado
4. **Colores**: Contraste bueno para legibilidad
5. **Responsividad**: Natural en todos los tamaños

---

**Última actualización**: 17 Noviembre 2025
**Versión**: 1.0
