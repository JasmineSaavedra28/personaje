import { gameTemplate } from "./src/template";
import { Maniqui, type AparienciaHeroe, type FormaArma, type FormaHabilidad } from "./src/domain";
import { armas, habilidades, heroes } from "./src/catalog";
/** Contenido y estado de una tarjeta de equipo que se puede seleccionar. */
interface DatosOpcion {
    icono: string;
    nombre: string;
    descripcion: string;
    detalle: string;
    seleccionada: boolean;
    accion: "weapon" | "skill-choice";
    indice: number;
}

/** Valores necesarios para reproducir una animación del personaje. */
interface DatosAnimacionHeroe {
    accion: "attack" | "skill" | "shield" | "awakening";
    textoEfecto: string;
    bloqueado?: boolean;
}

/** Define el aspecto y el tamaño de una pieza artística reutilizable. */
interface DatosArteArma {
    forma: FormaArma;
    clase: string;
}

/** Define el aspecto de una habilidad o del poder de despertar. */
interface DatosArteHabilidad {
    forma: FormaHabilidad | "awakening";
    clase: string;
}

/** Aspecto y arma necesarios para dibujar un héroe de papel. */
interface DatosIlustracionHeroe {
    apariencia: AparienciaHeroe;
    arma: FormaArma;
    clase: string;
}

let personaje = heroes[0];

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("No se encontró el contenedor de la aplicación.");
}

// Crea portada, pantalla de derrota y campo de combate dentro del contenedor de la página.
app.innerHTML = gameTemplate;

const weaponList = document.querySelector<HTMLDivElement>("#weapon-list");
const skillList = document.querySelector<HTMLDivElement>("#skill-list");
const activityMessage = document.querySelector<HTMLParagraphElement>("#activity-message");
const heroStage = document.querySelector<HTMLDivElement>("#hero-stage");
const dummy = document.querySelector<HTMLDivElement>("#training-dummy");
const dummyHealthValue = document.querySelector<HTMLSpanElement>("#dummy-health-value");
const dummyHealthFill = document.querySelector<HTMLDivElement>("#dummy-health-fill");
const dummyHealthTrack = document.querySelector<HTMLDivElement>(".dummy-health-track");
const creature = document.querySelector<HTMLDivElement>("#creature");
const titleScreen = document.querySelector<HTMLElement>("#title-screen");
const heroSelectScreen = document.querySelector<HTMLElement>("#hero-select-screen");
const heroChoiceList = document.querySelector<HTMLDivElement>("#hero-choice-list");
const gameOverScreen = document.querySelector<HTMLElement>("#game-over-screen");
const gameShell = document.querySelector<HTMLElement>("#game-shell");
const gameOverCreature = document.querySelector<HTMLElement>("#game-over-creature");
const gameOverHero = document.querySelector<HTMLElement>("#game-over-hero");
const gameOverLevel = document.querySelector<HTMLElement>("#game-over-level");
const gameOverCoins = document.querySelector<HTMLElement>("#game-over-coins");
const gameOverCharacter = document.querySelector<HTMLElement>("#game-over-character");
const gameOverNote = document.querySelector<HTMLElement>("#game-over-note");
const continueButton = document.querySelector<HTMLButtonElement>("#continue-button");
const coinCount = document.querySelector<HTMLElement>("#coin-count");
let nivelPersonaje = 1;
const maniqui = new Maniqui(1);
let monedas = 0;
let avanzandoNivel = false;
let ataquesDesdeContraataque = 0;
let escudoPersonajeActivo = false;
let combateTerminado = false;

/** Muestra una sola pantalla de la aplicación y oculta las otras dos. */
function showScreen(screen: "title" | "hero-select" | "game" | "gameover"): void {
    if (!titleScreen || !heroSelectScreen || !gameOverScreen || !gameShell) {
        throw new Error("No se encontraron las pantallas del juego.");
    }
    titleScreen.hidden = screen !== "title";
    heroSelectScreen.hidden = screen !== "hero-select";
    gameOverScreen.hidden = screen !== "gameover";
    gameShell.hidden = screen !== "game";
}

/** Prepara un combate nuevo con equipo, nivel y recursos iniciales. */
function resetCombat(): void {
    // Restaura el perfil elegido y reinicia progreso, monedas y recursos.
    personaje.restaurarEquipoInicial();
    personaje.restaurarVida();
    personaje.restaurarRecursos();
    maniqui.reiniciar();
    nivelPersonaje = 1;
    monedas = 0;
    ataquesDesdeContraataque = 0;
    escudoPersonajeActivo = false;
    avanzandoNivel = false;
    combateTerminado = false;
    renderCharacter();
    renderDummyHealth();
    renderCreature();
    renderCoins();
    showActivity("Elige tu equipo y prepárate para la aventura.");
}

/** Mantiene visible el total de monedas durante la partida. */
function renderCoins(): void {
    if (!coinCount) {
        throw new Error("No se encontró el contador de monedas.");
    }
    coinCount.textContent = String(monedas);
}

/** Construye una silueta de papel reutilizable para tarjetas y pantallas. */
function createHeroIllustration(datos: DatosIlustracionHeroe): HTMLDivElement {
    const figure = document.createElement("div");
    figure.className = `hero-figure hero-figure--${datos.apariencia} ${datos.clase}`;
    figure.setAttribute("aria-hidden", "true");

    for (const pieceClass of [
        "figure-cape",
        "figure-cape-patch",
        "figure-head",
        "figure-neck",
        "figure-body",
        "figure-belt",
        "figure-arm figure-arm-left",
        "figure-arm figure-arm-right",
        "figure-leg figure-leg-left",
        "figure-leg figure-leg-right",
    ]) {
        const piece = document.createElement("span");
        piece.className = pieceClass;
        figure.append(piece);
    }
    const weapon = document.createElement("span");
    weapon.className = "figure-weapon";
    weapon.append(createCollageWeapon({ forma: datos.arma, clase: "hero-weapon-art" }));
    figure.append(weapon);
    return figure;
}

/** Presenta héroes distintos con su atuendo, fortalezas y equipo inicial. */
function renderHeroChoices(): void {
    if (!heroChoiceList) {
        throw new Error("No se encontró la selección de héroes.");
    }
    heroChoiceList.replaceChildren(...heroes.map((hero, index) => {
        const choice = document.createElement("button");
        choice.className = `hero-choice hero-choice--${hero.getApariencia()}`;
        choice.type = "button";
        choice.dataset.action = "choose-hero";
        choice.dataset.index = String(index);

        const portrait = document.createElement("span");
        portrait.className = "hero-card-portrait";
        portrait.append(createHeroIllustration({
            apariencia: hero.getApariencia(),
            arma: hero.getArma().forma,
            clase: "hero-choice-figure",
        }));

        const details = document.createElement("span");
        details.className = "hero-choice-details";
        const name = document.createElement("strong");
        name.className = "hero-choice-name";
        name.textContent = hero.getNombre();
        const description = document.createElement("span");
        description.className = "hero-choice-description";
        description.textContent = hero.getDescripcion();
        const stats = document.createElement("span");
        stats.className = "hero-choice-stats";
        stats.textContent = `${hero.getVidaMaxima()} VIDA · ${hero.getEnergiaMaxima()} ENERGÍA · ${hero.getManaMaximo()} MANÁ`;
        const equipment = document.createElement("span");
        equipment.className = "hero-choice-equipment";
        equipment.textContent = `${hero.getArma().getNombre()} · ${hero.getHabilidad().getNombre()}`;
        const callToAction = document.createElement("span");
        callToAction.className = "hero-choice-cta";
        callToAction.textContent = "Elegir este héroe →";
        details.append(name, description, stats, equipment, callToAction);
        choice.append(portrait, details);
        return choice;
    }));
}

/** Construye una tarjeta de selección para un arma o una habilidad. */
function createOption(datos: DatosOpcion): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `option-card${datos.seleccionada ? " selected" : ""}`;
    button.dataset.action = datos.accion;
    button.dataset.index = String(datos.indice);
    button.setAttribute("aria-pressed", String(datos.seleccionada));

    const iconElement = document.createElement("span");
    iconElement.className = "option-icon";
    if (datos.accion === "weapon" && armas[datos.indice]) {
        iconElement.append(createCollageWeapon({ forma: armas[datos.indice].forma, clase: "weapon-card-art" }));
    } else if (datos.accion === "skill-choice" && habilidades[datos.indice]) {
        iconElement.append(createCollageSkill({ forma: habilidades[datos.indice].forma, clase: "skill-card-art" }));
    } else {
        iconElement.textContent = datos.icono;
    }

    const copy = document.createElement("span");
    copy.className = "option-copy";

    const title = document.createElement("strong");
    title.textContent = datos.nombre;
    const subtitle = document.createElement("span");
    subtitle.textContent = datos.descripcion;
    copy.append(title, subtitle);

    const info = document.createElement("span");
    info.className = "option-info";
    info.textContent = datos.detalle;

    const indicator = document.createElement("span");
    indicator.className = "selection-indicator";
    indicator.textContent = datos.seleccionada ? "✓" : "+";

    button.append(iconElement, copy, info, indicator);
    return button;
}

/** Dibuja un arma como piezas HTML para conservar el estilo de papel recortado. */
function createCollageWeapon(datos: DatosArteArma): HTMLSpanElement {
    const weapon = document.createElement("span");
    weapon.className = `collage-weapon collage-weapon--${datos.forma} ${datos.clase} ${datos.clase}--${datos.forma}`;
    const pieces: Record<FormaArma, string[]> = {
        sword: ["sword-blade", "sword-edge", "sword-guard", "sword-grip", "sword-pommel", "weapon-stitch"],
        bow: ["bow-limb bow-limb-top", "bow-limb bow-limb-bottom", "bow-string", "bow-grip", "bow-arrow", "weapon-stitch"],
        hammer: ["hammer-handle", "hammer-head", "hammer-face", "hammer-wrap", "weapon-stitch"],
    };

    for (const pieceClass of pieces[datos.forma]) {
        const piece = document.createElement("span");
        piece.className = `weapon-piece ${pieceClass}`;
        weapon.append(piece);
    }
    return weapon;
}

/** Dibuja habilidades y el Despertar como recortes de color y puntadas. */
function createCollageSkill(datos: DatosArteHabilidad): HTMLSpanElement {
    const skill = document.createElement("span");
    skill.className = `collage-skill collage-skill--${datos.forma} ${datos.clase}`;
    const pieces: Record<FormaHabilidad | "awakening", string[]> = {
        healing: ["skill-heart", "skill-leaf skill-leaf-left", "skill-leaf skill-leaf-right", "skill-stitch"],
        shield: ["skill-shield", "skill-shield-core", "skill-rivet skill-rivet-left", "skill-rivet skill-rivet-right", "skill-stitch"],
        arcane: ["skill-bolt", "skill-spark skill-spark-one", "skill-spark skill-spark-two", "skill-stitch"],
        awakening: ["skill-aura-core", "skill-aura-shard skill-aura-shard-one", "skill-aura-shard skill-aura-shard-two", "skill-aura-shard skill-aura-shard-three", "skill-aura-shard skill-aura-shard-four", "skill-stitch"],
    };

    for (const pieceClass of pieces[datos.forma]) {
        const piece = document.createElement("span");
        piece.className = `skill-piece ${pieceClass}`;
        skill.append(piece);
    }
    return skill;
}

const criaturas = [
    { forma: "moth", nombre: "LA POLILLA DE PAPEL", aria: "La polilla de papel" },
    { forma: "spider", nombre: "LA ARAÑA DE TINTA", aria: "La araña de tinta" },
    { forma: "crow", nombre: "EL CUERVO REMENDADO", aria: "El cuervo remendado" },
] as const;

/** Cambia el nombre, la silueta y las piezas del enemigo según su nivel. */
function renderCreature(): void {
    const creatureLabel = document.querySelector<HTMLSpanElement>("#creature-label");
    const collageBug = document.querySelector<HTMLSpanElement>("#collage-bug");
    if (!creature || !creatureLabel || !collageBug) {
        throw new Error("No se encontraron las piezas de la criatura.");
    }

    // Rota por el catálogo para que cada nuevo nivel tenga una criatura diferente.
    const criatura = criaturas[(maniqui.getNivel() - 1) % criaturas.length];
    creature.setAttribute("aria-label", criatura.aria);
    creatureLabel.textContent = criatura.nombre;
    collageBug.className = `collage-bug collage-bug--${criatura.forma}`;
    const pieces = [
        "bug-wing bug-wing-left",
        "bug-wing bug-wing-right",
        ...Array.from({ length: 8 }, (_, index) => `bug-leg bug-leg-${index + 1}`),
        "bug-antenna bug-antenna-left",
        "bug-antenna bug-antenna-right",
        "bug-head",
        ...Array.from({ length: 6 }, (_, index) => `bug-eye bug-eye-${index + 1}`),
        "bug-beak",
        "bug-body",
        "bug-abdomen",
        "bug-stitch",
    ];

    collageBug.replaceChildren(
        ...pieces.map((className) => {
            const piece = document.createElement("span");
            piece.className = className;
            return piece;
        }),
    );
}

/** Redibuja las opciones de armas y habilidades para mostrar las selecciones actuales. */
function renderOptions(): void {
    weaponList?.replaceChildren(
        ...armas.map((arma, index) =>
            createOption({
                icono: arma.icono,
                nombre: arma.getNombre(),
                descripcion: arma.descripcion,
                detalle: `${arma.getDanio()} ATQ · ${arma.getCostoEnergia()} ENE`,
                seleccionada: personaje.getArma() === arma,
                accion: "weapon",
                indice: index,
            }),
        ),
    );

    skillList?.replaceChildren(
        ...habilidades.map((habilidad, index) =>
            createOption({
                icono: habilidad.icono,
                nombre: habilidad.getNombre(),
                descripcion: habilidad.descripcion,
                detalle: `${habilidad.getPoder()} POD · ${habilidad.getCostoMana()} MANÁ`,
                seleccionada: personaje.getHabilidad() === habilidad,
                accion: "skill-choice",
                indice: index,
            }),
        ),
    );
}

/** Sincroniza interfaz, recursos y equipo visible con el estado del personaje. */
function renderCharacter(): void {
    const arma = personaje.getArma();
    const habilidad = personaje.getHabilidad();
    const vida = personaje.getVida();
    const heroName = document.querySelector<HTMLHeadingElement>("#hero-name");
    const healthValue = document.querySelector<HTMLSpanElement>("#health-value");
    const healthMax = document.querySelector<HTMLSpanElement>("#health-max");
    const healthFill = document.querySelector<HTMLDivElement>("#health-fill");
    const healthTrack = document.querySelector<HTMLDivElement>(".health-track");
    const weaponIcon = document.querySelector<HTMLSpanElement>("#equipped-weapon-icon");
    const skillIcon = document.querySelector<HTMLSpanElement>("#equipped-skill-icon");
    const weaponName = document.querySelector<HTMLElement>("#equipped-weapon");
    const skillName = document.querySelector<HTMLElement>("#equipped-skill");
    const weaponDamage = document.querySelector<HTMLElement>("#weapon-damage");
    const skillPower = document.querySelector<HTMLElement>("#skill-power");
    const figureWeapon = document.querySelector<HTMLDivElement>("#figure-weapon");
    const heroFigure = document.querySelector<HTMLDivElement>("#hero-figure");
    const energyValue = document.querySelector<HTMLSpanElement>("#energy-value");
    const energyMax = document.querySelector<HTMLSpanElement>("#energy-max");
    const energyFill = document.querySelector<HTMLDivElement>("#energy-fill");
    const energyTrack = document.querySelector<HTMLDivElement>("#energy-track");
    const manaValue = document.querySelector<HTMLSpanElement>("#mana-value");
    const manaMax = document.querySelector<HTMLSpanElement>("#mana-max");
    const manaFill = document.querySelector<HTMLDivElement>("#mana-fill");
    const manaTrack = document.querySelector<HTMLDivElement>("#mana-track");
    const auraValue = document.querySelector<HTMLSpanElement>("#aura-value");
    const auraMax = document.querySelector<HTMLSpanElement>("#aura-max");
    const auraFill = document.querySelector<HTMLDivElement>("#aura-fill");
    const auraTrack = document.querySelector<HTMLDivElement>("#aura-track");
    const auraMeter = document.querySelector<HTMLDivElement>(".aura-meter");
    const awakeningButton = document.querySelector<HTMLButtonElement>('[data-action="aura-skill"]');
    const awakeningLabel = document.querySelector<HTMLSpanElement>("#awakening-label");
    const awakeningIcon = document.querySelector<HTMLSpanElement>("#awakening-icon");
    const heroLevel = document.querySelector<HTMLSpanElement>("#hero-level");

    if (
        !heroName || !healthValue || !healthMax || !healthFill || !healthTrack || !weaponIcon ||
        !skillIcon || !weaponName || !skillName || !weaponDamage || !skillPower || !figureWeapon ||
        !heroFigure || !heroLevel || !energyValue || !energyMax || !energyFill || !energyTrack ||
        !manaValue || !manaMax || !manaFill || !manaTrack || !auraValue || !auraMax ||
        !auraFill || !auraTrack || !auraMeter || !awakeningButton || !awakeningLabel || !awakeningIcon
    ) {
        throw new Error("Faltan elementos necesarios para mostrar el personaje.");
    }

    heroName.textContent = personaje.getNombre();
    heroLevel.textContent = `NV. ${String(nivelPersonaje).padStart(2, "0")}`;
    heroFigure.classList.remove("hero-figure--warrior", "hero-figure--archer");
    heroFigure.classList.add(`hero-figure--${personaje.getApariencia()}`);
    healthMax.textContent = String(personaje.getVidaMaxima());
    const introLevel = document.querySelector<HTMLSpanElement>("#intro-level");
    if (!introLevel) {
        throw new Error("No se encontró el nivel de la introducción.");
    }
    introLevel.textContent = String(nivelPersonaje).padStart(2, "0");
    healthValue.textContent = String(vida);
    healthFill.style.width = `${(vida / personaje.getVidaMaxima()) * 100}%`;
    healthTrack.setAttribute("aria-valuemax", String(personaje.getVidaMaxima()));
    healthTrack.setAttribute("aria-valuenow", String(vida));
    weaponIcon.replaceChildren(createCollageWeapon({ forma: arma.forma, clase: "equipped-weapon-art" }));
    skillIcon.replaceChildren(createCollageSkill({ forma: habilidad.forma, clase: "equipped-skill-art" }));
    weaponName.textContent = arma.getNombre();
    skillName.textContent = habilidad.getNombre();
    weaponDamage.textContent = `${arma.getDanio()} ATQ · ${arma.getCostoEnergia()} ENE`;
    skillPower.textContent = `${habilidad.getPoder()} POD · ${habilidad.getCostoMana()} MANÁ`;
    figureWeapon.replaceChildren(createCollageWeapon({ forma: arma.forma, clase: "hero-weapon-art" }));
    energyValue.textContent = String(personaje.getEnergia());
    energyMax.textContent = String(personaje.getEnergiaMaxima());
    energyFill.style.width = `${(personaje.getEnergia() / personaje.getEnergiaMaxima()) * 100}%`;
    energyTrack.setAttribute("aria-valuemax", String(personaje.getEnergiaMaxima()));
    energyTrack.setAttribute("aria-valuenow", String(personaje.getEnergia()));
    manaValue.textContent = String(personaje.getMana());
    manaMax.textContent = String(personaje.getManaMaximo());
    manaFill.style.width = `${(personaje.getMana() / personaje.getManaMaximo()) * 100}%`;
    manaTrack.setAttribute("aria-valuemax", String(personaje.getManaMaximo()));
    manaTrack.setAttribute("aria-valuenow", String(personaje.getMana()));
    // El porcentaje de aura controla la barra, el estado brillante y el botón especial.
    auraValue.textContent = String(personaje.getAura());
    auraMax.textContent = String(personaje.getAuraMaxima());
    auraFill.style.width = `${(personaje.getAura() / personaje.getAuraMaxima()) * 100}%`;
    auraTrack.setAttribute("aria-valuemax", String(personaje.getAuraMaxima()));
    auraTrack.setAttribute("aria-valuenow", String(personaje.getAura()));
    awakeningIcon.replaceChildren(createCollageSkill({ forma: "awakening", clase: "awakening-skill-art" }));
    const auraCompleta = personaje.getAura() === personaje.getAuraMaxima();
    auraMeter.classList.toggle("is-charged", auraCompleta);
    awakeningButton.classList.toggle("is-ready", auraCompleta);
    awakeningButton.disabled = personaje.getVida() === 0 || avanzandoNivel || personaje.getAura() < personaje.getAuraMaxima();
    awakeningLabel.textContent = auraCompleta
        ? "Despertar de papel · ¡AURA COMPLETA!"
        : `Despertar de papel · ${personaje.getAura()} / ${personaje.getAuraMaxima()} aura`;
    auraTrack.setAttribute("aria-label", `Aura de despertar: ${personaje.getAura()} de ${personaje.getAuraMaxima()}`);
    document.querySelectorAll<HTMLButtonElement>(".action-button").forEach((button) => {
        if (button !== awakeningButton) {
            button.disabled = personaje.getVida() === 0 || avanzandoNivel;
        }
    });
    renderOptions();
}

/** Escribe el mensaje más reciente en el registro visible de aventura. */
function showActivity(message: string): void {
    if (!activityMessage) {
        throw new Error("No se encontró el registro de aventura.");
    }
    activityMessage.textContent = message;
}

/** Actualiza la vida, barra y estado de derrota del maniquí. */
function renderDummyHealth(): void {
    const dummyHealthMax = document.querySelector<HTMLSpanElement>("#dummy-health-max");
    const dummyLevel = document.querySelector<HTMLSpanElement>("#dummy-level");
    if (!dummyHealthValue || !dummyHealthMax || !dummyLevel || !dummyHealthFill || !dummyHealthTrack || !dummy) {
        throw new Error("No se encontraron los elementos de vida del maniquí.");
    }

    const vida = maniqui.getVida();
    const vidaMaxima = maniqui.getVidaMaxima();
    dummyHealthValue.textContent = String(vida);
    dummyHealthMax.textContent = String(vidaMaxima);
    dummyLevel.textContent = `MANIQUÍ · NV. ${maniqui.getNivel()}`;
    dummyHealthFill.style.width = `${(vida / vidaMaxima) * 100}%`;
    dummyHealthTrack.setAttribute("aria-valuemax", String(vidaMaxima));
    dummyHealthTrack.setAttribute("aria-valuenow", String(vida));
    dummy.classList.toggle("is-defeated", vida === 0);
}

/** Activa la animación apropiada y muestra el efecto producido por el personaje. */
function animateHero(datos: DatosAnimacionHeroe): void {
    if (!heroStage) {
        throw new Error("No se encontró la escena del personaje.");
    }
    const stageEffect = document.querySelector<HTMLSpanElement>("#stage-effect");
    const stageDamage = document.querySelector<HTMLSpanElement>("#stage-damage");
    if (!stageEffect || !stageDamage) {
        throw new Error("No se encontraron los efectos visuales de la escena.");
    }
    heroStage.classList.remove("attack-active", "skill-active", "shield-active", "awakening-active");
    void heroStage.offsetWidth;
    stageEffect.textContent = datos.accion === "attack" ? "✴" : datos.accion === "shield" ? "🛡" : datos.accion === "awakening" ? "✹" : "✦";
    stageDamage.textContent = datos.textoEfecto;
    heroStage.classList.add(`${datos.accion}-active`);
    if (datos.bloqueado && dummy) {
        dummy.classList.remove("guard-active");
        void dummy.offsetWidth;
        dummy.classList.add("guard-active");
        window.setTimeout(() => dummy.classList.remove("guard-active"), 700);
    }
    window.setTimeout(() => {
        heroStage.classList.remove("attack-active", "skill-active", "shield-active", "awakening-active");
    }, datos.accion === "awakening" ? 2300 : 850);
}

/** Anima el contraataque del enemigo y el daño flotante recibido por el héroe. */
function animateCreatureAttack(effectText: string): void {
    if (!heroStage || !creature) {
        throw new Error("No se encontró la escena de combate.");
    }
    const creatureEffect = document.querySelector<HTMLSpanElement>("#creature-effect");
    const stageDamage = document.querySelector<HTMLSpanElement>("#stage-damage");
    if (!creatureEffect || !stageDamage) {
        throw new Error("No se encontraron los efectos visuales de la criatura.");
    }

    heroStage.classList.remove("enemy-active");
    void heroStage.offsetWidth;
    creatureEffect.textContent = "💥";
    stageDamage.textContent = effectText;
    heroStage.classList.add("enemy-active");
    window.setTimeout(() => heroStage.classList.remove("enemy-active"), 800);
}

/** Aplica el golpe del enemigo, considerando escudo y posible Game Over. */
function receiveCreatureAttack(): string {
    // El escudo mágico se consume al recibir el golpe y reduce ese daño a la mitad.
    const danio = Math.min(8 + (maniqui.getNivel() - 1) * 2, 20);
    const danioRecibido = escudoPersonajeActivo ? Math.ceil(danio / 2) : danio;
    escudoPersonajeActivo = false;
    personaje.recibirDanio(danioRecibido);
    renderCharacter();
    animateCreatureAttack(`−${danioRecibido} VIDA`);

    if (personaje.getVida() === 0) {
        combateTerminado = true;
        if (
            !gameOverCreature || !gameOverHero || !gameOverLevel || !gameOverCoins ||
            !gameOverCharacter || !gameOverNote || !continueButton
        ) {
            throw new Error("No se encontraron los datos de Game Over.");
        }
        const costoContinuar = Math.ceil(monedas / 2);
        gameOverCreature.textContent = getCurrentCreatureName();
        gameOverHero.textContent = personaje.getNombre();
        gameOverLevel.textContent = `NIVEL ${nivelPersonaje}`;
        gameOverCoins.textContent = String(monedas);
        gameOverCharacter.classList.remove("game-over-character--warrior", "game-over-character--archer");
        gameOverCharacter.classList.add(`game-over-character--${personaje.getApariencia()}`);
        continueButton.hidden = monedas === 0;
        continueButton.textContent = `Dejar ${costoContinuar} monedas y continuar ✦`;
        gameOverNote.textContent = monedas === 0
            ? "No te quedan monedas para negociar. Puedes volver a intentarlo desde el nivel 1."
            : `La guardiana se queda con ${costoContinuar} monedas. Continuarás con media vida y recursos, frente al mismo enemigo.`;
        showScreen("gameover");
        return ` ${getCurrentCreatureName()} contraataca e inflige ${danioRecibido} de daño. ¡${personaje.getNombre()} cayó!`;
    }

    return ` ${getCurrentCreatureName()} contraataca e inflige ${danioRecibido} de daño. Vida de ${personaje.getNombre()}: ${personaje.getVida()}/${personaje.getVidaMaxima()}.`;
}

/** Elige el nombre del enemigo según el nivel del maniquí. */
function getCurrentCreatureName(): string {
    return criaturas[(maniqui.getNivel() - 1) % criaturas.length].aria;
}

/** Cuenta acciones y hace que el enemigo contraataque cada tres turnos. */
function advanceCreatureTurn(): string {
    if (combateTerminado) {
        return "";
    }
    ataquesDesdeContraataque += 1;
    if (ataquesDesdeContraataque < 3) {
        return "";
    }
    ataquesDesdeContraataque = 0;
    return receiveCreatureAttack();
}

/** Sube al héroe de nivel, recompensa recursos y genera el siguiente enemigo. */
function prepareNextLevel(): void {
    // El breve bloqueo evita acciones duplicadas mientras se cambia de enemigo.
    avanzandoNivel = true;
    renderCharacter();
    window.setTimeout(() => {
        if (combateTerminado) {
            return;
        }
        nivelPersonaje += 1;
        maniqui.avanzarNivel();
        monedas += 20;
        const auraGanada = personaje.ganarAura(30);
        personaje.curar(10);
        personaje.recuperarEnergia(30);
        personaje.recuperarMana(20);
        avanzandoNivel = false;
        renderCharacter();
        renderDummyHealth();
        renderCreature();
        renderCoins();
        const despertar = personaje.getAura() === personaje.getAuraMaxima()
            ? " ¡El Despertar de papel está listo!"
            : "";
        showActivity(`¡Subiste al nivel ${nivelPersonaje}! Ganas 20 monedas, recuperas 10 de vida, 30 de energía y 20 de maná, y sumas ${auraGanada} de aura. Aparece ${criaturas[(maniqui.getNivel() - 1) % criaturas.length].aria} nivel ${maniqui.getNivel()}, con ${maniqui.getVida()} puntos de vida.${despertar}`);
    }, 900);
}

// Delegación de eventos: todos los botones del juego comparten este manejador.
app.onclick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) {
        return;
    }
    const button = target.closest<HTMLButtonElement>("button[data-action]");
    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    if (avanzandoNivel && (action === "attack" || action === "skill" || action === "aura-skill")) {
        return;
    }

    if (action === "choose-screen") {
        renderHeroChoices();
        showScreen("hero-select");
    } else if (action === "back-title") {
        showScreen("title");
    } else if (action === "choose-hero") {
        const heroeElegido = heroes[index];
        if (!heroeElegido) {
            return;
        }
        personaje = heroeElegido;
        resetCombat();
        showActivity(`${personaje.getNombre()} se une a la aventura con su equipo inicial.`);
        showScreen("game");
    } else if (action === "restart") {
        resetCombat();
        showScreen("game");
    } else if (action === "title") {
        resetCombat();
        showScreen("title");
    } else if (action === "continue") {
        if (monedas === 0) {
            return;
        }
        const costoContinuar = Math.ceil(monedas / 2);
        monedas -= costoContinuar;
        personaje.continuarTrasDerrota();
        ataquesDesdeContraataque = 0;
        escudoPersonajeActivo = false;
        combateTerminado = false;
        renderCharacter();
        renderCoins();
        showActivity(`La guardiana acepta ${costoContinuar} monedas. ${personaje.getNombre()} vuelve al combate con media vida y recursos.`);
        showScreen("game");
    } else if (combateTerminado && (action === "attack" || action === "skill" || action === "aura-skill")) {
        return;
    } else if (action === "weapon") {
        // Cambia el objeto agregado y actualiza la vista del personaje.
        const arma = armas[index];
        if (arma) {
            personaje.cambiarArma(arma);
            showActivity(`${personaje.getNombre()} ahora utiliza ${arma.getNombre()}.`);
            renderCharacter();
        }
    } else if (action === "skill-choice") {
        // Cambia la habilidad agregada y actualiza la selección visual.
        const habilidad = habilidades[index];
        if (habilidad) {
            personaje.cambiarHabilidad(habilidad);
            showActivity(`${personaje.getNombre()} ahora tiene ${habilidad.getNombre()}.`);
            renderCharacter();
        }
    } else if (action === "attack") {
        // Comprueba energía antes de aplicar daño y sumar maná y aura.
        if (maniqui.getVida() === 0) {
            return;
        }
        const arma = personaje.getArma();
        if (!personaje.usarEnergia(arma.getCostoEnergia())) {
            showActivity(`No tienes energía suficiente para usar ${arma.getNombre()}. Pulsa Concentrarse para recuperarla.`);
            return;
        }

        const resultado = maniqui.recibirAtaque(arma.getDanio());
        personaje.atacar();
        const manaRecuperado = personaje.recuperarMana(8);
        const auraGanada = personaje.ganarAura(15);
        renderCharacter();
        renderDummyHealth();
        const bloqueo = resultado.bloqueado
            ? ` El maniquí se defendió y redujo el daño a ${resultado.danioRecibido}.`
            : "";
        let mensajeAtaque = `${personaje.getNombre()} ataca con ${arma.getNombre()}, gasta ${arma.getCostoEnergia()} de energía, recupera ${manaRecuperado} de maná y gana ${auraGanada} de aura. Inflige ${resultado.danioRecibido} de daño.${bloqueo}`;
        if (personaje.getAura() === personaje.getAuraMaxima()) {
            mensajeAtaque += " ¡El Despertar de papel está listo!";
        }
        if (resultado.derrotado) {
            const nivelDerrotado = maniqui.getNivel();
            mensajeAtaque = `¡Maniquí nivel ${nivelDerrotado} derrotado! ${personaje.getNombre()} sube al siguiente nivel.`;
        } else if (!resultado.derrotado) {
            mensajeAtaque += ` Vida del maniquí: ${maniqui.getVida()}/${maniqui.getVidaMaxima()}.`;
        }
        if (!resultado.derrotado) {
            mensajeAtaque += advanceCreatureTurn();
        }
        showActivity(mensajeAtaque);
        animateHero({
            accion: "attack",
            textoEfecto: resultado.bloqueado ? `🛡 −${resultado.danioRecibido}` : `−${resultado.danioRecibido}`,
            bloqueado: resultado.bloqueado,
        });
        if (resultado.derrotado && !combateTerminado) {
            prepareNextLevel();
        }
    } else if (action === "skill") {
        // Las habilidades equipadas usan maná; su efecto depende del tipo.
        const habilidad = personaje.getHabilidad();
        if (habilidad.getNombre() === "Curación" && personaje.getVida() === personaje.getVidaMaxima()) {
            showActivity("Ya tienes toda tu vida. Guarda Curación para después de recibir daño.");
            return;
        }
        if (!personaje.usarMana(habilidad.getCostoMana())) {
            showActivity(`No tienes maná suficiente para usar ${habilidad.getNombre()}. Pulsa Concentrarse o ataca para recuperarlo.`);
            return;
        }

        personaje.usarHabilidad();
        let mensajeHabilidad = "";
        let textoEfecto = "";
        let resultadoRayo: ReturnType<Maniqui["recibirAtaque"]> | undefined;
        if (habilidad.getNombre() === "Curación") {
            const vidaRecuperada = personaje.curar(habilidad.getPoder());
            mensajeHabilidad = `Curación recupera ${vidaRecuperada} puntos de vida y consume ${habilidad.getCostoMana()} de maná.`;
            textoEfecto = `+${vidaRecuperada} VIDA`;
        } else if (habilidad.getNombre() === "Escudo mágico") {
            escudoPersonajeActivo = true;
            mensajeHabilidad = `Escudo mágico consume ${habilidad.getCostoMana()} de maná y reducirá a la mitad el próximo ataque enemigo.`;
            textoEfecto = "🛡 ESCUDO ACTIVO";
        } else {
            resultadoRayo = maniqui.recibirAtaque(habilidad.getPoder());
            renderDummyHealth();
            const bloqueoRayo = resultadoRayo.bloqueado
                ? " El maniquí se defendió y redujo el daño."
                : "";
            mensajeHabilidad = `Rayo Arcano consume ${habilidad.getCostoMana()} de maná e inflige ${resultadoRayo.danioRecibido} de daño.${bloqueoRayo}`;
            textoEfecto = `−${resultadoRayo.danioRecibido}`;
        }
        renderCharacter();
        if (resultadoRayo?.derrotado) {
            mensajeHabilidad += ` ¡Maniquí nivel ${maniqui.getNivel()} derrotado!`;
        } else if (resultadoRayo) {
            mensajeHabilidad += ` Vida del maniquí: ${maniqui.getVida()}/${maniqui.getVidaMaxima()}.`;
        }
        if (!resultadoRayo?.derrotado) {
            mensajeHabilidad += advanceCreatureTurn();
        }
        showActivity(mensajeHabilidad);
        animateHero({
            accion: habilidad.getNombre() === "Escudo mágico" ? "shield" : "skill",
            textoEfecto,
            bloqueado: resultadoRayo?.bloqueado,
        });
        if (resultadoRayo?.derrotado && !combateTerminado) {
            prepareNextLevel();
        }
    } else if (action === "aura-skill") {
        // El despertar consume toda la barra y golpea al enemigo con poder aumentado.
        if (maniqui.getVida() === 0) {
            return;
        }
        if (!personaje.usarAura()) {
            showActivity("Sigue atacando y venciendo enemigos para llenar tu aura.");
            return;
        }

        const resultadoDespertar = maniqui.recibirAtaque(100);
        renderCharacter();
        renderDummyHealth();
        const bloqueoDespertar = resultadoDespertar.bloqueado
            ? " El maniquí se defendió y redujo parte del impacto."
            : "";
        let mensajeDespertar = `¡DESPERTAR DE PAPEL! ${personaje.getNombre()} libera toda su aura e inflige ${resultadoDespertar.danioRecibido} de daño.${bloqueoDespertar}`;
        if (resultadoDespertar.derrotado) {
            mensajeDespertar += ` ¡Maniquí nivel ${maniqui.getNivel()} derrotado!`;
        } else {
            mensajeDespertar += ` Vida del maniquí: ${maniqui.getVida()}/${maniqui.getVidaMaxima()}.`;
        }
        if (!resultadoDespertar.derrotado) {
            mensajeDespertar += advanceCreatureTurn();
        }
        showActivity(mensajeDespertar);
        animateHero({ accion: "awakening", textoEfecto: `−${resultadoDespertar.danioRecibido}` });
        if (resultadoDespertar.derrotado && !combateTerminado) {
            prepareNextLevel();
        }
    } else if (action === "recover") {
        // Concentrarse recupera recursos y también cuenta como acción para el enemigo.
        const energiaRecuperada = personaje.recuperarEnergia(40);
        const manaRecuperado = personaje.recuperarMana(30);
        if (energiaRecuperada === 0 && manaRecuperado === 0) {
            showActivity("Tu energía y tu maná ya están al máximo.");
            return;
        }
        renderCharacter();
        const contraataque = advanceCreatureTurn();
        showActivity(`Te concentras y recuperas ${energiaRecuperada} de energía y ${manaRecuperado} de maná.${contraataque}`);
        animateHero({ accion: "skill", textoEfecto: `+${energiaRecuperada} ENE · +${manaRecuperado} MANÁ` });
    }
};

// Prepara el contenido de la interfaz antes de mostrar la pantalla de entrada.
renderCharacter();
renderDummyHealth();
renderCreature();
renderHeroChoices();
renderCoins();
showScreen("title");
