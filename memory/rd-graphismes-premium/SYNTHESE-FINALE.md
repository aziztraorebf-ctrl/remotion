# R&D Graphismes Premium — Synthèse Finale
## Basée sur 3 recherches last30days — 2026-05-20
## Validée et corrigée par Aziz

---

## 1. Ce qu'on fait et pourquoi c'est bon

### La carte EST le B-roll
Les créateurs cartographiques de référence (Johnny Harris, Caspian Report, RealLifeLore) font des vidéos entières sans stock footage terrain. La carte animée remplace structurellement le B-roll. Notre approche Mapbox est donc non seulement valide — elle est la norme dans notre créneau.

**Conséquence** : le gap "B-roll" identifié en Recherche 3 ne s'applique pas à nous. On retire cette recommandation.

### Notre stack est en avance — confirmé publiquement
@rileybrown (1 926 likes sur X) a publié un guide complet "Create Motion Graphic Videos w/ Remotion Using GPT 5.5 inside Codex". Notre stack exact est devenu une référence publique. On n'est pas en retard, on est en avance.

@JJEnglert (638 likes) a abandonné After Effects pour Claude Code + Remotion. Le mouvement IA-first est en train de valider nos choix.

### Ce que nos concurrents utilisent (pour info, pas pour copier)
- GEOlayers 3 (AE) pour les cartes — notre Mapbox fait mieux
- Envato Elements ($16-49/mois) pour les templates — notre code custom est au-dessus
- Fiverr ($10-15/short) pour les parties complexes — on fait tout en interne

---

## 2. D'où vient le "premium" — la vraie réponse (3 recherches convergent)

Ce n'est pas la sophistication des outils. C'est **la cohérence du système visuel** appliquée avec discipline beat par beat.

Les 3 éléments qui font le premium (confirmés par toutes les recherches) :
1. **Fond texturé cohérent** — grain papier, SVG fractalNoise — notre SVGGrain ✅
2. **Typographie bold, fort contraste** — Bebas Neue, text-gold sur navy — notre Tailwind ✅
3. **Rythme visuel constant** — changement visible régulier — notre point de travail

---

## 3. La règle de rythme — version corrigée et validée

### Règle principale : 5-7 secondes
**Validée par Aziz.** La règle 3-5s des sources web s'applique au contenu vlog/TikTok rapide, pas au documentaire cartographique. Pour notre format :
- **5-7 secondes** entre chaque changement visuel significatif
- Mais "changement" inclut les micro-changements continus :
  - Une courbe qui monte progressivement
  - Un nouveau label qui apparaît sur la carte
  - Un badge qui fade in
  - Un chiffre CountUp qui progresse
  - Un trait de frontière qui se dessine

### Ce que ça implique en code Remotion
Le changement visuel n'est pas forcément un cut ou une nouvelle séquence. C'est tout élément qui bouge, apparaît, ou évolue dans le frame. Un beat bien conçu a toujours quelque chose en mouvement — même subtil.

**Anti-pattern à éviter** : une carte Mapbox statique pendant 8+ secondes sans aucun élément animé par-dessus (label, ring, CountUp, ligne).

### Pattern interrupt : toutes les 25-35 secondes
Validé Recherche 1. À ce moment : changement de registre net — musique, zoom, effet, cut de séquence.

---

## 4. Ce que les chaînes de référence font concrètement

| Chaîne | Style signature | Ce qu'on retient |
|--------|----------------|-----------------|
| Caspian Report | Carte quasi-fixe + narration lente | Notre Mapbox animé est déjà supérieur |
| Johnny Harris | Mapbox simple + texte | Notre profondeur éditoriale > le sien |
| RealLifeLore | Cartes + données + voix seule | Validation : zéro B-roll terrain nécessaire |
| Vox | Motion graphics bold + texte overlay | Notre Tailwind gold/navy = approche équivalente |

**Constat clé** : personne dans notre créneau ne combine cartes Mapbox animées + data-viz + voix-off premium sur l'Afrique. GéoAfrique occupe une niche non disputée.

---

## 5. Les règles applicables immédiatement

### Règles confirmées (à appliquer sur chaque beat)

**R1 — 5-7s max sans changement visible**
Glow et float passifs ne comptent pas. Il faut qu'un élément nouveau apparaisse, qu'une valeur change, qu'un label se révèle.

**R2 — Fond texturé sur TOUT**
Aucun panel avec fond noir pur ou flat uni. SVGGrain sur chaque AbsoluteFill navy.

**R3 — Stat à l'écran = simultané avec la voix-off**
Tout chiffre énoncé en voix-off doit apparaître à l'écran au même instant. Vérifier timing.ts frame par frame.

**R4 — Pattern interrupt à 25-35 secondes**
Dans chaque beat > 30 secondes : un cut de registre net à ce moment précis.

**R5 — Typographie bold, fort contraste**
text-gold sur navy, tailles larges, Bebas Neue pour les chiffres et titres. Jamais de texte petit ou gris sur fond sombre.

### Ce qu'on ne doit pas copier
- La carte statique de Caspian → notre Mapbox animé est déjà supérieur
- Les templates Envato à $16/mois → notre Remotion custom est au-dessus
- La complexité graphique inutile → 3 éléments simples bien exécutés > 10 effets brouillon
- Le stock footage terrain → la carte animée est notre B-roll

---

## 6. Signaux à surveiller (sans action immédiate)

- **AutoAE** — concurrent Remotion no-code émergent. À suivre.
- **Higgsfield + Gemini** — outil IA cinématique. Pertinent si on cherche un jour des effets de transition premium.
- **MapStory (arxiv 2505.21966)** — recherche académique ACM UIST 2026 sur la génération de cartes animées par LLM. Validation académique de notre approche. À citer si besoin de légitimité.

---

## 7. Ce qui reste ouvert

- Comment obtenir le "look cinématique" que font les chaînes premium avec leur fond texturé ? → Notre SVGGrain est la réponse. La question est le réglage fin (opacity, seed, baseFrequency).
- Comment GéoAfrique peut-il se différencier visuellement des cartes Caspian/Johnny Harris en 2026 ? → Mapbox style custom (Parchemin Mande, GéoAfrique dark) + data overlays animés + voix-off premium.

---

## Notes de validation Aziz (2026-05-20)
- ✅ Règle 5-7s validée (3-5s trop serré pour documentaire cartographique)
- ✅ B-roll stock footage non pertinent pour notre format — la carte est le B-roll
- ❌ Signal @flynnvision retiré — vidéo d'effets spéciaux génériques, pas de géo/cartes
- ✅ Fond texturé + typo bold = règles confirmées
- ✅ Notre stack Remotion + Mapbox = avantage technique réel
