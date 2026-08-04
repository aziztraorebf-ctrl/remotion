# Gazoduc Acte 2 (AAGP) — Breakdown technique frame-précis

> Transcrit `PLAN-ACTES2-5.md` (synthèse DA-brief tranchée par Aziz) en plan de code pour l'Acte 2
> précisément. Timing extrait de l'alignement forcé RÉEL (`narration-NEW.alignment.json`, mot-par-mot,
> pas estimé). Format adapté du § FORMAT DU BREAKDOWN REMOTION, cohérent avec `BREAKDOWN-ACTE1.md`.

## ⛔ CORRECTION CRITIQUE — 30fps, pas 25fps (vérifié dans le code réel, pas supposé)

Le 1er jet de ce breakdown avait calculé les frames en 25fps par erreur. Vérifié dans
`GazoducActe1Hook.tsx` : `GAZODUC_A1_FRAMES = 2540 // 84.68s @30fps` et `Root.tsx` (composition
`D3-Gazoduc-Acte1-Hook`, `fps={30}`). **Le projet entier tourne à 30fps.** Toutes les frames
ci-dessous sont recalculées à 30fps.

## Fenêtre audio de l'Acte 2 (vérifiée par extraction, pas supposée)

- **Fichier source complet** : `out/episodes/gazoduc-aagp-tsgp/narration.mp3` (8min37, 516.73s total).
- **Fichier isolé disponible** : `out/episodes/gazoduc-aagp-tsgp/narration-p2.mp3` (139.00s).
- **Fenêtre dans le fichier complet** : 84.78s → 223.62s (début "Si vous lisez la presse..." jusqu'à
  la fin de "...VIRTUELS." avant que la Partie 3/Acte 3 démarre sur "Ce que peu de médias racontent").
- **Durée exacte de l'Acte 2** : 138.84s = **4165 frames à 30fps** (composition Remotion démarre à
  frame 0 = 84.78s du fichier global si on réutilise `narration.mp3` complet ; si on monte
  `narration-p2.mp3` isolé, frame 0 = 0s de ce fichier, décalage de -84.78s vs les frames listées ici).
- ⚠️ **Choix à faire au code** : utiliser le fichier complet `narration.mp3` avec offset (cohérent avec
  la méthode Acte 1, qui semble avoir utilisé le fichier complet vu son alignement forcé unique) OU le
  fichier `narration-p2.mp3` isolé (plus simple, décalage à soustraire). Les frames ci-dessous sont
  données en **frame GLOBALE** (fichier complet, 30fps) — soustraire 2543 (=84.78×30) pour obtenir la
  frame RELATIVE à l'Acte 2 si `narration-p2.mp3` isolé est utilisé.

## Table des marqueurs (frame globale = narration.mp3 complet, 30fps)

| Marqueur | Timestamp | Frame globale (30fps) | Frame relative Acte 2 |
|---|---|---|---|
| Début Acte 2 ("Si vous lisez...") | 84.78s | 2543 | 0 |
| "à Freetown, Sierra Leone" | 94.18s | 2825 | 282 |
| "quinze chefs d'État" | 96.50s | 2895 | 352 |
| "SIX MILLE NEUF CENTS" (6900km) | 112.88s | 3386 | 843 |
| "treize pays" | 122.10s | 3663 | 1120 |
| "atteindre le Maroc" | 124.30s | 3729 | 1186 |
| "QUINZE milliards de m³" | 134.14s | 4024 | 1481 |
| "remonte à deux mille seize" (2016) | 141.44s | 4243 | 1700 |
| "Mohammed Six [VI]" | 144.66s | 4340 | 1796 |
| "première pierre symbolique" | 150.94s | 4528 | 1985 |
| "sur le papier, tout est parfait" | 162.20s | 4866 | 2323 |
| "VINGT-CINQ MILLIARDS" | 181.44s | 5443 | 2900 |
| "sorti le chéquier" | 186.18s | 5585 | 3042 |
| "aucune décision finale" (FID) | 190.18s | 5705 | 3162 |
| "la Mauritanie" | 208.60s | 6258 | 3715 |
| "VIRTUELS." (fin narration Acte 2) | 222.84s | 6685 | 4142 |
| Fin de fenêtre (avant Acte 3) | 223.62s | 6709 | 4165 |

---

## DÉCOUPAGE EN BEATS (registre + contenu, dérivé de PLAN-ACTES2-5.md)

### Beat 2.1 — Ouverture carte plate [frame relative 0 → 282]
**Texte** : "Si vous lisez la presse internationale en juillet deux mille vingt-six, un seul de ces
projets semble exister."
**Registre** : Carte D3 plate (transition depuis le globe — cf § Transition ci-dessous).
**Contenu** : Vue large Afrique de l'Ouest + Maroc. Le tracé AAGP (`t.flowGold` — voir § Palette réelle
ci-dessous) s'illumine doucement. TSGP absent/non mentionné à ce stade (pas encore introduit
narrativement — ne pas l'afficher avant l'Acte 3).
**Décision finale (Aziz, 2026-08-03)** : **fondu enchaîné classique**, PAS de morphing de projection
D3. Écarté même dans sa variante sans risque technique (rester en ortho + zoomer jusqu'à courbure
imperceptible, cf `GlobeToParchemin16x9.tsx`) — le globe et la carte D3 plate bleutée sont deux
REGISTRES visuels différents (contrairement à `GlobeToParchemin16x9.tsx` où globe et carte parchemin
appartenaient au même univers AES). Forcer une continuité géométrique entre 2 registres différents
serait artificiel. Détail : `PLAN-ACTES2-5.md` divergence 5.

### Beat 2.2 — Freetown, signature [frame relative 282 → 843]
**Texte** : "Le dix-neuf juillet deux mille vingt-six, à Freetown, en Sierra Leone, quinze chefs d'État
ouest-africains signent officiellement un accord [...]. L'objectif : construire le gazoduc atlantique
africain. Un monstre d'infrastructure : près de SIX MILLE NEUF CENTS kilomètres de longueur."
**Registre** : Carte D3 + jetons-portraits (méthode Soudan) + compteur km.
**Contenu** :
- Zoom progressif sur Freetown (frame 282).
- Jetons-portraits (2-3 figures clés, PAS 15 têtes réelles — cf risque "surcharge" identifié par les
  3 voix DA-brief) qui apparaissent avec SFX pop, à Freetown (frame ~352, "quinze chefs d'État").
- Le tracé AAGP commence à se dessiner (`strokeDashoffset`) à partir de ce point.
- Chiffre "6900 km" : **ne PAS afficher en simultané avec "SIX MILLE NEUF CENTS" (frame 843)** — décision
  gate = décalé, ancré à l'arrivée du tracé au Maroc (voir Beat 2.3).

### Beat 2.3 — Tracé, 13 pays, arrivée Maroc [frame relative 843 → 1481]
**Texte** : "L'idée est de faire partir le gaz du Nigeria, de suivre toute la côte atlantique en
traversant treize pays, pour finalement atteindre le Maroc. Une fois arrivé au Maroc, le gaz doit
traverser la Méditerranée pour alimenter l'Europe à hauteur de quinze milliards de mètres cubes par an."
**Registre** : Carte D3, comptage incarné.
**Contenu** :
- Tracé AAGP continue de se dessiner le long de la côte, 13 pays s'illuminent au passage — **vitesse
  variable** (accélération progressive, décision gate issue de DeepSeek : ne pas répartir les 13 pays à
  vitesse constante, "13 pays en 8s = trop rapide" si linéaire).
- Compteur "6900 km" ancré à l'arrivée du tracé au Maroc (~frame 1186, "atteindre le Maroc") — PAS à
  frame 843 où le chiffre est prononcé.
- Frame 1481 ("quinze milliards de m³") : flèche/tracé pointillé doré traverse la Méditerranée vers
  l'Europe, compteur secondaire "15 Mds m³" (séparé du compteur 6900km, ne pas les confondre à l'écran).

### Beat 2.4 — Flashback genèse 2016 [frame relative 1700 → 2323]
**Texte** : "L'idée n'est pas nouvelle. C'est un vieux rêve qui remonte à deux mille seize — l'année où
le roi Mohammed Six et le président nigérian Muhammadu Buhari posent ensemble la première pierre
symbolique d'un projet qu'aucun des deux ne verra peut-être jamais fini. Ce rêve est aujourd'hui relancé
en grande pompe : sur le papier, tout est parfait. Les administrations existent déjà, le cadre juridique
est prêt, et les accords diplomatiques s'enchaînent."
**Registre** : Jetons-portraits (Mohammed VI + Buhari), PAS stick-figure (décision de session).
**Contenu** :
- Frame 1700 : bascule visuelle "flashback" (à définir — fondu court, changement de teinte/traitement
  pour signaler qu'on recule dans le temps, cohérent avec au moins une proposition DA-brief : "fond crème
  très léger sur bleu marine" ou traitement équivalent, à trancher au code).
- Frame 1796 : 2 jetons-portraits (Mohammed VI, Buhari) apparaissent, trait d'encre net, détourés (méthode
  Soudan `portrait-hemeti.png`/`portrait-burhan.png`).
- Frame 1985 : objet "première pierre symbolique" — icône Lucide plate ou badge (PAS isométrique, décision
  gate question 1) entre les 2 jetons.
- Frame 2323 : retour à la carte normale (fin du flashback), "sur le papier tout est parfait" — icônes
  Lucide (`FileCheck`/`Stamp`/`Handshake`, proposées Kimi) qui valident chaque étape le long du tracé.

### Beat 2.5 — Le financement manquant [frame relative 2900 → 4165, fin acte]
**Texte** : "Tout est parfait, sauf un détail. Le détail qui compte le plus quand on parle d'un projet
estimé à environ VINGT-CINQ MILLIARDS de dollars. Personne n'a encore sorti le chéquier. À ce jour, il
n'y a aucune décision finale d'investissement. Le Maroc discute avec la banque américaine EXIM et la
Banque mondiale, mais on en est au stade préliminaire. Pire encore, pour que le tracé fonctionne, il faut
l'accord formel de pays comme la Mauritanie, qui ne font même pas partie du bloc ouest-africain. C'est un
projet séduisant, diplomatiquement très mûr… mais dont les tuyaux restent, pour l'instant, VIRTUELS."
**Registre** : Insert schématique (financement, SANS ancrage géo fort) + retour carte pour Mauritanie
(qui, elle, A un ancrage géo).
**Contenu** :
- Frame 2900 ("VINGT-CINQ MILLIARDS") : chiffre affiché, transition vers insert schématique probable —
  jauge/portefeuille qui reste vide ou se barre (proposition convergente G+K+D : icône `Wallet` barrée).
- Frame 3042-3162 (chéquier / aucune FID) : insert reste actif, jauge à 0 ou clignotante "préliminaire".
- Frame 3715 ("la Mauritanie") : **retour à la carte** (la Mauritanie a un ancrage géo réel, contrairement
  au financement abstrait) — contour Mauritanie mis en évidence (pulse orange, warning).
- Frame 4142-4165 ("VIRTUELS", fin acte) : le tracé AAGP passe en `stroke-dasharray` espacé / opacité
  réduite pour signifier "virtuel" (idée bonus convergente Gemini+Kimi) — état qui doit PERSISTER visuellement
  en ouverture d'Acte 3 si le tracé AAGP reste visible en arrière-plan pendant que TSGP est introduit
  (cohérence à vérifier avec le breakdown Acte 3, pas encore fait).

---

## ⛔ PALETTE RÉELLE (vérifiée dans le code Acte 1 committé, remplace la correction provisoire du PLAN)

Le PLAN macro (`PLAN-ACTES2-5.md`) notait une correction factuelle provisoire (palette teal du
PROTOTYPE R&D `ProtoGazoducAfriqueComplete.tsx`) et un arbitrage Aziz "passer au doré". Depuis, l'Acte 1
a été committé par ailleurs — sa palette RÉELLE (celle qui compte, celle qui est déjà à l'écran dans la
vidéo validée) est vérifiée ici dans `GazoducActe1Hook.tsx` :
- `const t = THEMES.mixte` (importé de `SoudanActe3GlobeProto16x9.tsx`) — **`t.flowGold` EST déjà le
  doré** utilisé pour AAGP sur tout l'Acte 1 (tracé, drapeaux, glow Europe, pastilles). C'est la couleur
  à réutiliser telle quelle pour l'Acte 2 — aucune nouvelle valeur à inventer, l'arbitrage Aziz "passer
  au doré" est déjà satisfait par l'existant.
- `TSGP_COLOR = "#c1502e"` — PAS orange comme les 3 voix DA-brief l'avaient supposé (elles proposaient
  `#E67E22`/`#FF8C00`/orange générique). Un commentaire dans le code explique pourquoi : un premier choix
  `#e8834a` a été jugé "trop proche de flowGold sur fond kaki" en review downstream Acte 1 et corrigé en
  corail/rouge-brique plus sombre pour une séparation nette en LUMINANCE. **Réutiliser `#c1502e` pour
  TSGP en Acte 2/3**, ne pas réintroduire l'orange halluciné par le DA-brief.
- Fond/terre/encre : `THEMES.mixte` fournit aussi ces valeurs (`t.land`, `t.landStroke`, etc.) — à
  vérifier dans `SoudanActe3GlobeProto16x9.tsx` au moment du code plutôt que deviner depuis ce breakdown.
- ⚠️ Cette table remplace explicitement la section "palette" du PLAN macro pour ce qui concerne le doré/
  orange — le PLAN reste correct sur le PRINCIPE (aligner sur l'existant Acte 1), seule la valeur exacte
  change maintenant qu'Acte 1 est committé et consultable.

## CE QUI RESTE OUVERT (pas un manque du breakdown — choix d'exécution à trancher au code)

- Traitement visuel exact du "flashback 2016" (fondu, changement de teinte, cadre différent) — plusieurs
  options proposées par le DA-brief, aucune tranchée en priorité par Aziz.
- Choix fichier audio (narration.mp3 complet + offset vs narration-p2.mp3 isolé) — impact sur toutes les
  frames relatives listées ci-dessus, à trancher AVANT d'écrire le composant Remotion.
- Mouvements de caméra précis (pan/zoom exacts, valeurs scale/translate) — le DA-brief donne des intentions
  ("zoom progressif sur Freetown", "pan vers le Sahara") mais aucune valeur numérique — normal à ce stade,
  se règle au moment du code sur rendu réel (comme l'a fait l'Acte 1, 8 rounds d'itération caméra).

## Prochaine étape

Ce breakdown couvre l'Acte 2 seul. Les Actes 3, 4, 5 restent au niveau `PLAN-ACTES2-5.md` (macro) —
même méthode à répéter (extraction alignement forcé + découpage en beats) quand on y arrivera, pas
avant. Après ce breakdown : code de l'Acte 2 (composition Remotion), pas de nouveau DA-brief (déjà fait,
règle MAX 1 appel/acte respectée par l'appel unique couvrant les 4 actes).
