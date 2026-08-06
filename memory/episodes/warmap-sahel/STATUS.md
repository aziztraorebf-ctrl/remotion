# War-Map Sahel AES — STATUS

> ⛔⛔ **BANDEAU D'ÉTAT 2026-08-06 — LIRE AVANT TOUT LE RESTE DE CE FICHIER (le corps ci-dessous s'arrête au
> 2026-07-05, avant la publication).** La vidéo longue a été publiée le 2026-08-04 avec le titre "Comment
> l'AES a brisé 60 ans de statu quo au Sahel" — **ÉCHEC** : 5 vues/24h, VPH 0.19 (vs 0.56 pour la vidéo
> Sénégal précédente sur la même chaîne, publiée 5 jours plus tôt). Diagnostic complet (titre publié
> différent du titre validé par jury 4 modèles, miniature vidIQ 35/100, script jugé trop institutionnel par
> jury créatif 4 modèles) : `feedback_hook-retention-premiere-minute.md`. **Script réécrit en 3 passes de
> jury (Gemini+Grok), V4 final noté 8.8-9/10** : `memory/episodes/warmap-sahel/SCRIPT-V6-REFONTE-2026-08-06.txt`.
> Test audio (nouveau pipeline voix Harmonie→STS GéoAfrique, remplace Océane depuis 01/08) validé sur
> hook+passage Moura (73.7s, ~2111 crédits) — "Africa Corps" bien prononcé (pas un artefact, confirmé
> après écoute isolée), CAPS retenues : retirées sur "pauvres" (trop appuyé), gardées sur "GAGNENT"
> (emphase voulue), déjà appliqué dans le fichier de test scratchpad `test-voix-hook-moura.txt` (à
> reproduire, pas encore committé dans le repo).
>
> **⏭️ PROCHAINE SESSION (dans cet ordre)** :
> 1. Découper `SCRIPT-V6-REFONTE-2026-08-06.txt` en actes avec marqueurs `### PARTIE N — titre` (le
>    script V4 n'en a AUCUN actuellement — nécessaire pour générer/régénérer acte par acte, règle
>    doctrine "jamais tout le script en un bloc").
> 2. Tagger l'intégralité du texte (actuellement seuls hook+Moura sont tagués) selon
>    `PIPELINE-VOIX-VIVANTE-VALIDE.md` (paragraphes fusionnés, tags de ton, CAPS ciblées 1-2/paragraphe,
>    `[pause]` natif) — pas juste copier les tags de l'ancien `SCRIPT-V5-TAGGED.txt`, le texte a changé.
> 3. **Test conclusif proposé par Aziz** : générer l'Acte 1 COMPLET (pas juste hook) en premier, valider
>    à l'écoute avant de réserver la génération des actes 2-4 pour la suite.
> 4. Retiming Remotion sur les visuels Mapbox/SVG existants (storyboarder + audio-director) — dans une
>    session fraîche, vérifier si la durée totale reste proche du V1 (445.9s) ou diverge (le corps de ce
>    fichier ci-dessous reste la référence technique du montage actuel — Mapbox/SVG/caméra/SFX ne
>    changent pas, seul le texte/timing narratif change).
> 5. Nouvelle miniature (score 35/100 actuel, logo AES illisible, aucun guide visuel) · nouveau titre ·
>    supprimer la vidéo actuelle PUIS republier (jamais les 2 en simultané).
>
> ⚠️ **Après refonte** : appliquer la même méthode jury 3-passes sur CFA (déjà écrit) et Soudan
> (verrouillé) AVANT publication — moins cher de corriger un script qu'une vidéo déjà en ligne.

---

**Dernière mise à jour (historique technique ci-dessous) :** 2026-07-05 — ✅✅✅ **VIDÉO LONGUE VALIDÉE AZIZ, PROMUE `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`.** Reste 2 points avant publication effective : **thumbnail** + **titre** (prochaine session). Voir section "✅✅✅ SESSION C — ÉTAT (2026-07-05)" juste ci-dessous.
**✅✅ Chantier Short "L'AES en 90s" — SESSION 2026-07-08 CONCLUANTE : VIDÉO COMPLÈTE 92s PRODUITE, validée visuellement par Aziz.** Après les 4 échecs du 2026-07-07 (table rase), reprise RÉUSSIE via carte vivante d3-geo PUR (registre totalement différent de la vidéo longue Mapbox, mais qui s'y raccorde — style qu'on maîtrise). Livrable : `out/episodes/warmap-sahel/aes-short-90s-FINAL.mp4` (92s ; catbox https://files.catbox.moe/8ms702.mp4). Code : `src/projects/warmap/shorts/aes-short-90s/`, composition Remotion `AES-Short-Full` (assemble Part1 0-36s + Part2 36-92s). **RESTE 2 finitions (prochaine session) : (1) MUSIQUE — reprendre celle de la vidéo LONGUE War-Map AES + (2) SFX — ping/ding sur apparitions d'éléments + 1-2 SFX bien placés (aucun son actuellement à part la narration). Vérifier aussi la luminosité au soleil.** Socle + décisions figées : `.claude/.../memory/aes-short-socle-valide.md`. Détail complet : `memory/episodes/warmap-sahel/SHORT-90S-PRODUCTION-2026-07-08.md`.
**Branche :** `fix/senegal-v3-passe-finition` (⚠️ nom historique trompeur — toute la Session B War-Map Sahel
a été faite ici, pas sur une branche dédiée `feat/warmap-aes-hook-integration` qui n'a en réalité jamais
été créée/utilisée ; corrigé 2026-07-04, décision Aziz : documenter la réalité plutôt que déplacer les
commits). **Format :** War-Map Long 16:9, ~7min30. Voix GéoAfrique V2 (V3→STS).

---

## ✅✅✅ PROCHAINE SESSION — DERNIERS POINTS AVANT PUBLICATION

Vidéo finale validée par Aziz (2026-07-05), promue dans `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`
(386 MB, 7min30, 13501 frames). Reste UNIQUEMENT :
1. **Thumbnail** — à créer.
2. **Titre** — à définir (cf `feedback_doctrine-titres-youtube-kora-cartes.md` pour la doctrine de titrage
   du projet : fait+conséquence+cause inattendue, déclaratif > question).

Une fois ces 2 points faits : programmer la publication (cf `memory/doctrines/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md`
pour la stratégie de distribution, `tools/trypost.md`/`tools/postiz.md` pour les outils de publication).

---

## ✅✅✅ SESSION C — ÉTAT (2026-07-04 → 2026-07-05, CONCLUE) — LIRE EN PREMIER À LA REPRISE

### Fait et validé cette session
1. **Fix audio "déjà" (P1, f2743)** : backup TTS resynthèse complète validé par Aziz à l'écoute (sans
   réverb) splicé tel quel dans `narration-v5-expressive.mp3` — décalage de +2.67s assumé en aval SANS
   retiming des triggers F_* (décision explicite Aziz : chantier disproportionné vs bénéfice, ajuster
   seulement si un vrai problème de synchro apparaît au visionnage). Backup original
   (`narration-v5-expressive-PRE-DEJA-SPLICE-2026-07-04.mp3`) absent du disque à ce jour
   (vérifié 2026-07-30) — fix appliqué et validé, épisode publié, sans conséquence.
2. **Premier render complet bout-en-bout** (Acte1+P1+P2+P3+P4, jamais fait avant cette session) —
   continuité vérifiée à 100% par `check-frame-continuity.py`.
3. **CEDEAO — 3e itération, direction actée** : après 2 tentatives rejetées (marqueurs+flèches hors-cadre
   le 2026-07-01, bande+flèches avec triangles dans l'océan le 2026-07-04 tôt), direction validée par
   Aziz : zoom élargi pour montrer les VRAIS contours des pays côtiers (Côte d'Ivoire/Ghana/Bénin/Nigeria,
   extraits de `public/_shared/geo-data/world/world-atlas-countries-110m.json` via `topojson-client`,
   ajoutés à `sahelCountries.ts`), leurs frontières PULSENT en rouge/ambre (`#D14E2E`), flèches convergentes
   vers Niamey. Cartouche texte "MENACE D'INTERVENTION ARMÉE" ajouté PUIS retiré (retour Aziz : redondant
   avec la voix). Code dans `Partie2Blocage.tsx` (bloc `cedeaoEndT`), caméra réélargie dans
   `SahelCameras.ts` (`PARTIE2_CAM_KEYS`, f5380-5640).
4. **Portraits dirigeants P4 (Goïta/Traoré/Tiani) refaits 2 fois** :
   - 1re tentative (Gemini, style soldier-aes.png sans référence de ressemblance) : REJETÉE par Aziz —
     visages génériques en treillis, pas les vraies illustrations stylisées des dirigeants.
   - 2e tentative (validée) : vraies photos officielles téléchargées (Wikipedia/Commons, licence libre :
     Goïta `Assimi_Goïta_in_July_2023.jpg`, Traoré `Ibrahim_Traoré_portrait.jpg`, Tiani
     `Abdourahamane_Tchiani_in_2025.jpg`) puis restylisées via Recraft (`image_to_image` +
     `remove_background`, style extrait de `soldier-aes.png` via `create_style`) — fidèles ET nettes au
     downscale. Fichiers de prod remplacés, anciens (gravure fine floue) backupés dans
     `memory/episodes/warmap-sahel/assets-backup/`.
5. **SFX corrigés** (bug root-cause `startFrom` identifié — trim le fichier SOURCE, ne positionne PAS
   dans la timeline ; `<Sequence from={...}>` est le pattern correct) : Liptako-Gourma (ping par drapeau),
   Ressources (sons distincts or/uranium/pétrole), CFA (tension-pulse sur le maillon + swing léger de la
   clé), coût humain P4 (tick sur les compteurs 3M/15M+).

### ⛔ POINT OUVERT NON RÉSOLU — liseré blanc sur les frontières CEDEAO (mineur, pas bloquant)
Les contours des 4 pays côtiers (CI/Ghana/Bénin/Nigeria) affichent un liseré blanc/crème fin en
PERMANENCE (visible dès qu'ils entrent dans le cadre, indépendamment du pulse rouge qui, lui, fonctionne
bien par-dessus). **Confirmé indépendant de mon code** : désactivé le bloc CEDEAO complet (`{false && ...}`)
et re-rendu la même frame → liseré identique, donc c'est un résidu du fond de carte Mapbox natif, pas le
pulse/flèches ajoutés cette session.
**Pistes déjà éliminées par test direct (pas supposition)** :
- Le "reskin en continu" (listener `sourcedata` réappliquant le style à chaque tuile chargée, ajouté
  cette session dans `SahelWarMapEngine.tsx`) — aucun changement de pixel avant/après.
- Layer `admin-0-boundary-bg` (halo de fond) forcé à `line-opacity: 0` — aucun changement.
- Layer `admin-0-boundary-disputed` forcé à `line-opacity: 0` — aucun changement.
**Layers Mapbox confirmées présentes** (loggées au runtime) : `admin-1-boundary-bg`, `admin-0-boundary-bg`,
`admin-1-boundary`, `admin-0-boundary`, `admin-0-boundary-disputed` — toutes couvertes par le filtre
`l.id.includes("admin-0")` du reskin, sans effet sur ce liseré précis. Cause réelle non identifiée à la
fin de cette session. Décision Aziz : documenter et avancer, pas bloquant visuellement (pulse+flèches
lisibles par-dessus), à reprendre si le temps le permet ou si ça gêne au montage final.

### ✅✅✅ 2 DERNIERS FIXES APPLIQUÉS + VALIDÉS (2026-07-05) — VIDÉO FINALE VALIDÉE
Après un 2e visionnage complet du render v3, Aziz a signalé 2 derniers points, tous deux corrigés,
validés en mini-render, puis un render complet final relancé et validé :

1. **Hook "3" (Acte1) décentré vers le bas** — mesure pixel précise (`Acte1IntroSlam.tsx`) : centre réel
   du glyphe à 652px/1080 au lieu de 540px attendu. La compensation optique existante
   (`bigFontSize * 0.06`, ajoutée le 2026-07-01) était très insuffisante. Recalée à `bigFontSize * 0.183`
   après itération mesurée (652px → 500px → 529.5px, écart final <1% de la hauteur). Fichier :
   `src/projects/warmap/_shared/Acte1IntroSlam.tsx`.
2. **Doublon audio "d'anciennes tensions entre communautés couvent encore"** (P1, ~96-99s narration) —
   **cause root confirmée par force-alignment Whisper** (`scripts/tools/whisper-align.py`, ~$0.02/run) :
   le backup TTS resynthétisé pour le fix "déjà" (session précédente) contenait déjà cette phrase à sa
   fin (le texte demandé pour la resynthèse incluait toute la phrase, pas juste le mot), ET le
   `post-splice.mp3` de l'époque commençait à 94.18s (AVANT cette phrase dans l'original), donc les deux
   segments collés se chevauchaient en CONTENU, pas juste en timing. Fix : re-splice avec la bonne borne
   post-splice à 97.20s (juste après "encore." dans l'original, cf `narration-v5-alignment.json` pré-
   splice) au lieu de 94.18s. Vérifié par transcription Whisper : 1 seule occurrence après fix. Ancien
   fichier avec doublon (`narration-v5-expressive-AVEC-DOUBLON-2026-07-05.mp3`) absent du disque à ce
   jour (vérifié 2026-07-30) — fix appliqué et validé, épisode publié, sans conséquence.

⭐ **LEÇON MÉTHODE** : le force-alignment (transcription automatique avec timestamps) est BEAUCOUP plus
fiable que le calcul manuel de mapping timestamp↔frame pour diagnostiquer un problème audio précis — a
permis de trancher en quelques minutes ce qu'une investigation manuelle n'aurait fait que deviner.
Réutilisable pour tout futur doute sur un doublon/décalage audio : extraire la zone suspecte en clip
court, lancer `scripts/tools/whisper-align.py`, lire le texte+timestamps exact.

### ✅✅✅ VIDÉO FINALE VALIDÉE AZIZ (2026-07-05) — PROMUE PRET-PUBLICATION
Render complet final (`FULL-acte1-p1-p2-p3-p4-2026-07-05-SessionC-v4-FINAL.mp4`, 13501 frames, 7min30)
validé Aziz sans réserve après ces 2 derniers fixes. Promu vers
`out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`. Dossier `wip/` purgé (58 fichiers intermédiaires,
3.4GB) conformément à l'hygiène `out/` du projet.

**Reste avant publication effective (prochaine session)** : thumbnail + titre. Voir section
"PROCHAINE SESSION" en tête de fichier.

---

## ✅✅✅ SESSION B — ÉTAT DE FIN (2026-07-04) — LIRE EN PREMIER À LA REPRISE

### Fait et validé cette session
1. **Liptako-Gourma branché** dans `Partie3Rupture.tsx` (remplace `WarMapOverlayDynamic`) — validé Aziz sur mini-render contexte réel (catbox `ui241w`).
2. **Ressources branché** dans `Partie4Cout.tsx` (remplace `ResourcesReveal`, code mort supprimé) — validé Aziz (catbox `5g2fua`).
3. **HUD "Données estimées"** retiré sur toutes les Parties V5 (`SahelWarMapEngine.tsx`, gate `!isPartie` ajouté).
4. **Points Bamako/Ouaga/Niamey en continu** retirés en P1 (même gate `!isPartie`, `SahelWarMapEngine.tsx` ~2585).
5. **SFX résiduels doublons retirés** : impact CFA (`SahelWarMapEngine.tsx` ~1776, l'ancien split-screen) + ink-spread Ressources (les 2 nouveaux composants SVG gèrent déjà leur propre SFX interne).
6. **Mot "Sources :"** retiré du cartouche coût humain P4 (reste juste "OCHA · PAM · HCR").
7. **Source Moura déplacée** hors de la carte (bas-droite écran, même pattern que P4) au lieu d'incrustée aux coordonnées géo.
8. **Portraits dirigeants P4 agrandis** (`D = vmin*0.065 → 0.08`, `Partie4Cout.tsx` ~1115) — cause réelle du flou identifiée : gravure fine des sprites `p4-assets/leader-*.png` qui ne survit pas au downscale extrême (~70px), PAS un bug d'opacité `attenuate` comme le diagnostic initial le suggérait. Vérifié visuellement, plus de chevauchement Ouaga/Niamey avec cette valeur.
9. **CEDEAO P2 repensé** (`Partie2Blocage.tsx`) : les anciens marqueurs+flèches vers CI/Ghana/Bénin/Nigeria (hors-cadre Sahel) remplacés par une bande de dégradé qui pulse en bas d'écran + 3 flèches COURTES vers Niamey, jamais hors du cadre serré. `CEDEAO_RING` (code mort) supprimé de ce fichier.
10. **Fondu de transition f9410 (P3→P4)** ajouté : ~0.6s fondu au noir en fin de `Partie3Rupture.tsx` + fondu symétrique en début de `Partie4Cout.tsx` — Aziz confirme l'effet correct (une fausse alerte dictée vocale a semé le doute, tranchée : c'est bon).

### ⛔ SEUL POINT BLOQUANT AVANT RENDER FINAL — écho/reverb sur "déjà" (P1, f2743)
Aziz confirme à l'écoute : ce n'est PAS une répétition de mot (le script n'a qu'une occurrence à cet endroit,
vérifié dans `narration-v5-alignment.json` index 434, "parce que l'État est **déjà** absent de ces immenses
zones rurales"), mais un artefact du fichier audio lui-même — une aspérité façon écho/reverb sur cette syllabe
précise. Diagnostic (forme d'onde + spectrogramme, voir historique conversation) : PAS une reverb de salle
classique (pas de queue de décroissance séparée dans le temps), donc un simple filtre ffmpeg de-reverb
générique risque de ne rien arranger ou d'abîmer le reste du mot.

**Tentative faite cette session** : régénération TTS de la phrase complète ("Mais il faut bien comprendre une
chose : si ces groupes s'enracinent aussi facilement, c'est parce que l'État est déjà absent de ces immenses
zones rurales, où d'anciennes tensions entre communautés couvent encore.", tag `[solemn]`, même pipeline
`scripts/generate-narration-expressive.py` V3→STS GeoAfrique) — coût ~443 crédits, déjà payé. **Résultat
gardé en backup** : `memory/episodes/warmap-sahel/audio-fixes/deja-resynth-backup-2026-07-04.mp3` (12.49s).
**PROBLÈME** : dure 12.49s contre 10.0s pour l'originale (fenêtre 84.48s→94.18s dans `narration-v5-expressive.mp3`,
soit frames 2534→2825 à 30fps) — le TTS a inséré des pauses plus longues sur le ":" et la virgule après
"facilement,". Intégrer tel quel décalerait TOUT le reste de la narration de +2.49s, désynchronisant les
centaines de triggers F_* frame-précis du reste de la vidéo (P1 fin + P2 + P3 + P4 entiers). **PAS FAIT** —
décision Aziz : ne pas risquer la désynchro globale pour un artefact mineur sur 1 mot, traiter dans une
session dédiée.

**Pistes à explorer en session dédiée (aucune tranchée)** :
- Recouper les silences internes de `deja-resynth-backup-2026-07-04.mp3` (retirer ~2.5s dans les pauses,
  SANS toucher la voix elle-même) pour le faire tenir dans la fenêtre de 10.0s originale, puis re-tenter le splice.
- Tester un filtre ffmpeg ciblé (de-esser / spectral repair / compression transitoire) sur le SEUL mot "déjà"
  (90.94s→91.42s dans le fichier original) avant de conclure que rien de générique ne fonctionne — cette
  session a analysé (forme d'onde+spectrogramme) mais n'a PAS testé de filtre réel.
- Envisager un outil de "speech repair" dédié (ex. Adobe Podcast enhance, Resemble AI, ou équivalent) plutôt
  qu'un filtre ffmpeg brut, si disponible.
- En dernier recours : accepter l'artefact tel quel (Aziz : "pas bloquant pour le render final" si rien de
  fiable n'est trouvé rapidement).

### ▶ PROCHAINE SESSION — ORDRE DE TRAVAIL RECOMMANDÉ
1. Traiter l'écho "déjà" (voir pistes ci-dessus) OU décider de l'accepter tel quel.
2. **UN SEUL render complet Acte1+P1+P2+P3+P4** (jamais fait cette session — tout le travail ci-dessus n'a
   été vérifié qu'en mini-renders isolés). Vérifier avec `check-frame-continuity.py` avant tout envoi à Aziz.
3. Si le render complet révèle un souci non anticipé (calage Liptako/Ressources en contexte VRAIMENT bout-en-
   bout avec musique, pas juste narration isolée comme testé cette session) : ajuster les constantes de timing
   internes (nommées en tête de `LiptakoRevealSVG.tsx`/`ResourcesRevealSVG.tsx`), PAS tronquer le SVG.
4. Une fois le render complet propre et validé Aziz : promouvoir vers `out/PRET-PUBLICATION/`.

---

## ⛔⛔⛔ REPRISE SESSION SUIVANTE (2026-07-04) — SOURCE DE VÉRITÉ ACTUELLE

### Contexte : plan en 2 sessions, décidé avec Aziz le 2026-07-04

Après le fix du bug critique des trous de frames (session 2026-07-01, voir section "REPRISE 2026-07-01"
ci-dessous pour le détail), Aziz a visionné les renders corrigés et donné une deuxième vague de retours
précis (frame-par-frame, captures d'écran à l'appui). Le contexte de cette session devenait trop long pour
tout traiter — **décision : scinder en 2 sessions dédiées**, dans cet ordre strict :

- **SESSION A (celle-ci ou la suivante) — CONSTRUCTION DES SVG.** Construire/valider les 3 inserts SVG
  narratifs SANS toucher au reste du code, SANS render complet (juste des mini-renders isolés pour juger
  chaque SVG). Détail des 3 SVG plus bas.
- **SESSION B (après validation des SVG) — INTÉGRATION + FIXES + RENDER FINAL UNIQUE.** Tous les fixes
  techniques listés ci-dessous (jetons flous, coupures, sources, caméra, HUD "données estimées") + brancher
  les 3 SVG validés en Session A + **UN SEUL render complet bout-en-bout** (Acte1+P1+P2+P3+P4), vérifié
  par `check-frame-continuity.py` avant toute présentation.

Ne PAS mélanger les deux : la Session B ne doit démarrer QUE quand les 3 SVG de la Session A sont validés
par Aziz (évite de re-render tout après coup si un SVG déplaît).

### 🎨 SESSION A — LES 3 SVG À CONSTRUIRE/VALIDER

1. **CFA (déjà fait, à finaliser)** — `src/projects/warmap/parties/CfaRevealSVG.tsx` existe déjà (adapté du
   prototype validé `out/_r-and-d/cfa-svg/cfa-insert-svg-ALT-FINAL.mp4`), branché dans `Partie4Cout.tsx` à
   la place de l'ancien `CfaReveal` (split-screen "PowerPoint"). **Codé mais JAMAIS re-rendu/vu** — la
   Session A doit juste faire un mini-render isolé (P4, `--frames=11860-12200` environ, autour de F_CFA=11869)
   pour qu'Aziz le valide visuellement. Si ok → rien d'autre à faire dessus.
2. **Liptako-Gourma (à construire)** — remplace l'encadré actuel jugé "peu convaincant" au début de P3
   (`WarMapOverlayDynamic` dans `Partie3Rupture.tsx`, inAt=F_BAMAKO=6118, outAt=F_EPREUVE=6800). Piste
   Aziz : SVG narratif façon Cacao/CFA. Pas de design existant — à concevoir de zéro (pipeline
   `PRODUCTION-AGENTIQUE-SVG.md` recommandé). Contenu narratif à porter : "16 septembre 2023 · Charte du
   Liptako-Gourma" + les 3 drapeaux (Mali/Burkina/Niger) + citation du pacte. Réutiliser le concept
   symbolique déjà choisi pour le CFA (objet central + ramifications) si ça colle : ex. un sceau/pacte qui
   se scelle, 3 fils qui convergent vers un centre.
3. **Triple-screen ressources (à construire)** — remplace `ResourcesReveal` (`Partie4Cout.tsx` ligne ~1057,
   inAt=F_OR-20≈10647, outAt=F_CONFED-16≈11433), jugé "statique tout le long" malgré son animation actuelle
   (contours pays qui se remplissent + icônes). Piste Aziz (déjà actée session 2026-06-15/07-01) :
   graphisme SVG narratif dynamique façon "objet-héros unique" — référence explicite = la dernière scène
   du Short Cacao (`out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4` ou ses sources SVG) où le cacao devient
   un objet central avec des ramifications vers callbot/or/pétrole. Ici : un objet central (ex. le Sahel/
   les 3 pays en bloc) avec 3 ramifications vers or (Mali/Burkina)/uranium(Niger)/pétrole(Niger). Pas de
   design existant — à concevoir de zéro.

Pour 2 et 3 : suivre la doctrine `memory/doctrines/SVG-SCENES-GENERATIVES.md` et le pipeline
`memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` (agent A→Z, prouvé sur GGW + cargo). Valider l'image-cible
AVANT le code (`SVG-FAISABILITE-AMONT.md`).

### ✅✅ SESSION A TERMINÉE (2026-07-04) — LES 3 SVG SONT VALIDÉS AZIZ, CODÉS, TESTÉS ISOLÉMENT

**Les 3 chantiers sont CLOS.** Reste UNIQUEMENT le branchement dans le moteur + calage de durée fin en
Session B (détail plus bas — ⛔ point d'attention explicite, ne pas juste copier-coller le composant).

1. **CFA** — `src/projects/warmap/parties/CfaRevealSVG.tsx`. Déjà branché dans `Partie4Cout.tsx:1154`
   (`inAt={F_CFA}` `outAt={F_STATU-24}`, soit f11869→f12273, 404 frames ≈13.5s). Validé Aziz sur mini-render
   isolé (catbox `lncgo6`). **Rien à changer dans le composant.** Un seul point pour Session B : un SFX
   résiduel de l'ANCIEN split-screen (`SahelWarMapEngine.tsx:1780-1783`, `Sequence from={12193}` qui joue
   `impact.mp3`, commentaire "climax du fil de parité vibrate") fait doublon avec le SFX interne du SVG —
   **à retirer** (+ mettre à jour le commentaire lignes 1740-1742 qui référence encore l'ancien layout SFX).

2. **Liptako-Gourma** — NOUVEAU fichier `src/projects/warmap/parties/LiptakoRevealSVG.tsx` (n'existait pas
   avant cette session). Concept : miroir narratif du CFA — un SCEAU DE CIRE qui SE SCELLE (3 cordages
   Mali/Niger/Burkina Faso convergent, sceau passe de cire terne à écarlate vif au mot "scellent", impact +
   3 anneaux entrelacés + étoile gravés, texte circulaire "CHARTE DU LIPTAKO-GOURMA · UNION SAHÉLIENNE"),
   avec les 3 VRAIS drapeaux (ml/ne/bf.png, `_shared/flags/`) qui apparaissent en séquence étalée (L90/150/
   210) dans des écussons, ondulant en continu (clip-path sinusoïdal). Cible SVG source : `out/_r-and-d/
   warmap-svg-inserts/liptako-gemini.svg` (générée Gemini 3.1 Pro, brief "exigence+liberté" sans image de
   référence — cf doctrine GUIDER SANS BRIDER). Mini-render validé Aziz : catbox `hlt9kt` (v3, 682 frames
   = 22.7s, correspond exactement à la fenêtre F_BAMAKO=6118→F_EPREUVE=6800 du moteur).
   **PAS ENCORE BRANCHÉ dans `Partie3Rupture.tsx`** — actuellement l'ancien `WarMapOverlayDynamic` (lignes
   858-879) est toujours actif. Session B doit : importer `LiptakoRevealSVG`, le brancher avec
   `inAt={F_BAMAKO}` `outAt={F_EPREUVE}`, retirer/commenter l'ancien `WarMapOverlayDynamic`.

3. **Ressources ("le levier des ressources")** — NOUVEAU fichier `src/projects/warmap/parties/
   ResourcesRevealSVG.tsx` (n'existait pas avant cette session). Concept : objet-héros unique = un BOUCLIER
   MÉDIÉVAL AES (silhouette écu, rebord doré épais, rivets) qui SE DESSINE au contour (stroke-dasharray),
   avec le SCEAU AES réel en blason central (étoile + "A·E·S", repris de `ConfederationReveal` dans
   `Partie4Cout.tsx` — cohérence visuelle avec le sceau qui scelle la confédération plus loin dans P4), et
   3 VEINES texturées (or/uranium/pétrole) qui se tracent en cascade puis ont des GOUTTES DE FLUX qui glissent
   en continu vers le bouclier (ravitaillement, pas extraction-fuite). Cible SVG source : mix-and-match de
   `out/_r-and-d/warmap-svg-inserts/ressources-gemini.svg` (1re génération, veines organiques) + le fix
   bouclier ciblé (`ressources-gemini-v3-shield.svg`) — historique complet dans le dossier `out/_r-and-d/
   warmap-svg-inserts/`. Mini-render validé Aziz : catbox `9w86rf` (v2, 786 frames = 26.2s, correspond
   exactement à F_OR-20=10647→F_CONFED-16=11433 du moteur).
   **PAS ENCORE BRANCHÉ** — actuellement l'ancien `ResourcesReveal` (`Partie4Cout.tsx:1057`, composant défini
   ligne ~376) est toujours actif. Session B doit : importer `ResourcesRevealSVG`, le brancher avec
   `inAt={F_OR-20}` `outAt={F_CONFED-16}` à la place de l'appel à `ResourcesReveal`.

**⛔⛔ POINT D'ATTENTION EXPLICITE POUR LA SESSION B (demande Aziz 2026-07-04) — CALAGE DE DURÉE :**
Les 2 nouveaux composants ont été chorégraphiés et testés ISOLÉMENT (composition de test `LiptakoRevealSVG-
Test`/`ResourcesRevealSVG-Test` dans `Root.tsx`, sans la vraie narration/musique jouée par-dessus). Leur
durée interne (682f et 786f) a été calée sur le DÉCOUPAGE AUDIO RÉEL extrait de `narration-v5-alignment.json`
au moment de cette session — mais **à l'intégration finale (Session B), il FAUT reconfirmer que ce calage
colle exactement à la voix + musique jouées en contexte réel** (le moteur peut avoir des micro-décalages
non testés ici : mixage audio final, éventuel padding/silence ajouté au montage, timing réel vs timing
mesuré). Si un écart apparaît : ALLONGER ou RESSERRER la chorégraphie interne (les frames de chaque geste
sont des constantes nommées en tête de fonction dans chaque fichier, faciles à retimer) plutôt que de
tronquer/couper le SVG — l'intention (cause→effet, payoff couleur au bon mot) doit rester intacte même si
le calage bouge de quelques frames. Vérifier au moins une fois avec l'audio réel avant le render final unique.

Les 2 compositions de test (`LiptakoRevealSVG-Test`, `ResourcesRevealSVG-Test` dans `Root.tsx`) peuvent être
retirées de `Root.tsx` une fois l'intégration réelle faite en Session B (ou laissées, elles ne gênent rien).

### 🔧 SESSION B — FIXES TECHNIQUES (tous nouveaux retours Aziz du 2026-07-04, précis frame-par-frame)

**Bloc 1 (Acte1+P1+P2) :**
1. **HUD "Données estimées · Sources : Wikipedia, ONU, HRW, UNHCR" encore visible** — CAUSE TROUVÉE :
   `SahelWarMapEngine.tsx:2924` gate `{!acte1Refonte && (...)}` → ce HUD bas-droite s'affiche sur TOUS les
   modes SAUF `acte1Refonte` (donc visible sur P1/P2/P3/P4, alors qu'il ne devrait l'être nulle part sauf
   remplacé par les sources ponctuelles déjà ajoutées en P3/P4). Fix : étendre le gate à
   `!acte1Refonte && !partie1 && !partie2 && !partie3 && !partie4` (ou l'inverse : gate positif sur les
   seuls modes qui en ont VRAIMENT besoin, probablement aucun vu que P3/P4 ont déjà leurs sources
   ponctuelles). Concerne tout le bloc 1 ET le bloc 2 (HUD global du moteur, pas par Partie).
2. **Dirigeants AES (P1, ~f530-950) : ré-apparition en début de séquence.** Après le sceau AES (~f530), en
   PLUS de leur apparition finale (déjà en place), faire apparaître les 3 portraits dirigeants dans leurs
   positions respectives, rester en place, puis disparaître juste quand le 1er jeton JNIM apparaît
   clairement (~f950). Réutiliser les sprites `p4-assets/{...}.png` déjà utilisés en P4 (LEADERS).
3. **Coupure nette ~f1100 (mot "revenir")** : flash net, pas de raccord seamless. Cause suspectée par Aziz :
   le mot/label "2012" apparaît/se répète deux fois à ce moment précis, ce qui casserait la continuité
   visuelle. À investiguer dans `Partie1Origine.tsx` autour de F_2012=2102 (attention : ce chiffre est en
   frames ABSOLUES du moteur, pas la frame locale ~f1100 mentionnée par Aziz dans son retour vidéo — vérifier
   la conversion, probablement un time code lecteur vidéo local au bloc uploadé, pas la frame absolue).
4. **Garder "2012" affiché en bas à gauche de la carte** au moment du bascule — confirmation, NE PAS
   retirer ce label (contrairement à d'anciennes notes qui pourraient suggérer le contraire).
5. **"déjà" prononcé/affiché deux fois** (au moment "l'État est déjà absent", ~f2800 zone) — confirmé
   encore présent après le fix des trous. Investiguer `Partie1Origine.tsx` autour de F_ABSENT=2743.
6. **Dézoom complet qui montre toute l'Afrique reste problématique** (violences hors Mali) — CONFIRMÉ non
   résolu par le fix des trous (contrairement à l'hypothèse de la session précédente). Localiser dans
   `getPartie2Cam` (`SahelCameras.ts`) le keyframe responsable du dézoom large et le retirer/resserrer —
   Aziz veut rester en plan serré tout le long de cette phase.
7. **Retirer les points Bamako/Ouagadougou/Niamey affichés en continu** pendant toute la P1 (Partie1Origine.tsx)
   — pas nécessaires selon Aziz sur toute la durée de cette partie.
8. **CEDEAO (~f5700-6200) : repenser complètement** (déjà acté 2026-07-01, confirmé 2026-07-04). Rejette les
   triangles oranges + SFX craquement. Direction actée avec Aziz (2026-07-01) : frontière Sud qui pulse/
   s'illumine au bord de l'écran + flèches courtes vers Niamey, SANS jamais sortir du cadre serré. Si aucune
   solution visuelle satisfaisante n'est trouvée, Aziz accepte qu'on NE MONTRE PAS visuellement la CEDEAO
   (la voix seule suffit) plutôt que de garder les triangles actuels.
9. **~f6200 "face à cette menace, Bamako et Ouagadougou..." : coupure nette** (pas un raccord) au moment de
   la transition vers l'encadré Liptako-Gourma. Sera probablement résolu une fois l'encadré remplacé par le
   SVG narratif (Session A point 2) — à revérifier après intégration.

**Bloc 2 (P3+P4) :**
10. **Source Moura : ne PAS l'afficher SUR la carte** — actuellement `Partie3Rupture.tsx` affiche
    "Source : Haut-Commissariat de l'ONU aux droits de l'homme" directement sur la carte près de Moura
    (fix de cette session 2026-07-01, pt.12/7). Aziz veut cette source déplacée vers l'emplacement standard
    où les autres sources du projet s'affichent d'habitude (PAS sur la carte elle-même). Clarifier avec
    Aziz where "d'habitude" pointe exactement si ambigu (probablement bas d'écran, cartouche dédié, pas
    incrusté dans la géographie).
11. **Cartouche coût humain (P4, ~F_COUT=10047) : retirer le mot "Source :"** — actuellement affiche
    "Sources : OCHA · PAM · HCR" (fix 2026-07-01 pt.7, `Partie4Cout.tsx` ligne ~1135). Aziz veut juste le nom
    de l'institution, SANS le mot "Source(s) :" — sauf si Claude juge que ça fait sens de le garder à cet
    endroit précis (à trancher au moment du fix, pas à deviner maintenant).
12. **Printemps 2026 attaques (P3, zone F_REPOUSSE=9121) : jetons/soldats trop tardifs.** Aziz veut que les
    jetons apparaissent plus tôt, dès le début des mouvements de caméra vers les zones concernées (pas
    seulement au moment du trigger narratif), pour combler les micro-vides visuels pendant les transitions
    caméra.
13. **~f9500 "territoire conservé... derrière les drapeaux" (fin P3→début P4) : coupure nette + 10s de
    "sceaux qui clignotent" jugées pauvres.** Aziz veut plus de matière visuelle avant la scène des réfugiés
    (P4 M1 Exode). Zone : fin `Partie3Rupture.tsx` (F_CONSERVER=9372, F_END=9410) → début `Partie4Cout.tsx`
    (F_FAMILLES). Proposer des idées concrètes à Aziz avant de coder (pas trancher seul, décision de goût).
14. **Zoom ~f12456 (P4, entre CFA et dirigeants finaux) : ~10s vide.** Après l'insert CFA, les 3 pays sont
    affichés ~10s sans rien avant le zoom+dirigeants (F_LEADERS=12640). Meubler cette zone (dézoom continental
    Ph9-10, cf `Partie4Cout.tsx` F_STATU=12297 → F_LEADERS=12640).
15. **Écran final (dos noir, extinction) : ajouter un son typewriter** pour la ligne finale "durer... c'est
    ce qu'il reste à démontrer" (F_DURER=13290 → F_END=13500, `Partie4Cout.tsx`).
16. **⭐ JETONS FLOUS/SEMI-TRANSPARENTS en P4 (dirigeants + jetons, capture à l'appui) — PRIORITÉ.** Aziz
    confirme n'avoir JAMAIS eu ce problème sur aucun jeton d'aucune autre partie — bug spécifique à cette
    zone P4 (dirigeants+soldats, ~F_LEADERS=12640 à F_SOLDIERS=12820). PISTE DE CAUSE TROUVÉE cette session :
    `Partie4Cout.tsx` ligne ~1204 (`attenuate` soldats tombe à opacité **0.55** au moment F_THREAT) et ligne
    ~1231 (`attenuate` dirigeants tombe à **0.7**, alors que le commentaire dans le code dit "40%" — décalage
    documentation/code à vérifier). Combiné à un `spring()` qui peut ne jamais atteindre 1.0 selon la frame
    observée, ça peut expliquer l'effet flou/fantôme vu sur la capture. À investiguer et corriger en
    PRIORITÉ dans cette liste (bug visuel net, pas une préférence de goût).
17. **SFX résiduel à retirer — "boom"/impact à la toute fin du CFA.** Aziz confirme le CFA (Session A,
    mini-render catbox `lncgo6`) mais signale un SFX qui "se fait attendre" en toute fin, dont il ne se
    souvient plus bien de la raison. TROUVÉ dans le code : `SahelWarMapEngine.tsx:1780-1783`, `Sequence
    from={12193}` (commentaire "climax du fil de parité (vibrate), ~F_CFA+324") joue `impact.mp3` volume
    0.35 — c'est un résidu de l'ANCIEN `CfaReveal` (split-screen "PowerPoint", remplacé par `CfaRevealSVG`
    depuis, cf commentaire ligne 1741 qui référence encore "climax vibrate fil de parité"). Le nouveau SVG
    n'a pas de geste correspondant à ce moment précis (F_CFA+324=12193 tombe pendant la phase de tension/
    rupture du maillon, mais le SVG a son PROPRE SFX interne — `ink-spread` dans `CfaRevealSVG.tsx:199-200`
    — donc ce 2e impact au niveau moteur fait doublon/parasite). **Fix Session B : retirer purement ce
    `<Sequence from={12193}>` bloc (lignes 1780-1783) et mettre à jour le commentaire ligne 1740-1742 qui
    référence encore l'ancien layout SFX.**

### 📋 Rappel process (ne pas relire toute l'ancienne section sauf besoin)
- Le bug des trous de frames (jonctions P1→P2→P3→P4) est **RÉSOLU** cette session (2026-07-01) — bornes
  contiguës validées par `check-frame-continuity.py`. Ne pas revérifier sauf régression suspectée.
- Fichiers déjà re-rendus avec les fixes du 2026-07-01 : `wip/p1-continuous.mp4`, `wip/p2-continuous.mp4`,
  `wip/p3-continuous.mp4`, `wip/p4-continuous.mp4` (+ assemblage `wip/FULL-acte1-p1-p2-p3-p4-FIXED.mp4`,
  368MB, et sa version compressée 720p `wip/FULL-acte1-p1-p2-p3-p4-720p.mp4`, 46MB, pour mobile/LLM externe
  — technique de compression : `ffmpeg -vf scale=1280:720 -c:v libx264 -crf 23`).
- **NE PAS repartir de ces fichiers tels quels pour la Session B** : ils datent d'AVANT tous les fixes listés
  ci-dessus (sauf CFA qui est codé mais pas re-rendu). La Session B doit re-render P1/P2/P3/P4 à nouveau
  après avoir appliqué tous les fixes 1-16 + branché les 3 SVG validés en Session A.
- Overrides tracés créés pour contourner le hook `pre-presentation-review.sh` sur ces renders intermédiaires
  (fix technique, pas de storyboard applicable) : voir `wip/*.review-override.md`. Pattern réutilisable si
  le même besoin se présente (upload direct sans passer par Gemini, sur décision explicite Aziz).

---

## ⛔⛔⛔ REPRISE SESSION SUIVANTE — LIRE CECI EN PREMIER (2026-07-01)

### Contexte de cette session (2026-07-01)
Passe de correction post-audit (voir section "PASSE AUDIT" plus bas pour le détail du backlog de départ).
Corrections codées et rendues : chantier SFX unifié P1-P4, raccord CEDEAO P2→P3 renforcé, drone résiduel Moura
retiré + plateau meublé, bugs P4 (labels superposés + cartouche transparent) corrigés, onde de choc Niger +
sillage renforcé P2, puis 2e passe : légende retirée P1, contours nationaux colorés étendus à P1 (au lieu du
fond mosaïque plein), drapeau libyen géographique réel sur le territoire P1, "2012" qui s'efface au lieu de
rester affiché, timeline graduée retirée de P2 ET P3. Tout ce code est BON et VALIDÉ visuellement par Aziz
dans les grandes lignes (voir ses retours détaillés ci-dessous — ce sont des affinages, pas des rejets).

### ⛔ BUG CRITIQUE DÉCOUVERT : les 2 blocs présentés à Aziz (bloc1 catbox `sjy5ua`, bloc2 catbox `yzx3dh`)
### ont des TROUS DE FRAMES aux jonctions — pas un problème de code/script, un problème de MES COMMANDES DE RENDER.

Chaque render de scène a été fait avec `--frames=X-Y` en isolant des plages qui ne se raccordent PAS bout à
bout avec la plage suivante. L'audio de narration, lui, est continu dans le moteur — donc à chaque jonction
mal calculée, des SECONDES ENTIÈRES de narration+visuel ont été sautées dans le fichier final. C'est la cause
directe de tout ce qu'Aziz a perçu comme "voix qui saute / se répète / coupures brutales / contenu manquant"
(il a listé ~8 endroits distincts avec ce symptôme dans son retour du 2026-07-01, voir section "RETOURS AZIZ"
ci-dessous — TOUS ou presque sont probablement ce même bug, pas 8 bugs différents).

**Trous mesurés (frames absolues moteur, @30fps) :**
| Jonction | Fin segment A | Début segment B | Trou | Durée manquante |
|---|---|---|---|---|
| P1 → P2 | 2939 | 3196 | 257f | **8.6s** (coupe AVANT le board-clearing qui commence à f3050 — coupe en plein milieu d'une transition) |
| P2 → P3 | 5699 | 6118 | 419f | **14.0s** |
| P4a (exode) → P4b (ressources) | 10247 | 10647 | 400f | **13.3s** — explique le "boum" ressenti par Aziz à 2:16 du bloc2 |
| P4b → P4c (confed) | 11469 | 11501 | 32f | 1.1s |
| P4c → P4d (cfa) | 11887 | 11849 | **-38f** | **CHEVAUCHEMENT NÉGATIF** — P4d rejoue ~1.3s déjà jouées par P4c → explique la voix "CFA" répétée 2x entendue par Aziz vers 2:43-2:45 |
| P4d → fin réelle | 12297 | F_END=13500 | 1203f | **40.1s ENTIÈREMENT ABSENTES** — toute la séquence Chantier 4 "fin habitée" (dirigeants f12640 → soldats f12820 → menace f13000 → extinction f13290→13500) N'A JAMAIS ÉTÉ RENDUE. Aziz n'a donc PAS vu la vraie fin de la vidéo. |

**Ce qui n'a PAS ce problème** : Acte1 (fichier existant `acte1-FINAL.mp4`, inchangé) ; P1 en lui-même (2055-2939,
continu) ; P2 en lui-même (3196-5699, continu) ; P3 en lui-même (6118-9409, continu). Le bug est uniquement
AUX JONCTIONS entre fichiers séparés, pas à l'intérieur de chaque scène.

### ✅ ACTION #1 PROCHAINE SESSION (avant tout le reste) : re-render en plages CONTINUES, sans trou
- **Bloc 1** : Acte1 (fichier existant, inchangé) + P1+P2 en **UN SEUL render continu `--frames=2055-5699`**
  (au lieu de 2 renders séparés) + P3 `--frames=5699-9409` (étendre le début pour couvrir le trou vers P3 —
  vérifier d'abord ce qu'il y a réellement entre 5699 et 6118 dans le code, probablement un board-clearing
  similaire à celui de P1→P2, confirmer avant de trancher la borne exacte).
- **Bloc 2 (P4)** : **UN SEUL render continu `--frames=9416-13500`** (4084 frames, long — utiliser
  `scripts/render-mapbox.sh`, PAS `npx remotion render` en direct, cf leçon apprise cette session : le script
  gère chrome-headless-shell + `--gl=angle` + public-dir allégé, sans lui l'erreur `Failed to initialize WebGL`
  apparaît). Ce fichier couvrira ENFIN la vraie fin de la vidéo (extinction) qu'Aziz n'a jamais vue.
- Réassembler les 2 blocs (ou tenter directement UN SEUL fichier complet Acte1+P1+P2+P3+P4 si Aziz préfère —
  voir sa demande initiale de découpage en "2-4 points de jugement max", à reconfirmer selon ce qui est
  gérable niveau temps de render : P4 seul continu = ~136s de contenu = plusieurs dizaines de minutes de render).
- ⛔ **Avant de présenter à nouveau à Aziz : vérifier qu'il n'y a AUCUN autre trou.** Un garde-fou a été créé
  cette session : `python3 scripts/tools/check-frame-continuity.py <start-end> <start-end> ...` (mêmes bornes
  que les `--frames=` de chaque segment, dans l'ordre) — DOIT renvoyer exit 0 (OK) avant tout `ffmpeg concat`
  ou envoi à Aziz. Testé et fonctionnel (détecte les 3 trous/chevauchements de cette session avec les bonnes
  durées). Règle gravée dans `memory/doctrines/DOCTRINE-SOUVERAIN.md` §3.8 point 6 (checklist Mapbox-in-Beat) —
  s'applique à TOUT render Mapbox multi-segments futur, pas seulement cet épisode.

### 📋 RETOURS AZIZ DÉTAILLÉS (2026-07-01, visionnage bloc1+bloc2) — à traiter APRÈS le fix des trous

**Bloc 1 (Acte1+P1+P2) :**
1. Hook chiffre "3" pas centré (trop bas à l'écran) — à recentrer.
2. 1:09-1:11 raccord Acte1→P1 brutal, sensation de répétition de la bascule — **probablement résolu par le
   fix des trous ci-dessus** (P1 commençait à 2055, AVANT le board-clearing complet), à revérifier après.
3. 1:39 coupure "tensions entre communautés" → "Serval" — **= le trou P1→P2 documenté ci-dessus, résolu par le fix**.
4. ~2:30 la caméra dézoome large (on voit une grande partie de l'Afrique) sans raison narrative claire — Aziz
   préfère rester serré comme le reste de la vidéo. Localiser ce zoom dans le code caméra de P2 (probablement
   `getPartie2Cam`) et vérifier s'il est voulu ou un residu — semble correspondre à la zone du trou P2→P3
   documenté ci-dessus (le contenu manquant pourrait expliquer pourquoi ce zoom "sort de nulle part" — à
   revérifier une fois le trou comblé, il est possible que ce zoom ait un sens dans le contenu qui manquait).
5. **Constat transversal sur tout le bloc 1** : après les 30 premières secondes (Acte1), les contours nationaux
   colorés (Mali/Burkina/Niger) ne sont JAMAIS visibles, et la technique "contour qui s'allume/pulse à la
   nomination du pays" n'est jamais utilisée. Ceci concerne P2 spécifiquement (P1 vient d'être corrigée cette
   session pour avoir les contours — à reconfirmer après re-render sans trou qu'ils sont bien visibles ; P2
   n'a PAS eu cette correction cette session, contrairement à P1 — **P2 doit recevoir le même traitement que P1**
   point 2 de la passe précédente : fond mosaïque neutralisé + contours nationaux colorés actifs).
6. 1:33-1:34 le mot "déjà" semble prononcé deux fois / réverbération étrange — à vérifier après fix des trous
   (pourrait aussi être un artefact de coupure).
7. **Mention "données estimées"** (et suggestion "sources Wikipédia" etc.) jugée insuffisante — Aziz veut de
   VRAIES SOURCES qui apparaissent ponctuellement à l'écran (comme dans d'autres vidéos du projet), pas juste
   une mention discrète en bas d'écran. Concerne TOUT le bloc 1 ET le bloc 2. Chantier : identifier chaque
   endroit où une donnée chiffrée est affichée sans source claire, ajouter une source réelle (2-3s d'affichage,
   suffisamment visible, jamais permanente sur la carte).
8. Fin bloc 1 (~3:00-3:03, beat CEDEAO) : les flèches qui apparaissent (~3:00) ne sont pas claires dans leur
   sens (censées représenter les pays CEDEAO ? pas évident). SFX "craquement" jugé inutile. Aziz suggère de
   rester en caméra SERRÉE sur la zone Sahel plutôt que d'élargir pour montrer la CEDEAO hors-zone — trouver
   une autre manière de représenter la menace CEDEAO sans sortir du cadre serré habituel de la vidéo.
   ⚠️ NOTE : ce point (CEDEAO renforcée) est PRÉCISÉMENT ce qui a été ajouté cette session (agent SFX, cf
   plus haut "raccord CEDEAO P2→P3 renforcé") suite à l'audit P2 — Aziz n'aime PAS le résultat visuel obtenu,
   à repenser (pas juste re-doser, RE-CONCEVOIR la représentation).

**Raccord bloc1 → bloc2 :**
9. Aziz ne sait pas si le raccord bloc1(fin ~3:03, "CEDEAO, la grande coalition")→bloc2(début, "toute agression
   contre le Niger" + encadré Charte Liptako-Gourma) sera fluide une fois tout assemblé en continu — sensation
   qu'il manque un morceau entre les deux. **Probablement lié au trou P2→P3 documenté ci-dessus** (le bloc2
   commence directement par P3, qui elle-même commençait avec un trou de 14s avant elle) — à revérifier après fix.
10. L'encadré "Charte du Liptako-Gourma" (~20s au début P3) juge peu convaincant tel quel — Aziz propose
    d'explorer un remplacement en SVG narratif (comme le pipeline `PRODUCTION-AGENTIQUE-SVG.md` prouvé sur
    Cacao/CFA) pour meubler ce passage plutôt que garder l'encadré actuel — À ÉVALUER PROCHAINE SESSION,
    pas trancher seul, decision de goût + faisabilité technique à explorer ensemble ou via agent dédié.

**Bloc 2 (P3+P4) :**
11. Ville de Kidal / casques bleus ONU : actuellement seules les bases MINUSMA sont représentées. Aziz propose
    d'ajouter 1-2 jetons "casques bleus" physiques (en plus des bases, ou en remplacement partiel) pour mieux
    montrer visuellement qu'ils sont présents mais sans mandat d'intervenir par les armes — pas juste des
    bâtiments, des figurants qui incarnent l'impuissance. Vérifier faisabilité (asset existant ou à générer).
12. Moura : retirer le texte typewriter "500+ morts recensés · aucune réponse officielle de Bamako" ajouté
    cette session (Aziz juge que la plaque "MOURA · MARS 2022 · RAPPORT ONU" existante suffit, le texte
    supplémentaire n'apporte rien) — MAIS garder l'intention de meubler le plateau figé de mouvement, trouver
    une autre solution (piste : la source ONU pourrait apparaître visiblement 2-3s au lieu du texte retiré,
    cf point 7 sur les sources — pourrait résoudre 2 problèmes à la fois).
13. ~1:49 saut abrupt juste avant le début du récit réfugiés — **= le trou P2→P3 documenté ci-dessus (bloc2
    commence par P3), résolu par le fix des trous**.
14. Passage réfugiés (jetons qui fuient les villes, ~2:03) : Aziz trouve ça "quand même assez bien" mais se
    demande si ça pourrait être plus intéressant visuellement — pas un rejet, une piste d'amélioration à
    explorer si le temps le permet, pas prioritaire.
15. ~2:16 coupure brutale coût humain (overlay "3M déplacés / 15M+ sécurité alimentaire") → triple-screen
    ressources — **= très probablement le trou P4a→P4b documenté ci-dessus (13.3s manquantes), résolu par le fix**.
16. Triple-screen ressources (Mali/Burkina/Niger, or/uranium/pétrole) : Aziz le juge "statique tout le long",
    suggère de le remplacer par un graphisme SVG narratif dynamique façon "objet-héros unique" (référence
    explicite : la dernière scène du Short Cacao où le cacao devient un objet central avec des ramifications
    vers callbot/or/pétrole) plutôt qu'un triple-screen figé. **À évaluer prochaine session** (piste forte,
    mais refonte complète d'une scène — décision de goût + effort, pas à trancher seul).
17. ~2:43-2:45 raccord confédération→sceau AES : voix qui saute, "comme si on venait de raccorder des scènes
    de manière brusque" — **très probablement le trou P4b→P4c documenté ci-dessus (1.1s), résolu par le fix,
    mais à revérifier précisément car l'écart mesuré est faible (1.1s) par rapport à la gêne perçue — si le
    fix ne résout pas totalement ce point, creuser plus (peut-être aussi un souci de mixage audio à ce point,
    pas seulement un trou de frames)**.
18. Confédération AES jugée à rendre "plus dynamique" (dans la continuité du point 16, même diagnostic —
    scène jugée trop statique/overlay figé).
19. Franc CFA : la voix dit "celle du franc CFA" **deux fois de suite** — **= très probablement le
    CHEVAUCHEMENT NÉGATIF P4c→P4d documenté ci-dessus (P4d rejoue du contenu déjà joué par P4c), résolu par
    le fix**. Aziz confirme aussi vouloir sortir cette scène de l'effet "PowerPoint" — remplacement SVG
    narratif suggéré, ET rappel qu'**un prototype SVG du CFA existe déjà** (`out/_r-and-d/cfa-svg/cfa-insert-svg-ALT-FINAL.mp4`,
    produit lors d'une session antérieure via le système agentique SVG, jamais encore comparé/tranché vs la
    version Remotion actuelle) — à ADAPTER/réutiliser plutôt que reconstruire de zéro.
20. Aziz rappelle qu'il n'a PAS vu la fin réelle de la vidéo (le bloc2 présenté s'arrêtait à P4d/CFA) —
    **confirmé par le diagnostic ci-dessus : les 40 dernières secondes n'ont jamais été rendues**. La
    "Partie 4 à re-vérifier" mentionnée par Aziz = cette séquence finale jamais vue, pas une partie 4 distincte
    au sens du projet (le projet n'a que Acte1+P1+P2+P3+P4, P4 EST la dernière partie, son extinction finale
    n'a simplement jamais été rendue dans les fichiers présentés).

### 🔧 LEÇON PROCESS — méthode d'audit agent à améliorer (constat Aziz explicite)
> "Je suis surpris que les agents n'aient pas vu tout ceci... il va falloir qu'on améliore notre process,
> comment les agents font une review."

Aucun des 4 audits scène + l'agent transversal (session du 2026-07-01, cf section PASSE AUDIT ci-dessous)
n'a détecté qu'un futur découpage en fichiers séparés créerait des trous de jonction — logique, ces audits
jugeaient les scènes EXISTANTES déjà rendues à l'époque, pas un futur re-découpage. Mais la leçon plus large :
**aucun agent (ni Aziz avant son visionnage manuel) n'a vérifié que les plages de frames rendues COUVRENT
BIEN la continuité narrative attendue avant de présenter le livrable.** Piste pour la prochaine session : avant
tout envoi de render à Aziz, un agent (ou une étape scriptée) devrait comparer systématiquement les bornes de
chaque segment aux triggers F_* du code source pour détecter les trous — un simple calcul arithmétique aurait
détecté ce bug en quelques secondes, avant même de faire tourner ffmpeg. À formaliser comme étape obligatoire
(checklist ou script `check-frame-continuity.py`) pour tout découpage futur en morceaux.

### 🎯 DÉCISION PROCESS EN ATTENTE (à trancher en ouverture de la prochaine session)
Aziz hésite entre finaliser la suite (fix trous + tous les retours ci-dessus) **via système agentique** ou
**en direct avec l'instance suivante** (lui + Claude, sans fan-out d'agents). Vu le volume de retours et
qu'il s'agit maintenant surtout d'affinages + 1 bug technique bien cerné (pas une exploration ouverte), une
approche mixte est probable : fix des trous + retouches ciblées en direct (rapide, chirurgical), PUIS
évaluation SVG narratif (points 10/16/19) éventuellement via agent dédié si Aziz valide la direction créative
d'abord sur un mini-prototype. À poser comme première question de la prochaine session, ne pas présumer.

---


> ✅✅ **SESSION 2026-06-27 — ACTE 1 COMPLET FINALISÉ + VALIDÉ AZIZ.** Compo `SahelActe1-Refonte` (f0-2125, 71s).
> Render : `out/episodes/warmap-sahel/acte1-FINAL.mp4` (catbox `6azb9e` — v2 SANS tension-drone, validé Aziz 2026-06-27
> après retrait du SFX drone qui dérangeait ; l'ancien `91solc` avec drone est PÉRIMÉ). Commits 98efe6f + 02a2864 + 5099489 + 6dd6120.
> **HOOK (f0-684)** : chiffre « 3 » slam (`Acte1IntroSlam`) → drapeaux réels plantés (`WarMapBanner`) f145/217/286
>   → détachement vignette → **sceau « AES » central + flash or** au climax « bâtissent » (f557 ; les 3 traits
>   convergents illisibles à ce zoom ont été RETIRÉS) → sceau reste jusqu'au drift (comble le creux). Fix `hideAt=560`.
> **CORPS (f684-2125)** : grammaire P3/P4 déjà en place (contours nationaux, jetons JNIM/EIGS, zones, friction),
>   triggers calés alignment V5 (écart 0f). **SFX câblés** (le corps était MUET) : drone d'assise + PING carto
>   à la pose des jetons (clic, pas whoosh) + ink-spread zones + impact friction. **Drapeaux s'effacent f954-990**
>   (après 1ers jetons → cèdent à la couche tactique ; contours conservés). Mention « Données estimées » RETIRÉE
>   (Acte 1 narratif sans chiffre → trompeuse).
> ⚠️ **ÉCART connu** : `acte1-FINAL.mp4` a été rendu AVANT le retrait de la mention source → il l'affiche encore.
>   Le CODE ne l'a plus. Au re-render de l'assemblage final, la mention sera absente. (Pas re-rendu : décision Aziz.)
> ⚠️ **Mix audio** : pic transitoire ~0 dB à ~18s (gong Liptako + voix + musique). Non audible signalé. Le mastering
>   de l'assemblage normalisera. Si saturation perçue : baisser `liptako-gong` 0.58→0.48 (ligne ~1523 moteur).
>
> ✅ **SVG-INSERT CFA ALTERNATIF PRODUIT + VALIDÉ AZIZ (2026-06-27)** via système agentique SVG (cas test prouvé,
>   bloc isolé). Compo `WarmapCfaInsertSVG` (11s, 16:9) → `out/_r-and-d/cfa-svg/cfa-insert-svg-ALT-FINAL.mp4`
>   (catbox `228hiw`). Cible = verrou + chaîne/maillon de rupture + racines (mix-and-match Claude maison).
>   ⭐ COMPARATIF À FAIRE à l'assemblage : cette version SVG vs le CFA Remotion existant (`p4-cfa-FINAL.mp4`).
>   3 trous méthode comblés (ratio explicite · chorégraphie Phase 1 · mix-and-match maison) → `PRODUCTION-AGENTIQUE-SVG.md`.
>
> 🔜 **PROCHAINE SESSION — PASSE AMÉLIORATION P1 + P2 (plan Aziz 2026-06-27)** :
>   1. Renders P1/P2 existent → upload catbox direct (`p1-FINAL.mp4`, `p2-FINAL.mp4`) pour qu'Aziz revoie les scènes.
>   2. Aziz valide les corrections de `AUDIT-AMELIORATIONS-P1.md` + `AUDIT-AMELIORATIONS-P2.md` (backlog priorisé).
>   3. Lancer agents de CORRECTION (système agentique) qui appliquent les corrections validées.
>   ⭐ Constat dominant audits = AUDIO : P1 n'a AUCUN SFX câblé (`partie1`) · P2 dernier tiers faible (CEDEAO vide,
>   raccord P3). P1 reste en "soustraction" (PAS de SVG/jetons).
>   ⛔ **NE PAS utiliser le `tension-drone`** (décision Aziz 2026-06-27 : il dérange, RETIRÉ du corps Acte 1).
>   Combler les trous de silence via la musique de fond + SFX PONCTUELS (ping carto, ink-spread, impact), JAMAIS un drone.
>
> **▶ RESTE SUR LA VIDÉO** : (0) passe amélioration P1+P2 ci-dessus ; (1) assembler P4 (morceaux : exode + ressources
>   + confed + CFA) en p4-FINAL unique — au CFA, TRANCHER SVG-ALT vs Remotion ; (2) ASSEMBLAGE FINAL
>   (concat Acte1+P1+P2+P3+P4 + musique D + mix/master).
>
> ⛔⭐ **DÉCISION EN ATTENTE — RUPTURE BURKINA/FRANCE (26 juin 2026) À INTÉGRER (Aziz 2026-06-28)** :
>   La vidéo AES NE DOIT PAS ÊTRE FINALISÉE/ASSEMBLÉE avant qu'on décide quoi faire de cet événement historique.
>   FAIT : le 26 juin 2026, le Burkina d'Ibrahim Traoré a ROMPU ses relations diplomatiques avec la France
>   (motif officiel : « activisme néocolonial », accusation de soutien aux terroristes du Sahel). Rupture
>   DIPLOMATIQUE seulement (liens culturels/humains préservés). Aboutissement de l'escalade : départ armée FR 2023
>   → rappel ambassadeur 2023 → rupture totale 2026. Réalignement Russie/Turquie/Iran. Sources : France 24, RTS,
>   Al Jazeera, Washington Post (26-27 juin 2026).
>   PISTE AZIZ : scène BONUS ou avant-dernière scène (« pendant qu'on monte cette vidéo, le 26 juin 2026… »)
>   = preuve en temps réel de la thèse AES « le Sahel se détache de la France ». Surfer l'actu chaude.
>   ⚠️ RISQUE à peser : ça DATE la vidéo (scène figée dans 6 mois). Acceptable pour sujet d'actu géopolitique.
>   ⭐ LIÉ : Aziz envisage de PUBLIER L'AES AVANT LE SÉNÉGAL (momentum actu Burkina vs Sénégal intemporel).
> 📎 Candidats SVG-inserts (détail + comparatif) → `SVG-INSERTS-CANDIDATS.md`.
> 📜 Hook source décodage : `feedback_decode-castile-warmap-vivante.md`.
>
> ⛔⭐ **REPRISE AU RETOUR — LIRE CECI (l'ancien "reste l'assemblage" est PÉRIMÉ) :**
>
> **CHANGEMENT DE MÉTHODE (Aziz 2026-06-15) : PASSE SÉQUENTIELLE scène par scène AVANT tout assemblage.**
> En refondant P4 puis en regardant les autres scènes, on a constaté qu'elles ne sont PAS toutes au niveau.
> On NE PEUT PAS assembler tant que CHAQUE scène n'est pas validée à 100% (sinon re-découpage après = pénible).
> Ordre de révision : **Acte1 (hook + corps) → P1 → P2 → P3** (P4 ✅ déjà refaite et validée). Assemblage EN DERNIER.
>
> **✅ P4 REFAITE + VALIDÉE (2026-06-15)** : 11 corrections (intro anneaux/villes · triple-screen prolongé+animé
>   + bug opacité Mapbox corrigé · caméra figée anti-jitter · portraits réduits · flash retiré · plan final noir
>   plus tôt + 1 ligne typewriter monospace + 2s). Render `hdxsgi`. Fichiers `wip/p4-FULL-v3-*.mp4` (136s).
>   Détail : `PLAN-REFONTE-P4-POLISH.md`. Commits 6a60ad9 + 922753e.
>
> **🔴 ACTE 1 = PROCHAIN GROS CHANTIER** — à refaire à la grammaire P3/P4 :
>   - Supprimer les gros blocs `sahel-fill` (coloriage bleu/jaune/rouge) → contours nationaux qui flashent.
>   - Supprimer la légende factions (haut-gauche) + la timeline graduée (registre dashboard, absent de P2/P3/P4).
>   - Recaler les triggers visuels sur `narration-v5-alignment.json` (actuellement calés narration-v1, ligne 382 moteur
>     → le visuel est désynchro de la voix v5 expressive, c'est ce qu'Aziz ressentait).
>   - Le HOOK (0-30s) dépend de la **SESSION DÉDIÉE HOOKS** (voir ci-dessous). Plan : `PLAN-REFONTE-ACTE1-HOOK.md`.
>
> **🔴 SESSION DÉDIÉE HOOKS (priorité stratégique Aziz)** : `memory/SESSION-DEDIEE-HOOKS.md`. On est "à court de
>   bons hooks". Bibliothèque de hooks RÉUTILISABLES (toutes vidéos), socle = `KineticMaskSlam` + `ComboMaskSweep`
>   ("carte à travers un chiffre"). ⛔ Le prototype hook Sahel "gabarit Bellona" a été SUPPRIMÉ (commit 17fc2c7) :
>   ne pas transposer une recette d'une autre grammaire sur notre carte 2D flat.
>
> **🎵 MUSIQUE** : 6 options générées (`public/_shared/audio/sahel-warmap/music/`). Aziz a choisi **D (Montée maîtrisée)**.
>   Scripts : `scripts/tools/minimax-sahel-music{,-v2}.py`. À poser au concat final (1 morceau continu).
>
> 🧰 TEMPLATES (06-14/15) : `WarMapDimmedOverlay`, `WarMapSplitScreen` (2/3 volets). Doctrine `WARMAP-GRAMMAIRE.md`.

---

# ═══════════ HISTORIQUE (archive — état pré-finalisation, NE PAS coder depuis ici) ═══════════

## 🎬 PASSE "RENDRE VIVANT" P3 (2026-06-14) — densifier les zones mortes SANS casser le validé

> Objectif Aziz : on a été "trop prudent", le format permet plus de vie du début à la fin. On MEUBLE les
> zones mortes de P3 (narrativement validée) sans toucher au récit. Audit + DA-brief (Gemini+Kimi) faits.

**⭐⭐ DÉCOUVERTE STRATÉGIQUE = 3e VOIE D'ANIMATION : le SVG animé par code.** Doctrine créée :
`memory/doctrines/WARMAP-ANIMER-OBJETS.md`. Pour drapeaux/tissus/ondes/tracés/jauges/flux → SVG
animé frame-driven (déformation de paths via Math.sin) = SUPÉRIEUR à PixelLab (net full HD, nos couleurs,
0 coût, 0 risque). À proposer EN PREMIER. Gemini = sprites à trait fin ; PixelLab = effets denses chaotiques ;
DIFFUS (poussière sol) = personne (leçon ratée poussière, confirmée 2x).

**DA-brief P3 archivé :** `memory/episodes/warmap-sahel/da-briefs/P3-vivacite-{gemini,kimi,BRIEF}.{md,txt}`.
Synthèse : NE PAS animer les jetons en image-à-image (piège, "jeu vidéo cheap") ; diversifier l'impact
(cercle d'encre = chocs politiques seulement ; matière dense = chocs militaires) ; ne PAS toucher Ph4/Ph7.
Vérif code : Gemini a halluciné 2 critiques AI-slop déjà résolues (drapeau Ph7 déjà 0.82+multiply ; grain
papier déjà appliqué). Gemini = signal jamais juge → confirmé.

**ÉTAT DES CHANTIERS P3 :**
- ✅ **Ph5 STATU QUO — VALIDÉ Aziz** : drapeau touareg (Azawad vert-rouge-noir désaturé) qui ONDULE sur
  Kidal (SVG animé, ambiant, sort à l'approche FAMa) + ondes "observation passive" ONU (cercles bleus fins
  qui s'éteignent avant Kidal = inaction) + jetons touaregs réduits ~12% (JETON_DEG ×0.88). Code dans
  `Partie3Rupture.tsx`. Recette drapeau ondulant réutilisable (bloc "DRAPEAU TOUAREG ondulant").
- ⏳ **Ph2 convergence frontières** (frontières 3 pays se tracent depuis capitales → sceau central) — SVG, 0 risque.
- ⏳ **Ph9 matière d'impact** (étincelle SVG + fx-explosion désat. + micro coup-de-reins jeton qui charge).
- ⏳ **Ph6 traînée fumée** (fx-smoke courte derrière FAMa — à valider visuellement, risque surcharge).
- ❌ **ÉCARTÉ** : poussière diffuse / dust devil (doctrine : ni SVG ni PixelLab ne rendent le diffus top-down).
- PROCHAINE ACTION : Aziz choisit le prochain chantier (Ph2 recommandé). Méthode = mini-render comparatif full HD.

---

## 🔄 SYNCHRO DEUX SESSIONS P3 (2026-06-12 après-midi) — LIRE SI TU CODES P3

> **Deux sessions ont tourné en parallèle sur P3 sur la MÊME branche `feat/da-brief-gate-warmap-sahel` :**
> - Session A (coding) : a commencé `Partie3Rupture.tsx` + branché `partie3` dans `SahelWarMapEngine.tsx` + `Root.tsx`.
> - Session B (plan + DA-brief) : a finalisé `PLAN-NARRATIF-P3.md` + tranché 2 décisions de goût + 4 angles morts. **COMMITÉ (3073214).**
>
> **➡️ LA SESSION DE CODING DOIT `git pull` PUIS CONFRONTER son code au plan à jour.** Le plan PRIME sur le code.
> Points à vérifier dans le code déjà écrit (détail complet dans `PLAN-NARRATIF-P3.md` sections Ph6/Ph7/Ph8/Ph9 + "DÉCISIONS DA-BRIEF P3") :
> 1. **Drapeau Kidal (Ph7)** : fill clippé `useClipFlags` + MICRO-ONDULATION du clip-path SVG (PAS de sprite généré). Drapeau ondule seul pendant le figé 2s.
> 2. **Moura (Ph8)** : abstraction pure, point rouge `#6B1A1A` + halo bordeaux STATIQUE 20%, AUCUN visage.
> 3. **Anachronisme Moura** : carte "état altéré" (fondu sépia + Kidal-bleu opacité 20% + timeline anthracite recule 2022).
> 4. **Raccord ONU→FAMa (Ph6)** : chevauchement (1er waypoint FAMa quand dernier point ONU à ~50% opacité).
> 5. **Anti AI-slop chromatique** : bleu Mali DÉSATURÉ `#2B4F7C` fill 40-60% (jamais 100%), or AES mat, rouge `#6B1A1A`.
> 6. **Easing Ph9** : sprites jihadistes (technical-jnim/fighter-jnim/fighter-eigs) avance vite → arrêt net → recul lent effiloché. PAS de halos rouges qui poppent (ancien plan abandonné).
> Aucun nouvel asset à générer (tout sur disque). Réutilisation jetons/bases/contours/sillage = justifiée (confirmée par les 3 voix).

---

## ⛔ REPRISE PROCHAINE SESSION (2026-06-12) — P2 NARRATIVE VALIDÉE, place à P3 (session parallèle)

> 🟢 **POUR DÉMARRER LA P3 : lire `PLAN-NARRATIF-P3.md` + `WARMAP-GRAMMAIRE.md`.** Partir de `Partie2Blocage.tsx` (PAS Proto24) ; triggers P3 vérifiés dans `narration-v5-alignment.json` ; ordre strict : REPRÉVOIR LE VISUEL → DA-brief → code. (BRIEF-PASSATION-P3.md supprimé — info consolidée ici.)

**ÉTAT : Acte1 ✅ + P1 ✅ + P2 NARRATIVE ✅ VALIDÉE Aziz ("très bon point d'équilibre").**
Reste sur la vidéo : **P3 "La Rupture" + P4 "Coût/Perspective" + assemblage final.** ~la moitié est derrière.
Render P2 final : `out/episodes/warmap-sahel/p2-FINAL.mp4` (audio embarqué, catbox gfsa3h).

> ⭐⭐ **LIRE EN PREMIER AVANT DE CODER P3 : `memory/doctrines/WARMAP-GRAMMAIRE.md`** — LA doctrine
> qui évite le "bordel confus du départ" (Aziz). Règle CAUSE avant EFFET + catalogue des 5 techniques causales
> validées (avancée jetons+sillage · chute base 3 temps · donnée qui se MONTRE par remplissage du pays ·
> contour flash · casser la grammaire pour acteur différent). C'est le standard non-négociable.

### ⭐⭐ LA MÉTHODE QUI A MARCHÉ (à appliquer SYSTÉMATIQUEMENT P3/P4) — leçon majeure de la session
La P2 a été refaite 4 fois avant de marcher. Ce qui a débloqué = **partir de l'AUDIO, raconter une action
CAUSALE, combiner l'arsenal complet**. Séquence obligatoire avant de coder une Partie :
1. **ÉCOUTER l'audio phrase par phrase** → pour chaque phrase : "que doit COMPRENDRE un œil neuf ?"
   (PLAN-NARRATIF-P2.md = le modèle). Le timing technique (triggers) ne suffit pas — il faut le SENS.
2. **CAUSE avant EFFET** : ne jamais faire apparaître un RÉSULTAT (zone rouge, base qui tombe) sans montrer
   sa CAUSE (les jetons qui avancent/encerclent). "État qui pop" = incompréhensible = rejeté.
3. **COMBINER l'arsenal** (jamais 1 seul asset) : jetons (acteurs) + zones (conséquence) + sprites Gemini
   (lieux) + PixelLab (effets) + frise/timeline (temps) + contours flash + plaques. C'est l'ensemble qui crée le sens.
4. **DA-brief upstream** sur le plan narratif AVANT de coder (Gemini+Kimi, signal jamais juge).

### Briques P2 RÉUTILISABLES P3/P4 (toutes dans `parties/`)
- `warmapPremiumKit.ts` : buildStaticZone, smoothClosedPath, smokePingPong, **interpWaypoints** (jetons qui
  avancent), **countryOutline** (contour territoire qui se dessine + flash), spriteMapWidth (ancrage carte), PAL.
- `WarMapPlaque.tsx` : plaque de nom parchemin élégante (adaptation GeoCountryPlaque), pos projetée.
- `sahelCountries.ts` : vrais contours Mali/Niger/Burkina (décimés).
- **chip()** (dans Partie2Blocage) : jeton circulaire (cercle parchemin + bordure faction + portrait clippé).
- **Sillage causal** : mask de cercles flouté aux positions PASSÉES des jetons → territoire rouge révélé.
- **Chute base 3 temps** : alerte (pulse) → chute → fumée. **Junte = jeton institutionnel** (jeton-junte).
- **Timeline graduée** : réactivée pour partie2 dans le moteur (pleine largeur, curseur date dès le début).
- **SFX banque warmap/** : ink-spread (sillage), impact (chute), boom-coup (coup d'État), arrow-whoosh, drone.

### 3 RÈGLES STRUCTURELLES gravées (doctrine WARMAP-ANIMER-OBJETS.md)
R-OBJ-1 taille ANCRÉE CARTE (jamais vmin) · R-OBJ-2 objet = IMAGE Gemini jamais dot · R-OBJ-3 zones TRANSITOIRES.
+ technique systématique : **contour du territoire nommé qui se dessine + flash** (couleur porteuse de sens).

### Décisions de goût Aziz verrouillées (P2)
Jetons circulaires (pas portraits nus) · bases tombent en fumée APRÈS attaque visible · villes = points NOMMÉS
(pas sprite-bâtiment) · 40% Burkina se MONTRE (remplissage contour, pas overlay chiffré) · plaques SANS stat
superflu · SFX seulement si support visuel (cedeao-snap retiré faute de visuel CEDEAO) · silencieux sur poses/avancées.

---

## (archive — historique P2, NE PAS coder depuis ici) — voir REPRISE en tête

> ⚠️ ANTI-CONFUSION (trou détecté test agent vierge 2026-06-12) : cette zone décrit des ÉTATS PÉRIMÉS
> de la P2 (1ère passe SVG rejetée, proto 2.4, "généraliser depuis Proto24"). **TOUT CELA EST DÉPASSÉ.**
> La VÉRITÉ ACTUELLE = section REPRISE en tête : **`Partie2Blocage.tsx` EST la P2 narrative VALIDÉE**.
> `Proto24Extinction.tsx` = compo de test historique (proto du beat 2.4), NE PAS la prendre comme modèle —
> le modèle est `Partie2Blocage.tsx`. Le mode moteur `proto24` est LEGACY (à ignorer pour P3/P4).
> Historique condensé : P2 refondue 4× → SVG plat (rejeté 4/10) → premium "états" (confus) → grammaire causale (validé).

---


## ⭐ PARTIE 1 VALIDÉE + PATTERN `<PartieX>` (2026-06-11) — LIRE AVANT DE CODER P2-P4

**Partie 1 (canari) VALIDÉE par Aziz.** Render final : `out/episodes/warmap-sahel/wip/partie1-fullhd-v3.mp4`
(catbox `m12kke`). Direction soustraction + propagation Kidal→Gao/Tombouctou + pulse villes + hachures rouges.

### 🔑 LE PATTERN POUR CODER UNE PARTIE (réutiliser tel quel pour P2, P3, P4)
La War-Map a un ÉTAT CONTINU → on ne concatène PAS des fichiers. Architecture = **moteur conteneur +
1 fichier React par Partie, en COUCHE isolée**. Pour ajouter une Partie :
1. **Créer** `src/projects/warmap/parties/PartieN<Nom>.tsx` — composant pur `({ ctx }: { ctx: SahelRenderContext | null })`.
   Reçoit `ctx.frame`, `ctx.project(lon,lat)→{x,y}` (closure map courante), `ctx.width/height`, `ctx.controlAt`, `ctx.breathe`.
   Dessine SA couche SVG par-dessus la carte. Ne possède PAS la map. Modèle complet : `Partie1Origine.tsx`.
2. **Moteur** `SahelWarMapEngine.tsx` : ajouter prop `partieN?: boolean` → l'inclure dans `isFinalLook`
   (hérite du look Acte 1) → ajouter `getPartieNCam` (raccord exact depuis fin Partie précédente, JAMAIS de coupe)
   dans la sélection caméra (`camFn = partieN ? getPartieNCam : ...`) → injecter `{partieN && <PartieN ctx={sahelCtx} />}`
   avant le bloc grain/vignette → gater les blocs legacy sur `!partieN` si besoin.
3. **Root.tsx** : enregistrer compo `SahelPartieN` avec `defaultProps={{ partieN: true }}`.
4. **Hooks moteur pour effets carte** (fill-opacity, board clearing) : multiplier l'expression existante par un
   facteur gaté `partieN` dans la boucle frame (ex: vide d'État P1 = `setPaintProperty("sahel-fill","fill-opacity", ["*", baseOp, voidFactor])`).
5. **Triggers** : TOUJOURS recalés sur `narration-v5-alignment.json` (mot × 30 fps = frame). Lire le JSON (`D["words"]`).

### Briques réutilisables P2-P4 (dans `Partie1Origine.tsx`)
- `buildSmoothPath(pts)` → {d, len} : path SVG lisse + longueur (traits stroke-dashoffset).
- Trait d'encre route réelle (brun = source externe) vs trait rouge (propagation/violence interne).
- Pulse ville = onde radar à la chute + teinte rouge persistante. Pulse région = onde concentrique.
- Labels géo-ancrés avec halo réserve parchemin (`paintOrder=stroke`, PAS de boîte blanche).
- Hachures tension = pattern rouge-sombre + teinte diffuse sous-jacente (l'encre seule ne se lit pas).

### Règles de goût VERROUILLÉES (Aziz 2026-06-11)
- **War-Map = 100% carte, ZÉRO plein écran** (voir `WARMAP-LONG-DOCTRINE.md`). Moments forts = PAR la carte
  (caméra, pulses, vide d'opacité, assombrissement). Plein écran = Souverain Mid-form uniquement.
- 3 registres d'enrichissement autorisés sans quitter la carte : portraits/visages projetés · objets Gemini
  encre top-down (P3-P4) · données animées dans overlay ancré (jamais plein écran).
- Board clearing P1 = 0.05 (table rase, retour 2012). Trait route réelle (pas ligne droite/flèche TikTok).

### DETTE différée (NE PAS faire maintenant — quand P2-P4 couvriront l'Acte 2)
- Legacy `acte2` (avion/convoi/bases) GARDÉ comme filet + référence visuelle pour coder P2-P4. À supprimer plus tard.
- Cartouches blancs sous labels de ville (BAMAKO/NIAMEY) = anti-parchemin hérité Acte 1 → corriger avec le recalage Acte 1.
- Recaler triggers Acte 1 sur audio V5 + retirer sa timeline graduée (déjà masquée en mode partie1).
- Bug corrigé : `<Audio narration-v2.mp3>` (supprimé) → repointé `narration-v5-expressive.mp3` (synchro Acte1 à recaler).

---

## ✅ ÉTAT ACTUEL (2026-06-10)

### Script — V5 LINÉAIRE LOCKED
`SCRIPT-V5-LINEAIRE-2026-06-10.md` = le script validé Aziz. Chronologie LINÉAIRE 2012→2026 (règle le bug
"timeline qui recule"), ton Tremblay, 4 parties + ouverture. Fact-check Sonar Pro appliqué
(`FACTCHECK-SONAR-V5-2026-06-10.md`). DA upstream 3 voix (`reviews-script-v5/`). Leçons Infographics Show
(`DECODE-INFOGRAPHICS-SHOW.md`). **NE PAS re-litiger le texte** (Aziz a tranché).

> Le plan "B1 sprites vivants" original est ABANDONNÉ : le problème B1 était STRUCTUREL (surcharge narrative
> de tout le script, pas juste B1). Tout a été refondu en V5 linéaire. Brouillons B1 supprimés au ménage 06-10.

### Voix — PIPELINE VIVANT VALIDÉ + AUDIO GÉNÉRÉ
- Pipeline : texte taggé V3 → Océane V3 (`CqTrL0ThT2GJVJEIiLcY`) → STS GéoAfrique (`z3gESu49naEZW8Af2Upm`,
  `eleven_multilingual_sts_v2`, **stability 0.45**). Doctrine : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`.
- Script industrialisé : `scripts/generate-narration-expressive.py` (`--dry-run`, `--sample`, `--only-part`,
  `--sts-stability`). GÉNÉRATION PAR PARTIES (règle Aziz : jamais en bloc → réparation chirurgicale).
- Texte taggé : `SCRIPT-V5-TAGGED.txt` (5 parties marquées `### PARTIE`, tags sobres, 4 ellipses ciblées).
- **Audio FINAL généré + validé Aziz** : `public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3`
  (7min26, GéoAfrique vivante). Micro-coupures non bloquantes (disparaissent sous SFX/musique).
- **Forced alignment** : `narration-v5-alignment.json` (loss 0.167, 1096 mots). Script : `sahel-align-and-split-v5.py`.
- **Découpé en 5 parties** (frontières narratives, timestamps alignment) :
  - `narration-v5-p0.mp3` (62,8s) — ouverture : hook + les 2 groupes (≈ recouvre l'Acte 1)
  - `narration-v5-p1.mp3` (35,2s) — origine 2012 / Libye / vide d'État
  - `narration-v5-p2.mp3` (104,1s) — blocage : Serval/Barkhane → échec 10 ans → Niger → CEDEAO
  - `narration-v5-p3.mp3` (111,8s) — rupture : AES naît → Kidal → reprise → Moura → 2026
  - `narration-v5-p4.mp3` (132,1s) — coût/levier/perspective : réfugiés → ressources → confédération → chute

### Coût voix (vérifié API)
TTS V3 = 1 crédit/char · STS = 1000 crédits/min. 1 narration ~8 700 crédits. Plan **Creator** ($22, 100k/mois).

---

## ▶ ÉTAT REFACTOR (2026-06-11) — Tasks 0-6 FAITES, Task 7 en cours

**Le refactor moteur-fin + Partie 1 (4 beats) est CODÉ.** Branche `feat/da-brief-gate-warmap-sahel`.
- **Task 0-2** : baseline non-régression Acte 1 (`out/episodes/warmap-sahel/_refactor-baseline/`) +
  `SahelContext.ts` (type + closure `project`) + coquille `<Partie1Origine>` + mode `partie1` + compo `SahelPartie1`.
- **Task 3-6 (4 beats Partie 1)** dans `src/projects/warmap/parties/Partie1Origine.tsx` + hooks moteur :
  - 1.0 board clearing jetons→0.05 (décision Aziz) + cartouche encre "2012" + repère "LIBYE" + `getPartie1Cam`
    (raccord exact fin Acte 1 f2102 → PULL BACK corridor Libye→Mali → push-in Mali central).
  - 1.1 pulse Libye (onde-radar encre + foyer chaud) au mot "s'effondre" (f2210).
  - 1.2 trait d'encre route réelle Sebha→Ghat→Salvador→Kidal (stroke-dashoffset) + 3 taches impact #8B3A3A.
  - 1.3 vide d'État (fill `sahel-fill` →0.16 au mot "absent" f2743) + veine persistante + hachures (f2844).
  - Timeline Acte 1 masquée en `partie1` (gate `!partie1`).
- **Triggers V5 Partie 1** (alignment) : bascule f2102 · Libye f2178 · s'effondre f2210 · flot f2305 · absent f2743 · tensions f2844.
- **Task 7** : render full HD `SahelPartie1` f2055-2940 muet → présentation Aziz (jugement goût).
- **Task 8** (après validation) : supprimer legacy `acte2` + recaler triggers Acte 1 sur audio V5 + documenter pattern.

### ⚠️ BUG LATENT CORRIGÉ : `<Audio narration-v2.mp3>` (supprimé au ménage) → l'Acte 1 ne rendait plus.
Repointé vers `narration-v5-expressive.mp3` (ligne ~1722). Mais Acte 1 encore calé triggers V1/V2 → synchro V5 à recaler (Task 8).

### Astuce render : `--frames=AAAA-BBBB` rend une plage en secondes (check non-régression instantané vs re-render 2300f).

---

## ▶ PROCHAINE ÉTAPE (session SAHEL — CODE) — ⭐ PLAN PRÊT
**Le découpage beats + le plan visuel Partie 1 sont FAITS et VALIDÉS. Reste = exécuter le refactor + coder.**

1. **Découpage beats** : ~~`BEATS-V5.md`~~ (supprimé — frames décalées, remplacé par PLAN-NARRATIF-Px.md par partie). Utiliser `PLAN-NARRATIF-P3.md` + `PLAN-NARRATIF-P4.md` comme référence.
2. **Plan visuel Partie 1 (canari)** validé DA 3 voix + Aziz : direction SOUSTRACTION (flux d'encre Libye→Mali +
   taches d'impact + vide d'État par chute d'opacité + hachures tensions). PAS d'overlay, PAS d'objets (P1 abstraite).
   Détail : `BEATS-V5.md` section CANARI + `reviews-p1/da-sahel-p1-upstream-{gemini,kimi,deepseek}.md`. FAIT.
3. **⭐ PLAN DE REFACTOR : `docs/plans/2026-06-10-warmap-sahel-refactor-parties.md`** (Tasks 0-8).
   Décision Aziz : refactorer le moteur monolithique (3261 lignes) → moteur-fin + 1 fichier par Partie
   (résout le problème "tout casser à chaque édition"). Acte 1 INTACT. Démarrer par Task 0 (baseline non-régression).

### ⚠️ DÉCOUVERTE CRITIQUE (vérifiée) : triggers moteur DÉCALÉS vs audio V5 final
Le code V5 déjà câblé dans le moteur est calé sur un audio ANTÉRIEUR. Écarts mesurés vs `narration-v5-alignment.json` :
Kidal f7279→**f7084** (-195) · flotte f8683→**f8132** (-551) · Djibo f10294→**f9790** (-504) · uranium →**f10804**.
TOUT trigger récit doit être recalé sur l'alignment V5. (Source de vérité unique = `narration-v5-alignment.json`.)

> NB : le mode `acte2`/B1 actuel = LEGACY (avion/convoi, ancien plan abandonné). Sera supprimé en Task 8 après
> validation Partie 1. Du code V5 (F_KIDAL_*/F_REF_*/F_ICON_*) est déjà câblé dans le monolithe → le refactor le RÉORGANISE.

---

## ✅ ACTE 1 VALIDÉ COMME RÉFÉRENCE/BLUEPRINT
Aziz a validé l'Acte 1 (`SahelActe1-Final`) comme référence de style de la série.
**RENDER : `out/episodes/warmap-sahel/acte1-FINAL.mp4`** (1920×1080, 2300f, 77s, catbox `slchjv`).
Contient : allumage séquentiel Mali→Burkina→Niger, CEDEAO qui se rompt, flèches Liptako, jetons-combattants
(2 archétypes JNIM chèche clair / EIGS cagoule sombre), taches d'influence, friction. Timeline graduée
bas-écran (à RETIRER en V5 : le récit V5 redémarre la timeline à 2012 en Partie 1).

### Briques blueprint réutilisables (Parties 2-4)
Dispersion jetons en losange, pulse région-précise au nommage (`A1_REGION_PULSES`), grain papier
(`paper-grain.png`), vignette cinéma, respiration finale, ombres jetons. Triggers Acte 1 : Mali f150 ·
Burkina f231 · Niger f301 · CEDEAO f382 · Liptako f502 · JNIM f1198 · EIGS f1749 · friction f2167 · fin f2299.

---

## ASSETS (réutilisables)
**Jetons-combattants** : `fighter-jnim.png` (chèche clair) + `fighter-eigs.png` (cagoule sombre).
**France** : `fighter-france.png` (jeton soldats FR) + `fr-epervier/licorne/sabre.png` + `base-france.png`.
**Acte 2 (beats à venir)** : `jeton-fama.png`, `jeton-csp.png`, `base-africacorps.png`, `convoi-uranium.png`,
5 `refugie-*.png` (Djibo/Ménaka/Tillabéri Partie 4). Overlay : `GeoConvergenceOverlay.tsx` (présence FR).
**GeoJSON** : `public/_shared/geo-data/sahel/sahel-admin1.geojson` (32 régions) + `sahel-countries.geojson`.
**Faits** : `FACTS-PREPOSITIONNEMENT-2013.md` (bases FR pré-positionnées, ressert Partie 2).

---

## DOCTRINES LIÉES
- `memory/doctrines/WARMAP-LONG-DOCTRINE.md` — format long (carte permanente, overlays 3 niveaux, 5 actes).
- `memory/doctrines/WARMAP-GRAMMAIRE.md` — dynamisme (R-V1..R-V4, board clearing, Ken Burns, 1 transfo/plan).
- `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` + doctrine Tremblay — niveau oral du script.

## ⏳ CHANTIER TRANSVERSAL EN ATTENTE — "Fond de contrôle qui respire" (session dédiée, Aziz 2026-06-13)
Constat (Aziz P3) : depuis l'Acte 2, la carte colorée de contrôle territorial (sahel-fill rouge/contesté/bleu)
est forcée à ~12% ("carte calme" pour que les beats ressortent) → on a PERDU la lecture de fond "qui tient quoi".
La légende de contrôle (haut-gauche) est aussi masquée en P2/P3.
DÉCISION : réintroduire un FOND QUI RESPIRE — calme (~15%) pendant l'action (jetons/combat/sillage), remonte
(~35%) sur les temps de lecture (transitions, plans larges, morale). + légende code-couleur BRÈVE aux moments
clés (pas permanente). Cohérent avec l'inversion chromatique (rouge=jihadiste, bleu=État).
PORTÉE : transversal — à appliquer à Acte1/P1/P2/P3 ENSEMBLE (sinon incohérence), donc SESSION DÉDIÉE, en une
passe : (1) mécanique controlBaseOpacity pilotée par phase dans SahelWarMapEngine, (2) composant légende brève,
(3) brancher chaque partie, (4) re-render court de chaque partie + jugement d'ensemble. NE PAS faire au coup par coup.

## ✅ P3 "LA RUPTURE" — v8 FINALE proposée (2026-06-13) — EN ATTENTE VALIDATION AZIZ
Render final : `out/episodes/warmap-sahel/wip/p3-FULL_v8.mp4` (catbox 93yw8p, scale 0.5, audio embarqué).
Compo `SahelPartie3` (f6118→9410, durationInFrames 9410). Code : `parties/Partie3Rupture.tsx`.
8 itérations + 2 reviews DA (upstream + premium Gemini/Kimi) + passe premium.
CONTENU : overlay AES dynamique (brique WarMapOverlayDynamic réutilisable) · ville-forteresse Kidal (Gemini) ·
jetons en tenaille + pictogrammes faction (chevrons=mil/losange=merc/étoile=armed) · jeton mercenaire Africa
Corps (Gemini, distinct des FAMa) · MINUSMA campements top-down + badge no-fire (fade au retrait) · drapeau
Kidal = losange 3 bandes Mali tracé · Moura sépia+tache de sang+SFX grave · attaques 2026 combat jetons
physiques (jihadiste charge→FAMa bloque→repoussé) · drift caméra continu · flash or climax · tracé frontières
zone Kidal (sable→bleu) · fin serrée f9410 (pas de débordement P4).
ÉCARTÉ : pitch 3D (cosmétique sans relief) · PixelLab (jure avec jetons réalistes) · plein écran (réservé P4).
NEXT : (1) si Aziz valide → render FULL HD ; (2) SESSION DÉDIÉE 'fond de contrôle qui respire' (transversal
Acte1→P3) ; (3) P4 (coût/réfugiés/franc CFA — plein écran OK pour les concepts).
Assets générés : public/_shared/sprites/warmap/{ville-kidal,jeton-africacorps}.png · flags/{ml,bf,ne}.png.
Briques nouvelles : _shared/WarMapOverlayDynamic.tsx (overlay dynamique réutilisable, 6 blocs composables).
Doctrines : WARMAP-LONG-DOCTRINE (règle overlay vs plein écran). [REVIEW-PREMIUM-TEMPLATE archivé 2026-06-19 — info Gemini-vidéo contredite par CLAUDE.md ; review = `scripts/visual_review.py` + DA-BRIEF-GATE.]

## 🔄 P4 "LE COÛT, LE LEVIER, LA PERSPECTIVE" — EN COURS (2026-06-14) — DERNIÈRE PARTIE

**État : codée + branchée + render full v2 en cours (corrections appliquées).** Fichier : `parties/Partie4Cout.tsx`.
Compo `SahelPartie4` (f9416→13439, durationInFrames 13440). Mode moteur `partie4` branché (miroir partie3).

**PIPELINE SUIVI (ordre strict brief) :**
- ✅ `PLAN-NARRATIF-P4.md` (11 phrases, triggers VÉRIFIÉS vs alignment — BEATS-V5 était décalé +373f sur confédération).
- ✅ **DA-brief en 2 passes** : v1 validé mais INCOMPLET → Aziz signale 3 manques (causalité phrase-par-phrase jamais
  demandée · chaînes de réf absentes · catalogue templates non envoyé). v2 ENRICHI (`--catalog` + question causale +
  comparaison genre Operations Room/K&G/BazBattles). Output : `/tmp/da-refs/da-warmap-sahel-p4-causal-{gemini,kimi}.md`.
  → LEÇON : le DA-brief DOIT inclure la causalité phrase-par-phrase + les chaînes de réf + le catalogue templates.
- ✅ 4 assets Gemini (`public/_shared/sprites/warmap/p4-assets/`) : icon-or/uranium/petrole/sceau-confederation.
- ✅ CODE + branchement moteur + Root.

**ARC 3 MOUVEMENTS** : Coût (réfugiés Ph2 + chiffre ancré Ph3) → Levier (or/uranium/pétrole, accumulation) →
Perspective (confédération fusion Ph7 + CFA plein écran Ph8 + dézoom continental Ph9-10 + extinction au noir Ph11).

**CAUSALITÉ (du DA-brief v2, gravée) :** Ph2 ville pulse rouge→visage s'extrait→traînée · Ph3 overlay ANCRÉ sur
cluster réfugiés (pas diapo) · Ph5-6 contour pulse→remplissage→icône émerge (pas pop) · Ph7 fils convergent→fusion
or→sceau tampon (pas morph PowerPoint) · RÈGLE CHROMATIQUE rouge≠or simultané (anti-cynisme).

**CORRECTIONS POST-RENDER (3 itérations) :** légende masquée (`!partie4`) · icônes or visibles (retrait mixBlend
multiply qui les noyait + taille bornée) · fond ÉPURÉ (sahel-fill neutralisé parchemin uniforme + front-glow off,
décision Aziz : la conclusion ne parle plus de qui-tient-quoi) · ⭐ CTA/outro/intro globaux gatés `!isPartie`
(parasitaient l'extinction P4 avec "@koraetcartes") · fusion or Ph7 renforcée (0.40 + contour or net).

**NEXT** : juger render full v2 → présenter Aziz (audio embarqué) → itérations → FULL HD → **ASSEMBLAGE FINAL**
(concat Acte1+P1+P2+P3+P4 + narration globale + mix = TOUTE DERNIÈRE étape de la vidéo).

## ✅✅ P3 VALIDÉE DÉFINITIVEMENT par Aziz (2026-06-13)
Full HD `out/episodes/warmap-sahel/p3-FINAL.mp4` (1920x1080, 1min50, audio, catbox ck26kl) — VALIDÉ.
wip P3 purgés (v1-v8, core, pitch-test, ph1 variants = ~325 MB). raw assets purgés (emblem gardé).
RESTE sur la vidéo : P4 + assemblage final (Acte1+P1+P2+P3+P4). + chantier transversal "fond qui respire".

## ✅ CONTOURS NATIONAUX COLORÉS — RÉSOLUTION du chantier "fond qui respire" (2026-06-14)

Le chantier "fond qui respire" a abouti à une solution DIFFÉRENTE de l'idée initiale (opacité du fill),
après exploration guidée par Aziz. Parcours : mosaïque par région (ÉCARTÉ, noyait l'action) → bordures
de contrôle par faction (ÉCARTÉ, bouillie) → **CONTOURS NATIONAUX colorés, 1 ton/pays (RETENU)**.

**SOLUTION VALIDÉE (Aziz 2026-06-14)** :
- **Contour national coloré, 1 ton par pays** : Mali `#D98A3D` (ocre), Burkina `#C0553C` (brique),
  Niger `#4E8C7D` (sarcelle). Constante `SAHEL_COUNTRY_COLORS` dans `SahelControlData.ts`.
- **Carte épurée conservée** (pas de mosaïque pleine, pas de quadrillage interne).
- **Présence permanente + respiration douce** (atténués pendant l'action des jetons, jamais disparus).
- **Effets** : draw-in (le contour se dessine) + pulse (s'allume) aux moments clés / mentions du pays
  (table `COUNTRY_PULSES`, frames extraites de narration-v5-alignment.json).
- **EFFACEMENT sous overlay** (`CONTOUR_HIDE_WINDOWS`) : les contours fade-out quand un overlay/panneau
  couvre la carte (P3 : overlay AES f6118-6800 + flashback Moura f8560-8920). Sinon = bouillie illisible
  sous l'overlay semi-transparent. RÈGLE : contours et overlay ne cohabitent JAMAIS.

**PÉRIMÈTRE (décision Aziz)** : contours UNIQUEMENT sur parties ÉPURÉES (P3, P4 à venir). Acte 1, Acte 2,
P1 gardent leur look validé (fond mosaïque/allumage séquentiel qui porte déjà la couleur) — on ne les
touche PAS. Gate moteur : `partie3 || countryBordersTest` (ajouter `partie4` au moment de coder P4).

**CODE** : tout dans `engine/SahelWarMapEngine.tsx` (countryBorderPaths reprojetés/frame depuis
`sahel-countries`, rendu SVG au-dessus du grain). Démo de référence : compo `SahelCountryBordersTest`
(catbox 4m4bpv). Plan : `docs/plans/2026-06-13-contours-nationaux-colores.md`.
NETTOYAGE FAIT : modes exploratoires region/borders (`controlMode`) entièrement retirés (code mort).

**RESTE** : render P3 full HD avec contours → remplacer p3-FINAL.mp4 après validation netteté Aziz.
P4 reprendra le même mécanisme (`partie4` à ajouter au gate).

## 🔬 DIAGNOSTIC "FOND QUI RESPIRE" (2026-06-13) — le vrai chantier identifié [ARCHIVÉ — résolu ci-dessus]
Tenté en fin de session : faire respirer l'opacité du fill de contrôle (sahel-fill) en P3 (calme action / haut
lecture) + légende code-couleur. RÉSULTAT : l'opacité respire MAIS le fond reste beige/bleu quasi-uniforme.
CAUSE RACINE (ligne ~1101 moteur) : toutes les régions sont initialisées à `ctrl=1` (état/bleu) par défaut ;
la coloration rouge/contesté vient des JALONS (sahelJalon/ctrlByName) qui NE SONT PAS pilotés en mode partie3
(ni partie1/partie2). Donc un simple curseur d'opacité ne montre rien — il n'y a pas de donnée de contrôle à révéler.
→ LE VRAI CHANTIER (session dédiée) : définir les DONNÉES de contrôle territorial par phase (qui tient quoi :
nord rouge jihadiste, Kidal rouge→bleu à la reprise, etc.) cohérentes sur Acte1→P3, PUIS faire respirer l'opacité.
C'est un travail DATA (control map temporelle), pas un réglage visuel. Expérimentation revertée (P3 = p3-FINAL intact).
Code de réf pour la session : `engine/SahelControlData.ts` (snapFaction/ctrlByName) + blocs calmFactor par mode.
