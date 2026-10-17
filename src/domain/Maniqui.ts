import type { ResultadoAtaque } from "./types";

/** Objetivo de práctica que gana vida y defensa con cada nivel. */
export class Maniqui {
    private vida: number;
    private golpesRecibidos = 0;

    /** Crea el objetivo y calcula su vida inicial según el nivel. */
    constructor(private nivel: number) {
        this.vida = this.getVidaMaxima();
    }

    /** Aplica daño y reduce parte del golpe en los turnos de defensa. */
    recibirAtaque(danio: number): ResultadoAtaque {
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
