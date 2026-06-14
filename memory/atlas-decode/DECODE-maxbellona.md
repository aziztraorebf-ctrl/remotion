# DECODE — Max Bellona (carte vivante géopolitique FR)

> Décodé 2026-06-14 (session Polish War-Map Sahel). 2 vidéos analysées frame-par-frame + transcripts.
> Frames de référence préservées : `out/_r-and-d/decode-maxbellona/` (frames-soudan/ + frames-rdc/).
> But : transporter SA GRAMMAIRE GRAPHIQUE vers notre carte plate, à NOTRE sauce. PAS copier.

## Qui / pourquoi pertinent

- **Max Bellona** (ex-ARCOS), ~237k abonnés, géopolitique FR longue.
- Vidéos vues : **Soudan** (`n9SrkOc074s`, 30min, 247k vues) + **RDC** (`64KxEMTzq0o`, 31min, 566k vues — son plus gros succès carto).
- **Format jumeau du nôtre** : géopolitique africaine complexe, longue, posée, PAS de rythme TikTok (sauf au hook). Faceless-analyste (lui montre son visage mais débit calme). **566k vues RDC = validation marché de notre créneau.**
- **1 seule vidéo/mois → c'est du montage MANUEL (After Effects)**, vidéo par vidéo. **Notre avantage décisif : data-driven Remotion** → une fois ces mécaniques codées en briques, on les rejoue à coût quasi nul. On vise sa qualité en se coupant ~80% du travail manuel.

## SA grammaire graphique (l'objet du décodage — pas la forme, la GRAMMAIRE)

Ce qu'on prend = **comment il représente, place, déplace, séquence, colore**. Pas les jetons-losange en soi (code partagé, pas son invention).

### Les invariants de sa carte
| Élément | Lui | Nous (état / verdict) |
|---|---|---|
| Fond | 2 REGISTRES (voir ci-dessous) | parchemin + grain = **plus premium que son relief bitmap** |
| Pays actif | polygone **uni très saturé** (rouge Soudan / magenta-rouge RDC) | nos contours colorés Mali ocre/Burkina brique/Niger sarcelle = plus subtil |
| Frontières internes | **pointillés blancs** qui se DESSINENT (draw-in) | on a le draw-in — acquis |
| Labels région | MAJUSCULES **intégrés DANS le polygone**, semi-transp, suivent le territoire | à renforcer (souvent en cartouche externe chez nous) |
| Villes | point + label propre (Khartoum, Goma) | MapPin Lucide — équivalent |

### Découverte n°1 — DEUX registres de carte (selon présent/passé)
- **Carte de GUERRE** = fond **bleu profond** dégradé, polygones de faction très saturés. Pour le conflit ACTUEL (contrôle territorial, factions).
- **Carte HISTORIQUE** = fond **beige relief**. Pour la narration du PASSÉ (alliances, drapeaux voisins, portraits).
- Il **bascule** de l'un à l'autre selon qu'il parle du présent ou du passé. Bleu = "tableau tactique live", beige = "archive".
- **Idée pour nous** : distinguer registre présent/passé par le fond (parchemin = passé ; fond plus froid = front actuel). À tester, pas obligatoire.

## Les 4 mécaniques CODABLES (cœur du transport vers nous)

### MÉCANIQUE 1 — Liens orthogonaux "circuit" sur la carte ⭐ (frame `frames-soudan/01`)
Alliances internationales : **jetons-pays** (drapeau en pastille : Turquie, Qatar) + **jetons-personnages** (portrait cadré : Hemedti, Al-Burhan) posés sur leur territoire réel, **reliés par lignes noires épaisses à angles droits** (style schéma de circuit/métro) avec **renflement-nœud aux jonctions**. Le tracé se DESSINE (draw-in), le nœud PULSE à l'arrivée.
- Pourquoi fort : tracé orthogonal NET = "X soutient Y", lisibilité max, esthétique tableau d'enquête.
- **Notre brique de départ** : `AtlasEvidenceBoard` (nœuds+liens animés colorés, validé 2026-06-04) MAIS sur fond neutre à côté de la carte. Lui = liens DIRECTEMENT sur la géo. → mode "liens sur la carte".
- ⭐ **USAGE POLISH DIRECT = CONFÉDÉRATION AES** (Mali/Burkina/Niger reliés) + soutiens étrangers. Le cas "dur à représenter d'habitude".

### MÉCANIQUE 2 — Bulle/badge-acteur ancré (frames-soudan/02, 03 ; frames-rdc/03)
Une **bulle** (photo réelle chez lui ; NOUS = portrait stylisé réaliste type "dirigeants Israël", ou sprite PixelLab, ou icône) apparaît **ancrée par un point** sur la zone, **label au-dessus**. La bulle HABITE la carte (pas plein écran) → garde le repère spatial.
- Variante FACTION = **badge octogone/losange** (sigle dedans + label en plaque sous le badge), couleur = couleur de la zone, posé sur la zone contrôlée. Se DÉPLACE quand la faction avance.
- **Notre marque distinctive** : portraits STYLISÉS réalistes, PAS de photos réelles. Reconnaissable, premium, cohérent PixelLab. (décision Aziz 14 juin)

### MÉCANIQUE 3 — Carte géo → carte de guerre (la TRANSFORMATION, hook RDC 21-34s) ⭐
*"cette carte, on va légèrement la modifier"* → les zones de conflit se colorient + les badges-factions pop. **Le MÊME objet se métamorphose** : carte géographique → carte de guerre, sous les yeux. Une seule métaphore tenue. C'est le cœur de son hook (voir `HOOK-MAXBELLONA-GABARIT.md`).

### MÉCANIQUE 4 — Flux animés le long d'un trajet pointillé (frames-rdc/04)
Petits jetons qui CIRCULENT le long d'un **trajet en pointillés** (route d'appro, axe d'attaque vers Goma, flux d'or). Pointillé = intention/mouvement.
- **Notre brique** : `RefugeeFlow` (déjà fait, exode P4) → à GÉNÉRALISER (flux militaires/commerciaux, pas que réfugiés).

## SA grammaire de MOUVEMENT (le vrai différentiel vs notre statique)
1. **Zoom continu lent** sur la carte (jamais figée) — push-in/drift permanent. = notre doctrine.
2. **Apparition séquencée, JAMAIS simultanée** : un objet pop, lu 3-4s, puis le suivant. Forced-alignment. = notre R1.
3. **Transition carte→carte par ZOOM**, pas par cut : 1 seule surface continue parcourue. = notre archi "1 Map continue".
4. **Tout tracé se DESSINE** (lignes, frontières, fronts) au lieu de pop sec.
- **Il n'a AUCUNE technique de mouvement qu'on n'a pas déjà.** Son secret = DISCIPLINE du séquençage + tout objet ANCRÉ à un lieu réel + RELIÉ visuellement. Il n'a pas peur de bouger la caméra ni de faire apparaître plusieurs choses.

## Ce qu'on fait DÉJÀ aussi bien / mieux
- Rendu de fond (parchemin+grain+vignette > son relief bitmap daté).
- Incarnation PixelLab animée (lui = photos/portraits figés).
- Grammaire causale rigoureuse (WARMAP-GRAMMAIRE-CAUSALE).
- **Programmabilité** (lui = re-montage AE manuel ; nous = JSON → tout dérive).

## Ce qu'on N'imite PAS (instinct Aziz validé)
- Projection d'images réelles DANS les polygones (il le fait peu de toute façon — juste bulles ancrées).
- Photos réelles → NOUS = portraits stylisés (notre marque).
- Son face-cam dramatique (on est faceless).
- Son fond relief bitmap (moins beau que parchemin).

## 4 chantiers Polish (protos → templates réutilisables)
| # | Mécanique | Usage Polish | Difficulté | Brique base |
|---|---|---|---|---|
| P1 | Liens orthogonaux "circuit" sur carte | ⭐ Confédération AES + soutiens | Moyenne | AtlasEvidenceBoard |
| P2 | Badge-faction octogone/losange ancré + déplaçable | jetons Sahel upgrade | Faible | jetons existants |
| P3 | Transformation carte géo→guerre | Hook AES 30s | Moyenne | countryOutline |
| P4 | Flux le long trajet pointillé | généraliser flux | Faible | RefugeeFlow |

Liens : [[HOOK-MAXBELLONA-GABARIT]] · [[WARMAP-GRAMMAIRE-CAUSALE]] · [[WARMAP-LONG-DOCTRINE]] · [[DECODE-daybyday-warmap]] · [[DECODE-refs-carto-2026-06-14]]

---

# ANNEXE — Jacques a dit + The Invisible Hand (refs décodées 2026-06-14, même session)

> 3 vidéos ajoutées par Aziz pour nourrir le prototypage. Frames préservées : `out/_r-and-d/decode-maxbellona/refs2/`.

## Jacques a dit — "9 erreurs de géographie" (117k subs, 10min40)
Sujet ÉLOIGNÉ de nous, mais 1 technique inédite qui INTÉRESSE Aziz : le **SPLIT-SCREEN 2/3 écrans**.

### MÉCANIQUE P5 — Split-screen 2/3 écrans ⭐ (technique AE/Geolayers générique, pas la sienne)
- **2 écrans** : la MÊME carte/zone dans 2 ÉTATS côte à côte (Scandinavie jaune | rouge) — comparaison "avant/après" ou "mesure A | mesure B". Séparateur vertical net.
- **3 écrans** (horizontal SEULEMENT — pas en vertical 9:16) : 3 régions/entités côte à côte, chacune sa couleur, séparateurs gris fins. Compare 3 éléments d'un coup.
- **Rôle narratif chez lui** : DISTINGUER des choses qu'on CONFOND (Congo vs RDC, Hollande vs Pays-Bas, Scandinavie vs Nordiques). Le split = outil de comparaison/opposition simultanée.
- **Pourquoi puissant (Aziz)** : fait passer 2-3 infos EN MÊME TEMPS, surprenant. Marche horizontal (2-3) ET vertical (2 seulement).
- **Transport NOUS** : split sur notre carte plate → comparer 2 dates (contrôle territorial T0 | T1), 2 acteurs (JNIM | EIGS zones), 2 scénarios. Ou volet carte | volet data/portrait. Brique `SplitScreen` réutilisable Sahel.
- Son autre style : carte SATELLITE réelle + forme colorée hachurée + perso découpé (proche Bellona mais fond satellite, pas parchemin).

## The Invisible Hand (270k subs) — hook + graphisme
2 vidéos : "US Debt" (411k vues) + "Uniting Africa" (62k, NOTRE sujet panafricain).

### Graphisme (registre "premium dark data/finance" — OPPOSÉ à notre parchemin)
- Carte monde **gris-foncé minimaliste**, pays-sujet en **VERT NÉON lumineux + glow** sur fond NOIR. Très élégant.
- **Chiffres-chocs GÉANTS** ("11%" → "50%", "$5.1B") en plein écran, typo blanche bold.
- Stock footage d'archive **traité "film vintage"** (grain, bordure noire, vignette, faux label caméra "CINEMA 200T ISO", date en plaque rouge) → habille le stock pour qu'il colle au registre.
- Morphing : Afrique **se fragmente en pays séparés puis se recompose unie** (métaphore "unir l'Afrique") = transformation morphologique codable.
- **Verdict** : rien qu'on ne puisse faire. Leur force = COHÉRENCE DE REGISTRE (tout dark/néon/vintage) + densité chiffres + structure hook. Notre parchemin reste notre marque ; mais le registre "dark néon" pourrait servir un sujet FINANCE/data (≠ guerre).

### Structure de hook TIH (argumentative — distincte de Bellona "carte se transforme")
Voir [[HOOK-MAXBELLONA-GABARIT]] section "Gabarit B".
