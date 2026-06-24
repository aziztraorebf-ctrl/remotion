# REPRISE — Beat 2 GGW + methode SVG narrative (etat au 2026-06-23, fin de session)

> Session longue et DEBLOQUANTE. Le Beat 1 (hook) etait deja FINAL. Cette session = on a attaque le Beat 2,
> on s'est heurte a un mur (4 generations ratees), on a trouve LA CAUSE RACINE, cree un outil, et tout debloque.
> ⛔ Lire AUSSI : [[REPRISE-AJUSTEMENTS-HOOK]] (etat du hook) + la doctrine `templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md`.

## ⭐⭐⭐ LA DECOUVERTE MAJEURE DE LA SESSION (cause racine)
Pendant 4 generations, TOUTE scene B2 derivait vers le SCHEMA TECHNIQUE (plan de coupe, cotes, grille, "FIG. 01").
CAUSE RACINE TROUVEE : `scripts/tools/svg-scene-libre.py` IMPOSAIT dans son prompt interne "lignes de construction, cotes".
=> peu importe le brief narratif, l'outil forcait la planche d'ingenieur. Ce n'etait NI le registre encre, NI les LLM.

CORRECTION : nouvel outil **`scripts/tools/svg-scene-narrative.py`** (commite e27fc67) :
- SANS l'imposition cotes. Interdits explicites (zero cote/grille/cartouche/FIG/PLAN DE COUPE/legende).
- Supporte 2 refs : `--narrative-ref` (une scene qui RACONTE, autre teinte OK) + `--style-ref` (le look/trait a adopter).
- PROUVE : portfolio encre varie reussi (marche/puits/foyer), zero blob, zero cote.

## ⭐⭐ CE QUI EST PROUVE (ne plus remettre en question)
1. **Le registre ENCRE tient la narration variee** (ce n'etait pas lui le probleme, c'etait l'outil).
2. **Le trait d'encre PUR** (brun-noir sur creme, AUCUN aplat colore) produit de belles scenes narratives lisibles.
3. **ZERO figure humaine/animale** (regle Aziz, confirmee) : raconter par les OBJETS et les TRACES (esprit "pelle plantee").
   Une marchande dessinee = silhouette ratee ; une balance qui pend + paniers renverses = la presence DEVINEE, plus elegant.
4. **Gemini vs GPT** : Gemini = plus riche/atmospherique sur l'encre EN GENERAL. MAIS sur B2 (cordeau), GPT a ete PLUS
   LISIBLE (5 arbres morts alignes nets). => generer les 2, juger scene par scene. Pas de gagnant absolu.
5. **Colorisation timee sur trait d'encre = MARCHE** (test foyer, `FoyerColorTest.tsx`, catbox x0toim) : on injecte le SVG
   encre genere et on colorise UN element sur la timeline (le feu s'embrase or/orange) en gardant le reste en encre.
6. **Effet WHITEBOARD = MARCHE** (`WhiteboardTest.tsx`, catbox q0gbay) : une scene s'efface trait par trait (draw-off,
   stroke-dashoffset) pendant qu'une autre se dessine (draw-on). Notre signature "carnet vivant", sans cut/fade.
   ⚠️ Limite a respecter (insight Aziz) : le draw-on COUTE du temps d'ecran -> reserver aux TRANSITIONS (rapide ~0.5-1s)
   ou a UN geste-cle souligne, JAMAIS dessiner toute une scene en 5s (le calage audio devient ingerable). Accent, pas defaut.

## ETAT DU BEAT 2 (image-cible faite, PAS encore codee)
- Direction validee (proposee par les 2 LLM a l'ideation) = **"LA LIGNE DE MORT AU CORDEAU"** : une corde tendue entre 2
  piquets (la ligne droite rigide = l'erreur), 4-5 jeunes arbres alignes dont 3-4 morts + 1 survivant, une dune qui avance
  et engloutit les pieds, racines courtes suggerees, sol craquele, outils abandonnes (arrosoir/plantoir) = l'humain sans l'humain.
- Image-cible generee en encre pur : **Gemini retenu** (catbox kikdsg) mais **GPT plus lisible** (catbox 5i03h3) -> A RE-JUGER.
  Les 2 SVG sauves : `cibles-svg/B2-cordeau-{gemini,gpt}.svg` (groupes nommes : corde, piquet_g/d, arbre_1..5 separes, dune, racines, sol, outils).

## ▶ PLAN DE MATCH POUR LA PROCHAINE SESSION (decide par Aziz)
1. **CODER le Beat 2 en CONTEXTE FRAIS** (instance fraiche, effort eleve). Le contexte de cette session est sature.
   - Methode : partir de l'image-cible B2 (`cibles-svg/`), reecrire en JSX animable, caler sur la voix B2
     (audio existe : `public/audio/ggw-muraille-verte/narration-beat2.mp3`, 19.04s ; alignment global dispo), faire mourir
     les arbres un a un, coloriser le survivant. Continuite avec la fin du hook (monde deja mort).
2. **⭐ IDEE AZIZ A EXPLORER** : ne PAS forcer la continuite a tout prix. Une scene B2 qui assume un SAUT (coupure franche
   vers une scene neuve) donne plus de marge creative que de prolonger le meme monde encre. Maintenant qu'on sait produire
   de vraies scenes narratives, on peut se le permettre. A tester comme concept : "ca ne marche pas en continu -> on fait un saut".
3. **FOYER = candidat TEMPLATE** (`enc-foyer-gemini`, catbox u5q06r) : tres detaille, Aziz impressionne. A pousser comme
   template reutilisable + tests de colorisation plus pousses (le feu doit mieux depasser de la marmite, flammes plus grandes).
4. **Pousser la colorisation/SVG sur le portfolio** (puits, foyer) avec Gemini : jusqu'ou on va. + **MIX-AND-MATCH GPT<->Gemini**
   (transporter un groupe <g id> d'un SVG a l'autre = deja prouve avec les arbres du hook ; les SVG sont du texte, copie-colle de groupe).
5. **GRAVER LA DOCTRINE** une fois B2 valide (pas avant) : l'outil svg-scene-narrative + les regles ci-dessus dans
   `templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md` (la regle scene-narrative + whiteboard y sont deja en partie).

## GIT / ORGANISATION (IMPORTANT pour reprendre)
- Branche = `feat/shorts-svg-muraille-verte`. Commits session : 499333e (Beat 1 FINAL), e27fc67 (outil), b5bf48e (tests+cibles).
- ⚠️ On a travaille en **WORKTREE** `/tmp/ggw-worktree` (le repo principal `/Users/clawdbot/Workspace/remotion` est sur la
  branche Senegal d'une session parallele). Le worktree n'a PAS node_modules -> pour RENDER, copier les fichiers test dans le
  repo principal, render, puis NETTOYER (restaurer Root.tsx, rm les fichiers). Ne JAMAIS committer de test sur la branche Senegal.
- Audio (`public/audio/ggw-muraille-verte/`) = LOCAL non-committe (gitignore). Regenerable. narration-beat1..6 + sfx existent.
- Refs de style creees : `public/_shared/refs/svg-registres/REF-STYLE_encre-pur-trait.png` (trait encre nu = f0 du hook) +
  `REF-NARRATIVE_encre-hook-propre.png` (hook colore = niveau de narration). Les JOINDRE aux futures generations.

## RENDUS DE LA SESSION (catbox)
- Hook Beat 1 FINAL (voix+SFX) : mhksjd. Whiteboard test : q0gbay. Foyer colorisation test : x0toim.
- Portfolio encre PUR : marche(lxc33g/rghg6e) puits(j45fhh/gje9ql ⭐) foyer(qgv3d8/u5q06r ⭐).
- Image-cible B2 cordeau : gpt(5i03h3) gemini(kikdsg).
