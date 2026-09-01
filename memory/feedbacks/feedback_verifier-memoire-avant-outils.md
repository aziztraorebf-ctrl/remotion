# Vérifier la mémoire AVANT de tenter un outil

## Erreur passée (2026-05-09)

Pendant la création du dashboard Souverain :
1. J'ai uploadé le HTML sur catbox.moe
2. Aziz a signalé : "ça ne marche pas sur catbox, tu dois utiliser here.now"
3. J'ai cherché `grep -r "here.now"` et trouvé `memory/tools/here-now-hosting.md` qui documentait déjà :
   - Le problème exact (catbox sert HTML avec content-length 0)
   - La solution (here.now avec API 3 étapes)
   - Le script ready-to-use `~/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh`

**Cause** : j'ai sauté l'étape de vérification mémoire avant de tenter l'outil.

## Règle à appliquer

**Avant de tenter un upload/déploiement/intégration externe (host HTML, API tierce, plateforme nouvelle)** :

1. `grep -r "<keyword>" memory/tools/ memory/` pour vérifier si le sujet est déjà documenté
2. Si oui : appliquer la solution existante
3. Si non : tenter l'outil ET sauvegarder le résultat dans `memory/tools/`

## Mots-clés à toujours grep avant action

- Hosting / déploiement : `here.now`, `vercel`, `catbox`, `s3`, `cloudflare`
- APIs LLM : `kimi`, `moonshot`, `gemini`, `openrouter`, `gpt`
- Outils image : `gemini`, `recraft`, `pixellab`
- Outils vidéo : `seedance`, `kling`, `fal`
- Render : `remotion render`, `chrome`, `webgl`

## Pourquoi cette règle est critique

La mémoire du projet contient des **erreurs déjà payées** (debugging time, decisions trade-offs). Re-payer le coût de découverte = anti-pattern.

L'auto-mémoire MEMORY.md est chargée en début de session mais ne contient que des pointeurs courts. Pour les outils, **toujours grep le contenu réel des fichiers tools/**.

## Cas similaire à surveiller

- Si Aziz mentionne "tu peux uploader sur X" → grep tools/ pour X avant
- Si Aziz mentionne "lance le jury" → grep pour `jury_3llms` ou `review_with_kimi`
- Si Aziz mentionne "fais un dashboard" → check `production-dashboard-pattern.md` + `here-now-hosting.md`

Note (2026-08-31) : le mécanisme d'upload par défaut a depuis évolué vers Artifact Claude (cf. CLAUDE.md
§ Communication mobile) ; le principe général de cette fiche — vérifier la mémoire avant de retenter un
outil déjà documenté — reste valable indépendamment de l'outil précis en cause.

---
Migré depuis auto-memory (`feedback_verifier-memoire-avant-outils.md`) le 2026-08-31, contenu original inchangé.
