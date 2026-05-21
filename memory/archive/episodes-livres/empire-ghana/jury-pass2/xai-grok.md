# Réponse Léa Moreau — Empire du Ghana Pass 2

## Note globale du brief : 7/10
Brief solide sur les verrous, mais gaps en synchronisation et performance non anticipés assez ; recettes trop optimistes sur sprites complexes.

## Q1. Validation idée par idée
1. **OUI** — Balance signature dynamique : déjà codé, réutilisable sans risque.
2. **AMENDEMENT** — Beat 3 silent barter : simplifier "danse rituelle" en idle + crouch symétriques (pas de frames custom) pour éviter surcharge PixelLab ; garder dézoom/opacité/LightLeak.
3. **OUI** — Beat 4 — ligne de front rouge bordeaux : direct avec d3-geo paths, palette verrouillée.
4. **OUI** — Beat 4 — pivot Sundiata : fade + Lottie/SVG feasible, pas de nouvelle carte.
5. **OUI** — Beat 2 — Pop-up Labels : alignment ElevenLabs validé, style UI moderne ok.
6. **OUI** — Palette bordeaux profond #4A0E0E : verrouillé, contraste d3-geo confirmé.
7. **AMENDEMENT** — Koumbi Saleh = ville en pierre/banco : utiliser Gemini pour illustration statique unique (pas Lottie minaret, trop vertices) ; styliser mosquée en SVG simple.

## Q2. Implémentation concrète par outil
**Idée 1 — Balance signature dynamique**  
- Outils : Lottie (`balance.json`) + interpolate() pour oscillation.  
- Frames clés : Toute vidéo (0-86s), trigger mots-clés via alignment (ex. "sel/or" à 5-20s, équilibre à 35s, brise à 60s).  
- Structure : `<LottieAnimation src={balance} style={{oscillate: interpolate(currentTime, [0,86], [0, Math.PI])}} />` dans root composition.  
- Effort : Petit (déjà codé, juste étendre triggers).

**Idée 2 — Beat 3 silent barter (amendé)**  
- Outils : PixelLab sprites (Sahélien/Berbère crouch/idle) + d3-geo pour positions symétriques + LightLeak wrapper + spring() pour dézoom.  
- Frames clés : 33-49s (dézoom 2.5x→1.2x sur midpoint "sans un mot" ~41s ; opacité 40% dès 33s).  
- Pseudocode : `<SpritePlayer sprite="sahélien" action="crouch" pos={geoSouth} opacity={interpolate(t, [33,49], [1,0.4])} />` + symétrique Berbère ; `<LightLeak opacity={0.35} duration={8} at={41} />`.  
- Effort : Moyen (sprites prêts, mais tester symétrie d3-geo).

**Idée 3 — Beat 4 — ligne de front rouge bordeaux**  
- Outils : d3-geo (path generator) + palette BORDEAUX_PROFOND.  
- Frames clés : 58-65s (descente nord→sud, coupe route sel à 62s).  
- Structure : `<Path d={geoPath(lineFromNorth)} stroke="#4A0E0E" animate={{path: spring({from: northPos, to: southPos, frames: 58-65})}} />`.  
- Effort : Petit (AtlasCaravane réutilisable pour bezier).

**Idée 4 — Beat 4 — pivot Sundiata**  
- Outils : SVG (sceau Mali) + LightLeak + Remotion fade.  
- Frames clés : 70-73s (fade-to-black partiel sur ruines Koumbi, surimpression sceau ~72s).  
- Structure : `<AbsoluteFill> <Fade opacity={interpolate(t, [70,73], [1,0.3])}> <RuinesSVG /> </Fade> <SceauLottie src={crown-pulse} at={72} opacity={0.8} /> <LightLeak at={71} /> </AbsoluteFill>`.  
- Effort : Petit (assets prêts, fade natif Remotion).

**Idée 5 — Beat 2 — Pop-up Labels**  
- Outils : Forced Alignment ElevenLabs + SVG texts (style UI : JetBrains Mono).  
- Frames clés : 20-40s (sync mot-par-mot, ex. "quatre-vingt-dix" pop à 25s).  
- Structure : `<Labels from={alignmentData} render={({word, time}) => <Text key={word} style={{bg: PARCHEMIN, pos: geoTag}} enter={spring({scale: [0,1], at: time})} />} />`.  
- Effort : Moyen (intégrer Whisper template, tester sync).

**Idée 6 — Palette bordeaux profond #4A0E0E**  
- Outils : CSS vars en Remotion + d3-geo stroke.  
- Frames clés : Toute (appliqué routes/frontières dès V1).  
- Structure : `const theme = { borders: '#4A0E0E' }; <AtlasMercator stroke={theme.borders} />`.  
- Effort : Petit (verrouillé, apply global).

**Idée 7 — Koumbi Saleh = ville en pierre/banco (amendé)**  
- Outils : Gemini (générer image statique banco/mosquée) + SVG overlay pour POI.  
- Frames clés : Beats 1-2 (13-40s, fixe au centre).  
- Structure : `<Img src={geminiKoumbi} pos={geoCenter} /> <SVGPoI d={simpleMinaret} fill={BLANC_BANCO} scale={interpolate(t, [13,40], [0.8,1])} />`.  
- Effort : Moyen (prompt Gemini précis, éviter animation lourde).

## Q3. Transition Beat 4 → Beat 5
Utiliser un ralentissement de la balance signature (spring() damping élevé pour oscillation mourante, 73-75s) + désaturation progressive du territoire (GRIS_CENDRE overlay opacity 0→0.6 via interpolate()) vers un zoom out subtil sur l'atlas global. Cela ancre le drame en réflexion sans friction, en 1.5s, via Remotion transitions natives.

## Q4a. 8e idée éventuelle
**Idée : Indicteur temporal discret** — Barre chronologique SVG (non intrusive, en bas écran) qui pulse OR_VIF aux dates clés (ex. 1076, 1240). Justification : Renforce ancrage historique sans alourdir ; oublie le flux temporel linéaire, feasible en petit effort avec AtlasLabel.

## Q4b. 3 pièges techniques
1. **Surcharge sprites PixelLab en symétrie** : Multi-instances (2+ dirs) peuvent laguer en Remotion headless. Solution : Pré-rendre frames clés en sequence PNG via getSpriteFramePath, limiter à 4 dirs max par beat.
2. **Sync alignment ElevenLabs imprécise sur accents GeoAfrique** : Décalages mot-par-mot >0.5s sur narration. Solution : Post-aligner manuellement via Whisper API debug, buffer 2 frames sur triggers.
3. **Lottie instances simultanées (>5) avec d3-geo** : Vertices cumulés crashent render (limite 10/JSON). Solution : Stagger imports (require() lazy), tester avec delayRender() en CI pour valider <5 actives.