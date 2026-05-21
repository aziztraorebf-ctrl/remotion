# Protocole Sessions Autonomes — Silicon Savannah
> Validé par Aziz — 2026-05-14
> IMMUABLE : ne pas modifier sans accord explicite d'Aziz
> Template starter prompt réutilisable : `memory/templates/starter-prompt-beat-isolation.md`
> Notifications push : `scripts/ntfy-notify.sh` — topic dans `.env` (NTFY_TOPIC)

---

## CONTRAINTES DE SÉCURITÉ — AFFICHER EN DÉBUT DE TOUTE SESSION DE CODING

**OBLIGATION NON-NÉGOCIABLE : toute session qui code un Beat*.tsx DOIT afficher ce bloc AVANT d'écrire une ligne de code. Si ce bloc est absent, la session est corrompue.**

```
=== CONTRAINTES DE SÉCURITÉ SILICON SAVANNAH ===
R1        : max 8s sans changement visuel (permanent motion ne compte PAS)
+30%      : frames review à t_start + 30% durée segment — JAMAIS à t=0
No-Black  : jamais #000000 — minimum #0d1420 partout
SVG-Gate  : illustration/icône reconnaissable → Gemini image OBLIGATOIRE (pas de SVG)
Font-Gate : loadFont() @remotion/google-fonts obligatoire — fontFamily inline sur tout texte
================================================
```

---

## PRINCIPE FONDAMENTAL

**Isolation Atomique par Beat.**
Une session = un beat = un dossier `beat[X]/`.
Jamais de session multi-beat. Jamais de modification de fichiers hors du dossier `beat[X]/`.

---

## STRUCTURE PAR BEAT (déjà créée)

```
beat[X]/
├── narration.mp3   ← audio découpé, commence à 0s
├── manifest.ts     ← timings relatifs, frame 0 = début du beat
├── bg.png          ← généré en Phase 1 (absent = à générer)
├── storyboard.md   ← transcription du JSON Gemini (absent = Phase 1 non faite)
└── Beat[X].tsx     ← code (absent = Phase 2-3 non faites)
```

**État actuel des dossiers :**
- beat1 : VALIDÉ (Beat1Hook.tsx existant, bg + nairobi + audio + manifest)
- beat2 : VALIDÉ (Beat2.tsx + bg + seg23_antenna + seg23_nokia + audio + manifest — score 9.0/10 — 2026-05-14)
- beat3 : audio + manifest + bg candidat (storyboard absent)
- beat4 : audio + manifest + bg candidat (storyboard absent)
- beat5 : audio + manifest (bg absent, storyboard absent)
- beat6 : audio + manifest + bg candidat (storyboard absent)
- beat7 : audio + manifest (bg absent, storyboard absent)

---

## PIPELINE COMPLET PAR BEAT

### PHASE 0 — Pré-production (FAITE — ne pas refaire)
- Manifest timing par beat ✓
- Audio découpé par beat ✓
- Dossiers beat[X]/ créés ✓

---

### PHASE 1 — Storyboard Gemini (AUTONOME — notification ntfy à la fin)

**Nouveau workflow :** Phase 1 tourne de manière autonome. Claude génère storyboard + JSON, sauvegarde `storyboard.md`, envoie notif ntfy, puis s'arrête.
Aziz valide `storyboard.md` quand il veut → lance `/goal` manuellement → Phase 2-3-4 entièrement autonome.
**Résultat : une seule action Aziz par beat** — le `/goal`.

**Deux appels séparés (validé) :**

**Appel 1 — `gemini-3.1-flash-image-preview`**
Input :
- Script audio textuel du beat (phrases exactes)
- Contraintes : palette Souverain (#0d1420, #FFB800, #f5efe0), R1 max 8s par segment
- Règle background : texture photographique discrète, jamais de forme reconnaissable compétitive
- Références visuelles : frames Or Africain + Niger Uranium (images jointes)
- **Backgrounds validés comme exemples de discrétion** (joindre comme images de référence) :
  - `public/souverain/silicon-savannah/bg-beat1.png` (topographique navy — niveau de discrétion cible)
  - `public/souverain/silicon-savannah/bg-beat4.png` (anthracite minimal — exemple fond froid)
  - `public/souverain/silicon-savannah/bg-beat6.png` (diagonales subtiles)
  - `beat[X]/bg.png` si présent
- Liberté créative autorisée dans ces contraintes

**R1 — Validation obligatoire AVANT génération des images :**
Inclure dans le prompt Gemini :
> "Avant de générer les images, remplis ce tableau.
> Règle R1 : aucun segment > 8s sans changement visuel (nouveau composant, texte, couleur).
> Permanent motion (pulse, glow) ne compte PAS.
> Si un segment dépasse 8s, subdivise-le AVANT de continuer.
>
> | Segment | Début | Fin | Durée | R1 OK ? |
> Seulement quand tous les segments sont R1 OK → générer les images."

Output : tableau R1 rempli + images storyboard (une par segment)

**Appel 2 — `gemini-3.1-pro-preview`**
Input : images du storyboard (Appel 1) + script audio
Output : JSON structuré

```json
{
  "beat": "beat2",
  "duration_s": 14.66,
  "segments": [
    {
      "id": "2.1",
      "frames": "0→210",
      "duration_s": 7,
      "visual": "description exacte",
      "r1_ok": true
    }
  ],
  "assets_to_generate": [
    {
      "type": "background",
      "prompt": "prompt exact pour gemini-3.1-flash-image-preview"
    },
    {
      "type": "icon",
      "prompt": "..."
    }
  ],
  "components_suggested": ["TimelineFracture", "TypeReveal"],
  "tailwind_tokens": ["text-gold", "text-ivory", "bg-navy-deep"]
}
```

**Fin de Phase 1 — Claude fait :**
1. Sauvegarder `beat[X]/storyboard.md` (transcription JSON Gemini)
2. Publier dashboard here.now via script canonique :
   ```bash
   ./scripts/publish-storyboard.sh /tmp/beat[X]_storyboard beat[X] "<script_audio_exact>" [slug] [token]
   ```
   Le script gère : catbox → litterbox → base64, HTML complet (script + grille + R1 + composants), ntfy auto.
3. S'arrêter — attendre que Aziz valide le dashboard puis lance `/goal`

**Aziz fait :** ouvrir `storyboard.md`, regarder les images → si OK, lancer `/goal Beat [X] Silicon Savannah — score ≥ 8.5`

**Le storyboard.md = transcription fidèle du JSON Gemini. Claude ne décide rien.**

---

### PHASE 2-3-4 — Production autonome (/goal)

**Déclencheur :** Aziz lance `/goal Beat [X] Silicon Savannah — score ≥ 8.5`

**PREMIÈRE ACTION OBLIGATOIRE :** afficher le bloc Contraintes de Sécurité (voir section du haut). Session corrompue si skippé.

**Ce que la session autonome fait :**

---

**Phase 2 — Génération assets**

**NOUVEAU STANDARD — Tableau de Décision Binaire (OBLIGATOIRE avant toute génération)**

Avant de générer le moindre asset, produire ce tableau pour CHAQUE asset listé dans le storyboard :

| Asset | Description | Catégorie | Décision |
|-------|-------------|-----------|----------|
| bg.png | texture textile sombre | Forme géométrique/texture | SVG CSS ou Gemini-image |
| seg_X.png | téléphone Nokia | Illustration reconnaissable | **Gemini-image OBLIGATOIRE** |
| seg_X.png | antenne A-frame | Illustration reconnaissable | **Gemini-image OBLIGATOIRE** |
| seg_X.png | cercle pulsant | Forme géométrique pure | SVG React autorisé |

**Règle binaire stricte :**
- **ILLUSTRATION** (téléphone, antenne, personnage, bâtiment, animal, logo, objet du monde réel) → `gemini-3.1-flash-image-preview` **OBLIGATOIRE dès le premier essai**
- **FORME GÉOMÉTRIQUE PURE** (rectangle, cercle, ligne, flèche, grille, tiret) → SVG React autorisé

Seuil : si le SVG nécessite >15 éléments pour être reconnaissable → Gemini image.

**Ne jamais tenter SVG pour une illustration dans l'espoir que "ça passera à la review".**
Post-mortem Beat 2 : 4 renders + 4 appels Gemini perdus sur SVG antenne/Nokia. Coût : ~2h.

**Actions Phase 2 :**
- Lire `beat[X]/storyboard.md` (transcription JSON Gemini)
- Produire le Tableau de Décision Binaire
- Générer background via `gemini-3.1-flash-image-preview` avec le prompt exact du JSON
- Générer les illustrations identifiées dans le tableau (batch si possible — 1 seul appel Gemini)
- Copier tous les assets dans `beat[X]/` ET `public/souverain/silicon-savannah/beat[X]/`

---

**Phase 3 — Code**

**GATE DE PRÉ-VOL — Produire ce bloc JSON AVANT d'écrire une ligne de Beat[X].tsx**

```json
{
  "CHECKLIST_GATE": {
    "assets": {
      "bg_png": "EXISTS — public/souverain/silicon-savannah/beat[X]/bg.png",
      "seg_assets": ["EXISTS — seg_X_antenna.png", "EXISTS — seg_X_nokia.png"],
      "narration_mp3": "EXISTS — public/souverain/silicon-savannah/beat[X]/narration.mp3"
    },
    "fonts": {
      "cinzel_loaded": "import { loadFont } from '@remotion/google-fonts/Cinzel' — PRÉSENT",
      "cinzel_applied": "fontFamily: cinzelFamily inline sur TOUS les éléments texte — VÉRIFIÉ"
    },
    "colors": {
      "zero_pure_black": "grep #000000 → 0 résultats — OK",
      "bg_minimum": "#0d1420 sur AbsoluteFill racine — VÉRIFIÉ"
    },
    "gate_status": "PASS | FAIL"
  }
}
```

**Si gate_status = FAIL → corriger AVANT de coder. Ne pas passer à l'étape suivante.**

**Suite Phase 3 :**
- Lire composants `_shared/` → `touch /tmp/shared-components-read`
- **Avant d'écrire une ligne — vérification R1 :**
  Lister les segments du storyboard avec leurs frames et confirmer que chaque segment
  a un changement explicite dans le code :
  ```
  | Segment | Frames  | Durée | Changement visuel dans le code     |
  |---------|---------|-------|------------------------------------|
  | [X].1   | 0→210   | 7s    | CountdownReveal ring draw          |
  | [X].2   | 210→306 | 3.2s  | contexte pop-in (nouveau élément)  |
  ```
  Si une ligne n'a pas de changement → ajouter l'animation AVANT de continuer.
- Coder `Beat[X].tsx` en respectant le storyboard Gemini exactement
- **Appliquer les micro-animations canoniques** depuis `MICRO-ANIMATIONS-CANONIQUES.md` selon le type de chaque segment — SANS appel Gemini
- Tailwind tokens uniquement — zéro style inline couleurs/typo
- Timings depuis `beat[X]/manifest.ts` uniquement
- `<Audio src={staticFile(AUDIO)} />` — pas d'offset
- Jamais `#000000` — minimum `#0d1420`
- Render → `out/episodes/silicon-savannah/wip/beatX_v1.mp4`

---

**Phase 4 — Review `gemini-3.1-pro-preview`**

**RÈGLE +30% (NON-NÉGOCIABLE) :**
Les frames envoyées à Gemini Pro DOIVENT être extraites à :
```
frame_review = frame_start_segment + (duree_segment_frames × 0.30)
```
Il est **INTERDIT** d'envoyer des frames à t=0 ou t=début de segment.
Raison : springs à t=0 → opacity ~0 → Gemini ne voit pas le segment → faux positifs.

Exemple pour un segment de 210→420 (210 frames) :
- frame_review = 210 + (210 × 0.30) = frame 273 — extraire à 273

**GATE D'AUTO-VALIDATION (BLOQUANT avant appel Gemini) :**
1. Extraire 5 frames selon la règle +30% (432p via `./scripts/downscale-for-review.sh`)
2. Lire chaque frame avec Read tool
3. Répondre à cette grille pour soi-même :

```
| Check | Résultat |
|-------|----------|
| Palette #0d1420/#FFB800/#f5efe0 respectée ? | OUI/NON |
| Tous les textes lisibles (Cinzel chargé) ? | OUI/NON |
| Chaque segment a son asset correct ? | OUI/NON |
| Proportions fidèles au storyboard ? | OUI/NON |
| Zéro #000000 visible ? | OUI/NON |
| R1 respecté (pas de segment >8s statique) ? | OUI/NON |
| Auto-score estimé : X/10 | ≥8.5 ? |
```

**Si auto-score < 8.5 → INTERDICTION d'appeler Gemini Pro. Corriger d'abord.**
Appliquer les corrections, re-render, re-valider. Seulement quand auto-score ≥ 8.5 → appel Gemini.

**Appel Gemini Pro (1 seul) :**
Input :
- 5 frames à moments +30% (432p)
- Storyboard original `beat[X]/storyboard.md`
- Image storyboard du segment le plus complexe (référence visuelle)

Output JSON attendu :
```json
{
  "score": 7.2,
  "verdict": "NEEDS_WORK",
  "r1_violations": [
    { "segment": "[X].2", "static_duration_s": 10.5, "fix": "subdiviser en [X].2a et [X].2b" }
  ],
  "delta": [
    { "segment": "[X].1", "issue": "texte trop petit", "fix": "fontSize 64→96" }
  ],
  "strengths": ["ring animation fluide", "palette respectée"]
}
```

**Règle R1 dans le score :** si `r1_violations` non vide → score automatiquement < 8.5 → itérer.

Si NEEDS_WORK : Claude applique les fixes, re-render, re-valide (gate +30% + auto-score) → 1 seul appel Gemini supplémentaire max.

**Condition de sortie :** score ≥ 8.5 ET `r1_violations` vide → STOP →
1. Promouvoir `wip/beat[X]_vN.mp4` → `out/episodes/silicon-savannah/beat[X]-FINAL.mp4`
2. Upload litterbox (72h) :
   ```bash
   VIDEO="out/episodes/silicon-savannah/beat[X]-FINAL.mp4"
   URL=$(curl -s -F "reqtype=fileupload" -F "time=72h" -F "fileToUpload=@${VIDEO}" "https://litterbox.catbox.moe/resources/internals/api.php")
   ```
3. Notif ntfy avec lien cliquable :
   ```bash
   ./scripts/ntfy-notify.sh beat_done beat[X] "${URL}" "Score X/10 APPROVED"
   ```
4. Purger `wip/` et `versions/` pour ce beat

**Borne de sécurité :** max 3 itérations. Si score < 8.5 après 3 essais → STOP →
```bash
./scripts/ntfy-notify.sh blocked beat[X] "" "Score <8.5 apres 3 iterations. Derniere version: out/episodes/silicon-savannah/wip/beat[X]_v3.mp4"
```

---

### PHASE 5 — Validation Aziz

Aziz revient, regarde le render final, valide ou oriente.
Si validé → `beat[X]-FINAL.mp4` promu.

---

## RÈGLES DE LA SESSION AUTONOME (NON-NEGOTIABLE)

1. **Scope unique** : toucher uniquement `beat[X]/` et `Beat[X].tsx`
2. **Zéro entropie** : 3 bugs bloquants non résolus = STOP + `./scripts/ntfy-notify.sh blocked beat[X] "[description]"`
3. **Storyboard = loi** : le JSON Gemini est le contrat. Claude ne l'interprète pas, il l'exécute.
4. **Modèles corrects** : `gemini-3.1-flash-image-preview` (images), `gemini-3.1-pro-preview` (review)
5. **R1 obligatoire** : max 8s sans changement visible — permanent motion ne compte pas
6. **Jamais noir pur** : background minimum #0d1420, jamais #000000
7. **SVG-Gate** : illustration reconnaissable → Gemini image dès le premier essai, sans exception
8. **+30% rule** : frames review jamais à t=0 — toujours à frame_start + 30% durée
9. **Auto-score gate** : auto-score < 8.5 → corriger avant appel Gemini Pro

---

## ORDRE DES SESSIONS (recommandé — flexible)

Chaque beat dans sa propre session Claude, dans n'importe quel ordre :
- Session Beat 2 → VALIDÉ (score 9.0/10 — 2026-05-14) ✓
- Session Beat 3 → Phase 1 → /goal
- Session Beat 4 → Phase 1 → /goal
- Session Beat 5 → Phase 1 → /goal
- Session Beat 6 → Phase 1 → /goal
- Session Beat 7 → Phase 1 → /goal

Sessions parallèles possibles (beats indépendants, zéro conflit fichiers).
