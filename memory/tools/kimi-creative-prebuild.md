# Workflow Kimi Creative Pre-Build (étape canonique pipeline Atlas)

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-02, épisode Atlas Shaka Zulu archivé).
> ⚠️ Kimi K2.5 est aujourd'hui PÉRIMÉ côté doctrine projet — seul Kimi K3 est autorisé (cf CLAUDE.md).
> Le PATTERN (brief créatif structuré avant code) reste valable, migrer le modèle vers K3.

## Regle : etape Kimi Creative obligatoire dans le pipeline Atlas

Apres avoir produit le `timing.ts` + `<episode>-manifest.ts`, AVANT d'ecrire le moindre composant Remotion, envoyer un brief textuel structure a Kimi (K3 aujourd'hui) pour obtenir un regard creatif technique.

## Pourquoi

Kimi est un bon directeur creatif technique quand brief avec le contexte stack exact — il propose des idees DANS les contraintes, pas des effets impossibles.

Sans cette etape, on code direct selon les premieres intuitions et on rate :
- Des solutions creatives a "comment rendre la carte vivante"
- Des usages plus profonds des outils (sprites comme acteurs spatiaux, pas decoration)
- Des problemes structurels invisibles dans le manifest (ex: layout statique sur toute une duree)
- Des micro-pattern interrupts qu'on n'aurait pas pense ajouter

## Comment

1. **Script** : `scripts/tools/kimi-creative-brief.py` (⚠️ vérifier existence — text-only, supportait moonshot + openrouter)
2. **Brief** : 9-10 KB markdown structure avec :
   - Contexte produit (format, voix, style)
   - Script complet avec timestamps Forced Alignment
   - Structure pre-validee par scene
   - Assets disponibles
   - Contraintes stack (ce qu'on PEUT et ce qu'on NE PEUT PAS)
   - 5 questions precises (pas brainstorm libre)
   - Format de reponse attendu (idee + how + impact + cout + variantes)
   - Demande verdict explicite (3 must, 2 nice, 1 a supprimer)
3. **Cout** : ~$0.01-0.05 par brief
4. **Output** : sauvegarde dans `memory/episodes/<episode>/kimi-reply-creative.md` (adapter au chemin repo actuel)

## Pieges a eviter

- **Ne pas envoyer le brief sans alignment** : Kimi reagit aux durees et frames precises. Si timing.ts est faux, Kimi optimise pour le mauvais probleme (cas vécu : brief annonçait une durée fausse sur une scène → Kimi a recommandé d'abandonner un dispositif alors que le vrai problème était le brief).
- **Ne pas accepter les recommandations sans esprit critique** : Kimi a des biais (tendance "tout doit etre cinematique"). Verifier que chaque suggestion respecte le brief original.
- **Ne pas tout integrer d'un coup** : plusieurs idees Kimi + plan original = empilement. Trier par vagues (must / nice / polish) avant de coder.
- **`thinking` enabled vide souvent la completion** : utiliser `thinking: disabled` sinon reponse vide (cf `memory/tools/kimi-k3-reasoning-borne.md` pour le comportement K3 actuel).
- **Moonshot peut etre overloaded** : avoir un fallback OpenRouter ready (`--backend openrouter`).

## Format de tri post-Kimi

Apres reponse Kimi, produire un `PLAN-VAGUES.md` :
- **Vague 1 (must-have)** : structure narrative + assets critiques
- **Vague 2 (enrichissement)** : effets visuels qui transforment "fonctionnel" en "memorable"
- **Vague 3 (polish)** : micro-ameliorations professionnelles

Chaque vague validee visuellement (mini-render) avant la suivante.

## Pipeline Atlas mis a jour (référence historique — voir `memory/tools/atlas-pipeline-structure-dossiers.md` pour la version consolidée)

```
1. Script valide
2. Audio TTS ElevenLabs
3. ElevenLabs Forced Alignment
4. Whisper API (sous-titres karaoke)
5. timing.ts (frames + segments + inserts + beats)
6. <episode>-manifest.ts (guide visuel complet)
7. *** Brief Kimi Creative + tri en vagues ***  ← cette etape
8. Generation assets vague 1 en parallele
9. Composants Remotion vague 1
10. Mini-renders validation par scene
11. Iterations vagues 2-3 selon validation Aziz
12. Render final + upload
```

## Premier cas d'usage : Atlas Shaka Zulu (2026-05-02, épisode aujourd'hui archivé)

Résultat : 5 idées créatives intégrées (warriors marchent en cornes, fracture carte, compteur spring lourd, parallaxe carte, micro-interrupts), 1 idée rejetée (abandon d'un dispositif triple-screen — basé sur un faux problème créé par un mauvais brief de durée).
