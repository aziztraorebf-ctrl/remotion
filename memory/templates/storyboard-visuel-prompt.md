# Template — Génération Storyboard Visuel avec Gemini 3.1-pro-preview

## Quand l'utiliser
AVANT d'écrire le manifest ou tout code de beat.
Input requis : script audio de l'épisode + durée totale + liste composants disponibles.

## Procédure

1. Lire le script audio complet
2. Lister les composants disponibles dans `src/projects/_shared/components/layouts/` et `inserts/`
3. Envoyer ce prompt à Gemini 3.1-pro-preview (text only, pas d'image à ce stade)
4. Sauvegarder le résultat dans `src/projects/souverain/<episode>/storyboard/beat<N>-storyboard.md`
5. Valider que chaque segment respecte R1 (max 8s sans changement)

## Prompt Template

```
Tu es directeur artistique pour GeoAfrique, chaîne YouTube Shorts africaine premium.

SCRIPT AUDIO :
[coller le script complet ici]

DURÉE TOTALE : [X secondes]

COMPOSANTS DISPONIBLES :
[liste des composants _shared/]

RÈGLES NON-NÉGOCIABLES :
- Max 8 secondes sans changement visible à l'écran
- Changement = nouvelle animation, nouveau composant, nouveau stat affiché, nouveau texte
- Permanent motion (pulse, glow) ne compte PAS comme changement
- Palette : fond #0a0a0a/#0d1420, gold #c8a951/#FFB800, ivory #f5efe0
- Typographie : Cinzel serif pour titres, IBM Plex Mono pour stats, Inter pour corps

MISSION :
Découpe cette vidéo beat-par-beat. Pour chaque beat :
1. Durée (secondes)
2. Segments de max 8s avec : composant utilisé (existant ou nouveau à créer), texte/stat affiché, mouvement permanent
3. Justification du choix visuel (pourquoi ce composant pour ce contenu)
4. Si nouveau composant nécessaire : description précise de ce qu'il doit faire

FORMAT RÉPONSE :
```json
{
  "beats": [
    {
      "beat": 1,
      "duration_s": 11,
      "title": "Hook",
      "segments": [
        {
          "start_s": 0,
          "end_s": 5,
          "component": "BrutalHeadline",
          "content": "texte/stat affiché",
          "permanent_motion": "Ken Burns scale 1.0→1.07",
          "change_trigger": "apparition ligne 2"
        },
        {
          "start_s": 5,
          "end_s": 11,
          "component": "BrutalHeadline",
          "content": "accent line LE KENYA.",
          "permanent_motion": "pulse gold bar",
          "change_trigger": "accent reveal"
        }
      ],
      "new_component_needed": false
    }
  ]
}
```
```

## Après réception

Vérifier manuellement :
- Aucun segment > 8s
- Chaque beat a minimum 1 changement visible toutes les 8s
- Les composants suggérés existent dans _shared/ ou sont clairement décrits (nouveaux)

Sauvegarder dans : `src/projects/souverain/<episode>/storyboard/beat<N>-storyboard.md`
Format : coller le JSON + ajouter section "VALIDÉ RYTHME : OUI/NON" en bas.
