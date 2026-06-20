# ⭐ REPRISE — Workflow Data-viz (point de continuite, session 2026-06-20 → suivante)

> Ouvre la prochaine session, dis "continue" : ce fichier dit TOUT (etat, liens A→Z, quoi corriger,
> comment relancer). Aziz n'a RIEN a repeter. Doctrine du systeme : [[WORKFLOW-DATAVIZ]].

## ETAT EXACT (mis a jour 2026-06-20 fin de session — MERGE DANS MASTER)
Le **workflow data-viz complet est PROUVE et MERGE DANS MASTER** le 2026-06-20. Pipeline grave dans
[[WORKFLOW-DATAVIZ]] (storyboard → breakdown GPT-5.5 → generation Gemini → detourage Recraft → assemblage
Remotion → diff). Cobaye de preuve : Maroc phosphate "70% des reserves mondiales", etat "l'ecrasement".
✅ **Render final = v9** (valide Aziz "tres fidele au storyboard") : `public/_rnd/cobaye-teal/render-v9-FINAL-EXEMPLE.png`.
   v9 = exemple de reference (le niveau a atteindre DES LE 1er COUP). Diff matiere applique (palette desaturee chaude).
✅ **Systeme VALIDE 2x PAR AGENT VIERGE** :
   1. agent vierge etape DIFF (verdict PARTIEL → 4 trous combles)
   2. **TEST ULTIME** : agent vierge ISOLE en worktree (v9 cache), bout-en-bout (breakdown→regen assets→assemblage
      →diff) DU 1er COUP = ~86% de fidelite. Methode : [[methode-test-reproductibilite-agent-vierge]].
   Trou CRITIQUE trouve : `openrouter-vision-breakdown.py` n'etait PAS versionne (script fantome) → corrige.
⚠️ **FAIBLESSE RECURRENTE restante** : le picto+label "reserves mondiales" sort TOUJOURS trop petit (2x : cobaye
   ET agent). A CREUSER (pourquoi). La BARRE phosphate, elle, est un POINT FORT (bonne du 1er coup). Detail : [[WORKFLOW-DATAVIZ]].

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

## CE QUI A ETE FAIT (session 2026-06-20, 2e passe)

### 1. ✅ AGENT VIERGE DE VALIDATION — LANCE, verdict PARTIEL
Un agent `general-purpose` au contexte frais a reproduit l'etape DIFF a froid. Verdict : pipeline tourne de bout
en bout MAIS forcait a deviner. **4 trous de doctrine identifies ET COMBLES** :
- (1) Commande etape 6 incomplete (manquait `--prompt-file` + `--output`) → corrige dans [[WORKFLOW-DATAVIZ]] etape 6.
- (2) Crop cible : aucune coordonnee + il NE FAUT PAS inclure le bandeau d'annotation (titre/timer) — sinon les %
  verticaux ET le ratio picto/70 sont BIAISES (cause prouvee du picto rendu trop petit). → recette gravee.
- (3) Exclusion annotations absente du template → ajoutee dans `templates/PROMPT-DIFF-CIBLE-RENDER.txt`.
- (4) Le diff GPT NE VOIT PAS l'alpha (trou du 0 mal detoure invisible au diff) → documente, inspection alpha = controle separe.

### 2. ✅ LES 3 CORRECTIONS PIXEL — FAITES + verifiees cote-a-cote (render v8)
- (a) "70" agrandi + remonte (`left-[26%] top-[16%] w-[40%] h-[56%]`) → domine la compo comme la cible.
- (b) trou du "0" : nettoye par FLOOD-FILL alpha local (Recraft avait laisse du blanc opaque dans le contre-poincon ;
  le diff GPT ne l'aurait jamais vu). Backup : `num70-backup-avant-trou.png`.
- (c) picto agrandi `w-[16%]` + label `text-[52px]` → ⚠️ L'OEIL D'AZIZ a prime sur la mesure GPT (12%, biaisee par
  le bandeau). Preuve vivante de la regle d'or : verifier cote-a-cote, l'oeil prime sur la mesure si la planche le contredit.
+ tout le reste du diff GPT applique (barre gap-0, segment, fleches h-34%, source, cartouche).

## CE QU'IL RESTE (optionnel / future session)
- **Gate format phase 0** : NON urgent — `gemini-storyboard-panels.py` gere DEJA `--ratio` (defaut 16:9 horizontal +
  warning bloquant dans le prompt). Un gate dans `beat-session.py` ferait DOUBLON. Confort, pas dette.
- **Eprouver WORKFLOW-DATAVIZ sur une VRAIE scene de prod** (pas le cobaye) = le vrai prochain pas.

## NE PAS PURGER
`src/projects/_rnd/cobaye-maroc-phosphate/` + `public/_rnd/cobaye-teal/` = reference vivante du workflow.
