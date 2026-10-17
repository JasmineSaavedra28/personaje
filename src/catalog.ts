import { Arma, Habilidad, Personaje } from "./domain";

/** Armas disponibles para equipar durante la aventura. */
export const armas = [
    new Arma({
        nombre: "Espada de fuego",
        danio: 30,
        icono: "⚔️",
        descripcion: "Corta el aire con una llamarada.",
        costoEnergia: 20,
        forma: "sword",
    }),
    new Arma({
        nombre: "Arco mágico",
        danio: 20,
        icono: "🏹",
        descripcion: "Flechas certeras imbuidas de magia.",
        costoEnergia: 15,
        forma: "bow",
    }),
    new Arma({
        nombre: "Martillo de guerra",
        danio: 40,
        icono: "🔨",
        descripcion: "Un golpe pesado y demoledor.",
        costoEnergia: 30,
        forma: "hammer",
    }),
];

/** Habilidades mágicas disponibles para el grupo de héroes. */
export const habilidades = [
    new Habilidad({
        nombre: "Curación",
        poder: 25,
        icono: "💚",
        descripcion: "Recupera fuerzas en plena batalla.",
        costoMana: 20,
        forma: "healing",
    }),
    new Habilidad({
        nombre: "Escudo mágico",
        poder: 15,
        icono: "🛡️",
        descripcion: "Invoca una barrera protectora.",
        costoMana: 25,
        forma: "shield",
    }),
    new Habilidad({
        nombre: "Rayo arcano",
        poder: 35,
        icono: "⚡",
        descripcion: "Concentra energía en un rayo.",
        costoMana: 35,
        forma: "arcane",
    }),
];

/** Perfiles jugables con atuendo, recursos y equipo inicial propios. */
export const heroes = [
    new Personaje({
        nombre: "Guerrero",
        descripcion: "Resiste más daño y golpea con una espada de fuego.",
        apariencia: "warrior",
        vidaMaxima: 100,
        energiaMaxima: 100,
        manaMaximo: 60,
        arma: armas[0],
        habilidad: habilidades[0],
    }),
    new Personaje({
        nombre: "Arquero",
        descripcion: "Se mueve con ligereza y protege su equipo con un escudo.",
        apariencia: "archer",
        vidaMaxima: 85,
        energiaMaxima: 110,
        manaMaximo: 80,
        arma: armas[1],
        habilidad: habilidades[1],
    }),
];
