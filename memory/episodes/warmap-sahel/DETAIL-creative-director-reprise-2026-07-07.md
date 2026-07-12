---
name: warmap-sahel-short-90s-reprise
description: Historique des rejets du Short AES 90s + Direction Brief du concept "parchemin qui s'ecrit" propose en reprise (2026-07-07)
metadata:
  type: project
---

## Contexte
Short vertical 9:16 (91.86s) "L'AES en 90 secondes" pour War-Map/GeoAfrique. Script + audio + alignement
Whisper deja produits et valides (ne pas regenerer) :
- `memory/episodes/warmap-sahel/SCRIPT-SHORT-90S-V1.txt`
- `public/_shared/audio/sahel-warmap/short-90s-v1.mp3`
- `src/projects/warmap/_shared/whisper-words-short-90s.ts`

## 4 tentatives rejetees (session 2026-07-07, table rase faite avant ma consultation)
1. Montage extraits video Mapbox coupes -> effet "slideshow", trop de plans juxtaposes.
2. Carte Mapbox neuve + icones PNG bricolees -> pas fidele au style maitrise, bricolage visible.
3. Mix carte Mapbox + inserts SVG existants (Liptako/Resources/StatuQuo) -> la moitie carte restait un probleme.
4. Ecu/blason unique heraldique qui se fissure/se brise/se refond (propose par Kimi, affine par Claude,
   genere via Gemini 3.1 Flash Image) -> jugé pas assez porteur pour la densite factuelle du script (Libye
   2012, France/ONU, coup d'Etat, CEDEAO, ressources). **Lecon cle : UN symbole abstrait unique ne peut pas
   incarner 9 faits distincts sans devenir illisible ou plat.**

Detail complet : `memory/episodes/warmap-sahel/PLAN-SHORT-90S-V3-REPRISE.md`.

## Principe valide (analyse video reference NotebookLM, a respecter dans toute proposition future)
UNE SEULE scene/objet visuel persiste a l'ecran en continu du debut a la fin et se TRANSFORME — jamais de
cut vers un nouveau decor complet. Sous-titres mot-par-mot. Une seule rupture de registre visuel autorisee,
au moment le plus dramatique du recit.

## Concept propose en reprise (Direction Brief Stage 1, 2026-07-07)
"L'Acte qui s'ecrit" : un unique parchemin gravure (registre deja maitrise du projet, cf `LiptakoRevealSVG.tsx`
/ `CfaRevealSVG.tsx` / `ResourcesRevealSVG.tsx`), cadre fixe, 3 emblemes Mali/Niger/Burkina poses des le debut
(meme ancrage visuel du 1er au dernier plan, jamais remplace). Chaque fait recoit SA PROPRE forme concrete qui
s'ajoute sur ce meme cadre (bases qui implosent, alliances qui se sectionnent, CEDEAO qui se fissure,
Libye qui craque, halo France/ONU qui grandit, bascule militaire, sceau CEDEAO menacant qui recule = SEULE
rupture de registre, puis reprise litterale de Liptako+Resources deja approuves pour le climax AES). Detail
panel-par-panel + justification complete : Stage 1 dans `.claude/agent-memory/shared/PIPELINE.md`.

**Statut au 2026-07-07** : propose a Aziz, PAS ENCORE VALIDE. Ne pas coder avant validation explicite du
concept (question de gout) — voir [[feedback_reutiliser-assets-approuves]].

## Direction tranchee par Aziz + 2 storyboards executes en aveugle (meme session, 2026-07-07)
Aziz a tranche la direction visuelle (pas de retour en arriere a proposer) : carte geographique vivante en
d3-geo PUR (zero Mapbox), fond parchemin, UN SEUL cadre continu, gestes = drapeaux/couleurs dans les
polygones + Libye qui vire gris/rouge + fracture CEDEAO generalisee de `ProtoEffect_Fracture.tsx` + inserts
Liptako/Resources recolores pour la fin. Deux agents creative-director ont produit un storyboard panel-par-
panel COMPLET sur cette meme direction, chacun en aveugle de l'autre (pas de convergence forcee, angle =
audace des gestes) :
- `memory/episodes/warmap-sahel/STORYBOARD-AGENT-A.md`
- `memory/episodes/warmap-sahel/STORYBOARD-AGENT-B.md` (ma signature : "la carte qui s'ecrit" — accumulation
  de couches d'encre sans jamais effacer, fracture qui reste ouverte a 70% entre le panel rupture et le panel
  suivant ou le sceau AES vient la refermer au point de jonction exact).

Detail complet (verifications disque, points factuels a trancher, tableau de faisabilite) : Stage 1 (2e
entree) dans `.claude/agent-memory/shared/PIPELINE.md`.

**Points factuels non tranches decouverts en ecrivant le storyboard B** (a verifier avant tout render,
ne pas confabuler) :
1. Drapeau Libye pour le geste "vire gris puis rouge" : tricolore post-2011 (rouge-noir-vert-croissant) vs
   vert uni Kadhafi pre-2011 — j'ai suppose le tricolore, a confirmer.
2. Chiffre "+territoire" (panel "groupes armes controlent PLUS de territoire qu'en 2012") : pas de %
   invente, verifier une source chiffree existante avant d'afficher un nombre.
3. `SahelAttackArrow.tsx` est Mapbox-only (`map.project()`) — inutilisable en d3-geo pur, prevoir un tracé
   SVG maison pour toute fleche sur cette carte.
4. `libya-outline.geojson` existe deja dans `public/_shared/geo-data/sahel/` — plus direct que filtrer le
   TopoJSON mondial `countries-50m.json` pour extraire la Libye.

**Statut au 2026-07-07 (fin session)** : 2 storyboards ecrits, AUCUN code encore. Next action = Aziz arbitre
entre A/B (ou fusionne), tranche les 2 points factuels, valide le cadrage vertical propose par B, PUIS
prototyper les gestes a risque (fitExtent Sahel+Libye combine, fracture generalisee 3 pays, raccord
fracture->sceau AES) avant code final.
