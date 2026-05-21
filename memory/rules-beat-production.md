# Règles Beat Production — CHARGÉES PAR HOOK (NON-NEGOTIABLE)

> Ce fichier est lu mécaniquement avant tout Write/Edit sur un Beat*.tsx.
> 10 règles. Si une est violée = le beat n'est pas prêt à être codé.

---

## R1 — RYTHME (la plus importante)
**Max 8 secondes sans changement visible à l'écran.**
"Changement" = nouvelle animation d'entrée, nouveau composant, nouveau texte, nouveau stat, nouveau template.
Un beat de 20s = minimum 3 événements visuels distincts. Permanent motion (pulse, drift) ne compte PAS.

## R2 — STORYBOARD VISUEL OBLIGATOIRE
Avant de coder un beat, un storyboard visuel Gemini 3.1-pro-preview doit exister.
Fichier requis : `src/projects/<episode>/storyboard/beat<N>-storyboard.md`
Ce storyboard valide R1 (rythme) avant que le code commence.

## R3 — LIRE LES COMPOSANTS _SHARED/ AVANT DE CODER
Avant tout nouveau Beat*.tsx : lire TOUS les composants dans `src/projects/_shared/components/layouts/` et `inserts/`.
Jamais recréer from scratch ce qui existe. Si le composant existant ne convient pas → créer un nouveau et l'ajouter à _shared/.
Flag requis : `/tmp/shared-components-read` doit exister (créé par le hook après lecture).

## R4 — GEMINI 3.1-pro-preview HARDCODÉ pour reviews
Modèle review : `gemini-2.5-flash` avec `thinking_budget=0` uniquement si 3.1-pro-preview timeout.
Jamais utiliser gemini-2.5-pro, gemini-2.5-flash par défaut, ou tout autre modèle sans raison documentée.
Score minimum pour valider un beat : **8.5/10**.

## R5 — AUDIO-DERIVED TIMING OBLIGATOIRE
Chaque trigger d'animation = `SEG.xxx.start` ou `SEG.xxx.end` depuis manifest.ts.
Jamais hardcoder un numéro de frame (ex: `frame - 60`). Exception : offsets relatifs court (<15f) pour stagger.

## R6 — TAILWIND TOKENS POUR COULEURS/TYPO/SPACING
Jamais `color: "#c8a951"` inline. Toujours `text-gold`, `bg-navy`, `text-ivory`, etc.
Lire `tailwind.config.ts` tokens AVANT d'écrire une seule classe de couleur.

## R7 — PERMANENT MOTION dans tout composant custom
Tout composant custom doit avoir au moins un élément en mouvement continu (pas juste l'entrée).
Options : pulse SVG, drift lent, countup progressif, scan line, particle slow.

## R8 — REVIEW PROPRE AVANT PRÉSENTATION
Avant de présenter un render à Aziz :
1. Extraire 5 frames avec downscale-for-review.sh
2. Lire chaque frame visuellement
3. Vérifier rythme (R1) sur timeline frames
4. Lancer review Gemini 3.1-pro-preview
5. Score ≥ 8.5 → présenter. Score < 8.5 → corriger et re-render.

## R9 — BEAT DURATION = AUDIO + 30f MAX
`BEAT_DURATION = SEG.xxx_end.end - SEG.xxx_start.start + 30`
Ne jamais ajouter de marge arbitraire >30 frames. L'overlap avec le beat suivant se gère dans la composition finale.

## R10 — NO EMOJIS IN CODE
Interdit dans tout fichier .ts, .tsx, .js, .json, .yaml, .sh
Autorisé uniquement dans .md, .txt
