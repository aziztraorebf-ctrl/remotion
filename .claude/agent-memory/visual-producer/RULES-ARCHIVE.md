# RULES-ARCHIVE — Regles zombies / historiques / contextuelles visual-producer

> Garde les regles qui ne sont plus invoquees regulierement mais restent potentiellement utiles.
> Promotion vers RULES-ACTIVE.md si invoquee >=3 fois sur 2 projets consecutifs.

---

## R-SEEDANCE-REFS-MULTIPLES (semi-dormante — concept integre dans R-CANONICAL-REF)

Seedance 2.0 reference-to-video accepte jusqu'a 9 images + audio/video jusqu'a 12 total.
Pour storyboard-to-video, empiler : storyboard + char refs canons + environment plate.

**Identity drift >> style drift** : Seedance sait reconcilier styles, mais ne sait pas inventer un visage canonique.
Anti-pattern banni : "1 seule ref par defaut, ajouter char refs seulement si drift observe".

Valide : `memory/tools/seedance-rules.md` regle 12.

---

## R-STORYBOARD-DENSITE (contextuelle — table active dans MEMORY.md)

Table de densite optimale panels storyboard :

| Type scene | Panels | Ratio s/plan |
|---|---|---|
| Narratif contemplatif multi-beats | 4-5 | 2.4-3.0 |
| Narratif equilibre multi-beats | 5-6 | 2.0-2.5 |
| Action dense / combat | 7-9 | 1.3-1.7 |
| Contemplatif mono-beat continu | 8-9 | 1.3-1.5 |

Par defaut Shorts Heros Oublies Actes narratifs : **tester 5 panels en premier, pas 9**.

Question avant de fixer : "Cette scene demande au viewer d'absorber chaque beat (moins panels) ou de ressentir un flow continu (plus panels) ?"

L'ancienne regle "9 panels par defaut" = **OBSOLETE**. Ne plus appliquer automatiquement.

---

## R-GEMINI-DRIFT-ENFANT (F7, contextuelle — declenchee par contextes narratifs specifiques)

Quand contexte narratif contient tropisme "enfant" (transmission, apprentissage, conte, ecole, famille), prompt Gemini doit forcer age adulte 3x (debut/milieu/fin) + marqueurs anatomiques :

- Debut : "ADULT MAN aged 25-32 years old. NOT a child. NOT a teenager. NOT a boy."
- Milieu : "Facial features of an adult male (25-32 years): visible adult jawline, defined cheekbones, adult brow, NOT rounded child cheeks"
- Fin : "CRITICAL: subject is a YOUNG ADULT MAN, not a child. Adult proportions, adult facial structure, adult body."

Declencheurs : griots, transmission, apprentissage, mentor-eleve, conte.

Valide sur Acte VII Soundjata `young.png` (2026-04-14).

---

## R-ANIMAUX-LATERAL-STRICT

Direction animaux Seedance :

| Direction | Resultat | Verdict |
|---|---|---|
| Frontal vers camera | Chevaux figes, gelatineux, slow-mo | INTERDIT |
| 3/4 frontal | Mieux mais risque | A EVITER |
| **Profil lateral + pan camera** | Galop fluide lisible | RECOMMANDE |
| Profil lateral SANS pan | Slow-mo contemplatif | A EVITER |

Cle : **pan camera lateral qui suit les sujets** = facteur anti-slow-mo, pas l'angle.

Source : Kimi K2.5 review Acte IV Soundjata (2026-04-16).

---

## R-OBJET-PORTE-MECANIQUE

Pour TOUT objet porte dans storyboard Gemini, decrire la MECANIQUE complete :
- Ce que la main tient (cordelette ? baton ? tissu ?)
- Comment l'objet pend (contre le dos ? en travers ?)
- Quel bras est mobilise, quel bras est libre

**Patterns valides** :
- Ballot sur baton : "carries a small bundle tied to a SHORT STICK resting on his RIGHT SHOULDER, stick held in right hand, left arm swings free"
- Ballot sur cordelette : "holds a cord in RIGHT HAND at hip level, bundle HANGS DOWN against his lower back"
- Ballot tenu devant : "carries bundle CLUTCHED to his chest with both arms"

**Pattern INTERDIT** : "baluchon sur l'epaule" / "bundle on shoulder" (declenche hallucination anatomique).

---

## R-START-END-SEQUENTIAL

Generation start/end frames Seedance : generer END en premier (plus contraint narrativement).
Si END valide, l'utiliser LUI-MEME comme ref pour START.

Prompt START : "The [character] must be IDENTICAL to the reference image — same face, same age, same dress, same jewelry."

Figurants arriere-plan : clause diversite explicite "ALL different ages, body types, poses, colors".

Paralleliser = drift systematique. Jamais.

---

## R-AGE-NARRATIF-COHERENT

Avant de valider les refs personnage d'un Visual Plan, verifier coherence narrative avec Acte precedent :
"Qui est le personnage A LA FIN de l'Acte N-1 ? C'est CE personnage qui apparait AU DEBUT de l'Acte N."

Exemple : Soundjata Acte III = enfant → Acte IV commence enfant, pas adulte.
Si Acte montre vieillissement/changement entre panels : documenter explicitement quelle ref couvre quel panel.

---

## R-I2V-VS-STARTEND (paper-craft action dynamique)

- **i2v classique** (1 seule image source) + verbes explosifs → action dynamique (fleche qui part, corps qui recule).
- **Start/end frame** → UNIQUEMENT transitions de perspective camera. Action dynamique = quasi-statique.

Teste scene 7C Sonjata (arc bande → relache) : start/end frame = fleche ne part pas. i2v classique = tir dynamique.

---

## R-V2-VS-V1PRO-PAPERCRAFT

Seedance V2 > V1 Pro pour paper-craft dot-eyes.

V1 Pro degrade les dot-eyes en yeux realistes (iris/pupilles visibles) apres 3s rapprochees.
V2 + clause "MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris" = dot-eyes maintenus sur toutes les frames.

**V2 = endpoint par defaut pour paper-craft.**

---

## R-DOT-EYES-NO-EYE-REACTIONS

NE PAS ecrire "eyes WIDEN" pour personnages paper-craft. Seedance transforme dot-eyes en grands yeux blancs.

Utiliser reactions corporelles a la place :
- `STEP BACK`
- `hands to mouth`
- `CLUTCHES staff`
- `RECOILS`
- `STIFFENS`

---

## R-VETEMENTS-EPOQUE

Gemini genere vetements modernes par defaut si pas specifie.

Toujours specifier :
- Soundjata XIIIe : "13th century West African Mande warriors, cotton tunics, leather armor with geometric patterns, cowrie shell decorations, turbans, leather war caps, gris-gris amulets, wooden spears with iron tips"
- Thiaroye 1944 : uniformes militaires francais coloniaux
- News contemporaine : vetements modernes

Attention aux defaults Vikings que Gemini genere sur "medieval West African warrior".

---

## R-STORYBOARD-REGEN-COMPLET

Pour corriger un storyboard multi-panels, TOUJOURS regenerer le storyboard COMPLET avec prompt corrige.

Edition chirurgicale Gemini ne sait pas cibler UN seul panel dans un storyboard multi-panels.

Storyboard sauvegarder avec `.refs.txt` listant les refs canoniques utilisees en input (Gate 13 le verifie).

---

## REGLES MORTES / RETIREES

### (DEPRECATED 2026-04-16) R-STORYBOARD-9-PANELS-DEFAUT
Ancienne regle "9 panels 3x3 par defaut pour TOUT storyboard-to-video". Remplacee par table de densite contextuelle (voir R-STORYBOARD-DENSITE).

### (DEPRECATED 2026-04-16) R-SEEDANCE-MINIMALISTE-200-MOTS
Ancienne regle "prompt minimaliste ~200 mots" systematique. Remplacee par R-PROMPT-DETAILLE-MULTI-CONTEXTE (active) : detaille shot-by-shot pour multi-contexte, minimaliste pour mono-beat.

### (RETIRED) META-RULE Corrections chirurgicales / Anti-hallucination / Nettoyage pensees internes
Ces 3 meta-rules du 2026-04-16 sont des regles de RIGUEUR DE TRAVAIL, pas des regles visual-producer specifiques. Integrees implicitement dans la discipline de livraison. Ne pas les re-lister comme regles actives.

### (INTEGRATED) R-PROMPT-LIBERAL v2
Concept "Seedance = collaborateur creatif" integre dans R-PROMPT-DETAILLE-MULTI-CONTEXTE (active) et R-SONJATA-CHOREGRAPHIQUE (active). Ne plus invoquer comme regle autonome.

### (INTEGRATED) Seedance extrait mots du prompt pour lip-sync
Capacite interessante mais pas une regle operationnelle. Voir `memory/tools/seedance-storyboard-technique.md` regle 21 pour reference.
