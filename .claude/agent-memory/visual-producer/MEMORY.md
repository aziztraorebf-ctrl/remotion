# visual-producer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-22 (Sonjata sessions 7-8 : scenes 8-10 + hook visuel + Short VALIDE)

---

## MANDATORY : REVIEW-BEFORE-SPEND (2026-04-17)

**Le visual-producer ne lance JAMAIS Seedance directement.** Il prepare tout, uploade sur Vercel pour review, et attend le GO.

### Workflow obligatoire :
1. Generer le storyboard (avec refs canoniques en input — JAMAIS from scratch)
2. Selectionner/generer les refs
3. Ecrire le prompt
4. Passer les gates
5. **STOP** — uploader une gallery Vercel avec :
   - Le storyboard genere
   - Toutes les refs utilisees
   - Le prompt complet
   - Le resultat des gates
6. Retourner le lien gallery a Claude orchestrateur
7. Claude examine + envoie a Aziz
8. **Attendre le GO** avant de lancer Seedance

### Pourquoi :
Session 2026-04-17 : le visual-producer a genere un storyboard from scratch (sans refs canoniques), Seedance a copie le style du storyboard au lieu des refs canon, le clip avait un style completement different de la serie. $2.74 perdus.

### Regle storyboard (NON-NEGOTIABLE) :
- Tout storyboard DOIT etre genere avec les refs canoniques en input Gemini (edition chirurgicale)
- JAMAIS generer un storyboard from scratch (generation pure sans image source)
- Le storyboard doit etre en N&B sketch UNIQUEMENT — si Gemini genere en couleur, re-generer avec instruction explicite "black and white pencil sketch ONLY, no color, no shading"
- Comparer visuellement le storyboard aux refs canoniques AVANT de continuer
- Sauvegarder un fichier `.refs.txt` a cote du storyboard listant les refs canoniques utilisees en input (Gate 13 le verifie)
- Ajouter dans le prompt Seedance : "COMPOSITION GUIDE ONLY. Do NOT interpret, deviate from, or add to the storyboard layout."

### Regle age personnage (NON-NEGOTIABLE — 2026-04-17) :
- TOUJOURS verifier `character_ages_by_acte` dans le manifest AVANT de selectionner une ref
- Acte II et III = MEME personnage, MEME age (~7-8 ans). Utiliser une frame de `acte3-iron-bar-v1.mp4` comme ref enfant pour l'Acte II.
- NE PAS utiliser `soundjata-baby-ref.png` pour l'Acte II (c'est un toddler 2-3 ans, trop jeune)
- Gate 12 (character_age_continuity) verifie automatiquement — si FAIL, corriger la ref AVANT de continuer
- En cas de doute sur l'age : regarder les clips ADJACENTS deja valides et utiliser le meme personnage

---

## MANDATORY PRE-API GATE CHECK (2026-04-17)

**BEFORE any Seedance or Gemini API call, run the pipeline gates via Bash.**

### Before Seedance call:
```bash
python3 -c "
import json, sys; sys.path.insert(0, 'scripts')
from pipeline_gates import pre_seedance_check
config = {
    'prompt': '''<YOUR_PROMPT>''',
    'image_refs': [<YOUR_REFS>],
    'clip_duration': <DURATION>,
    'narration_duration': <NARR_DUR>,
    'character_name': '<NAME>',
    'has_environment': True,
    'estimated_cost': <COST>,
}
ok, results = pre_seedance_check(config)
for r in results: print(r)
print('VERDICT:', 'PASS' if ok else 'BLOCKED')
"
```

### Before Gemini call (multi-character):
```bash
python3 -c "
import sys; sys.path.insert(0, 'scripts')
from pipeline_gates import pre_gemini_check
config = {
    'character_name': '<NAME>',
    'input_refs': [<YOUR_REFS>],
    'prompt': '''<YOUR_PROMPT>''',
    'num_characters': <N>,
    'has_environment': True,
}
ok, results = pre_gemini_check(config)
for r in results: print(r)
print('VERDICT:', 'PASS' if ok else 'BLOCKED')
"
```

**If any gate returns BLOCKED: DO NOT call the API. Fix the issue first.**
**10 gates total: prompt structure, canonical ref, duration match, reverse bias, seedance inputs, character context, chain continuity, fal.ai balance, TTS scan, face diversity.**

---

## CRITICAL RULE 2026-04-16 SOIR — Prompt Seedance : DETAILLE shot-by-shot, <4000 chars

**Erreur production Soundjata Acte IV Clip 1** : 2 tentatives avec prompt minimaliste (~200 mots, 1200-1800 chars) ont produit des clips inutilisables (style 3D-ish, identity drift, morphing, couronne hallucinee). La 3e tentative avec prompt detaille shot-by-shot (3656 chars) a donne un clip valide du premier coup.

**Analyse comparative des prompts qui marchent vs ceux qui echouent** :

| Clip | Score | Chars prompt | Style |
|---|---|---|---|
| Acte V Segment A v2 | 9.5/10 | 4633 | Detaille shot-by-shot |
| Acte VII griots | APPROVE | 2975 | Semi-detaille |
| Acte I v2 | Valide | 1864 | Semi-detaille (scene simple) |
| **Acte IV v1 (REJETE)** | **Inutilisable** | **~1200** | **Minimaliste** |
| **Acte IV v2 (REJETE)** | **Inutilisable** | **~1800** | **Minimaliste + fidelite** |
| **Acte IV v3 (VALIDE)** | **Valide** | **3656** | **Detaille shot-by-shot** |

**Regle non-negociable** :

1. **Prompt detaille shot-by-shot pour TOUTE scene multi-contexte** (plusieurs lieux, personnages differents entre shots, transitions narratives) :
   - Un paragraphe par shot : action precise, mouvement camera, eclairage, position des personnages, expression
   - Verbes d'action FORTS (STRIDES, KICKS, SLASHES, CUTS, CHARGES, THUNDER, ERUPTS, SWEEPS, DROPS)
   - Camera toujours en mouvement ("camera TRACKS, SWEEPS, pushes — always in motion")

2. **Limite STRICTE : <4000 caracteres** — Dreamina web impose cette limite. Meme via API fal.ai (qui ne l'impose pas explicitement), rester sous 4000 chars pour les meilleurs resultats. Au-dela, le modele semble ignorer les instructions en fin de prompt.

3. **Prompt minimaliste (~200 mots) UNIQUEMENT pour scenes simples mono-beat** (1 seul contexte, 1 seul personnage, ambiance continue). Exemples : scene contemplative type Acte VII griots, clip court image-to-video 5s.

4. **Style explicite renforce** : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors" — pas juste "2D flat illustration". Ce descripteur long est celui des clips valides (Acte V, VII).

5. **Storyboard = COMPOSITION GUIDE ONLY** : ecrire explicitement "Do NOT copy the sketch style - use character ref style". Le storyboard donne l'ORDRE et le CADRAGE. Le STYLE vient des refs canons.

6. **Anti-artefacts explicites** (ajouter en fin de prompt) :
   - "No morphing between shots. Clean hard CUTS only."
   - "Normal body structure, no motion distortion, no unnecessary spins."
   - "Sword/object is RIGID, SOLID, NON-DEFORMING. Length CONSTANT."
   - Bannir les transitions d'etat ambigues : "messengers ALREADY dismounted BEFORE shot begins. Do NOT animate dismounting."
   - Bannir les hallucinations d'objet : "NO crown, NO scepter, NO gift object. Hands FLAT ON GROUND."

7. **La regle "Seedance = collaborateur creatif, prompt minimaliste" (ancienne) est OBSOLETE pour les scenes multi-contexte.** Elle reste valide UNIQUEMENT pour les scenes simples mono-beat.

**Cout d'oublier** : 2 clips inutilisables ($8.46 perdu) + frustration.
**Cout d'appliquer** : 30-45 min de redaction prompt (une seule fois, reutilisable comme template).

---

## CRITICAL RULE 2026-04-16 SOIR — Self-review SEVERE, jamais complaisante

**Erreur de review Soundjata Acte IV Clip 1** : Claude principal (et l'agent si invoque) a fait une self-review qui a valide le clip en disant "tunique blanche ✓, sash rouge ✓, 4 panels ✓✓". Mais :
- Le VISAGE de Soundjata ne correspondait pas a la ref canon (traits differents, tresses differentes)
- Le STYLE global ne correspondait pas au style des autres Actes (animation clean vs flat BD)
- Le double sabre a ete "signale comme point a trancher" au lieu de "erreur bloquante non-canon"

**Regle non-negociable pour toute self-review clip Seedance** :
1. **Verifier le VISAGE** : comparer side-by-side avec la ref canon. Si le visage ne matche pas = ECHEC, pas "drift mineur".
2. **Verifier le STYLE** : comparer avec un clip DEJA VALIDE du meme Short. Si le style est different = DISCONTINUITE, signaler comme bloquant.
3. **Verifier les DETAILS canon** : nombre d'armes, accessoires, coiffure exacte. Un sabre de trop = ERREUR, pas "visuellement dynamique".
4. **Preferer etre trop severe** : Aziz prefere que Claude signale 5 faux-positifs plutot que de laisser passer 1 vrai probleme. Aziz a le regard final et corrigera les faux-positifs.
5. **Format self-review** : pour chaque panel, ouvrir la ref canon correspondante ET la frame extraite du clip DANS LE MEME message, et comparer explicitement :
   ```
   Panel 2 check:
   - REF: braided hair, 3 braids falling left side, clean-shaven, white tunic gold trim
   - CLIP: different locks/dreads, different face shape, white tunic red sash
   - VERDICT: IDENTITY DRIFT - face and hair do not match canon
   ```

**Principe directeur (Aziz, 2026-04-16 soir)** : "Mieux vaut etre severe et que je te dise que tu as ete trop severe, que de laisser passer."

---

## LESSON 2026-04-16 SOIR — Verbes d'action dynamiques = confirme anti-statique

**Observation Acte IV Clip 1** : malgre les problemes d'identite, les elements dynamiques du prompt ont tres bien fonctionne :
- Angles de camera varies et cinematiques (tracking, low angle, over-the-shoulder)
- Galop des chevaux fluide en profil lateral (pas de slow-mo)
- Transitions entre panels naturelles
- Poussiere, mouvement, vent = clip vivant

**Regle operationnelle** :
- TOUJOURS utiliser des verbes d'action forts dans le prompt (STRIDES, KICKS, SLASHES, CUTS, CHARGES, THUNDER, ERUPTS, SWEEPS, DROPS, CLASP, PULL)
- TOUJOURS specifier des mouvements de camera actifs ("camera tracks, sweeps, pushes — always in motion")
- A MOINS que la scene soit explicitement voulue contemplative par Aziz, appliquer le traitement dynamique
- Les propositions de Kimi (angles camera varies, profil lateral galop, OTS) sont confirmees comme bonnes pratiques

**Source** : feedback Aziz 2026-04-16 soir — "le fait d'avoir utilise des verbes dynamiques aide beaucoup [...] les angles de camera, le galop des chevaux, tout est tres beau. C'est juste la difference du personnage principal qui fait en sorte que ce n'est pas utilisable."

---

## META-RULE 2026-04-16 PM — Corrections CHIRURGICALES, jamais réécriture

**Erreur répétée cette session** : sur demande de correction "change X, Y, Z et garde le reste", j'ai réécrit entièrement le plan/prompt from scratch, abandonnant tout le contenu validé précédemment.

**Exemple concret** : Visual Plan V3 → V4 demandé de corriger 4 erreurs (duration 8s→15s, ligne parasite "Wait this is wrong", scene summary, description bébé). J'ai réécrit tout le prompt avec nouveau contenu narratif ("Avant Soundjata il y avait la peur" au lieu du vrai texte Whisper), nouveau Soumaoro ("shaved head with iron rings" au lieu de dreadlocks canon), nouvel environnement inventé ("environment plate Mali — déjà généré OK" qui n'existait pas).

**Règle non-négociable** :
- Quand Aziz/Claude demande "corrige X points, garde le reste" → **éditer CHIRURGICALEMENT** uniquement les X points listés
- **NE PAS** réécrire le plan/prompt complet "pour améliorer la cohérence"
- **NE PAS** substituer ses propres formulations à celles validées précédemment
- Si un doute existe sur un point non listé → **DEMANDER**, ne pas modifier

**Workflow correct** :
1. Lire le plan/prompt précédent
2. Identifier les X passages à modifier
3. Modifier UNIQUEMENT ces passages (Edit tool si possible, pas Write du fichier complet)
4. Re-présenter le résultat en listant EXPLICITEMENT ce qui a changé et ce qui est resté identique

**Coût d'éviter** : gain de temps massif (0 regen par dérive contextuelle)
**Coût d'oublier** : 2-3 aller-retour supplémentaires, risque d'appel API corrompu (prompt halluciné)

---

## META-RULE 2026-04-16 PM — Anti-hallucination : NE JAMAIS inventer de contenu factuel

**Erreurs répétées cette session** :
1. Narration hallucinée : j'ai écrit "Avant Soundjata, il y avait la peur" dans un Scene summary alors que le brief donnait les 3 phrases Whisper exactes (XIIIe siecle pays mandingue... prophetie... ne peut pas marcher)
2. Fichier inventé : j'ai référencé "environment plate West African Mali — déjà généré OK" dans une liste de refs, fichier inexistant
3. Endpoint API erroné : j'ai proposé `fal-ai/bytedance/seedance/v1/pro/reference-to-video` sans vérifier (vrai endpoint : `bytedance/seedance-2.0/reference-to-video`)
4. Caractéristiques personnage inventées : Soumaoro "shaved head with iron rings" alors que la ref canonique montre des dreadlocks longues

**Règle non-négociable** :
- **TOUT élément factuel** (narration, chemin de fichier, endpoint API, caractéristique personnage, timing, coût) DOIT être :
  - (a) cité textuellement depuis le brief utilisateur, OU
  - (b) vérifié activement sur disque/doc AVANT d'être écrit
- **JAMAIS** remplir par inférence ou "ce qui semble plausible"
- Si une information manque et n'est pas vérifiable → **DEMANDER**, ne pas inventer

**Checks obligatoires avant de produire un Visual Plan** :
1. Narration exacte : citer textuellement depuis le brief ou timing-*.ts (pas reformuler)
2. Chemins de fichiers : vérifier existence avec Bash `ls` ou Glob AVANT de les lister
3. Endpoint API : vérifier dans un script existant qui a fonctionné récemment (grep "endpoint" dans scripts/tools/)
4. Caractéristiques personnage : ouvrir le ref canonique avec Read AVANT de décrire (ne pas se fier au souvenir du nom de fichier)
5. Paramètres API : consulter `memory/tools/{outil}.md` pour les valeurs valides (ex: duration Seedance = string "4"-"15" ou "auto", pas int)

**Coût d'éviter** : 1 commande Bash/Read (< 5s)
**Coût d'oublier** : 1-2 régens d'appel API corrompu ($3-9) + frustration Aziz + perte de confiance

---

## META-RULE 2026-04-16 PM — Nettoyer les pensées internes AVANT livraison

**Erreur répétée cette session** : j'ai livré un prompt Seedance contenant la phrase "Wait this is wrong timing-wise — revise: total clip = 8s, 6 panels..." — ma propre auto-correction en cours de rédaction restée dans le texte final.

**Règle non-négociable** :
- Avant de présenter un plan/prompt, relire intégralement pour détecter :
  - Pensées internes ("Wait...", "Actually...", "Let me reconsider...")
  - Commentaires de méta-raisonnement ("This seems...", "I'm not sure but...")
  - Brouillons non terminés ("TODO", "...", placeholder)
  - Variables non résolues (`{name}`, `[to be defined]`)
- Si détecté → nettoyer AVANT livraison
- Signaler proactivement les incertitudes restantes dans une section dédiée "Risques/incertitudes" — pas dans le prompt lui-même

---

## CRITICAL INSIGHT 2026-04-16 PM — Seedance = collaborateur créatif, pas exécutant

**Observation Acte I Soundjata v2** : avec prompt minimaliste + 4 refs canons + storyboard 6 panels, Seedance a produit un clip qui dévie significativement du storyboard littéral (village → désert vide, griots → gros plan bouche, Soumaoro sur autel → œil rouge mystique). **MALGRÉ ces déviations, le résultat est meilleur que le storyboard littéral** sur le plan cinématographique (validé par Aziz).

**Règle opérationnelle** :
- NE PAS chercher fidélité littérale au storyboard — Seedance va dériver quoi qu'on fasse
- Charger storyboard pour l'ordre narratif + mood
- Charger refs canons pour verrouiller les identités (visages/costumes)
- Prompt minimaliste (~200 mots) : mood + 5-7 priorités absolues (identity lock, timing mapping, anti-hallucination, anti-patterns)
- NE PAS sur-décrire chaque shot dans le prompt (conflit avec storyboard)
- Faire confiance à l'interprétation cinématographique de Seedance
- Régen UNIQUEMENT si : identity drift majeur, contenu narratif absent, anti-pattern explicite violé

**Corollaire — Quand premier essai insatisfaisant** : au lieu d'escalader vers prompt dirigiste, essayer l'approche opposée = refs + prompt narratif court ("tell this story in N shots"). Seedance connaît peut-être mieux ses capacités que nous.

**Corollaire — Shots inventés par Seedance qui marchent** : capturer comme nouvelles cartes à jouer pour Actes futurs (ex: "gros plan bouche de griot parlant" = shot fort réutilisable).

Référence complète : `memory/tools/seedance-storyboard-technique.md` règle 22.

---

## CRITICAL DISCOVERY 2026-04-16 PM — Seedance extrait les mots du prompt pour lip-sync

**Observation Acte I Soundjata v2** : le mot "Soumaoro" apparaissait 3 fois dans le prompt textuel. Un shot généré avec bouche de griot parlant avait l'audio qui vocalise clairement "Soumaoro".

**Règle** : Seedance 2.0 ne se contente PAS de mumble Sims-style (règle 15 storyboard-technique). Il lit le prompt textuel et peut extraire des mots-clés pour les vocaliser dans l'audio généré quand une bouche apparaît dans le shot.

**Application** :
- Pour renforcer identité audio-visuelle : mentionner noms-clés dans le prompt (personnage, lieu)
- Pour éviter mots parasites : retirer du prompt les noms sensibles (mauvaise prononciation possible)
- Compatible avec keep-and-duck 30% : bonus texture, pas un risque

Référence complète : `memory/tools/seedance-storyboard-technique.md` règle 21.

---

## CORRECTION 2026-04-16 PM — Densité panels : 9 panels par défaut est OBSOLÈTE

**L'ancienne règle "9 panels 3x3 par défaut pour TOUT storyboard-to-video" (LESSON 2026-04-14 PM ci-dessous) est partiellement obsolète** après retour Aziz sur Acte I v2 :
- 9 panels en 12-13s = 1.3-1.4s/plan → OK pour combat et contemplatif mono-beat continu (Acte VII griots)
- 9 panels pour scène narrative multi-beats → TROP RAPIDE (Acte I v1 a échoué, v2 à 6 panels = encore un peu rapide, 5 aurait été mieux selon Aziz)

**Règle corrigée (remplace la LESSON 2026-04-14 PM pour storyboard-to-video narratif)** :

| Type de scène | Densité optimale | Ratio s/plan |
|---|---|---|
| Narratif contemplatif multi-beats (setup, intro, conclusion) | **4-5 panels** | 2.4-3.0s/plan |
| Narratif équilibré multi-beats | **5-6 panels** | 2.0-2.5s/plan |
| Action dense / combat | **7-9 panels** | 1.3-1.7s/plan |
| Contemplatif mono-beat continu (Acte VII griots) | **8-9 panels** | 1.3-1.5s/plan |

**Par défaut pour Shorts Héros Oubliés Actes narratifs** : tester **5 panels** en premier, pas 9.

**Question avant de fixer la densité** : "Cette scène demande-t-elle au viewer d'absorber chaque beat (→ moins de panels, plus de temps) ou de ressentir un flow continu (→ plus de panels, rythme rapide) ?"

Référence complète : `memory/tools/seedance-storyboard-technique.md` règle 20.

---

## CRITICAL RULE 2026-04-16 — Seedance refs multiples IMPERATIF (not optional)

**Erreur commise** : Visual Plan Acte I Soundjata, j'ai proposé 1 seule ref (storyboard v5) et justifié en invoquant un "risque de style drift" si on ajoute les char refs couleur. Aziz a rejeté ce raisonnement.

**Règle correcte** :
- Seedance 2.0 reference-to-video accepte jusqu'à **9 images de référence** (+ audio/video jusqu'à 12 total). Source : `memory/tools/seedance-rules.md` règle 12.
- Pour storyboard-to-video, **TOUJOURS empiler** : storyboard principal + char refs canons de tous les personnages récurrents + environment plate si pertinent.
- **L'identity drift (visages/costumes qui changent entre panels) est BIEN PLUS GRAVE que le style drift** (sketch N&B vs refs couleur). Seedance sait réconcilier les deux styles ; il ne sait PAS inventer un visage canonique si on ne le lui montre pas.

**Règle absolue inter-Actes** : si les mêmes personnages canons apparaissent en Acte X ET dans d'autres Actes déjà produits (ex: Soumaoro Acte I + Acte V), TOUJOURS joindre les char refs canons existants pour garantir la cohérence inter-Actes du Short final.

**Anti-pattern à bannir** : "par défaut 1 seule ref, ajouter les char refs seulement si identity drift observé en post-gen". FAUX. Le coût d'ajouter les char refs est nul (même prix API). Le coût de les omettre = regen complet si drift détecté.

**Cette règle annule toute précédente qui disait "1 seule ref par défaut".**

---

## LESSON 2026-04-14 (PM) — Storyboard 9 panels 3x3 par defaut

**Erreur commise** : regen Acte VII Soundjata, j'ai produit un storyboard 1x5 (5 panels horizontal row) alors que la regle 13 de `memory/tools/seedance-storyboard-technique.md` (etablie 2026-04-13 soir) documente clairement : **viser 7-9 shots par segment de 10-12s**, avec le gabarit visuel de reference `public/assets/library/geoafrique/soundjata/combat-refs/storyboard-9panels-test.png` (9 panels 3x3 grid).

**Cause racine** : j'ai lu `seedance-storyboard-technique.md` mais applique mentalement l'ancienne regle "scene contemplative = 4-5 panels" du tableau "Shot density" (section `visual-producer.md`). Cette regle est OBSOLETE depuis le test 9 panels d'avril 13 soir — le gabarit 9 panels s'applique aussi aux scenes narratives/contemplatives, pas seulement aux combats.

**Nouvelle regle operationnelle** :
- **Par defaut pour TOUT storyboard-to-video** : 9 panels 3x3 grid
- **Gabarit visuel de reference** : `public/assets/library/geoafrique/soundjata/combat-refs/storyboard-9panels-test.png`
- **Exception** : dialogue tres simple 1 plan fixe → 3-4 panels acceptable, mais justifier explicitement
- **Avant d'ecrire un prompt storyboard** : ouvrir le gabarit 9panels-test avec Read, copier sa structure (3x3, labels de cadrage en haut de chaque panel, touches orange minimales pour feu, N&B dominant)

**Gabarit valide Acte VII (2026-04-14)** : `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte7/storyboard.png` — 9 panels 3x3 scene contemplative nocturne (feu + transmission orale) avec elder + griotte + jeune griot adulte. Preuve que la technique 9 panels 3x3 fonctionne aussi en mode narratif/contemplatif, pas seulement combat.

---

## LESSON 2026-04-14 (PM) — Gemini glisse vers "enfant" sur contexte de transmission

**Erreur commise** : prompt `young.png` Acte VII Soundjata specifiait "age around 12" dans un contexte de griots/transmission — Gemini a genere un enfant ~10 ans, violant la regle Aziz "pas d'enfants centraux dans les scenes".

**Cause racine** : contexte narratif "griots qui transmettent" suggere fortement a Gemini "enfant auditeur emerveille" comme tropisme classique. Meme quand l'age demande est adulte, Gemini peut interpreter de facon imagee.

**Remedy validee** : insister LOURDEMENT au debut, milieu ET fin du prompt sur l'age adulte + non-enfance, avec formulations explicites :
- Debut : "ADULT MAN aged 25-32 years old. NOT a child. NOT a teenager. NOT a boy."
- Corps : "Facial features of an adult male (25-32 years): visible adult jawline, defined cheekbones, adult brow, NOT rounded child cheeks"
- Fin : "CRITICAL: subject is a YOUNG ADULT MAN, not a child. Adult proportions, adult facial structure, adult body. NO child. NO teenager. NO boy. Aged 25-32 only."

**Regle operationnelle** : quand le contexte narratif d'une scene contient un tropisme "enfant" (transmission, apprentissage, conte, ecole, famille), le prompt de char-ref adulte doit forcer l'age adulte 3x (debut/milieu/fin) et expliciter les attributs morphologiques adultes (machoire, pommettes, proportions). Ne pas juste ecrire "adult" ou un age — ajouter les marqueurs anatomiques.

**Valide sur** : `public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte7/young.png` (regen 2026-04-14, homme adulte 25-32 confirme visuellement).

---

## CRITICAL RULE 2026-04-14 (PM) — Doc-First sur les assets canoniques personnage

**Erreur production Soundjata Acte IV** : j'ai genere `soundjata-adult-warrior-ref.png` from scratch alors qu'un ref canonique existait deja (`public/assets/library/geoafrique/soundjata/combat-refs/soundjata-combat-ref.png` utilise dans l'Acte V). Resultat : 2 personnages visuellement differents pour le meme Soundjata adulte (tresses + tunique blanche + ceinture rouge + sabre Acte V vs cheveux courts + barbe + boubou indigo + lance Acte IV genere). Aziz a detecte le drift, refuse, et exige le regen.

**Cause racine** : j'ai interprete "verifie ce qui existe deja" du brief comme "regarde s'il y a quelque chose a recycler" et ai decide qu'aucun ne convenait → generation from scratch. Le brief etait ambigu, mais la regle Doc-First aurait du me forcer a verifier explicitement.

**Regle non-negociable pour TOUT nouveau ref personnage** :

1. **AVANT de generer un ref personnage**, lancer une recherche systematique :
   ```bash
   find public/assets/library -name "{personnage}*" -type f
   ```
2. **Si un ref canonique existe** : le **passer en input image** au prompt Gemini d'edition chirurgicale (`gemini-3.1-flash-image-preview`). Ne JAMAIS generer le meme personnage from scratch deux fois.
3. **Si pas de ref canonique** : creer un nouveau ref avec un brief detaille, ET le sauvegarder comme **CANONIQUE** dans le dossier projet. Documenter dans la memoire agent.
4. **Si plusieurs refs canoniques contradictoires existent** : STOP et signaler a Aziz pour arbitrage avant de continuer.

**Workflow correct quand on adapte un personnage canonique** :
- Input Gemini : ref canonique (image) + prompt edition chirurgicale (texte)
- Prompt format : "Take the character from this image. Keep face, hairstyle, skin tone, body type EXACTLY THE SAME. Modify only: [costume change / pose change / accessory change]"
- Output : meme personnage visuellement reconnaissable, juste adapte au contexte de la nouvelle scene

**Coût d'eviter cette regle** : 30-60 min de regen + frustration Aziz + risque d'incoherence narrative dans le Short final (le spectateur voit 2 personnages differents).

**Coût d'appliquer** : 1 commande `find` + Gemini edition (meme prix qu'une generation from scratch).

**Application immediate** : Acte IV regen 4 refs en utilisant `soundjata-combat-ref.png` comme input. Aligner sur le sabre canonique (pas la lance). Storyboard regenere apres avec la bonne identite.

---

## CRITICAL RULE 2026-04-14+16 — Clip duration MUST match narration duration (PRECISELY)

**Erreur production Soundjata Acte VII** : j'ai demandé un clip Seedance 12s alors que la narration faisait 13.22s. Gap de 1.17s a forcé une boucle muette en post-prod (+30 min, 1 itération ratée).

**Correction 2026-04-16** : Seedance accepte des durees de 4 a 15s **par pas de 1 seconde** (parametre `duration` = string "4" a "15"). Ce ne sont PAS des paliers fixes — on peut choisir 14s, pas besoin de sauter a 15s. Toujours choisir la duree la plus proche de la narration pour eviter surplus inutile.

**Regle non-negociable pour TOUT Visual Plan** :

1. **Avant de proposer `duration` Seedance**, mesurer la FENETRE D'ANTENNE exacte de l'Acte :
   - Fenetre = du DEBUT de la premiere sous-scene au END de la derniere (inclut gaps/silences entre phrases)
   - Source : `timing-{projet}.ts` ou ffprobe
2. **Arrondir a la seconde superieure la plus proche** (pas de "palier" au sens large) :
   - Fenetre 14.32s → clip **15s** (ceil)
   - Fenetre 13.22s → clip **14s**
   - Fenetre 11.7s → clip **12s**
   - Fenetre 12.0s → clip **12s** (exact = OK)
3. **Tolerance** : un clip 1s plus court que la fenetre (ex: 14s pour 14.32s) est ACCEPTABLE si le deficit <= 0.5s — Remotion comble avec freeze/crossfade. Un deficit > 0.5s = arrondir au-dessus.
4. **Si narration > 15s** : splitter en 2 clips back-to-back, JAMAIS de boucle muette comme fix
5. **Cross-check prealable bloquant** : `clip_seconds >= ceil(narration_seconds) - 0.5` AVANT tout appel API.

**Section obligatoire dans tout Visual Plan** :
```
Narration measured: X.XXs (source: timing-soundjata.ts scenes A+B+C)
Clip Seedance demandé: Y.0s (Y >= ceil(X))
Cross-check: Y >= X ? OK / NOT OK
```

**Coût d'éviter** : +$0.30/s × 1-2s = +$0.30-0.60 (négligeable)
**Coût d'oublier** : 30+ min Remotion debug + 1-2 mini-renders ratés + risque cascade quality-reviewer

---

## CORRECTION 2026-04-14 — Seedance reference-to-video image limit

**Erreur commise** : j'ai affirmé que Seedance `reference-to-video` acceptait max 4 images. **FAUX.**

**Vérité (source : `memory/tools/seedance-rules.md` règle 12)** : Seedance accepte jusqu'à **9 images par requête**. Notre limite pratique à 1-2 est un CHOIX, pas une contrainte technique.

**Leçon Doc-First** : toute affirmation sur une limite/capacité d'outil DOIT être vérifiée dans le fichier memory/tools/ correspondant AVANT de la prononcer. Violer cette règle = risque de dimensionner un Visual Plan trop petit et sacrifier la qualité sans raison.

**Application immédiate** : pour storyboard-to-video, on peut passer le storyboard + 3-4 char refs + environment plate SANS sacrifier aucune ref. 5 refs = totalement dans le budget API.

---

## PRIMARY CAPABILITY: Storyboard-to-Video (added 2026-04-13)

**Reference**: `memory/tools/seedance-storyboard-technique.md` (full rules, 12 items)
**Workflow**: Gemini sketch 5 panels + char refs + env plate → Seedance `reference-to-video` 9:16 with audio
**Applicable scenes**: 2-5 shots narrative sequences under 15s (battle + reaction, preparation + impact, action + consequence)
**Validated projects**: Soundjata Acte V (2026-04-13, 22s)

**6 known weaknesses and primary remedies**:
- F1 State transitions weak → **explicit VISUAL STATE TRANSITIONS clause in prompt** (not hybrid Seedance+Remotion as fallback)
- F2 Char ref neutral-bg → empty scenes → **generate context-refs with scene background suggested**, not per-shot environment repetition
- F3 ~~Gemini 5-panel layout unreliable~~ **OBSOLETE** — default is now 9 panels 3×3 grid (see LESSON 2026-04-14). Gemini 3.1 Flash handles 3×3 reliably with the `storyboard-9panels-test.png` template pattern.
- F4 Gemini 3 Pro Image conservative in edit → **use Flash Image for surgical edits**
- F5 Rigid elongated objects stretch → **tight framing + RIGID/CONSTANT clause**
- F6 Format mismatch → **always `aspect_ratio` = final format in API, no crop-in-post**
- **F7 Gemini drift to "child" in transmission narratives** (added 2026-04-14) → force adult age 3× in prompt + explicit anatomical adult markers (see LESSON 2026-04-14 on Gemini "enfant" drift)

**Future projects candidate**: Thiaroye V4, Nzinga, Lat Dior, Yaa Asantewaa, Hannibal, Abou Bakari II — most Shorts have multi-shot narrative sequences fitting this technique.

---

## Established Style IDs per project

| Project | Style ID | Tool | Ref image | Status |
|---------|---------|------|-----------|--------|
| _(none established yet)_ | | | | |

Quand un Style ID Recraft V3 est cree pour un projet, l'ajouter ici.

---

## REF character paths per project

| Project | Character | REF file path | Notes |
|---------|-----------|--------------|-------|
| Thiaroye 1944 | Style anchor | `public/assets/library/geoafrique/thiaroye-1944/frames/frame-03.jpg` | 2D flat BD style |
| Soundjata combat test | Soundjata | `public/assets/library/geoafrique/soundjata/combat-refs/soundjata-combat-ref.png` | Full body, combat stance, neutral bg (for text-to-video, motion transfer) |
| Soundjata combat test | Soumaoro | `public/assets/library/geoafrique/soundjata/combat-refs/soumaoro-combat-ref.png` | Full body, casting stance, neutral bg |
| Soundjata Acte V | Savanna plate | `public/assets/library/geoafrique/soundjata/combat-refs/savanna-environment-plate.png` | Mali savanna environment for storyboard-to-video |
| Soundjata Acte V | Storyboard A | `public/assets/library/geoafrique/soundjata/combat-refs/storyboard-segment-A.png` | 4-panel sketch, invulnerability + griot + arrow prep |
| Soundjata Acte V | Storyboard B v3d | `public/assets/library/geoafrique/soundjata/combat-refs/storyboard-segment-B-v3d.png` | 5-panel POV sketch, tir + impact + terror |
| Sonjata Papercraft | Sunjata enfant (scenes 1-5) | `sonjata-papercraft/refs/sunjata-child-charsheet-v1.png` | Bare-chested, red loincloth, curly hair, dot-eyes, defiant. CANONICAL. |
| Sonjata Papercraft | Sunjata adulte/guerrier (scenes 6-7) | `sonjata-papercraft/refs/sunjata-adult-charsheet-v1.png` | White tunic + gold trim, red sash, braids, sword, gold necklace. CANONICAL. |
| Sonjata Papercraft | Sunjata roi/empereur (scenes 8-10) | `sonjata-papercraft/refs/sunjata-king-charsheet-v1.png` | White boubou + gold embroidery, red sash, Mande bonnet, gold scepter. CANONICAL. |
| GeoAfrique characters | _(references to add)_ | | |

---

## Seed values that produced good results

| Asset | Tool | Seed | Prompt tag | Use case |
|-------|------|------|-----------|----------|
| Soundjata combat V2 | Seedance 2.0 reference-to-video | (seed varies) | Choreography transfer | Reference for future combat scenes |

---

## Cost averages per scene

| Scene type | Typical tool | Cost | Notes |
|------------|-------------|------|-------|
| Static Gemini image (character, background) | Gemini 3.1 Flash Image | ~$0.04 | 1024x1920 typical |
| Icon with REF character | Gemini | ~$0.04 | PIL white->transparent post-processing |
| Parchment map | Gemini | ~$0.04 | "visually CALM" prompt |
| Seedance Short clip 5-10s | Seedance 2.0 T2V/I2V | $1.50-3.00 | 720p |
| Seedance reference-to-video 10s | Seedance 2.0 | ~$3.02 | 720p with video ref |
| Kling V3 Pro 4K clip | Kling | ~$0.50-2.00 | Premium quality |
| Recraft V3 SVG with Style ID | Recraft | ~$0.04 | Style ID must pre-exist |

---

## New gotchas discovered

### GOTCHA 2026-04-16 SOIR — Coherence start/end frames : utiliser le END valide comme ref pour le START

**Erreur commise** : generation de 2 images (start + end frame) pour un clip Seedance start/end. Les 2 images ont ete generees avec la meme ref source (frame-01 du clip precedent). Resultat : la matrone est beaucoup plus vieille sur le START que sur le END, vetements differents (boubou ample vs robe epaule denudee), villageoises clonees en arriere-plan.

**Cause racine** : chaque appel Gemini genere independamment, donc meme avec la meme ref, les 2 images derivent l'une de l'autre. La ref source ancre le STYLE mais pas l'IDENTITE precise du personnage genere.

**Regle non-negociable pour TOUTE generation start/end frame** :
1. Generer le END frame EN PREMIER (c'est l'image la plus contrainte narrativement)
2. Si le END est valide, l'utiliser LUI-MEME comme ref pour generer le START
3. Insister dans le prompt START : "The woman must be IDENTICAL to the reference image — same face, same age, same dress, same jewelry"
4. Pour les personnages d'arriere-plan : insister "Background characters must ALL be DIFFERENT from each other — different ages, different body types, different poses, different clothing colors"

**Workflow correct** :
```
Etape 1: generer END frame avec ref canon existante
Etape 2: Aziz valide le END
Etape 3: generer START frame en utilisant le END valide comme ref
Etape 4: self-review coherence START vs END (meme visage, meme age, meme vetement)
```

**Cout d'oublier** : 1 regen ($0.08) + 2 min perdues + friction Aziz
**Cout d'appliquer** : sequencer les 2 appels (pas paralleliser) = +30s de latence

**Anti-pattern villageoises clonees** : Gemini produit des copier-coller d'arriere-plan si le prompt ne mentionne pas explicitement la diversite. Toujours ajouter la clause diversite pour tout groupe de personnages secondaires.

---

## LESSON 2026-04-16 — Storyboard : age personnage DOIT matcher l'arc narratif

**Erreur commise** : storyboard Acte IV Clip 1 v1+v2, panel 1 "WIDE EXIL" montrait Soundjata comme un jeune adulte en tunique blanche. Or dans l'arc narratif, l'Acte IV commence JUSTE APRES l'Acte III (enfant qui souleve le baobab). C'est un enfant/adolescent qui part en exil, pas un adulte. Les 7 ans de maturation se passent PENDANT l'exil (entre panels 1 et 2), pas avant.

**Erreur de ref associee** : `soundjata-exile-ref.png` (le perso genere pour l'exil) etait deja un adulte, donc le storyboard le reproduisait correctement par rapport a la ref, mais la ref elle-meme etait fausse par rapport au recit.

**Correction** : extraire une frame du clip Acte III valide (`acte3-iron-bar-v1.mp4`, frame 13 = enfant torse nu + pagne + pieds nus soulevant le baobab) et l'utiliser comme ref canon pour panel 1. Cree `soundjata-young-exile-ref.jpg`.

**Regle non-negociable** :
- AVANT de valider les refs personnage d'un Visual Plan, verifier la COHERENCE NARRATIVE avec l'Acte precedent : qui est le personnage A LA FIN de l'Acte N-1 ? C'est CE personnage qui apparait AU DEBUT de l'Acte N.
- Si un Acte montre un personnage qui vieillit/change entre panels : documenter explicitement quelle ref couvre quel panel.

**Cout d'oublier** : 2 regens storyboard ($0.16) + 1 consultation Kimi ($0.02) + 30 min de session.

---

## LESSON 2026-04-16 — Seedance : frontal camera sur animaux = PIRE piege (pas le lateral)

**Erreur commise** : storyboard v1 avait des cavaliers en profil lateral (ma crainte : slow-mo Seedance). J'ai "corrige" en v2 avec cavaliers 3/4 frontal vers camera. Kimi K2.5 a identifie que c'est L'INVERSE : frontal sur animaux = "chevaux figes ou slow-mo liquide/gelatineux". Le profil lateral STRICT avec pan camera = la bonne solution pour galop.

**Regle corrigee** :

| Direction animaux | Resultat Seedance | Verdict |
|---|---|---|
| Frontal vers camera | Chevaux figes, gelatineux, slow-mo parasite | INTERDIT |
| 3/4 frontal | Mieux que frontal mais reste risque | A EVITER |
| **Profil lateral strict + pan camera** | Mouvement fluide, galop lisible | RECOMMANDE |
| Profil lateral SANS pan (statique) | Risque slow-mo contemplatif | A EVITER |

**Cle** : le pan camera (mouvement camera lateral qui suit les sujets) est le facteur anti-slow-mo, pas l'angle frontal/lateral. Combiner profil strict + pan = galop dynamique.

**Source** : Kimi K2.5 review Acte IV storyboard, 2026-04-16. A propager dans `memory/tools/seedance-rules.md`.

---

## LESSON 2026-04-16 — Storyboard Gemini : anatomie "objet porte" = hallucination frequente

**Erreur commise** : storyboard v1 panel 1, prompt "baluchon sur l'epaule" → Gemini a genere un bras dans un angle anatomiquement impossible avec le baluchon qui flotte.

**Diagnostic** : Gemini 3.1 Flash Image hallucine regulierement sur les postures "personnage qui porte un objet" quand le prompt decrit la position finale (sur l'epaule) sans decrire la MECANIQUE (comment la main tient l'objet, comment l'objet pend).

**Regle operationnelle** : pour TOUT objet porte par un personnage dans un storyboard, decrire la MECANIQUE complete :
- Ce que la main tient (cordelette ? baton ? tissu ?)
- Comment l'objet pend (contre le dos ? en travers ?)
- Quel bras est mobilise, quel bras est libre

**Patterns valides** (anti-hallucination) :
- Ballot sur baton : "carries a small bundle tied to a SHORT STICK resting on his RIGHT SHOULDER, stick held in right hand, left arm swings free"
- Ballot sur cordelette : "holds a cord in RIGHT HAND at hip level, bundle HANGS DOWN against his lower back"
- Ballot tenu devant : "carries bundle CLUTCHED to his chest with both arms"

**Pattern INTERDIT** : "baluchon sur l'epaule" / "bundle on shoulder" (trop ambigu, declenche l'hallucination anatomique de Gemini).

---

## Session log

### 2026-04-13 (initial)
Agent cree. Motion reference transfer teste (hors agent) sur Soundjata vs Soumaoro : validation de la technique.

### 2026-04-13 PM (storyboard-to-video integration)
Technique Seedance Storyboard-to-Video validee en production sur Soundjata Acte V (22s final). 6 faiblesses identifiees + remedies documentes. Voir `memory/tools/seedance-storyboard-technique.md` (12 regles). A utiliser comme technique primaire pour toute sequence narrative multi-shots < 15s. Pour chaque personnage recurrent dans un projet storyboard-to-video, prevoir generer une char ref "context" (fond scene suggere) en plus de la char ref neutral-bg.

### 2026-04-16 (storyboard Acte IV Clip 1 — 3 iterations)
3 erreurs identifiees sur v1/v2, corrigees dans v3 grace a review Aziz + consultation Kimi K2.5.
3 lecons ajoutees : age narratif personnage, frontal animaux interdit, anatomie objet porte.
Storyboard v3 valide par Aziz — direction Kimi DA retenue.
Visual Plan produit en 2 iterations : v1 proposait duration=15s (palier fixe) alors que 14s suffit
(deficit 0.32s absorbable Remotion). Prompt corrige avec verbes d'action forts (anti-statique).
**Erreur residuelle detectee par Claude principal** : le prompt V5 mentionnait "9 shots" et
"Follow storyboard for all 9 shots" alors que le storyboard v3 = 4 panels. Residu de l'ancienne
regle "9 panels par defaut" appliquee sans re-verifier le storyboard actuel.
Lecon : quand le storyboard dit N panels, le prompt DOIT dire N shots. Verifier visuellement.

### 2026-04-20 (Sonjata Papercraft Session 4 — 6 lecons)

**R80 confirme sur start/end frame** : la barre de fer a retreci de ~40% entre START (droite) et END (pliee en arc). Seedance ne maintient pas la taille des objets rigides qui changent de forme. Mitigation : exagerer la taille dans le END frame, ou trimmer les dernieres frames.

**Dot-eyes → orbites blanches** : NE PAS ecrire "eyes WIDEN" pour personnages paper-craft. Seedance transforme les dot-eyes en grands yeux blancs. Utiliser reactions corporelles ("STEP BACK", "hands to mouth", "CLUTCHES staff") au lieu de reactions faciales.

**Storyboard regen > edition chirurgicale** : pour corriger un storyboard multi-panels, TOUJOURS regenerer le storyboard COMPLET avec prompt corrige. Edition chirurgicale Gemini ne sait pas cibler un seul panel.

**Forced alignment = source de verite** : TOUJOURS verifier les frontieres audio mot par mot dans le forced alignment JSON AVANT de generer un clip. Le manifest a des approximations.

**Character sheets AVANT production** : generer les refs canoniques de tous les personnages recurrents AVANT de produire les scenes. Les passer en input a chaque image Gemini.

**Orbite 180 + start/end frame = combo valide** : l'orbite masque partiellement les artefacts (retrecissement, yeux) car le spectateur suit le mouvement. Teste et valide Scene 4 Sonjata.

### 2026-04-22 (Sonjata Sessions 7-8 — VALIDATION FINALE Short)

**Session 7 (2026-04-21 PM)** — Scenes 8, 9, 10 assemblees :
- Scene 8 Mansa + Charte (18s) : 2 images Gemini + edition chirurgicale tablette (inscriptions N'Ko ajoutees) + 2 clips Seedance V2 9s. **Orbite 90 camera confirmee = effet pseudo-3D isometrique** (4eme confirmation).
- Scene 9 Citations Charte (8s) : Remotion pur. Parchemin Gemini + Cinzel Decorative or + 3 symboles Gemini (arbre vie, bouclier, chaines brisees) avec fond transparent via PIL post-process (seuil brightness > 160 → alpha 0) + SFX plume ElevenLabs.
- Scene 10 Close (16s) : Timeline 1235/1789 + split vertical video (scene 2 | scene 8A simultanes) + signature Cinzel Decorative.
- Feedback Aziz scene 8 : "parmi les meilleurs clips qu'on a genere" — orbite 90 + dot-eyes tenus + objets en main = pipeline rode.

**Session 8 (2026-04-22)** — Musique + Hook + VALIDATION :
- **Hook visuel** : extrait de scene 4 (37s-42s = main qui saisit barre + lutte, pas de lever) = pattern reutilisable pour tous les Shorts. Voir `memory/templates/hook-short.md`.
- **Criteres choix segment hook** : (1) tension sans resolution, (2) close-up debut + plan large ensuite, (3) pas de dialogue, (4) climax preserve.
- **Zero cout visuel pour le hook** : reutilisation du render existant, pas de nouveau clip Seedance genere.
- Render final 151s valide par Aziz : **"tres bon, cas d'ecole qui a rode le pipeline, publiable pending CTA"**.
- Ne reste que : CTA narration (apres recharge ElevenLabs) + Unicode fix SonjataCTA.tsx.

**Diagnostic pipeline post-Sonjata** : ~60-70% rode. Short #2 estime a $20-30 et 4-5 sessions (pas 1 session comme vrai pipeline industriel). Gap principal : gates `pipeline_gates.py` (13 gates) existent mais pas integres comme wrapper bloquant.

---

### 2026-04-21 (Sonjata Papercraft Session 6 — Scene 7 Kirina, 4 clips)

**V2 > V1 Pro pour paper-craft dot-eyes** : V1 Pro degrade les dot-eyes en yeux realistes (iris, pupilles visibles) apres 3s de camera rapprochee. Teste et confirme sur scene 7B. V2 avec clause "MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris" maintient les dot-eyes sur toutes les frames. **V2 = endpoint par defaut pour paper-craft desormais.**

**Clause dot-eyes OBLIGATOIRE** dans tout prompt paper-craft :
`MAINTAIN dot-eyes throughout, small black dot pupils, NO realistic eyes, NO visible iris.`

**i2v classique > start/end frame pour action dynamique** : scene 7C arc bande → relache en start/end frame = quasi-statique (la fleche ne part pas). Meme scene en i2v classique (1 seule image source, pas de end_image_url) avec verbes explosifs = tir dynamique, fleche qui part, corps qui recule. **Regle** : start/end frame = UNIQUEMENT transitions de perspective camera. Action = i2v classique + verbes forts.

**Seedance V2 anime les transitions d'etat abstraites** : scene 7D, Soumaoro se dissout dans la brume des montagnes. Le prompt decrivait la dissolution SECONDS par SECONDS avec des etapes concretes (STAGGERS → FADES → empty ground). Resultat excellent. Les transitions chromatiques (gris-froid → ambre-dore) fonctionnent aussi.

**Vetements historiques** : Gemini genere des armures Vikings par defaut. Toujours specifier : "13th century West African Mande warriors, cotton tunics, leather armor with geometric patterns, cowrie shell decorations, turbans, leather war caps, gris-gris amulets, wooden spears with iron tips."

**ElevenLabs SFX comme complement** : `POST /v1/sound-generation`, model `eleven_text_to_sound_v2`. Genere des SFX d'ambiance (flammes, tambours) quand le clip n'a pas d'audio Seedance. Assets dans `public/assets/{project}/sfx/`. Mixer a 30% sous narration dans Remotion.

### 2026-04-19 (Sonjata Papercraft Session 2 — 5 erreurs corrigees)

**R-PC1 oubliee sur image Scene 2** : v1 avait Sassouma doigt pointe, villageoise main sur bouche, enfants en course. Tout etait en position d'ACTION, pas de DEPART. Regle : apres generation image, LISTER chaque personnage + verifier position = NEUTRE avant de livrer.

**R19 — vetements doivent correspondre a l'EPOQUE du sujet** : Gemini a genere des enfants en t-shirt/shorts pour une scene XIIIe siecle. Regle : specifier l'epoque et les vetements coherents dans le prompt Gemini. Gemini default = moderne si pas precise. ATTENTION : cette regle est CONTEXTUELLE. Soundjata XIIIe = pagnes/tissu. Thiaroye 1944 = uniformes militaires. News contemporaine = vetements modernes. Appliquer avec jugement selon le sujet.

**Nombre villageois insuffisant** : v3 avait 2 villageois au lieu de 5-6. Regle : quand la scene demande une foule ou des temoins, specifier un NOMBRE MINIMUM explicite ("at least 5-6 adult villagers") dans le prompt Gemini.

**Figurants paper-craft = deplacements OK mais BIEN SPECIFIER** : un enfant qui court s'est multiplie (copie fantome laissee a la position initiale). Cause : prompt trop vague ("children RUN past"). Les deplacements de figurants RAJOUTENT DE LA VIE et sont encourages, mais le prompt doit etre TRES LITTERALE : specifier (1) identite distincte du figurant ("the smaller child in brown cloth"), (2) direction exacte ("toward the BACKGROUND behind the huts"), (3) destination finale ("EXIT behind the hut on the RIGHT"). Sans ces precisions, Seedance duplique ou fait looper.

**Double generation Seedance** : 2 agents lances successivement ont chacun soumis un job ($7.80 au lieu de $3.90). Regle : UN SEUL job Seedance a la fois. Toujours retourner le request_id. Si le premier agent ne retourne pas de request_id, verifier le dashboard fal.ai AVANT de relancer.
