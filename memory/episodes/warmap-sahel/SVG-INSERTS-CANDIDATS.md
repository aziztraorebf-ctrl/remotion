# War-Map AES — Candidats SVG-insert + test système agentique

> Analyse 2026-06-26 (passe complète du SCRIPT-V5 au filtre [[SVG-MIDFORM-FORMAT]]). But : repérer où le
> SVG narratif élève la vidéo SANS casser la signature War-Map (géo = Mapbox). Brief prêt pour session dédiée.

## VERDICT : 1 candidat franc + 1 secondaire faible

Le script V5 a été conçu en doctrine Infographics Show / show-don't-tell SUR LA CARTE → presque tout est
déjà (et doit rester) Mapbox. Le SVG ne s'ajoute QUE là où il est irremplaçable (concept abstrait sans géo).

### ✅ PRIORITAIRE — Franc CFA (Partie 4, finale, ~f vers la fin)
- **Texte** : « Il reste une question que personne n'a tranchée : celle du franc CFA. Cette monnaie commune,
  toujours liée à Paris, continue de circuler dans les trois pays — et rompre avec elle serait sans doute
  leur prochaine grande décision. »
- **Pourquoi SVG** : montage monétaire ABSTRAIT, aucune carte ne le montre. Cas d'usage canonique de la
  doctrine (zone -> parité verrouillée -> réserves/dépôt à Paris -> flux). C'est l'exemple PROUVÉ (test CFA 2026-06-25).
- **Forme** : SVG-insert ~30-45s, registre concept/dézoom (déjà acté dans le script, décision Aziz 2026-06-10 #6).
- **Raccord** : la carte vient de dézoomer (confédération posée) -> bascule vers l'insert SVG concept -> retour
  carte pour la chute « résister/construire/durer ». Continuité = même fil narratif.

### ⚠️ SECONDAIRE (faible, à trancher en session) — « villes tenues / campagnes perdues » (Partie 2)
- **Texte** : « ces armées tenaient les villes, mais pas les campagnes… une force étrangère ne pouvait pas
  régler des conflits locaux. »
- **Concept** OUI, MAIS déjà parfaitement montrable sur la carte (points-villes tenus vs rural qui rougit).
  Le SVG n'apporterait pas assez pour justifier de casser le fil Mapbox. **Probablement rester Mapbox.**
  À tester seulement si on veut un 2e insert pour rythmer.

### ❌ TOUT LE RESTE = Mapbox (ne PAS SVG-iser — casserait la signature War-Map)
Hook, flot d'armes (flux géo), Serval/MINUSMA/expansion, Charte/Kidal/offensive/Moura, réfugiés,
ressources or/uranium/pétrole, confédération. Tous = géo réelle située ou jetons géo-ancrés.

## TEST SYSTÈME AGENTIQUE (l'angle d'Aziz)
- ⛔ **Mapbox agentique = PAS TESTÉ** (MEMORY) → NE PAS tester le système sur le Mapbox de l'AES (double risque).
- ✅ **SVG agentique = PROUVÉ** (Beat 3 GGW ~90% autonome, [[PRODUCTION-AGENTIQUE-SVG]]).
- → **Le SVG-insert CFA est le cas de test IDÉAL** : terrain agentique prouvé + bloc ISOLÉ 30-45s + ne met pas
  en risque le reste de la War-Map. Si l'agent réussit le CFA, le système est validé sur un cas réel sans danger.

## BRIEF SESSION DÉDIÉE (prêt à coller)
1. **Objet** : produire le SVG-insert « franc CFA » (~30-45s) pour la finale de la War-Map AES, via le
   système agentique SVG ([[PRODUCTION-AGENTIQUE-SVG]] + [[SVG-FAISABILITE-AMONT]] image-cible AVANT le code).
2. **Faits** : `memory/episodes/warmap-sahel/FACTS-CFA-2026.md` (vérifier sourçage avant tout chiffre à l'écran).
3. **Registre/fond** : concept abstrait, fond dans la palette (PARCHEMIN cohérent War-Map, ou blueprint froid
   pour le registre « mécanisme financier » — à trancher au storyboard). PAS de géo réelle, PAS de photoréalisme.
4. **Voix** : segment CFA de la narration V5 (mesurer durée ffprobe + word-timing avant de figer les frames).
5. **Pipeline** : storyboard panel 4-cases (modèle PROPOSE) -> valider direction Aziz -> générer SVG (GLM-5.2
   défaut, [[openrouter-svg]]) -> animer par frame (tracage/colorisation timée/flux) -> SFX existants.
6. **Garde-fou** : 1 seul insert (pas de chantier SVG massif) ; le reste de l'AES reste Mapbox INTACT.

## ⚠️ CORRECTION 2026-06-27 — LE CFA EXISTE DÉJÀ (vérif livrable réel)
Le brief 30-45s ci-dessus IGNORAIT que la P4 a DÉJÀ un CFA : `Partie4Cout.tsx` Ph8 (F_CFA=11869) +
`out/episodes/warmap-sahel/p4-cfa-FINAL.mp4` (13.5s, split-screen carte AES + pièce CFA / Paris + « ≈656 FCFA » +
« symbole de trop », validé FINAL). **DÉCISION AZIZ** : on produit une VERSION ALTERNATIVE SVG isolée (pipeline
agentique), on GARDE l'existant, et on fera le COMPARATIF des deux quand tout sera complet (ne pas remplacer à l'aveugle).
- **Segment audio RÉEL mesuré** (narration-v5-alignment) : « celle du franc CFA. Cette monnaie commune, toujours liée
  à Paris, circule encore dans les trois pays, et rompre avec elle serait sans doute leur prochaine grande décision. »
  Frames f11861 (« franc », 395.4s) → f12166 (« décision. », 405.5s). **Durée ≈ 10.2s** (PAS 30-45s — coller à l'audio).
- **Registre** : PARCHEMIN War-Map (continuité, décision Aziz 2026-06-27) — PAS blueprint.

## ÉTAT VIDÉO AES (vérifié RÉEL 2026-06-27)
✅✅ **Acte1 FINAL + P1 + P2 + P3 FINAL.** P4 = morceaux à assembler (dont p4-cfa-FINAL existant).
✅ Hook Acte 1 « détachement+soudure » = fait + commité (`23a550a`, branche feat/warmap-aes-hook-integration).
