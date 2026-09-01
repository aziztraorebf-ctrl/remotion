# Délégation stricte Claude -> Agents (jamais de prompts par Claude orchestrateur)

> Migré depuis auto-memory 2026-08-31. Violation détectée 2026-04-23/24 sur session Thiaroye V5
> Scene 1. Complète le principe général CLAUDE.md § agents/orchestration avec un cas concret et
> une check-list opérationnelle appliquée au pattern dashboard scenes.json.

## Contexte

CLAUDE.md contient déjà la règle générale de délégation aux agents spécialisés. **Cette règle a été
violée** pendant la session Thiaroye V5 du 2026-04-23/24 :

Quand Claude a préparé le dashboard Thiaroye V5, il a **rédigé lui-même** les 8 prompts Gemini + 8
prompts Seedance + options caméra pour les scènes 2-6, au lieu de demander à l'agent visual-producer.

## Pourquoi c'est problématique

L'agent visual-producer a :
- Mémoire cumulée plus profonde (règles R-PC, patterns Sonjata, formules validées, checklist pre-launch)
- Habitude de l'auto-critique systématique de ses prompts avant envoi
- Connaissance des règles R-SLOW, R-DURATION, R-DYNAMIC intégrée

Quand Claude (orchestrateur) court-circuite cette étape, il fait des **erreurs que l'agent n'aurait
pas faites**.

## Erreurs détectées au review agent (2026-04-24)

Quand Aziz a demandé un review a posteriori des prompts de Claude, l'agent visual-producer a détecté :

1. **R-SLOW violée dans 8/8 prompts** — "slowly pushes in", "gently place", "very subtly sways" produisent du quasi-statique. Aurait dû être évidente pour l'agent dès le 1er prompt.
2. **Une scène demandait 12s continu à Seedance** — violation R-DURATION (>10s = décrochage Seedance). L'agent aurait automatiquement split en 7s + 5s complément.
3. **Une scène "stays dignified" = statue** — violation R-DYNAMIC v2. L'agent aurait ajouté des micro-actions (thumb PRESSES paper, chest EXPANDS, jaw SETS).

**Sans ce review, on aurait perdu $10-20 en regens Seedance à cause de ces erreurs.**

## Règle renforcée

### Claude orchestrateur FAIT :
- Lire le brief, le manifest, la narration, les règles
- Extraire les segments de timing depuis forced alignment
- Définir les types de scène (contemplative / narrative / action)
- Préparer la structure du dashboard (scenes.json skeleton avec narrations, durées, types)
- Déléguer aux agents spécialisés
- Transmettre les décisions Aziz aux agents
- Présenter les résultats agents à Aziz
- Synthétiser les leçons post-session

### Claude orchestrateur NE FAIT JAMAIS :
- **Rédiger des prompts Gemini ou Seedance** (même si "simple")
- Choisir les mouvements caméra sans agent
- Écrire du code de génération d'images ou vidéos
- Auto-valider des reviews techniques (dot-eyes, flat fills, etc.)
- Générer des assets via appel API direct

### Agent visual-producer FAIT :
- Rédiger tous les prompts Gemini et Seedance
- Proposer les options caméra SAFE/MEDIUM/RISKY (cf `memory/feedbacks/feedback_reviews-seedance-cameras.md`)
- Lister les mouvements intrinsèques R-DYNAMIC
- Review technique (checklist pre-launch)
- Génération images + clips
- Self-review visuel avant présentation Aziz

## Application concrète au workflow dashboard

Quand Claude crée ou met à jour un scenes.json :
- Remplir les champs **structurels** : id, title, start_s, end_s, duration_s, narration, type, charref
- Remplir les champs **narratifs** : image_description (haut niveau), intrinsic_motions (haut niveau)
- **Laisser vides** les champs prompt_gemini_template + prompt_seedance_template + camera_movement_options + camera_movement_choice
- **Demander à l'agent visual-producer** de remplir ces champs via review ou génération fresh

## Exception

Si Aziz demande explicitement à Claude de rédiger un prompt (ex: "peux-tu suggérer un prompt pour tester rapidement"), Claude peut le faire MAIS doit **automatiquement** demander un review à l'agent avant utilisation.

## Apprentissage méta

Une règle dans CLAUDE.md n'est pas suffisante si Claude ne s'y tient pas en pratique. Les règles
doivent être **rappelées** dans les briefs opérationnels et les process de travail (pattern
dashboard) pour être vraiment appliquées.
