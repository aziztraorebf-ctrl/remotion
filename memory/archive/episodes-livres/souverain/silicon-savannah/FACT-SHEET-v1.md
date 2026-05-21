# Fact-Sheet — Atlas Silicon Savannah (Kenya M-Pesa)

> Document de pré-production. À locker avant toute écriture script.
> Test pilote agents : ce projet sera le premier projet Atlas confié au pipeline 5-agents après validation pré-prod.

---

## Métadonnées

- **Sujet** : Le saut bancaire kenyan — M-Pesa et la "Silicon Savannah"
- **Format prévu** : Short 90-100s (premier test agent)
- **Date Fact-Sheet** : 2026-05-13
- **Pilier de chaîne** : Atlas-hybride (premier épisode contemporain de la série)
- **Sources consultées initiales (à valider Perplexity)** :
  - Safaricom annual reports 2007-2024
  - GSMA State of the Industry Report on Mobile Money
  - Central Bank of Kenya — National Payment Statistics
  - Vodafone Foundation original M-Pesa pilot documentation 2005
  - Critical scholarship : Dr. Bitange Ndemo (ex-Permanent Secretary ICT Kenya), Susan Johnson (Bath Uni), Olivia Donnelly (LSE)

---

## 1. Faits-clés — VALIDÉS PERPLEXITY sonar-pro (2026-05-13, données 2025-2026)

| # | Fait | Verdict | Chiffre validé | Source primaire |
|---|------|---------|----------------|-----------------|
| 1 | M-Pesa lancé commercialement en mars 2007 | CONFIRMÉ | **6 mars 2007** | Safaricom — The M-PESA Journey |
| 2 | Pilote DFID £1M, 2003-2005 | APPROXIMATIF | £1M correct ; pilote terrain : **oct. 2005 – mai 2006** (pas 2003) | Wikipedia M-Pesa + Frontier Fintech |
| 3 | M-Pesa traite ~$1 trillion valeur annuelle | **FAUX** | **>40 000 milliards KES** en FY2024 (~$309B USD) ; FY2025 probablement mid-40T KES — pas de chiffre officiel encore | IIARD Journal 2025, Safaricom FY2024 |
| 4 | >50% du PIB kenyan transite via M-Pesa | CONTESTÉ/DÉPASSÉ | Réel : **~2,5-3x le PIB** en flux bruts — formulation 50% est de 2014-2017, obsolète. Nouvelle formulation : "plusieurs fois le PIB" | IIARD Journal 2025 + World Bank |
| 5 | Frais régressifs (étude Donnelly LSE 2019) | **NON VÉRIFIÉ** | Étude introuvable — ne pas citer. Structure en paliers **confirmée régressive** : envoyer 100 KES coûte ~11% vs <0,3% pour 100 000 KES | Safaricom tarifs 2025 + IIARD 2025 |
| 6 | BCK ~5 ans avant régulation (2007-2012) | APPROXIMATIF | Lettre de non-objection 2007 → guidelines 2010-2011 → **NPS Regulations 2014** (cadre complet). Réponse exacte : **7 ans** jusqu'au cadre formel | IIARD Journal 2025 + NPS Regulations 2014 |
| 7 | Densité agents M-Pesa >250 000 | CONFIRMÉ | **298 900 agents** en 2025 (The Star Kenya, 6 mars 2026, citant données Safaricom 2025) | The Star Kenya, 6 mars 2026 |
| 8 | Kenya leader mondial pénétration mobile money | CONFIRMÉ | **91% pénétration** (comptes actifs / population), juin 2025 — 47,7 millions de comptes actifs | Communications Authority of Kenya, sept. 2025 ; Fintech Magazine Africa 26 sept. 2025 |
| 9 | M-Pesa : nombre de pays en 2025 | CONFIRMÉ | **7 pays** : Kenya, Tanzanie, Mozambique, DRC, Lesotho + Ghana (Vodafone Cash) + Égypte (Vodafone Cash) — **66 millions de clients** Africa-wide FY2024 | Statista "M-Pesa customers Africa 2017-2025" ; Vodafone disclosures |
| 5 | Les frais M-Pesa sur petits transferts sont régressifs (% plus élevé pour les pauvres) | Solide | Étude Donnelly LSE 2019 |
| 6 | La Banque Centrale du Kenya a mis ~5 ans avant de réguler vraiment M-Pesa (2007-2012) | Solide | Documents BCK |
| 7 | Le succès kenyan repose sur la densité agents physiques (>250,000 en 2024) | Solide | GSMA |

**Règle appliquée** : tout chiffre ⚠️ après Perplexity → reformuler ou retirer.

---

## 1bis. Test Atlas-natif

| Critère | Note |
|---|---|
| Territoire fixe et cartographiable | ✅ 1 (Kenya) |
| Mouvement / déplacement / front mobile | ✅ 1 (flux de paiements géographiques) |
| Données chiffrées géolocalisables | ✅ 1 (transactions par région, densité agents) |
| Plusieurs pays / échelle continentale | ⚠️ 0.5 (Kenya focus, mais connexions globales) |
| Cartographie ajoute du sens narratif | ✅ 1 (la carte montre exactement comment le saut technologique a éliminé la distance bancaire) |

**Score : 4.5/5** — Atlas-natif validé.

**Test Récidive vs Événement** : Récidive structurelle (le système M-Pesa fonctionne en continu depuis 17 ans, pas d'événement ponctuel).

**Implication format** : Atlas-natif 4.5/5 + Récidive → Short pilier (pas news). Validé pour le format choisi.

---

## 2. Trois chiffres-pilier (Short)

Ceux qu'on AFFIRME dans la vidéo. Trois, pas plus.

| Rôle narratif | Chiffre validé | Source | Formulation script |
|---------------|---------------|--------|-------------------|
| Hook (choc) | **91% de pénétration** mobile money (comptes actifs / population), juin 2025 — #1 mondial | Communications Authority Kenya, sept. 2025 | "Le Kenya a la plus forte pénétration de paiements mobiles au monde — 91%" ✅ |
| Illustration (tangible) | **300 000 agents M-Pesa** physiques au Kenya (2025) | The Star Kenya, 6 mars 2026 | "300 000 points de paiement physiques — plus que les guichets bancaires de plusieurs pays européens réunis" ✅ |
| Bascule (conséquence) | Structure en paliers : envoyer 100 KES coûte ~11% vs <0,3% pour 100 000 KES | Safaricom tarifs 2025 | "Le saut technologique a un prix : les plus pauvres paient 30 à 40 fois plus en pourcentage" ✅ |
| Bonus (puissance) | M-Pesa traite **plusieurs fois le PIB kenyan** en flux bruts annuels (~2,5-3x) | IIARD Journal 2025 + Safaricom FY2024 | "L'argent d'un pays entier — et plus — circule via un seul service privé" ✅ |

---

## 3. Angle narratif locké (critique honnête)

**Promesse** : Le miracle M-Pesa est réel. Et il a un prix.

**Structure tension** :
- ACTE 1 — La promesse tenue : ce que M-Pesa a vraiment changé pour les Kenyans (inclusion, distance bancaire, vitesse)
- ACTE 2 — Le coût caché : les frais régressifs, la dépendance Safaricom (monopole de fait), l'exclusion numérique des plus pauvres
- ACTE 3 — La vraie question : qui possède l'infrastructure financière d'un pays quand elle appartient à une entreprise privée ?

**Ce que la vidéo affirme** :
- Le saut technologique a EU LIEU (factuel)
- Il a réduit certaines exclusions (factuel)
- Il en a créé d'autres (factuel)
- La question de la souveraineté numérique est ouverte (question, pas affirmation)

**Ce que la vidéo n'affirme PAS** :
- "Nairobi inspire Tokyo" (non vérifiable, puffery)
- "M-Pesa est meilleur que les banques européennes" (comparaison fragile)
- "Le saut technologique est universellement bénéfique" (faux, c'est précisément l'angle qu'on contredit)

---

## 4. Antagonistes / Friction / Voix internes critiques

**Obligatoire pour éviter l'angle PR-tech-optimiste.**

| Voix | Position |
|------|----------|
| Banques commerciales kenyanes (KCB, Equity) | Initialement hostiles à M-Pesa (concurrence). Ont fini par s'adapter (M-Shwari, etc.) |
| Banque Centrale du Kenya | Régulation tardive — a laissé Safaricom devenir trop dominant avant d'agir |
| Susan Johnson (Bath) | Critique académique sur l'inclusion financière "de surface" |
| Olivia Donnelly (LSE) | Critique des frais régressifs (les pauvres paient plus en % qu'à la banque traditionnelle pour de petits montants) |
| Mobile money users (récits internes) | Témoignages cumulés sur les frais, les blocages de compte, les arnaques de fausses transactions |

**Voix interne kenyane à privilégier** : Bitange Ndemo (ex-PS ICT Kenya 2005-2013, architecte côté gouvernement de la révolution mobile). Critique constructif crédible.

---

## 5. Géographie cartographique

**Carte principale** : Kenya en focus
- Nairobi (capitale, hub financier et tech)
- Mombasa (port, axe est-ouest)
- Kisumu (lac Victoria, ouest)
- Garissa (nord-est, frontière Somalie — zone exclusion bancaire pré-M-Pesa)
- Eldoret (Rift Valley)

**Carte secondaire (acte 3)** : extension régionale M-Pesa
- Tanzanie, Mozambique, RDC, Lesotho, Egypte, Afrique du Sud (où M-Pesa a échoué/réussi diversement)

**Carte d'élargissement final (CTA)** : monde — où le modèle M-Pesa a été regardé/copié (Inde, Pakistan, Bangladesh, mais aussi Tigo Money en Amérique latine)

---

## 6. Assets visuels nécessaires

### Carte
- Mapbox Mercator centré Kenya
- Style : papercraft Atlas classique (sepia/navy/or) — décision Aziz 2026-05-13
- Overlays modernes par-dessus pour la collision visuelle

### PixelLab — gratte-ciels (plusieurs, pas un seul)
- UAP Old Mutual Tower (Nairobi)
- KICC (Kenyatta International Convention Centre)
- Britam Tower
- Times Tower
- Sheraton Hotel (skyline iconique)

**But** : permettre de créer un "skyline Nairobi pixel art" reconnaissable comme overlay isométrique sur la carte.

### PixelLab — personnages (plusieurs registres, plusieurs métiers)
- Femme entrepreneure kenyane moderne (smartphone, costume business casual)
- Homme moto-taxi (boda-boda driver) avec téléphone
- Vendeuse de marché (mama mboga) avec petit smartphone
- Étudiant universitaire (Strathmore / Nairobi Uni)
- Développeur tech en bureau (iHub / Andela style)
- Femme âgée recevant un transfert M-Pesa (test : génération réussie ou pas ?)

**But** : montrer la diversité réelle des utilisateurs M-Pesa, pas le cliché "paysan avec sac de grains" du script Gemini.

### PixelLab — objets
- Téléphone Nokia 3310 (M-Pesa originel)
- Smartphone Android moderne (M-Pesa actuel)
- Logo M-Pesa stylisé (à dessiner, pas réutiliser le vrai logo pour des raisons droits)
- Échoppe d'agent M-Pesa (kiosque physique au Kenya)
- Billet de 1000 shillings kenyans (pixel art)

### Inserts Remotion natif ($0)
- Flux d'argent (lignes vertes animées entre points GPS)
- BigStat chiffres (transactions/jour, % PIB, etc.)
- Timeline chronologique 2007-2024
- Comparaison régressivité frais (graphique simple)

### Audio
- Narration ElevenLabs FR (voix Narratrice GeoAfrique v2 — `z3gESu49naEZW8Af2Upm`)
- Musique de fond — à briefer avec audio-director (style : "moderne kenyan, mais pas afrobeat cliché, plutôt ambient électronique avec textures organiques", instruments suggérés : nyatiti modernisée, basse synthé, percussions discrètes)
- SFX : ping notification téléphone (M-Pesa), grattement crayon (frontières carte), légère ambiance urbaine Nairobi

---

## 7. Risques éditoriaux

| Risque | Mitigation |
|--------|------------|
| Tomber dans l'angle PR-tech optimiste | Angle critique honnête lockée (section 3). Friction obligatoire (section 4) |
| Cliché "paysan africain découvre le téléphone" | Personnages diversifiés (section 6). Pas de paysan-avec-sac-de-grains |
| Source unique (Safaricom comm) | Trois sources minimum par fait (section 1) |
| Affirmation "Nairobi = nouveau hub mondial" sans preuve | Retirer toute affirmation comparative non sourcée |
| Sous-estimer la place du gouvernement kenyan | Bitange Ndemo cité (section 4) |
| Surinterpréter "saut technologique" comme magie | Expliquer la mécanique réelle (USSD, agents, régulation permissive) |

---

## 8. Décisions techniques

- **Format** : Short 90-100s
- **Carte** : Atlas papercraft classique + overlays modernes (option A validée)
- **PixelLab** : génération plurielle (plusieurs gratte-ciels, plusieurs personnages — tester les limites)
- **Pipeline** : 5-agents en mode pilote (premier projet Atlas confié)
- **Mode test agent** : on pré-produit ensemble (Aziz + Claude) puis on confie aux agents

---

## 9. Critères de réussite (pour évaluer le pilote agent)

L'épisode est un succès si :
1. Le pipeline 5-agents le produit de bout en bout sans intervention humaine majeure
2. Le résultat tient le canon Atlas visuellement
3. L'angle critique honnête est préservé (pas dérivé vers PR-tech optimiste par les agents)
4. Aucun chiffre non vérifié n'est affirmé
5. Au moins 4 personnages PixelLab et 3 gratte-ciels sont générés et utilisés
6. Coût total reste sous les budgets API (PixelLab $4.94 dispo, ElevenLabs 54k chars dispo)
7. La friction agent (interventions Aziz nécessaires) est documentée pour itérer le pipeline
