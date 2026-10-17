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

En pantallas pequeñas, los botones de combate permanecen fijos en la parte inferior para facilitar el uso táctil.

## Estructura del proyecto

```text
.
├── index.html          # Documento HTML de entrada.
├── index.tsx           # Inicialización, interfaz y flujo del juego.
├── style.css           # Estilos, ilustraciones de collage y animaciones.
├── src/
│   ├── catalog.ts      # Catálogos de armas, habilidades y héroes.
│   ├── template.ts     # Estructura HTML de las pantallas.
│   └── domain/
│       ├── Arma.ts      # Armas: daño, energía y apariencia.
│       ├── Habilidad.ts # Habilidades: poder, maná y apariencia.
│       ├── Maniqui.ts   # Objetivo de práctica y su progresión.
│       ├── Personaje.ts # Héroe, recursos y equipo agregado.
│       ├── types.ts     # Tipos de configuración y resultados.
│       └── index.ts     # Exportaciones para importar el dominio.
├── package.json        # Dependencias y comandos del proyecto.
└── tsconfig.json       # Configuración estricta de TypeScript.
```

Las clases del dominio están separadas por responsabilidad. Para usarlas desde otros módulos del proyecto, importa desde `src/domain`, que las exporta desde un solo lugar:

```ts
import { Arma, Habilidad, Personaje } from "./src/domain";
```

Los tipos de configuración se pueden importar por separado:

```ts
import type { DatosArma, DatosPersonaje } from "./src/domain";
```

Para agregar un arma nueva, crea una instancia con un objeto de propiedades nombradas y añádela al catálogo:

```ts
import { Arma } from "./src/domain";
import { armas } from "./src/catalog";

const nuevaEspada = new Arma({
    nombre: "Espada de papel",
    danio: 28,
    costoEnergia: 18,
    forma: "sword",
});

armas.push(nuevaEspada);
```

## Tecnologías

- TypeScript 5
- Vite 6
- HTML5 y CSS3
- Node.js y npm

No se utiliza un framework de interfaz. Los personajes, enemigos, armas y efectos se representan con elementos HTML y estilos CSS.
