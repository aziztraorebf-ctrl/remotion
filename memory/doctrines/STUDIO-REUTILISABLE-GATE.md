# STUDIO RÉUTILISABLE — Gate d'usage + Extracteur de fin de session

> Créé 2026-08-07 (session dédiée "studio réutilisable", diagnostic 4 agents internes + audit externe
> 3 voix DA-brief `da-studio-reutilisable-gate`). Conception validée Aziz.
> ✅ **Mécanisme 2 (Extracteur) CODÉ le 2026-08-07** dans `~/.claude/skills/wrap/SKILL.md` (Agent EXTRACTOR,
> 4e agent parallèle de la Phase 1, filtre mécanique 3 conditions — substantiel/isolable/pas-doublon —
> auto-approuvé en statut `proto` sans validation Aziz, `prouvé` seulement si réutilisation détectée ≥2
> fichiers ou validation Aziz mentionnée au brief). **Pas encore testé en conditions réelles** (prochain
> `/wrap` de fin de session le validera).
> ⏳ **Mécanisme 1 (Gardien) toujours à coder** — attend que l'Extracteur ait fait vivre les catalogues sur
> au moins 1-2 sessions avant d'y adosser un gate bloquant (sinon punit le travail neuf faute de matière).
> Détail sorties externes brutes : `/tmp/da-refs/da-studio-reutilisable-gate-{gemini,kimi,deepseek}.md`
> (éphémère — si besoin de relire après coup, régénérer via `da-brief.py` avec le même brief).

---

## Le problème diagnostiqué (pas une supposition — mesuré)

Les catalogues (`COMPOSANTS-INDEX.md`, `CATALOGUE-CARTE-VIVANTE.md`, `INTENTION-FORME-INDEX.md`) existent,
mais deux trous distincts et complémentaires les rendent inefficaces en pratique :

1. **Trou d'exécution** : la règle "scanner avant de coder" est une instruction textuelle sans artefact
   vérifiable. 3 cas tracés en historique git (Gazoduc Acte 1 globe 02/08, War-Map hook Bellona 15/06,
   War-Map P2 11/06) où le catalogue existait déjà (8 à 45 jours avant) et a été sauté — découvert
   seulement APRÈS un rejet visuel d'Aziz, jamais en amont. Confirmé sur la session même qui a produit ce
   diagnostic : les 7 fichiers `.tsx` modifiés (`Partie1-4.tsx`, `SahelWarMapEngine.tsx`) ne matchent aucun
   hook bloquant (motif de nom `Beat*.tsx` uniquement).
2. **Trou d'alimentation** (signalé par Aziz, tout aussi structurel) : la majorité des scènes cartographiques
   récentes (Soudan, AES, Shorts) n'ont jamais été extraites en briques classifiées — le catalogue lui-même
   est incomplet. Confirmé : Gazoduc (10 fichiers livrés en 2,5 semaines) quasi absent des 3 catalogues.
   **Un gardien qui bloque l'écriture tant qu'aucune brique du catalogue n'est utilisée est inutile, voire
   nuisible, si le catalogue est vide** — il punirait de coder du neuf légitime faute de matière à réutiliser.

Les deux mécanismes ci-dessous doivent donc être pensés ensemble, jamais l'un sans l'autre.

---

## Mécanisme 1 — Le Gardien (hook technique, bloque l'écriture)

### Verdict de faisabilité (convergence 3/3 externe + audit interne)
Prouver qu'un agent a **lu** un catalogue est structurellement impossible sans oracle externe (appel réseau
tiers) — un LLM peut toujours produire un résumé plausible sans avoir vraiment consulté le fichier. Gemini,
Kimi et DeepSeek, consultés séparément sans se concerter, arrivent à la même conclusion. Ne PAS chercher à
prouver la lecture.

### Le principe retenu — prouver l'USAGE, pas la lecture (proposition DeepSeek, la plus solide des 3)
Au lieu de "as-tu lu le catalogue ?" (impossible à vérifier), on vérifie mécaniquement "le code que tu
écris réutilise-t-il réellement une brique existante ?" — directement la finalité métier, pas un proxy
indirect.

**Pourquoi pas les 2 autres pistes externes** (comparées, pas juste listées) :
- Gemini (token caché à retrouver dans le catalogue) : prouve seulement que le texte a été chargé en
  contexte, pas utilisé pour décider — contournable par un `grep` aveugle (le modèle l'admet lui-même).
- Kimi (fingerprint SHA256 de composants référencés) : expose un trou plus grave que ce qu'il résout —
  "catalogue poisoning" (l'agent édite le catalogue pour y légitimer sa propre variante et générer un hash
  valide dessus).

### Mécanique (2 hooks, pré + post)
1. **Hook `PreToolUse` sur `Edit`/`Write`**, déclenché sur l'événement générique — tout fichier de scène
   sous `src/projects/*/`, PAS seulement le motif `Beat*.tsx` (c'est le trou mesuré cette session : un
   fichier nommé autrement échappe structurellement aux hooks actuels).
   - Extrait les imports du fichier en cours d'écriture.
   - Vérifie qu'au moins un import référence un export réel des catalogues (`COMPOSANTS-INDEX.md`,
     `CATALOGUE-CARTE-VIVANTE.md`, `INTENTION-FORME-INDEX.md`, parsés et mis en cache — voir friction).
   - Si aucun import catalogue détecté → bloque (`exit 1`), message clair pointant les 3 fichiers à
     consulter.
   - Si un import référence un nom qui n'existe dans aucun catalogue → avertit sans bloquer (nom probablement
     mal orthographié, à vérifier).
2. **Hook `PostToolUse` sur le même fichier** : vérifie que l'import catalogue déclaré est **effectivement
   utilisé** dans le JSX (via une passe ESLint `no-unused-vars` ciblée), pas juste présent pour faire
   illusion. Ferme le trou évident ("import cosmétique collé juste pour passer le gate 1, code maison à
   côté sans l'utiliser").

### Gardes anti-friction (les 3 modèles convergent sur ce principe, détail varie)
- **Mémoïsation par session/beat, pas par fichier** : une fois validé pour un beat, le hook ne re-bloque
  pas les fichiers suivants du même beat pendant la session (cache + TTL raisonnable).
- **Cache du parsing des catalogues** : parsés une fois par session, pas à chaque Edit/Write.
- **Échappatoire tracée, jamais silencieuse** : un commentaire explicite type `// @nocatalogcheck` en tête
  de fichier peut désactiver le hook pour un cas légitime (config pure, pas de rendu visuel) — mais reste
  visible en review, jamais un contournement invisible.

### Condition de mise en service — NE PAS activer avant le Mécanisme 2
Le gardien ne doit bloquer que sur des briques marquées **`statut: prouvé`** dans les catalogues (voir
Mécanisme 2). Bloquer sur un catalogue clairsemé pénaliserait le travail neuf légitime — c'est directement
le trou d'alimentation qu'Aziz a signalé en réponse à la conception initiale.

### Risque à surveiller après mise en service
Import déclaré mais non substantiellement utilisé (un `<EffetVague opacity={0} />` caché qui satisfait
techniquement les 2 hooks sans réutiliser l'esprit du composant) — pas résolu mécaniquement, à surveiller
en review humaine occasionnelle, pas un point bloquant pour le lancement.

---

## Mécanisme 2 — L'Extracteur (nouvel agent dans `/wrap`)

### Le principe (proposé par Aziz, tranché : indexer largement + statut, pas le seuil strict actuel)
`INTENTION-FORME-INDEX.md` a déjà une règle de promotion (proto → brique si réutilisé ≥2 fois OU validé
Aziz) — mais rien ne l'applique en pratique : personne ne relit la session pour se demander "qu'est-ce qui
mérite promotion ?". Résultat : le catalogue reste pauvre par défaut d'exécution, pas par absence de règle
— même pattern que le Mécanisme 1 avant conception (une bonne règle, zéro geste qui la fait vivre).

**Décision Aziz (2026-08-07)** : ne PAS attendre le seuil "≥2 usages" pour indexer — ça crée le cercle
vicieux qu'Aziz signale (Gazoduc/Soudan/AES jamais réutilisés car jamais trouvables). L'extracteur indexe
**largement**, avec un statut clair :
- `statut: prouvé` — composant déjà validé visuellement par Aziz sur un livrable réel (peut être bloquant
  pour le Mécanisme 1).
- `statut: proto / à confirmer` — codé cette session, jamais encore rejoué ailleurs, visible mais non
  bloquant pour le Gardien tant qu'il n'est pas confirmé.

### Intégration dans `/wrap` (skill existant, architecture déjà prête)
`/wrap` orchestre déjà 3 agents parallèles (CLEANUP, INSIGHTS, COHERENCE) + une Phase 1.5 orchestrateur
seul + validation avant écriture (voir `~/.claude/skills/wrap/SKILL.md`). Ajouter un **4e agent EXTRACTOR**
dans la Phase 1, même parallélisme, même contrat de rapport JSON que les autres (pas de nouveau flux à
inventer).

**Agent EXTRACTOR — mission** :
1. Scanner le diff de session (fichiers `.tsx` créés/modifiés sous `src/projects/*/`, hors `_rnd/` si le
   proto est resté jetable au sens strict).
2. Pour chaque scène/effet substantiel repéré : identifier s'il a un équivalent déjà catalogué (éviter le
   doublon d'indexation) ou s'il est neuf.
3. Produire une fiche compacte par candidat : nom, fichier source, intention/forme (1 ligne, format déjà
   utilisé par `INTENTION-FORME-INDEX.md`), statut proposé (`prouvé` si Aziz a visuellement validé le
   livrable cette session, `proto/à confirmer` sinon).
4. Rapport JSON (même contrat que Agent INSIGHTS de `/memo`) avec un champ `target_catalog` (lequel des 3
   fichiers) et `action` (CREATE/APPEND).
5. **Ne jamais écrire directement dans les catalogues** — l'orchestrateur valide en Phase 2 comme pour les
   3 autres agents, puis écrit en Phase 3. Mêmes garde-fous que le reste de `/wrap` (jamais de commit auto,
   jamais d'écriture sans validation).

### Pourquoi pas dans `/session-close` ou `/memo` séparément
`/wrap` est déjà le point de passage qui a le contexte complet de session (brief Phase 0) et le flux de
validation. Un 5e skill séparé dupliquerait ce flux pour rien — cohérent avec la règle "améliorer l'existant
avant de créer".

---

## Ordre d'implémentation (ne pas inverser)
1. ✅ **Mécanisme 2 fait** (Extracteur dans `/wrap`, 2026-08-07) — fait vivre les catalogues. Reste à
   observer sur 1-2 sessions réelles si l'indexation large + statut fonctionne sans bruit.
2. ⏳ **Mécanisme 1 ensuite** (Gardien), activé seulement sur les briques `statut: prouvé` — une fois qu'il y
   a assez de matière prouvée pour que bloquer ait un sens plutôt que de punir le travail neuf.

## Pointeurs
- Diagnostic complet (4 rapports agents internes) : cette session, non fichés séparément — voir historique
  conversation 2026-08-07 si besoin de re-dérouler le raisonnement complet.
- Doctrine sœur (gate qui marche, modèle de référence) : `memory/doctrines/DA-BRIEF-GATE.md`.
- Règle de promotion proto→brique déjà actée : `src/projects/_shared/INTENTION-FORME-INDEX.md` (§ "OÙ
  RANGER CE QUE JE CODE").
- Skill à modifier : `~/.claude/skills/wrap/SKILL.md` (ajout Agent EXTRACTOR, Phase 1).
