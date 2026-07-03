---
name: Xénophobie SA — Décisions ouvertes
description: Décisions tranchées vs en attente. À régler à la reprise via mini-renders et tests.
type: project
---

# Décisions — tranchées et ouvertes

**Statut au 2026-05-07** : exploration gelée. Beaucoup de décisions à valider via mini-renders à la reprise.

---

## ✅ Décisions TRANCHÉES (validées Aziz)

### Format
- **Long YouTube 8-10 min** (pas Short)
- Test Atlas-natif 3/5 + Récidive structurelle = format pilier

### Stack visuel
- **Mapbox style GéoAfrique** comme base cartographique (réutiliser carte v5 Or Africain validée)
- **Gemini** pour backgrounds éditoriaux + portraits stylisés sépia + illustrations contextuelles
- **Photos d'archive réelles** quand disponibles libres de droits (priorité Mandela)
- **Remotion pur** pour animations, timeline, citations, transitions
- **PAS de PixelLab** — incompatible registre documentaire premium Souverain
- **PAS de Seedance** sur cet épisode — registre éditorial fixe + ken burns suffit

### Audio
- **ElevenLabs Narratrice GeoAfrique v2** (canonique fr) — identique Or Africain
- **Minimax kora** — registre digne, pas triomphal
- **Sous-titres Whisper word-level karaoke FR** — identique Or Africain

### Ton et angle
- Angle "miroir Mandela / anger at the wrong target"
- Cas Addington Primary School (enfants) comme illustration centrale
- 5 voix internes sud-africaines critiques minimum (Malema, Daily Maverick, Caracal Reports, @Shadaya_Knight, Tobi Ononye)
- Aucune accusation extérieure
- Souverain pose la question, ne juge pas

### Hook (Acte I)
- **Vrai clip vidéo intégré 6-8s** (pas silhouette stylisée — ancrage pédagogique nécessaire)
- **Marche Operation Dudula** plutôt que clip Ghanéen victime (anti-revictimisation + droits + angle agresseurs collectifs)
- **Audio source coupé** (`muted`)
- Cadre téléphone vertical stylisé dans fond noir éditorial

### Règles éthiques visuelles
- **Aucune couleur ne code un jugement moral subliminal.** Voir règle complète + nuances dans memory/feedback_souverain-couleurs-narratives.md. Les couleurs sont autorisées et utiles — c'est le **jugement moral codé** qui est interdit. Pour cet épisode : pas de rouge sur SA pour signifier "agresseur". Mais une couleur narrativement justifiée (drapeau, identité historique) reste OK. Test "couper l'audio" obligatoire avant render final.
- **Pas d'images de violence**, cadavres, pillages
- **Pas de jugement moral surplombant** ("honte", "barbarie", "Mandela se retourne dans sa tombe")
- **Pas de comparaison directe avec apartheid** (apartheid = racial-d'État ; xénophobie = intra-africaine populaire — confondre = mauvais journalisme)
- **Distinguer Operation Dudula et March and March** (deux mouvements alliés mais distincts)
- **Ne PAS utiliser 644 morts ou 952 incidents** sans accès Xenowatch direct

### Mots interdits dans script
"honte", "barbarie", "régression", "frères qui s'entredéchirent", "Mandela se retourne dans sa tombe", "illegal aliens", "clandestins", "régime" pour SA, "tous les Sud-Africains", "honte à l'Afrique"

---

## 🟡 Décisions EN ATTENTE (à valider à la reprise via mini-renders)

### 1. Traitement couleurs des territoires Mapbox

**Le problème** : comment représenter l'identité de chaque pays sans coder de jugement moral ?

**Options à tester via mini-renders** :
- **Option A — Drapeau pattern fill** : projection drapeau désaturé sur le territoire (premium signature, mais déformation possible)
- **Option B — Bande horizontale stylisée** : pays en teinte neutre (sable/ivoire), bande au centre reprenant 2-3 couleurs principales du drapeau
- **Option C — Cartouche éditorial hors territoire** : pays reste en GéoAfrique neutre, cartouche à côté avec drapeau + nom + chiffre clé (style atlas Larousse premium)
- **Option D — Mix selon contexte** : Option C quand on parle d'un pays spécifique, Option B quand plusieurs pays simultanés
- **Option E — Or sourd unifié** : tous les pays au même traitement doré sourd, identités par cartouches textuels uniquement

**À tester** : faire un mini-render des 5 options sur Acte II.1 (carte couloirs ANC) et comparer.

**Mon penchant initial** : Option D (mix). Mais validation visuelle obligatoire.

### 2. Portrait Mandela : photo d'archive ou Gemini stylisé ?

**Pour photo d'archive** :
- Dignité du réel
- Mandela = figure historique, photo a poids documentaire
- Cohérence avec "ANC archives" comme source

**Pour Gemini stylisé sépia** :
- Cohérence visuelle avec autres portraits de l'épisode
- Pas de problèmes de droits
- Style éditorial gravure plus signature Souverain

**À résoudre à la reprise** : recherche droits photos Mandela 1990 (ANC archives publiques, fair use éditorial documentaire). Si trouvable proprement → photo. Sinon → Gemini.

### 3. Portrait Malema : photo réelle ou Gemini stylisé ?

**Pour Gemini stylisé** (recommandation initiale) :
- Figure clivante politiquement
- Stylisation neutralise visuellement
- Cohérence visuelle avec Mandela si Mandela aussi stylisé

**Pour photo réelle** :
- Plus honnête documentaire
- Mais risque de surfocalisation sur l'apparence

**À résoudre à la reprise** : tester les deux via mini-renders.

### 4. Sourcing du clip vidéo Acte I

**Options à explorer à la reprise** :
- Marche Operation Dudula filmée par média identifiable (BBC Africa, AP Archive, Reuters, Getty)
- Discours public Zandile Dabula ou Jacinta Ngobese-Zuma au micro (déclaration publique = fair use plus simple)
- Plan large d'une marche + pancartes (collectif, non individualisant)
- Combinaison de 2-3 plans courts (1-2s chacun) montrant le mouvement sans focaliser

**À résoudre à la reprise** :
- Audit complet sources licenciées disponibles
- Vérifier coût licence (AP Archive, Getty Editorial : $50-300 selon usage)
- Décision finale : licence vs fair use éditorial (avec risque YouTube claim)

### 5. Carte v5 Or Africain réutilisable ou nouvelle composition ?

**Pour réutilisation** :
- Style validé Aziz
- Composants `_shared/mapbox/` matures
- Cohérence série Souverain

**Pour nouvelle composition** :
- Sujet xénophobie SA centré sur Afrique du Sud + 4 pays voisins (vs Or Africain centré sur Afrique de l'Ouest)
- Zoom géographique différent
- Animations spécifiques (couloirs ANC, flèches inverses, zoom Durban)

**À résoudre à la reprise** : forker la base (composants `_shared/`) + créer compositions spécifiques. **Pas de réécriture de zéro.**

### 6. Music brief Minimax — quel registre exact ?

**Direction confirmée** : kora digne, pas triomphale.

**À préciser à la reprise** :
- Tempo (lent/medium ?)
- Instruments accompagnement (cordes ? percussions très douces ?)
- Variations entre actes (acte I plus tendu, acte V plus apaisé ?)
- Brief Minimax précis à valider avant génération

### 7. Format final — Long + Short possible (décision 2026-07-01)

**Décision Aziz** : format Hub & Spoke (Long Mapbox 9-10min + Short SVG narratif 60-90s) est intellectuellement pertinent mais complexe à exécuter.

**Gate obligatoire avant production** : validation via TubeLab (analyse outliers, vérification demande audience sur le sujet, choix d'angle définitif). Ce sujet sera l'un des candidats au "3e sujet" lors du prochain cycle TubeLab.

**Sur le Short SVG** : la scène parallax silhouette+valise+grille A ÉTÉ TESTÉE (session 2026-07-01). Deux images-cibles générées :
- GPT → https://files.catbox.moe/qnvl4s.png (lisible, minimal, 4 groupes propres)
- Gemini → https://files.catbox.moe/2zrjio.png (plus dense, croisillons, repères arpenteur)
- Jugement : GPT gagne en lisibilité + animabilité. Gemini gagne en intensité dramatique mais sature le plan intermédiaire.
- **Conclusion doctrine** : SVG pur est faisable pour les scènes symboliques (silhouette-frontière), mais les scènes de foule/paradoxe restent difficiles. Un Short SA nécessiterait d'isoler les scènes 100% symboliques et de traiter les autres différemment.

**Décision Aziz** : sujet MIS EN PAUSE, enrichi. Revenir quand TubeLab valide la demande audience.

### 8. Mise à jour données 2026 (session 2026-07-01)

- Tavily confirme : escalade majeure en 2026 — Operation Dudula + March & March, marches plus violentes
- 25 000 expulsions estimées + ultimatums donnés aux immigrants
- Nouveau vecteur narratif : réaction économique continentale (Mozambique trucks, Ghana Gold Fields, débat UA)
- Nouveau mouvement "March and March" à distinguer d'Operation Dudula (fondé fin 2023, plus radical)
- Chômage jeunes : 32,9% (Q1 2025 - Stats SA confirmé)
- Gini coefficient 0,60-0,67 (Banque mondiale, 2024)

---

## 🔴 Décisions BLOQUÉES (nécessitent données externes)

### Chiffres-pilier à valider via sources primaires

| Chiffre | Source à accéder | Statut |
|---------|------------------|--------|
| 644 morts cumulés depuis 1994 | **Xenowatch (xenowatch.ac.za)** | 🔴 NE PAS UTILISER tant que pas accédé |
| 952 incidents documentés | **Xenowatch** | 🔴 Idem |
| 32,9% chômage des jeunes | **Stats SA (statssa.gov.za)** | 🟡 À confirmer URL primaire |
| 0,63 indice Gini SA | **Banque mondiale data.worldbank.org** | 🟡 À confirmer dernière donnée |
| Attitudes population SA vs immigrés | **Afrobarometer round 9 ou 10** | 🟡 Round 10 SA disponible ? |
| Operation Dudula date fondation | Archives presse SA primaires | 🟡 Date 2021 imprécise selon Perplexity |

**Règle** : aucun chiffre 🔴 ne peut entrer dans le script. Les 🟡 doivent être confirmés source primaire avant Perplexity pre-TTS.
