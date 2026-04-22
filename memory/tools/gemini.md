# Gemini — Generation & Correction d'Images
> Edition chirurgicale, character sheets, expressions, Nano Banana, cartes geo.
> Mise a jour : 2026-04-14

---

## Piege "enfant drift" en contexte transmission/apprentissage (2026-04-14)

**Observe sur Soundjata Acte VII** : prompt char ref "young griot adulte 25-32" a genere un enfant ~12 ans. Contexte narratif "griots qui transmettent l'epopee" a biaise Gemini vers le tropisme "enfant auditeur emerveille".

**Remedy validee** : forcer l'age adulte **3x** dans le prompt (debut/milieu/fin) + marqueurs anatomiques adultes explicites :
- Debut : "ADULT MAN aged 25-32 years old. NOT a child. NOT a teenager. NOT a boy."
- Corps : "Facial features of an adult male (25-32 years): visible adult jawline, defined cheekbones, adult brow, NOT rounded child cheeks"
- Fin : "CRITICAL: subject is a YOUNG ADULT MAN, not a child. Adult proportions, adult facial structure, adult body."

**Contextes a risque** : toute scene narrative de transmission, apprentissage, conte, famille, ecole. Ecrire juste "adult" ou un age ne suffit PAS — il faut expliciter l'ABSENCE d'enfance ET les marqueurs morphologiques adultes.

---

---

## MODELE UNIQUE — ZERO EXCEPTION (NON-NEGOTIABLE)

**Le SEUL modele Gemini a utiliser dans tout le projet est : `gemini-3.1-flash-image-preview`**

- Generation d'images : `gemini-3.1-flash-image-preview`
- Edition chirurgicale : `gemini-3.1-flash-image-preview`
- Character sheets : `gemini-3.1-flash-image-preview`
- Storyboards : `gemini-3.1-flash-image-preview`
- Toute operation image : `gemini-3.1-flash-image-preview`

**INTERDIT** : `gemini-2.0-flash-exp`, `gemini-2.0-flash`, `gemini-3-pro-image-preview`, `nano-banana-pro-preview`, ou tout autre modele.

**Pourquoi** : les autres modeles sont soit deprecies (2.0-flash-exp = 404), soit trop conservateurs (3-pro refuse de modifier), soit redondants. 3.1-flash-image-preview fait TOUT ce dont on a besoin. Erreur repetee 3+ fois en production — cette regle met fin au probleme.

---

## Principe : correction chirurgicale AVANT regeneration

Ne pas regenerer depuis zero pour un defaut mineur.

---

## Modeles disponibles (avril 2026)

| Modele | Usage |
|--------|-------|
| `gemini-3.1-flash-image-preview` | Generation d'images, character sheets, expressions. Rapide. = "Nano Banana 2" |
| `gemini-3-pro-image-preview` | **Edition chirurgicale OBLIGATOIRE**. Respecte la composition source. |
| `nano-banana-pro-preview` | Plus cher, qualite similaire a 3.1 Flash |
| `imagen-4.0-generate-001` | Generation haute qualite (non teste) |

---

## Capacites prouvees

- Supprimer bande parasite, restaurer couleur, ajouter trait facial, retourner personnage face/dos
- Densifier armee, corriger zone noire, etalonnage couleur, ajout handlers
- Edit pixel-perfect : `Part.from_bytes()` + "keep IDENTICAL except ONE change"
- Changements de perspective (vue sol -> vue aerienne)

---

## Regles modele (corrige 2026-04-13)

- **Edition chirurgicale / modifier un detail** : `gemini-3.1-flash-image-preview` — c'est Flash qu'on utilise pour garder la composition et modifier un detail. Accepte une image source en input + prompt decrivant la modification.
- **Generation pure / haute qualite sans source** : `gemini-3-pro-image-preview` - plus cher, sans source d'origine. Tendance a etre tres conservateur quand une source est fournie (refuse parfois de modifier). Ne pas utiliser pour edition chirurgicale.
- Config : `responseModalities: ["image", "text"]` — NE PAS mettre `responseMimeType`
- Instruction efficace : decrire EXACTEMENT ce qu'on change + lister ce qu'il ne faut PAS toucher
- Validation 2026-04-13 : tentative d'editer panels 4-5 d'un storyboard avec `gemini-3-pro-image-preview` a produit une image quasi-identique a la source (refus de modifier). Passage a `gemini-3.1-flash-image-preview` resout.

---

## Limites

- Pas de seed expose dans l'API publique, pas de style ID
- L'image source elle-meme EST le seed — la conserver = pouvoir regenerer des variantes coherentes
- Postures de personnages minuscules : resultat subtil. Laisser Kling animer via prompt.
- **Storyboard multi-panel : panel blanc aleatoire** — Gemini peut laisser un panel vide (carre blanc) au lieu de generer son contenu, meme si les autres panels sont corrects. Observe 2026-04-18 sur Sonjata scene 3. Correction : regenerer le storyboard complet (l'edition chirurgicale du panel seul echoue — applique R-STORYBOARD-CORR).

---

## Character sheets multi-angle (VALIDE 2026-04-01)

- **Workflow** : fournir 1-2 character sheets existants comme ref de style + prompt nouveau personnage
- **Modele** : `gemini-3.1-flash-image-preview` — genere en ~30-60s
- **Layout** : "4 head views (front, 3/4, profile, back) + 1 full body standing on the right"
- **Resultat** : style coherent avec les refs, personnage distinct. Teste sur Colomb avec refs Abou Bakari + Moussa.

---

## Expressions en pourcentage (VALIDE 2026-04-01)

Specifier un blend d'emotions avec pourcentages — Gemini blend reellement.

**Prompts exemples :**
- "70% determination, 30% hidden anxiety" (depart en expedition)
- "90% ecstatic joy, 10% madness" (decouverte de terre)
- "50% terror, 50% awestruck wonder" (tempete en mer)

**Application** : generer start frames avec l'emotion exacte du beat narratif avant d'envoyer a Seedance.

---

## Methode Nano Banana — Modification chirurgicale d'asset

### Workflow (2 etapes)
1. **Extraction JSON** (`gemini-2.0-flash`, gratuit) : analyser image -> JSON decrivant style, elements, atmosphere
2. **Modification + Regeneration** (`gemini-3-pro-image-preview` OBLIGATOIRE) : modifier 1 champ JSON + renvoyer image originale + JSON modifie

### Regles
- Passer l'image originale EN PLUS du JSON modifie — sans elle, la composition change
- Modifier 1 seul champ a la fois — plus de changements = plus de derive
- Usage : variantes d'assets existants — PAS pour generer from scratch

---

## Cartes geographiques

**Gemini = meilleur pour cartes.** Recraft ne comprend pas la geographie reelle.

**Prompt cle :** `"Bold flat vector graphic map, NO TEXT, NO LABELS, NO ANNOTATIONS"` + style Kurzgesagt.

---

## Images de Reference — Gestion

### Nommage
```
public/assets/geoafrique/characters/[personnage]-[description]-REF.png
```
- Image REF = JAMAIS supprimer. Equivalent fonctionnel du seed.
- Pour nouvelle scene : passer la REF comme `Part.from_bytes()` dans Gemini + decrire la nouvelle pose.
