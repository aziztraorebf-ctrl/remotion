# Synthèse DA-BRIEF downstream Partie 1 — VÉRIFIÉE par Claude (signal, pas juge)

Réponses brutes : `/tmp/da-refs/da-warmap-p1-downstream-{gemini,kimi}.md`.
Gemini+Kimi analysent 2 frames FIGÉES sans son ni mouvement → ils hallucinent sur l'animation.
Chaque point ci-dessous est VÉRIFIÉ contre le code réel + les frames.

## ✅ VRAI & PERTINENT (à retenir)
1. **[CONVERGENT G+K] Micro-labels manquants aux taches d'impact** — "Kidal/Gao/Tombouctou"
   en petites capitales encre près des 3 taches. Ancrerait le récit géographique (le lambda ne
   sait pas QUELLES villes tombent). Implémentable en P1 (encre, pas overlay). RECO Claude : OUI.
2. **[Gemini] Paradoxe "armée présente/État absent" par soustraction sélective** — quand le fill
   rural s'évapore (beat 1.3), GARDER les points-garnison (Bamako/Gao/Tombouctou) en encre.
   L'État (surface) disparaît, l'armée (point) reste isolée dans le vide. Définition visuelle
   parfaite du paradoxe central. RECO Claude : OUI (fort, et 100% soustraction).
3. **[CONVERGENT G+K] Cartouches blancs + ombre sous les labels de ville = anti-parchemin** —
   "BAMAKO/NIAMEY" ont un fond blanc opaque + ombre = look template web. DÉFAUT RÉEL mais HÉRITÉ
   de l'Acte 1 (pas du code P1). Fix = encre sans boîte, halo réserve parchemin. RECO Claude :
   OUI mais touche l'Acte 1 (à grouper avec le recalage Task 8, sinon risque non-régression).

## ⚠️ PARTIELLEMENT VRAI (améliorations mineures, optionnelles)
4. **Taches = cercles identiques** — vrai (3 `circle` même rayon). Bords organiques (path/turbulence)
   = plus "encre". Mineur, coût/bénéfice moyen. RECO : plus tard si on veut polir.
5. **Trait sans vrai tapering** — j'ai 2 traces (large+nette) mais pas d'épaisseur dégressive
   source→pointe. Améliorable. Mineur.
6. **Vide pâle proche du "bug de chargement" pour un lambda** — le fill tombe à 0.16 (pas blanc).
   Les micro-labels + garnisons (points 1-2) règlent ça en grande partie (le vide devient lisible
   comme "perte" car les points restent). RECO : traité indirectement par 1+2.

## ❌ HALLUCINÉ (ignorer — déjà fait ou faux)
- "Ligne droite/vecteur parfait" → FAUX : route à 5 waypoints courbes (quadratiques) déjà en place.
- "Cut sec, animer les fades" → FAUX : board clearing, trait, vide, hachures sont TOUS interpolés.
- "stroke-dashoffset à ajouter" → DÉJÀ FAIT.
- "blend multiply manquant" → DÉJÀ FAIT (tous les éléments P1 en mixBlendMode multiply).
- "ombre portée sur LIBYE" → c'est l'effet basemap, mon label P1 n'a pas d'ombre.

## DÉCISION POUR AZIZ (goût)
3 ajouts proposés, par ordre de valeur :
A. Micro-labels Kidal/Gao/Tombouctou aux taches (ancrage récit). — RECO forte.
B. Garder points-garnison quand le fill s'évapore (paradoxe central). — RECO forte.
C. Labels de ville sans cartouche blanc (anti-slop) — touche l'Acte 1 → grouper avec Task 8.
