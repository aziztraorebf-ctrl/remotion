# STARTER — VAULT (mémoire commune Aziz ↔ Claude) + serveur MCP

> ⏸️ **EN RÉSERVE — décision d'Aziz du 2026-09-08.** L'application n'est PAS construite, et ce
> n'est pas un abandon : c'est un report avec un critère de réouverture précis (plus bas).
> Tout le travail d'analyse est fait — **ne pas le refaire**, les contraintes techniques sont
> déjà vérifiées en doc officielle.

## ⭐ CRITÈRE DE RÉOUVERTURE (le seul)

Rouvrir ce starter **le jour où l'index se remplit tout seul ET où la consultation depuis le
mobile manque réellement**. Pas avant.

Autrement dit : si `COMPOSANTS-INDEX.generated.md` (cf. Fix 2 du même chantier) devient vivant
et utile, et qu'Aziz se surprend à vouloir le consulter du téléphone → c'est le signal.
Si l'index ne se remplit pas, la leçon aura coûté un script au lieu d'un dépôt complet.

## POURQUOI ON N'A PAS CONSTRUIT L'APP (à relire avant de se relancer)

**5 projets d'app/site déjà abandonnés dans ce workspace** — le motif se répète :
- `PROMPT-PROCESS-VAULT` — 3 commits, abandonné en février 2026
- `dashboard/` — 8 fichiers HTML, morts depuis le 3 juin 2026
- Netlify `aziztraore-animation` — site créé, **jamais déployé**
- `out/_r-and-d/portfolio-site/` — v1 rejetée (« crie généré par IA »), 2 directions jamais implémentées
- `scripts/tools/render-on-vercel.py` — POC abandonné

Cause commune : ces projets vivent **à côté** de la production, et la production gagne toujours.
Aziz l'a formulé lui-même : *« mon instinct me dit que ce genre de choses ne marche pas du premier
coup — c'est des itérations, revenir, plusieurs sessions quand ça casse. »*

Et le principe déjà gravé en mémoire : **« non outillé = non fait »**. Un vault alimenté à la main
mourra comme les 8 dashboards. **L'alimentation automatique n'est pas une phase 2, c'est la
fonctionnalité n°1.**

## LE DIAGNOSTIC (mesuré le 2026-09-07, ne pas re-mesurer)

| Mesure | Valeur |
|---|---|
| `.md` dans `memory/` (repo) / auto-memory | 1025 / 426 |
| **Noms identiques dans les 2 arbres** | **250** |
| Feedbacks | 312 |
| Composants `.tsx` réels (hors archive) | **872** |
| Composants dans `COMPOSANTS-INDEX.md` | **32 → 3,7 %** |
| `PIPELINE.md` | périmé depuis le 22 juillet |
| Sessions ouvertes sur le workspace | 27 |
| Scripts Python / hooks / serveurs MCP maison | 445 / 20 / **0** |

**Douleur dominante** (~28 feedbacks) : *« l'information existe et personne ne la trouve au moment
du geste »*. Ce n'est PAS « je ne vois pas les agents travailler ».

Cas mesurés : un verdict resté 1 mois en en-tête de script (*« un script est un cul-de-sac
documentaire »*), ~50 % des appels storyboard en échec avec le correctif écrit depuis 3 jours,
une brique en 5e position d'une liste manquée par 3 agents sur 3, un registre canonique sur une
branche jamais mergée (4e occurrence du pattern), un livrable Gazoduc *« objectivement inférieur
à ce que le studio savait déjà faire »*.

## L'OBJECTION, ET SA LEVÉE

`feedback_budget-contexte-mesurer-la-chaine-entiere` écarte explicitement cette solution :
*« un serveur MCP coûte un forfait fixe de contexte à chaque session. Le RAG ne devient rentable
que vers ~50 000 documents ; on en a ~1 100. »*

**Aziz a levé l'objection le 2026-09-08** : le verdict vise le RAG comme *substitut de mémoire
chargée* — il reste valable pour ça. Le vault se justifie autrement : par la **structuration**
(détecter les contradictions, dater les faits, tracer la provenance, révéler l'invisible).

Contraintes conservées de l'objection, non négociables :
- **Jamais chargé automatiquement en contexte.** Outil d'appel ponctuel, comme `episodic-memory`.
- **Peu d'outils MCP, très bien décrits** — le forfait dépend de leur NOMBRE, pas du volume indexé.
- Les jalons 1 et 4 gardent tout leur sens **sans MCP** : le jalon 2 est séparable.

## CONTRAINTES TECHNIQUES — DÉJÀ VÉRIFIÉES (doc officielle, 2026-09-07)

⛔ Ne pas re-chercher tout ceci, c'est confirmé :

**MCP**
- `stdio` pour un serveur local ; **SSE est déprécié**, ne pas l'utiliser
- `claude mcp add --scope project` → `.mcp.json` versionnable
- Sortie d'outil : warning à **10k tokens**, max **25k** (`MAX_MCP_OUTPUT_TOKENS`), plafond dur
  500 000 caractères → **les outils renvoient des index compacts, jamais des dumps**
- ⚠️ Piège vécu le 2026-08-01 : les `${VAR}` de `.mcp.json` sont résolus depuis l'environnement du
  process qui lance `claude`, **pas** depuis le `.env` du projet. Un serveur stdio qui fait son
  propre `load_dotenv` y échappe. Attention aux **worktrees** : résoudre la racine explicitement.

**Hooks**
- `SessionStart` / `SessionEnd` / `Stop` / `SubagentStop` / `PostToolUse` / `PreCompact` reçoivent
  `session_id`, `transcript_path`, `cwd` sur stdin ; `Stop` fournit `last_assistant_message`
- ⭐ `hookSpecificOutput.additionalContext` **injecte du contexte à Claude** — c'est le « vice
  versa » qu'Aziz demandait
- Type `mcp_tool` disponible : un hook peut appeler directement un outil MCP
- Bloquer = stderr + `exit 2` ; informer = stdout + `exit 0`. Timeout 600 s (30 s `UserPromptSubmit`)

**Transcripts** : le format `.jsonl` n'est **pas documenté** et s'écrit en asynchrone → appoint
pour l'historique, jamais interface principale. (3 341 fichiers, 2 Go sur cette machine.)

**Python** : ⚠️ le style des 445 scripts (`print()` sur stdout + `sys.exit(1)`) **tue un transport
stdio**. Modèle à suivre : `scripts/pipeline_gates.py` (retourne `(passed, reason)`, ne quitte jamais).
Installés : `pydantic`, `httpx`, `httpx-sse`, `python-dotenv`, `uv`/`uvx`. **Absents** : `mcp`,
`fastmcp`, `supabase`.

## LES 5 JALONS

1. **L'indexeur** — scanne `memory/**`, `src/**/*.tsx`, `out/PRET-PUBLICATION/`, les 21 `STATUS.md`.
   Produit un index + rapport de collisions + rapport de contradictions.
   ⛔ **Valider chaque entrée contre le disque** : précédent de 5 entrées fausses écrites dans
   `COMPOSANTS-INDEX.md`. Un index non validé est un amplificateur de désinformation.
   → *partiellement fait le 2026-09-08 (Fix 2 du chantier : `index-composants.py`)*
2. **Le serveur MCP** — stdio Python. Outils : `vault_search`, `vault_get`, `vault_write`,
   `vault_status`, `vault_similar` (« a-t-on déjà ça ? »).
3. **Le frontend mobile** — ressusciter la PWA PPV : garder le modèle de données, la PWA
   (`manifest.json` standalone portrait + `sw.js`) et la couche Gemini d'auto-catégorisation
   (`analyzeImageWithGemini` + `responseSchema`). **Découper le `index.tsx` de 1517 lignes**
   (monolithe AI Studio) en vues : Recherche (accueil) · Projets · Livrables · Leçons.
4. ⭐ **L'alimentation automatique** — LE jalon décisif. `PostToolUse` sur `src/**/*.tsx` →
   index à jour en continu ; `SessionEnd`/`Stop` → trace du travail ; `SessionStart` →
   `additionalContext` avec les 2-3 leçons pertinentes. **Capturer le savoir-faire silencieux**
   (une méthode qui marche n'est jamais écrite car nos déclencheurs sont des INCIDENTS).
   Garde-fous : aucun hook bloquant, `exit 0` toujours, sentinelles par `session_id`
   (patron `fiche-inject.sh`, qui coûte déjà ~24 000 tokens/jour — plafonner et mesurer).
5. **Écriture depuis le mobile** (optionnel) — Aziz annote, je le vois au `SessionStart` suivant.

## LA DÉCISION NON TRANCHÉE : la persistance

| Option | Pour | Contre |
|---|---|---|
| **Markdown + index JSON** ⭐ | continuité (1025 fichiers déjà en `.md`), versionné git, lisible sans outil, zéro infra, réversible | recherche littérale (pas sémantique), mobile en lecture seule via `vault-index.json` publié |
| **Supabase/Postgres** | recherche par le SENS (`pgvector`), mobile bidirectionnel natif, requêtes croisées | contenu sort de git (plus de `git log` par leçon), infra à tenir, contenu illisible sans l'app |
| **Firebase (existant)** | projet `prompt-and-process-vault` déjà en place, règles OK, zéro migration | **pas de recherche sémantique** — justement ce qui manque ; sort de git aussi |

Ma recommandation au 2026-09-08 : **Markdown d'abord, Supabase si l'usage le prouve**. Les cas de
douleur mesurés (brique en 5e position, registre sur branche non mergée, index déclarant
« fantôme » un fichier existant, 250 collisions) **ne se résolvent pas par la recherche
sémantique** — ils se résolvent en *révélant* ce qui est caché. Un index suffit. Et A ne ferme pas B.

## RESSOURCES

- Repo prototype : https://github.com/aziztraorebf-ctrl/PROMPT-PROCESS-VAULT (public, 12 fichiers,
  React 19 + Vite + Firebase + Gemini, PWA). Firestore : règles correctes, accès anonyme refusé.
- État de l'art 2026 (vérifié) : `builderz-labs/mission-control` (6 192 ★, vivant, pilote OpenClaw
  + Claude Code + Codex) · `abhi1693/openclaw-mission-control` (4 109 ★, **archivé** 6 août 2026) ·
  `omnara` (2 822 ★, le pont local→mobile, app iOS/Android publiée) · Langfuse (34 307 ★, standard
  de facto observabilité)
- ⚠️ **Claude Code Remote Control existe nativement** (doc officielle, tous les plans) et Aziz
  l'utilise déjà (traces `bridge-session` dans les transcripts, sessions Remote Control listées).
  **À évaluer avant de construire quoi que ce soit de pilotage.**
- OpenClaw est installé sur la machine (`~/.npm-global/bin/openclaw`, v2026.3.13), Gateway actif
  sur le port 18789, 3 agents, 22 crons dont 12 actifs. Sa « Control UI » est une surface d'ADMIN :
  la doc dit *« Do not expose it publicly »* — accès distant par Tailscale/SSH, jamais par Vercel.

## CE QUE LE VAULT NE RÉSOUDRA PAS (dit franchement)

1. **Vérifier qu'un livrable existe** (~45 feedbacks) — aucun vault ne remplace `ls` et regarder
   le rendu. Il ajoute même une surface de mensonge, d'où la validation disque au jalon 1.
2. **Mesurer au lieu de juger** (~21 feedbacks) — discipline de geste, pas problème d'information.
3. **Fusionner les 2 arbres mémoire** — il rend les 250 collisions *visibles* ; la fusion reste
   une décision humaine, fichier par fichier.
4. ⛔ Le diagnostic le plus dur du corpus (`regle-ecrite-insuffisante-sans-gate-outille`) :
   *« le problème n'est PAS l'absence de briques réutilisables — c'est l'absence de mécanique
   d'exécution qui force leur consultation AVANT de coder. »* **Un vault sans le jalon 4 est une
   règle écrite de plus.**

## PLAN COMPLET

`~/.claude/plans/witty-zooming-lamport.md` (session du 2026-09-07/08).
