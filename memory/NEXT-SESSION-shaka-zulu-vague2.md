# NEXT SESSION — Atlas Shaka Zulu Vague 2

> Crée 2026-05-02 fin de session. Prochaine session = discussion + tri des inputs + decisions strategiques avant code.

---

## 🎯 OBJECTIF DE LA PROCHAINE SESSION

Discussion structurée à 4 entrées :
1. **Avis Aziz** sur ce que Claude a construit en autonome cette nuit (vague 1B inserts Remotion pur)
2. **Synthèse Kimi** sur les 5 inserts (notes 6-6.5/10, top améliorations)
3. **Synthèse Jury Hybride** (3 nouveaux LLMs : alertes critiques, top 5 idées)
4. **Décisions stratégiques** avant de coder vague 2

---

## 📂 CE QUI EST PRÊT À CONSULTER

### Code existant (commits sur branche `feat/atlas-shaka-zulu-vague1`)
- `src/projects/shaka-zulu/` : 5 helpers + 2 components + 8 scenes + composition Full + 5 inserts SVG Remotion pur
- `src/Root.tsx` : 13 compositions enregistrées (Full + 8 scenes + 5 inserts)
- `public/atlas-shaka-zulu/` : audio narration v5 + assets PixelLab + inserts Gemini + renders/mini-renders/

### Mini-renders à voir (Finder local — Vercel Blob suspended)
- `01-hook.mp4` à `06-s5-cta.mp4` : vague 1 (avec inserts images)
- `v2-iklwa-schema.mp4` à `v2-1500-enrichi.mp4` : **vague 1B (Remotion pur, philosophie Mansa Moussa)**

### Reviews et synthèses
- `memory/atlas-shaka-zulu/kimi-reviews/{iklwa,bouclier,cornes,4000,1500}.md` — Kimi insert par insert
- `memory/atlas-shaka-zulu/jury-reviews/{openai-gpt4o,xai-grok,gemini-3-flash}.md` — Jury hybride
- `memory/atlas-shaka-zulu/JURY-SYNTHESE.md` — **synthèse comparative (à lire en premier)**
- `memory/atlas-shaka-zulu/SESSION-2026-05-02-NUIT-AUTONOME.md` — note travail nuit

---

## 🚨 ALERTES CRITIQUES À DISCUTER

### Alerte 1 — Format 150s vs Shorts 60s YouTube (Gemini)
**Question stratégique URGENTE** : tu vises le Shorts Feed YouTube ou la vidéo verticale long-form ?
- Option A : long-form 150s sur YouTube (sort du Shorts Feed)
- Option B : couper en 3 Shorts de 50s (recouper script + générer 3 audios)
- Option C : publier sur Reels Instagram + TikTok long-form

### Alerte 2 — Hook trop textuel (Grok)
Manque d'impact viscéral en 3s. Solutions possibles :
- Animation gravure du texte au lieu de spring simple
- Silhouette qui "saigne" en or
- Flash visuel à l'impact

### Alerte 3 — Carte d3-geo réelle manquante (3/4 LLMs convergents)
Priorité infrastructure : sans vraie carte (S1 globe ortho, S3 territoire qui s'étend, S4 KwaZulu qui se déforme), l'épisode reste en gradient fake. Mansa Moussa V2 a des cartes vraies, Shaka pas encore.

---

## 💎 TOP 5 IDÉES À INTÉGRER (jury convergent)

| # | Idée | Sources | Coût dev |
|---|------|---------|----------|
| 1 | **Vraie carte d3-geo + Natural Earth** (S1, S3, S4) | 3/4 LLMs | 8-12h |
| 2 | **Composant signature "Cornes/Iklwa-Slash"** aux transitions | 3/4 LLMs | 4-7h |
| 3 | **Déformation organique S4** (`feDisplacementMap` + onde concentrique) | Grok + Gemini | 6-8h |
| 4 | **Cartouches sources** sur iklwa et bouclier (manquantes) | Kimi + Grok | 30min |
| 5 | **Traitement "Blueprint"** des inserts (typo data tech + cadres) | Gemini Q5 | 2h |

---

## 🎁 IDÉES UNIQUES INSPIRANTES (à trier ensemble)

| Idée | LLM | Pour quelle scène | Verdict Claude |
|------|-----|-------------------|---------------|
| **Voronoi-Conquête** (cellules qui "mangent" le territoire) | Gemini | S3 expansion | Brillant techniquement, 10h. Vague 2. |
| **Carte Écho Maternel** (ondes concentriques deuil) | Grok | S4 mort Nandi | Poétique 5-7h. À combiner avec Gemini. |
| **Conteur interactif / fil d'Ariane bas écran** | GPT-4o | Toute la vidéo | À tester sur 1 segment d'abord, risque chargé en portrait |
| **Tableau de Bord Commandement** (sans-serif data + Cormorant sources) | Gemini | Tous inserts | Anti-piège "guerrier primitif". Coût 2h, ROI immense. |

---

## ⏳ AGENDA SUGGÉRÉ POUR LA PROCHAINE SESSION

### Phase 1 — Discussion (30-45 min)
1. Aziz regarde les mini-renders v1 et v2 dans le Finder local
2. Aziz lit `JURY-SYNTHESE.md`
3. Discussion sur :
   - Décision format 150s (alerte #1)
   - Validation des 5 inserts vague 1B (Kimi : 6-6.5/10, qu'est-ce qu'on garde ?)
   - Top 5 jury : on intègre tout ? on en jette ?

### Phase 2 — Décision technique (15 min)
- Carte d3-geo réelle : maintenant ou plus tard ?
- Composant signature : cornes ou iklwa-slash ?
- Cartouches sources iklwa/bouclier : quick win immédiat ?

### Phase 3 — Construction vague 2 (le reste de la session)
- Selon décisions phase 2 : code + mini-renders + validation

---

## 📊 BILAN BUDGET & PROGRÈS SESSION NUIT 2026-05-02

**Coûts totaux de cette session : ~$0.93** (cap était $5)
- Gemini 4 inserts génériques : $0.27
- Seedance hook : $0.30
- Minimax 2 musiques : $0.20
- Kimi 5 reviews inserts : ~$0.10
- Jury 3 LLMs : $0.029
- ElevenLabs Forced Alignment : $0 (déjà payé)

**Code produit cette session :**
- 1700+ lignes TypeScript (helpers + composants + scenes + inserts)
- 5 inserts SVG Remotion pur (philosophie Mansa Moussa V2)
- 9 mini-renders v1 + 5 mini-renders v2
- 2 nouveaux workflows mémoire (Kimi creative + Jury hybride)
- 1 synthèse comparative Jury

**Branche git :** `feat/atlas-shaka-zulu-vague1` (3 commits, prêt à merger ou continuer)

---

## 🎓 CE QU'ON A APPRIS CETTE SESSION

1. **PixelLab MCP gotchas** : breathing-idle = 4 frames pas 8. Documenté dans `feedback_remotion-pixellab-gotchas.md`
2. **Inserts doivent être Remotion pur** (règle Aziz) — pas images qui pivotent
3. **Workflow Kimi creative pre-build** = étape 7 canonique du pipeline Atlas
4. **Workflow Jury Hybride creatif** = étape 7.5 canonique du pipeline Atlas
5. **Vercel Blob plan Hobby = 1GB limite** — atteint cette session, store suspended
6. **Verifier les noms de modeles AVANT de lancer** : `gemini-3-flash` n'existe pas, c'est `gemini-3-flash-preview`. `gpt-5` requiert verification org → fallback `gpt-4o`.

---

## 🚀 STARTER PROMPT POUR LA PROCHAINE SESSION

> Lis `memory/NEXT-SESSION-shaka-zulu-vague2.md` puis `memory/atlas-shaka-zulu/JURY-SYNTHESE.md`.
>
> Ouvre le Finder sur `public/atlas-shaka-zulu/renders/mini-renders/` — Aziz va regarder les v1 et v2.
>
> Status : vague 1B inserts Remotion pur sont produits. Reviews Kimi + Jury Hybride faites. Décisions stratégiques en attente : format 150s (alerte critique Gemini), top 5 idées jury à intégrer ou pas, validation 5 inserts vague 1B.
>
> Ne commence aucun code avant la discussion avec Aziz.
