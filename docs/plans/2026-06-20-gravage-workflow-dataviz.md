# PLAN — Graver le workflow DATA-VIZ (session 2026-06-20)

> But : transformer tout ce qu'on a prouve cette session en un systeme COHERENT, navigable, sans
> fichier date/contradictoire — pour qu'Aziz n'ait pas a se repeter, que Claude (contexte frais) se
> repere, et que les agents reproduisent parfaitement. Leger, pas lourd : 1 doctrine maitresse +
> enrichissement des fichiers existants (pas de doublon).
> Branche : `feat/dettes-systeme-preambule-gate` (continuite du chantier dettes systeme).

## CE QU'ON A PROUVE (la matiere) — 6 acquis
1. **Storyboard = CIBLE a reproduire** (pas un brouillon). On GENERE les assets qu'il montre, on ne
   redessine pas en SVG a la main (anti-pattern prouve : proto SVG amateur vs assets generes premium).
2. **Format storyboard** : ratio du panneau = ratio du RENDER (gate format en amont) · 4 cases
   (etats + transition + final) · 2 versions auto (parchemin defaut + 1 fond LIBRE explore par Gemini) ·
   illustration plate obligatoire (jamais realiste = reproductible).
3. **Format BREAKDOWN** (le coeur, GPT-5.5) : pour CHAQUE element -> verdict GENERE/REMOTION/HYBRIDE +
   prompt d'asset pret (fond transparent, hex, style, intensite CALIBREE "juste assez") + placement en
   classes TAILWIND + tailles MESUREES en % du cadre (pas estimees) + intention en prose + perimetre
   Remotion explicite. Critere : un agent frais l'execute sans rien deviner.
4. **Chaine assets** : generation Gemini -> DETOURAGE RECRAFT obligatoire (Gemini ne sort jamais d'alpha,
   il dessine un faux damier opaque). Verifier alpha (0,255) + trou des lettres transparent.
5. **Diff cible-vs-render** par GPT-5.5 (planche A|B) -> corrections MESUREES, pas devinees. MAIS 1 passe,
   SIGNAL pas juge (pas de boucle diff->fix->diff ; doctrine modele=signal). Exclure les annotations de
   storyboard (titre d'etat, timer) du diff = ne pas les reproduire.
6. **Regle d'or transverse** : ne jamais juger un asset/render de MEMOIRE -> toujours cote-a-cote avec la
   cible, faire MESURER les ecarts par le modele qui voit la cible (mon oeil notait 80%, GPT mesurait 55%).

## STRUCTURE DE GRAVAGE (decision Aziz : doctrine maitresse + enrichir l'existant, rien de date)

### A. CREER la doctrine maitresse
- `memory/doctrines/WORKFLOW-DATAVIZ.md` ⭐⭐ = LE pipeline complet d'un bout a l'autre
  (storyboard -> breakdown -> generation -> detourage -> assemblage Remotion -> diff), avec les 6 acquis,
  les formats exacts, les regles, et les POINTEURS vers les scripts/doctrines (sans dupliquer leur detail).
  Absorbe le role de `STORYBOARD-DATAVIZ.md` (qu'on garde mais qui devient le focus "etape storyboard"
  pointe par la maitresse) -> verifier coherence, pas de contradiction.

### B. ENRICHIR les fichiers/outils existants (pour qu'ils portent les validations a 100%)
- `scripts/tools/gemini-storyboard-panels.py` : DEJA fait cette session (preambule premium + --ratio +
  --background {parchemin|navy|neon|libre} + discipline panneaux + ratio par panneau). VERIFIER que "4 cases"
  et "2 versions auto (parchemin+libre)" sont bien refletes. Ajouter au besoin un mode 2-versions.
- `scripts/tools/openrouter-vision-breakdown.py` + un PROMPT DE BREAKDOWN de reference : graver le format
  (verdict 3 valeurs + prompts asset + Tailwind + tailles mesurees + intensite calibree + intention +
  perimetre). Le prompt valide est dans `/tmp/breakdown-prompt-case4-teal.txt` -> le sauver en doctrine/template.
- `scripts/tools/openrouter-vision-breakdown.py` : graver aussi le PROMPT DE DIFF cible-vs-render
  (planche A|B, ecarts mesures, corrections Tailwind, exclure annotations storyboard). Source `/tmp/diff-prompt.txt`.
- `STORYBOARD-DATAVIZ.md` : mettre a jour (storyboard=cible, generer pas redessiner, 4 cases, 2 versions,
  ratio par panneau) — retirer ce qui est desormais dans la maitresse pour eviter doublon, pointer vers elle.
- `memory/feedbacks/feedback_juger-asset-cote-a-cote-storyboard.md` : DEJA cree. Verifier liens.
- CREER `memory/feedbacks/feedback_gemini-detourage-recraft-obligatoire.md` (ou enrichir l'existant
  `feedback_gemini-assets-fond-transparent.md`) : Gemini ne sort pas d'alpha -> Recraft remove_background.
- `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` : pointer vers WORKFLOW-DATAVIZ comme pipeline storyboard->code.
- `memory/archive/CHANTIER-PEAUFINAGE-GRAPHISMES-2026-06-20.md` : cocher TROU 1/2/3 (tous traites) + noter le workflow grave.
- `MEMORY.md` : 1 ligne pour WORKFLOW-DATAVIZ (index).
- `memory/NEXT-ACTION.md` : noter "prochaine session = 3 corrections pixel du cobaye teal (70 plus grand,
  trou du 0, picto reserves plus grand) + appliquer WORKFLOW-DATAVIZ sur une vraie scene".

### C. COBAYE (matiere de preuve, NE PAS PURGER)
- `src/projects/_rnd/cobaye-maroc-phosphate/TealAssemblyEtat3.tsx` + assets `public/_rnd/cobaye-teal/` :
  garder comme reference du workflow. Noter dans `_GARDER-base-peaufinage.md`.
- Renders preuve (catbox) : storyboard teal `a2viyv` · render final v5 `9cyxmg` · comparatif `2ifp2z`.

### D. RESTE pour session fraiche (PAS maintenant)
- 3 corrections pixel cobaye : 70 plus grand · trou du 0 (blanc residuel a nettoyer au detourage) ·
  picto reserves plus grand. = lisibilite/taille, mieux en contexte frais.
- Gate format phase 0 BLOQUANT dans beat-session.py (demander horizontal/vertical au depart) : a cabler.
- Tester WORKFLOW-DATAVIZ bout-en-bout sur une vraie scene de prod (pas un cobaye).
- **AGENT VIERGE DE VALIDATION** (decision Aziz) : a lancer AU DEBUT de la prochaine session, contexte FRAIS,
  AVANT de toucher quoi que ce soit. But : lire le systeme grave "a froid" comme un vrai agent qui debarque,
  reproduire le workflow sur un cas, dire ce qui manque/ambigu. Avant OU apres les 3 corrections pixel = a
  decider sur place. La commande exacte de lancement est dans le fichier de REPRISE (voir E).

### E. ⭐ FICHIER DE REPRISE UNIQUE (livrable cle — pour qu'Aziz n'ait RIEN a repeter)
- CREER `memory/archive/REPRISE-WORKFLOW-DATAVIZ-2026-06-20.md` = LE point de reprise de la prochaine session. Contenu :
  - Etat exact : "workflow data-viz prouve A->Z le 2026-06-20, grave dans WORKFLOW-DATAVIZ.md".
  - TOUS les liens catbox de A a Z (storyboard teal cible, les 5 versions de render, comparatifs, le 70 or,
    le picto, le background) + chemins disque (cobaye TealAssemblyEtat3.tsx, public/_rnd/cobaye-teal/,
    breakdown JSON, prompts) — pour retrouver la matiere sans la chercher.
  - Les 3 corrections pixel a faire (70 plus grand, trou du 0, picto reserves) avec OU dans le code.
  - La commande exacte pour lancer l'agent vierge de validation.
  - Pointe depuis NEXT-ACTION.md en TETE (premiere chose vue).
  - But : ouvrir la prochaine session, dire "continue", l'instance sait tout, reprend ou on s'arrete.

## ORDRE D'EXECUTION (cette session)
1. Ecrire ce plan (fait).
2. Creer `WORKFLOW-DATAVIZ.md` (doctrine maitresse).
3. Sauver les 2 prompts de reference (breakdown + diff) en templates doctrine.
4. Enrichir STORYBOARD-DATAVIZ + SOUVERAIN-REMOTION-PLAYBOOK + feedbacks (detourage) + CHANTIER + MEMORY + NEXT-ACTION.
5. check-links.py + commit.
6. Scan de session (memoire) en fin.
```

## GARDE-FOU anti-lourdeur
La maitresse RACONTE le workflow et POINTE ; les details techniques vivent dans les scripts/doctrines cibles.
Pas de copier-coller du meme contenu dans 2 fichiers. Si un fichier devient redondant avec la maitresse ->
le reduire a un focus + pointeur. check-links a la fin.
