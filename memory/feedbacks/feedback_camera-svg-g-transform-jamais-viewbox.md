# Mouvement de caméra en SVG — transformer le CONTENU dans un viewBox fixe, jamais animer le viewBox

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Un mouvement de camera EST possible en SVG sans rien casser : transformer le **contenu**
(`<g transform="translate(cx,cy) scale(k) translate(-cx,-cy)">`) a l'interieur d'un `viewBox` **FIXE**.
Ce qui casse, c'est d'animer le `viewBox` lui-meme.

**Why:** Aziz evitait les mouvements de camera en SVG ("ca fait sortir du cadre / ca cree des problemes").
La cause n'etait pas le SVG ni le type de mouvement (zoom vs travelling) : animer le `viewBox` deplace le
CADRE dans un monde fini, donc on decouvre le vide des qu'on va trop loin. Transformer le contenu dans un
cadre fixe fait rogner proprement par les bords du SVG — exactement comme une vraie camera. Prouve
2026-07-25 (Pull Back Reveal 3.1x sur `_rnd/neon-test/NeonSignTest16x9.tsx`, reproduction de la demo neon
Opus 5) : le recul de camera est ce qui transforme "une image qui s'anime" en "un plan de cinema".

**How to apply:**
- ✅ `<g transform>` sur le contenu · `viewBox` constant · scene construite PLUS LARGE que le cadre final
  (sinon on revele du vide — vrai quel que soit le substrat).
- ❌ ne jamais animer `viewBox={...}`.
- ⚠️ diviser les epaisseurs de trait par le zoom (`width / camScale`) sinon les traits grossissent ou
  maigrissent a l'ecran.
- Vaut pour TOUT mouvement (zoom, travelling lateral, pull back). Ce n'est pas le type de mouvement qui
  contraint, c'est la quantite de monde construit autour du cadre.
- Fiche detaillee : `src/projects/_shared/svg-library/techniques/neon-glow-reflet-trace.md` § CAMERA.

Lie a [[verifier-mouvement-video-pas-juste-frames-isolees]] : j'avais d'abord reproduit la demo en plan
FIXE parce que je l'avais jugee sur des frames isolees au lieu de suivre le mouvement — c'est Aziz qui a
repere le gros plan initial et le recul de camera.
