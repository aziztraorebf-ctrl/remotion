# STATUS — Système Atlas (playbook + bibliothèque)

> Chantier transversal (pas un épisode) : rebâtir le système Atlas à parité Souverain.
> Mis à jour 2026-06-03. SYSTÈME ACTIF — voir doctrines pour l'état courant.

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
- Moonwalk : ✅ RÉSOLU À LA RACINE (frames west natives, plus de flip — voir Techniques apprises).
- Persos PixelLab à compléter (directions manquantes) : Hannibal (numide, v4a = est-seul), volque
  (ouest-seul), épéiste/lancier/sundiata/almoravide (1 dir). À régénérer en 4 dirs si réutilisés.

## Beats système validés (preuves que le système guide)

1. **Drop-objet** — `AtlasV2SaharanDropScene` (porteur dépose l'or, repart, l'or persiste). catbox znmqfr.
2. **Confrontation 1v1** — `AtlasV2ConfrontationScene` (2 sprites sens opposés + Spotlight Insert chiffré). catbox 736mwf.
3. **BATAILLE 2 ARMÉES** ⭐⭐ — `AtlasV2ArmyDeployScene` (2026-06-04, "ne pas perdre ça" Aziz). LE template avancé :
   file indienne x2 → déploiement file→ligne (dir déduite du dx, anti-moonwalk sur 8 sprites) → Spotlight Insert →
   CHARGE → estoc spear_attack PLAY-ONCE (séquentiel/simultané) → PERTES (camp perdant tombe + fade). catbox 2fycin.
   Compositions Root : `AtlasV2ArmyDeploy` (simultané), `AtlasV2ArmyDeploySeq` (séquentiel).

## Assets PixelLab générés cette session (soldat-mali, ID d378d0f2-2704-4f4e-bf60-3a8475b2fb16)

4 anims maintenant : walk_cycle (6f) + **charge** (running-6f) + **spear_attack** (7f, estoc lance) + **death** (falling-back, 7f).
Toutes est+ouest natives. Dossiers : `public/atlas-mansa-moussa/characters/soldat-mali/animations/`.
SFX générés (ElevenLabs) : `public/_shared/sfx/sfx-clash-impact.mp3` (1.36s) + `sfx-army-charge.mp3` (2.0s).

## Prochaine action (templates proposés par Aziz 2026-06-04)

Voir NEXT-ACTION section "templates Atlas à créer". 3 familles : (a) **objets sur la map** (villes/objets,
différentes manières d'apparaître/révéler) ; (b) template dédié **Peste 1347** (valider/améliorer beats existants) ;
(c) template dédié **Hannibal** (se débloque fort avec la bataille — sprites numide/volque + AtlasAttackArrow).
BACKLOG avancé : **multi-lignes séquentielles** (rangs qui avancent pour combler les morts — demande un moteur d'état).
Démarrer par le point d'entrée : `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md`.

## Techniques apprises (raccordées au système)

- **PixelLab 4 directions natives (RÈGLE Aziz)** : générer TOUJOURS est/ouest/sud/nord. Pas de
  flip = pas de moonwalk. `AtlasPixelChar` charge la frame native ; `flipForWest` = fallback déprécié.
  Le moonwalk venait de flipper des frames west natives (qui regardent déjà à gauche). Vrai fix =
  ne pas flipper. Méthode : test ISOLÉ (3 sprites côte à côte) a tranché — pas une frame de scène.
- **Projection sur carte Mansa** : interpoler le long des `caravaneWaypoints` du json, PAS geoUtils
  (repères différents). Chaque carte a son repère.
- **Pattern drop-objet** : walk → fige (animated=false si pas de crouch) → objet spring-in au pied
  (PERSISTE) → walk inverse. Caméra track + zoom 1→2→1, tilt annulé au zoom.
- **Test système** : agent vierge = meilleur détecteur de failles doc (il a trouvé 2 frictions + 1 piège
  projection que le contexte masquait). Workflow peut planter en fin (StructuredOutput) → récupérer
  des transcripts.
