# Vercel Blob — store suspended persistant apres cleanup

## Probleme observe (2026-05-02)

Apres avoir supprime 157 fichiers via l'API Vercel Blob (`POST /delete`) et libere 693.6 MB sur 720.9 MB, ramenant le store a 27.3 MB :
- Listing API confirme l'etat : 19 fichiers / 27.3 MB
- Token et permissions OK (lecture fonctionne)
- Tentative d'upload retourne `403 Forbidden, error.code = store_suspended`

## Analyse

**Why** : le flag `store_suspended` est applique au niveau du store par Vercel quand le quota a ete depasse. La suppression des fichiers via API libere l'espace mais **ne lift pas automatiquement le flag**. C'est une mesure de protection cote Vercel.

## How to apply (resolution)

1. **Premiere tentative** : attendre 5-15 minutes (latence Vercel pour reevaluer le quota)
2. **Si toujours suspended** : aller sur dashboard Vercel → Storage → Blob → cliquer "Resume" ou "Reactivate" (action manuelle)
3. **Si pas d'option dashboard** : contacter support Vercel ou upgrader Hobby → Pro
4. **Alternative immediate** : envoyer les contenus via base64 dans le prompt API (Kimi accepte les images), pas besoin d'URL publique

## Anti-pattern

**NE PAS** essayer de re-uploader en boucle ou via differents endpoints — ca ne changera rien tant que le flag est actif. Pivoter vers une alternative (option B base64) plutot que d'insister.

## Decision pour les sessions futures

- Avant un upload critique, tester d'abord avec un petit fichier 1KB
- Documenter dans le project quand le store est `suspended` pour savoir si c'est un blocage actif
- Pour les briefs Kimi avec assets visuels : preferer base64 dans le prompt (option B) qui ne depend pas du store. C'est aussi ce que Kimi fait en interne (extraction de frames).

Référencé par nom depuis `archive/episodes-livres/shaka-zulu/SESSION-2026-05-02-VAGUE-2-LESSONS.md` et
`RUNBOOK-VAGUE-2-PHASE-3.md`, qui pointaient vers ce fichier sans qu'il existe côté repo — comblé par
cette migration.

---
Migré depuis auto-memory (`feedback_vercel-blob-suspended-after-cleanup.md`) le 2026-08-31, contenu
original inchangé.
