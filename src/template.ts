/** Estructura HTML de las pantallas de portada, selección, combate y derrota. */
export const gameTemplate = `
    <section class="cover-screen title-screen" id="title-screen" aria-labelledby="title-screen-heading">
        <div class="cover-card">
            <div class="cover-art" aria-hidden="true">
                <span class="cover-moon"></span>
                <span class="cover-spark cover-spark-one">✦</span>
                <span class="cover-spark cover-spark-two">✧</span>
                <span class="cover-creature"></span>
                <span class="cover-hero">
                    <span class="cover-hero-cape"></span>
                    <span class="cover-hero-head"></span>
                    <span class="cover-hero-body"></span>
                    <span class="cover-hero-weapon"></span>
                </span>
                <span class="cover-ground"></span>
            </div>
            <p class="eyebrow">AVENTURA DE PAPEL · AGREGACIÓN</p>
            <h1 id="title-screen-heading">FORJA <span>DE HÉROES</span></h1>
            <p class="cover-copy">Prepara tu equipo, enfrenta criaturas de collage y descubre hasta dónde puede llegar tu personaje.</p>
            <div class="cover-facts">
                <span>✦ Cambia armas y habilidades</span>
                <span>✦ Sobrevive y sube de nivel</span>
            </div>
            <button class="cover-button" type="button" data-action="choose-screen">Elegir héroe <span>→</span></button>
            <span class="cover-credit">UNA HISTORIA HECHA DE RECORTES</span>
        </div>
    </section>

    <section class="cover-screen hero-select-screen" id="hero-select-screen" aria-labelledby="hero-select-heading" hidden>
        <div class="cover-card hero-select-card">
            <p class="eyebrow">ELIGE TU DESTINO</p>
            <h1 id="hero-select-heading">Selecciona <span>un héroe.</span></h1>
            <p class="cover-copy">Cada aventurero tiene su propio atuendo, equipo y fortalezas.</p>
            <div class="hero-choice-list" id="hero-choice-list"></div>
            <button class="cover-link" type="button" data-action="back-title">Volver a la portada</button>
        </div>
    </section>

    <section class="cover-screen game-over-screen" id="game-over-screen" aria-labelledby="game-over-heading" hidden>
        <div class="cover-card game-over-card">
            <div class="game-over-stamp" aria-hidden="true">FIN</div>
            <div class="game-over-character" id="game-over-character" aria-hidden="true">
                <span class="game-over-cape"></span>
                <span class="game-over-face">
                    <span class="game-over-eye game-over-eye-left"></span>
                    <span class="game-over-eye game-over-eye-right"></span>
                    <span class="game-over-mouth"></span>
                </span>
                <span class="game-over-body"></span>
                <span class="game-over-patch"></span>
            </div>
            <p class="eyebrow">LA AVENTURA QUEDA EN PAUSA</p>
            <h1 id="game-over-heading">GAME <span>OVER</span></h1>
            <p class="cover-copy"><strong id="game-over-creature">La criatura</strong> venció a <strong id="game-over-hero">tu héroe</strong>. La guardiana de los recortes frunce el ceño: «¿Te rendís? Dejá la mitad de tus monedas y te doy otra oportunidad».</p>
            <div class="game-over-score">LLEGASTE AL <strong id="game-over-level">NIVEL 01</strong></div>
            <div class="game-over-coins">MONEDAS EN TU BOLSA <strong id="game-over-coins">0</strong></div>
            <button class="cover-button" type="button" data-action="continue" id="continue-button">Dejar la mitad y continuar <span>✦</span></button>
            <p class="game-over-note" id="game-over-note"></p>
            <button class="cover-button" type="button" data-action="restart">Volver a intentarlo <span>↻</span></button>
            <button class="cover-link" type="button" data-action="title">Volver a la portada</button>
        </div>
    </section>

    <main class="page-shell" id="game-shell" hidden>
        <header class="topbar">
            <a class="brand" href="#" aria-label="Inicio">
                <span class="brand-mark">✦</span>
                <span>FORJA <span class="brand-muted">DE HÉROES</span></span>
            </a>
            <span class="topbar-label"><span class="status-dot"></span> ÁREA DE PRÁCTICA</span>
            <span class="coin-pill">✦ <strong id="coin-count">0</strong> MONEDAS</span>
        </header>

        <section class="intro">
            <p class="eyebrow">AGREGACIÓN · NIVEL <span id="intro-level">01</span></p>
            <h1>Prepara tu <span>personaje.</span></h1>
            <p class="intro-copy">Equipa a tu héroe y enfréntate a criaturas de collage. Cada golpe y victoria carga tu aura para desatar un poder especial.</p>
        </section>

        <section class="game-layout" aria-label="Panel de personaje">
            <article class="hero-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">TU AVENTURERO</p>
                        <h2 id="hero-name"></h2>
                    </div>
                    <span class="level-badge" id="hero-level">NV. 01</span>
                </div>

                <div class="hero-stage" id="hero-stage">
                    <div class="stage-glow"></div>
                    <div class="awakening-vfx" aria-hidden="true">
                        <span class="awakening-rays"></span>
                        <span class="awakening-ring"></span>
                        <span class="awakening-spark awakening-spark-one">✦</span>
                        <span class="awakening-spark awakening-spark-two">✧</span>
                        <span class="awakening-spark awakening-spark-three">✦</span>
                        <span class="awakening-spark awakening-spark-four">✧</span>
                        <span class="awakening-spark awakening-spark-five">✦</span>
                        <span class="awakening-spark awakening-spark-six">✧</span>
                        <span class="awakening-spark awakening-spark-seven">✦</span>
                        <span class="awakening-spark awakening-spark-eight">✧</span>
                        <span class="awakening-banner">¡DESPERTAR DE PAPEL!</span>
                    </div>
                    <span class="stage-rune rune-one">✧</span>
                    <span class="stage-rune rune-two">✦</span>
                    <div class="creature" id="creature" aria-label="Enemigo de collage">
                        <span class="creature-label" id="creature-label"></span>
                        <span class="collage-bug collage-bug--moth" id="collage-bug" aria-hidden="true"></span>
                        <span class="creature-effect" id="creature-effect" aria-hidden="true">💥</span>
                    </div>
                    <div class="training-dummy" id="training-dummy" aria-label="Muñeco de práctica">
                        <div class="dummy-health">
                            <div class="dummy-health-label">
                                <span id="dummy-level">MANIQUÍ · NV. 1</span>
                                <strong><span id="dummy-health-value">100</span> / <span id="dummy-health-max">100</span></strong>
                            </div>
                            <div class="dummy-health-track" role="progressbar" aria-label="Vida del maniquí" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
                                <div class="dummy-health-fill" id="dummy-health-fill"></div>
                            </div>
                        </div>
                        <span class="dummy-shield" id="dummy-shield" aria-hidden="true">🛡️</span>
                        <span class="dummy-head"></span>
                        <span class="dummy-body"></span>
                        <span class="dummy-belt"></span>
                        <span class="dummy-post"></span>
                        <span class="dummy-base"></span>
                        <span class="dummy-label">OBJETIVO</span>
                    </div>
                    <span class="stage-effect" id="stage-effect" aria-hidden="true"></span>
                    <span class="stage-damage" id="stage-damage" aria-live="polite"></span>
                    <div class="hero-figure hero-figure--warrior" id="hero-figure" aria-hidden="true">
                        <div class="figure-cape"></div>
                        <div class="figure-cape-patch"></div>
                        <div class="figure-head"></div>
                        <div class="figure-neck"></div>
                        <div class="figure-body"></div>
                        <div class="figure-belt"></div>
                        <div class="figure-arm figure-arm-left"></div>
                        <div class="figure-arm figure-arm-right"></div>
                        <div class="figure-leg figure-leg-left"></div>
                        <div class="figure-leg figure-leg-right"></div>
                        <div class="figure-weapon" id="figure-weapon"></div>
                    </div>
                    <div class="stage-caption"><span class="status-dot"></span> LISTO PARA LA AVENTURA</div>
                </div>

                <div class="health-block">
                    <div class="health-label">
                        <span>♥ &nbsp;PUNTOS DE VIDA</span>
                        <strong><span id="health-value"></span><span class="health-total"> / <span id="health-max">100</span></span></strong>
                    </div>
                    <div class="health-track" role="progressbar" aria-label="Puntos de vida" aria-valuemin="0" aria-valuemax="100">
                        <div class="health-fill" id="health-fill"></div>
                    </div>
                </div>

                <div class="resource-grid">
                    <div class="resource-meter">
                        <div class="resource-label">
                            <span>⚡ ENERGÍA FÍSICA</span>
                            <strong><span id="energy-value">100</span> / <span id="energy-max">100</span></strong>
                        </div>
                        <div class="resource-track energy-track" id="energy-track" role="progressbar" aria-label="Energía física" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
                            <div class="resource-fill energy-fill" id="energy-fill"></div>
                        </div>
                    </div>
                    <div class="resource-meter">
                        <div class="resource-label">
                            <span>✦ MANÁ</span>
                            <strong><span id="mana-value">60</span> / <span id="mana-max">100</span></strong>
                        </div>
                        <div class="resource-track mana-track" id="mana-track" role="progressbar" aria-label="Maná mágico" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60">
                            <div class="resource-fill mana-fill" id="mana-fill"></div>
                        </div>
                    </div>
                </div>
                <div class="aura-meter">
                    <div class="resource-label">
                        <span>✧ AURA DE DESPERTAR</span>
                        <strong><span id="aura-value">0</span> / <span id="aura-max">100</span></strong>
                    </div>
                    <div class="resource-track aura-track" id="aura-track" role="progressbar" aria-label="Aura de despertar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                        <div class="resource-fill aura-fill" id="aura-fill"></div>
                    </div>
                </div>

                <div class="equipped-grid">
                    <div class="equipped-item">
                        <span class="equipped-icon" id="equipped-weapon-icon"></span>
                        <span class="equipped-copy"><span>ARMA EQUIPADA</span><strong id="equipped-weapon"></strong></span>
                        <span class="equipped-value" id="weapon-damage"></span>
                    </div>
                    <div class="equipped-item">
                        <span class="equipped-icon" id="equipped-skill-icon"></span>
                        <span class="equipped-copy"><span>HABILIDAD ACTIVA</span><strong id="equipped-skill"></strong></span>
                        <span class="equipped-value" id="skill-power"></span>
                    </div>
                </div>

                <div class="action-row">
                    <button class="action-button primary-action" type="button" data-action="attack">
                        <span>⚔</span> Atacar
                    </button>
                    <button class="action-button secondary-action" type="button" data-action="skill">
                        <span>✧</span> Usar habilidad
                    </button>
                    <button class="action-button recover-action" type="button" data-action="recover">
                        <span>◉</span> Concentrarse
                    </button>
                </div>
                <button class="action-button awakening-action" type="button" data-action="aura-skill" disabled>
                    <span id="awakening-icon" aria-hidden="true"></span>
                    <span id="awakening-label">Despertar de papel · 0 / 100 aura</span>
                </button>
            </article>

            <div class="loadout-column">
                <section class="selection-panel">
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow">EQUIPAMIENTO</p>
                            <h2>Elige tu arma</h2>
                        </div>
                        <span class="selection-count">01 <span>/ 03</span></span>
                    </div>
                    <div class="option-list" id="weapon-list" aria-label="Armas disponibles"></div>
                </section>

                <section class="selection-panel skill-panel">
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow">PODERES</p>
                            <h2>Elige tu habilidad</h2>
                        </div>
                        <span class="selection-count">01 <span>/ 03</span></span>
                    </div>
                    <div class="option-list" id="skill-list" aria-label="Habilidades disponibles"></div>
                </section>

                <aside class="activity-panel" aria-live="polite">
                    <div class="activity-title"><span class="activity-spark">✦</span> REGISTRO DE AVENTURA</div>
                    <p id="activity-message">Elige tu equipo para comenzar la aventura.</p>
                </aside>
            </div>
        </section>

        <footer class="page-footer">
            <span>MODELO DE AGREGACIÓN</span>
            <span>Personaje <i>tiene un</i> Arma <b>+</b> <i>tiene una</i> Habilidad</span>
        </footer>
    </main>
`;
