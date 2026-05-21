---
name: Xénophobie SA — À faire à la reprise
description: Checklist complète pour reprendre la production proprement après pause.
type: project
---

# À faire à la reprise — Checklist complète

**À ouvrir EN PREMIER** quand on reprend ce sujet, après lecture de 00-INDEX et 01-NOTE.

---

## Phase 1 — Mise à jour des données (1-2 sessions)

### Sources primaires à accéder directement
- [ ] **Xenowatch** (xenowatch.ac.za) — exporter chiffres cumulatifs 1994 → date courante. Vérifier date dernière mise à jour. Citer.
- [ ] **Stats SA** (statssa.gov.za) — chômage des jeunes dernier trimestre disponible
- [ ] **Banque mondiale** (data.worldbank.org) — indice Gini SA dernière année disponible
- [ ] **Afrobarometer** (afrobarometer.org) — vérifier round 10 SA disponible, attitudes vis-à-vis immigrés
- [ ] **ACHPR** (achpr.au.int) — déclarations récentes Commission africaine sur xénophobie SA
- [ ] **Archives presse SA** (Daily Maverick, EWN, IOL) — vérifier date fondation Operation Dudula précise
- [ ] **Verdict Addington Primary School** — état procédure judiciaire (inculpations Operation Dudula + MK Party + March and March janvier 2026)

### Veille bruit social
- [ ] Relancer skill `last30days` : "South Africa xenophobia [mois courant] [année]"
- [ ] Vérifier nouvelles vagues éventuelles depuis pause
- [ ] Noter évolution narratifs en circulation

### Veille Souverain
- [ ] Vérifier audience Or Africain (signal demande sujets Souverain ?)
- [ ] Vérifier état Hannibal (terminé/publié ?)
- [ ] Vérifier crédits API disponibles (OpenRouter, ElevenLabs, fal.ai, Mapbox)

---

## Phase 2 — Décision Go/No-Go (1 session)

### Tableau de décision
- [ ] Faits xénophobie SA toujours pertinents ? OUI/NON
- [ ] Énergie créative pour sujet sensible ? OUI/NON
- [ ] Pipeline Souverain validé sur autres sujets entre-temps ? OUI/NON
- [ ] Crédits suffisants ? OUI/NON
- [ ] **Si toutes OUI → produire**. Sinon → re-pause + raison documentée

---

## Phase 3 — Pré-production officielle (2-3 sessions)

### Fact-Sheet officielle
- [ ] Ouvrir `memory/templates/fact-sheet-souverain-v1.md` (v2)
- [ ] Remplir entièrement (les 9 sections)
- [ ] Croiser avec données mises à jour Phase 1
- [ ] Validation Aziz section par section

### Audit assets vidéo source (Acte I)
- [ ] Lister 5-10 clips vidéo candidats (marches Operation Dudula, discours leaders, déclarations publiques)
- [ ] Pour chacun : source identifiée, droits clarifiés, niveau de re-victimisation, alternatives
- [ ] Décision tranchée : licence (AP/Getty/Reuters $50-300) ou fair use éditorial
- [ ] Téléchargement et trimming à 6-8s, audio coupé

### Tests visuels mini-renders
- [ ] **Mini-render 1** : Acte II.1 carte couloirs ANC en 5 versions (Options A/B/C/D/E pour traitement territoires)
- [ ] **Mini-render 2** : Portrait Mandela photo archive vs Gemini stylisé
- [ ] **Mini-render 3** : Portrait Malema photo vs Gemini stylisé
- [ ] **Mini-render 4** : Composant `<DocumentaryQuote />` 3 variants (center / portrait-left / portrait-right)
- [ ] **Mini-render 5** : Hook Acte I avec clip réel intégré dans cadre téléphone
- [ ] **Mini-render 6** : Background Gemini "papier vieilli grille éditoriale" — tester 3 prompts
- [ ] Validation Aziz sur chaque mini-render avant production complète

### Décisions verrouillées
- [ ] Traitement couleurs territoires Mapbox : option finale
- [ ] Portrait Mandela : photo ou Gemini
- [ ] Portrait Malema : photo ou Gemini
- [ ] Clip Acte I : source + permission verrouillée
- [ ] Carte de base : forking carte v5 Or Africain
- [ ] Brief musique Minimax précis

---

## Phase 4 — Script (1-2 sessions)

- [ ] Réécrire script complet basé sur storyboard V1 + données mises à jour
- [ ] Appliquer les 8 mots interdits (voir 04-DECISIONS-OUVERTES.md)
- [ ] Insérer les 3 chiffres-pilier vérifiés Phase 1
- [ ] Vérifier section "voix internes critiques" remplie (5 voix minimum)
- [ ] Pass jury IA (sceptique, créatif, fact-checker) sur script v1
- [ ] Itération script v2

### Perplexity pre-TTS (RÈGLE D'OR)
- [ ] Lancer `perplexity/sonar-deep-research` sur script verrouillé
- [ ] Vérifier chaque affirmation factuelle
- [ ] Coût attendu : ~$0.03-0.07
- [ ] Corriger script v3 si nécessaire

### TTS Audio
- [ ] Scanner règles TTS ElevenLabs FR (participes "e/ee", "ont + voyelle", nombres en lettres)
- [ ] Générer audio ElevenLabs Narratrice GeoAfrique v2
- [ ] Mesurer via ffprobe
- [ ] Validation oreille Aziz

---

## Phase 5 — Production assets (3-4 sessions)

### Mapbox compositions
- [ ] Acte I.2 : Mapbox Afrique → SA zoom
- [ ] Acte II.1 : Mapbox couloirs ANC + cercles SVG ornementés
- [ ] Acte II.3 : Mapbox flèches inverses (4 pays vers SA)
- [ ] Acte IV.1 : Mapbox zoom Durban progressif
- [ ] CTA : Mapbox Afrique unifiée finale
- [ ] Render via `./scripts/render-mapbox.sh`

### Gemini assets
- [ ] Background éditoriaux : papier vieilli grille, papier journal, papier académique, fond noir charbon (4 variants)
- [ ] Portrait Mandela (si Gemini choisi)
- [ ] Portrait Malema
- [ ] Illustration Acte IV.2 école Addington (charcoal sépia, no faces visible)
- [ ] Silhouettes éditoriales (si nécessaires)

### ElevenLabs SFX (optionnel)
- [ ] Notification téléphone très discrète Acte I
- [ ] Trim selon pattern feedback existant

### Composant `<DocumentaryQuote />`
- [ ] Créer dans `src/projects/souverain/_shared/`
- [ ] Props : `text`, `source`, `variant`
- [ ] Variants : center / portrait-left / portrait-right
- [ ] Tests unitaires + mini-render validation

---

## Phase 6 — Assemblage Remotion (2-3 sessions)

- [ ] Créer composition `SouverainXenophobieSA.tsx`
- [ ] Audio-derived timing (jamais hardcodé)
- [ ] TransitionSeries entre actes
- [ ] Sous-titres Whisper karaoke per-scene
- [ ] StatGauge actes V.3
- [ ] Mini-renders frame-précis pour validation visuelle
- [ ] Render full HD via render-mapbox.sh

---

## Phase 7 — Quality + Publication (1-2 sessions)

- [ ] Self-review Claude (frames + script + timing)
- [ ] Brief Kimi K2.5 (artefacts techniques uniquement)
- [ ] Validation finale Aziz (œil + oreille + décision créative)
- [ ] Compression CRF 28
- [ ] Upload Vercel Blob ou Catbox
- [ ] Description vidéo : sources citées, attribution Mapbox, crédit clip si licencié
- [ ] Publication Postiz YouTube + multi-plateformes

---

## Estimation totale à la reprise

**Sessions** : 10-15 sessions (~2-3 semaines si dédiées)
**Coût API** : $1-3 (audio + assets + Perplexity)
**Coût licences éventuelles** : $50-300 (clip Acte I si pas fair use)

---

## Triggers pour annuler ou repauser

À tout moment dans les phases 1-2, **arrêter et re-pauser** si :
- [ ] Faits 2026 deviennent obsolètes ou se complexifient drastiquement
- [ ] Sujet trop chaud (nouvelle vague récente non stabilisée)
- [ ] Sources primaires inaccessibles (Xenowatch down, Afrobarometer round 10 pas dispo)
- [ ] Énergie créative pas alignée
- [ ] Hannibal pas terminé

**La règle** : ne jamais forcer la production d'un sujet sensible. Si ça résiste, repauser sans culpabilité.
