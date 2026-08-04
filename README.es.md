# thinking-orbs-colorized

[![npm version](https://img.shields.io/npm/v/thinking-orbs-colorized?style=flat-square)](https://www.npmjs.com/package/thinking-orbs-colorized)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Indicadores de carga con orbes punteados para UIs de IA y agentes. Seis estados animados ajustados a mano en dos tamaños optimizados, tema claro/oscuro automático y **22 paletas de color curadas** — renderizado en un canvas 2D simple, sin WebGL ni filtros, idéntico en Chrome, Safari y Firefox.

> **Un fork coloreado, inspirado en [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) de Jakub Antalik** — la librería original de orbes punteados, ajustada con precisión, sobre la que se construye este proyecto. Todo el crédito del motor corresponde a la obra original; este fork le añade paletas de color, un sitio de producto y documentación bilingüe.

[Demos](https://bardolog1.github.io/thinking-orbs-colorized/) · [Repositorio](https://github.com/Bardolog1/thinking-orbs-colorized) · [Reportar un problema](https://github.com/Bardolog1/thinking-orbs-colorized/issues) · [English](README.md)

![Vista previa de thinking orbs — estados y paletas](assets/readme/hero.png)

## Características

- **Seis estados** — `working`, `searching`, `solving`, `listening`, `composing`, `shaping`; cada uno con una animación distinta y ajustada a mano.
- **Dos tamaños optimizados** — `64` para escala de avatar de chat, `20` para texto en línea. Diseños separados, no un factor de escala.
- **Claro/oscuro automático** — resuelve desde el tema del proyecto (clase `dark` de Tailwind/shadcn o `data-theme`) o del sistema, con actualización en vivo.
- **22 paletas curadas** — o pasa cualquier color CSS y obtén rampas derivadas; registra las tuyas con `registerPalette`.
- **Accesible** — `role="img"` con `aria-label` por estado, soporte de `prefers-reduced-motion`.
- **Rendimiento** — se pausa fuera de pantalla y en pestañas ocultas, comparte un reloj, DPR limitado a 2, cero dependencias.
- **Seguro para SSR** — el canvas solo pinta en el cliente.

## Instalación

```bash
npm install thinking-orbs-colorized
```

## Inicio rápido

```tsx
import { ThinkingOrb } from 'thinking-orbs-colorized';

function Estado() {
  return <ThinkingOrb state="searching" size={64} palette="ocean" />;
}
```

## Estados

Seis verbos que un agente puede estar ejecutando, cada uno con una animación distinta:

```tsx
<ThinkingOrb state="working" />    {/* partículas en órbitas inclinadas */}
<ThinkingOrb state="searching" />  {/* un meridiano de escaneo barre el globo punteado */}
<ThinkingOrb state="solving" />    {/* las bandas se mezclan y encajan resueltas */}
<ThinkingOrb state="listening" />  {/* una onda recorre los anillos */}
<ThinkingOrb state="composing" />  {/* una banda multicapa ondulante */}
<ThinkingOrb state="shaping" />    {/* contorno punteado: círculo → triángulo → cuadrado */}
```

## Tamaños

Dos presets ajustados — diseños independientes, no un factor de escala. `64` para escala de avatar de chat, `20` para texto en línea. Cada uno lleva su propia cantidad de puntos, tamaño y ritmo:

```tsx
<ThinkingOrb state="working" size={64} />
<ThinkingOrb state="working" size={20} />
```

## Tema

`auto` (por defecto) elige el modo desde el proyecto anfitrión y se actualiza en vivo — oscuro renderiza tinta clara (para fondos oscuros), claro renderiza tinta oscura:

```tsx
<ThinkingOrb theme="auto" />   {/* por defecto — detecta desde el proyecto */}
<ThinkingOrb theme="dark" />   {/* fijar: puntos claros para fondos oscuros */}
<ThinkingOrb theme="light" />  {/* fijar: puntos oscuros para fondos claros */}
```

`auto` resuelve en tres capas:

1. un atributo `data-theme="dark|light"` o clase `dark`/`light` en un ancestro (convención de Tailwind / shadcn), observado con `MutationObserver`;
2. en su defecto `prefers-color-scheme`, suscrito a cambios en vivo del tema del sistema;
3. seguro para SSR — el canvas solo pinta en el cliente, después de resolver el tema.

## Colores y paletas

Omite `palette` para el orbe monocromático clásico. Pasa cualquiera de los 22 ids de paleta curados, un atajo CSS de color (se derivan automáticamente las rampas claro/oscuro) o un objeto de paleta en línea:

```tsx
<ThinkingOrb palette="ember" />
<ThinkingOrb palette="#0ea5e9" />                     {/* atajo → rampas derivadas */}
<ThinkingOrb palette={{ id: 'brand', light: { ink: '#7c3aed', fade: '#ede9fe' }, dark: { ink: '#c4b5fd', fade: '#1e1b4b' } }} />
```

![Galería de paletas — las 22 paletas curadas, claro y oscuro](assets/readme/palette-gallery.png)

### Las 22 paletas curadas

Cada paleta es una rampa **tinta → fondo** del mismo matiz por tema: el sustrato claro lleva tinta oscura sobre un fondo pálido, el sustrato oscuro lleva tinta clara sobre un fondo profundo. Las paletas marcadas con **Acentos** también pintan los puntos `active`/`particle` (y a veces `band`/`outline`) en un segundo matiz — el tope de profundidad (fade) siempre se mantiene el de la rampa base. Los valores de acento completos están en [`src/palette-data.ts`](src/palette-data.ts).

| Paleta | id | Claro (tinta · fondo) | Oscuro (tinta · fondo) | Acentos |
| --- | --- | --- | --- | --- |
| Mono | `mono` | ![#000000](https://img.shields.io/badge/%23000000-000000?style=flat-square) ![#ffffff](https://img.shields.io/badge/%23ffffff-ffffff?style=flat-square) | ![#ffffff](https://img.shields.io/badge/%23ffffff-ffffff?style=flat-square) ![#000000](https://img.shields.io/badge/%23000000-000000?style=flat-square) | — |
| Graphite | `graphite` | ![#454a54](https://img.shields.io/badge/%23454a54-454a54?style=flat-square) ![#eaeaeb](https://img.shields.io/badge/%23eaeaeb-eaeaeb?style=flat-square) | ![#afb5c0](https://img.shields.io/badge/%23afb5c0-afb5c0?style=flat-square) ![#1f2023](https://img.shields.io/badge/%231f2023-1f2023?style=flat-square) | — |
| Slate | `slate` | ![#385275](https://img.shields.io/badge/%23385275-385275?style=flat-square) ![#e8eaee](https://img.shields.io/badge/%23e8eaee-e8eaee?style=flat-square) | ![#97b2d8](https://img.shields.io/badge/%2397b2d8-97b2d8?style=flat-square) ![#1a2028](https://img.shields.io/badge/%231a2028-1a2028?style=flat-square) | — |
| Paper | `paper` | ![#725b3b](https://img.shields.io/badge/%23725b3b-725b3b?style=flat-square) ![#f6f5f4](https://img.shields.io/badge/%23f6f5f4-f6f5f4?style=flat-square) | ![#ebe2d6](https://img.shields.io/badge/%23ebe2d6-ebe2d6?style=flat-square) ![#2d251b](https://img.shields.io/badge/%232d251b-2d251b?style=flat-square) | — |
| Ember | `ember` | ![#8b3d23](https://img.shields.io/badge/%238b3d23-8b3d23?style=flat-square) ![#f0e8e6](https://img.shields.io/badge/%23f0e8e6-f0e8e6?style=flat-square) | ![#f4997b](https://img.shields.io/badge/%23f4997b-f4997b?style=flat-square) ![#2e1b14](https://img.shields.io/badge/%232e1b14-2e1b14?style=flat-square) | ✓ |
| Sunset | `sunset` | ![#8b5323](https://img.shields.io/badge/%238b5323-8b5323?style=flat-square) ![#f0eae6](https://img.shields.io/badge/%23f0eae6-f0eae6?style=flat-square) | ![#f4b47b](https://img.shields.io/badge/%23f4b47b-f4b47b?style=flat-square) ![#2e2014](https://img.shields.io/badge/%232e2014-2e2014?style=flat-square) | ✓ |
| Aurora | `aurora` | ![#238b68](https://img.shields.io/badge/%23238b68-238b68?style=flat-square) ![#e6f0ec](https://img.shields.io/badge/%23e6f0ec-e6f0ec?style=flat-square) | ![#7bf4cc](https://img.shields.io/badge/%237bf4cc-7bf4cc?style=flat-square) ![#142e26](https://img.shields.io/badge/%23142e26-142e26?style=flat-square) | ✓ |
| Ocean | `ocean` | ![#23578b](https://img.shields.io/badge/%2323578b-23578b?style=flat-square) ![#e6ebf0](https://img.shields.io/badge/%23e6ebf0-e6ebf0?style=flat-square) | ![#7bb8f4](https://img.shields.io/badge/%237bb8f4-7bb8f4?style=flat-square) ![#14212e](https://img.shields.io/badge/%2314212e-14212e?style=flat-square) | ✓ |
| Arctic | `arctic` | ![#297ea3](https://img.shields.io/badge/%23297ea3-297ea3?style=flat-square) ![#e6edf0](https://img.shields.io/badge/%23e6edf0-e6edf0?style=flat-square) | ![#7bd0f4](https://img.shields.io/badge/%237bd0f4-7bd0f4?style=flat-square) ![#14262e](https://img.shields.io/badge/%2314262e-14262e?style=flat-square) | ✓ |
| Nebula | `nebula` | ![#49238b](https://img.shields.io/badge/%2349238b-49238b?style=flat-square) ![#e9e6f0](https://img.shields.io/badge/%23e9e6f0-e9e6f0?style=flat-square) | ![#a77bf4](https://img.shields.io/badge/%23a77bf4-a77bf4?style=flat-square) ![#1e142e](https://img.shields.io/badge/%231e142e-1e142e?style=flat-square) | ✓ |
| AI Gradient | `ai-gradient` | ![#53238b](https://img.shields.io/badge/%2353238b-53238b?style=flat-square) ![#eae6f0](https://img.shields.io/badge/%23eae6f0-eae6f0?style=flat-square) | ![#b47bf4](https://img.shields.io/badge/%23b47bf4-b47bf4?style=flat-square) ![#20142e](https://img.shields.io/badge/%2320142e-20142e?style=flat-square) | ✓ |
| Mint | `mint` | ![#238b5a](https://img.shields.io/badge/%23238b5a-238b5a?style=flat-square) ![#e6f0eb](https://img.shields.io/badge/%23e6f0eb-e6f0eb?style=flat-square) | ![#7bf4bc](https://img.shields.io/badge/%237bf4bc-7bf4bc?style=flat-square) ![#142e22](https://img.shields.io/badge/%23142e22-142e22?style=flat-square) | ✓ |
| Synthwave | `synthwave` | ![#8b2376](https://img.shields.io/badge/%238b2376-8b2376?style=flat-square) ![#f0e6ee](https://img.shields.io/badge/%23f0e6ee-f0e6ee?style=flat-square) | ![#f47bdc](https://img.shields.io/badge/%23f47bdc-f47bdc?style=flat-square) ![#2e1429](https://img.shields.io/badge/%232e1429-2e1429?style=flat-square) | ✓ |
| Cyberpunk | `cyberpunk` | ![#8b238b](https://img.shields.io/badge/%238b238b-8b238b?style=flat-square) ![#f0e6f0](https://img.shields.io/badge/%23f0e6f0-f0e6f0?style=flat-square) | ![#f47bf4](https://img.shields.io/badge/%23f47bf4-f47bf4?style=flat-square) ![#2e142e](https://img.shields.io/badge/%232e142e-2e142e?style=flat-square) | ✓ |
| Matrix | `matrix` | ![#238b23](https://img.shields.io/badge/%23238b23-238b23?style=flat-square) ![#e6f0e6](https://img.shields.io/badge/%23e6f0e6-e6f0e6?style=flat-square) | ![#7bf47b](https://img.shields.io/badge/%237bf47b-7bf47b?style=flat-square) ![#142e14](https://img.shields.io/badge/%23142e14-142e14?style=flat-square) | ✓ |
| Macaron | `macaron` | ![#7b324b](https://img.shields.io/badge/%237b324b-7b324b?style=flat-square) ![#f5f0f1](https://img.shields.io/badge/%23f5f0f1-f5f0f1?style=flat-square) | ![#df90ab](https://img.shields.io/badge/%23df90ab-df90ab?style=flat-square) ![#2a181e](https://img.shields.io/badge/%232a181e-2a181e?style=flat-square) | ✓ |
| Fog | `fog` | ![#546978](https://img.shields.io/badge/%23546978-546978?style=flat-square) ![#eef0f1](https://img.shields.io/badge/%23eef0f1-eef0f1?style=flat-square) | ![#a8bac7](https://img.shields.io/badge/%23a8bac7-a8bac7?style=flat-square) ![#242a2e](https://img.shields.io/badge/%23242a2e-242a2e?style=flat-square) | ✓ |
| Forest | `forest` | ![#238b3d](https://img.shields.io/badge/%23238b3d-238b3d?style=flat-square) ![#e6f0e8](https://img.shields.io/badge/%23e6f0e8-e6f0e8?style=flat-square) | ![#7bf499](https://img.shields.io/badge/%237bf499-7bf499?style=flat-square) ![#142e1b](https://img.shields.io/badge/%23142e1b-142e1b?style=flat-square) | ✓ |
| Moss | `moss` | ![#5f8b23](https://img.shields.io/badge/%235f8b23-5f8b23?style=flat-square) ![#ebf0e6](https://img.shields.io/badge/%23ebf0e6-ebf0e6?style=flat-square) | ![#c2f47b](https://img.shields.io/badge/%23c2f47b-c2f47b?style=flat-square) ![#232e14](https://img.shields.io/badge/%23232e14-232e14?style=flat-square) | ✓ |
| Desert | `desert` | ![#8b6523](https://img.shields.io/badge/%238b6523-8b6523?style=flat-square) ![#f0ece6](https://img.shields.io/badge/%23f0ece6-f0ece6?style=flat-square) | ![#f4c87b](https://img.shields.io/badge/%23f4c87b-f4c87b?style=flat-square) ![#2e2514](https://img.shields.io/badge/%232e2514-2e2514?style=flat-square) | ✓ |
| Holiday | `holiday` | ![#8b2331](https://img.shields.io/badge/%238b2331-8b2331?style=flat-square) ![#f0e6e7](https://img.shields.io/badge/%23f0e6e7-f0e6e7?style=flat-square) | ![#f47b8b](https://img.shields.io/badge/%23f47b8b-f47b8b?style=flat-square) ![#2e1417](https://img.shields.io/badge/%232e1417-2e1417?style=flat-square) | ✓ |
| Midnight | `midnight` | ![#23238b](https://img.shields.io/badge/%2323238b-23238b?style=flat-square) ![#e6e6f0](https://img.shields.io/badge/%23e6e6f0-e6e6f0?style=flat-square) | ![#9797f7](https://img.shields.io/badge/%239797f7-9797f7?style=flat-square) ![#14142e](https://img.shields.io/badge/%2314142e-14142e?style=flat-square) | ✓ |

### Superposición de `colors` por rol

Sobrescribe roles de puntos individuales — gana sobre los acentos de `palette` para los roles listados, y el tope de profundidad (fade) se mantiene el de la rampa base:

```tsx
<ThinkingOrb palette="ocean" colors={{ active: '#ef4444', particle: '#f59e0b' }} />
```

Roles: `ghost`, `particle`, `field`, `active`, `band`, `outline`.

### Paletas personalizadas con `registerPalette`

```ts
import { registerPalette } from 'thinking-orbs-colorized';

registerPalette({
  id: 'brand',
  name: 'Brand',
  light: { ink: '#7c3aed', fade: '#ede9fe' },
  dark: { ink: '#c4b5fd', fade: '#1e1b4b' }
});
// ahora usable: <ThinkingOrb palette="brand" />
```

Las paletas inválidas se rechazan con una advertencia solo de desarrollo; `mono` está reservado y no puede sobrescribirse. Los ids desconocidos y los colores irresolubles siempre degradan a `mono` con una advertencia de desarrollo — la resolución nunca lanza errores. Consulta `docs/COLOR_PALETTEGuide.md` para la API completa.

![Paletas personalizadas — registro, objeto en línea, atajo CSS, superposición colors](assets/readme/custom-palettes.png)

## Props

```tsx
<ThinkingOrb
  state="solving"       // 'working' | 'searching' | 'solving' | 'listening' | 'composing' | 'shaping'
  size={64}             // 64 | 20
  theme="auto"          // 'auto' | 'dark' | 'light'
  speed={1.5}           // multiplicador sobre el ritmo del preset
  paused={false}        // congelar en el frame actual
  palette="ocean"       // id de paleta, atajo de color CSS u objeto OrbPalette
  colors={{ active: '#ef4444' }}  // superposición de tinta por rol
  aria-label="Analizando repositorio…"  // reemplaza el valor por defecto del estado
/>
```

Todas las demás props de `<canvas>` (`className`, `style`, `data-*`, …) se transmiten.

## Storybook local

Explora cada estado, tamaño, paleta y control:

```bash
npm run storybook
```

Se ejecuta en `http://localhost:6006` — historias de galería, tema y playground con controles en vivo.

## Accesibilidad y rendimiento

- `role="img"` con un `aria-label` sensato por estado incluido.
- `prefers-reduced-motion: reduce` renderiza un frame estático representativo — sin animación — y sigue el tema en vivo.
- Cada instancia se pausa automáticamente al salir de pantalla (`IntersectionObserver`) o al ocultarse la pestaña, y reanuda en fase — todas las instancias comparten un reloj.
- Solo arcos de canvas 2D: sin `ctx.filter`, sin filtros SVG, sin WebGL — los mismos píxeles en todas partes, liviano en dispositivos de gama baja. El device-pixel-ratio está limitado a 2.
- La resolución de paleta ocurre una vez por montaje y degrada con elegancia; el default monocromático mantiene su fast path byte-idéntico.

## Autor

Hecho por **Libardo Lozano** ([@Bardolog_1](https://x.com/Bardolog_1)) — un fork coloreado de [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) por Jakub Antalik y Alex Brinza.

## Licencia

MIT © Jakub Antalik — el autor original y el trabajo en el que se basa este fork.

Copyright (c) 2026 Libardo Lozano (Bardolog1) — modificaciones, paletas de color, sitio y documentación.
