export type FormaArma = "sword" | "bow" | "hammer";
export type FormaHabilidad = "healing" | "shield" | "arcane";
export type AparienciaHeroe = "warrior" | "archer";

/** Configuración de un arma y sus detalles visuales. */
export interface DatosArma {
    nombre: string;
    danio: number;
    icono?: string;
    descripcion?: string;
    costoEnergia?: number;
    forma?: FormaArma;
}

/** Configuración de una habilidad y sus detalles visuales. */
export interface DatosHabilidad {
    nombre: string;
    poder: number;
    icono?: string;
    descripcion?: string;
    costoMana?: number;
    forma?: FormaHabilidad;
}

/** Define el perfil base, apariencia y equipo inicial de un héroe. */
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

/** Arma equipable que contiene daño, coste de energía y representación visual. */
export class Arma {
    private readonly nombre: string;
    private readonly danio: number;
    readonly icono: string;
    readonly descripcion: string;
    private readonly costoEnergia: number;
    readonly forma: FormaArma;

    /** Guarda las propiedades del arma en un objeto de configuración. */
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

/** Habilidad equipable con poder, coste de maná y arte de collage. */
export class Habilidad {
    private readonly nombre: string;
    private readonly poder: number;
    readonly icono: string;
    readonly descripcion: string;
    private readonly costoMana: number;
    readonly forma: FormaHabilidad;

    /** Guarda las propiedades de la habilidad en un objeto de configuración. */
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

/** Objetivo de práctica que gana vida y defensa con cada nivel. */
export class Maniqui {
    private vida: number;
    private golpesRecibidos = 0;

    /** Crea el objetivo y calcula su vida inicial según el nivel. */
    constructor(private nivel: number) {
        this.vida = this.getVidaMaxima();
    }

    /** Aplica daño y reduce parte del golpe en los turnos de defensa. */
    recibirAtaque(danio: number): { danioRecibido: number; bloqueado: boolean; derrotado: boolean } {
        this.golpesRecibidos += 1;
        const bloqueado = this.golpesRecibidos % 2 === 0;
        const defensa = Math.min(0.3 + (this.nivel - 1) * 0.05, 0.7);
        const danioRecibido = bloqueado ? Math.max(1, Math.ceil(danio * (1 - defensa))) : danio;

        this.vida = Math.max(0, this.vida - danioRecibido);
        return { danioRecibido, bloqueado, derrotado: this.vida === 0 };
    }

    /** Avanza de nivel y reinicia la vida y la defensa del objetivo. */
    avanzarNivel(): void {
        this.nivel += 1;
        this.vida = this.getVidaMaxima();
        this.golpesRecibidos = 0;
    }

    /** Reinicia el objetivo al primer nivel. */
    reiniciar(): void {
        this.nivel = 1;
        this.vida = this.getVidaMaxima();
        this.golpesRecibidos = 0;
    }

    /** Devuelve el nivel actual del objetivo. */
    getNivel(): number {
        return this.nivel;
    }

    /** Devuelve la vida actual del objetivo. */
    getVida(): number {
        return this.vida;
    }

    /** Calcula la vida máxima a partir del nivel actual. */
    getVidaMaxima(): number {
        return 100 + (this.nivel - 1) * 50;
    }
}

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

    /** Levanta al héroe con media vida y recursos, sin borrar su aura ni su equipo. */
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
