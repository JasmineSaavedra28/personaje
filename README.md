# Forja de Héroes

Juego web de práctica de agregación hecho con TypeScript, HTML5 y CSS. Elige un héroe, cambia su arma o habilidad y enfréntate a criaturas de collage.

## Requisitos

- Node.js (incluye npm).

## Instalar y ejecutar

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
npm run dev
```

Vite mostrará la dirección local del juego en la terminal, normalmente `http://localhost:5173/`. Abre esa dirección en el navegador.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Comprueba los tipos de TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la versión de producción generada. |

Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Cómo jugar

1. Pulsa **Elegir héroe** y selecciona al Guerrero o al Arquero. Cada uno tiene apariencia, estadísticas, arma y habilidad iniciales propias.
2. En la partida puedes equipar otras armas y habilidades desde sus tarjetas.
3. **Atacar** consume energía; **Usar habilidad** consume maná; **Concentrarse** recupera ambos recursos.
4. Los ataques y las victorias cargan el aura. Cuando se completa, puedes usar el **Despertar de papel**.
5. Al derrotar a un enemigo avanzas de nivel y ganas monedas.
6. Si pierdes, puedes pagar la mitad de tus monedas para continuar en el mismo nivel con media vida y recursos. Sin monedas, puedes reiniciar la aventura.

## Estructura del proyecto

```text
.
├── index.html          # Documento HTML de entrada.
├── index.tsx           # Inicialización, interfaz y flujo del juego.
├── style.css           # Estilos, ilustraciones de collage y animaciones.
├── src/
│   ├── catalog.ts      # Catálogos de armas, habilidades y héroes.
│   ├── domain.ts       # Clases Arma, Habilidad, Personaje y Maniqui.
│   └── template.ts     # Estructura HTML de las pantallas.
├── package.json        # Dependencias y comandos del proyecto.
└── tsconfig.json       # Configuración estricta de TypeScript.
```

## Tecnologías

- TypeScript 5
- Vite 6
- HTML5 y CSS3
- Node.js y npm

No se utiliza un framework de interfaz. Los personajes, enemigos, armas y efectos se representan con elementos HTML y estilos CSS.
