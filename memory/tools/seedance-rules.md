# Seedance 2.0 — Regles de Prompt
> 25 regles + anti-patterns. Consulter AVANT d'ecrire un prompt Seedance.
> Mise a jour : 2026-04-02

---

## Regles de style et structure

1. **Style obligatoire** : "2D vivid flat illustration style" en debut de prompt
2. **COLOR GRADE obligatoire** : section en fin de prompt pour ancrer la palette
3. **"gradually"** : utiliser dans tout segment reveal (flotte, armee, decor)
4. **"Single continuous take, no cuts"** : pour plan-sequence
5. **Anti-texte OBLIGATOIRE** : "No text, no banners, no signs, no writing visible anywhere" — Seedance invente des bannieres spontanement (ex: "WELCOME TO JANJANBURO")

---

## Regles audio et narration

6. **Audio narration = toujours remplacer** : Seedance re-synthetise les mots uploades. Strip audio + ElevenLabs overlay.
19. **Lip sync = 3 pistes Audio Remotion** : Seedance re-synthetise -> timings decales. Toujours pistes separees calees sur moments visuels (silencedetect)
20. **"Cut to" = mot censure** : remplacer par "Camera shifts to frame". Eviter "cut"
25. **Audio-Guided Dialogue (VALIDE 2026-04-03)** : dialogues dans prompt -> lip sync natif. Teste en francais avec 2 personnages, zero ref. Lip sync parfait + mise en scene exacte. 2 formats (section separee ou inline timecode). Voir `tools/seedance-prompts.md` pour details et workflow ElevenLabs overlay.

---

## Regles de reference images

7. **Eye patch Amanirenas** : toujours mentionner "black eye patch over left eye"
8. **Ref images** : character sheet multi-vues = meilleure ref. 1 ref suffit pour plan-sequence/POV
12. **1 ref RECOMMANDE si personnages similaires** : 2 refs trop proches = fusion. Decrire soldats par texte ("silhouettes WITHOUT cape"). Note : Seedance accepte jusqu'a 9 images par requete — notre limite a 1-2 est un choix pratique, pas technique.
15. **Refs SCENE = slideshow** : refs doivent ancrer l'IDENTITE (personnage, style), pas la COMPOSITION. 1 ref scene max
16. **1 ref + 1 ambiance par clip** : changement de lieu = splitter en clips separes

---

## Regles de mouvement et dynamisme

9. **Duree segments** : 2-3s par segment pour 10s, 3-4s pour 15s. Ne pas surcharger
10. **Verbes d'action** : "PRESSES", "RISES", "STRIKES" — jamais "subtle", "gentle", "slow" sauf intention explicite
11. **Seedance = ultra-litteral** : "uphill" = pente 45deg, "raises sword" sans "lowers" = epee levee tout le clip
18. **Verbes dynamiques dans TOUS les formats** : "slowly/gently" = animation au ralenti. Utiliser "crashes", "surges", "pushes"
22. **Specifier chaque axe/direction** : "forward" = ambigu. Dire "down to his side", "toward the ground"

---

## Regles de personnages

13. **Differencier leader vs soldats** : "leader with [detail]" + "soldiers WITHOUT [detail]" — sinon clones
14. **Objets parent-enfant** : "degainer" != "fourreau vide" pour Seedance. Ecrire "curved sword in hand, no scabbard visible"
23. **Props main gauche/droite (A TESTER)** : "Right hand ALWAYS holds [objet], NEVER released, NEVER disappears. Left hand EXCLUSIVELY for [action]." Source : JSFILMZ tutorial.

---

## Regles de format

17. **Narratif > SECONDS pour paysages** : SECONDS surdecoupe les scenes sans personnage. Utiliser Format 1 ou 4.
24. **Direction du mouvement dans images source (A TESTER)** : designer la composition de l'image source pour indiquer le sens du mouvement. Source : Mira AI / Higgsfield.

---

## Regles de workflow

21. **Sensibilite contenu variable** : refus aleatoire — relancer tel quel avant de modifier

---

## Regles de transition (Format 6)

26. **Rotation personnage = decrire le mouvement physique** : "slowly turns his back to the camera" — sans precision, Seedance fait un morphing snap au lieu d'une rotation naturelle. TOUJOURS decrire comment le personnage change d'orientation. Confirme sur test Abou Bakari 3 epoques (2026-04-04).
27. **Extensions video (V2V) = verbes dynamiques obligatoires** : "SURGES forward", "CRASHES against", "STRAIN under wind" — sans ca, les extensions sont statiques. Aussi : 15s > 10s, et 1 seul changement majeur (camera OU atmosphere, pas les deux). Mieux pour continuer une ambiance que pour raconter une nouvelle scene — utiliser Format 6 pour ca.

---

## Anti-instructions (dire ce qu'on ne veut PAS)

- **"no unnecessary 360-degree turns"** : empeche Seedance d'ajouter des rotations parasites
- **"without motion distortion"** : force des mouvements physiquement corrects
- **"without abrupt changes"** : transitions douces obligatoires
- **"no unnecessary spins"** : idem rotations
- **"the human body structure is normal"** : empeche les distorsions anatomiques
- Source : @liyue_ai — les anti-instructions ont contribue a la proprete exceptionnelle des 4 transitions de saison

---

## Regles de dynamisme (extraites de @drjoetw)

- **Verbes explosifs = animation rapide** : "BURSTS", "LAUNCHES", "SLICING", "SNAP" — densifier les verbes d'action pour scenes rapides
- **MAJUSCULES = intensite** : "SNAP ZOOMS", "BOOM", "EXTREME" — Seedance interprete comme pics d'energie
- **Sound cues = rythme visuel** : "Sound: knock... knock...", "silence", "BOOM" — indications sonores dans le prompt influencent le tempo
- **Descriptions d'impact** : "fabric compressing inward", "shockwave ripple" — descriptions physiques detaillees = meilleurs VFX
