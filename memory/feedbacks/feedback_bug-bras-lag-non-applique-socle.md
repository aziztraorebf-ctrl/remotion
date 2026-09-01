**Defaut du socle `StickFigure.tsx`, mesure le 2026-07-28.** `BRAS_LAG` (~0,35 rad) est exporte
et son commentaire explique precisement pourquoi il existe — empecher que jambes et bras
s'annulent au meme instant. **Mais `Figure` ne l'applique jamais** : ses bras automatiques valent
`-sin(a) * armSwing`, avec le **meme `a`** que les jambes.

Consequence mesuree : **~9 % de chaque cycle** est degenere (`|swing| < 3°` ET `|bras| < 3°`),
soit **62 a 84 frames sur 720 par marcheur**. Le personnage se lit alors comme un simple trait
vertical surmonte d'une tete. Avec 8 marcheurs dephases, il y en a quasi toujours un dedans.

**Why:** ca touche potentiellement TOUTES les scenes stick figure existantes, pas seulement
celle du port. Le defaut est d'autant plus sournois qu'il ne se voit ni au code (le socle
documente la parade, on croit qu'elle est active) ni sur une frame isolee — seulement en
regardant une foule en mouvement.

**How to apply:**
- **Parade cote APPELANT** : passer `arm1Deg`/`arm2Deg` explicitement, dephases de `BRAS_LAG`,
  en **soustrayant le `torso`** que `Figure` ré-ajoute aux angles manuels (sinon un personnage
  penche voit ses bras deriver de l'angle du buste).
- ⛔ **NE PAS corriger par un plancher dur sur le swing** : ca ecrase l'oscillation des jambes
  et produit un glissement — anti-pattern deja documente dans le socle.
- Cas particulier des porteurs (`armSwing` faible ~10) : le dephasage ne suffit pas. Leur donner
  la **pose de quelqu'un qui porte** (bras maintenus ~14° en avant) — hors de la verticale en
  permanence, et narrativement juste.
- ⚠️ Le CODE du socle n'a **pas** ete modifie (les 6 planches validees ne sont pas recablees
  dessus, decision Aziz) — seul un **avertissement en commentaire** a ete ajoute en tete de
  `StickFigure.tsx`, **dans les DEUX copies** (worktree `remotion-cfa` branche
  `rnd/stick-figures-gestes` + repo principal branche `rnd/port-decor-scene-vivante`,
  synchronisees le 2026-07-28, `diff` vide). Si on decide un jour de corriger le socle lui-meme,
  il faudra revalider les 6 planches — **et le faire dans les deux copies**.

Lie : [[brique-habillage-stick-figure]] · [[STICK-FIGURE-INDEX]].
