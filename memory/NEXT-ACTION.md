# NEXT-ACTION — Recommandations actives

## ⛔⛔ À TRAITER — incident git : travail perdu puis récupéré par chance (2026-08-31)

Ménage de branches du 28/08 a failli perdre 2 fichiers jamais commités (récupérés par chance,
`git fsck --unreachable`). Diagnostic + 3 pistes de correctif à trancher avec Aziz :
`memory/projects/INCIDENT-BRANCHE-SUPPRIMEE-TRAVAIL-PERDU.md` — le lire AVANT tout ménage de branches.

## R&D — tester la 3D jusqu'au bout, en exploration pure (idée d'Aziz, 2026-09-03)

> Session parallèle, DÉTACHÉE de tout contrat en cours. Pas de délai, pas de livrable client.

On avait écarté la 3D pour le chill-meter sans vraiment la tester (raisonnement, pas mesure).
Aziz veut fermer la boucle : générer un châssis 3D via R3F/Three.js avec Claude Opus ou Fable,
voir jusqu'où ça va, et mesurer les vrais compromis plutôt que de les supposer.

Ce que la session actuelle a identifié comme COÛT si on l'utilisait pour un livrable :
- Export alpha (ProRes 4444 transparent) : un rendu 3D est opaque par defaut, demande un
  pipeline de compositing separe, jamais teste sur ce repo
- Animation : le givre 0->1 et le remplissage sont pilotes par des props React simples en SVG ;
  en 3D il faudrait les recreer sur un maillage (shaders/materiaux), un autre langage technique
- Vitesse d'iteration : un dosage SVG se corrige en 1 ligne et se rend en 10s ; un ajustement de
  materiau 3D (roughness/metalness/normal maps) est plus long a juger et a rendre

Ce qu'on pourrait GAGNER, a verifier reellement plutot que supposer :
- Eclairage physiquement coherent (speculaire, occlusion) qu'on simule a la main en SVG
  (cf. `rf_key`, masques de joints du chill-meter) viendrait gratuitement d'un vrai moteur

But du test : mesurer si un rendu 3D fixe (PAS l'export final anime) peut servir de cible visuelle
plus fiable qu'un breakdown texte->hex pour calibrer un chassis SVG. C'est l'usage deja identifie
comme viable dans `memory/client-sim-tests/upwork-chill-meter/STATUS.md` (« rendu de reference
eclaire », pas « extraire une texture ») — jamais teste concretement.

## ⛔⛔⭐⭐⭐ PRIORITÉ — CÂBLER NOTRE SYSTÈME SUR LE TRAVAIL CLIENT (constat d'Aziz, 03/09)

> **Session dédiée à ouvrir**, jamais au fil d'une session de production.
> Branche suggérée : `fix/cablage-systeme-travail-client`.

**Le constat d'Aziz** : « notre repo ne sert à rien si on ne l'utilise pas quand vient le temps de
régler des problèmes, autre que pour la vidéo YouTube. »

**La cause** : le système est câblé pour la PRODUCTION VIDÉO (gates visant `souverain/`, fiches
ciblant des chemins de beats). Le travail client vit ailleurs — `_rnd/`, `client-sim-tests/`,
`_client-sim/` — et **traverse le système sans rien déclencher**. Le repo n'est pas inutile, il est
**ADRESSÉ AU MAUVAIS ENDROIT** (3e occurrence du défaut d'adressage : FICHE-MOCKUP-3D 26/08,
FICHE-BRIEF-CLIENT 02/09). Mesuré sur le contrat chill-meter : 4 outils qui existaient n'ont pas
été déclenchés, dont le DA-brief que j'ai réimplémenté à la main sans le reconnaître.

**Le chantier, 4 étapes** :
1. Recenser ce qui DEVRAIT se déclencher sur du travail client (DA-brief, fiche client, gates,
   protocole de délégation, règles de message client, nommage).
2. **TESTER lesquels s'activent vraiment** sur un chemin client — par exécution du hook avec un
   `file_path` ET un `content` (⚠️ `fiche-inject.sh` sort en 0 sans contenu : un test sans
   `new_string` donne un faux négatif, vécu 02/09), **jamais par relecture**.
3. Corriger les déclencheurs qui ratent.
4. Écrire une entrée de routage « TRAVAIL CLIENT » dans `ROUTAGE.md`.

📄 `memory/tools/consultation-llm-externe-probleme-visuel-bloque.md` (méthode née de l'incident).

## Spark Icon (Upwork) — envoyée 2026-09-01, attente passive

Rien à faire tant que le client n'a pas répondu. → `memory/client-sim-tests/upwork-spark-icon/STATUS.md`.

---

## ⭐⭐⭐ PRIORITÉ 1 — PORTFOLIO ANIMÉ (décision d'Aziz, 30/08)

Corpus repro épuisé (chantier CLOS le 30/08, 3 pièces livrées) : on crée désormais **nos** pièces
sur ce que le marché valide, pas de copie. Plan 6 étapes → **`memory/starters/STARTER-portfolio-anime.md`** ⭐⭐

⏸️ Personnage HUMAIN en pause (`STARTER-PERSO-VECTORIEL-V4.md`) — si besoin d'un perso : registre
CHIEN (mascotte) ou modèle pro existant animé (prouvé sur le douanier).
⛔ Ne PAS refondre le gabarit d'ouverture vidéo → `memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md`
§ LES 5 FORMES DE COURBE (4 courbes INFIRMENT un défaut systématique).

> Le cadre stratégique (chaîne = vitrine · fer de lance pilier 2 · acquis SVG→Lottie) est gravé
> dans `memory/doctrines/PILIERS-B2B.md` — ce n'est plus une action, ne pas le redupliquer ici.

---

## 🌿 ÉTAT GIT — ne jamais figer une liste ici, l'EXÉCUTER

⛔ **Cette section a été fausse 3 fois** (30/08, 31/08, 08/09). La version du 31/08 annonçait
« 4 branches vivantes » et présentait comme mergeables 2 branches **déjà mergées** — elle portait
pourtant son propre avertissement « elle se périme au premier `git checkout -b` ». Un avertissement
n'empêche pas la péremption : **une commande, si.**

```bash
git branch --no-merged master    # ce qui porte du travail unique (11 le 08/09)
git branch --merged master       # supprimables sans risque
```

⚠️ **`feat/zambia-demo-2concepts`** — 1 commit unique (`7b024e66`, 21/08) : `gallery/index.html`,
`gallery/styles.css`, poster PageCam, absents de master. ⛔ NE PAS supprimer sans décider : la
galerie GitHub Pages a peut-être là son code de référence. **Seule branche à arbitrer.**

⛔⛔ **Avant tout ménage de branches** : `memory/projects/INCIDENT-BRANCHE-SUPPRIMEE-TRAVAIL-PERDU.md`
— une branche supprimée le 28/08 portait 2 fichiers jamais commités, récupérés par chance.
Vérifier `git status` sur la branche AVANT suppression, pas seulement ses commits.

## ⭐⭐⭐ CONTRAT UPWORK chill-meter — ACTIF (1er contrat freelance)

⚠️ **L'ÉTAT D'AVANCEMENT NE VIT PAS ICI** — il se périme en heures. Source de vérité unique,
à ouvrir en premier : → **`memory/client-sim-tests/upwork-chill-meter/STATUS.md`**

Cadre contractuel (stable) : offre v2 acceptée le 30/08, 350 $ → 297,50 $ net, 3 jalons
(3/7/11 sept.), 2 tours de révision par jalon, dossier source + README dus. État financement
vérifié via API le 08/09 : les 3 jalons ont `fundedAmount` déjà rempli (voir `upwork-mcp.md`).

🔵 **JALON 2 — 2 tours de révision faits (10-11/09), branche `fix/chill-meter-entrance-impact`
(non mergée).** État réel + prochaine action : STATUS.md (règle ci-dessus).

Invariants à ne pas perdre :
- ⛔ Ne PAS lui dire que les 6 états sont déjà rendus (atout de négociation).
- ⛔ Relire `BRIEF-CLIENT-ORIGINAL.pdf` (gitignoré) avant toute action.
- ⚠️ Retraits Upwork bloqués tant que les infos fiscales ne sont pas fournies.
- ⏸️ Prospection Upwork en PAUSE par Aziz (01/09) — ne pas relancer sans sa confirmation.
- ⛔ Ne pas montrer un livrable d'un jalon FUTUR pendant la validation du jalon en cours
  (leçon payée le 03/09, cf. STATUS.md § LA LEÇON À GRAVER).

⭐⭐⭐ Briques nées de ce contrat, réutilisables sur TOUT futur contrat client :
`REVERSIBILITE-MATIERE-GENEREE.md` · `feedback_annoter-l-image-plutot-qu-expliquer-au-client.md` ·
`CHANTIER-CADRAGE-REVISIONS-CLIENT.md` · `feedback_deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer.md` ·
`feedback_ameliorer-vs-remplacer-preciser-dans-le-brief.md` · `feedback_ne-pas-offrir-le-livrable-du-dernier-jalon-avant-de-fermer-le-premier.md`

⚠️ Worktree `retro-gates-multi-session` construit les gates multi-session sur ce même dossier —
NE PAS y toucher, chantier d'une autre session.

## ⛔ DÉCISION EN ATTENTE — 5e occurrence du pattern « registre / worktree fantôme » (11/09)

`feedback_registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent.md` portait sa propre
clause : « à soumettre à Aziz si un 5e cas survient ». **Le 5e est arrivé** (ROUTAGE pointait un
worktree `remotion-cfa` supprimé ; 12 jours après que PIPELINE ait noté la correction).
Le rustinage au coup par coup a échoué 5 fois. Option outillée à trancher : refuser dans
`check-links.py` tout chemin de navigation contenant un segment de worktree absent de
`git worktree list`.

## 🔧 SESSION D'AUDIT DU WORKSPACE — à planifier (constitué le 2026-08-27, rien d'urgent)

**1. ⭐⭐⭐ Outiller le protocole des 2 échecs** (point le plus rentable). Règle déjà écrite
(`CLAUDE.md` global § Protocole agent de diagnostic dédié), 3 preuves de valeur (18/07, 02/08, 29/08
— cette dernière montre que 2 vérifications peuvent partager le même angle mort et sembler
indépendantes à tort). ⛔ Mais rien ne compte les tentatives — pattern
`regle-ecrite-insuffisante-sans-gate-outille`. Base : `.claude/hooks/circuit-breaker.sh` compte déjà
les éditions répétées d'un fichier ; reste à définir « tentative sur le même problème » et le seuil
de délégation. Détail : `feedback_transparence-lue-comme-bug.md` § extension 2026-08-29.
**2.** **3.** Vérifier que les gates ne meurent
pas en silence (le circuit-breaker était mort le 12/07 sans que personne le remarque).

---

## 🔧 DETTE TECHNIQUE — identifiants de modèles en dur (NON URGENT, mesuré 20/08 et 30/08)

⛔ Un modèle périmé peut se dégrader **silencieusement** (pas d'erreur garantie). ⭐ Le patron à
recopier existe : `scripts/tools/da-brief-anim.py` importe ses 4 identifiants d'`api_models.py`,
zéro en dur, et applique le vrai fix `reasoning_content` de k3.

- ⚠️ **`visual-producer.md:407`** cite l'ancien identifiant image — agent qui DÉPENSE réellement,
  à traiter en premier (~28 mentions passives ailleurs, au fil de l'eau).
- ⛔⛔ **`VISION_MODEL` importé par aucun script**, en dur dans 42 fichiers : changer la constante
  ne change rien aujourd'hui.
- **`kimi-k2.5` périmé** — chiffre RE-MESURÉ le 08/09 : **15 scripts actifs** (le « 16 fichiers »
  précédent comptait `api_models.py`, qui cite k2.5 pour l'INTERDIRE). ⛔ Et **14 fichiers portent
  encore le repli interdit** `content or reasoning` — sur un jury ou une review, il fait passer une
  réflexion brute pour un verdict. Liste complète + réserves : `kimi-k3-reasoning-borne.md` § CE QUI RESTE.
  ✅ `da-brief.py` MIGRÉ le 08/09 — avec `da-brief-anim.py`, ce sont les 2 patrons à recopier.
  ⚠️ Migrer par PETITS LOTS avec un appel réel de test : la plupart passent par Moonshot NATIF (pas
  OpenRouter), et les 2 scripts VIDÉO NATIVE ne se migrent pas à l'aveugle.
- **`gemini-3.7-flash`** à tester à l'aveugle avant bascule (−62 %/−69 % coût) → `memory/tools/gemini.md`.
- **`mkprevis-camera-seule.py`** non commité.

⛔⛔ Ne jamais re-graver ici un chiffre de lignes de fiche : mesurer à la demande (`wc -l`).

## ⛔⛔ AVANT DE LIRE — les chantiers vivants sont dans des WORKTREES

> Ce fichier (repo principal) est structurellement **EN RETARD** sur les chantiers qui vivent
> ailleurs. Un commit récent dans un worktree prime toujours sur lui.
> ⛔ **Ne jamais figer ici une table de worktrees/branches** — l'EXÉCUTER :
> `git worktree list` · `git branch --no-merged master` · `git stash list`
>
> ⛔⛔ Protocole complet (merge d'une autre session · commandes destructives interdites ·
> suppression de branche · worktrees sur /tmp · push) :
> **`memory/doctrines/HYGIENE-GIT-MULTI-SESSION.md`**

---

## 🔧 BACKLOG dormant — 5 chantiers en pause, aucun n'a bougé depuis 2+ semaines

- **Chantier FMI** : rien commencé (script seulement) → `memory/projects/CHANTIER-FMI.md` (163 l.).
- **H3 audio `reference_audio_urls`** (exploratoire, à prendre quand l'Acte 3 est soldé) : styles
  FAITS (20/08), reste l'audio régénéré par H3 (corrélation 0,46). Piste jamais testée :
  `reference_audio_urls` (H3, pluriel — ne pas confondre avec `reference_audio_url` minimax-music,
  singulier, inexistant en v2.6). Prérequis : archiver `.prompt.txt`+`.meta.json` (SEED) par clip →
  `memory/tools/edition-video-ciblee-omni-seedance.md`.
- **Showcase des capacités** : reste LE DÉROULÉ (ordre/durée/musique) → cut vente 60-90s, zéro
  composant neuf à coder. Charte DA déjà FAITE (`doctrines/CHARTE-DA-FREELANCE.md`).
  → `memory/projects/SHOWCASE-CAPACITES.md`
- **Gig Fiverr** : page RÉÉCRITE et validée le 05/09 (Lottie/UI, facturation à l'ÉLÉMENT,
  50/120/250, 9 vendeurs mesurés) → **`memory/freelance-linkedin/GIG-PAGE-VALIDEE.md`**. Reste :
  nom commercial + pièces de démo. ⛔ `BRIEF-GIG-ENTREE-DE-GAMME.md` est l'offre PÉRIMÉE — ne
  pas y retourner pour les prix, ils sont tranchés.
- **Kora & Cartes** (dormant depuis 16j) : 2 décisions ouvertes — quel sujet (Afrique qui monte vs
  mythologie) et quel format (insert vs vidéo complète) → `memory/projects/EXPLORATION-DIVERSIFICATION-CHAINES.md`.
- **Chaîne Canada EN** : pipeline conclu (marché validé TubeLab, script V3 jury 4 LLM, 3 styles H3
  validés), 1 décision en attente (Mapbox réel vs 1ère scène) → `episodes/_rnd/canada-red-bay/STATUS.md`.
- **MiniMax H3 — défaut racine non résolu** : scène multi-persos dense (3+, contact physique) =
  écran noir, toujours NON résolu. Contournement prouvé : 2 persos max, zéro contact croisé →
  `tools/minimax-h3-comfy-cloud.md`.

---

## ⭐⭐⭐ GAZODUC — ACTE 3 : 1 segment FINAL (C) · A débloqué à VALIDER · B à porter (gel levé le 28/08)

**Actes 1, 2, 4, 5 : FINAUX.** L'Acte 3 est le dernier en chantier, et il a été DÉBLOQUÉ le 18/08
après des semaines de gel.

| Segment | État |
|---|---|
| A / Beats 1-2 (0→55 s) | ⭐ **débloqué, à faire valider** — `versions/acte3-segmentA-beats12-V3.mp4` |
| A / Beat 3 (55→72,3 s) | ⏭️ **PROCHAINE ACTION** — spec V5 complète, codée à moitié |
| B (73,9→105,8 s) | ⏭️ porter l'animation sur le décor Fable 5 |
| C (105,8→123,1 s) | ✅ **FINAL** — `acte3-segmentC-verrou-FINAL.mp4` |

**⏭️ PAR QUOI REPRENDRE — le Beat 3 (panneau financement).** Le plus prêt : spec au pixel près dans
`breakdown-v5-json/beat3-breakdown.json`, aucune décision de goût à prendre, image-cible déjà montrée
à Aziz. Manquent : banque barrée DANS le panneau, trio ALGÉRIE→vanne←NIGERIA, cylindres comparatifs.
Détail : STATUS.md § ACTE 3.

⛔ NE PAS ressortir la TRANCHÉE (retirée le 18/08, hors script). ⛔ NE PAS prolonger la rupture
plein écran au-delà de 155 frames (ne boucle pas). ⛔ NE PAS remettre l'encart Adrar après la
rupture (redite, décision d'Aziz).

**Reste ensuite** : assemblage Acte 4 (3 fichiers, 300ms de marges à rogner, `concat=n=N:v=1:a=0`) ·
CTA de fin (jamais commencé, pas d'interpellation directe) · passe palette sombre `PAL_GPT` pour
Actes 1/2/3 (pas acte par acte).

⭐ Méthode storyboard refondue cette session (audit tiers obligatoire, 3 modèles dessinateurs 1 appel
chacun, liseré au lieu d'écrire) → `memory/fiches/FICHE-STORYBOARD.md`.

---

## 🔧 BACKLOG — Studio réutilisable (Mécanisme 1 Gardien, pas urgent)

Mécanisme 2 (Extracteur) codé et validé (~30 briques indexées) — `doctrines/STUDIO-REUTILISABLE-GATE.md`.
Mécanisme 1 (Gardien) : pas codé, volontairement, rien d'urgent.

---

## 📤 PUBLICATION

> ⭐⭐ La chaîne publie. Calendrier détaillé + IDs de posts + interdits :
> `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
> (source de vérité unique — ce fichier-ci ne recopie plus l'état, qui périme trop vite).
>
> ⏭️ **Prochaine action** : construire le Short Soudan (boucle NotebookLM, scripts déjà présents dans
> `scripts/tools/soudan-short-audio/`) — dernier Short manquant du calendrier. Puis GAZODUC.
> Outils : `scripts/tools/jury-titres-llm.py` · `scripts/tools/jury-thumbnail-llm.py` · ROUTAGE.md § « Publier ».

---

## ⛔ NE PAS PROPOSER — AES abandonné volontairement (décision Aziz 2026-08-17). PAS une dette.

Ne plus le proposer ni le compter dans le reste-à-faire. La refonte V6 ne sera PAS assemblée ni
republiée : l'échec à 5 vues/24h est un problème de TITRE/MINIATURE/SUJET, pas de production —
republier ne rachète pas la distribution. Reste utile : script V6 comme gold-standard de script
dense (pointeur dans `ROUTAGE.md`). Détail : `episodes/warmap-sahel/STATUS.md`.

---

## ⏳ ACTIONS OUVERTES

- **Recharger le crédit OpenAI** : quota épuisé 25/07 (`429`), bloque `whisper-align.py`/
  `transcribe-openai.py` (contournement en place : `forced-align.py` ElevenLabs). OpenRouter renvoie
  aussi `402` depuis le 25/08 — a empêché de tester GPT-5.5 dans le comparatif 3D, trou de mesure à
  combler après recharge.
- **Activer les routines /schedule** — NON FAIT, re-signaler en début de session jusqu'à confirmation
  d'Aziz. 2 routines cloud Postiz (`postiz-weekly-check.py` jeudi 9h, `postiz-weekly-report.py`
  samedi 10h), ajouter `POSTIZ_API_KEY`. Supprimer cette ligne une fois confirmé.
- **Audit des skills du workspace** — demandé 11/07, jamais fait. `ls ~/.claude/skills | wc -l` dossiers (⛔ mesurer, ne pas graver le compte),
  suspicion de redondance (génériques vs spécifiques Remotion, doublons fonctionnels).

---

## 💡 BACKLOG dormant → `memory/backlogs/BACKLOG.md` § SECTION 3

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

**Format : 3 lignes max par projet** (Etat / Decision en attente / Recommandation).

⛔ **Un projet TERMINÉ se SUPPRIME de ce fichier** — son état vit dans `memory/episodes/<ep>/STATUS.md`
et sa publication dans le calendrier. Ne jamais garder de « trace historique » ici : git la conserve.
Ce fichier a déjà dépassé 116 Ko (juillet) puis 26,5 Ko (août) faute d'appliquer cette règle en continu.

## 🔧 BACKLOG — fiches saturées, à SCINDER en DÉBUT de session

Budget d'une fiche = **55 lignes** (contexte injecté à chaque édition). Plusieurs le dépassent.
⛔ Scission en DÉBUT de session, jamais en clôture (risque de rendre une fiche muette sans
l'éprouver ensuite). ⛔ Ne pas re-graver les chiffres ici (règle § worktrees) — les MESURER :
`wc -l memory/fiches/*.md | sort -rn | head`
