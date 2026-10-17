import type { DatosArma, FormaArma } from "./types";

/** Arma equipable con daño, coste de energía y representación visual. */
export class Arma {
    private readonly nombre: string;
    private readonly danio: number;
    readonly icono: string;
    readonly descripcion: string;
    private readonly costoEnergia: number;
    readonly forma: FormaArma;

    /** Crea el arma a partir de sus propiedades nombradas. */
    constructor(datos: DatosArma) {
        this.nombre = datos.nombre;
        this.danio = datos.danio;
        this.icono = datos.icono ?? "⚔️";
        this.descripcion = datos.descripcion ?? "Arma lista para el combate.";
        this.costoEnergia = datos.costoEnergia ?? 20;
        this.forma = datos.forma ?? "sword";
    }

    /** Registra en consola el ataque de esta arma. */
    atacar(): void {
        console.log(`Ataque con ${this.nombre}: ${this.danio} puntos de daño.`);
    }

    /** Devuelve el daño base que inflige el arma. */
    getDanio(): number {
        return this.danio;
    }

    /** Devuelve el nombre que se muestra en la interfaz. */
    getNombre(): string {
        return this.nombre;
    }

    /** Devuelve la energía necesaria para atacar con el arma. */
    getCostoEnergia(): number {
        return this.costoEnergia;
    }
}
