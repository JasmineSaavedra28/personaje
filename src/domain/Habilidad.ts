import type { DatosHabilidad, FormaHabilidad } from "./types";

/** Habilidad equipable con poder, coste de maná y arte de collage. */
export class Habilidad {
    private readonly nombre: string;
    private readonly poder: number;
    readonly icono: string;
    readonly descripcion: string;
    private readonly costoMana: number;
    readonly forma: FormaHabilidad;

    /** Crea la habilidad a partir de sus propiedades nombradas. */
    constructor(datos: DatosHabilidad) {
        this.nombre = datos.nombre;
        this.poder = datos.poder;
        this.icono = datos.icono ?? "✦";
        this.descripcion = datos.descripcion ?? "Habilidad especial del personaje.";
        this.costoMana = datos.costoMana ?? datos.poder;
        this.forma = datos.forma ?? "healing";
    }

    /** Registra la activación de la habilidad y su poder base. */
    usar(): void {
        console.log(`${this.nombre} activada: ${this.poder} puntos de poder.`);
    }

    /** Devuelve el poder base de la habilidad. */
    getPoder(): number {
        return this.poder;
    }

    /** Devuelve el nombre que se muestra en la interfaz. */
    getNombre(): string {
        return this.nombre;
    }

    /** Devuelve el maná necesario para usar la habilidad. */
    getCostoMana(): number {
        return this.costoMana;
    }
}
