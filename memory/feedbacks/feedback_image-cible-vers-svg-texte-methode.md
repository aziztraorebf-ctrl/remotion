# Pipeline image-cible -> SVG texte (validé session Khartoum, 2026-07-05/06)

Quand un prototype codé à la main (positions/timing/logique prouvés, esthétique brute) doit être
poussé en qualité visuelle premium sans perdre la structure animable groupe-par-groupe :

1. Coder le prototype simple d'abord (fonctionnel, pas beau).
2. Render UNE frame propre comme image de référence de composition.
3. Écrire un prompt qui sépare explicitement contraintes FONCTIONNELLES (positions relatives,
   labels, palette, cadre général) vs liberté créative TOTALE sur l'exécution — **ne pas trop
   verrouiller** ("garde exactement ce contour" tue la créativité ; "garde la fonction, invente
   la forme" la libère). Un 1er essai trop bridé a dû être corrigé après retour explicite d'Aziz.
4. Envoyer la MÊME frame + prompt à 2 modèles en parallèle pour comparaison directe.
5. Si le format voulu est du SVG **animable** (pas juste une belle image) : demander explicitement
   "output raw SVG markup, not a rendered bitmap image" — sinon les modèles génèrent une image
   bitmap qui *ressemble* à du SVG mais n'en est pas (vérifié : Gemini a renvoyé un JPEG,
   GPT un PNG bitmap, malgré un prompt qui parlait de "SVG-looking illustration"). Demander aussi
   des groupes `<g id="...">` nommés pour l'animation ultérieure par élément.
6. Pour la génération SVG texte : `gemini-vision-breakdown.py` a un `max_output_tokens=8000` par
   défaut TROP BAS pour un SVG détaillé (tronque silencieusement, ex. 784 caractères au lieu de
   ~11000) → utiliser `gemini-vision-breakdown-highoutput.py` (32000 tokens) quand la sortie
   attendue est un SVG long. `openrouter-vision-breakdown.py --model openai/gpt-5.5` n'a pas ce
   problème mais peut mettre plusieurs minutes (prévoir un timeout généreux, >180s).
7. **Vérifier que c'est du vrai vecteur** avant de juger : `rsvg-convert -w W -h H in.svg -o out.png`
   (moteur de rendu SVG pur, pas de tolérance si le fichier est invalide) — ne pas se fier à
   l'apparence seule.

**Why:** Aziz a demandé "est-ce vraiment du SVG ou une image cible ?" après avoir halluciné que 2
bitmaps générés (registre gravure très convaincant) étaient du vecteur animable. La vérification
factuelle (`file`, dimensions, format) a évité de partir coder une animation sur un fond qui n'était
qu'une image plate.

**How to apply:** Reproductible pour tout autre sujet nécessitant un fond illustré premium + structure
animable (pas seulement War-Map/Khartoum). Toujours comparer 2 modèles en parallèle sur le même
prompt — dans ce cas GPT (openai/gpt-5.5) a produit un résultat nettement plus riche que Gemini
(gradients, hachures, filtres feTurbulence, marqueurs de flèche réutilisables, rivière en 3 couches)
sur la génération SVG, alors que sur le mode bitmap les deux étaient plus comparables.
