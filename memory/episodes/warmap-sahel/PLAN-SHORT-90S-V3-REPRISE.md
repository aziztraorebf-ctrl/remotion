> ⛔ **SUPERSEDED (2026-07-08)** — la reprise a RÉUSSI via carte vivante d3-geo PURE (PAS le storyboard
> multi-modèles décrit ici). Vidéo complète 92s produite & validée. Voir `SHORT-90S-PRODUCTION-2026-07-08.md`.
> Ce fichier = historique du diagnostic post-4-échecs uniquement.

# Short "L'AES en 90 secondes" — reprise (2026-07-07, après session non concluante)

**Ce qui reste VALIDE et à garder** :
- Script FR + tags TTS : `SCRIPT-SHORT-90S-V1.txt`.
- Narration audio GéoAfrique : `public/_shared/audio/sahel-warmap/short-90s-v1.mp3` (91.86s) + alignement
  Whisper `src/projects/warmap/_shared/whisper-words-short-90s.ts`.

**Ce qui a été essayé et REJETÉ cette session (2026-07-07)** — table rase faite, rien conservé :
1. V2 : montage d'extraits vidéo Mapbox coupés → effet "slideshow", trop de plans différents.
2. V3 : carte Mapbox neuve + icônes PNG bricolées en overlay pour tout le récit → pas fidèle au rendu
   de la vidéo longue, bricolage visible.
3. V4 : mix carte Mapbox (bloc tension) + réutilisation Liptako/Resources/StatuQuo existants →
   toujours jugé insuffisant (la moitié carte reste un problème).
4. Storyboard "écu/blason unique qui se fissure/se brise/se refond" (proposé par Kimi, affiné par
   Claude, généré 2× via Gemini 3.1 Flash Image) → concept jugé pas assez porteur pour la densité
   factuelle du script (Libye 2012, France/ONU, coup d'État, CEDEAO, ressources) — écarté.

**Diagnostic accumulé, à ne pas reperdre** :
- Principe qui fonctionne (analyse vidéo référence NotebookLM) : UN SEUL objet/scène visuelle qui
  ÉVOLUE en continu, jamais de cut vers un nouveau décor. Sous-titres mot-par-mot. Une seule rupture
  de registre visuel autorisée (au moment CEDEAO/effet inverse).
- Le CTA final peut assumer une rupture de style volontaire vers la VRAIE carte Mapbox + les 3 vrais
  leaders (Goïta/Traoré/Tiani) — pont concret vers la vidéo longue. Cette idée spécifique a été bien
  reçue, mais le composant code a été supprimé (repartir de zéro proprement).
- Un seul objet symbolique abstrait (blason) peine à porter un script aussi dense en faits distincts —
  la prochaine tentative doit explorer d'autres formes (pas présupposer une solution).

## Plan pour la prochaine session
1. **Storyboard multi-modèles AVANT tout code** : appel à Gemini 3.1 Pro, GPT-5.5 (via OpenRouter) et
   DeepSeek (texte seul, pas de vision) — chacun propose un storyboard panel par panel à partir du
   script + des contraintes Remotion (pas de 3D, réalisable en SVG/CSS/interpolate). Joindre des
   FRAMES de rendus Remotion déjà validés (ex. Sénégal V3 final) comme référence visuelle concrète du
   style qu'on maîtrise, au lieu de décrire le style en mots seulement (leçon de cette session : la
   description texte seule dérive facilement vers du 3D/héraldique générique).
2. **Avant ça, tester 2 agents avec briefs créatifs distincts** (connaissance du codebase + contraintes
   du projet), pour voir s'ils proposent des idées de storyboard qu'on n'a pas explorées. Comparer avec
   les propositions des 3 modèles externes.
3. Une fois un concept validé (par Aziz, pas juste par Claude) → breakdown JSON → code.

**Pas de contrainte de forme imposée d'avance** — ni carte Mapbox, ni blason, ni cercles. Laisser les
propositions externes/agents guider, comme le veut la doctrine INTENTION→FORME→TEMPLATE du projet.
