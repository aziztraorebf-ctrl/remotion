---
name: Pipeline improvements — identifies 2026-04-20
description: 5 ameliorations pipeline identifiees en session. A implementer progressivement pour accelerer les scenes 7-10.
type: project
originSessionId: 77023e98-5196-4b44-bc9f-154778fe51b2
---
# Pipeline Improvements — A implementer

> Identifies session 2026-04-20. Priorite : scenes 7-10 Sonjata Papercraft.

## 1. Gallery de review legere
**Probleme** : gallery HTML 85 MB en base64 inline, lente a charger sur mobile.
**Solution** : uploader les images individuellement sur Vercel Blob, generer un HTML qui les reference par URL. Taille cible : <1 MB.
**Priorite** : moyenne (fonctionne mais lent)

## 2. Script de generation unifie
**Probleme** : un script Python par scene (generate-scene5a-clip.py, generate-scene5b-clip.py...). Erreurs d'endpoint (V1 vs V2), duplication de code.
**Solution** : `python generate-clip.py --scene 6B --endpoint v2 --duration 6 --audio --seed 42`
- Lit le manifest pour les defaults (image source, charsheet, palette)
- Endpoint choisi explicitement (v1-pro, v2, v2-fast)
- Sauvegarde auto meta.json + prompt.txt
**Priorite** : haute (evite les erreurs d'endpoint)

## 3. Assemblage Remotion scriptable
**Probleme** : compositions Remotion codees manuellement par scene. Repetitif.
**Solution** : generateur qui prend manifest + forced alignment + clips et produit la composition TSX.
- Input : scene ID, clip path, narration start/end, mute zones, Seedance audio volume
- Output : fichier TSX pret a render
**Priorite** : moyenne (utile pour scenes 7-10 + futurs projets)

## 4. Checklist pre-generation automatisee
**Probleme** : PREGEN_CHECKLIST.md existe mais verification manuelle.
**Solution** : script Python qui verifie avant chaque appel API :
- Timestamps forced alignment OK
- clip_duration >= ceil(narration_duration)
- Image source existe
- Charsheet present si personnage recurrent
- Prompt ne mentionne pas d'elements absents de l'image
- Solde fal.ai suffisant
**Priorite** : haute (previent les erreurs couteuses)

## 5. Choix endpoint V1/V2 dans le manifest
**Probleme** : confusion V1 Pro vs V2 (pas d'audio sans le savoir).
**Solution** : ajouter dans le manifest par scene :
```json
{
  "endpoint": "v2",
  "endpoint_reason": "audio ambiance necessaire pour combat",
  "audio_strategy": "keep-and-duck-30"
}
```
**Priorite** : haute (decision explicite, pas de surprise)
