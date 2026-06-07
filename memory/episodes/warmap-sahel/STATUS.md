# War-Map Sahel AES — STATUS

**Dernière mise à jour :** 2026-06-07 (session 3 — Acte 1 prototype + verdict Aziz)
**Session active :** Acte 1 prototypé. VERDICT : bases à refondre en session dédiée.

---

## ⚠️ VERDICT SESSION 3 (2026-06-07) — ACTE 1 = PROTOTYPE, À REFONDRE EN SESSION DÉDIÉE

Acte 1 v1 rendu (catbox wuadef.mp4). Gros progrès vs départ MAIS Aziz identifie un
problème de FOND : **on a empilé des effets "intéressants" sans que chacun soit COMPRIS
par le spectateur.** Décision : NE PAS bricoler l'Acte 1 en fin de session (il pose les
bases de TOUTE la série). Session dédiée fraîche avec recherche + review externe.

**6 commentaires Aziz (à traiter en session dédiée) :**
1. **Trop de couleurs partout = nuit à la lisibilité** (surtout 16:9). Le pulse de frontière
   ne ressort pas car pas de calme contre lequel contraster. CHANGEMENT DE PARADIGME à creuser.
2. **Cercle CEDEAO + boom = incompréhensible** : cercle abstrait qui se brise, le spectateur
   ne sait pas que c'est la CEDEAO qu'on quitte. Esthétique mais pas pédagogique.
3. **Flèches convergence restent 15s sans rien faire** : doivent converger PUIS disparaître.
4. **Cartons redondants avec la voix** ("JNIM lié à Al-Qaïda" pendant que la voix le dit).
5. **Véhicules JNIM/EIGS trop similaires** (même silhouette, juste teinte) + **statiques 20s**
   (apparaissent et restent plantés = ne racontent rien).
6. **Cercles/halos semi-transparents inexpliqués** : polluent sans fonction claire.

**3 ajouts Claude (corpus) pour la session dédiée :**
- "Contraste par le calme" : carte majoritairement sobre, couleur = PROJECTEUR local sur la
  zone dont on parle à l'instant T (ni neutre vide, ni tout coloré). À valider en recherche.
- Règle dure série : "1 élément = 1 fonction narrative claire". Avant d'ajouter un effet :
  "qu'est-ce que le spectateur comprend grâce à lui ?" Si rien que la voix ne dise = on n'ajoute pas.
- Différencier les factions par la FORME/symbole, pas juste la couleur (se confond en mouvement).

**PLAN SESSION DÉDIÉE ACTE 1 (fondatrice de la série) :**
1. RECHERCHE RÉELLE (arrêter de deviner) : yt-dlp + TubeLab + study days + skills + ce qu'on a
   déjà décodé → comment les meilleures chaînes gèrent densité couleur / intro éléments / diff unités.
2. REVIEW EXTERNE Gemini+Kimi ciblée LISIBILITÉ + **AI-SLOP** (brief lancé session 3, résultats
   dans /tmp/da-refs/da-acte1-aislop-{gemini,kimi}.md — À RELIRE en début de session dédiée).
3. Reposer la DOCTRINE Acte 1 comme fondation, puis reconstruire proprement.

**Honnêteté Claude (limite scope) :** je devine trop, je n'ai pas de boucle de validation
perceptive (je juge l'esthétique sur frames, pas la compréhension en mouvement+son). D'où
l'importance des yeux Aziz + reviews externes. Ne plus deviner les "meilleures manières".

---

## État actuel

| Composant | Statut | Notes |
|-----------|--------|-------|
| Script V4-final | FINAL | `SCRIPT-V4-FINAL-2026-06-07.md` |
| Audio narration V1 | FINAL | `narration-v1.mp3` (439.37s, 7:19) |
| Forced alignment | FINAL | `narration-v1-alignment.json` (2099 mots, loss=0.2965) |
| Timing triggers | FINAL | `TIMING-V1-2026-06-07.md` (27 triggers) |
| sahel.warmap.json | FINAL | 15 jalons + 6 véhicules + 3 réfugiés + 2 overlays |
| SahelControlData.ts | FINAL | Import JSON via adapter canonique |
| SahelWarMapEngine.tsx | **V3 OPÉRATIONNEL** | Map Animation intégré : flèches hook + expansion Act2 + tenaille Act3 + flux Act4 |
| Hook Acte 1 | V3 RENDU | catbox litter.catbox.moe/nl5u0g.mp4 (30s @50%) — flèches hook encore en <line> sur ce rendu, V3 non rendu |
| SahelAttackArrow.tsx | **CRÉÉ** | `src/projects/warmap/_shared/` — flèches Mapbox via map.project(), marching ants, tête orientée |
| TerritorialExpansion.tsx | **CRÉÉ** | `src/projects/warmap/_shared/` — zones colorées qui grandissent, données Act 2 JNIM incluses |
| RefugeeFlow.tsx | **CRÉÉ** | `src/projects/warmap/_shared/` — rubans SVG animés, 3 corridors Act 4 inclus |
| GeoJSON admin-1 | APPROXIMATIF | Bbox 5-pts — formes réelles à générer |
| Sprites véhicules | PRÉSENTS | `tech-td-red.png` + `tank-td-blue.png` confirmés dans `public/_shared/sprites/warmap/` |
| Sprites réfugiés | PRÉSENT (générique) | `portrait-civil.png` existe — 3 visages Sahel distincts restent à générer Gemini |
| Doctrine script-first | AJOUTÉE | `WARMAP-LONG-DOCTRINE.md` section "RÈGLE ABSOLUE" + traçabilité `// SCRIPT:` obligatoire |

---

## Ce qui fonctionne (validé V2)

- Carte Sahel parchemin centrée Mali+Burkina+Niger
- Couleurs factions : bleu (état), rouge (JNIM), or (contesté)
- Légende 3 factions haut-gauche
- Date + label jalon haut-droite
- Labels villes **progressifs** (apparaissent au mot exact de la narration)
- Drift caméra **perceptible** (amplitude ×3 vs V1)
- Caméra **figée 2s** pendant "Comment est-ce possible ?" (f572→f632)
- **Hook Act 1 codé script-first** : 3 flashs pays blancs + anneau CEDEAO + vecteurs capitales → Liptako or + carton freeze
- HUD parchemin (même esthétique Sudan)
- Véhicules **taille ×2.5** (lisibles en 16:9)
- Véhicules **audio-triggered** (JNIM f1198, FAMa f7279, CSP f8683)
- Overlay AES née (f7014)
- CTA final (f13200)
- Composition enregistrée `SahelWarMap` dans Root.tsx

---

## Triggers hook Act 1 (depuis forced alignment)

| Frame | Mot | Événement codé |
|-------|-----|----------------|
| f150 | "expulsé" | Flash blanc radial Mali |
| f231 | "Rompu" | Flash blanc radial Burkina |
| f301 | "Quitté" | Flash blanc radial Niger |
| f382 | "continent." | Anneau CEDEAO clignote orange × 3 → s'éteint |
| f502 | "nouveau." | 3 vecteurs capitales → Liptako pulse or |
| f572 | "possible" | CARTE FIGÉE 2s + carton "Comment est-ce possible ?" |
| f726 | "répondre" | Drift reprend |

---

## Problèmes ouverts (à corriger avant render final)

1. **GeoJSON approximatif** : sahel-admin1.geojson = bbox rectangulaires. Générer le vrai GeoJSON Natural Earth/GADM admin-1 Mali+BF+Niger. Script : `python3 scripts/warmap/generate-sahel-admin1.py`

2. **Portraits réfugiés Sahel** : `portrait-civil.png` générique Sudan utilisé — 3 visages sahéliens distincts (homme/femme/enfant, traits ouest-africains) à générer Gemini pour la version finale.

3. **Overlay AES née** : apparaît frame ~7014 — à valider visuellement au bon timing sur rendu complet.

4. **River Flow animation** (Template 4, non fait) : fleuve Niger SVG path animé — optionnel, enrichissement esthétique.

5. **Animatic complet non rendu** : render 439s nécessaire pour valider timing Map Animation sur narration réelle.

---

## Map Animation — INTÉGRÉ V3 (session 2026-06-07 session 2)

| Template | Statut | Fichier | Intégration moteur |
|---|---|---|---|
| Army Arrows (SahelAttackArrow) | **CODÉ + INTÉGRÉ** | `warmap/_shared/SahelAttackArrow.tsx` | Hook f502 (3 flèches), Act2 Libye f2630, Act3 tenaille f8218+f8248, contre-off f9477 |
| Territorial Expansion | **CODÉ + INTÉGRÉ** | `warmap/_shared/TerritorialExpansion.tsx` | Act2 f2630→f4800, 8 régions JNIM avec delays |
| Refugee Flow | **CODÉ + INTÉGRÉ** | `warmap/_shared/RefugeeFlow.tsx` | Act4 f10294+, 3 corridors (Djibo/Ménaka/Tillabéri) |
| River Flow (Niger) | NON FAIT | — | Priorité 4, optionnel |

---

## Fichiers clés

- **Moteur** : `src/projects/warmap/engine/SahelWarMapEngine.tsx`
- **Data** : `src/projects/warmap/data/sahel.warmap.json`
- **Control** : `src/projects/warmap/engine/SahelControlData.ts`
- **Audio** : `public/_shared/audio/sahel-warmap/narration-v1.mp3`
- **GeoJSON** : `public/_shared/geo-data/sahel/sahel-admin1.geojson` (bbox approximatif)
- **Alignment** : `public/_shared/audio/sahel-warmap/narration-v1-alignment.json`
- **Doctrine** : `memory/doctrines/WARMAP-LONG-DOCTRINE.md` (règle script-first ajoutée)
- **Renders WIP** : `out/episodes/warmap-sahel/wip/`
  - `sahel_hook_v3.mp4` — Hook 30s @50% — catbox litter.catbox.moe/nl5u0g.mp4

---

## Prochaines actions (ordre priorité)

1. **Animatic complet (439s)** : `scripts/render-on-vercel.py` — valider timing Map Animation sur narration réelle
2. **Validation Aziz** : review animatic complet, ajuster opacités/timings flèches/expansion
3. **GeoJSON réel** : remplacer bbox par formes admin-1 Natural Earth/GADM (`python3 scripts/warmap/generate-sahel-admin1.py`)
4. **Portraits réfugiés Gemini** : 3 visages sahéliens distincts
5. **River Flow** (optionnel) : fleuve Niger SVG animé si temps
3. **Générer vrai GeoJSON** admin-1 Sahel (Natural Earth / GADM)
4. **Générer portraits réfugiés** Gemini (3 visages Sahel distincts)
5. **Animatic complet** (439s) via render-on-vercel.py
6. **Validation Aziz** sur l'animatic complet
