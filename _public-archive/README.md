# _public-archive

Dossiers sortis de `public/` pour alléger la copie au render Remotion
(Remotion copie TOUT public/ à chaque render — 2.3 GB → friction).

Sortis le 2026-06-15 car AUCUNE compo active (`src/`, hors `_archive/`) ne les
référence — vérifié par grep staticFile + chemins :
- `seedance/` (300M) : utilisé seulement par scripts de génération + scripts/_archive
- `geoafrique/` (13M) : utilisé seulement par src/_archive/episodes-livres

Si un script en a besoin : restaurer avec `mv _public-archive/<dir> public/<dir>`.
NE PAS sortir `_carousel-test/` (utilisé par Root.tsx — carrousels Or/Thiaroye).
