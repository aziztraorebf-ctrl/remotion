# GRILLE DE JUGEMENT — mid-form SVG narratif

> Créée le 2026-07-29. **Baseline = Franc CFA mid-form v3** (4 min 28, 8 beats, SVG encre/nuit).
> Origine : double review downstream (Gemini 3.1 Pro + Kimi K2.5, vidéo complète, briefs
> indépendants) sur la **première vidéo de ce format** — donc sans version antérieure pour la
> comparer. L'écart mesuré est celui qui nous sépare des références externes (Bloomberg, FT,
> The Economist, Vox, Kurzgesagt, Al Jazeera carto), pas de nous-mêmes.
>
> ⭐ **À quoi ça sert** : juger les prochains mid-forms sur des critères stables plutôt qu'à
> l'impression. Une liste de retouches s'épuise avec une vidéo ; une grille se réutilise.
>
> ⛔ **Les notes ci-dessous ne sont pas un verdict, c'est un POINT DE DÉPART.** Elles viennent de
> deux LLM (signal, jamais juge) et n'ont de valeur que **relative** : ce qui compte est la
> hiérarchie (où est notre force, où est notre marge), pas le chiffre absolu.

---

## Les 7 critères

Chaque critère est **observable** : on doit pouvoir répondre en regardant la vidéo ou en
cherchant dans le code. Les critères-vœux (« être captivant ») sont exclus par construction.

| # | Critère | Ce que ça mesure | Comment on l'observe | Baseline CFA v3 |
|---|---|---|---|---|
| 1 | **Précision métaphorique** | L'objet visuel dit-il immédiatement le concept économique ? | Montrer un plan hors contexte : la métaphore se comprend-elle ? | **8/10** ⭐ notre force (funambule, cadenas, filet, balance) |
| 2 | **Autonomie sémantique** | Part du sens portée par l'IMAGE seule | ⭐ **Projection MUETTE** : quelles idées restent sans la voix ? | **4/10** ⚠️ à vérifier nous-mêmes (cf. chantier ouvert) |
| 3 | **Densité cinétique** | Ratio mouvement intentionnel / attente statique | ⭐ **Mesure automatisable** : différence moyenne entre frames par seconde ; un creux = < 35 % de la médiane pendant ≥ 2 s | **5/10** — 17 fenêtres molles mesurées, la plus longue 6 s |
| 4 | **Plasticité du mouvement** | Les objets ont-ils du poids ? (anticipation, inertie, dépassement) | Chercher `spring()` vs `interpolate()` linéaire sur les gestes porteurs | **4/10** |
| 5 | **Texture matérielle** | Grain, lumière, profondeur — l'anti « vectoriel plat » | ⭐ `grep feTurbulence\|grain\|drop-shadow` : présent ou absent | **2/10** ⚠️ notre marge n°1 (aucun grain nulle part, vérifié) |
| 6 | **Hiérarchie focale** | L'œil va-t-il où il doit, à chaque instant ? | Un plan = un sujet dominant ? Deux éléments se disputent-ils l'attention ? | **6/10** |
| 7 | **Intention du mouvement** | Chaque déplacement dit-il qui fait quoi pourquoi ? | Repérer tout objet qui glisse « parce que c'est joli » | **6/10** — règle déjà en doctrine (objet inerte ne glisse jamais) |

### Lecture de la baseline

**Nos forces** : la métaphore et la lisibilité (1, 6, 7). Les deux modèles convergent : c'est ce
qu'il faut **ne pas** toucher.

**Notre marge** : la **matière** (5) et le **poids** (4). Convergence des deux modèles ET
confirmation par le code. C'est là que le travail paie.

**Le critère à creuser** : l'**autonomie sémantique** (2). Kimi la note 4/10 (« la voix porte 70 %
du sens »). Si c'est vrai, c'est plus structurant qu'un problème de grain : ça touche la
conception des scènes, pas leur finition. ⚠️ **Non vérifié de notre côté** — le test (projeter en
muet et lister ce qui reste) coûte 5 minutes et n'a pas été fait.

---

## ⛔ Comment se servir de cette grille (et comment NE PAS s'en servir)

1. **Vérifier chaque affirmation d'un modèle contre le code ou la mesure AVANT de l'appliquer.**
   Éprouvé le 2026-07-29 : sur les 6 points des deux TOP 3, **3 étaient faux** —
   · Gemini plaçait 2 « temps morts » là où la mesure objective montre les passages **les plus
     animés** du film ;
   · Kimi décrivait le funambule en « translation linéaire » alors qu'il suit une **Bézier
     quadratique** avec cycle de marche et bob vertical ;
   · Kimi proposait d'animer les signatures de 1994 « au lieu du fondu » — elles se **tracent
     déjà** par des plumes, avec pulse du papier.
   Une proposition non vérifiée fait *ajouter ce qui existe déjà*, ou corriger un défaut absent.

2. **Ne pas confondre convergence et vérité.** Les deux modèles ont convergé sur le grain — mais
   ils avaient le même brief décrivant notre stack, donc la convergence est en partie **induite**.
   Ce qui a rendu ce point solide, ce n'est pas qu'ils soient deux : c'est que `grep feTurbulence`
   revient vide. Cf. [[feedback_convergence-modeles-vaut-le-critere-donne]].

3. **Cadrer le brief en mode PREMIUM, pas en chasse aux bugs.** Premier appel raté le 2026-07-29
   pour cette raison : brief orienté « qu'est-ce qui cloche » sur une vidéo validée → il a cherché
   une cicatrice de coupe inexistante. Le bon mandat : « elle est bonne, comment devient-elle
   excellente, dans notre stack, sans rien refaire ni rallonger ».

4. **Joindre TOUJOURS le stack et les interdits** (pas de 3D, pas de photo, ⛔ pas de texte à
   l'écran, pas de rallonge). Sans ça, la moitié des propositions est inutilisable.

5. **Dire que la version est SANS MUSIQUE** et l'exclure explicitement. Un LLM n'évalue pas la
   musique ; sans cette consigne il occupe l'appel à signaler son absence.

6. **Exiger des notes non aplaties.** Gemini a spontanément « compressé vers le centre » ses
   notes, ce qui les rend inutilisables en absolu. Kimi, à qui c'était interdit, a produit des
   2/10 et des 9/10 — beaucoup plus exploitable.

---

## Outils

- `scripts/tools/gemini-video-review-custom.py` — Gemini 3.1 Pro, vidéo complète, brief libre.
- `scripts/tools/kimi-video-review-custom.py` — **créé le 2026-07-29**, équivalent Kimi
  (mono-vidéo à brief libre ; il n'existait que la variante comparative 2-vidéos). Contraintes
  API : base64 obligatoire, Moonshot direct, `temperature=1`, `max_tokens ≥ 16000`.
  ⛔ Downscaler à ~960×540 avant l'appel (le base64 gonfle de 33 %).
- **Mesure de densité cinétique** (critère 3), reproductible : extraire à 4 fps en 96×54 niveaux
  de gris, calculer la différence moyenne entre frames consécutives, agréger par seconde, et
  repérer les fenêtres ≥ 2 s sous 35 % de la médiane. C'est ce qui a démasqué les faux timecodes
  de Gemini.

---

## 🚧 Chantiers ouverts sur la grille

- **Tester l'autonomie sémantique nous-mêmes** (critère 2) : projeter la v3 en muet, lister ce qui
  reste. C'est le critère le plus structurant et le seul dont la note vient d'une seule source.
- **Automatiser les critères mesurables** (3 et 5 le sont déjà ; 4 pourrait l'être par un grep
  `interpolate` linéaire sur les gestes porteurs) — dans l'esprit de `dataviz-selfreview.py`,
  qui a remplacé un score LLM par des assertions déterministes.
- **Valider la grille sur une 2e vidéo.** Tant qu'elle n'a servi qu'au CFA, ses seuils sont des
  hypothèses, pas une norme.
