# NEXT SESSION — Atlas Shaka Zulu : Vague 2 (carte d3-geo réelle)

> Mis à jour : 2026-05-02 fin session feat/atlas-shaka-zulu-vague1
> Priorité absolue : lire CE fichier avant tout code

---

## ÉTAT ACTUEL — Ce qui est construit (vague 1 terminée)

### Architecture — Remotion pur (PAS un fork de Mansa Moussa)

La décision "fork AtlasMansaMoussaV2Final" du brief précédent **n'a pas été exécutée**.
À la place, Aziz a validé une architecture propre Shaka Zulu native :

- `AtlasShakaFull.tsx` — composition principale (150.32s, 4509 frames)
- `timing.ts` — COMPLET. ElevenLabs Forced Alignment sur narration-v5.mp3. Loss 0.244.
  - 6 segments : HOOK / S1_GEO / S2_MILITAIRE (4 actes) / S3_EXPANSION / S4_NANDI / S5_CTA
  - Inserts définis : 10 triggers avec durationFrames
  - NARRATIVE_BEATS : GQOKLI_HILL / CINQUANTE_MILLE / NANDI_MEURT / DEUIL_NATIONAL / ASSASSINAT
  - Triple-screen S2 défini avec delays + couleur bordeaux
  - PALETTE complète dans timing.ts (OR / BORDEAUX / PARCHEMIN / etc.)

### Scènes existantes (vague 1 = placeholder sans d3-geo)

| Scène | Fichier | État vague 1 | Vague 2 = faire |
|-------|---------|-------------|----------------|
| HOOK | AtlasShakaHook.tsx | Placeholder | Globe ortho d3-geo |
| S1_GEO | AtlasShakaS1Geo.tsx | Fake globe (cercle CSS) | Vraie carte d3-geo KwaZulu |
| S2 A1 Iklwa | AtlasShakaS2A1Iklwa.tsx | Insert plein écran | Garder / enrichir |
| S2 A2 Bouclier | AtlasShakaS2A2Bouclier.tsx | Insert plein écran | Garder / enrichir |
| S2 A3 Cornes | AtlasShakaS2A3Cornes.tsx | Carte + warriors | Vraie carte + sprites impi |
| S2 A4 Synthèse | AtlasShakaS2A4Synthese.tsx | Triple-screen | Enrichir avec vraie carte |
| S3 Expansion | AtlasShakaS3Expansion.tsx | Placeholder | Vraie carte + caravane impi |
| S4 Nandi | AtlasShakaS4Nandi.tsx | Placeholder + MourningWarp | Vraie carte + MourningWarp |
| S5 CTA | AtlasShakaS5CTA.tsx | Cascade Napoléon/Alexandre/Shaka | Finir |

### Composants existants (src/projects/atlas/shaka-zulu/components/)

- `AtlasShakaPalette.tsx` — GARDER. Palette bordeaux/parchemin/or + fonts Cormorant/Cinzel.
- `MourningWarp.tsx` — GARDER. Cercles concentriques deuil Nandi (S4). Validé.
- `MapShakaZulu.tsx` — VERSION VAGUE 1. Remplacer par d3-geo dans vague 2.
- `AtlasShakaInsert.tsx` — composant insert réutilisable.
- `CornesFrame.tsx` / `PaperGrain.tsx` / `SourceCartouche.tsx` — composants visuels.

### Inserts existants (src/projects/atlas/shaka-zulu/inserts/)

- `InsertIklwaSchema.tsx` — iklwa lance courte (S2 A1)
- `InsertBouclierSchema.tsx` — bouclier (S2 A2)
- `InsertCornesSchema.tsx` — formation cornes (S2 A3)
- `InsertNombre1500.tsx` — "1 500" géant (S1)
- `InsertNombre4000.tsx` — "4 000" (S4)

### Données carte (déjà prêtes)

- `src/projects/atlas/shaka-zulu/shaka-zulu-data.json` — 3 projections KwaZulu precompilées
  - `territory` : KwaZulu-Natal focus
  - `expansion` : Afrique australe large
  - `mourning` : zoom intermédiaire (S4)
- Script precompute : `scripts-atlas/precompute-shaka-zulu-data.mjs`

### Audio (public/atlas-shaka-zulu/audio/)

- `narration-v5.mp3` — narration master (150.32s) — PRÉSENTE
- `music-ingoma.mp3` + `music-isicathamiya.mp3` — deux variantes musique — PRÉSENTES
- Pas de narration v4 → v5 directement (v1/v2/v3 aussi présentes)

---

## PLAN VAGUE 2 — Carte d3-geo réelle

### Principe

Vague 1 = architecture + timing + inserts + audio. Tout ça est SOLIDE.
Vague 2 = remplacer les fake globes/cercles CSS par vraie carte d3-geo dans chaque scène.
**Modèle de référence** : `quebec-jacques-poc/src/` — AtlasMercator, AtlasGlobe, AtlasCaravane, AtlasLabel, AtlasPulseMarker.

### Ordre d'exécution scène par scène

**Scène 1 (S1_GEO)** — Priorité absolue
- Remplacer le fake globe par `AtlasMercator` + `shaka-zulu-data.json` (projection `territory`)
- KwaZulu crème `#F5EBD8`, océan `#3A5A7E`, terres terracotta `#C97D5A`
- Labels : uMgungundlovu + GqokliHill (AtlasLabel pill)
- PulseMarker sur uMgungundlovu
- Cartouche "ROYAUME ZULU — 1816"
- Insert `InsertNombre1500` inchangé
- Render 5s → Aziz valide → commit

**Scène 3 Expansion (S3_EXPANSION)** — Après S1 validée
- `AtlasMercator` projection `expansion`
- AtlasCaravane adapté = sprites impi sur path Bezier (KwaBulawayo → nord/ouest)
- Cartouche "100 000 GUERRIERS"
- InsertBarChart : 1 500 → 50 000 (données Shaka)
- Render → valide → commit

**Scène 4 Nandi (S4_NANDI)** — Après S3 validée
- `AtlasMercator` projection `mourning`
- `MourningWarp.tsx` par-dessus (déjà construit)
- Bascule palette OR → BORDEAUX à `NARRATIVE_BEATS.NANDI_MEURT.startFrame`
- `InsertNombre4000` inchangé
- Render → valide → commit

**Scène 2 (S2_MILITAIRE)** — Après S4
- A1/A2 : inserts Iklwa/Bouclier déjà OK → enrichir si besoin
- A3 Cornes : remplacer placeholder carte par `AtlasMercator` + sprites warriors
- A4 Synthèse : triple-screen avec vraie carte au centre
- Render → valide → commit

**Scène 5 CTA (S5_CTA)** — En dernier
- Cascade Napoléon/Alexandre/Shaka (cascade texte déjà définie dans timing.ts)
- Structure identique CTA Mansa Moussa
- Render → valide → commit

**Assembly final**
- Render complet AtlasShakaFull → Aziz valide → Vercel Blob → URL

---

## RÈGLES CRITIQUES POUR CETTE SESSION

### Avant tout code
1. Vérifier si le composant équivalent existe dans `quebec-jacques-poc/src/` → adapter, pas reconstruire
2. Annoncer le choix (fork vs build) à Aziz avant de coder
3. Une scène à la fois. Render 5s mini-render → valide → commit → scène suivante.

### Composants Mansa Moussa à réutiliser
Tous dans `quebec-jacques-poc/src/` :
- `AtlasGlobe` — globe orthographique hook
- `AtlasMercator` — carte plate (S1 / S3 / S4) → passer `shaka-zulu-data.json`
- `AtlasLabel` — labels pill Cormorant Garamond
- `AtlasCartouche` — chiffres choc avec wobble
- `AtlasPulseMarker` — marqueurs lieux
- `AtlasCaravane` — sprite + path Bezier (S3 impi)
- Inserts Pie/Bar/Line — mêmes composants, nouvelles données Shaka

### Ce qui est verrouillé (ne pas rouvrir)
- `timing.ts` — FINAL. Ne pas modifier manuellement.
- Palette bordeaux `#8B1A1A` / parchemin `#F5E6C8` / or `#D4A857` — validée Jury AI.
- `MourningWarp.tsx` — garder pour S4.
- Pipeline d3-geo + precompute JSON — FINAL.
- `narration-v5.mp3` — audio master final.

---

## NETTOYAGE WORKSPACE (optionnel, après S1 validée)

Le brief NEXT-SESSION-BRIEF-COMPLET.md propose une restructuration workspace.
**Ne pas faire en début de session** — risque de tout casser avant d'avoir progressé.
Proposer à Aziz APRÈS la première scène validée.

Structure cible documentée dans `memory/NEXT-SESSION-BRIEF-COMPLET.md` § Étape 1.
