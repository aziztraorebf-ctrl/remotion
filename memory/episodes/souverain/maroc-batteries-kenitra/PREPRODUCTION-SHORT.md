---
name: Maroc Batteries — Pré-production Short validée
description: Script v3 jury-validé + 4 fichiers audio prêts. Session 2026-05-30. Ne pas re-produire avant de lire ce fichier.
type: project
---

# Maroc Batteries — Short 90s — État pré-production (2026-05-30)

> **Statut : PRÉ-PRODUCTION COMPLÈTE** — Script jury-validé, audio v3 retenu, prêt pour production visuelle.
> Prochaine étape : storyboard visuel + planning beats Remotion.

---

## Titre retenu

> **"Le Maroc détient 70% des batteries de demain"**

43 caractères. Chiffre précis + tension implicite. Aucune date calendaire. Validé selon les règles Étape 0.6.

---

## Script v3 — LOCKED (jury GPT-4o + Kimi + Gemini, 2026-05-30)

Score moyen jury : 8/10. 4 ajustements appliqués post-jury.

```
Dans deux ans, la prochaine batterie de votre voiture électrique sortira
peut-être d'ici — d'une usine qui n'existait pas il y a trois ans.

Sous le sol marocain dort soixante-dix pour cent des réserves mondiales de
phosphate — assez pour équiper toutes les voitures électriques prévues d'ici
deux mille quarante. Le phosphate est l'ingrédient clé des batteries nouvelle
génération — celles qui équiperont la majorité des voitures électriques d'entrée
et milieu de gamme.

Pendant des décennies, le Maroc exportait ce phosphate brut. Des cailloux. À bas
prix. D'autres le transformaient, le raffinaient, encaissaient la valeur ajoutée.

Aujourd'hui, à Kénitra, une gigafactory de cent cinquante-six hectares sort de
terre. Gotion High-Tech, chinois. Volkswagen, quarante pour cent actionnaire.
Démarrage : mi-deux mille vingt-six.

Pour le Maroc : sortir enfin du rôle de fournisseur de matière première. L'OCP —
le géant public marocain des phosphates — fabrique désormais les composants qui
entrent directement dans les batteries.
Pour l'Europe : réduire sa dépendance à la Chine sans délocaliser loin. Volkswagen
investit ici. Le Maroc est à deux heures de bateau de l'Espagne.

Le Maroc ne choisit pas entre la Chine et l'Europe. Il devient l'endroit où les
deux fabriquent ensemble. Ce n'est pas de la diplomatie. C'est de la géographie
industrielle.

Et ça pose une question que personne ne formule encore clairement : si le Maroc
contrôle le phosphate ET l'assemblage, qui fixe le prix de la batterie dans dix
ans ?
```

---

## Fichiers audio

| Fichier | Moteur | Config | Durée | URL catbox | Statut |
|---|---|---|---|---|---|
| narration-maroc-v1.mp3 | ElevenLabs V3 | conservative (stability 0.45) | 88s | https://files.catbox.moe/7rx9v6.mp3 | Archive — config trop conservative |
| narration-maroc-v2.mp3 | ElevenLabs V3 | max-style + tags v2 | 93s | https://files.catbox.moe/a0v9zb.mp3 | Archive — script pre-jury |
| narration-maroc-minimax-v1.mp3 | Minimax speech-2.8-hd | voice clone neutral | 92s | https://files.catbox.moe/l9g722.mp3 | Archive — comparaison A/B |
| **narration-maroc-v3.mp3** | **ElevenLabs V3** | **max-style + tags v3** | **109s** | **https://files.catbox.moe/jyrlj1.mp3** | **RETENU** |

**Fichier local retenu :** `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3`

**Voix :** GéoAfrique V2 (`z3gESu49naEZW8Af2Upm`) — config max-style validée :
```json
{ "stability": 0.22, "similarity_boost": 0.55, "style": 0.55, "speed": 1.0 }
```

**Voice clone Minimax (si besoin A/B futur) :** `Voicebbc56c501780172741` — expire après 7j sans usage, recloner depuis narration-v3.mp3 si expiré.

---

## Format visuel retenu — Template B "Hybride Or Africain"

Deux séquences Mapbox + briques Remotion. Architecture beat par beat :

| Beat | Durée | Visuel | Technique |
|---|---|---|---|
| 0 — Hook | ~10s | Carte Mapbox Maroc highlight or + drapeau | Mapbox |
| 1 — 70% phosphate | ~15s | Zoom Khouribga + distance Kénitra-Espagne | Mapbox |
| 2 — Cailloux→cathode | ~18s | Split illustration brut/transformé + stat 5,6 Md$ | Brique data |
| 3 — Acteurs | ~20s | 3 points Hefei/Wolfsburg/Kénitra + arcs convergents | Mapbox |
| 4 — Géographie industrielle | ~12s | Texte oversized fond navy | Brique texte |
| 5 — Question finale | ~10s | Fond noir, texte seul | Brique texte |

---

## Fact-sheet source

Voir `memory/episodes/souverain/maroc-batteries-kenitra/FACT-SHEET.md` — fact-check Perplexity sonar-pro validé 2026-05-19. Chiffres-pilier :

- 5,6 Md$ investissement total (Ecomnews Med 2025)
- 100 GWh/an à terme = 2M véhicules électriques (Gotion/Ecomnews)
- 70% réserves mondiales phosphate (USGS 2024) ✅ vérifié
- 40% VW dans Gotion Morocco (rapports VW) ✅ vérifié
- Démarrage mi-2026 (T2-T3 selon sources)

**Acteurs confirmés :** Gotion High-Tech (Chine), Volkswagen (40%), OCP (Maroc), Stellantis + Renault (usines Kénitra déjà opérationnelles).
**Acteurs retirés :** BMW (non confirmé).

---

## Musique retenue

**C — Analytique Tendu** — oud nerveux + percussions sèches, 80 BPM, style Dhafer Youssef film score
- Fichier local : `public/souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3`
- URL catbox : https://files.catbox.moe/a3j2a5.mp3
- Durée : 147.9s (largement > 109s narration, pas de loop nécessaire)
- Volume Remotion : 0.15 (règle projet)

Alternatives archivées (non retenues) :
- A Tension Industrielle (85 BPM, Amine Bouhafa) : https://files.catbox.moe/jbnbxy.mp3
- B Drive Maghrébin (90 BPM, Ibrahim Maalouf) : https://files.catbox.moe/9qm8qu.mp3
- B Gnawa Industriel v1 (65 BPM) : https://files.catbox.moe/5wxp6o.mp3
- C Oud Analytique v1 (68 BPM, trop lent) : https://files.catbox.moe/4n81b2.mp3

---

## Ce qui reste à faire pour lancer la production

- [x] Forced alignment sur narration-maroc-v3.mp3 → timing.ts ✅ (2026-05-30)
- [x] Forced alignment COMPLET → maroc-words.ts (228 mots) ✅ (2026-05-31)
- [x] Musique retenue : C Analytique Tendu ✅ (2026-05-30)
- [x] Storyboard Gemini v2 + review Kimi ✅ (2026-05-30) → breakdown-gemini-v2.json
- [x] **Beat 0 Hook FINAL** ✅ (2026-05-31) — Mapbox Pull Back, fill-pattern drapeau Maroc, dot pulse, karaoké 228 mots → out/episodes/maroc-batteries/beat0-FINAL.mp4
- [ ] Beat 1 — Mapbox Orbit Khouribga + 70%
- [ ] Beat 2 — Image Gemini phosphate/cathode + Ken Burns
- [ ] Beat 3 — Mapbox 3D sol gigafactory + arcs Gotion/VW
- [ ] Beat 4 — Mapbox Multi-Stop 3 sub-moments
- [ ] Beat 5 — TextChoc navy question finale
- [ ] Assemblage Remotion + render Vercel cloud
