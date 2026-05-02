# Visual-Producer Session Logs — Archive (pre-2026-04-20)

> Archive des session logs pre-session Sonjata (2026-04-20+). Garde comme historique, pas charge en session active.
> Les regles operationnelles qui en decoulent sont consolidees dans `MEMORY.md` et `RULES-ACTIVE.md`.

---

## 2026-04-13 (initial)

Agent cree. Motion reference transfer teste (hors agent) sur Soundjata vs Soumaoro : validation de la technique.

---

## 2026-04-13 PM (storyboard-to-video integration)

Technique Seedance Storyboard-to-Video validee en production sur Soundjata Acte V (22s final).
6 faiblesses identifiees + remedies documentes. Voir `memory/tools/seedance-storyboard-technique.md` (12 regles).
A utiliser comme technique primaire pour toute sequence narrative multi-shots < 15s.
Pour chaque personnage recurrent dans un projet storyboard-to-video, prevoir generer une char ref "context" (fond scene suggere) en plus de la char ref neutral-bg.

---

## 2026-04-14 PM (Soundjata Acte VII storyboard regen)

**Lecon storyboard 9 panels 3x3 par defaut (OBSOLETE depuis 2026-04-16)** : initialement regle "9 panels 3x3 par defaut pour TOUT storyboard-to-video". Contredit par retour Aziz sur Acte I v2 : narratif contemplatif multi-beats = 4-5 panels, pas 9. Regle corrigee dans MEMORY.md (table de densite).

**Gemini glisse vers "enfant" sur contexte de transmission** : prompt `young.png` Acte VII Soundjata specifiait "age around 12" dans un contexte de griots/transmission — Gemini a genere un enfant ~10 ans. Remedy : insister LOURDEMENT au debut, milieu ET fin du prompt sur l'age adulte + marqueurs anatomiques adultes (machoire, pommettes, proportions). Regle conservee active (F7).

**Doc-First sur les assets canoniques personnage** : j'ai genere `soundjata-adult-warrior-ref.png` from scratch alors qu'un ref canonique existait (`soundjata-combat-ref.png` de l'Acte V). Drift visuel majeur. Regle conservee active.

---

## 2026-04-16 (storyboard Acte IV Clip 1 — 3 iterations)

3 erreurs identifiees sur v1/v2, corrigees dans v3 grace a review Aziz + consultation Kimi K2.5.
3 lecons ajoutees :
- age narratif personnage (apres Acte III enfant = Acte IV commence enfant, pas adulte)
- frontal animaux INTERDIT (chevaux figes/gelatineux) → profil lateral strict + pan camera
- anatomie objet porte (baluchon sur epaule ambigu) → decrire MECANIQUE complete (quel bras, comment l'objet pend)

Storyboard v3 valide par Aziz — direction Kimi DA retenue.
Visual Plan produit en 2 iterations : v1 proposait duration=15s (palier fixe) alors que 14s suffit (deficit 0.32s absorbable Remotion). Prompt corrige avec verbes d'action forts (anti-statique).

**Erreur residuelle detectee par Claude principal** : le prompt V5 mentionnait "9 shots" et "Follow storyboard for all 9 shots" alors que le storyboard v3 = 4 panels. Residu de l'ancienne regle "9 panels par defaut" appliquee sans re-verifier le storyboard actuel.
Lecon : quand le storyboard dit N panels, le prompt DOIT dire N shots. Verifier visuellement.

---

## 2026-04-16 SOIR (Acte IV Clip 1 — prompt detaille shot-by-shot)

**Erreur production** : 2 tentatives avec prompt minimaliste (~200 mots, 1200-1800 chars) = clips inutilisables (style 3D-ish, identity drift, morphing, couronne hallucinee). 3e tentative avec prompt detaille shot-by-shot (3656 chars) = clip valide du premier coup.

**Regle** : scene multi-contexte = prompt detaille shot-by-shot, <4000 chars. Scene simple mono-beat = prompt minimaliste ~200 mots.

**Self-review severe, jamais complaisante** : Claude avait valide un clip en disant "tunique blanche ✓, sash rouge ✓" mais le visage de Soundjata ne correspondait pas a la ref canon. Regle : verifier visage + style + details canon side-by-side avec ref. Preferer etre trop severe.

**Verbes d'action dynamiques confirme anti-statique** : malgre problemes d'identite, elements dynamiques (STRIDES, KICKS, SLASHES, camera tracking low angle) fonctionnent bien. A utiliser systematiquement sauf scene explicitement contemplative.

---

## 2026-04-16 PM (Meta-rules multiples)

**Corrections CHIRURGICALES, jamais reecriture** : sur demande "corrige X, garde le reste", ne JAMAIS reecrire tout le prompt from scratch. Editer uniquement les X points listes.

**Anti-hallucination : NE JAMAIS inventer de contenu factuel** : narration, chemin de fichier, endpoint API, caracteristique personnage = TOUS verifies AVANT d'etre ecrits. Citer textuellement depuis brief OU verifier sur disque.

**Nettoyer les pensees internes AVANT livraison** : scanner "Wait...", "Actually...", "Revise:", brouillons non termines AVANT de presenter.

**Seedance = collaborateur creatif, pas executant** : prompt minimaliste + refs canons + storyboard → Seedance devie mais le resultat est souvent MEILLEUR que le storyboard litteral. Corollaire : quand 1er essai insatisfaisant, essayer approche OPPOSEE (refs + prompt court narratif) avant d'escalader vers prompt dirigiste.

**Seedance extrait les mots du prompt pour lip-sync** : le mot "Soumaoro" repete 3 fois dans prompt = vocalise dans audio Seedance. Compatible keep-and-duck 30%, bonus texture.

**Coherence start/end frames** : generer le END en premier, l'utiliser comme ref pour le START. Paralleliser = drift systematique (age, vetements, fond).

---

## Regles et lecons CONSOLIDEES dans `RULES-ACTIVE.md` et `MEMORY.md`

Les regles operationnelles issues de ces sessions ont ete synthetisees. Ce fichier archive ne sert qu'a la tracabilite historique et au rappel contextuel si un incident similaire se reproduit.
