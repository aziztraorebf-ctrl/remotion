# Inserts = Pattern Interrupts visuels (accompagnent la narration)

> Migré depuis auto-memory 2026-08-31 (décision Aziz 2026-05-02, épisodes Atlas GeoAfrique
> désormais archivés). Règle fondamentale sur le rôle des inserts, non retrouvée détaillée ailleurs
> dans le repo malgré plusieurs références au concept.

Les inserts **accompagnent la narration** — ils ne la remplacent pas et n'ajoutent pas de durée.

**Règle :** pendant un insert, la narration continue de jouer. La carte disparaît momentanément et cède la place à un visuel fort (objet, chiffre, schéma). La carte revient ensuite pour ancrer géographiquement.

**Fréquence :** chaque segment de la vidéo doit avoir au moins un insert. Les commencer dès le segment 1 (pas attendre le segment 2). Plus tôt = plus d'impact.

**Durée typique :** 4-8s par insert.

**Implémentation Remotion :** chaque insert = `<Sequence>` indépendante qui s'overlay sur la composition principale. Pas de audio séparé nécessaire (sauf décision contraire).

**Pourquoi :** les inserts sont le "pattern interrupt" le plus fort de la vidéo. Ils empêchent la monotonie d'une carte continue, renforcent les chiffres clés visuellement, et maintiennent l'attention du public général sur une vidéo dense.

**Anti-pattern à éviter :** ne pas penser aux inserts comme des "compléments post-narration" avec leur propre audio séparé (vécu sur des inserts dataviz ajoutés après coup, désynchronisés du flux). Les intégrer dès la conception du storyboard/timing.ts — narration principale continue, visuels swappent.

---

## Technique "insert écran de fumée" (validée S3 Shaka Zulu — 2026-05-02)

Un insert sombre (overlay `rgba(13,13,13,0.88)`) qui cache la carte pendant 5-7s = **temps de grâce pour changer les couleurs de territoire sans timing précis au frame**.

**Pattern :**
1. Insert sombre apparaît (ex: bar chart ARMÉE ZULU)
2. Pendant que l'insert est visible, les `lerpColor()` des pays avancent librement
3. Quand la carte réapparaît, le spectateur voit le résultat final illuminé
4. Le spectateur ne voit jamais la transition brute des couleurs

**Implémentation :** L'insert est une `<Sequence>` indépendante avec `background: rgba(13,13,13,0.88)`. Les calculs `lerpColor()` continuent en arrière-plan pendant l'insert (le frame Remotion avance).

**Why:** Aziz a nommé et validé cette technique ("technique 'insert écran de fumée'") en voyant S3 Shaka Zulu rendu avec audio. "C'est excellent, je valide."

**How to apply:** Réutilisable dans tout épisode avec carte animée pour tout changement de palette de territoire (conquête, deuil, renaissance). L'insert peut être un bar chart, une citation, un objet iconique, ou même un fond noir simple. Durée minimale 5s pour que les transitions de couleur soient invisibles. Voir aussi `memory/feedbacks/feedback_atlas-walk-cycle-pattern.md` pour un usage concret dans un pattern de walk cycle.
