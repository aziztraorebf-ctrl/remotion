> ⛔⛔ DOCUMENT OBSOLÈTE (2026-06-15) — LA REFONTE P4 EST TERMINÉE. Les 6 scènes (exode/coût/ressources/
> confédération/CFA/fin habitée) sont TOUTES validées + full HD. NE PAS coder depuis ce doc. NEXT = ASSEMBLAGE.
> Voir `STATUS.md` (en-tête) + `NEXT-ACTION.md`. Conservé pour archive historique uniquement.

# BRIEF PASSATION — Refonte P4 (Chantiers 1, 3, 2 + assemblage) — session dédiée

> Créé 2026-06-14, MAJ soir. Restent : finir Chantier 4 (2 fixes) + chantiers 1, 3, 2 + assemblage final.

## ⚠️⚠️ ALERTE EN PREMIER (2026-06-14 soir)
1. **CONFLIT SESSION PARALLÈLE** : une 2e session a commencé à coder+rendre le **Chantier 1 (Exode)** dans
   `Partie4Cout.tsx` pendant cette session (render chrome-headless actif à 14:34). Le fichier a CHANGÉ.
   → AVANT TOUTE ÉDITION : `git status`, vérifier qu'aucun render ne tourne (`ps aux | grep remotion`), RELIRE
   `Partie4Cout.tsx` EN ENTIER. Ne JAMAIS éditer en aveugle. Coordonner si 2 sessions actives.
2. **CHANTIER 4 (Fin habitée) — 2 FIXES RESTANTS** suite DA downstream : voir `CONSIGNES-FIX-CHANTIER4.md` (valeurs
   exactes avant→après). Fix A = caméra qui pane (équilibre géo). Fix B = hiérarchie échelle/opacité (dirigeants
   fantômes 0.35 + soldats/menaces petits + menace=tache pas chip). ❌ PITCH écarté (testé, carte plate, preuve).
   Le Chantier 4 était "validé" mais Aziz a re-jugé en full HD : portraits OK (détourés), reste équilibre+lisibilité.

## ⭐ LIRE EN PREMIER (dans l'ordre)
1. **`PLAN-REFONTE-P4.md`** — LE plan complet : 4 chantiers + synthèse tracée des 5 modèles (G/K/D, ✅/🔶/❌) +
   règles transverses + faits. C'est la source de vérité de la refonte.
2. **`FACTS-P4-RESSOURCES-DIRIGEANTS.md`** — chiffres VERROUILLÉS (Sonar+Web) pour la data-viz + noms dirigeants.
3. **`PLAN-NARRATIF-P4.md`** — la table de triggers vérifiés (frames par phrase).
4. **Doctrine** : `WARMAP-GRAMMAIRE-CAUSALE.md` (règle CAUSE→EFFET + ⛔ règle overlay semi-transp INTERDIT) +
   `DA-BRIEF-GATE.md` (⭐ règle SYNTHÈSE EXTRACTIVE TRACÉE obligatoire à chaque appel modèle).

## ✅ DÉJÀ FAIT (ne pas refaire)
- **Chantier 4 FIN HABITÉE = VALIDÉ Aziz + RENDU FULL HD** : `out/episodes/warmap-sahel/wip/p4-c4-FINAL-fullhd.mp4`
  (f12297-13439). Dirigeants (portraits i2i ressemblants + plaques qui partent avant les soldats) → soldats verts →
  menace rouge sombre → extinction. Code dans `Partie4Cout.tsx` (section "CHANTIER 4"). NE PAS Y RETOUCHER.
- **Assets générés** (`public/_shared/sprites/warmap/p4-assets/`) : leader-mali/burkina/niger.png (i2i Wikimedia,
  ressemblants, SANS texte) · soldier-aes.png · threat-fighter.png · town-td.png · icon-or/uranium/petrole/sceau.
- **Fact-check** : dirigeants (Goïta/Traoré/Tiani) + ressources (uranium=6% RÉSERVES mondiales PAS % prod ·
  Burkina 2e or d'Afrique 94,4t · Mali ~10% exports · pétrole oléoduc 110 000 b/j ~80% exports).
- **Moteur** : gates intro/outro/CTA = `!isPartie` (ne parasitent plus P4). Légende factions `!partie4`. Fond épuré
  (sahel-fill neutralisé parchemin uniforme). getPartie4Cam revu (dézoom Ph9 bref → RETOUR serré 4.55 pour la fin).

## ▶ À FAIRE — chantiers restants (ordre de priorité Aziz : 1 → 3 → 2)

### CHANTIER 1 — EXODE DENSE (le 1er moment, "remplir la carte")
Remplace l'exode actuel (3 jetons, trop pauvre). Voir PLAN-REFONTE section CHANTIER 1 (tout détaillé).
- Caméra SERRÉE triangle Liptako-Gourma, pitch ~30°. Villes posées AVANT jetons (sprite town-td + WarMapPlaque +
  countryOutline pulse). ~12 jetons chip() (5 sprites réfugiés + miroir/rotation), directions ÉTOILE (sud/ouest/est),
  trajets LONGS Bézier 3-4s, départs STAGGERED, vitesses variées, offset anti-chevauchement, SILLAGE wet-ink sable.
  RefugeeFlow op 0.3 en fond. Code actuel = section "M1" de Partie4Cout.tsx (FLEE_CITIES à étendre).

### CHANTIER 3 — CONFÉDÉRATION SUR LA CARTE (supprimer l'overlay interdit)
⛔ L'overlay actuel "2024 Confédération AES" semi-transp = INTERDIT (carte au travers = bouillie). Le SUPPRIMER.
Voir PLAN-REFONTE section CHANTIER 3 : 3 contours → OR via flash · frontières internes s'effacent · sceau TOMBE
(tampon + poussière) sur Niamey · pitch 45° · onde d'union/signal radio QG→capitales. CFA = marqueur léger + fil
Sahel→Paris (PAS d'overlay plein écran mort). Code actuel = les 2 <WarMapOverlayDynamic> confed+CFA à remplacer.

### CHANTIER 2 — OVERLAYS DATA-VIZ PLEIN ÉCRAN (2 de suite, opaques, animés)
Voir PLAN-REFONTE section CHANTIER 2. Overlay COÛT : icônes-personnes en cascade (3 pour 3M, ~15 pour 15M qui
s'empilent) + StatCountUp + grain. Overlay RESSOURCES : data-viz CHIFFRES VERROUILLÉS (uranium 6% réserves mondiales ·
Burkina 2e or Afrique 94,4t · pétrole oléoduc) — PAS de % production (trompeur). Transition "tambour" entre les 2.
Pivot "aube" (DeepSeek). Code actuel = l'overlay coût ancré + les lingots posés (à remplacer par plein écran).

## APRÈS LES 3 CHANTIERS → ASSEMBLAGE FINAL (toute dernière étape de la vidéo)
Render full HD complet de SahelPartie4 (f9416-13439) → puis concat Acte1+P1+P2+P3+P4 (ffmpeg) + 1 narration globale
(`narration-v5-expressive.mp3`) + mix (musique + SFX). Pattern audio = épisodes précédents. C'est LA fin du projet.

## MÉTHODE (rappel, gravée)
- Mini-renders VIDÉO comparatifs scale 0.5 pour itérer, full HD pour juger la netteté.
- DA-brief si besoin sur un chantier qui résiste → SYNTHÈSE EXTRACTIVE TRACÉE (source + ✅/🔶/❌, rien ne file).
- Render : `bash scripts/render-mapbox.sh SahelPartie4 <out> --frames=A-B --scale=X`. Mux audio : ss = frame/30.
- Triggers = `narration-v5-alignment.json` (mot×30). P4 démarre f9416 = 313.87s de l'audio global.
