Générer plusieurs variantes/poses/assets d'un même sujet en appels LLM séparés casse la cohérence
(couleurs, proportions) — toujours générer en UN SEUL appel avec description figée explicite.

Quand un LLM doit produire plusieurs variantes d'un même sujet (poses d'un personnage, déclinaisons d'un
logo, frames d'un storyboard, set d'icônes), NE JAMAIS faire des appels séparés un par un — le modèle n'a
pas de mémoire cross-appel et réinvente les détails (couleurs, proportions, style) à chaque génération.
TOUJOURS générer toutes les variantes dans **un seul appel/prompt**, avec une description du sujet **figée
explicitement** (valeurs hex précises, mesures numériques, et une phrase du type « this is the SAME X in
different states/poses, not N different X »).

**Why** : prouvé positivement ET négativement dans la même session (PERSONNAGE-VIVANT-INDEX, session
2026-07-02, personnage-vivant-svg). Une pose "squat" générée par un appel Gemini séparé (sans référence de
couleur donnée) a produit un personnage visuellement différent — peau plus sombre, chemise/pantalon/chapeau
d'une autre teinte — détecté par Aziz à l'œil, confirmé par grep exact des couleurs hex sur les fichiers
SVG. À l'inverse, un set de 5 poses généré en un seul appel avec 6 couleurs hex explicites données dans le
prompt + la consigne "même personnage" a produit des couleurs **strictement identiques** sur les 5 fichiers
(vérifié par grep, pas supposé). L'échec n'était pas dans la qualité du prompt individuel de la pose ratée
— c'était l'absence de mémoire du modèle entre deux appels indépendants. La solution est structurelle (1
appel), pas un meilleur prompt.

**How to apply** : dès qu'une tâche demande au LLM plusieurs sorties censées représenter le même sujet
(personnage multi-pose, palette de couleurs cohérente sur plusieurs assets, storyboard multi-frame, jeu
d'icônes uniforme) — grouper en un seul appel avec description figée, jamais demander pose par pose ou
asset par asset dans des appels distincts. Si un appel séparé est inévitable (contrainte de longueur de
prompt, etc.), donner explicitement en référence les valeurs exactes (couleurs, dimensions) utilisées dans
les appels précédents, pas une simple description verbale du style.

Lié depuis `memory/doctrines/SVG-SCENES-GENERATIVES.md` (wikilink `[[llm-generation-multi-variantes-figer-description]]`)
— ce fichier comblait un lien mort dans le repo.

---
Migré depuis auto-memory (`feedback_llm-generation-multi-variantes-figer-description.md`) le 2026-08-31, contenu original inchangé.
