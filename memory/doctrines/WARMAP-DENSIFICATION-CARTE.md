# DOCTRINE — Densification de la carte War-Map (remplissage avec intention)

> Née 2026-07-18, suite au retour Aziz sur l'Acte 5 Soudan : "on est devenu trop conservateurs, on
> épure/efface par réflexe alors qu'on dispose d'un arsenal riche". Synthèse extractive tracée d'un
> appel double (Gemini `da-compare.py` + Kimi K2.5 `kimi-video-compare.py`, même paire vidéos :
> référence Sahel P2 vs Acte 5 Soudan nouveau) — brief 100% prospectif (pas un jugement qualité, un
> brainstorm de remplissage). Détail brut (4 fichiers, rapatriés du session-tmp) :
> `memory/episodes/soudan-midform/da-briefs-acte5/` — `01-comparatif-{gemini,kimi}.md` (diagnostic vs
> référence Sahel P2) + `02-densification-{gemini,kimi}.md` (brainstorm remplissage, source de cette
> doctrine). Brief réutilisable pour un futur acte : `scripts/warmap/templates/warmap-densification-brief.txt`.

**⛔ Ne remplace PAS** [[CARTO-OVERLAYS-PRINCIPES]] (contour permanent + intérieur vide = la toile) ni
[[WARMAP-GRAMMAIRE]] (objet non nommé par la voix = confus, rejeté Acte 2). Cette doctrine AJUSTE le
curseur : le vide n'est plus la valeur par défaut à chaque beat, mais une des couches — pas la seule.

---

## Le vrai changement de posture (résumé en 1 phrase)

**Avant de faire disparaître un élément, demander : "quelle trace cette action laisse-t-elle sur le
terrain ?"** — jamais "qu'est-ce que je peux enlever pour faire propre ?". Convergence Gemini+Kimi sur
ce point précis (formulé quasi identiquement par les deux, indépendamment).

## VOLET A — Techniques de remplissage (par couche, ancrées à un mot narratif précis)

**Couche ACTEURS** (densité humaine, sous-exploitée) :
- **Crowd tokens** (G+K, déjà faisable) : pas que le leader — 2-3 jetons secondaires D=32px en cluster
  autour, opacity réduite, délai d'apparition en cascade (effet "onde").
- **Bases décomposées** (K, déjà faisable) : un sprite de base + petits éléments satellites (tente,
  antenne, véhicule) posés en périphérie aléatoire — évite le symbole isolé.
- **Status rings** (K, à coder) : anneau SVG pulsant autour d'un jeton, couleur = intensité (combat/
  tension), pour un statut incertain (siège, bataille en cours).

**Couche TERRITOIRE** :
- **Halo progressif texturé** (G+K, déjà faisable/sous-exploité) : le halo rayonnant existant peut
  "respirer" (scale oscillant) + recevoir une texture SVG (hachures) pour distinguer contrôle effectif
  vs revendiqué.
- **Corridors enrichis** (G+K, déjà faisable) : `GeoFlowConnection` + sprite convoi qui voyage dessus +
  points de contrôle intermédiaires (checkpoints) le long du trait — pas qu'une ligne abstraite.
- **Onde de choc régionale** (G, déjà faisable) : SVG cercle qui s'étend rapidement sur plusieurs pays
  pour montrer qu'un événement local a des répercussions régionales.

**Couche ÉVÉNEMENTS (micro-narrations)** :
- **Accumulation de preuves** (G, déjà faisable) : plaques/tampons parchemin glissent depuis le bord
  vers les zones vides (mer, désert) et RESTENT comme des post-its de tableau d'enquête — meuble
  l'espace mort en même temps qu'asseoir l'autorité journalistique.
- **Impact markers** (K, à coder) : cercle concentrique qui s'étend + croix SVG temporaire, généralisation
  des fumées d'impact déjà utilisées ailleurs dans le projet.

**Couche UI narrative** :
- **Timeline enrichie** (K, déjà faisable) : micro-frise sous la date avec ticks colorés des événements
  passés encore "actifs" à l'écran — rend visible que la carte actuelle est une SOMME, pas un instant.

## VOLET B — Règle GARDER vs EFFACER (remplace le réflexe "toujours nettoyer")

**Convergence forte Gemini+Kimi sur un critère simple, à retenir tel quel** :
> **Si l'info est un VERBE (exploser, avancer, signer) → elle s'efface. Si c'est un NOM (base, leader,
> ville, route majeure) → elle PERSISTE** (en pleine intensité ou "mise en veille"/greyed-out).

- **Mise en veille (Ghosting)** (G, à coder mais simple) : ne pas supprimer un élément, le désactiver —
  opacity réduite, mode outline (contours seuls, intérieur vide), animation figée. Une base reste
  visible en fond même après son moment narratif.
- **Cicatrices** (G, à coder) : une bataille passée devient une icône discrète (croix, marqueur usé) au
  lieu de disparaître — trace mémoire du récit.
- **Saliences résiduelles** (K, à coder) : tout élément ayant servi devient une ombre géo-localisée
  (opacity 0.2, grayscale) qui reste — maintient la conscience géographique globale même hors-focus.
- **Ce qui s'efface franchement** : convois arrivés à destination, ondes de choc, masques parchemin
  temporaires (focus pays) une fois le beat clos.

## VOLET C — Pistes sous-exploitées / jamais testées (à considérer, PAS encore validées)

- **D3-geo + Mapbox superposé** (G+K, à coder, potentiel élevé cité par les 2 indépendamment) :
  synchroniser la projection D3 avec `jumpTo` Mapbox à chaque frame pour des graphes de réseau
  (force-directed, "qui finance qui") ou hexbins/heatmaps de densité — chose qu'on n'a jamais combinée
  avec le registre War-Map actuel (d3-geo existe ailleurs dans le projet pour un registre différent,
  cartes plates historiques).
- **Hachurage stratégique** (G, à coder) : motifs SVG (hachures, pointillés) sur les zones géo clés
  (montagnes, désert profond) via les polygones GeoJSON déjà disponibles — texture le vide du parchemin
  sans violer la contrainte "pas de vrai relief 3D".
- **Paper Cut layers** (K, déjà faisable) : un pays qui "entre en scène" se découpe littéralement dans
  le parchemin existant (mask reveal + drop-shadow SVG) plutôt qu'un simple fade-in — exploite le style
  parchemin physiquement.
- **Mémoire des frontières** (K, à coder) : au changement de contrôle, l'ancienne ligne ne disparaît pas
  instantanément — devient pointillée grise et s'efface progressivement pendant que la nouvelle se
  dessine en trait plein.
- **Cluster tokens** (K, à coder) : au lieu de multiplier les jetons dans une zone saturée, les fusionner
  en un badge numéroté qui se déploie en éventail au moment suivant.

## ⚠️ Divergence notable entre les 2 modèles (à trancher au cas par cas, pas une règle figée)

Sur le dézoom caméra pour montrer un acteur lointain (ex. Abou Dabi) : Gemini propose de le retirer
(faire "entrer" l'élément par une plaque depuis le bord plutôt que dézoomer dans le vide) ; Kimi propose
de le garder mais en persistance réduite (miniature, trait fantôme permanent). Les deux s'accordent que
le dézoom actuel "dans le vide" ne fonctionne pas — pas sur LA solution de remplacement.

## Application immédiate suggérée pour l'Acte 5 (5 points, synthèse Kimi, cohérents avec Volet A/B)

1. Halo de contrôle sur la zone frontalière Libye-Soudan dès que le corridor est mentionné (pas
   seulement un trait).
2. Sprite "base logistique" à la frontière sud-libyenne (matérialise le "dépôt" même non nommé par la
   voix — à vérifier contre la règle "objet non nommé = confus", cf WARMAP-GRAMMAIRE, à valider).
3. Point Abou Dabi gardé en persistance réduite (miniature + trait fantôme), pas juste montré puis oublié.
4. Impact marker à l'arrivée sur El-Fasher (déjà partiellement fait cette session — renforcer/densifier).
5. Timeline enrichie avec rappel visuel discret de l'origine (Abou Dabi) même loin dans le récit.

**Statut** : brainstorm brut condensé, PAS encore appliqué au code. Prochaine session : trier avec Aziz
ce qui s'applique à l'Acte 5 précisément (retour au code), puis généraliser ce qui marche aux futurs
actes/projets War-Map.
