# Brief Jury Hybride — Pass 2 (Validation Vague 2 Atlas Shaka Zulu)

## Contexte (verrouille — ne pas remettre en question)

- **Projet** : Atlas Shaka Zulu, Short YouTube documentaire historique vertical 9:16, 150s
- **Format 150s confirme valide** : YouTube Shorts a etendu sa limite a 3 minutes en octobre 2024 (verifie WebSearch). Ton ne porte plus sur "decouper en 60s".
- **Audio** : narration ElevenLabs v5 forced-aligned (loss 0.244), VERROUILLE
- **Structure 6 segments** : Hook / S1 (territoire KwaZulu-Natal) / S2 (4 actes : iklwa, bouclier, cornes de buffle, Gqokli Hill) / S3 (expansion territoriale) / S4 (mort de Nandi, spirale, deuil) / CTA
- **Vague 1B faite** : 5 inserts SVG Remotion pur (iklwa, bouclier, cornes, 4000 morts, 1500 enrichi). Notes Kimi 6-6.5/10. 4 inserts ont cartouches sources, 2 manquent.
- **Pass 1 jury fait** : vous avez deja repondu a 5 questions methodologiques (GPT-4o 8/10, Grok 7/10, Gemini-3-flash-preview 8.5/10). Top 5 idees identifiees.

## Stack precis disponible

| Outil | Usage | Cout |
|-------|-------|------|
| **Remotion 4 + React/TypeScript** | Composition video, animations | gratuit |
| **SVG natif + spring/interpolate** | Animations geometriques, layouts, filtres | gratuit |
| **d3-geo + Natural Earth GeoJSON** | Cartes geographiques precises (deja teste sur Mansa Moussa V2) | gratuit |
| **PixelLab MCP** | Sprites pixel art, walk cycles, animations personnages (deja teste : Mansa Moussa caravane qui sort du Mali) | 1 credit/sprite, 2000/mois (quasi gratuit) |
| **Gemini 3 Pro / Imagen** | Illustrations paper-craft pour images sources Seedance | ~$0.067/image |
| **Seedance 2.0 image-to-video** | Clips video 5s a partir d'image Gemini, style papercraft cinematique (deja teste sur Sonjata, Thiaroye, Mansa Moussa, Francs Tirailleurs) | ~$0.30/clip |
| **Recraft** | Vectorisation d'images en SVG | inclus |
| **Minimax (fal.ai)** | Musique generative originale | ~$0.10/track |

## Limites precises de l'agent (Claude) en SVG pur

**Important pour vos recommandations :** Claude fait BIEN les formes geometriques simples + animations + layouts + filtres. Il fait MAL les silhouettes humaines, les cartes dessinees a la main, et les formes organiques detaillees.

**Consequences :**
- Pour silhouettes/personnages : utiliser PixelLab (sprites) ou Gemini (illustrations)
- Pour cartes : d3-geo + Natural Earth, jamais de polygones manuels
- Pour formes organiques (cornes de buffle stylisees) : preferer geometrique minimaliste (2 arcs Bezier) OU Gemini → vectorisation Recraft

---

## Liste vague 2 selectionnee (a valider)

### Priorite HAUTE (a coder en vague 2)

1. **Hook combo cinematique + typo** : Clip Seedance papercraft 5s (image source Gemini : Shaka adulte de dos contemplant le territoire KwaZulu-Natal) + gravure typographique "Il est ne paria" en Cormorant Garamond par-dessus, transition zoom-out vers carte d3-geo.

2. **Cartouches sources iklwa + bouclier** (quick win, 2 inserts manquants). Source proposee : "J. LABAND · The Rise and Fall of the Zulu Kingdom".

3. **Carte d3-geo reelle** (reutilisation moteur Mansa Moussa V2, zone KwaZulu-Natal, palette Shaka : parchemin/bordeaux/or). Utilisee sur S1 (territoire), S3 (expansion), S4 (deformation mort Nandi).

4. **Composant signature "Cornes de buffle"** aux transitions de segments. Decision a trancher : geometrique minimaliste (2 arcs SVG) OU Gemini → Recraft vectorise. **A vous de recommander.**

5. **PixelLab caravane impi sur carte S3** : equivalent du moment "Mansa Moussa qui sort du Mali avec sa caravane". 3-4 sprites guerriers zoulous qui parcourent le territoire qui s'etend pendant la conquete. Sur la carte d3-geo reelle, palette Shaka.

6. **Deformation S4 organique** : combinaison Grok (Echo Maternel = ondes concentriques SVG depuis le palais) + Gemini (feDisplacementMap + feTurbulence sur la carte du KwaZulu).

7. **Traitement Blueprint des inserts existants** : cadres techniques + sans-serif moderne (Inter/JetBrains Mono) pour donnees + Cormorant Garamond pour sources. Anti-piege "guerrier primitif" (Gemini Q5 pass 1).

### Priorite MOYENNE (vague 3 si pertinent)

8. Voronoi-Conquete (alternative a la carte simple S3 : tessellation qui mange le territoire)
9. Fil d'Ariane narratif bas ecran (a tester sur 1 segment)
10. Compteur dynamique S3 (population qui defile)
11. Citations academiques entre transitions
12. Filtre blur progressif S4

---

## Vos 4 questions

### Q1 — Validation idee par idee (priorite HAUTE)

Pour chaque idee 1 a 7, repondre :
- **Approuves-tu ?** (oui / non / oui avec amendement)
- **Si non ou amendement** : 1 paragraphe pour expliquer pourquoi + alternative concrete
- **Si oui** : 1 phrase pour confirmer

### Q2 — Implementation concrete par outil

Pour chaque idee approuvee, donne le decoupage technique precis :
- Quelle partie utilise SVG pur ?
- Quelle partie utilise d3-geo + Natural Earth ?
- Quelle partie utilise PixelLab ?
- Quelle partie utilise Gemini / Seedance ?
- Quelle partie utilise Recraft (vectorisation) ?

**Important :** raisonne avec les limites de Claude (mauvais en silhouettes / formes organiques manuelles). Ne propose pas de SVG pur pour des elements complexes.

### Q3 — Transition stylistique cinematique → carte

Le hook (idee 1) commence par un clip Seedance papercraft 3D cinematique puis passe a une carte d3-geo 2D plate. Comment eviter la rupture stylistique ?

Propose **3 transitions concretes** dans notre stack (Remotion + d3-geo + filtres SVG + Seedance), avec pour chacune :
- Description (3-4 phrases)
- Outil(s) utilise(s)
- Cout dev estime (en sachant que Claude code rapidement)

### Q4 — Gap detection

- Vois-tu une **8e idee critique** qu'on a oubliee compte tenu du brief, du stack disponible, et des reviews du pass 1 ?
- Vois-tu un **piege technique** qu'on n'a pas anticipe (perf Remotion + d3-geo + PixelLab + filtres SVG simultanes ; fonts manquantes ; export final ; compatibilite ; etc.) ?

---

## Format de reponse attendu

```
## Q1 — Validation
### Idee 1 — Hook combo cinematique + typo
- Verdict : [oui/non/amendement]
- Commentaire : [1 phrase si oui, 1 paragraphe si non]
[... idees 2 a 7 ...]

## Q2 — Implementation
### Idee 1
- SVG pur : [...]
- d3-geo : [...]
- PixelLab : [...]
- Gemini/Seedance : [...]
- Recraft : [...]
[... idees 2 a 7 ...]

## Q3 — Transitions cinematique → carte
### Transition A
- Description : [...]
- Outils : [...]
- Cout : [...]
### Transition B [...]
### Transition C [...]

## Q4 — Gap detection
- 8e idee : [...]
- Piege technique : [...]
```

---

## Reminder

- Audio + structure VERROUILLES (ne pas reproposer un nouveau script)
- Format 150s VERROUILLE (ne pas reproposer de decouper en 60s)
- Nous voulons des reponses operationnelles, pas theoriques
- Sois critique : si une idee est faible, dis-le
