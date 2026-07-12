# Carrousels "Good News Macro" — composants réutilisables

> Pipeline validé 2026-06-01 (Carrousel #1 : Maroc / Kenya / Algérie). Standard : v3.
> Doctrine + décisions : `memory/starters/STARTER-PROMPT-carrousel-good-news.md`.
> Voisin : carrousels hybrides (issus de vidéos) → `../hybrid/README.md`.

## Concept

3e type de carrousel Kora & Cartes. **Bonnes nouvelles africaines à angle MACRO** :
pas "c'est bien pour l'Afrique" mais "voici comment ça impacte Tokyo / Paris / le monde".
Aimant grand public (entonnoir) qui nourrit l'audience premium des carrousels analytiques.

Anti-pattern proscrit : ton naïf "feel good", photos, illustrations IA. Charte premium éditoriale.
Différentiel = bonnes nouvelles + rigueur data + perspective macro mondiale.

## Charte LUMINEUSE (distincte du flux analytique sombre)

`theme.ts` (objet `GN`) : fond ivoire `#fbf7ec`→`#f0e6cf` + halo doré, texte navy `#16213a`,
accents or `#c8a951`/`#a8852f`, vert positif `#2f8f5b`, bleu macro `#3f72b0`. Serif Georgia.
Format 4:5 (1080×1350). Safe-zone basse 275px. **100% Remotion animé** (jamais Gemini/photo).

## Structure type (8 slides)

Hook → 3 nouvelles × (slide FAIT + slide MACRO) → CTA.
- **FAIT** : kicker or (ex "1 — Maroc") + brique data-driven + phrase.
- **MACRO** : kicker bleu "Pourquoi le monde regarde" + brique flow + bascule impact mondial.
- **Continuité narrative** (pas panoramique) : chaque slide a sa propre anim ; le fait nourrit le macro.

## Composants

| Fichier | Rôle |
|---|---|
| `GoodNewsSlideLight.tsx` | **Slide générique**. Props : `mode` (hook/fact/cta), `brick` (gauge/flow/bars/none), `kicker`, `kickerMacro`, `body`, `subtitle` + props par brique. Header K&C + barres, footer @koraetcartes, grain, halo. Hook = GlobeBadge + typewriter. CTA = bouton play pulsant + typewriter. |
| `GoodNewsSlideMap.tsx` | **Slide carte Mapbox** (style Caspian beige, cohérent charte lumineuse). Tracé SVG animé entre 2 points géocodés (MCP), pins + labels. Lifecycle headless, fade anti-clipping. Render via `scripts/render-mapbox.sh`. |
| `GrainOverlay.tsx` | Grain SVG (feTurbulence) ~5% → effet papier magazine. |
| `theme.ts` | Charte `GN` (couleurs lumineuses). |
| `GoodNewsCarousel.tsx` | Assemblage `<Series>` des 8 slides (preview défilante). |

### Briques animées réutilisables (`bricks/`)

| Brique | Quand | Anim |
|---|---|---|
| `GaugeBrick` | nouvelle chiffrée (%) | arc qui se remplit + compteur 0→N + glow pulsant |
| `BarsBrick` | classement / dépassement de rang | barre challenger grandit, dépasse le leader, ★ pulse |
| `FlowBrick` | chaîne d'impact (macro) | 2 nœuds (icônes **Lucide** line-art, PAS d'emoji) + flux + particules dorées continues. `layout`: horizontal/diagonal/vertical |

**Icônes flow** : map nom→Lucide dans `GoodNewsSlideLight` (`ICONS`). Ajouter une clé pour un nouveau pictogramme.

## Pipeline DATA-DRIVEN (semi-automatique)

> Le contenu est SÉPARÉ du code : `carousel-data.ts` (objet `CURRENT_EDITION`) est la source
> de vérité unique. La preview (`gn-preview`) ET les 8 compositions individuelles (`gn-XX`,
> via `slide-props.ts`) en dérivent. Changer de semaine = éditer carousel-data.ts UNIQUEMENT.

**Workflow hebdomadaire (5 étapes) :**

1. **Recherche** (auto) : `python3 scripts/prepare-goodnews-weekly.py [--days 7]`
   → lance last30days, écrit `out/_r-and-d/good-news/weekly/research-<date>-raw.md` + `BRIEF-<date>.md`.
2. **Sélection + rédaction** (Claude en session) : lire le BRIEF, choisir/**vérifier** 3 bonnes nouvelles macro,
   remplir une nouvelle `GoodNewsEdition` dans `carousel-data.ts` + pointer `CURRENT_EDITION` dessus.
   ⚠️ Jugement éditorial + factuel HUMAIN/Claude — jamais auto (anti-hallucination de chiffres).
3. **Sync Root.tsx** : `slide-props.ts` dérive les defaultProps de CURRENT_EDITION → rien à toucher dans Root.tsx
   (sauf si la durée d'une slide change). Le mapping brique→nouvelle est automatique.
4. **Render** (auto) : `./scripts/render-goodnews-carousel.sh` → 8 slides + musique + vidéo TikTok.
   ⚠️ `npx remotion browser ensure` après tout `npm install` frais (sinon carte Mapbox vide — le script le fait).
5. **Publier** : `python3 scripts/schedule-goodnews-carousel.py` (IG+FB) + `scripts/schedule-goodnews-tiktok.py` (TikTok).
   Tester avec `--dry-run` d'abord. Vérifier le calendrier Postiz (collision) avant.

**Mapping brique → type de nouvelle** (dans carousel-data.ts) :
chiffre/% → `gauge` · classement/dépassement → `bars` · corridor géo → `map` · impact macro → `flow` (toujours).

## Monitoring publications (anti-scroll)

> Discipline validée : NE PAS aller sur les réseaux en semaine. Vérifier via scripts, pas en scrollant le feed. Bilan une fois/semaine (samedi). Compte en amorçage → les vues des premiers posts ne sont PAS un signal exploitable.

| Script | Quand | Rôle |
|---|---|---|
| `scripts/postiz-weekly-check.py` | mi-semaine (jeudi) | Vérifie que les posts lundi→jeudi sont PUBLISHED. Exit 1 si échec (→ alerte). Liste les posts à venir. |
| `scripts/postiz-weekly-report.py` | samedi | Bilan : posts de la semaine regroupés (1 contenu = N canaux) + URLs directes vers les stats natives. |

**Limite** : l'API publique Postiz n'expose PAS les vues/likes/commentaires. Le report donne les LIENS pour consulter manuellement (consultation ciblée, sans feed). Agrégation auto = APIs natives Meta/TikTok (chantier séparé).

**Automatisation `/schedule` (cloud)** : ces scripts sont conçus cloud-safe (clé via env `POSTIZ_API_KEY`, pas de chemin local). Pour 2 routines récurrentes :
```
/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a échoué
/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan
```
⚠️ Routines cloud = repo cloné + clé en env var de la routine (pas le .env local). Scripts doivent être commités. Notification via connecteur (Slack/email) ou claude.ai/code/routines.

## Gotchas

- **TikTok carrousel vidéo = impossible** ("Only pictures are supported when selecting multiple items"). TikTok → vidéo unique (8 slides concaténées + son) via le script dédié.
- **Mapbox headless** : nécessite chrome-headless-shell (`render-mapbox.sh` patché pour `node_modules/.remotion/`).
- **Lucide rend bien en headless** (SVG inline). `strokeWidth` cohérent sur toutes les icônes.

## Carrousel #1 — référence (validé, publié 3 juin 2026)

Hook → Maroc (bars: dépasse Afrique du Sud / flow diagonal: usines→Airbus) → Kenya (gauge 90% / flow: énergie→data centers) → Algérie (map Caspian: corridor Alger→Berlin / flow diagonal: hydrogène→Europe) → CTA.
Preview : https://files.catbox.moe/aw0kz8.mp4
