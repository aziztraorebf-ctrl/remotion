# Calendrier de publication — aout 2026

> Etabli le 2026-07-30, jour ou la publication a enfin demarre apres 25 jours de blocage
> (2 videos longues finies dormaient depuis le 5 juillet). **Dates de la table ci-dessous
> reconfirmees le 2026-07-31 via capture d'ecran YouTube Studio (source la plus fiable — remplace
> les estimations "~N aout" utilisees avant programmation reelle).**

## Etat des publications (confirme YouTube Studio 2026-07-31)

| Ordre | Video | Format | Statut | Date |
|---|---|---|---|---|
| 1 | **Senegal Petrole & Gaz** | long 8 min 17 | ✅ **PUBLIE** | 2026-07-30 |
| 2 | **War-Map Sahel AES** ("Sahel : la rupture") | long 7 min 31 | ⛔ **PUBLIEE 2026-08-04, ECHEC (5 vues/24h, VPH 0.19) — REFONTE EN COURS**, voir `memory/episodes/warmap-sahel/STATUS.md` | 2026-08-04 |
| 3 | **Franc CFA mid-form** | long 4 min 29 | 🗓️ **PROGRAMME** | **2026-08-11** |
| 4 | **Soudan mid-form** ("La guerre au Soudan n'a aucune raison de s'arreter" — re-titre 2026-08-17) | long 10 min 36 | 🗓️ **PROGRAMME** | **2026-08-20** |
| — | **Short Senegal D3 (coverB, CTA fixe)** | Short 9:16 | 🗓️ **PROGRAMME, 2 posts** (YT `019fbd20-93bd...` + IG/FB `019fbd20-9e05...`) | **2026-08-01 15:30 UTC** (11h30 local) |
| — | **Short AES 90s (coverB, CTA fixe)** | Short 9:16 | 🗓️ **PROGRAMME, 2 posts** (YT `019fbd2a-887f...` + IG/FB `019fbd2a-93c0...`) | **2026-08-04 19:00 UTC** (15h local, apres le creneau 14h45 de la longue) |
| — | **Short CFA (coverB, CTA fixe)** | Short 9:16 | 🗓️ **PROGRAMME, 2 posts** (YT `019fbd32-ff07...` + IG/FB `019fbd33-08e9...`) | **2026-08-11 15:00 UTC** (11h local, meme jour que la longue) |
| — | Short Soudan | Short 9:16 | ⚠️ **n'existe pas encore** | a construire (boucle NotebookLM) |

**2026-08-01 : les 3 Shorts existants sont tous programmes, en 6 posts (pas 3).** Calendrier
editorial des Shorts VIDE (sauf Soudan qui n'existe pas encore). ⛔⛔ **Rappel applique cette
session** : TryPost n'a PAS de caption par-plateforme (`content` est global au post, cf
[[trypost]] § Erreurs connues) — donc CHAQUE Short = 2 posts distincts, meme video re-uploadee
(nouveau `media_id` a chaque upload, on ne peut pas reutiliser un `media_id` entre posts) :
1 post YouTube seul (caption = titre officiel court, <100 car.) + 1 post Instagram+Facebook
(caption enrichie : contexte + tension/question + 2-3 hashtags). Meme `scheduled_at` pour les 2
posts d'un meme Short. LinkedIn laisse desactive partout pour l'instant (compte perso vide, pas
encore active pour la strategie freelance — voir `freelance-linkedin/STRATEGIE-LINKEDIN-FREELANCE.md`).

**⭐⭐ 2026-08-01 (meme session) : CTA "EN DESCRIPTION" -> "EN BIO" corrige sur les 3 Shorts**,
cf [[feedback_cta-lien-en-bio-shorts-multiplateforme]] pour la methode complete (splice ffmpeg
cible au lieu de re-render integral, fichiers CFA restaures depuis git car supprimes apres le
premier rendu, Root.tsx desormais ré-enregistre `CfaShort9x16-COMPLET`). Les 6 posts TryPost ont
ete supprimes et recrees avec la video corrigee (pas de endpoint remove-media, suppression+
recreation est la methode fiable). Prochaine etape naturelle : construire le Short Soudan (avec
la regle "EN BIO" appliquee des le depart, deja notee dans son fichier timing.ts), ou passer au
**GAZODUC** comme prevu.

## ✅ RESOLU (2026-08-01) — MCP TRYPOST NE CHARGEAIT PAS SES OUTILS

Cause racine (diagnostic agent Opus) : `.mcp.json` utilise `${TRYPOST_API_KEY}` / `${GAMELABS_API_KEY}`
mais Claude Code resout ces variables depuis l'environnement du PROCESS qui le lance, jamais depuis le
`.env` du projet (lu seulement par `load_dotenv()` dans les scripts Python). La cle partait donc
litteralement comme `Bearer ${TRYPOST_API_KEY}` -> 401 -> serveur marque "Failed to connect" -> zero
outil expose. **Fix applique** : les 2 cles ont ete copiees dans le bloc `env` de
`~/.claude/settings.json` (fichier non versionne). Apres redemarrage Claude Code, `trypost:*`
(request-media-upload-tool, create-post-tool, publish-post-tool, etc.) apparaissent normalement.
Si ce probleme revient sur un AUTRE serveur MCP a cle `${VAR}` non hardcodee dans `.mcp.json` : meme
cause probable, meme fix (ajouter la cle dans `~/.claude/settings.json` -> bloc `env`).

**Short Senegal programme avec succes le 2026-08-01** : post TryPost id `019fbb4c-4c28-71d7-b50d-72576632a037`,
statut `scheduled`, caption = titre officiel, video = `senegal-petrole-gaz-short-d3-coverB.mp4`,
3 plateformes actives (YouTube Short + Instagram Reel + Facebook Reel), programme pour
2026-08-01T15:30:00Z. LinkedIn laisse desactive (pas pertinent pour un Short Kora & Cartes).

**Comptes sociaux confirmes** (`list-social-accounts-tool`) : YouTube `019e9de9-e350-70ce-a3cb-2570aab342db`,
Instagram `019e9de9-6c3d-71a3-b438-1f3a3fda9c37`, Facebook `019e9de9-291d-7305-ba18-ed46fbec26ea`,
LinkedIn (perso Aziz) `019fbb12-0555-70e7-9886-0071425c0431` — nouveau compte, pas encore utilise pour
les Shorts Kora & Cartes.

## ⏭️ PROCHAINE SESSION — l'ordre decide par Aziz (2026-07-30), mise a jour post-construction CFA

> Objectif de la session : **vider le calendrier editorial**, pour pouvoir ensuite se consacrer
> entierement au **GAZODUC** (le prochain vrai chantier de production).

1. **Recharger les credits TryPost** (Aziz, hors Claude) — bloquant pour tout le reste.
2. **Programmer le Short Senegal** (`senegal-petrole-gaz-short-d3-FINAL.mp4`, 15 Mo) — libre, la
   video longue est publiee depuis le 30 juillet. Via TryPost (YouTube Short + IG + FB).
3. **Programmer le Short AES** (`aes-short-90s-FINAL.mp4`, 17 Mo) — ⛔ **jamais avant le 4 aout
   14h45** (son CTA renvoie a la video longue), deja publiee. Idealement le MEME JOUR (cf
   correction de principe ci-dessous) — mais la longue est deja sortie le 4 aout, donc le Short
   peut sortir des que possible apres, sans urgence particuliere de calage.
4. **Programmer le Short CFA** — ✅ **CONSTRUIT et PROMU PRET-PUBLICATION le 2026-07-30**
   (78,7s, worktree `remotion-cfa`, branche `feat/cfa-short-9x16`, commit `8403eb2f`).
   Livrable : `out/PRET-PUBLICATION/franc-cfa-short-9x16-FINAL.mp4` (note a cote). Audio
   ecoute par Aziz et valide sans reserve (les cretes proches de 0dB detectees au controle
   automatique ne sont pas genantes). ⛔⛔ **CORRECTION DE PRINCIPE 2026-07-31 (retour Aziz)** :
   la regle n'est PAS "sortir N jours apres la longue" — c'est **"jamais AVANT" la longue**.
   Sortir Short + longue **LE MEME JOUR** (longue en premier de quelques heures, Short juste
   apres) est OPTIMAL : le CTA reste valide des la sortie ET le Short ramene du trafic frais qui
   BOOSTE l'algorithme de la longue pendant sa fenetre de lancement — un delai de plusieurs
   jours perd ce boost sans raison. → **Short CFA vise ~11 aout, MEME JOUR que la longue**
   (pas le 14 comme precedemment note par erreur). S'applique a tout futur Short/longue lies.
   Methode utilisee : [[notebooklm-boucle-short]] pour le climax (levier de devaluation, pas
   1994 pur) + reutilisation des 3 beats du mid-form (1/3/5b) recomposes en 9:16 (pas de
   production neuve).
5. **CONSTRUIRE le Short SOUDAN** — ⚠️ **il n'existe pas encore**. La video longue Soudan est
   quasi terminee (11/12 pts polish, reste des raccords audio qui coupent) — ⭐ **prochaine session
   Soudan = Aziz + Claude EN DIRECT, pas d'agents** (decision anterieure, cf STATUS Soudan).

## ⛔ CONTRAINTE D'ORDRE — le Short AES depend de la video longue

Le **Short AES 90s** se termine par : « L'histoire complete -- la Libye, Kidal, le vrai cout humain --
dans la video longue. Lien en description. » Ce CTA pointe vers la video longue AES.

→ **Le Short AES ne doit JAMAIS sortir avant le 4 aout 2026 14h45.** Sinon le CTA renvoie vers une
video qui n'existe pas encore publiquement, et le lien de description est mort au moment ou le Short
recoit son pic d'audience.

⛔⛔ **CORRIGE 2026-07-31** : l'ancienne reco "3 jours apres, soit le 7 aout" est PERIMEE — elle
venait d'une mauvaise generalisation de la contrainte ("jamais avant" lue a tort comme "N jours
apres"). La longue AES etant DEJA programmee le 4 aout, le Short AES devrait sortir **le MEME
JOUR ou au plus vite apres** (pas un delai de 3 jours artificiel) pour capter le meme boost
algorithmique — cf la correction de principe generale au § PROCHAINE SESSION point 4.
Le Short Senegal, lui, est libre (la longue Senegal est deja publiee depuis le 30 juillet).

## Choix figes le 2026-07-30 (ne pas re-litiger)

- **Titre Senegal** : `Petrole au Senegal : 8 millions par jour, 132% de dette.` (54 car.)
- **Titre AES** : `La CEDEAO a menace le Niger. L'AES est nee.` (42 car.)
  → issu du jury LLM 4 modeles : Gemini et GPT-5.5 ont propose ce titre **a l'identique** sans se voir,
  Grok une variante de la meme structure. Convergence 3/4 = signal fort.
- **Titre CFA** : `Une nuit, l'argent a fondu. Le systeme est reste.` (48 car., propose par Kimi)
  → ⭐ choisi CONTRE le n°1 de Gemini (`Franc CFA : leur argent divise par deux en une nuit`) parce que
  celui-ci **repetait mot pour mot le texte grave dans la miniature**. Regle qui s'en degage :
  **le titre ne redit jamais ce que la miniature montre deja — il ouvre autre chose.** Ici l'image donne
  le CHOC (1994), le titre donne ce qu'elle ne peut pas montrer : que le systeme n'a PAS change depuis,
  ce qui est le sujet reel des 4 minutes.
- **Thumbnails** : Senegal = `senegal-piege-baril.png` · AES = `aes-la-rupture.png` (variante
  `aes-le-nouveau-bloc.png` ecartee, pas detruite) · **CFA = `franc-cfa/minuit.png`** (SVG source
  a cote ; variante `franc-cfa/levier.png` ecartee, gardee pour reference) · **Soudan = `soudan-midform/serpent-de-lor-SANS-TEXTE.png`** (Serpent retouche le 2026-08-17 :
  texte de concept retire, sujet recentre. ⛔ REMPLACE `machine-a-guerre-final.png`, ecartee
  le 2026-08-17 — aucun ancrage geographique, engrenage indistinct en vignette — cf `soudan-midform-FINAL.PUBLICATION-NOTE.md` pour le pipeline complet).
- ⭐ **Titre Soudan (APPLIQUE 2026-08-17)** : `La guerre au Soudan n'a aucune raison de s'arreter`
  (50 car., formulation d'Aziz). Patron "creer le manque" — `memory/doctrines/PACKAGING-YOUTUBE.md` §1.
  ⛔ 2 titres ecartes, ne pas ressortir : l'ancien ci-dessous (titre-these), et
  « ...et ce n'est pas politique » = FACTUELLEMENT FAUX (le script parle du veto russe a l'ONU,
  de l'Egypte/Nil, des Emirats) — rattrape par Aziz au moment d'appliquer.
- (ARCHIVE, remplace) **Ancien titre Soudan** : `L'empire de l'or qui rend la guerre au Soudan impossible a arreter` (66 car.
  — depassement DELIBERE du plafond habituel 55 car., valide par Aziz + jury LLM v2 + confirmation
  independante Gemini web : la richesse semantique justifie le depassement pour un sujet a 4
  puissances etrangeres imbriquees. Precedent documente dans `memory/templates/regles-titres.md`.
  ⚠️ Lecon methode : le jury v1, lance avec un `--contexte` court, avait produit des titres-paraphrase
  du script rejetes par Aziz — la doctrine complete (titre hybride + exemples valides) doit toujours
  etre injectee dans le `--contexte` du jury, cf `feedback_jury-titres-llm-4-modeles.md`.
- ⛔ **PAS d'A/B testing** (Test & Compare) tant que la chaine n'a pas le volume d'impressions pour
  conclure : diviser les impressions en 2-3 pendant les 24-48 h qui decident de la distribution
  handicape le lancement pour une donnee qu'on n'obtiendra pas. A rouvrir quand une video decolle.
- **Rythme** : 1 long + 1 Short par semaine. Ne pas publier 4 videos d'un coup (brule le catalogue
  sans laisser l'algorithme apprendre).

## Ou sont les fichiers

- Videos : `out/PRET-PUBLICATION/` (`senegal-petrole-gaz-FINAL.mp4`, `warmap-sahel-aes-FINAL.mp4`,
  `senegal-petrole-gaz-short-d3-FINAL.mp4`, `aes-short-90s-FINAL.mp4`,
  `franc-cfa-short-9x16-FINAL.mp4`)
- Covers B des 3 Shorts (0.5s cover + fade, deja incruste, pretes a poster) :
  `senegal-petrole-gaz-short-d3-coverB.mp4` (12 Mo) · `aes-short-90s-coverB.mp4` (14 Mo) ·
  `franc-cfa-short-9x16-coverB.mp4` (6 Mo) — toutes dans `out/PRET-PUBLICATION/`. **Poster CES
  fichiers `*-coverB.mp4` via TryPost, pas les `*-FINAL.mp4` sans cover.**
- Thumbnails : `public/_shared/thumbnails-library/`
- Outil titres : `scripts/tools/jury-titres-llm.py` (4 modeles, ~2 min) — voir
  [[feedback_jury-titres-llm-4-modeles]]
- Nouveau script : `scripts/tools/gemini-cover-vertical.py` (recomposition 16:9 -> 9:16 via Gemini
  image-to-image) — voir [[feedback_pipeline-cover-b-recadrage-gemini-vertical]]

Liens : [[feedback_doctrine-titres-youtube-kora-cartes]] · [[trypost]] (Shorts+IG+FB ; video longue =
upload MANUEL Studio pour garder Test & Compare)
