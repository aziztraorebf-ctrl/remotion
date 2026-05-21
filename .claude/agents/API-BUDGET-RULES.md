# API Budget Rules — Non-Negotiable (All Agents)

> Fichier partagé. Toujours consulter avant tout appel API payant.
> Applicable à : visual-producer, audio-director, remotion-composer.
> Mis à jour : 2026-05-13

---

## Vérification balance AVANT toute génération (NON-NEGOTIABLE)

Avant le premier appel payant de chaque session, exécuter :
```bash
./scripts/check-api-balance.sh all
```

Si le script retourne exit code 1 (balance critique) → **STOP absolu. Signaler à Aziz. Aucune génération.**

Balance actuelle (2026-05-13) :
- ElevenLabs : 54 425 caractères restants — OK
- PixelLab : $4.94 USD — OK
- fal.ai : vérifier dashboard manuellement

---

## Budget par asset (réinitialisé à chaque beat)

### PixelLab (V3)

| Type | Budget max | Comportement après limite |
|------|-----------|--------------------------|
| Personnage (character) | 2 générations | STOP — présenter les 2 à Aziz, attendre choix |
| Objet (map_object, object) | 2 générations | STOP — présenter les 2 à Aziz, attendre choix |
| Animation | 2 générations | STOP — extraire frames GIF, présenter, attendre |

**Règle d'or PixelLab :**
- Génération 1 : exécuter
- Analyser soi-même (Read tool sur l'output)
- Si acceptable → présenter à Aziz directement sans retry
- Si problème structurel évident → génération 2, puis STOP absolu
- Jamais de génération 3 sans instruction explicite d'Aziz

### Gemini Image

| Type | Budget max | Comportement après limite |
|------|-----------|--------------------------|
| Génération image (nouvelle) | 2 générations | STOP — présenter les 2, attendre choix |
| Retouche chirurgicale (edit) | 2 tentatives | STOP — si 2 retouches ratées, proposer regen ou signaler à Aziz |

**Règle d'or Gemini :**
- Toujours tenter la retouche chirurgicale AVANT la régénération complète
- Chaque retouche chirurgicale compte dans le budget de 2

### ElevenLabs TTS

| Type | Budget max | Comportement après limite |
|------|-----------|--------------------------|
| Narration par beat | 1 appel | STOP absolu — jamais de retry automatique |
| SFX | 1 appel par SFX | STOP — si raté, signaler à Aziz |

**Règle d'or ElevenLabs :**
- Scanner les règles TTS françaises AVANT l'appel (participes e/ee, ont+voyelle, nombres)
- Un seul appel. Si le résultat est insatisfaisant → signaler à Aziz avec le problème exact identifié
- Ne JAMAIS relancer sans correction du script ou approbation d'Aziz

### Musique — Minimax via fal.ai (Souverain uniquement)

| Type | Budget max | Comportement après limite |
|------|-----------|--------------------------|
| Génération musicale | 1 appel → 3 variantes | Présenter les 3 variantes, attendre choix Aziz |

**Règle d'or Musique :**
- Un seul appel fal.ai, 3 variantes dans cet appel (paramètre natif Minimax)
- Pas de second appel avant validation d'Aziz

### Seedance / Kling (clips vidéo)

| Type | Budget max | Comportement après limite |
|------|-----------|--------------------------|
| Clip vidéo (tout type) | 0 appel autonome | Toujours manuel — jamais déclenché par agent seul |

**Règle d'or Clips :**
- Seedance et Kling ne sont JAMAIS appelés de façon autonome
- L'agent prépare le prompt + les refs + le coût estimé → présente → attend "go" explicite d'Aziz
- Même si Aziz a dit "go" pour le beat précédent, chaque clip nécessite un nouveau "go"

---

## Checkpoint obligatoire après chaque appel payant

Quelle que soit la catégorie, après chaque appel API payant :

1. **Analyser soi-même** — Read tool sur l'output (image ou frames vidéo)
2. **Downscale si nécessaire** — `./scripts/downscale-for-review.sh <fichier>` avant analyse
3. **Écrire un verdict en une phrase** — format : "Asset [X] : [qualité] — [problème éventuel]"
4. **STOP et présenter à Aziz** — même si le résultat semble parfait
5. **Attendre validation explicite** avant de passer à l'asset suivant

Ne jamais enchaîner deux appels payants sans checkpoint entre les deux.

---

## Règle anti-cascade (NON-NEGOTIABLE)

Un agent ne peut PAS appeler une API payante si le beat courant a déjà atteint la limite sur cette catégorie.

Exemples concrets :
- Beat 3 a déjà 2 personnages PixelLab générés → le 3ème personnage manquant = STOP, signaler à Aziz
- Beat 5 a déjà 1 appel ElevenLabs → l'audio est raté → STOP, signaler, ne pas relancer
- Beat 2 a déjà 2 images Gemini → il en faudrait une 3ème → STOP, demander autorisation

---

## Format de présentation checkpoint

```
CHECKPOINT API — [Outil] [Type]
Beat : [N]
Génération : [1/2] (budget restant : [N])
Output : [chemin fichier]
Analyse : [verdict en 1 phrase — problème ou OK]
Frame extraite : [chemin si applicable]

→ Attente validation Aziz avant de continuer.
  Options : (1) Valider et passer à la suite  (2) Régénérer (budget restant: N)  (3) Ajuster le prompt
```
