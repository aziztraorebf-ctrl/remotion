# PLAN NARRATIF P2 — phrase par phrase (reconstruit DEPUIS l'audio, 2026-06-11)

> Méthode actée (retour Aziz) : on part de l'AUDIO, on définit pour CHAQUE phrase ce que le SPECTATEUR
> doit COMPRENDRE (œil neuf), puis quels assets de l'ARSENAL COMPLET le racontent — jetons + overlays +
> objets Gemini + effets PixelLab ENSEMBLE, pas un seul. La cause doit être VISIBLE (action causale, pas état).
>
> Problème de la v3 : on montrait des RÉSULTATS (tache rouge qui pop, base qui brûle sans attaquant) sans
> les CAUSES. Un œil neuf ne comprend pas. Fix : montrer QUI fait QUOI → donc le résultat.

## ARSENAL DISPONIBLE (à combiner)
- **Jetons-combattants animés** (Acte 1, rodés) : `technical-jnim`/`fighter-jnim` (chèche clair), `technical-eigs`/`fighter-eigs` (cagoule sombre), `fighter-france`. ← LES ACTEURS, absents de la v3.
- **Bases/objets Gemini** : `base-fr-td` (fortin FR), `base-minusma-td` (ONU), `ville-tenue-td` (ville), `base-africacorps`.
- **Overlays** : `GeoConvergenceOverlay` (présence FR — fait pour 2.2, VALIDÉ), `SahelFriseOverlay` (frise temps), `SahelPrepositionnementOverlay`.
- **Effets PixelLab** : `fx-smoke` (fumée ambiant), `fx-explosion` (one-shot). À utiliser comme CONSÉQUENCE d'une action, pas décor.
- **Zones d'emprise** : transitoires (kit). = le territoire contrôlé, MAIS doit naître d'une action (jetons qui avancent).
- **Briques** : flèche tactique courbe, pulse, board clearing, timeline.

---

## PLAN PAR PHRASE

### Phrase 1 — "Face à cette menace qui grandit, la réponse extérieure est massive. Dès 2013, la France lance Serval, puis Barkhane." (f3196)
- **Le spectateur doit comprendre** : la France arrive en force pour répondre à la menace jihadiste.
- **Intention causale** : la menace (jetons jihadistes déjà là, hérités Acte 1) → la France POSE ses bases en réponse.
- **Assets** : (1) rappel discret des jetons JNIM/EIGS présents (la menace) ; (2) bases `base-fr-td` se POSENT en séquence (Gao/Ménaka/Tessalit) avec un petit impact d'arrivée ; (3) frise "2013 · Serval→Barkhane".
- **Mouvement** : les bases arrivent (spring + poussière légère d'installation), la caméra cadre serré le nord-Mali.

### Phrase 2 — "Si la France peut intervenir aussi vite, c'est qu'elle est déjà présente tout autour." (f3419)
- **Comprendre** : la France était DÉJÀ là, pré-positionnée autour de la région.
- **Assets** : **`GeoConvergenceOverlay`** (VALIDÉ, fait pour ça) — voile + 3 forces (Épervier/Licorne/Sabre) convergent vers le Mali. Pulse origines + flèches courbes (déjà codé). Pas de total chiffré (Sonar #5).
- **Mouvement** : caméra élargie (voir la présence régionale), overlay porte, voix minimale.

### Phrase 3 — "L'ONU déploie la MINUSMA pour stabiliser le Mali." (f3660)
- **Comprendre** : une 2e force étrangère (ONU, distincte) se déploie.
- **Assets** : sprites `base-minusma-td` se posent (Kidal/Tombouctou/Mopti). Distincts visuellement des bases FR (drapeau bleu ONU).
- **Mouvement** : caméra re-resserre nord, les avant-postes ONU apparaissent.

### Phrase 4 — "Dix ans plus tard, malgré toutes ces forces, le résultat est l'inverse : les groupes armés contrôlent PLUS de territoire qu'en 2012." (f3887) ⭐ LE CŒUR — À REFAIRE COMPLÈTEMENT
- **Comprendre** : MALGRÉ les bases FR + ONU, les jihadistes GAGNENT du terrain. C'est l'échec.
- **ERREUR v3** : tache rouge qui pop + bases qui brûlent sans attaquant = incompréhensible.
- **Intention causale (NOUVELLE)** : ce sont **les JETONS jihadistes qui AVANCENT** — ils se déplacent depuis leurs zones (Liptako/nord), **encerclent les bases**, et c'est LEUR progression qui colore le territoire en rouge. La zone rouge NAÎT de l'avancée des jetons, elle ne pop pas.
- **Assets COMBINÉS** : (1) jetons `technical-jnim`/`technical-eigs` se MULTIPLIENT et AVANCENT (track frame-driven, comme Acte 1) ; (2) leur sillage = la zone rouge qui s'étend DERRIÈRE eux (progression, pas pop) ; (3) frise "2013→2022" qui défile (le temps passe) ; (4) les bases FR/ONU restent mais sont DÉBORDÉES (le rouge passe autour/sous elles).
- **SORT DES BASES (décision Aziz)** : montrer l'attaque PUIS la chute. Les jetons atteignent une base → elle est encerclée → elle se RETIRE/tombe (grisée + petit fanion baissé OU effacement, mais APRÈS qu'on ait vu l'attaque). PAS de fumée magique sans cause. (À trancher : retrait vs chute — voir note.)
- **Mouvement** : caméra suit l'avancée des jetons (le foyer = l'action), pas une vue figée.

### Phrase 5 — "Ces armées tenaient les VILLES, mais pas les CAMPAGNES." (f4384)
- **Comprendre** : l'armée contrôle les points-villes, mais le rural (l'entre-deux) échappe.
- **ERREUR v3** : on ne comprenait pas ce que sont les nouveaux objets ni le rouge.
- **Intention** : CONTRASTE explicite ville (tenue, bleu) vs campagne (rouge, jetons). Les villes = îlots tenus DANS une mer rouge.
- **Assets COMBINÉS** : (1) sprites `ville-tenue-td` = les villes tenues (îlots) ; (2) entre elles, les jetons jihadistes patrouillent le rural + zone rouge = le rural perdu ; (3) éventuel label léger "villes tenues / campagnes perdues" pour lever l'ambiguïté.
- **Mouvement** : drift large qui montre le damier villes-bleu / campagnes-rouge.

### Phrase 6 — "Dès 2015, les groupes débordent vers le Burkina. En 2022, 40% du territoire burkinabè échappe à l'État." (f4955)
- **Comprendre** : la violence FRANCHIT la frontière sud (Mali→Burkina). Ce sont les GROUPES qui s'étendent (pas un coup d'État).
- **Intention causale** : des jetons jihadistes FRANCHISSENT physiquement la frontière Mali→Burkina (mouvement de débordement visible), leur sillage colore le nord Burkina.
- **Assets** : (1) jetons qui traversent la frontière (flèche de débordement) ; (2) zone rouge qui s'étend au Burkina ; (3) frise "2015" puis donnée "40% · 2022" (data-viz ancrée, pas juste un texte).
- **Mouvement** : caméra pan SUD pour suivre le débordement.

### Phrase 7 — "En juillet 2023, le Niger bascule : les militaires prennent le pouvoir à Niamey." (f5380)
- **Comprendre** : changement de NATURE — pas les groupes armés, mais un COUP D'ÉTAT militaire (acteur différent).
- **ERREUR v3** : "rien ne montre la dernière phase visuellement".
- **Intention** : distinguer nettement du rouge jihadiste. Niamey = un événement POLITIQUE. Marqueur fort : un jeton/sprite MILITAIRE (junte, `jeton-csp` ou drapeau militaire) prend Niamey, halo blanc/or de bascule.
- **Assets** : (1) Niamey s'allume fort ; (2) un marqueur junte (sprite/jeton militaire distinct du jihadiste) ; (3) frise "Juillet 2023 · CNSP".
- **Mouvement** : caméra pan EST vers Niamey, push-in sur la bascule.

### Phrase 8 — "La CEDEAO, 15 pays, brandit la menace d'une intervention armée." (f5639)
- **Comprendre** : une coalition régionale MENACE le Niger d'intervention.
- **Intention** : pression externe — pays CEDEAO autour, flèches de menace CONVERGENT vers Niamey.
- **Assets** : (1) pays CEDEAO marqués orange (sprites/zones) ; (2) flèches de menace tactiques vers Niamey ; (3) frise "CEDEAO · 15 pays".
- **Mouvement** : léger dézoom pour voir la coalition encercler.

### Phrase 9 — "Et c'est précisément ce qui va tout déclencher." (f5690)
- **Comprendre** : cliffhanger → bascule vers la Partie 3 (l'AES naît en réaction).
- **Assets** : carte FIGÉE 1s, flèches CEDEAO figées en tension, le Niger au centre. Suspens.

---

## DÉCISIONS TRANCHÉES (Aziz 2026-06-11) — VERROUILLÉES
1. **Sort des bases** (phrase 4) : les jetons attaquent (encerclement visible) PUIS la base **tombe en fumée**
   (fx-explosion + fx-smoke). La cause (attaque jetons) est montrée AVANT l'effet (chute). On garde l'effet PixelLab.
2. **Jetons jihadistes** : **4-6 max** à l'écran. Archétypes distincts : JNIM (`technical-jnim`/`fighter-jnim`,
   chèche clair) + EIGS (`technical-eigs`/`fighter-eigs`, cagoule sombre).
3. **Frise temporelle** : OUI — frise/compteur **2013→2022 qui défile** pendant la phrase 4 (rend visible "dix ans").
4. **40% Burkina** : **data-viz animée** — compteur qui monte vers 40% + jauge ancrée (registre analyste).

## RÈGLE TRANSVERSALE (la leçon de cette session)
**Chaque scène combine l'ARSENAL, pas un seul asset.** Jetons (acteurs) + zones (conséquence) + overlays
(contexte) + Gemini (lieux) + PixelLab (effets) + frise (temps) ENSEMBLE. La cause (action des jetons) doit
toujours précéder l'effet (territoire rouge / base qui tombe). Action causale, jamais état qui pop.
