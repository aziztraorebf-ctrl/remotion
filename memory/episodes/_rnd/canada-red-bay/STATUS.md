# STATUS — R&D Canada Red Bay (test pipeline nouvelle chaîne)

## Où on en est (2026-08-13)
Test PIPELINE (pas marché) : script V3 FR écrit + validé par jury 4 modèles (Grok 7.4, Kimi 7.5,
Gemini 6.5, GPT 6.5 — moy. ~7/10). Sujet : le vol d'une baleine à Red Bay, Labrador (1575, procès
de 19 ans jusqu'à Cour suprême d'Espagne) + tragédie de l'île Saddle (hiver 1576, 130 corps).
Traduction fidèle + fusion créative d'un script Canadiana EN (73 990 vues EN vs 1 916 vues FR sur
la même chaîne bilingue — preuve directe EN >> FR sur ce créneau ; ce test reste FR/voix GéoAfrique
pour valider le PIPELINE, pas le marché, déjà validé côté EN par TubeLab).

**5 générations SVG comparées + 1 clip vidéo validé** (voir `tests-visuels/` et
`public/_rnd/fable-svg/canada-red-bay/`), scène 2 = ossements de baleine sur la plage :
- **Fable5 MAX = MEILLEUR résultat** : crâne+fissures+mâchoire+3 vertèbres+6 côtes différenciées
  (dont 1 brisée), composition en couches (brume 3 nappes), palette froide respectée.
- GPT-5.6 Sol = 2e, bon niveau anatomique (crâne+orbite+mâchoire+vertèbres circulaires lisibles).
- Kimi K3 = correct mais scène trop vide/minimaliste.
- Gemini 3.1 Pro = raté sur CE brief précis (côtes lues comme des voiles/dents, pas anatomique).
- GLM-5.2 = écarté d'emblée (text-only, faible sur l'organique confirmé par la doctrine memory).
- **MiniMax H3 R2V (scène 5, baleine qui plonge) = succès net** : séquençage 4×2s respecté à la
  lettre, décor 100% verrouillé, caméra statique conforme, zéro hallucination. Réf image via API
  Gemini officielle projet (PAS Comfy Cloud partner_generate, qui n'expose que "nano-banana").

Conclusion : le registre "mystère historique canadien" tourne bien dans le pipeline existant
(Mapbox/D3/SVG Fable5/génération vidéo), sans brique manquante. Fable5 confirmé meilleur choix
SVG scène organique sur ce projet.

**⭐⭐⭐ 2 styles H3 testés et VALIDÉS en aval de ce test pipeline (même session, 2026-08-13)** : Hand
Drawn (marche+réaction narrative, 2 plans) et Poster Vector (reveal d'icône synchronisé + split-screen
3 panneaux) — workflow standard confirmé (480p direction → 720p natif ou upscale ByteDance 1080p,
~$0.007/s). Détail complet : `tools/minimax-h3-styles-tests.md`. Clips finaux
+ références Higgsfield consolidés : `reference-styles-h3/README.md` (LIRE EN PREMIER — contient une
correction d'étiquetage importante). Reste à tester : Whiteboard Doodle (référence prête dans ce même
dossier). Prompt de reprise dédié : `PROMPT-REPRISE-SESSION-H3-STYLES.md`.

## Pourquoi (contexte décision)
Diversification hors Kora & Cartes (8 vues sur dernier long-form CFA, doute niche). TubeLab a
validé un signal fort : marché EN "Canada mégaprojet/mystère/histoire", faceless, long-form
(pas Shorts), RPM élevé (jusqu'à 20$+) — ex. Geography Effect, Hidden Canada, Canadiana (preuve
directe EN/FR sur chaîne bilingue, écart jusqu'à 300x sur certaines paires).

## Décisions actées
- Sujet = reproduction fidèle d'un sujet Canadiana déjà prouvé, pas d'invention (doctrine
  "template avant prompt"). Stack : Mapbox (relief réel ~40%) + D3.js (trajectoires/data ~30%)
  + SVG Fable5 (~15%) + génération vidéo MiniMax/Gemini (scènes organiques/complexes ~15%).
  Zéro stock footage, zéro présentateur filmé.
- Mapbox a un vrai moteur 3D WebGL (relief DEM réel) ; D3 n'a PAS de 3D natif (son "globe" est
  une projection 2D qui simule une sphère) — les deux ne sont pas interchangeables pour du relief.

## Fichiers de ce chantier
- `SCRIPT-V3-FR.md` — script final fusionné (8 scènes, balises production par scène)
- `JURY-CREATIF-4-MODELES.md` — 4 verdicts + 4 réécritures complètes (base du V3)
- `public/_rnd/fable-svg/canada-red-bay/scene2-ossements-{fable5,gemini,gpt56sol,kimik3,glm}.svg`
  + `previews/*.png` (rendus rasterisés des 5)
- `tests-visuels/scene5-baleine-minimax-h3.mp4` (clip validé, 8s/864×480) + `refs/` (image source
  Gemini) + `prompt-scene5-h3.txt` + `api-graph-scene5-h3.json` (graphe API réutilisable tel quel)

## Prochaine action
Reprendre directement l'écriture/build d'une scène (proposer Mapbox réel en premier — seule brique
du stack pas encore testée) ou construire la première scène complète assemblée en Remotion, au choix
d'Aziz en début de prochaine session.
