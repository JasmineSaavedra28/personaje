import type { Arma } from "./Arma";
import type { Habilidad } from "./Habilidad";
import type { AparienciaHeroe, DatosPersonaje } from "./types";

/** Héroe que agrega un arma y una habilidad y administra sus recursos. */
export class Personaje {
    private energia: number;
    private mana: number;
    private aura = 0;

    private readonly nombre: string;
    private readonly descripcion: string;
    private readonly apariencia: AparienciaHeroe;
    private readonly vidaMaxima: number;
    private readonly energiaMaxima: number;
    private readonly manaMaximo: number;
    private readonly armaInicial: Arma;
    private readonly habilidadInicial: Habilidad;
    private arma: Arma;
    private habilidad: Habilidad;
    private vida: number;

    /** Crea un héroe a partir de su perfil y conserva su equipo inicial. */
    constructor(datos: DatosPersonaje) {
        this.nombre = datos.nombre;
        this.descripcion = datos.descripcion;
        this.apariencia = datos.apariencia;
        this.vidaMaxima = datos.vidaMaxima;
        this.energiaMaxima = datos.energiaMaxima;
        this.manaMaximo = datos.manaMaximo;
        this.armaInicial = datos.arma;
        this.habilidadInicial = datos.habilidad;
        this.arma = datos.arma;
        this.habilidad = datos.habilidad;
        this.vida = datos.vidaMaxima;
        this.energia = datos.energiaMaxima;
        this.mana = datos.manaMaximo;
    }

    /** Ejecuta el ataque del arma que tiene equipada el héroe. */
    atacar(): void {
        console.log(`${this.nombre} ataca:`);
        this.arma.atacar();
    }

    /** Activa la habilidad que tiene equipada el héroe. */
    usarHabilidad(): void {
        console.log(`${this.nombre} utiliza una habilidad:`);
        this.habilidad.usar();
    }

    /** Reemplaza el arma agregada al héroe. */
    cambiarArma(nuevaArma: Arma): void {
        this.arma = nuevaArma;
        console.log(`${this.nombre} ahora utiliza ${nuevaArma.getNombre()}.`);
    }

    /** Reemplaza la habilidad agregada al héroe. */
    cambiarHabilidad(nuevaHabilidad: Habilidad): void {
        this.habilidad = nuevaHabilidad;
        console.log(`${this.nombre} ahora tiene ${nuevaHabilidad.getNombre()}.`);
    }

    /** Restaura el arma y la habilidad iniciales del perfil. */
    restaurarEquipoInicial(): void {
        this.arma = this.armaInicial;
        this.habilidad = this.habilidadInicial;
    }

    /** Reduce la vida sin permitir que baje de cero. */
    recibirDanio(danio: number): void {
        this.vida = Math.max(0, this.vida - danio);
        console.log(`${this.nombre} recibió ${danio} puntos de daño.`);
    }

    /** Cura hasta el máximo de vida y devuelve cuánto se recuperó. */
    curar(cantidad: number): number {
        const vidaAnterior = this.vida;
        this.vida = Math.min(this.vidaMaxima, this.vida + cantidad);
        return this.vida - vidaAnterior;
    }

    /** Restaura la vida al total o a la cantidad indicada. */
    restaurarVida(cantidad: number = this.vidaMaxima): void {
        this.vida = Math.min(this.vidaMaxima, Math.max(0, cantidad));
    }

    /** Levanta al héroe con media vida y recursos sin perder aura ni equipo. */
    continuarTrasDerrota(): void {
        this.vida = Math.ceil(this.vidaMaxima / 2);
        this.energia = Math.ceil(this.energiaMaxima / 2);
        this.mana = Math.ceil(this.manaMaximo / 2);
    }

    /** Gasta energía si alcanza y no altera el recurso si falta. */
    usarEnergia(cantidad: number): boolean {
        if (this.energia < cantidad) {
            return false;
        }
        this.energia -= cantidad;
        return true;
    }

    /** Gasta maná si alcanza y no altera el recurso si falta. */
    usarMana(cantidad: number): boolean {
        if (this.mana < cantidad) {
            return false;
        }
        this.mana -= cantidad;
        return true;
    }

    /** Suma aura hasta su máximo y devuelve la cantidad añadida. */
    ganarAura(cantidad: number): number {
        const auraAnterior = this.aura;
        this.aura = Math.min(this.getAuraMaxima(), this.aura + cantidad);
        return this.aura - auraAnterior;
    }

    /** Consume toda el aura únicamente cuando está completa. */
    usarAura(): boolean {
        if (this.aura < this.getAuraMaxima()) {
            return false;
        }
        this.aura = 0;
        return true;
    }

    /** Recupera energía sin superar el máximo del perfil. */
    recuperarEnergia(cantidad: number): number {
        const energiaAnterior = this.energia;
        this.energia = Math.min(this.energiaMaxima, this.energia + cantidad);
        return this.energia - energiaAnterior;
    }

    /** Recupera maná sin superar el máximo del perfil. */
    recuperarMana(cantidad: number): number {
        const manaAnterior = this.mana;
        this.mana = Math.min(this.manaMaximo, this.mana + cantidad);
        return this.mana - manaAnterior;
    }

    /** Restaura los recursos de inicio y vacía el aura. */
    restaurarRecursos(): void {
        this.energia = this.energiaMaxima;
        this.mana = this.manaMaximo;
        this.aura = 0;
    }

    /** Devuelve el nombre del héroe. */
    getNombre(): string {
        return this.nombre;
    }

    /** Devuelve el texto descriptivo del perfil. */
    getDescripcion(): string {
        return this.descripcion;
    }

    /** Devuelve la apariencia que corresponde al héroe. */
    getApariencia(): AparienciaHeroe {
        return this.apariencia;
    }

    /** Devuelve la vida actual. */
    getVida(): number {
        return this.vida;
    }

    /** Devuelve la vida máxima del perfil. */
    getVidaMaxima(): number {
        return this.vidaMaxima;
    }

    /** Devuelve la energía actual. */
    getEnergia(): number {
        return this.energia;
    }

    /** Devuelve la energía máxima del perfil. */
    getEnergiaMaxima(): number {
        return this.energiaMaxima;
    }

    /** Devuelve el maná actual. */
    getMana(): number {
        return this.mana;
    }

    /** Devuelve el maná máximo del perfil. */
    getManaMaximo(): number {
        return this.manaMaximo;
    }

    /** Devuelve el aura acumulada. */
    getAura(): number {
        return this.aura;
    }

    /** Devuelve el aura necesaria para activar el despertar. */
    getAuraMaxima(): number {
        return 100;
    }

    /** Devuelve el arma agregada actualmente al héroe. */
    getArma(): Arma {
        return this.arma;
    }

    /** Devuelve la habilidad agregada actualmente al héroe. */
    getHabilidad(): Habilidad {
        return this.habilidad;
    }
}
