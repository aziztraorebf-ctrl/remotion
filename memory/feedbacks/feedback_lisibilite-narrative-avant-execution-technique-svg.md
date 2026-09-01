# Concept d'insert SVG — juger sur lisibilité narrative sans légende AVANT qualité d'exécution technique

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Pour juger un CONCEPT d'insert graphique/SVG généré par IA (pas une carte, un schéma/insert abstrait
type jauge, veine, mécanisme), la LISIBILITÉ NARRATIVE (peut-on comprendre l'intention/la cause→effet
SANS légende ni contexte préalable ?) doit primer sur la qualité d'exécution technique.

**Why:** Cas vécu Soudan Acte 3, insert `Beat1Paradoxe` (2026-07-11). Concept B (une veine dorée qui se
scinde en 2 bras + jauges circulaires oscillantes) avait un code plus propre et un meilleur rendu
technique face à Gemini 3.1 Pro, et a été choisi en premier sur ce critère. Il a ensuite été REJETÉ par
Aziz après review : "pas assez narratif, dur à comprendre sans légende, 2 cercles R/S + une ligne,
pourquoi ?" Concept A (une jauge qui fuit visiblement + 2 tuyaux R/S qui rechargent + un filet gris
mystère qui s'inverse) a été adopté à la place — chaque phase y a un geste CAUSE→EFFET lisible seul,
sans connaître le script au préalable.

**How to apply:** Avant de choisir entre 2 concepts d'insert générés par IA (ou de valider le premier
proposé), se demander : "si quelqu'un voit cette frame sans avoir lu le script, comprend-il ce qui se
passe et pourquoi ?" Un concept magnifiquement codé mais qui ne raconte rien tout seul doit être rejeté,
même face à un concurrent moins abouti techniquement.

## Workflow validé pour storyboard→SVG narratif

1. Tenter un storyboard IMAGE d'abord (Gemini image-gen) — repère vite si le concept implique des
   silhouettes/personnages articulés non codables simplement en SVG/Remotion (interpolate/spring).
2. Si l'image montre des formes non codables → rejeter, faire proposer 2 concepts alternatifs par 2
   agents TEXTE indépendants (pas de génération d'image, juste une proposition de mise en scène décrite).
3. Choisir entre les 2 concepts sur la LISIBILITÉ NARRATIVE, jamais sur la richesse visuelle décrite.
4. Générer le code SVG du concept choisi via GPT-5.6 Sol de préférence (bat Gemini 3.1 Pro sur le
   registre "schéma composé riche" — voir [[openrouter-svg]]), en JSON structuré
   `{"scene": "<g>...", "notes": "..."}` où `scene` est du JSX directement collable.
5. TOUJOURS rendre et comparer le RENDU RÉEL (screenshots à plusieurs frames-clés), jamais juger sur le
   JSON/code brut — le code peut sembler correct et donner un rendu décevant ou l'inverse.
6. Pour une révision suite à un retour d'un reviewer externe (ex. Gemini vision qui commente le rendu) :
   faire une révision CIBLÉE à partir du code EXISTANT (donner le code complet dans le prompt de
   révision), jamais une regénération de zéro. Vérifier chaque point du retour contre le réel avant de
   l'appliquer — le reviewer peut halluciner ou juger sur une perception différente du code réel (ex :
   Gemini avait jugé une couleur "terne" alors qu'elle était déjà la couleur dorée officielle du projet,
   `#D4A574`/`GOLD`, vérifiée dans le code).
