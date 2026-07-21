# STARTER — Soudan Acte 4, Phase 2 (densification + dynamisation LLM)

> Session dédiée pour APPLIQUER les effets densification/dynamisation sur l'Acte 4 refait en 3 registres.
> La Phase 1 (refonte structurelle) est TERMINÉE et validée Aziz. Cette session = Phase 2 = finition premium.

## ÉTAT À LA REPRISE (vérifier code+render avant d'agir, ne pas se fier à cette note seule)

**Acte 4 « Même les voisins sont aspirés » — v12 = base validée Aziz.** Architecture 3 registres :
- **Bloc globe CONTINU B1→B4** : `src/projects/_rnd/d3-16x9/SoudanActe4B1toB4Globe.tsx` (compo `D3-SoudanActe4-B1B4-Globe`, ~81s). UNE caméra continue qui accumule (Russie+flux → Port-Soudan+navire → Égypte → Nil), la carte ne se vide JAMAIS. Géoplaques labels. Navire = `NavireGuerreEncre` (svg-library/elements/maritime).
- **B5 Kosti** : insert SVG plein écran `Kosti-Beat5-Standalone` (Root.tsx ~ligne 3971) — station-service K3, frappe drone. Inchangé, validé Aziz.
- **B6 synthèse** : `SoudanActe4B6Globe.tsx` (compo `D3-SoudanActe4-B6-Globe`, ~24s). Globe 2.0, 4 arcs Russie/EAU/Turquie/Égypte convergent vers Khartoum.
- Assemblage = **concaténation** des 3 (bloc + Kosti + B6), jamais compo mixte. Dernier assemblage : `out/episodes/soudan-midform/wip/acte4-v12-continu-full.mp4` (130.8s).

**Branche** : `feat/soudan-acte4-globe-3registres` (tous les commits Phase 1 dessus).
**Palette** : `THEMES.mixte` (source de vérité, `SoudanActe3GlobeProto16x9.tsx`) — jamais de couleur de fond en dur.
**Socle** : `globeGeo.ts`, `geoArc.ts` (GEO = coords ; moscou/portSoudan/cairo/khartoum/rsfToken/safToken déjà là), `globeCamera.ts`, `GlobeFlagFill`.
**Règle gravée** : ZÉRO sous-titre bas d'écran (bas = sources uniquement). Russie=rouge #c74d4d partout.

## RAPPORTS LLM (déjà faits, à relire) — `memory/episodes/soudan-midform/da-briefs-acte4-phase2/`
4 rapports (Gemini + Kimi × densif + dynam), FORTE CONVERGENCE. Règle d'or : LLM=SIGNAL, jamais juge — vérifier chaque point contre le code réel, appliquer le vrai, STOP (pas de boucle review→fix→review).

## LOTS D'EFFETS À APPLIQUER (validés Aziz 2026-07-21) — les 4 lots + 1 ajout

### LOT 1 — Flux qui coulent (TOUTES les lignes)
Les flux se tracent puis "meurent". Les rendre VIVANTS : `stroke-dasharray` + `stroke-dashoffset` animé en boucle (frame-driven) = filet qui coule en permanence dans le sens du flux. S'applique à : flux Moscou→RSF/SAF (bloc B1), arc Le Caire→SAF (B3), les 4 arcs du B6. Convergence 2/2. Simple, gros impact.

### LOT 2 — Navire Port-Soudan vivant
Agrandir le navire (×2, il est "microscopique" selon les 4 rapports) + tangage sinusoïdal ±2° (rotate, période ~4s) + sillage animé (dash derrière la poupe) + éventuel halo/splash d'encre à l'apparition. Fichier : bloc B1toB4 (section B2).

### LOT 3 — Zones de contrôle RSF/SAF + jetons-portraits (LE PLUS STRUCTURANT)
(a) **Glows territoriaux dans le Soudan** : le pays reste "vide" alors qu'il y a une guerre civile. Ajouter des zones glow RSF (rouge sombre, ouest/centre Darfour) vs SAF (bleu, est/nord Khartoum) — Gemini "priorité absolue". À coder (masques territoire ou glows radiaux ancrés géo).
(b) **Jetons-portraits des dirigeants** : remplacer les points/médaillons R/S par les VRAIS VISAGES — `portrait-hemeti` (RSF) et `portrait-burhan`/`portrait-al-burhan` (SAF), et un jeton Poutine à Moscou si asset dispo. ⭐ CROISE L'AUDIT JETONS PERSONNAGES NOMMÉS (point du plan Aziz : personne nommée = vrai visage partout). Vérifier les sprites dispo : `ls public/_shared/sprites/warmap/ | grep -i portrait`. Recette jeton-portrait = `PortraitToken`/`Medallion` (SoudanActe5Globe / SoudanActe3GlobeProto).

### LOT 4 — Climax B6 + frappe Kosti
(a) **B6 convergence** : départs des 4 arcs en STAGGER (~0.3s d'écart, déjà partiellement le cas — vérifier/renforcer) + onde/flash à l'impact sur Khartoum quand les arcs touchent (le moment-clé "quatre puissances"). Aziz a dit "B6 peut être améliorée".
(b) **Frappe Kosti** (insert SVG) : l'explosion est trop douce pour une frappe tuant des civils. Onde de choc (2-3 cercles concentriques qui s'étendent) + fumée qui MONTE (translation Y + scale + dissipation, pas statique) + civils qui FUIENT (translation, pas fade-out). Fichier : `KostiInsertSVG.tsx`.
⚠️ PAS de camera-shake (Aziz l'a exclu sur l'Acte 6 — cohérence).

### AJOUT AZIZ — B4 : drapeau égyptien transparent pour voir le Nil
Dans le bloc B1toB4, au moment B4 (le Nil se surligne), le drapeau égyptien CACHE le tracé du Nil (presque invisible). Faire PASSER le drapeau égyptien en TRANSPARENT/parchemin (réduire son opacité, ou revenir à un remplissage parchemin léger) pendant que le Nil se dessine, pour que le tracé bleu du Nil soit bien visible. Le drapeau peut réapparaître après ou rester atténué.

## ÉCARTÉS (ne PAS appliquer sans redemander Aziz)
- Logo ONU/UA glitché en fin (registre à risque). Titre d'acte / minimap PiP pendant Kosti (complexité). Camera-shake (exclu doctrine). Changer la couleur des lignes = couleur faction soutenue (à discuter, pas tranché).

## MÉTHODE
- Vérifier CODE+RENDER réels avant de juger (règle projet). Chaque lot : coder → render classique (`npx remotion render src/index.ts <CompoId> <out.mp4> --log=error`, D3 pur = PAS render-mapbox.sh) → extraire frames → LIRE les .jpg → corriger avant de conclure.
- Déléguer les lots à des agents frais (worktree) si pertinent, superviser, assembler. Vérifier soi-même les frames (ne pas croire un agent sur parole).
- Assemblage final = concat bloc+Kosti+B6 (ffmpeg concat filter). Override review tracé + upload (litterbox/uguu, catbox souvent KO/vide) AVANT présentation. Hook pre-presentation exige override `.review-override.md` PLUS RÉCENT que le mp4.
- Présenter à Aziz pour validation → si validé, PROMOUVOIR : `out/PRET-PUBLICATION/soudan-midform/soudan-acte4-voisins-aspires-FINAL.mp4` (+ `_compressed`). L'Acte 4 = dernier des 6 → mid-form devient 6/6.

## APRÈS L'ACTE 4 (rappel du plan global mid-form)
Reste ensuite (voir NEXT-ACTION.md) : audio global (musique Minimax + SFX) sur tout le mid-form → assemblage final des 6 actes → passe LLM downstream sur la vidéo assemblée complète. + audit jetons personnages nommés sur TOUS les actes (le LOT 3 en fait une partie sur l'Acte 4).
