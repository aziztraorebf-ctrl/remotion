# WARMAP-RESEARCH-PLAYBOOK — Doctrine DONNEES du 3e pilier

> Cree 2026-06-05. Complement DATA de [[doctrines/WARMAP-PLAYBOOK]] (qui couvre le VISUEL).
> Repond a la question N1 du pilier : "comment garantir les BONNES infos AVANT de construire ?"
> Code fait 1x, donnees repetees par sujet. Pipeline : `scripts/warmap/`. Schema : `src/projects/warmap/data/schema.ts`.

## §1 — Principe : la donnee AVANT le pixel
Le prototype Soudan a ete nourri en recherche legere (estimations). Pour un pilier RECURRENT et
FACTUEL, la collecte est industrialisee : donnees dures OSINT -> agregation -> synthese -> fact-check,
le tout produit dans **UN schema canonique** (`WarMapDataset`) que le moteur consomme. 1 fichier de
jalons -> tout en derive (couleurs carte, compteur pertes, label, vignette). Voir [[WARMAP-PLAYBOOK]] §8.

## §2 — LES 4 ETAPES (workflow Aziz)
1. **HARD DATA (donnees dures)** — bases evenementielles structurees. `acled_connector.py` (code, OAuth)
   + `ucdp_connector.py` (stub : CSV ou token) + `github_geojson_fetcher.py` (stub : polygones front communaute).
   ACLED donne des POINTS (events date+lon/lat+acteur+pertes) ; GeoJSON communaute donne des SURFACES.
2. **PRE-RESEARCH web (gratuit, AVANT le paye)** — `web_preresearch.py` (stub : Firecrawl MCP / Tavily /
   WebSearch). Ramasse articles + communiques aux dates des jalons pour valider POURQUOI le front a bouge.
3. **LLM BRAIN (synthese)** — `llm_synthesis.py` : OpenRouter -> `perplexity/sonar-pro` (PAS deep-research,
   trop cher). Injecte data brute + articles -> vignette 2 phrases "pourquoi X est tombee" + sources.
4. **FACT-CHECK (croisement, juge)** — `factcheck.py` : `gemini-3.1-pro-preview` (+ Grok XAI 2e juge)
   compare ACLED vs presse/communiques -> anomalies (ecart pertes, position contestee) -> write-back
   `verified`/`confidence` + rapport `memory/episodes/warmap-daybyday/<sujet>-fact-check.md`.

## §3 — CLASSEMENT FIABILITE des sources + regle de convergence
| Source | Fiabilite | Usage |
|---|---|---|
| **ACLED** | ★★★ structuree, hebdo, geo+pertes+acteurs | temps reel, moteur principal. OAuth password grant. |
| **UCDP GED** | ★★★ academique, peer-validated, MAIS lag | historique / long-form (incontestable, depropagandise). |
| **GeoJSON communaute** (GitHub/Discord) | ★★ surfaces front quotidiennes | polygones de controle (complement aux points ACLED). |
| **Presse** | ★★ contexte | le POURQUOI, validation croisee. |
| **Communiques** (factions) | ★ partisan | a croiser, jamais seul. |

**Regle de convergence (anti-hallucination, miroir [[feedback_3-agents-research-stack]])** : un jalon
passe `verified=true` SEULEMENT si **>=2 TYPES de sources independants** concordent (ACLED + presse + UCDP...).
ACLED seul -> `verified=false`, confidence plafonnee a 0.6. (La vignette LLM ne compte PAS comme source.)

## §4 — Le contrat SCHEMA (1 fichier -> tout en derive)
`src/projects/warmap/data/schema.ts` = `WarMapDataset` superset du contrat moteur + PROVENANCE.
- **jalons[]** : `{date ISO, label, control:Record<state, number|{value,prov}>, casualties, vignette?, prov}`.
  control 0=faction B (RSF rouge) / 0.5=conteste (or) / 1=faction A (SAF bleu).
- **provenance** par fait : `{sources[], confidence 0..1, verified, method, notes}`.
- **choregraphie** (vehicles/refugees/cities/overlays) = VISION, PAS derivable des events.
  Le pipeline regenere SEULEMENT jalons+pertes+provenance ; la choregraphie est PRESERVEE.
- `adapter.ts canonicalToEngine()` : ISO->date pointee + reconstruit `controlAt`/`jalonAt` (memes maths).
  Le moteur Sudan (`SudanWarMapFlat.tsx`) consomme via `sudanControlData.ts` re-export. **Render byte-identique
  prouve** (frame 200 : controle inchange, seules les pertes deviennent data-derivees).
- Donnees : `src/projects/warmap/data/<sujet>.warmap.json`. Decisions episode : `memory/episodes/warmap-daybyday/`.

## §5 — ACCES (verifie 2026-06-05)
- **ACLED** : OAuth password grant. `POST acleddata.com/oauth/token` (username+password myACLED,
  `grant_type=password`, `client_id=acled`) -> access_token 24h + refresh 14j. Creds en `.env` :
  `ACLED_USERNAME`/`ACLED_PASSWORD`. (Plus une simple cle en query string comme avant.)
- **UCDP** : token par EMAIL au mainteneur (header `x-ucdp-access-token`, introduit fev. 2026) OU
  telecharger le GED CSV/JSON depuis `ucdp.uu.se/downloads` (v26 = avril 2026, sans token = + simple).
- **Doctrine FIXTURE-FIRST** : chaque connecteur lit ses creds du `.env`, retombe sur fixture JSON
  realiste si absentes. Tout le pipeline tourne sans aucune cle (`--fixtures-only`).

## §6 — DISCIPLINE COUT
- Synthese = `perplexity/sonar-pro`, JAMAIS deep-research (trop cher, redondant). Cf. [[feedback_perplexity-fact-check-rule]].
- Pre-research web (gratuit) AVANT toute synthese payante.
- Fact-check Gemini = 1 appel par dataset (pas par jalon en boucle).

## §7 — AGGREGATION : ACLED points -> controle admin-1 (le coeur)
`scripts/warmap/aggregate.py`. (1) acteur->faction (substring) ; (2) point-in-polygon (ray-cast pur,
`geo.py`, noms EXACTS `Kordufan`/`Gedarif`) ; (3) fenetre glissante [D-30j, D] par jalon (dates editoriales) ;
(4) `dominance=(A-B)/(A+B)`, `control=0.5+0.5·dominance`, poids=`(1+log1p(pertes))×mult(type)`, carry-forward
si zero event, snap {0,0.5,1} deadband 0.25 ; (5) pertes cumulees ; (6) provenance top-N event ids.
Test golden : `aggregate.py --fixtures-only` == `expected_jalons.json` (zero reseau).

## §8 — NEXT (a structurer comme Souverain/Atlas)
- Skill `warmap-preproduction` (miroir `souverain-preproduction`) — gated phases.
- Brancher les connecteurs reels (ACLED creds Aziz, UCDP CSV) + implementer web_preresearch (Firecrawl MCP).
- Basculer moteur sur d3-geo pur (socle Atlas) au lieu de Mapbox reskinne.
- Routage CLAUDE.md (table outils + skills).
