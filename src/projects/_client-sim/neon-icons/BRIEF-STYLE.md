# STYLE A RESPECTER — pictogramme "neon au trait"

Tu produis UN pictogramme SVG dans un style NEON AU TRAIT, destine a etre pose
sur un fond VIDEO NOIR.

## Regles de forme (non negociables)
- Dessin AU TRAIT CONTINU uniquement. AUCUN aplat, AUCUNE surface remplie.
  Chaque forme est un `stroke`, jamais un `fill` (fill="none" partout).
- Trait d'epaisseur REGULIERE et constante sur tout le dessin (stroke-width identique).
- `stroke-linecap="round"` et `stroke-linejoin="round"` partout : les extremites
  sont arrondies, comme un tube de verre.
- Couleur du trait : BLANC PUR `#ffffff` exclusivement. Aucune autre couleur.
- Fond : TRANSPARENT. Ne dessine AUCUN rectangle de fond, aucun fond noir.
- Le dessin doit rester lisible tres petit : formes simples, peu de details,
  pas de micro-ornements.

## Regles techniques (non negociables)
- `viewBox="0 0 512 512"`, dessin centre, avec une marge de ~60 unites tout autour
  (le halo sera ajoute plus tard par le code et a besoin de cette marge).
- Chaque partie distincte du dessin est un `<g>` avec un attribut `id` EXPLICITE
  en anglais et en minuscules (ex: id="thumb", id="fist", id="motion-lines").
  ⛔ JAMAIS d'id automatique du type "path-12", "layer1", "g847".
  Ces id servent a ANIMER chaque partie separement : nomme-les par ce qu'ils
  REPRESENTENT, pas par leur ordre d'apparition.
- N'utilise PAS de filtre SVG (`<filter>`, `feGaussianBlur`), PAS de `<defs>`,
  PAS de degrade, PAS de masque, PAS de `<use>`, PAS de `<image>`, PAS de CSS.
  Le halo lumineux N'EST PAS de ton ressort : il est recree par le code.
  Tu ne fournis QUE le tracé nu.
- Pas de `<style>`, pas d'attribut `class` : les attributs sont poses directement
  sur chaque element.
