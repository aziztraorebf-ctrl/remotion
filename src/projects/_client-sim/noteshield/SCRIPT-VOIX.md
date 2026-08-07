# Script voix — NorthShield (V3, hook Grok retravaillé + corps V2 fusionné) — VALIDÉ, généré

> Statut : VALIDÉ par Aziz (2026-08-06) — génération TTS lancée directement, pas de repasse
> d'approbation. V1 soumise au jury créatif (Gemini 3.1 Pro + Grok 4.20) : voir
> `SCRIPT-VOIX-V1-BROUILLON.md` + `SCRIPT-VOIX-V1-BROUILLON-jury-saas.md`.
> Verdict convergent : trop "tell" (liste des 4 signaux façon PowerPoint, scores épelés),
> ton correct mais interchangeable. Le contraste Sarah Toronto/Berlin est le point fort
> à préserver et intensifier.
>
> **Fusion V2→V3** : corps V2 (bascule temporelle + rigueur anti-cliché de Gemini) conservé
> tel quel. Hook remplacé par la version Grok fournie par Aziz (dilemme "ralentir tout le
> monde" vs "croiser les doigts", registre calme/las → sharp), MAIS le "Et si...?" final de
> ce hook — le cliché n°1 identifié par Gemini dans le jury — a été retiré à la demande
> d'Aziz. Remplacé par une affirmation directe qui garde le mot "discernement" (trop fort
> pour le perdre) sans la tournure interrogative molle : "La sécurité a enfin le
> discernement." — reste sur le même souffle sharp/intelligent, juste affirmé plutôt
> que suggéré en question.
>
> Gemini a aussi signalé un piège spécifique non vu par Grok : le nom NorthShield + "se
> manifeste" pousse un motion designer distrait vers un bouclier 3D — Director's note gardée
> pour le bloquer explicitement.

## Director's note visuelle (à transmettre au brief storyboard, PAS dit à l'oral)

Zéro hacker, zéro bouclier 3D, zéro cadenas géant, zéro Matrix, zéro pluie de 0/1.
Tout se joue en abstraction géométrique élégante + UI produit réelle (carte de score,
jauge, palette bleu marine/blanc cassé/cyan électrique). Le mot "NorthShield" ne doit
JAMAIS se traduire visuellement par un bouclier littéral.

## Texte taggé (version API, accents complets)

```
[tired] On traite encore toutes les connexions de la même manière.

Soit on ralentit tout le monde avec des contrôles permanents… soit on croise les doigts.

[pause]

[deliberate] La sécurité a enfin le discernement.

[pause]

[serious] NorthShield analyse chaque connexion en temps réel — l'appareil, le lieu, l'historique, le comportement. Quatre signaux vitaux, une décision instantanée.

[pause]

[calm] Sarah se connecte. Même bureau, à Toronto, même ordinateur. [pause] Risque minime. La porte s'ouvre — elle ne s'en rend même pas compte.

[pause]

[tense] Trois heures plus tard — même compte, un appareil inconnu, cette fois depuis Berlin. [pause] NorthShield le voit. Anomalie critique — vérification exigée, immédiatement.

[pause]

[proud] NorthShield. [pause] La sécurité se manifeste quand il le faut — et s'efface le reste du temps.
```

## Version plain-text (forced alignment / sous-titres)

```
On traite encore toutes les connexions de la même manière.

Soit on ralentit tout le monde avec des contrôles permanents, soit on croise les doigts.

La sécurité a enfin le discernement.

NorthShield analyse chaque connexion en temps réel, l'appareil, le lieu, l'historique, le comportement. Quatre signaux vitaux, une décision instantanée.

Sarah se connecte. Même bureau, à Toronto, même ordinateur. Risque minime. La porte s'ouvre, elle ne s'en rend même pas compte.

Trois heures plus tard, même compte, un appareil inconnu, cette fois depuis Berlin. NorthShield le voit. Anomalie critique, vérification exigée, immédiatement.

NorthShield. La sécurité se manifeste quand il le faut, et s'efface le reste du temps.
```

## Scan anti-pièges TTS FR (vérifié avant génération, sur le texte FINAL V3)

- **Participes é/ée fin de groupe** : "inaperçu" est adjectif, pas participe (OK). "exigée" est
  suivi de "immédiatement" dans la même phrase, PAS en fin de groupe rythmique — surveiller à
  l'oreille après génération (limite basse mais acceptée). Aucun autre participe en position
  finale détecté, y compris dans le nouveau hook Grok ("permanents", "doigts", "discernement" —
  aucun n'est un participe passé).
- **"ont + voyelle"** : zéro occurrence.
- **Chiffres** : zéro chiffre arabe ou en lettres dans toute la voix (scores affichés uniquement
  dans l'UI, show-don't-tell).
- **Accents** : complets dans la version taggée.
- **Durée estimée** : ~135 mots (hook Grok plus long que la V2) → ~52-56s au débit normal, dans
  la cible 50-60s.

## Changements majeurs vs V1 (traçabilité)

1. **Coupé "Et si... ?"** (cliché n°1 identifié par Gemini) → remplacé par affirmation directe
   "NorthShield refuse la sécurité aveugle."
2. **Scores retirés de la voix** (show-don't-tell) → la voix commente la nature du risque
   ("risque minime" / "anomalie critique"), l'UI affiche les chiffres exacts (18/100, 82/100).
3. **Ajout bascule temporelle** "Trois heures plus tard" (idée Gemini) — crée une causalité
   claire entre les deux cas Sarah au lieu d'une simple juxtaposition.
4. **Rythme contrasté** : bloc Toronto en registre fluide/calme, bloc Berlin en registre
   sec/saccadé (tense, clipped) — intensifie le contraste déjà identifié comme point fort par
   les deux modèles.
5. **Intimité ajoutée** : "elle ne s'en rend même pas compte" (idée Grok) — montre la friction
   zéro par la texture de la phrase plutôt que par une déclaration ("aucune friction").
6. **Director's note anti-cliché explicite** ajoutée en tête de fichier (garde-fou Gemini :
   risque bouclier 3D lié au nom de marque + au mot "manifeste").

## Notes de génération

- Pipeline utilisé : Harmonie V3 (`obmcfXCePmPgsNsLIWIj`) -> STS GéoAfrique
  (`z3gESu49naEZW8Af2Upm`), via `scripts/generate-narration-expressive.py` (même chaîne que
  Flowdesk).
- 1 seul bloc (846 caractères), largement sous la limite 5000.
- Pas de `[laughs]` / `[clears throat]` (bannis).

## Audio généré (2026-08-06)

- **Durée réelle** : 63.34s (frame 1900 à 30fps) — légèrement au-dessus de la cible 50-60s du
  brief, marge jugée acceptable (cf précédent Flowdesk, dépassement léger toléré).
- **Forced Alignment** : 107 mots, loss=0.071 (bonne confiance) — `audio/narration.alignment.json`.
- **Uploadé (Vercel Blob, vérifié content-length = taille fichier local)** :
  https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/client-sim/noteshield/narration-tk9R2x5sCdkijQuDy156w3Mxw07btE.mp3
- **Fichiers** (`src/projects/_client-sim/noteshield/audio/`) :
  - `narration.mp3` (+ `narration-full.mp3`, identique — sortie concat du script)
  - `narration.alignment.json` (timestamps mot-par-mot, pour storyboard)
  - `script-tts.txt` (texte taggé envoyé à l'API)
  - `script-plain.txt` (texte plain-text utilisé pour le forced alignment/sous-titres)
- Prochaine étape : conception des écrans UI dashboard NorthShield (étape 3 du plan d'action,
  cf `memory/client-sim-tests/noteshield/BRIEF-CLIENT.md`), puis storyboard à partir de ce
  fichier d'alignment.
