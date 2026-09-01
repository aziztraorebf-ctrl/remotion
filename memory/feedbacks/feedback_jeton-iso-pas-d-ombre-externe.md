# Ombre d'un objet pose sur une carte : selon qu'il a une ombre NATIVE ou pas

Diagnostic d'Aziz (2026-07-18, R&D D3 16:9), confirme par render : un objet qui "flotte" au-dessus
de la carte au lieu d'y etre pose, ce n'est PAS le moteur (D3 vs Mapbox) — c'est l'OMBRE en trop.

**Regle :**
- **Objet iso ILLUSTRE** (base militaire, batiment, vehicule, jeton dessine en 2.5D top-down) : il a
  DEJA son ombre portee dessinee dans l'illustration (ex : les sacs de sable de `base-fr-td.png`
  projettent leur ombre sur le sol dans l'image). -> **NE PAS ajouter d'ombre externe** (ellipse floue /
  feGaussianBlur / boxShadow). Une ombre ajoutee cree une SEPARATION objet/ombre = illusion de levitation.
  L'objet s'ancre par sa propre ombre native.
- **Buste / medaillon / pastille** (portrait sans ombre native, ex `jeton-fama.png` clippe dans un cercle) :
  PAS d'ombre native -> **ombre externe REQUISE** pour l'asseoir (double niveau = ombre du disque
  boxShadow + ombre sol floue decalee, cf compositing Mapbox `Partie4Cout` l.907-925).

**Why :** teste cote a cote sur la meme carte D3 (proto `JetonsComparatif16x9`) : la base FR avec ombre
floue externe = flotte ; SANS ombre externe = posee nettement mieux. Le buste, lui, a besoin de son ombre.

**How to apply :** avant de poser un asset sur une carte (D3 ou Mapbox), regarder s'il a une ombre
DESSINEE. Oui -> zero ombre ajoutee. Non -> ombre externe (idealement 2 niveaux). Ne jamais mettre une
ombre "par reflexe" sur tout sprite.

**Corollaire (vraie diff D3 vs Mapbox residuelle)** : le compositing des objets/jetons est IDENTIQUE
en D3 et Mapbox (meme SVG/CSS). La seule vraie difference est le SOL : Mapbox pose sur un terrain raster
texture (l'objet s'y fond), D3 pose sur un aplat de couleur uni. Adressable en enrichissant le polygone
(degrade radial + grain + ombre interne), pas encore teste. Lie a [[feedback_layout-flex-jamais-positions-absolues-au-juge]].
Contexte D3 16:9 : voir `src/projects/_rnd/d3-16x9/README.md` + `memory/NEXT-ACTION.md` § R&D D3 en 16:9.

---

**Corollaire TAILLE — objet posé sur globe D3 = PROPORTIONNEL au globe, jamais taille écran fixe (2026-07-21, Acte 4 Soudan, navire Port-Soudan).** Un objet posé sur la carte (navire) doit DÉRIVER sa taille de `cam.scaleMul` (le zoom courant de `globeCamera`), pas d'une échelle écran constante — sinon il paraît normal au zoom serré puis devient GIGANTESQUE quand la caméra dézoome (le globe rétrécit sous un objet qui garde sa taille écran). Recette : calibrer sur UN zoom de référence (ex `NAVIRE_CALIB_SCALE = 3.4` = zoom Port-Soudan), puis `scale = baseScale * (camScale / CALIB) * reveal`, et l'offset de position aussi (`x + dx*(camScale/CALIB)`). Généralise R-OBJ-1 (`[[feedback_...]]` / WARMAP-ANIMER-OBJETS) au registre globe. ⚠️ Distinct des JETONS-VISAGES (portraits) qui, eux, restent souvent à taille ÉCRAN constante (lisibilité du visage) — la règle proportionnelle vaut pour les objets/véhicules ancrés au sol, pas les médaillons d'identification.

**Corollaire CYCLE DE VIE — un jeton qui "revient" après sa sortie = bug à 2 causes (2026-07-21, Acte 4 Kosti).** Un jeton censé disparaître (civils après la frappe) qui semble "revenir" à sa place : (a) l'`idle` sinusoïdal (respiration/float) continue de tourner après l'extinction → il oscille ; (b) l'opacité résiduelle reste à 0.1 au lieu de 0. **Fix** : une fois éteint → FIGER la position sur la frame d'extinction (frame gelée dans l'interpolate de fuite) + `idle = dead ? 0 : sin(...)` + opacité → 0 TOTALE + `return null` quand invisible (pas juste opacity:0). Un objet mort ne bouge plus, ne dérive plus, ne revient jamais. Généralise le scale-figé (sprite bitmap) à la POSITION et au cycle de vie complet.
