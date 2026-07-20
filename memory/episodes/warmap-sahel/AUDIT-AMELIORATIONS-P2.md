# AUDIT AMÉLIORATIONS P2 — War-Map Sahel AES (le blocage)

> ⛔⭐ **CORRECTION AZIZ 2026-06-27 — NE PAS UTILISER LE `tension-drone`.** Le point A1 ci-dessous (IMPACT FORT)
> recommande un `tension-drone` continu pour combler les 3 trous de silence. DÉCISION AZIZ : le grondement
> `tension-drone` DÉRANGE → ne PAS le câbler. Combler les trous via la MUSIQUE de fond (`score-epic.mp3`) ou des
> SFX PONCTUELS, PAS un drone. Les autres points (dernier tiers visuel, ping carto, sillage…) restent valides.

> Audit LECTURE SEULE (2026-06-27). Render jugé : `out/episodes/warmap-sahel/p2-FINAL.mp4`
> (89.7 s, 1920×1080, mean -19.9 dB / max -0.4 dB). Code : `src/projects/warmap/parties/Partie2Blocage.tsx`
> + câblage `engine/SahelWarMapEngine.tsx` (mode `partie2`). Modèle : `PLAN-NARRATIF-P2.md`.
> ⛔ AUCUNE correction faite ici. Ce fichier est un backlog pour la session suivante.

## RÉSUMÉ (3 lignes)
P2 est globalement SOLIDE et fidèle au plan : la grammaire causale fonctionne (jetons jihadistes qui avancent → sillage rouge → chute des bases en 3 temps avec fumée). Les 2 vrais manques sont AUDIO (drone de tension non continu = 3 trous de silence mesurés) et le DERNIER TIERS visuel (beat CEDEAO quasi vide + bascule Niger sous-jouée), qui en plus casse le raccord avec P3 qui « brise des flèches CEDEAO » qu'on n'a jamais bien vues. Améliorations = AJOUTS chirurgicaux, pas une refonte (la narrative a été validée Aziz « très bon point d'équilibre »).

---

## (A) VRAIS MANQUES — triés par IMPACT décroissant

### A1 · IMPACT FORT — Drone de tension non continu → 3 trous de silence audibles
- **Timecode** : global. Trous mesurés < -50 dB : ~t=25 s (0.88 s), ~t=48 s (0.84 s), ~t=59.5 s (0.74 s). Pauses respiration narration sans aucun lit sonore.
- **Constaté (render)** : le drone n'est câblé que `from={3880} dur=8.0s` (engine L1614) → il ne couvre QUE la fenêtre échec/chute (~f3880-4120). Tout le setup (2.1 Serval / 2.2 présence FR / 2.3 MINUSMA, premiers ~25 s) et toute la fin (villes → Burkina → Niger → CEDEAO, après ~f4120) sont SANS assise sonore. Les pauses narration deviennent des trous.
- **Technique arsenal** : `tension-drone.mp3` en lit CONTINU bas (≈0.10-0.12) sur toute la durée P2, dans un seul `<Sequence>` couvrant f3196→f5700 (règle projet : jamais `frame===X`). Garder les ponctuels par-dessus.
- **Effort** : quick win (1 `<Sequence>` étendu). **Impact** : fort (supprime les temps morts perçus). **Risque** : faible — vérifier que le drone ne masque pas la voix (rester ≤0.12) ; tester le mix après.

### A2 · IMPACT FORT — Beat CEDEAO (2.8) quasi vide visuellement + SFX retiré
- **Timecode** : ~t=78-85 s (F_CEDEAO=5639 → fin).
- **Constaté (render)** : sur les frames de fin on voit la plaque NIGER + le jeton junte, mais AUCUNE CEDEAO lisible : les cercles `CEDEAO_RING` (r=0.012·vmin) sont minuscules, collés au bord bas, et les flèches de menace vers Niamey sont à peine perceptibles. Le SFX `cedeao-snap` a été RETIRÉ (engine L1639) « faute de support visuel » — donc le beat est à la fois muet ET visuellement plat, juste avant le cliffhanger « c'est ce qui va tout déclencher ».
- **Technique arsenal** : flèches tactiques courbes CONVERGENTES (brique flèche courbe) depuis 4-5 pays CEDEAO marqués orange (zones/contours `CEDEAO` palette) vers Niamey + pulse de menace + léger dézoom (déjà prévu plan ph8). Une fois le support visuel rétabli → REMETTRE `cedeao-snap.mp3` (le SFX existe).
- **Effort** : moyen. **Impact** : fort (c'est le beat qui ARME la P3). **Risque** : moyen — ne pas confondre orange CEDEAO avec le kaki junte ; garder lisible à ce niveau de zoom out.

### A3 · IMPACT FORT — Raccord P2→P3 cassé : P3 « brise des flèches CEDEAO » jamais vraiment montrées
- **Timecode** : fin P2 (t≈81-89 s) → début P3.
- **Constaté** : header `Partie3Rupture.tsx` (Ph1) = « les flèches CEDEAO (héritées P2) se BRISENT/reculent → cause : l'union AES ». Or P2 ne pose pas de flèches CEDEAO fortes (cf. A2). Le payoff P3 (briser la menace) tombe à plat car le setup P2 est invisible. Dépendance directe de A2.
- **Technique arsenal** : résoudre A2 d'abord (flèches CEDEAO franches et TENUES en fin de P2, idéalement figées au cliffhanger pour que P3 les reprenne). Vérifier que l'état figé de fin P2 = l'état initial de P3 (continuité de position des flèches).
- **Effort** : moyen (couplé à A2). **Impact** : fort (cohérence inter-parties). **Risque** : moyen — coordination des coordonnées flèches entre les 2 fichiers.

### A4 · IMPACT MOYEN-FORT — Bascule Niger sous-jouée : pas de « casser la grammaire » (onde de choc froide)
- **Timecode** : ~t=72-78 s (F_NIGER=5380).
- **Constaté (render)** : le coup d'État = un seul jeton junte (petit) sur Niamey + un contour Niger kaki TRÈS faible + plaque NIGER. Le DA-brief validé (PLAN §2 « NIGER = CASSER LA GRAMMAIRE ») demandait une ONDE DE CHOC GÉOMÉTRIQUE froide (kaki/gris-fer) qui recolore les frontières d'un coup, SANS sillage, pour contraster avec la progression virale jihadiste. Cet effet n'est pas présent — le contour kaki existe (`countryOutline`) mais ne « claque » pas.
- **Technique arsenal** : onde de choc géométrique froide (pulse concentrique kaki/gris-fer one-shot) à la pose du jeton junte + flash de contour Niger plus marqué (épaissir/augmenter le `flash`), recolore d'un coup. Le boom-coup SFX est déjà là (L1637) — bon support.
- **Effort** : moyen. **Impact** : moyen-fort (distingue politique vs jihadiste, évite « les jihadistes ont pris le Niger »). **Risque** : faible — rester froid (PAS de rouge), one-shot (pas de sillage).

### A5 · IMPACT MOYEN — Setup (2.1/2.2/2.3) entièrement muet : aucune ponctuation à la pose des bases/jetons
- **Timecode** : ~t=0-22 s (F_SERVAL 3196 → avant F_ECHEC 3887).
- **Constaté** : les bases FR se posent (Gao/Ménaka/Tessalit), les 4 jetons FR pré-positionnés apparaissent, puis les 3 MINUSMA — TOUT cela sans aucun SFX (le 1er SFX P2 est l'ink-spread à f3887). Visuellement c'est un beau défilé d'arrivées ; sonorement c'est plat. Le projet a un `sfx-map-ping.mp3` (clic carto à la pose des marqueurs) prévu exactement pour ça, utilisé dans l'Acte 1 (L1544-1553) mais PAS en P2.
- **Technique arsenal** : ping cartographique discret (≈0.30) à chaque pose de base/MINUSMA (quelques `<Sequence>` calés sur appearAt). + drone continu A1 qui couvre déjà l'assise.
- **Effort** : quick win. **Impact** : moyen. **Risque** : faible — ne pas sur-pinger (3-6 poses max, espacées) ; risque de surcharge si combiné à trop de ponctuels.

### A6 · IMPACT MOYEN — Sillage rouge « wet ink » trop subtil / muddy sur le parchemin
- **Timecode** : ~t=39-52 s (avancée jihadiste 2.4-2.5).
- **Constaté (render)** : le territoire rouge existe (mask `p2-sillage`, `mixBlendMode:multiply`, opacity 0.5) mais lit FAIBLE et brunâtre contre le fond parchemin — l'« échec » (les groupes contrôlent PLUS de territoire) ne FRAPPE pas autant que le veut le cœur narratif (plan ph4 = LE CŒUR). On comprend, mais ce n'est pas viscéral.
- **Technique arsenal** : renforcer la nappe (monter légèrement opacity / saturation du `p2-red`, ou ajouter un liseré de front rouge sur le bord d'avancée du sillage — « front qui progresse » de la grammaire causale), tout en gardant le multiply anti-aplat. Optionnel : `dim` (assombrissement focus) un peu plus marqué pendant 2.4 pour faire ressortir le rouge.
- **Effort** : quick win (réglages opacity/contraste). **Impact** : moyen (renforce le beat-clé). **Risque** : moyen — NE PAS transformer en aplat criard (la subtilité multiply est voulue ; tester full HD scale=1, pas en vignette).

### A7 · IMPACT FAIBLE-MOYEN — Sprites fumée (chute des bases) lisent « abstrait » (forme cône/calice sombre)
- **Timecode** : ~t=43-51 s (chutes ~f4037/4117/4197).
- **Constaté (render)** : la fumée (`fx-smoke/*.png`, 9 frames) s'élève bien des bases tombées, MAIS la silhouette pixel sombre ressemble plus à un cône/calice qu'à une colonne de fumée — lisibilité « base détruite » imparfaite vue de haut.
- **Technique arsenal** : éventuellement un one-shot `fx-explosion` AVANT la fumée (flash d'impact) pour clarifier la cause « destruction », ou ajuster l'échelle/opacité de la fumée. À VALIDER visuellement avant de toucher (le plan voulait explosion+fumée ; ici seule la fumée est câblée — pas de `fx-explosion`).
- **Effort** : moyen. **Impact** : faible-moyen. **Risque** : moyen — un flash explosion peut faire « jeu vidéo » ; rester sobre, registre analyste.

---

## (B) DÉJÀ BON — NE PAS CASSER (P2 narrative validée Aziz)
- **Grammaire causale cœur (2.4)** : les jetons JNIM (bordure or)/EIGS (bordure sombre) AVANCENT par waypoints, le sillage rouge naît DERRIÈRE eux (pas de pop), les bases sont DÉBORDÉES puis tombent en 3 temps (alerte pulse → chute grayscale → fumée). Conforme au plan. ✔
- **Chute des bases en 3 temps + halos d'alerte qui battent** : présent et lisible. ✔ (5 ponctuels SFX corps : ink-spread + 3 impacts + boom Niger = OK.)
- **Présence FR pré-positionnée (2.2)** : 4 jetons FR autour du Mali au dézoom = « plus de vide ». ✔
- **Villes tenues vs campagnes (2.5)** : îlots STEEL nommés (Gao/Mopti/Douentza) qui pulsent dans le rouge = contraste lisible. ✔
- **Burkina « 40% qui se montre »** : contour qui se dessine + fill rouge qui monte (~40 % hauteur, clippé au pays) + flash contour, sans encadré chiffré. Bonne data-viz ancrée. ✔
- **Frise/timeline graduée pleine largeur** : curseur date qui glisse, héritée Acte 1 (rendue par le moteur). ✔
- **Niveau audio global** : mean -19.9 dB, pas de saturation (max -0.4 dB), niveau homogène par tranche 10 s (-18 à -21.6 dB). La voix porte. ✔ (le problème n'est pas le niveau, c'est l'absence de lit continu — A1.)
- **Palette/registre/top-down** : raccord cohérent avec P1 (parchemin, multiply, top-down pur) et P3 (même architecture, inversion chromatique assumée). ✔ (seul accroc = A3, le contenu CEDEAO, pas le style.)

---

## ORDRE D'EXÉCUTION SUGGÉRÉ (pour l'agent correcteur, session suivante)
1. **A1** (drone continu) — quick win, plus gros gain perçu. Tester mix.
2. **A2 + A3 ensemble** (CEDEAO visible + remettre SFX + raccord P3) — le bloc le plus structurant.
3. **A4** (onde de choc froide Niger) — petit ajout fort.
4. **A5** (pings de pose setup) + **A6** (renfort sillage) — quick wins de finition.
5. **A7** (fumée/explosion) — uniquement si validé visuellement, en dernier.
Après corrections : re-render full HD (scale=1) + ré-extraire frames aux trois beats clés + relancer `silencedetect -50dB` pour confirmer la disparition des 3 trous.

## CE QUE JE N'AI PAS PU JUGER (→ validation Aziz)
- **Perception audio fine** : si les trous de silence (A1) sont réellement gênants à l'oreille (mesurés, pas écoutés ici) ; si le drone continu n'« encombre » pas la voix ; équilibre voix/musique/SFX au casque.
- **Goût sur l'intensité du rouge (A6)** et le « claquant » souhaité du sillage — subjectif, Aziz tranche le curseur subtil↔viscéral.
- **Sprites fumée (A7)** : acceptables ou à remplacer — jugement esthétique.
- **Mapping temporel exact render↔frames globales** : approximé via le curseur de la timeline (l'audit s'appuie sur le contenu visible, pas sur des frames absolues précises). Les timecodes ci-dessus sont des repères render, à reconfirmer au moment des correctifs.
