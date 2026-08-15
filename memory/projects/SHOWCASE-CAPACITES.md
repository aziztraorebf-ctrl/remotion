# Showcase des capacités — vidéo démo du savoir-faire (lancé 2026-08-15)

> **Idée d'Aziz**, née d'un constat qu'il a formulé lui-même : *« nous en avons d'autres que même moi
> j'ai oublié qu'elles étaient disponibles »*. Le repo compte **640 compositions enregistrées** et
> **243 composants partagés** (mesuré 2026-08-15) — le catalogue existe en Markdown mais ne se
> CONSULTE pas. Une vidéo se revoit.

## Décisions prises (Aziz, 2026-08-15)

**Double usage, dans cet ordre** :
1. **Index visuel interne d'abord** — exhaustif, chaque brique nommée à l'écran, 3-4 min. Valeur
   immédiate : résout le « j'ai oublié ce qu'on a », se revoit avant de coder une scène.
2. **Cut vente ensuite**, extrait du même montage — 60-90 s, orienté prospects freelance.
   L'index sert de banc de montage ; rien n'est produit deux fois.

**Sélection PAR CAPACITÉ** (pas par projet, pas par techno) : 8-10 blocs, chacun prouvant une
capacité distincte, avec le MEILLEUR exemple de chaque. Une showcase qui **démontre** bat une
showcase qui **énumère** — 8 moments qui prouvent qu'on sait tout faire valent mieux que 25 qui
prouvent qu'on a beaucoup travaillé.

Une capacité se formule en langage non-technique (« un territoire prend une couleur », « la caméra
plonge du globe vers un point ») — ⛔ Mapbox / D3 / SVG sont des MOYENS, pas des capacités.

## ⚠️ Tension de positionnement — À TRANCHER avant le cut vente

Presque tout le matériau existant est **géopolitique africaine** (War-Map, gisements, flux d'or), or
la piste freelance vise le **SaaS / explainer / data-viz corporate**. Un prospect SaaS voyant 90 s de
War-Map Soudan pense « très beau, mais ce n'est pas mon domaine ».

Deux voies, non tranchées :
- **assumer le créneau « cartographie éditoriale/géopolitique »** — réellement différenciant, cf
  [freelance-dataviz-fiverr-pro](freelance-dataviz-fiverr-pro.md) ;
- **montrer les FORMES en masquant le sujet** — un flux entre deux points sert autant une chaîne
  d'approvisionnement qu'un gazoduc.

⭐ Remarque de fond : pour VENDRE, trois démos courtes disant chacune « je fais ça, très bien »
convertissent mieux qu'un objet unique disant « je fais tout ». L'index interne, lui, gagne à être
exhaustif — d'où l'ordre index → cut.

## Atout de départ

**Le matériau est déjà produit, rendu, validé, publié.** C'est un travail de MONTAGE et de SÉLECTION,
pas de création — quelques jours, pas quelques semaines. Sources : `out/PRET-PUBLICATION/` (~16 FINAL)
+ les compositions de `src/Root.tsx`.

## Garde-fous

- ⛔ **Ne jamais montrer un proto jamais rendu ou rejeté** — croiser avec la section « REJETS PROUVÉS »
  de `src/projects/_shared/INTENTION-FORME-INDEX.md` et grep `VERDICT`/`REJETÉ` avant d'inclure un
  plan (règle : [[feedback_lire-verdict-rejet-breakdown-avant-reprendre-version]]).
- ⛔ **Vérifier CODE + VISUEL** de tout plan hérité avant de l'inclure : un composant qu'on n'a pas
  revu n'est pas un acquis.
- La sélection doit venir d'un **inventaire réel du repo**, pas de la mémoire — 640 compositions ne
  tiennent dans la tête de personne (ni celle d'Aziz, ni la mienne).

## État

- **2026-08-15** : cadrage validé (double usage + sélection par capacité) · inventaire agent livré
  (voir plus bas) · **planche-contact des 53 renders produite et en ligne** →
  [SHOWCASE-PLANCHE-CONTACT.md](memory/projects/SHOWCASE-PLANCHE-CONTACT.md). Rien n'est monté.
- ⏸️ **EN ATTENTE D'AZIZ — c'est le point de reprise** : parcourir les 2 planches et marquer ce qui
  tient encore. Sans cet arbitrage, on ne peut pas monter : les renders datent de mai-juin et la
  plupart des templates n'ont jamais été jugés visuellement (candidats à DÉCOUVRIR, pas à montrer).
- Ensuite seulement : déroulé (ordre des blocs, durée, musique), puis montage de l'index, puis cut vente.

---

## 📋 INVENTAIRE (agent, 2026-08-15) — résultats clés

> Rapport complet produit par agent dédié (lecture des 7 catalogues + 640 `id=` de Root.tsx +
> croisement usage réel par grep + dates de commit). **Vérifié : 53 renders dans
> `out/templates-souverain/` + 110 dans `out/_r-and-d/` existent bien sur disque.**

### ⭐⭐⭐ Le constat qui structure tout : le repo a DEUX ÂGES

Un socle de ~71 composants Remotion/Tailwind bâti **en mai 2026, jamais retouché**, et une production
vivante (juin→août) qui n'en utilise presque rien — elle tourne sur Mapbox, globe D3 et SVG codé.
**C'est la zone exacte de l'oubli d'Aziz**, et c'est structurel, pas accidentel.
Cause identifiée : ces composants sont **en bas** de `COMPOSANTS-INDEX.md`, sous une longue table
Mapbox — le pattern [[feedback_catalogue-position-liste-et-brief-restrictif]] qui se rejoue.

### Les 10 capacités retenues (meilleur exemple de chaque)

1. **Un territoire prend une couleur/un camp** → `ResourceTextureFill` (le pays se remplit de sa
   RESSOURCE, pas d'un aplat) · publié Sénégal
2. **Le drapeau réel épouse le pays, même en relief** → `MapboxCountryFlagDecal` · publié Sénégal V3
3. **La caméra plonge du globe vers un point** → `D3-A1K1-GlobeToParchemin16x9` (globe → carte
   parchemin en une seule projection) · validé Aziz
4. **La caméra accompagne un tracé, en continu** → `D3-Gazoduc-Acte2-AAGP` (bbox glissante, zéro
   à-coup) · validé 3×
5. **Un flux relie deux lieux** → `GeoFlowConnection` · publié Soudan (Actes 3/4/5)
6. **Un insert ouvre la conduite / montre le lieu** → `Proto-TroisGisements-Inserts` · validé
   2026-08-15, ⚠️ jamais monté en épisode
7. **Un chiffre frappe** → `Senegal-Beat0-Accroche` (OdometerFlip) · publié
8. **Deux mondes se comparent** → `WarMapSplitScreen` 3 volets à ratios animés · publié AES
9. **Un concept s'impose sans quitter la carte** → `WarMapDimmedOverlay` · publié AES + Soudan
10. **Un personnage vit une scène** → `Cacao-FULL` / `PersoVivant-RecolteAuSol` · publié, validé 100%

### ⭐⭐⭐ CE QUI EST OUBLIÉ (la vraie valeur du rapport)

- **53 MP4 déjà rendus** dans `out/templates-souverain/` (426 Mo) : OdometerFlip, CoinFlip, BarRace,
  TimelineFracture, ShatterReform, MosaiqueWax, OrigamiCarto, PassationPouvoir… → **la showcase se
  monte en grande partie sans un seul render**.
- **30 composants aboutis à ZÉRO usage** (aucun fichier hors `_shared/`), tous datés du 20-23 mai :
  `SurfaceComparison` (pays à leur vraie taille, façon thetruesize) · `CountryStackComparison`
  (« la France rentre 4× dans la RDC ») · `WealthScale` (balance riche-en-ressources /
  pauvre-en-revenus) · **`CrossSection`** (coupe en tranches) · `GoldVein` (zoom Equal Earth→Mercator
  + veines depuis une mine) · `EmpireOverlay` · `TickerTapeHistory` · `EntityDiagram` ·
  `OsintSplitScreen` · `SmallMultiplesGrid` · `MilitaryMarchLine` · + 19 autres.
- **5 formes data-viz D3 jamais montées** (renders dans `out/_r-and-d/`) : ⭐⭐ **Chartogram** (le
  contour réel d'un pays SE DÉFORME en barre proportionnelle — « la carte DEVIENT la donnée », noté
  « rare, personne en vulga FR ») · Cartogramme · Sankey · ForceNetwork (réseau qui se recompose
  physiquement) · PieMorph · + Globe2 (occlusion 3D réelle + terminateur jour/nuit).
- **Pipeline 3D Three.js** validé de bout en bout (Gemini → Trellis → .glb → @remotion/three), jamais
  réutilisé depuis juin. ⚠️ tension : `DOCTRINE-SOUVERAIN` pose « pas de 3D, plat encre » → arbitrer.
- **Templates carte ⭐⭐ du catalogue à zéro usage épisode** : `MapCutaway` (pourtant « le plus
  réutilisable »), `HeatGradientFill`, `ContagionFlagSpread`, `FiberOpticFlagInvade`.
- **Registre client-sim** (MochIt, NorthShield, Flowdesk) : volontairement isolé, mais c'est **le seul
  matériau NON-géopolitique du repo** → directement pertinent pour le cut vente freelance.

### ⛔ REJETS — ne pas remontrer (le piège évité)

⛔⛔ **Gazoduc Acte 3 = GELÉ EN WIP NON VALIDÉ** (Aziz 2026-08-14) : panneau financement 40% vide,
quasi-immobilité 64→72 s, Beat 4 encore du code v3 rejeté. **Seuls le Beat 1 et le Segment B sont
validés** — ne PAS montrer les compositions `D3-Gazoduc-Acte3-*` telles quelles.
Autres : `drawFlagCanvas` · `flyTo`/`easeTo` headless · filtre pays par `'name'` · textures/grain sur
carte · voile < 0.5 en overlay (≠ insert, cas légitime différent) · SVG plat monochrome sur carte
(4/10) · pions réalistes War-Map · panneaux flottants du Soudan Acte 3 · `FractureReveal` (supprimé) ·
bataille en rectangles top-down · sprites PixelLab pour jetons trait-fin.

### 🕳️ LES TROUS DU CATALOGUE

1. ⭐⭐ **L'ÉCHELLE HUMAINE — trou n°1.** Rien ne rapporte un chiffre à une expérience vécue. Seuls
   candidats (`WealthScale`, `CountryStackComparison`) : **jamais servi**. ⭐ **Convergence
   indépendante** : l'agent d'analyse Soudan pointait le même manque sur le beat de Kosti.
2. **L'avant/après temporel sur un même plan** (pas deux entités : un même lieu à deux dates).
3. **Le mécanisme en coupe** — `CrossSection` existe, jamais servi.
4. **Le morphing géométrique continu** (le `Chartogram` prouve que c'est possible, jamais généralisé).
5. **La contre-plongée / le point de vue au sol** — tout est en vue de dessus ou de face.
6. **Le texte comme matière** — TypeWriter/TypeReveal/SplitFlap/WordExplode : aucun usage épisode.
7. **Le son visualisé** — rien, alors que le pipeline audio est très mature.
8. **La transition entre deux registres visuels** — `GlobeToParchemin` est le SEUL raccord
   inter-registre ; carte→scène SVG se fait au cut sec.

## ⛔ Garde-fou avant tout montage (posé par l'agent, repris ici)

Les 53 renders datent de mai-juin et **les 30 composants oubliés n'ont, pour la plupart, jamais été
jugés visuellement par Aziz**. Ce sont des candidats à **DÉCOUVRIR**, pas à montrer directement.
→ Étape suivante proposée : **planche-contact** des renders existants (grille légendée, parcourue en
quelques minutes) pour qu'Aziz marque ce qui tient encore. Sert deux fois : alimente la showcase ET
rend le catalogue visible. Règle applicable : *un décor qu'on n'a pas vu n'est pas un acquis, c'est
une dette.*
