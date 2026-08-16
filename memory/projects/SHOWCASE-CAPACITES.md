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
  [[freelance-dataviz-fiverr-pro]] (auto-mémoire) ;
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

- **2026-08-15 (matin)** : cadrage validé (double usage + sélection par capacité) · inventaire agent
  livré (voir plus bas) · planche-contact des 53 renders produite et en ligne.
- ⭐⭐ **2026-08-15 (soir) — VIRAGE : les 53 templates sont ÉCARTÉS comme source de la showcase.**
  L'arbitrage d'Aziz sur les planches est **annulé** (il n'a plus lieu d'être). Les renders sont
  **archivés, pas supprimés** → [SHOWCASE-PLANCHE-CONTACT.md](SHOWCASE-PLANCHE-CONTACT.md) § statut archive.
  Déclencheur : Aziz analyse un gig Fiverr concurrent et formule le constat —
  *« voir des templates qui défiler sans intention derrière, ne veut rien dire du tout »*. Le repo a
  dépassé le stade du catalogue : chaque vidéo part d'un storyboard original.
  **Nouvelle source = la production vivante publiée** (Sénégal, Soudan, AES, CFA, Gazoduc Actes 1-2) :
  des scènes complètes où il se passe quelque chose. ⛔ Gazoduc Acte 3 reste exclu (gelé, non validé).
- Reste à faire, dans l'ordre : déroulé (ordre des blocs, durée, musique) → montage de l'index →
  cut vente. La tension géopolitique/SaaS (§ ci-dessus) ne bloque que le cut vente.

## 🔎 Benchmark concurrent Fiverr (2026-08-15) — où on se situe vraiment

Reel de gig analysé (75 s, 20 plans, Google Earth Studio + After Effects, imagerie satellite Esri).
Capacités vendues : `REVEAL MAPS`/`FLY IN` · `ANIMATE ANY ELEMENTS` (arrows, aircrafts, rocket) ·
`HIGHLIGHT ANY AREA` · `DIFFERENT MAP STYLES` · `MILITARY BASE` · `BATTLE SCENE` · `OVERVIEW MAP`.

**Verdict : à parité ou devant sur 6 capacités sur 8** (pays qui se remplit → `FlagFill`/
`ResourceTextureFill` ; fly-in globe→point → `GlobeToParchemin` ; caméra qui suit un tracé →
Acte 2 AAGP, **meilleur** car continu là où lui coupe ; flux → `GeoFlowConnection` ; zone hachurée →
`WarMapDimmedOverlay` ; split overview → `WarMapSplitScreen` 3 volets, **meilleur** que ses 2 volets figés).

Les 2 écarts réels :
1. **Objets qui traversent la carte** — il les fait en un clic (calque AE auto-orient). Chez nous :
   4 implémentations éparpillées, aucune canonique (cf. INTENTION-FORME-INDEX ligne « Un OBJET se
   déplace le long d'un chemin »). ⚠️ Ce n'est PAS un trou de capacité, c'est une dette d'unification.
2. **Battle scene** — ses chars top-down avancent SUR la carte ; notre équivalent Soudan est un
   insert SVG hors carte (rupture de registre). Formes différentes, même intention. La nôtre est plus
   lisible ; la sienne est le plan le plus faible de son reel (chars minuscules, explosion générique,
   fond rouge saturé = registre qu'on a explicitement rejeté).

Écart assumé, pas un manque : il utilise de l'imagerie **satellite photoréaliste** (look « broadcast
CNN »). Notre palette carte sombre vient d'être adoptée pour l'Acte 4 — c'est un choix de DA.

⭐ **Enseignement de fond** : notre avantage n'est pas la liste d'effets, c'est le **système**
(intention→forme→template, timing dérivé de l'audio, storyboards multi-modèles). Lui vend des *plans*,
nous produisons des *récits*. La showcase doit démontrer ça — d'où l'abandon des templates isolés.

## 🔎🔎 Benchmark ÉLARGI — 3 références analysées (2026-08-15)

> Méthode : `ffprobe` + extraction de frames sur toute la durée (jamais 1 frame au hasard), lecture
> plan par plan. Les 3 vidéos sont des gigs/livrables Fiverr fournis par Aziz. Registres VOLONTAIREMENT
> distincts — c'est la comparaison croisée qui produit le verdict, pas chaque vidéo isolément.

| | **[1] Gig cartes** | **[2] Aikido** | **[3] Tugger** |
|---|---|---|---|
| Nature | reel de capacités, 20 plans | livrable client B2B complet | teaser produit SaaS |
| Durée | 75 s | 142 s | 30 s |
| Fond | satellite photoréaliste (Esri) | bleu très clair `#DDF0F2` | **noir + dégradé/halos bleus** |
| Moteur | plans qui défilent | voix off + structure narrative | **typographie + interface** |
| Outil probable | Google Earth Studio + AE | AE, illustration flat | AE / motion + mockups |

**[2] Aikido** (logiciel ferroviaire UK, client Network Rail). Structure explainer B2B canonique :
problème (3 laptops, budgets £680m/£720m/£650m + alertes) → terrain (carte UK, région rouge, tracé) →
solution (logo au centre, 6 sources en pointillés : Oracle P6, Excel, PDF, Power BI, SharePoint, base) →
produit (mockup UI en perspective + spinner + 3 bénéfices) → preuve (4 postes + orbite) → humain
(réunion flat-design) → bénéfices (bandeaux à coches) → valeurs (grille 7 icônes) → logos + URL.
⭐ **Sa vraie force = la discipline chromatique** : 4 couleurs seulement + 1 typo tiennent ensemble
**4 registres visuels** (illustration flat / carte vectorielle / diagramme conceptuel / mockup UI)
sans qu'on voie les coutures. Ce n'est pas un effet, c'est une charte.

**[3] Tugger** (« Ask your business data anything »). Accroche typo → texte animé sur dégradé → logo →
**split-screen d'intégration avec encoche découpée** (ancien logo / connecteur central / nouveau) →
l'UI de chat se compose, la question **se tape en direct** (« Which of our projects is most over
budget? ») → réponse déroulée + graphique → carton final.
⭐ 3 forces : **la lumière EST le décor** (quasi zéro objet, dégradé sombre + halos qui dérivent) ·
**le texte qui se tape en direct N'EST PAS décoratif — c'est la démo du produit** (on comprend l'outil
en le voyant fonctionner, zéro mot d'explication) · le split à encoche.

### ⭐⭐⭐ LE VERDICT CROISÉ (le résultat de fond de la session)

**Aucune des 3 ne repose sur une technique qu'on ne maîtrise pas.** Ce qui les distingue est à chaque
fois une **discipline de direction artistique**, pas une capacité : la charte 4 couleurs (Aikido), la
lumière et le vide (Tugger), l'imagerie satellite (gig cartes).

Deux constats reviennent dans les 3, indépendamment :
1. ⭐⭐ **Notre matériau le plus vendeur DORT dans le registre client-sim** (NorthShield, Flowdesk,
   MochIt). `northshield-v3-FINAL.mp4` est déjà dans ce langage — le mockup UI + curseur + cascade de
   données de NorthShield P6 fait ce que font [2] ET [3], avec en plus un pic d'anomalie dramatisé
   qu'aucun des deux n'a. C'est le seul matériau non-géopolitique du repo → il tranche en grande
   partie la tension de positionnement du § ci-dessus.
2. ⭐⭐ **Nos briques « texte comme matière » n'ont JAMAIS servi** (`TypeWriter`, `TypeReveal`,
   `SplitFlap`, `WordExplode` : rendus, catalogués, zéro usage épisode) alors que 2 des 3 références
   s'appuient dessus. C'est exactement le trou n°6 de l'inventaire — désormais confirmé par le marché.

Ce qu'on fait et qu'aucune des 3 ne fait : **faire DURER un geste** (caméra continue de l'Acte 2 AAGP,
zéro à-coup). Elles assemblent des plans ; nous tenons un mouvement. Sur un teaser 30 s ce n'est pas un
défaut de leur part — c'est le format. Sur du long, c'est notre avantage.

### 🎯 CE QUI MANQUE VRAIMENT — une CHARTE, pas une brique (~1/2 journée)

Le chaînon manquant pour le cut vente freelance n'est **pas technique**. C'est un document de DA
verrouillé, à écrire avant tout montage :
- **palette restreinte** (4 couleurs max, cf. Aikido) + **1 typo** tenues sur toute la durée ;
- **traitement du fond** : dégradé vivant avec halos qui dérivent, PAS un aplat. Nos fonds sont des
  aplats (`#16213a`) — c'est ce qui sépare « propre » de « premium », et c'est peu de travail ;
- règle d'enchaînement entre registres (carte → diagramme → mockup → personnages) sans couture visible.

⛔ Ne PAS coder de composant neuf pour ça. C'est de la direction artistique appliquée à de l'existant.

> ✅ **FAIT (2026-08-15)** → [`memory/doctrines/CHARTE-DA-FREELANCE.md`](../doctrines/CHARTE-DA-FREELANCE.md).
> Écrite sur des valeurs **mesurées dans le code** (palette `PAL_GPT` du Gazoduc Acte 4 ; Georgia
> ≈511 occurrences dans `src/`), pas sur des souvenirs. Zéro composant codé, comme prescrit.
> Un fichier neuf plutôt qu'un enrichissement de `CHARTE-EDITORIALE-SOUVERAIN.md` : celle-ci est
> **éditoriale** (positionnement analyste, sources, titres), n'a aucune section visuelle, et couvre
> la chaîne YouTube — pas le cut vente.
> ⭐ **Découverte en l'écrivant** : `northshield-v3-FINAL.mp4` (63 s, revu au visionnage) tient déjà
> **3 registres** — personnages flat / carton typo / dataviz-UI — sur un fond navy sombre avec un
> unique accent cyan. C'est-à-dire la discipline d'Aikido, déjà appliquée par nous. La charte ne
> demande donc rien d'inédit : elle demande de le tenir **partout**.

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
  réutilisé depuis juin. ✅ **Pas de tension à arbitrer — le cadre d'usage est déjà tranché** (Aziz
  2026-06-17, `memory/feedbacks/remotion-effects-rack-natif.md` § CADRE D'USAGE 3D) : le 3D est un
  **réhausseur de niche** (jetons/objets posés sur une carte, géométrie simple), jamais un décor ni
  une carte — et le test A/B jetons plat vs 3D a conclu que **le plat gagne**.
  ⚠️ La « tension » signalée par l'agent d'inventaire venait d'une **citation fantôme** :
  `DOCTRINE-SOUVERAIN` ne dit nulle part « pas de 3D, plat encre » (vérifié) — elle recommande
  `@remotion/three`. Source de l'erreur corrigée dans `feedback_gemini-review-workflow-correct.md`.
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
