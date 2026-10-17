import type { Arma } from "./Arma";
import type { Habilidad } from "./Habilidad";

/** Formas gráficas disponibles para las armas del juego. */
export type FormaArma = "sword" | "bow" | "hammer";

/** Formas gráficas disponibles para las habilidades del juego. */
export type FormaHabilidad = "healing" | "shield" | "arcane";

/** Apariencias disponibles para los héroes jugables. */
export type AparienciaHeroe = "warrior" | "archer";

/** Propiedades necesarias para crear un arma. */
export interface DatosArma {
    nombre: string;
    danio: number;
    icono?: string;
    descripcion?: string;
    costoEnergia?: number;
    forma?: FormaArma;
}

/** Propiedades necesarias para crear una habilidad. */
export interface DatosHabilidad {
    nombre: string;
    poder: number;
    icono?: string;
    descripcion?: string;
    costoMana?: number;
    forma?: FormaHabilidad;
}

/** Propiedades de un héroe y los objetos que agrega. */
export interface DatosPersonaje {
    nombre: string;
    descripcion: string;
    apariencia: AparienciaHeroe;
    vidaMaxima: number;
    energiaMaxima: number;
    manaMaximo: number;
    arma: Arma;
    habilidad: Habilidad;
}

/** Resultado de un ataque contra el maniquí de práctica. */
export interface ResultadoAtaque {
    danioRecibido: number;
    bloqueado: boolean;
    derrotado: boolean;
}
