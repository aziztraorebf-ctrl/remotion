# ⭐ REPRISE — Workflow Data-viz (point de continuite, session 2026-06-20 → suivante)

> Ouvre la prochaine session, dis "continue" : ce fichier dit TOUT (etat, liens A→Z, quoi corriger,
> comment relancer). Aziz n'a RIEN a repeter. Doctrine du systeme : [[WORKFLOW-DATAVIZ]].

## ETAT EXACT
Le **workflow data-viz complet est PROUVE A→Z** le 2026-06-20 et GRAVE dans [[WORKFLOW-DATAVIZ]]
(pipeline storyboard → breakdown GPT-5.5 → generation Gemini → detourage Recraft → assemblage Remotion → diff).
Cobaye de preuve : Maroc phosphate "70% des reserves mondiales", etat "l'ecrasement". Render final = **v5**,
~fidele a la cible. PAS encore parfait (3 corrections de TAILLE restent, voir plus bas).

## TOUTE LA MATIERE (liens A→Z — ne rien re-chercher)

### Storyboards
- Storyboard teal CIBLE (la reference a reproduire, fond bleu petrole + 70 or) : https://files.catbox.moe/a2viyv.png
- Storyboard parchemin (notre registre par defaut, meme beat) : https://files.catbox.moe/jpn0zv.png
- Case 4 isolee (etat 3 "ecrasement" = ce qu'on a reproduit) : disque `/tmp/teal-case4-etat3.png` (regenerable en croppant la cible)

### Renders (evolution v1→v5)
- v5 FINAL (le meilleur, corrections diff GPT appliquees) : https://files.catbox.moe/9cyxmg.png
- Comparatif cible/v5 (cote-a-cote) : https://files.catbox.moe/2ifp2z.png
- (historique : v1 cobaye plat https://files.catbox.moe/plhrgr.mp4 — purgeable)

### Assets generes (+ detoures Recraft)
- "70" or relief SUBTIL (v3, le bon) detoure transparent : `public/_rnd/cobaye-teal/num70.png`
- Picto Terre + phosphate detoure : `public/_rnd/cobaye-teal/terre-phosphate.png`
- Background teal genere : `public/_rnd/cobaye-teal/bg-teal.png`

### Code + breakdown
- Scene Remotion (compo `TealAssemblyEtat3`) : `src/projects/_rnd/cobaye-maroc-phosphate/TealAssemblyEtat3.tsx`
  (enregistree dans Root.tsx). Render : `npx remotion still TealAssemblyEtat3 /tmp/x.png --frame=130 --scale=1`
- Breakdown GPT-5.5 v2 (verdict+prompts+Tailwind+tailles) : `/tmp/breakdown-case4-v2.json` (regenerable, voir templates)
- Prompts de reference graves : `memory/doctrines/templates/PROMPT-BREAKDOWN-DATAVIZ.txt` + `PROMPT-DIFF-CIBLE-RENDER.txt`

## CE QU'IL RESTE A FAIRE (prochaine session, contexte frais)

### 1. AGENT VIERGE DE VALIDATION — a lancer AU DEBUT, AVANT de toucher au code (decision Aziz)
But : lire le systeme grave "a froid" comme un vrai agent qui debarque, reproduire le workflow, dire ce qui
manque/ambigu. Valide que le systeme est reproductible sans Aziz/Claude pour expliquer.
Commande (Agent tool, subagent `general-purpose`, contexte frais) — prompt a lui donner :
> "Lis `memory/doctrines/WORKFLOW-DATAVIZ.md` et `memory/REPRISE-WORKFLOW-DATAVIZ.md`. Sans poser de question,
>  reproduis l'etape DIFF (etape 6) sur le cobaye : compose une planche cible (https://files.catbox.moe/a2viyv.png,
>  case bas-droite) vs le render `/tmp/teal-v5...` (ou re-render `TealAssemblyEtat3`), lance le diff GPT-5.5 avec
>  le template, et liste les corrections. Dis-moi si la doctrine t'a suffi pour tout faire SANS rien deviner, et
>  ce qui etait ambigu." Avant OU apres les 3 corrections ci-dessous = decider sur place.

### 2. LES 3 CORRECTIONS PIXEL du cobaye (taille/lisibilite — feedback Aziz sur v5)
Dans `TealAssemblyEtat3.tsx` :
- (a) Le **"70" est encore trop petit** → l'agrandir (GPT confirmerait). Augmenter `w-[44%]` du bloc 70.
- (b) Le **trou du "0"** montre un blanc/damier residuel → nettoyer le detourage (re-Recraft le num70, ou masque) — alpha pas net dans le contre-poincon.
- (c) Le **picto "reserves du monde" trop petit** vs storyboard → agrandir `w-[15%]` du picto.
Methode : appliquer, re-render scale=1, comparer cote-a-cote (PAS de memoire). Source des bonnes valeurs =
re-diff GPT si besoin (1 passe).

### 3. SYSTEME (a cabler)
- Gate format phase 0 BLOQUANT dans `beat-session.py` (demander horizontal/vertical au depart → passe a `--ratio`).
- Eprouver WORKFLOW-DATAVIZ sur une VRAIE scene de prod (pas le cobaye).

## NE PAS PURGER
`src/projects/_rnd/cobaye-maroc-phosphate/` + `public/_rnd/cobaye-teal/` = reference vivante du workflow.
