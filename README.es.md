# thinking-orbs-colorized

Indicadores de carga con orbes punteados para UIs de IA y agentes. Seis estados animados ajustados a mano en dos tamaños optimizados, tema claro/oscuro automático y **22 paletas de color curadas** — renderizado en un canvas 2D simple, sin WebGL ni filtros, idéntico en Chrome, Safari y Firefox.

> **Un fork coloreado, inspirado en [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) de Jakub Antalik** — la librería original de orbes punteados, ajustada con precisión, sobre la que se construye este proyecto. Todo el crédito del motor corresponde a la obra original; este fork le añade paletas de color, un sitio de producto y documentación bilingüe.

[Demos](https://bardolog1.github.io/thinking-orbs-colorized/) · [Repositorio](https://github.com/Bardolog1/thinking-orbs-colorized) · [Reportar un problema](https://github.com/Bardolog1/thinking-orbs-colorized/issues) · [English](README.md)

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

Omite `palette` para el orbe monocromático clásico. Pasa cualquiera de los 22 ids de paleta curados, un atajo CSS de color (se derivan automáticamente los rampas claro/oscuro) o un objeto de paleta en línea:

```tsx
<ThinkingOrb palette="ember" />
<ThinkingOrb palette="#0ea5e9" />                     {/* atajo → rampas derivadas */}
<ThinkingOrb palette={{ id: 'brand', light: { ink: '#7c3aed', fade: '#ede9fe' }, dark: { ink: '#c4b5fd', fade: '#1e1b4b' } }} />
```

### Las 22 paletas curadas

`mono`, `graphite`, `slate`, `paper`, `ember`, `sunset`, `aurora`, `ocean`, `arctic`, `nebula`, `ai-gradient`, `mint`, `synthwave`, `cyberpunk`, `matrix`, `macaron`, `fog`, `forest`, `moss`, `desert`, `holiday`, `midnight`. La galería del sitio muestra cada rampa en claro y oscuro.

### Superposición de `colors` por rol

Sobrescribe roles de puntos individuales — gana sobre los acentos de `palette` para los roles listados, y el tope de profundidad (fade) se mantiene del rampa base:

```tsx
<ThinkingOrb palette="ocean" colors={{ core: '#ef4444', tail: '#f59e0b' }} />
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

## Otras props

```tsx
<ThinkingOrb
  state="solving"
  size={20}
  speed={1.5}          // multiplicador sobre el ritmo del preset
  paused={false}       // congelar en el frame actual
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

## Licencia

MIT © Jakub Antalik — el autor original y el trabajo en el que se basa este fork.

Colorización, paletas, sitio y documentación bilingüe por **Bardolog1**. Fork del proyecto [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs).
