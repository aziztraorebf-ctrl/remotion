# PLAN DE MATCH — Polish War-Map Sahel : transport des 6 mécaniques décodées

> Créé 2026-06-14. Issu de la session R&D décodage (Max Bellona + Jacques a dit + The Invisible Hand).
> 6 mécaniques prototypées en full HD (bac à sable `src/projects/warmap/_rnd/maxbellona/`). Toutes validées
> par Aziz comme "à passer en template". Ce doc = COMMENT chacune se transporte vers nos VRAIES briques /
> vrais jetons, et CE QUE ça change pour la vidéo AES en cours. PAS tout construire d'un coup — plan d'abord.
>
> ⚠️ Les protos utilisent un `project` LOCAL (bac à sable). Le transport = brancher sur `ctx.project` du moteur
> Sahel (SahelRenderContext) + nos vrais sprites/jetons (chèche clair JNIM / cagoule sombre EIGS) + portraits
> STYLISÉS (notre marque, pas photos réelles). Voir [[DECODE-maxbellona]].

## Rappel — état de la vidéo AES (où ces ajouts s'insèrent)
Acte1 ✅ · P1 ✅ · P2 ✅ · P3 ✅ (FINAL). **P4 EN REFONTE** : Chantier 4 ✅ · Chantier 1 Exode ✅ · Chantier 2
Coût ✅. RESTE : **Chantier 3 (Confédération AES sur la carte)** → Chantier 2 Ressources → render P4 → assemblage.
+ chantier HOOK 30s (NEXT-ACTION). C'est là que les mécaniques atterrissent.

---

## Les 6 mécaniques → transport + impact AES

### P1 — Liens orthogonaux "circuit" (catbox 1nypbx) ⭐⭐ PRIORITÉ HAUTE
- **Transport** : brique `OrthoLink` + `ActorToken` → brancher sur `ctx.project`. Remplacer pastille-sigle par
  nos vrais jetons (sprite chèche/cagoule pour factions ; pour les PAYS = pastille drapeau ou contour pays).
  Le sceau central AES = réutiliser le geste "SCEAU tampon" déjà prévu Ph7 de Partie4Cout.
- **Impact AES = DÉBLOQUE LE CHANTIER 3** (Confédération, "dur à représenter d'habitude"). Mali/Burkina/Niger
  reliés par tracé qui se dessine → convergence → sceau. + soutiens étrangers (Russie/Africa Corps) reliés.
  Remplace les overlays semitransp BANNIS (WARMAP-GRAMMAIRE-CAUSALE) par une mécanique SUR la carte.
- **Effort** : moyen. **Le plus rentable** : transforme le chantier le plus dur en chantier outillé.

### P2 — Badge-faction octogone/losange (catbox mlqbeq)
- **Transport** : nos jetons Sahel sont des CERCLES (chèche/cagoule). Test = passer l'enveloppe en OCTOGONE
  (lecture "faction/unité" meilleure que cercle, confirmé proto). Garder le sprite dedans. `FactionBadge`
  prend déjà shape + déplacement from→to (faction qui avance) = compatible grammaire causale.
- **Impact AES** : upgrade visuel des jetons existants (P2/P3 déjà validées — NE PAS y retoucher sans raison).
  → réserver pour P4/futurs épisodes, OU test A/B sur 1 plan. Décision de GOÛT Aziz (cercle vs octogone).
- **Effort** : faible. **Décision de goût requise avant d'appliquer.**

### P3 — Transformation carte géo → carte de guerre (catbox f9ywvh) ⭐⭐ PRIORITÉ HAUTE
- **Transport** : la séquence (carte nue → nom → data paradoxe → teinte guerre + zones rouges + jetons → question)
  se code directement sur le moteur Sahel. LEÇON GRAVÉE : NE PAS repeindre les pays en rouge (bouillie) →
  garder couleurs nationales + voile sombre léger + zones rouges franches PAR-DESSUS (cohérent grammaire causale).
- **Impact AES = LE HOOK 30s** (chantier NEXT-ACTION, "hook actuel bien mais faible"). Gabarit A (carte qui se
  transforme) appliqué AVANT génération audio. Voir [[HOOK-MAXBELLONA-GABARIT]].
- **Effort** : moyen. **Stratégique : le hook est le levier n°1 de rétention.**

### P4 — Flux le long d'un trajet pointillé (catbox b2m3gv)
- **Transport** : `DashedFlow` généralise notre `RefugeeFlow` (déjà dans _shared). Brancher sur ctx.project.
  Usages : axe d'attaque (rouge), or exporté (doré), blocus carburant JNIM (cf. fait Sahel Chronicles : 95% du
  carburant malien vient par route Sénégal/CI → cible des convois).
- **Impact AES** : Chantier 2 RESSOURCES (or/uranium/pétrole en flux) + tout futur épisode à flux. Complète
  l'exode (humains) par les flux militaires/commerciaux.
- **Effort** : faible (brique proche de l'existant).

### P5 — Split 2/3 écrans (catbox 24c7i5) — supplanté par P6 pour 2 écrans
- **Transport** : `SplitScreen` (render-props). Le 3-écrans = horizontal seulement (notre format War-Map 16:9 OK).
  ⚠️ chaque volet DOIT avoir son cadrage géo propre (sinon = carte coupée en deux). Pour 2 écrans → préférer P6.
- **Impact AES** : 3 écrans = comparer les 3 pays AES côte à côte (1 moment, ex. "chacun a son front"). Usage ponctuel.
- **Effort** : faible. Utilité plus situationnelle.

### P6 — Split HORIZONTAL 2 cartes vivantes différentes (catbox yqtarl) ⭐ VALIDÉ Aziz
- **Transport** : helper `makeProjectFor(bbox)` = cadrage indépendant par volet (déjà codé). Chaque volet =
  vraie carte vivante (zone + jetons + zones rouges animées). Porté de la série verticale "Vous oubliez" → horizontal.
- **Impact AES** : faire passer 2 fronts/idées EN MÊME TEMPS (ex. HAUT Mali centre / BAS Niger frontière ;
  ou "pendant que X au nord, Y au sud"). Puissant pour la simultanéité (attaques coordonnées = fait réel AES).
- **Effort** : faible-moyen (brique faite). **Validé visuellement par Aziz.**

---

## ORDRE DE BATAILLE recommandé (Claude)
1. **P1 → Chantier 3 Confédération** (débloque le plus dur, prochaine étape P4 de toute façon). PRIORITÉ.
2. **P3 → Hook 30s AES** (levier rétention n°1 ; avant génération audio du hook).
3. **P4 → Chantier 2 Ressources** (flux or/uranium/pétrole). Brique proche de l'existant.
4. **P6** quand un moment de simultanéité se présente (2 fronts). Validé, prêt.
5. **P2** = ✅ DÉCISION AZIZ 2026-06-14 : **tester l'octogone en A/B** sur nos vrais jetons JNIM/EIGS (sprite
   chèche/cagoule dans une enveloppe octogonale vs cercle actuel) sur un plan réel → Aziz compare et tranche.
   NON prioritaire (après P1+P3). Ne pas toucher P2/P3 déjà FINAL tant que pas validé.
6. **P5** = usage situationnel. Pas bloquant.

**Règle** : on consolide une brique en `_shared` SEULEMENT quand on l'a utilisée 1× en vrai dans la vidéo
(éviter l'over-engineering). Le bac à sable `_rnd/maxbellona/` reste la R&D ; le portage se fait brique par
brique au moment du chantier correspondant.

## Ce que ça change globalement pour la vidéo AES
- Chantier 3 (le plus dur) devient outillé (P1).
- Le hook faible devient fort (P3).
- Les ressources gagnent une mécanique de flux (P4).
- On gagne la simultanéité (P6) et la comparaison (P5).
- Les jetons peuvent monter en lisibilité (P2, si Aziz valide le losange/octogone).
→ La vidéo passe d'un "très bon" à un cran au-dessus, avec des AJOUTS faisables, sans refonte.

Liens : [[DECODE-maxbellona]] · [[HOOK-MAXBELLONA-GABARIT]] · [[DECODE-sahel-chronicles]] ·
[[WARMAP-GRAMMAIRE-CAUSALE]] · [[BRIEF-PASSATION-P4-REFONTE]] · [[PLAN-REFONTE-P4]]
