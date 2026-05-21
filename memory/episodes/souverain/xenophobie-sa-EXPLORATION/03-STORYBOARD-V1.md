---
name: Xénophobie SA — Storyboard V1 (provisoire)
description: Storyboard 9:30 min en 5 actes + CTA. Stack Or Africain. Provisoire, à valider/réviser à la reprise.
type: project
---

# Storyboard V1 — Xénophobie SA Long Documentary

**Statut** : PROVISOIRE 2026-05-07. À réviser à la reprise selon évolution sujet et tests visuels.

**Format** : YouTube Long 9:30 min (8-10 min cible)

**Stack confirmé** : Mapbox style GéoAfrique + Gemini + Remotion + portraits photo/Gemini stylisé. **PAS de PixelLab** (incompatible registre documentaire premium).

**Carte de base** : réutiliser carte v5 Or Africain validée comme fondation (style + composants `_shared/mapbox/`).

---

## ACTE I — Le clip qui a dépassé un million de vues (1:30)

**Intention** : ancrer le sujet dans le réel dès la seconde 1. Le spectateur voit ce dont on parle, pas une abstraction.

### 1.1 — Hook (0:00-0:15)
- **Visuel** : fond noir éditorial #0a0a0a. Cadre téléphone vertical au centre (bordure fine, ombre subtile, ratio 9:16 dans 16:9). Dans le cadre : **vrai extrait vidéo 6-8s** d'une marche Operation Dudula (à sourcer proprement, pas le clip Ghanéen — voir 04-DECISIONS-OUVERTES.md). Audio source coupé (`muted`). Léger grain (8% opacity). Désaturation -15%.
- **Compteur Remotion** : `1 762 893 vues` apparaît en cartouche papier vieilli en bas
- **Filigrane source** : `Source : @newslionsa, TikTok, avril 2026` (petit, italique, transparent)
- **VO FR** : *"Cette vidéo a été vue un million sept cent mille fois. Et ce n'est pas la première."*

**Stack** :
```tsx
<AbsoluteFill style={{ background: '#0a0a0a' }}>
  <PhoneFrame>
    <OffthreadVideo
      src={staticFile("souverain/xenophobie-sa/clip-march-trimmed.mp4")}
      muted
      style={{ filter: 'saturate(0.85) contrast(1.05)', objectFit: 'cover' }}
    />
    <GrainOverlay opacity={0.08} />
  </PhoneFrame>
  <ViewCounter target={1762893} />
  <SourceCartouche text="Source : @newslionsa, TikTok, avril 2026" />
</AbsoluteFill>
```

### 1.2 — Localisation (0:15-0:50)
- **Visuel** : zoom out → Mapbox style GéoAfrique pleine échelle Afrique. Drift caméra (delta zoom 0.5 minimum). Afrique du Sud **PAS en rouge** (voir 04-DECISIONS-OUVERTES.md). Approche provisoire : zoom géographique progressif suffit narrativement, ou cartouche identifiant à côté du pays.
- **Cartouche TOP HALF** : `Afrique du Sud — Avril 2026`
- **VO FR** : *"Afrique du Sud, avril 2026. Un homme ghanéen est filmé pendant qu'on lui crie de partir. Il n'est pas le premier. Il ne sera pas le dernier."*
- **Stack** : `MapboxBase` + `MapboxBrandingHide` + lerpCam continu

### 1.3 — Le paradoxe énoncé (0:50-1:30)
- **Visuel** : retour fond noir charbon. Citation typographiée bilingue centre :
  > *"This is Africa. We are not leaving.*
  > *Go and fight for your land from white people."*
  > 
  > — African immigrant in South Africa, April 2026
- Typographie : Cormorant Garamond italique (citation), sans-serif fine (source)
- **VO FR** : *"C'est ce qu'a répondu un immigré africain à Johannesburg. Et cette phrase contient un paradoxe que personne ne veut regarder en face."*
- **Stack** : composant `<DocumentaryQuote />` (à créer, Remotion pur, fade-in spring + hold + fade-out)
- **Audio** : kora Minimax très basse, respect

---

## ACTE II — Le miroir qu'on ne veut pas voir (1:30-3:30)

**Intention** : retournement historique. L'Afrique du Sud libérée par solidarité africaine, qui aujourd'hui attaque ces mêmes Africains.

### 2.1 — La carte de l'exil ANC (1:30-2:30)
- **Visuel** : Mapbox Afrique entière. **Approche couleurs à valider à la reprise** (voir 04-DECISIONS-OUVERTES.md) — option drapeaux désaturés sur territoires, ou cartouches éditoriaux à côté.
- Lignes animées (interpolate continu) reliant Tanzanie/Zambie/Mozambique/Angola à SA, en or sourd `#b8893f`
- **Pions ANC en exil** : SVG cercles ornementés 16px (PAS PixelLab), se déplacent le long des lignes vers SA
- Cartouches TOP HALF apparaissent un par un : `Tanzanie · Quartier général ANC, 1969-1990`, etc.
- **VO FR** : *"L'ANC, qui a libéré l'Afrique du Sud de l'apartheid, a survécu en exil pendant trente ans. Dans six pays africains. Tanzanie. Zambie. Mozambique. Angola. Soutenu par leurs gouvernements, leurs peuples, leurs économies."*
- **Stack** : `MapboxBase` + traitement territoires (à décider) + `<Img>` SVG cercles animés

### 2.2 — Citation Mandela (2:30-3:00)
- **Visuel** : split-screen 50/50.
  - **Gauche** : portrait Mandela. **Décision à valider** :
    - Option A — photo d'archive réelle (1990, libre de droits ANC ou fair use éditorial), bordure ornement, sépia léger
    - Option B — Gemini stylisé sépia gravure éditoriale
  - **Droite** : citation grande typographie
    > *"Africa shall not be free until the African continent is one."*
    > 
    > — Nelson Mandela, ANC Conference, Lusaka, 1990
- **VO FR** : *"Mandela disait : 'L'Afrique ne sera libre que lorsque le continent sera un.' Le continent l'a porté. Aujourd'hui, son pays attaque ceux qui l'ont porté."*
- **Stack** : Remotion `<AbsoluteFill>` 50/50, fond papier vieilli (Gemini texture), `<DocumentaryQuote variant="portrait-left" />`
- **Recommandation** : photo d'archive si trouvée libre — Mandela mérite la dignité du réel.

### 2.3 — Le retournement (3:00-3:30)
- **Visuel** : retour Mapbox. **PAS de SA en rouge**. Le retournement se montre par **inversion des flèches** : 4 flèches partent de Nigeria, Ghana, Zimbabwe, Mozambique vers SA. Or sourd à l'origine, virent à gris pâle en arrivant — symbolise l'accueil dégradé.
- **VO FR** : *"Trente ans plus tard, ces mêmes pays voient leurs ressortissants attaqués sur le sol sud-africain. La dette historique s'inverse."*
- **Stack** : Mapbox + flèches SVG animées (lerpColor or → gris)

---

## ACTE III — La récidive en chiffres (3:30-5:30)

**Intention** : timeline froide, dignifiée. Pas de sensationnalisme. Les chiffres parlent.

### 3.1 — Timeline 2008 → 2026 (3:30-4:30)
- **Visuel** : fond Gemini "papier vieilli grille éditoriale" (prompt : "aged manuscript paper texture, faint editorial grid lines, sepia, premium documentary background, no text"). Timeline horizontale Remotion construite progressivement.
- Points : 2008 / 2015 / 2019 / 2022 / 2026. Chacun grossit avec spring damping 200, donnée chiffrée apparaît au-dessus.
  - 2008 : "62 morts — 135 lieux — 1 400 arrestations"
  - 2015 : "7 morts — Durban → Johannesburg"
  - 2019 : "Camions brûlés — chauffeurs étrangers"
  - 2022 : "Operation Dudula naît à Soweto"
  - 2026 : "Dudula devient parti politique. Élections municipales."
- À chaque point, cartouche papier vieilli (Gemini base) avec source citée en italique
- **VO FR** : narration calme, chronique
- **Stack** : Gemini background + Remotion timeline + `<DocumentaryQuote />` cartouches secondaires

### 3.2 — Phrase méta-positionnement (4:30-5:00)
- **Visuel** : timeline reste à l'écran avec opacity 0.25. Texte centre :
  > *"Les chiffres officiels sont par construction des sous-estimations.*
  > *Dans la plupart des incidents, l'enquête forensique n'est jamais menée à terme."*
- **VO FR** : prononce avec gravité contenue
- **Stack** : Remotion AbsoluteFill, dimming, typographie premium
- **Note** : c'est notre **1 phrase de méta-positionnement par épisode** (règle template fact-sheet)

### 3.3 — Le cadre légal absent (5:00-5:30)
- **Visuel** : fond Gemini "papier de recherche académique" (prompt : "old academic paper background, faint typography watermark, sepia, premium aged document"). Citation au centre, source en bas en italique.
  > *"South African police often treat xenophobic violence as ordinary criminal activity rather than as systematic violence based on national origin."*
  > 
  > — Frontiers in Human Dynamics, 2024
- **VO FR** : *"La police sud-africaine traite souvent ces violences comme crimes ordinaires. Pas comme violences ciblées sur l'origine nationale. Cette nuance change tout."*
- **Stack** : Gemini background + `<DocumentaryQuote />`

---

## ACTE IV — Les enfants à l'école (5:30-7:00)

**Intention** : événement concret central. Addington Primary, 21 janvier 2026. Angle peu traité par mainstream. Émotion contenue.

### 4.1 — Le lieu (5:30-6:00)
- **Visuel** : Mapbox zoom multi-niveaux. Afrique entière → SA → KwaZulu-Natal → Durban → Addington. Drift caméra continue, jamais segmenté (règle camera-movements).
- **Cartouche TOP HALF** : `Addington Primary School — Durban, 21 janvier 2026`
- **VO FR** : *"Une école primaire à Durban. Vingt-et-un janvier deux mille vingt-six. La rentrée."*
- **Stack** : `MapboxBase` zoom progressif (delta 0.5 min entre chaque palier)

### 4.2 — Reconstitution (6:00-6:40)
- **Visuel** : composite Gemini éditorial unique (prompt : "editorial documentary illustration, primary school entrance in Durban South Africa, children silhouettes near gate, threatening adult figures approaching from the side, charcoal and sepia, dignified, no faces visible, restrained tone"). **Pas d'animation Seedance** — image fixe avec ken burns lent.
- Cartouches apparaissent un par un : `Operation Dudula · MK Party · March and March`
- **VO FR** : *"Trois groupes — Operation Dudula, le MK Party de l'ancien président Zuma, et un mouvement appelé March and March — tentent de bloquer l'entrée. Ils veulent empêcher des enfants étrangers d'aller en classe."*
- **Stack** : Gemini illustration + Remotion ken burns (interpolate scale 1.0 → 1.08 sur 40s)

### 4.3 — La question (6:40-7:00)
- **Visuel** : retour fond noir. Texte centre, très grand :
  > *"À quel âge un enfant cesse-t-il d'être africain ?"*
- **VO FR** identique
- **Stack** : Remotion typographie hold 30f (pattern freeze-frame Atlas)

---

## ACTE V — Anger at the wrong target (7:00-9:00)

**Intention** : voix internes sud-africaines critiques. Désamorce moralisation extérieure.

### 5.1 — Malema (7:00-7:40)
- **Visuel** : split-screen 50/50.
  - **Gauche** : portrait Malema. **Recommandation : Gemini stylisé sépia** (figure clivante, stylisation neutralise)
  - **Droite** : citation
    > *"Unskilled men, with no skill whatsoever,*
    > *say somebody took their jobs.*
    > 
    > I don't want votes based on hating Africans."*
    > 
    > — Julius Malema, EFF, 2026
- **VO FR** : *"Julius Malema, leader de l'EFF, parti de gauche radicale sud-africain, refuse de récupérer politiquement la xénophobie. 'Des hommes sans qualifications disent qu'on leur a pris leurs emplois.'"*
- **Stack** : Gemini portrait + `<DocumentaryQuote variant="portrait-left" />`

### 5.2 — Daily Maverick (7:40-8:10)
- **Visuel** : fond papier journal vieilli (Gemini : "aged newspaper texture, sepia, premium documentary"). Citation premium encadrée.
  > *"Xenophobia is a lazy diagnosis.*
  > *South Africa's real crisis is below the breadline."*
  > 
  > — Daily Maverick, Opinion, 27 March 2026
- **Marqueur de confiance écran unique de l'épisode** : `Source : Daily Maverick, mars 2026` cartouche bas
- **VO FR** : *"Le journal sud-africain Daily Maverick écrit : 'La xénophobie est un diagnostic paresseux. La vraie crise sud-africaine est en dessous du seuil de pauvreté.'"*
- **Stack** : Gemini background + `<DocumentaryQuote />`

### 5.3 — Les chiffres structurels (8:10-8:40)
- **Visuel** : deux StatGauge Remotion côte à côte (composant `_shared/` existe — réutilisable). Fond Gemini grille éditoriale.
  - Jauge 1 : Chômage des jeunes — **32,9%** (à confirmer Stats SA primaire)
  - Jauge 2 : Indice Gini — **0,63** (à confirmer Banque mondiale primaire)
- Animation : spring damping 200
- **VO FR** : *"Trente-deux virgule neuf pour cent. C'est le taux de chômage des jeunes en Afrique du Sud. Le record national. L'inégalité, mesurée par l'indice Gini, est la plus haute au monde."*
- **Stack** : `<StatGauge />` × 2 + Gemini background

### 5.4 — La résistance immigrée (8:40-9:00)
- **Visuel** : retour fond noir, citation finale qui ferme la boucle :
  > *"This is Africa. We are not leaving."*
- **VO FR** : *"'Ceci est l'Afrique. Nous ne partons pas.' La phrase qui a ouvert cette histoire est aussi celle qui la termine."*
- **Stack** : `<DocumentaryQuote />` typographie identique au hook, hold 60f

---

## CTA (9:00-9:30)

- **Visuel** : Mapbox Afrique entière. Lentement, tous les pays s'allument **simultanément** (traitement à valider — drapeaux désaturés, ou or sourd unifié, ou autre). Pas de hiérarchie. L'Afrique entière comme une seule.
- **VO FR** : *"Souverain ne juge pas. Souverain regarde. À toi de décider ce que tu en fais. Si cette histoire t'a parlé, abonne-toi."*
- **Audio** : kora Minimax monte légèrement, finale digne, pas triomphale
- **Stack** : `MapboxBase` + traitement final unifié + `MapboxBrandingHide`

---

## Composant à créer pour cet épisode (réutilisable tous Souverain longs)

**`<DocumentaryQuote />`** dans `src/projects/souverain/_shared/` :
- Props : `text` (string anglais), `source` (string), `variant` ('center' | 'portrait-left' | 'portrait-right')
- Typographie : Cormorant Garamond italique (citation), sans-serif fine (source)
- Animations : fade-in spring + hold + fade-out
- Fond : transparent (au-dessus de Gemini ou noir)
- Variante portrait : split-screen 50/50 avec `<Img>` à gauche/droite
- **C'est la signature documentaire premium de Souverain Long.**

---

## Production estimée (à la reprise)

- Audio TTS + mesure : 1 session (45 min)
- Recherche/permission clip vidéo Acte I : 1 session (variable selon licences)
- Génération Gemini (Mandela si pas archive, Malema, illustration Addington, backgrounds éditoriaux x4) : 1 session
- Compositions Mapbox (3 scènes distinctes) : 1 session
- Composant `<DocumentaryQuote />` + tests visuels : 1 session
- Assemblage Remotion timeline + citations + StatGauge + audio + sous-titres : 1-2 sessions
- Mini-renders + ajustements : 1 session
- **Total estimé** : 6-8 sessions de production, ~1,5 semaine si Hannibal pas en parallèle.
