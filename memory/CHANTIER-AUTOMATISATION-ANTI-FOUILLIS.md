# CHANTIER DÉDIÉ — Automatisation anti-fouillis (réduire les erreurs d'exécution de Claude)

> Né de la frustration réelle d'Aziz (2026-06-19) : malgré tous les outils/doctrines/scripts, Claude fait
> trop d'erreurs d'exécution (ignore les templates qu'on vient de choisir, timing calé sur l'absolu au lieu
> du local, sous-dimensionne, ne lance pas l'auto-vérif qui EXISTE). Diagnostic partagé : **le problème n'est
> PAS l'absence d'outils — tout existe déjà. C'est que le système est un FOUILLIS trop touffu pour que Claude
> (ou une instance vierge, sur mobile, en mode médium) retrouve/active les bons outils au bon moment.**

## ⛔ PRINCIPE DIRECTEUR (Aziz)
**Automatisation à tout prix.** Concevoir pour une instance VIERGE avec trop de contexte, sur mobile, en mode
médium. Si elle ne peut pas faire bien DU PREMIER COUP sans réfléchir, le système a échoué. L'automatisation
doit porter la charge — pas la mémoire de Claude ni la vigilance d'Aziz. ⚠️ Mais : **ajouter des scripts/hooks
à un fouillis = aggraver le fouillis.** On ÉLAGUE d'abord, on automatise un système PROPRE ensuite.

## CE QUE LA SESSION DÉDIÉE DOIT FAIRE (dans l'ordre)

### 1. AUDIT BRUTAL de l'existant — élaguer AVANT d'ajouter
Passer en revue ~91 scripts + tous les hooks + ~50 doctrines. Pour CHACUN : "a-t-il produit un résultat
concret cette année ?" NON → archivé/supprimé. Les "grands ménages" précédents ont RANGÉ, pas ÉLAGUÉ. On ne
peut pas automatiser un fouillis.

### 2. UNE porte d'entrée UNIQUE, automatique, non-contournable
Aujourd'hui : 5 chemins pour produire une scène (beat-session / proto / à la main / demos...). C'EST le
fouillis. Cible : UN seul point d'entrée "je produis une scène" → flux auto enchaîné SANS choix :
storyboard → breakdown → code → AUTO-VÉRIF obligatoire → correction → présentation.

### 3. AUTO-VÉRIFICATION avant présentation, IMPOSÉE PAR HOOK
Erreur récurrente : Claude montre le 1er jet buggé. `visual_review.py` EXISTE mais rien n'oblige à le lancer.
Hook PreToolUse sur upload/présentation : exige frames extraites + comparées au breakdown + note /10. Tant que
< 8/10 sur critères OBJECTIFS (timing local correct, template décidé bien utilisé, dimensions conformes au
breakdown) → Claude NE PRÉSENTE PAS, il corrige. (Boucle déjà conçue pour Gemini, adapter GPT-5.5.)

### 4. REMETTRE EN QUESTION LES ACQUIS (Aziz)
- **Branche systématique** : crée peut-être plus de confusion que de valeur pour une prod solo itérative.
  Trancher : garder pour gros chantiers, abandonner pour le quotidien ?
- **Organisation dossiers** : `_proto-16-9/` vs `souverain/.../v3/` vs `_demos/` → Claude s'y perd et code
  "à côté" du système. Structure où le BON emplacement est ÉVIDENT.

### 5. TEST DE VALIDATION = l'instance vierge
Un Claude neuf + UN fichier → produit-il une scène correcte sans se perdre ? Si NON, le système n'est pas
prêt. C'est le critère de fin de session.

## LES 3 CAUSES RÉELLES DES ERREURS (diagnostic Claude, honnête)
1. **Claude ne branche pas les outils/scripts qui existent** (le plus gros — fouillis + code à la main).
2. **Claude ne s'auto-vérifie pas avant de montrer** (alors que visual_review.py existe).
3. **Mode médium** amplifie (mais pas la cause ; et on NE PEUT PAS s'y fier : option mode élevé absente sur
   mobile). → la solution DOIT marcher en médium + mobile. Garde-fou STRUCTUREL, pas dépendant du mode.

## NUANCE IMPORTANTE — ne PAS se re-figer sur les templates (Aziz)
Le garde-fou NE doit PAS être "as-tu cherché un template ?" (= le piège template-first qu'on a abandonné,
[[CONTINUITE-SCENE-INTENTION-DABORD]]). Il doit être : "as-tu exécuté FIDÈLEMENT ce qui a été décidé —
template SI on en a choisi un, sinon ta création justifiée par l'intention — et vérifié contre le breakdown ?"
L'erreur coin-flip n'était pas "j'aurais dû partir d'un template" ; c'était "on avait CHOISI ce template, et
je ne l'ai pas utilisé". Intention → forme → (template SI existe, sinon créer). Ne pas se figer.

## QUAND
Session DÉDIÉE, à tête reposée, depuis DESKTOP (mode élevé dispo), PAS en pleine prod Sénégal. C'est de
l'architecture, pas de la prod. Finir d'abord la scène 1 Sénégal en cours.

## CAPACITÉ VÉRIFIÉE (pour ne pas reconfabuler)
Claude NE PEUT PAS changer son propre mode de réflexion en cours de conversation (vérifié : aucun outil
set_reasoning_effort). Il peut seulement donner un `effort` à un SOUS-AGENT/workflow qu'il lance. Le mode de
la conversation = contrôlé par l'interface (Aziz) uniquement.
