# Seedance Prompt Templates — Paper-Craft Sepia

> Templates pre-remplis par type de scene. Remplacer les [PLACEHOLDERS].
> Style : paper-craft sepia. Adapter pour autres styles.
> Consolide 2026-04-20.

---

## Template 1 : i2v simple (1 image, camera au choix)

**Usage** : scene mono-beat, 1 personnage ou groupe, action continue.
**Validee sur** : Scene 1 (prophetie), Scene 2 (humiliation)

```
Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style — flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

[CAMERA MOVEMENT — choisir 1]:
- Camera HOLDS STEADY, fixed position.
- Camera SLOWLY PUSHES IN toward [subject].
- Camera SLOWLY ORBITS [90/180] degrees around [subject].
- Camera TRACKS [subject] from [direction] to [direction].
- Camera PULLS BACK to reveal [wider scene].

SECONDS 0 TO [X]: [Description action, verbes FORTS en MAJUSCULES. Decrire ce qui est VISIBLE dans l'image, pas ce qu'on sait du script.]

SECONDS [X] TO [Y]: [Suite de l'action.]

[Si figurants]: The [N] villagers in the background [REACTION CORPORELLE — pas "eyes widen"].

IMPORTANT:
- [Character description]: dark brown skin, [clothing], [hair], [expression]
- [Contraintes specifiques scene]: "The boy NEVER stands", "The bar does NOT bend", etc.
- No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue.
```

**Params** : image_url, duration "[N]", aspect_ratio "9:16", generate_audio true/false

---

## Template 2 : i2v orbite 180 (1 image, orbite camera)

**Usage** : moment epique, revelation, transformation.
**Validee sur** : Scene 4 (il se leve), test barre de fer (9.5/10)

```
Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style — flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera SLOWLY ORBITS 180 degrees around [subject] during the entire clip, starting from [start angle] and ending [end angle].

SECONDS 0 TO [X]: [Action initiale, effort, preparation.]

SECONDS [X] TO [Y]: [Climax, transformation, mouvement principal.]

SECONDS [Y] TO [Z]: [Aftermath, reactions, pose finale.]

IMPORTANT:
- [Character description]
- [Object constraints]: "[object] is RIGID, SOLID, NON-DEFORMING — length CONSTANT" or "[object] transitions from [state A] to [state B]"
- No unnecessary spins or 360-degree turns
- The human body structure is normal, without motion distortion
- No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue.
```

**Note** : l'orbite masque partiellement les artefacts (retrecissement objets, yeux). Bon combo avec start/end frame.

---

## Template 3 : start/end frame (2 images, transformation)

**Usage** : personnage change d'etat (a genoux -> debout), objet change de forme (barre droite -> pliee).
**Validee sur** : Scene 4 (il se leve), combat paper-craft (R-PC8)

```
Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style — flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

[CAMERA MOVEMENT]

SECONDS 0 TO [X]: [Etat initial — decrire ce qui est dans le START frame.]

SECONDS [X] TO [Y]: [Transition — decrire le changement progressif.]

SECONDS [Y] TO [Z]: [Etat final — decrire ce qui est dans le END frame.]

IMPORTANT:
- [Character description]
- [KEY TRANSFORMATION]: "[subject] transitions from [state A] to [state B]"
- [Object if applicable]: exagerer la taille dans le END frame (Seedance retrecit ~30-40%)
- No unnecessary spins or 360-degree turns
- The human body structure is normal, without motion distortion
- No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue.
```

**Params** : image_url (START), end_image_url (END), duration, aspect_ratio "9:16"
**Gotcha R-RIGID** : l'objet retrecit entre START et END. Exagerer la taille dans le END frame.

---

## Template 4 : storyboard colore multi-shot (N panels, R-PC16)

**Usage** : scene narrative 10-15s avec plusieurs beats distincts.
**Validee sur** : Scene 3 (6 panels, demi-succes — trim 1s, forgeron modifie)

```
Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style — flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

This image is a [N]-PANEL STORYBOARD in a [layout] GRID. Read LEFT to RIGHT, TOP to BOTTOM: PANEL 1 is [position], PANEL 2 is [position], ... PANEL [N] is [position]. Animate them as [N] SEPARATE SCENES with clean CUTS between them. Do NOT animate the panels simultaneously.

SECONDS 0 TO [X]: PANEL 1 — [description action panel 1, verbes FORTS]

SECONDS [X] TO [Y]: PANEL 2 — [description action panel 2]

[... pour chaque panel]

SECONDS [W] TO [Z]: PANEL [N] — [description action dernier panel]

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue.
```

**Gotchas R-PC16** :
- Chaque panel TRES distinct visuellement (cadrage, composition, sujet dominant)
- Positions explicites : "PANEL 1 is TOP-LEFT, PANEL 2 is TOP-CENTER..."
- Premiere ~1s peut montrer la grille avant animation — prevoir trim
- Seedance peut fusionner des panels trop similaires — varier radicalement les cadrages

---

## Template 5 : dialogue lip-sync (1 image, generate_audio: true)

**Usage** : scene avec dialogue parle par un personnage.
**Validee sur** : Scene 2 (insulte Sassouma)

```
Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style — flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

[CAMERA MOVEMENT]

[Angry/Calm/etc.] [character description] speaks: "[DIALOGUE TEXT IN TARGET LANGUAGE]"

SECONDS 0 TO [X]: [Action avant dialogue.]

SECONDS [X] TO [Y]: [Pendant dialogue — decrire gestes, expressions pendant qu'il/elle parle.]

SECONDS [Y] TO [Z]: [Apres dialogue — reactions.]

IMPORTANT:
- [Character descriptions]
- The speaking character's MOUTH MOVES in sync with the dialogue
- [Contraintes]
- No text, no banners, no signs, no writing visible anywhere.
```

**Params** : generate_audio: true
**Post-prod** : mute narration ElevenLabs pendant la zone de dialogue (forced alignment), laisser audio Seedance a 100% pendant le dialogue, narration 100% ailleurs.

---

## Notes par style

### Paper-craft sepia (actif)
- Style anchor : "flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture"
- i2v OBLIGATOIRE (ref-to-video = 0/4)
- Dot-eyes : pas de "eyes widen" (orbites blanches)
- Larmes : pas demander (grosses gouttes comiques)
- Orbite 180 = meilleur mouvement camera (9.5/10)
- Crane up = echec (confond camera et personnage)

### BD flat illustre (archive)
- Style anchor : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors"
- Plus de details faciaux = larmes OK, expressions variees
- ref-to-video fonctionne (storyboard-to-video valide)
- Prompt detaille shot-by-shot obligatoire pour multi-contexte
