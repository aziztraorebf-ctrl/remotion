# STATUS — Système Atlas (playbook + bibliothèque)

> Chantier transversal (pas un épisode) : rebâtir le système Atlas à parité Souverain.
> Mis à jour 2026-06-03. Branche `feat/atlas-playbook-retour-aux-sources` (11 commits, à merger).

## État (tout FAIT, validé render + Aziz)

1. **Doctrine** — `memory/doctrines/ATLAS-PLAYBOOK.md` (7 principes) + `ATLAS-PIXELLAB-PLAYBOOK.md`
   (sprites) + `ATLAS-BEAT-DEMARRAGE.md` (checklist scan). Dérivés de Ghana + Mansa Moussa.
2. **Bibliothèque organisée** — `src/projects/atlas/_shared/` : `ATLAS-INDEX-DES-INDEX.md` (carte
   maître) + `COMPOSANTS-INDEX.md` (par cas d'usage) + `ATLAS-ASSETS-INDEX.md` (568 sprites/19 persos).
3. **Mansa Moussa restauré** (était purgé) — code `_reference/mansa-moussa-v2/` + 79 assets PixelLab
   `public/atlas-mansa-moussa/`. Self-contained, re-rendu OK (caravane PixelLab visible).
4. **1er beat système VALIDÉ** — `AtlasV2SaharanDropScene` (porteur dépose l'or au Sahara, repart,
   l'or persiste). Produit par un AGENT VIERGE suivant la doc → preuve que le système guide. Approuvé
   Aziz. Moonwalk corrigé (flip `AtlasPixelChar`). Render : `out/_r-and-d/atlas-decode/saharan-drop/`.

## Corrections ouvertes (mineures, non bloquantes)

- SFX `atlas/sfx-gold-coins-drop.mp3` à générer (backlog SFX-INDEX). Marche = footsteps OK.
- Anim crouch porteur-mali : NON nécessaire (décision Aziz — le perso qui s'arrête suffit).

## Prochaine action

CONTINUER À TESTER LE SYSTÈME sur d'autres patterns de beat (confrontation 2 sprites / empire qui
s'étend / Spotlight Insert chiffre). Voir NEXT-ACTION. Démarrer par le point d'entrée :
`src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md`.

## Techniques apprises (raccordées au système)

- **Flip-ouest sprite** : miroir autour de x (`translate(2x) scale(-1)`), jamais offset décalé (moonwalk).
- **Projection sur carte Mansa** : interpoler le long des `caravaneWaypoints` du json, PAS geoUtils
  (repères différents). Chaque carte a son repère.
- **Pattern drop-objet** : walk → fige (animated=false si pas de crouch) → objet spring-in au pied
  (PERSISTE) → walk inverse. Caméra track + zoom 1→2→1, tilt annulé au zoom.
- **Test système** : agent vierge = meilleur détecteur de failles doc (il a trouvé 2 frictions + 1 piège
  projection que le contexte masquait). Workflow peut planter en fin (StructuredOutput) → récupérer
  des transcripts.
