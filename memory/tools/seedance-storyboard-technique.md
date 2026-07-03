# Seedance 2.0 — Technique Storyboard-to-Video

> Source : @voxelplot sur X, 2026-04-13 (thread "Seedance 2.0 — Série de Workflows Avancés, #7 Storyboard vers Vidéo")
> Démo source : https://x.com/voxelplot/status/2043645442597007721 (10s, anime combat hero vs phoenix)
> Statut : **À TESTER** sur Acte V Kirina Soundjata avant adoption.

---

## Principe

Au lieu de générer 1 clip = 1 plan, on donne à Seedance :
- **1 storyboard** (image grille N&B sketchée, 4-9 panels)
- **1+ character sheets** (identity anchors)
- **1 environment plate** (style + décor)

Seedance génère **une micro-séquence de 2-4 plans enchaînés** avec coupes internes, identité des persos verrouillée, et style cohérent.

**Contrainte dure : 15 secondes max par génération.** Donc technique utile pour micro-séquences, pas pour remplacer notre pipeline clip-par-clip.

---

## Quand utiliser cette technique (vs clip-par-clip classique)

| Situation | Technique adaptée |
|-----------|-------------------|
| Scène d'action avec 3-4 plans enchaînés (<15s) | **Storyboard-to-video** |
| Plan unique long ou lent (>10s sur une seule action) | Clip-par-clip classique |
| Dialogue avec lip sync précis | Clip-par-clip (lip sync flip-sign drift risque augmenté en multi-cut) |
| Séquence où cohérence identité entre shots est critique | **Storyboard-to-video** (refs partagées = moins de drift) |
| Plan statique / tableau contemplatif | Clip-par-clip |

**Règle de décision** : si une micro-séquence prévue nécessite 2+ clips classiques dans <15s ET que la cohérence visuelle entre ces clips est critique → tester storyboard-to-video en premier.

---

## Workflow 5 étapes

### 1. Character Design
Créer un character sheet par personnage principal (frontal + profil + dos + 3-4 close-ups expressions).

**Méthode A — MJ direct** :
```
Prompt: character sheet of a [character], [role description], [style], highly stylized, with frontal view, side view, back view and 3 close ups, of side, front and back view
```

**Méthode B — Image cool → Nano Banana/Seedream** (préféré pour notre cas car on a déjà des persos établis) :
Uploader l'image du perso + prompt :
```
Create a character sheet of this character, highly stylized, full body with frontal view, side view, back view and 4 close-ups with expressions neutral, happy, determination and anger, in white background. Maintain 100% artstyle and character traits. Use image 1 as reference.
```

**Notre stack** : Gemini 3 Pro Image (`gemini-3-pro-image-preview` = Nano Banana Pro). Pour notre cas Soundjata, on a déjà des char sheets via les refs motion transfer du 2026-04-13.

### 2. Design Environment & Art Style
Générer 1 image "plate" qui incarne le style et le décor. La ref environment porte le style artistique plus que le prompt textuel.

```
Prompt: wide shot, full color anime shot, environment, [lieu]
```
(Avec une image ref qui a le style voulu en "Image Prompt")

**Notre stack** : Gemini 3 Pro + ref `frame-03.jpg` équivalent GeoAfrique pour le style anchor.

### 3. Storyboard via Nano Banana Pro
Uploader char sheets + prompter le shot list. Nano Banana génère une grille de panels N&B sketch.

```
Prompt template:
I have a [genre] scene, a [description] of [subject] against [antagonist]. The action begins with:
1. [shot 1 description]
2. [shot 2 description]
3. [shot 3 description]
4. [shot 4 description]
5. [final shot description]
```

**Style du storyboard** : sketch N&B (comme dans la démo), pas colorisé. Les panels doivent être clairs sur le framing (close-up, wide, POV, etc.) et l'action.

### 4. Prompt Seedance avec refs nommées (CRITIQUE)

Structure du prompt final — priorité stricte et rôles séparés :

```
Use the references with strict priority and role separation:

[REF_STORYBOARD] = "Image 1" primary guide for shot order, framing, timing, composition, and scene progression. Follow it strictly.
[REF_CHAR1_MODEL] = "Image 2" identity anchor for [perso 1].
[REF_CHAR2_MODEL] = "Image 3" identity anchor for [perso 2].
[REF_BACKGROUND] = "Image 4" environment and [lieu] background anchor.

Create a [style] [genre] scene of [action summary] in [setting].

Absolute priority:
1. Follow the storyboard strictly for all shots and scene progression.
2. Keep [perso 1] design locked to [REF_CHAR1_MODEL].
3. Keep [perso 2] design locked to [REF_CHAR2_MODEL].
4. Keep the [setting] consistent with [REF_BACKGROUND].
```

**Raffinement** : demander à un LLM (Gemini/ChatGPT) de reformuler ce prompt selon ton specifique de la scène, tester 2-3 variantes.

### 5. Multi-génération + cherry-pick
- 2-3 générations Seedance avec le même prompt
- Certains shots seront moins bons que d'autres dans chaque génération
- Cherry-pick les meilleurs shots de chaque video dans DaVinci Resolve (ou notre pipeline Remotion)
- Assembler final cut

---

## Points forts observés (démo @voxelplot 10s)

- **Identité perso verrouillée** sur 10s et 5-6 shots : cheveux noirs, bandeau orange, costume rouge préservés
- **Transitions naturelles** entre plans (pas de hard cut moche)
- **Style anime 90s cel** tenu sur toute la durée grâce à l'environment plate
- **Composition respecte le storyboard** : hero pose → foreshortened → close-up visage → close-up yeux → punch to camera → wide final

## Points de vigilance

1. **15s max** — à ne pas oublier en designant la micro-séquence
2. **Inconsistencies entre générations** — prévoir 2-3 gens et cherry-pick (notre budget Seedance doit en tenir compte)
3. **Lip sync non testé** — cette technique semble orientée action. Pour dialogue narratif long, prudence
4. **Storyboard sketch N&B > color** — la démo utilise sketch, plus facile pour Seedance d'interpréter le framing sans être parasité par la couleur du storyboard lui-même
5. **Role separation dans le prompt** — `[REF_STORYBOARD]/[REF_X_MODEL]` avec "Image 1/2/3/4" explicite. Sans cette discipline, Seedance peut mélanger les refs
6. **Aspect ratio = format final, PAS 16:9 par défaut** — générer directement dans le format de destination. Pour YouTube Shorts / Instagram Reels : `aspect_ratio: "9:16"` dans les params API. NE JAMAIS générer en 16:9 "pour cropper après" — le crop détruit ~55% de l'image. Seedance recadre intelligemment chaque panel du storyboard au format demandé. Validé par erreur Segment A v1 → v2 le 2026-04-13.
7. **Objets allongés rigides sur plan serré avec mouvement de mains** — Seedance peut déformer progressivement la longueur d'une flèche, lance, épée si les mains qui la tiennent bougent. Fix : (a) cadrer assez serré pour que seule une portion de l'objet soit visible, la reste off-frame, et (b) ajouter une clause explicite "RIGID, SOLID, NON-DEFORMING shaft - length MUST remain CONSTANT, does NOT stretch, does NOT extend". Validé sur Segment A v1 (flèche qui s'allongeait entre 11s et 12s) → v2.
8. **Char ref à fond neutre = Seedance reprend le fond neutre sur plans serrés** — quand une char ref a un fond tan/beige uni (pour faciliter sa portabilité), Seedance remplace l'environment plate par ce fond neutre sur les shots cadrés serré sur le perso. Fix : (a) dans le prompt SHOT-by-SHOT, **répéter explicitement l'environment à chaque shot** ("Soumaoro on the savanna with acacia trees behind him, amber sky, dust particles"), ou (b) regénérer la char ref avec un fond savane suggéré (plus lié mais moins portable). Validé sur Segment B v3 2026-04-13 : SHOT 4 et 5 ont un fond plat beige car prompt ne précisait pas l'environnement à ces shots, alors que [REF_SAVANNA] était bien passé comme image 4.
9. **POV first-person pour continuité entre segments** — quand un nouveau segment prend la suite d'un précédent qui se termine sur gros plan des mains/objets, démarrer le nouveau segment en POV first-person (mains du héros) maintient la continuité visuelle parfaite. Pas de rupture "qui est ce perso ?" Validé sur Segment B v3 2026-04-13 — SHOT 1 POV tire l'arc = continuation directe de SHOT 4 Segment A (mains qui fixent l'ergot).
10. **Storyboard 5 panels bande horizontale difficile mais possible** — Gemini a tendance à produire 2x3 grid même si on demande 1x5. Prompt solution : répéter "EXACTLY 5 panels, SINGLE HORIZONTAL ROW, NOT a 2x3 grid, NOT 6 panels, ONLY 5 panels". Si premier essai produit 6 cases redondantes, regénérer (moins cher de payer 2x $0.08 que d'essayer une édition chirurgicale qui échoue).
11. **Gemini 3 Pro Image vs 3.1 Flash Image — INVERSION CRITIQUE** : `gemini-3.1-flash-image-preview` = bon pour EDITION CHIRURGICALE (accepter une source + modifier un détail). `gemini-3-pro-image-preview` = bon pour GENERATION PURE sans source, mais TROP CONSERVATEUR en mode édition (refuse de modifier si source fournie). Validé 2026-04-13 : tentative de fix panels 4-5 d'un storyboard avec Pro Image = image quasi-identique à la source. Passage à Flash = modifications appliquées.
12. **Seedance peut ajouter un 6ème shot non prévu** — si prompt stipule 5 SHOTS mais le storyboard montre 5 panels, Seedance peut générer un zoom-in supplémentaire en fin de clip (ex: close-up visage après medium shot). Souvent bienvenue (ajoute variety) mais peut casser le timing narration. Fix : specifier explicitement "FINAL SHOT ends at [X]s, NO additional shots or zooms after". Observé sur Segment B v3 = zoom terreur visage ajouté spontanément (bon dans ce cas).
13. **Densité de shots : calquer sur la démo voxelplot (2026-04-13)** — la démo source utilise **9 panels pour 10s** (~1.1s/shot), pas 4-5 panels pour 12s (~2.5s/shot) comme on a fait sur Soundjata. Pour un rythme anime/sakuga authentique, viser **7-9 shots par segment de 10-12s**, avec mix de micro-coupes (0.8-1.2s) et un shot long final (2-3s) pour respirer. Les micro-coupes ont un triple bénéfice : (a) rythme visuel dense typique des Shorts performants, (b) contrôle narratif plus granulaire, (c) moins Seedance a de temps par shot, moins il dérive (masque automatiquement les temps morts de Soumaoro statique, aura qui persiste, etc.). **Règle** : par défaut, si la scène est d'action/combat, viser 7-9 panels. Si la scène est contemplative/narrative, rester à 4-5 panels. Sous-utilisation identifiée sur Soundjata Acte V Segments A+B (4 et 5 panels au lieu de 8 possibles).

### Taille du storyboard par type de scène

| Type de scène | Nb shots cible | Durée shot cible | Exemple |
|---------------|---------------|------------------|---------|
| Action/combat dense | **7-9** | 0.8-1.2s (+ 1 shot long final 2-3s) | Charge + impact + réaction (sakuga) |
| Multi-plan narratif | 5-7 | 1.5-2s | Préparation + révélation + décision |
| Contemplatif/préparation | 4-5 | 2-3s | Ce qu'on a fait sur Soundjata |
| Dialogue simple | 3-4 | 3-4s | Close-up alternés |

### Grille layout recommandée

- **4-5 panels** : layout 2×2 grid ou 1×5 strip (horizontal ou vertical)
- **7-9 panels** : layout **3×3 grid** (comme la démo voxelplot) — c'est le sweet spot anime
- Ne pas dépasser 9 panels (surcharge storyboard, Seedance interprète mal)

## 14. Prompt : detaille shot-by-shot <4000 chars (VALIDE 2026-04-16, remplace hypothese minimaliste)

**A/B test REALISE sur Soundjata Acte IV Clip 1** (3 tentatives, scene multi-contexte 4 shots) :

| Tentative | Type prompt | Chars | Resultat |
|---|---|---|---|
| v1 | Minimaliste (~200 mots) | ~1200 | REJETE — 3D-ish, double sabre, identity drift |
| v2 | Minimaliste + fidelite | ~1800 | REJETE — 3D-ish, morphing cheval→genoux, couronne hallucinee |
| **v3** | **Detaille shot-by-shot** | **3656** | **VALIDE — flat BD, identite respectee, zero artefact majeur** |

**Conclusion : l'hypothese minimaliste voxelplot est INVALIDEE pour les scenes multi-contexte.** Le prompt detaille shot-by-shot est obligatoire quand la scene a plusieurs lieux, changements de personnage, ou transitions narratives.

**Regle definitive** :

1. **Scene multi-contexte** (>=2 lieux, changements entre shots) : prompt detaille shot-by-shot, **3500-4000 chars max**
   - Un paragraphe par shot : action, camera, eclairage, position, expression
   - Verbes d'action FORTS (STRIDES, KICKS, SLASHES, CHARGES, THUNDER, ERUPTS)
   - "Camera TRACKS, SWEEPS, pushes — always in motion"
   - Anti-artefacts explicites en fin (no morphing, no crown, RIGID, ALREADY dismounted, clean hard CUTS)

2. **Scene simple mono-beat** (1 contexte, 1 perso, ambiance continue) : prompt minimaliste OK (~200 mots)
   - Exemples : Acte VII griots (feu + transmission), clip court image-to-video 5s

3. **Limite STRICTE : <4000 caracteres** — imposee par Dreamina web, recommandee aussi pour API fal.ai (meme modele Seedance 2.0). Au-dela, le modele semble ignorer la fin du prompt.

4. **Style obligatoire** : "2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors" — ce descripteur long est celui de TOUS les clips valides (Acte V 9.5/10, Acte VII APPROVE, Acte IV v3 valide).

5. **Storyboard = COMPOSITION GUIDE ONLY** : ecrire explicitement "Do NOT copy the sketch style - use character ref style".

## 23. Objets hors-cadre = Seedance garde la pose sans l'objet (2026-04-16)

**Observation Acte IV Clip 1 v3** : le prompt disait "messengers stand behind, each holding the reins of their horse". Seedance a place les 2 messagers debout tenant des cordes (renes) dans leurs mains, MAIS les chevaux ne sont pas visibles dans le cadre. Seedance a interprete "holding reins" en montrant le geste sans l'objet source (cheval).

**Regle** : quand un personnage tient un objet qui est lie a un element hors-cadre (renes→cheval, laisse→animal, corde→ancre), Seedance reproduit le geste de "tenir quelque chose" mais peut omettre l'element source. Ce n'est generalement pas bloquant — le spectateur interprete le geste dans le contexte. Mais si l'objet source DOIT etre visible, il faut le specifier explicitement dans le cadrage du shot ("horses VISIBLE in frame behind them").

**Verdict Aziz** : artefact mineur, non bloquant, pas de regen necessaire.

---

## Stratégie audio keep-and-duck (VALIDÉE 2026-04-13)

**Nouvelle règle pour storyboard-to-video (différente de la règle Seedance historique "toujours strip") :**

Quand `generate_audio: True` sur storyboard-to-video multi-shots, Seedance produit un **mix atmosphérique cohérent** (musique + SFX + rires/cris) déjà synchronisé frame-perfect aux événements visuels. Au lieu de stripper, **mixer sous la narration** :

- **Narration ElevenLabs** : volume 100% (piste principale, dominante)
- **Audio Seedance** (mix complet) : volume 30% (ambiance sous la voix)

**En Remotion** :
```tsx
<Audio src={narrationMp3} volume={1.0} />
<Audio src={seedanceAudioFromMp4} volume={0.30} />
```

**Ce qu'on garde "gratuitement" du mix Seedance** :
- SFX synchronisés aux frames (rire quand bouche s'ouvre, whoosh quand flèche vole, clash quand épées se touchent)
- Ambiance musicale contextuelle (tension, épique, contemplatif selon la scène)
- Cohérence atmosphérique avec le visuel

**On ne peut PAS séparer musique vs SFX** (Seedance retourne une piste unique mixée). Si l'audio global ne convient pas pour un segment → on mute cette piste et on fait le mix manuel à l'ancienne.

**Gain typique** : ~3-5h de post-prod audio économisées par Short (sourcing musique, placement SFX, EQ, mix).

**Ajustable dynamiquement par frame** avec la prop `volume` de Remotion (ducking automatique pendant les phrases fortes de la narration, par exemple).

**Règle Seedance 6 historique nuancée** : "toujours strip audio" reste vraie pour **clips mono-shot action pure** (audio rudimentaire, pas de valeur ajoutée). **FAUX pour storyboard-to-video multi-shot** où le mix est cohérent et utile.

Validé le 2026-04-13 sur Soundjata Acte V Segment A v2 (test keep-and-duck à 30% : narration claire, rire de Soumaoro audible, musique subtile, flèches whoosh bien placées). Aziz confirmé : "beaucoup meilleur que passer du temps à générer/placer manuellement".

### Règle 15 — "Mumble Sims-style" pour lip-sync (VALIDÉE 2026-04-14)

**Observation Acte VII Soundjata (griots contemplatif)** : même avec "no words, no music, no dialogue" en fin de prompt, Seedance produit un **marmonnement non-lexical façon Sims** quand un personnage chante/parle visuellement. Ce n'est pas un bug — c'est la solution propre de Seedance pour maintenir un lip-sync crédible sans inventer du français.

**Avantages** :
- Zéro risque de mot inventé qui brise l'immersion
- Lip-sync naturel (lèvres bougent, son modulé en intensité)
- Audible mais incompréhensible = parfait sous la narration à 30%

**Règle opérationnelle** :
- Pour scène de chant/parole visuelle (griot, discours, dialogue), garder `generate_audio: True` et appliquer keep-and-duck 30%
- Ne PAS essayer de forcer "absolutely silent mouth movement" dans le prompt — le résultat sera moins crédible que le mumble
- Le mumble Seedance est un atout, pas un défaut à contourner

### Règle 16 — Distinction couleurs sur plans serrés multi-personnages (VALIDÉE 2026-04-14)

**Observation Acte VII Soundjata** : shot OVER-THE-SHOULDER a donné une lecture ambiguë ("4ème personnage ?") parce que le **young griot** (boubou terracotta) et **l'épaule de l'elder au premier plan floutée** partageaient des tons terracotta proches. Aziz a eu un doute de lecture.

**Cause racine** : le storyboard et les char refs séparent bien les 3 personnages en plan large (indigo / terracotta / burgundy), mais sur plan serré OTS, les couleurs proches créent une confusion.

**Règle opérationnelle** :
- Pour TOUT plan multi-personnages serré (OTS, reverse shot, close-up à 2), vérifier que les **couleurs vestimentaires sont distinctement contrastées** (indigo vs terracotta vs burgundy = OK ; deux terracotta = confus)
- Si le storyboard prévoit un OTS entre 2 personnages : spécifier explicitement dans le prompt la couleur de chacun côté cadre
- À intégrer dans les futurs Visual Plans : "Color separation check" sur les plans serrés

### Règle 17 — 9 panels 3x3 validé en contemplatif (VALIDÉE 2026-04-14, NUANCÉE 2026-04-14 PM)

**Preuve en production initiale** : Acte VII Soundjata (griots transmission, 12s) — 9 panels 3x3 grid a produit un rythme dense et cinématographique sur une scène **contemplative**, pas seulement combat.

**Shots observés Acte VII** : WIDE ESTABLISHING → EXTREME CLOSE-UP HANDS → MEDIUM CLOSE → EXTREME CLOSE-UP EYES → LOW ANGLE → OVER-THE-SHOULDER → EXTREME CLOSE-UP EMBERS → MEDIUM (passation kora) → WIDE FINAL (feu seul) = 9 shots distincts, identités locked, kora rigide, transitions propres.

**NUANCE CRITIQUE 2026-04-14 PM (apprentissage Acte I Soundjata)** : 9 panels en 13s = 1.4s/plan = trop rapide pour scènes narratives à beats distincts. Aziz a confirmé que sur l'Acte I (3 sous-scènes : tyrannie/prophétie/handicap), 9 plans rendent la lecture confuse — le spectateur n'a pas le temps d'absorber chaque beat.

**Pourquoi Acte VII a marché** : c'était 9 plans pour beaucoup de **mouvement intime continu** (mains kora, yeux, transmission) dans UN seul beat émotionnel. Pas 9 plans pour 3 beats distincts.

**Règle corrigée — densité selon type de scène** :

| Type de scène | Densité plans | Ratio s/plan | Exemple |
|---------------|---------------|--------------|---------|
| Action/combat dense | **9 plans** en 12-15s | 1.3-1.7s | Combat, charge, impact (sakuga) |
| Narratif équilibré (multi-beats distincts) | **6-7 plans** en 12-15s | 1.7-2.5s | Setup avec sous-scènes (Acte I tyrannie/prophétie/handicap) |
| Contemplatif mono-beat continu | **9 plans** en 12s | 1.3s | Acte VII griots (transmission orale) |
| Contemplatif slow/lyrique | **4-5 plans** en 12-15s | 2.5-3.5s | Voyage, recueillement, attente |

**Question à poser AVANT de fixer la densité** : "Cette scène a-t-elle UN beat émotionnel continu (→ 9 plans OK) ou PLUSIEURS sous-scènes distinctes (→ 6-7 plans pour respiration) ?"

**Gabarit canonique** : public/assets/library/geoafrique/soundjata/combat-refs/storyboard-9panels-test.png (combat) + public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte7/storyboard.png (contemplatif mono-beat).

### Règle 18 — Refs personnages non transférables entre Actes (VALIDÉE 2026-04-14 PM)

**Erreur production Acte I Soundjata** : pour économiser $0.24, j'ai réutilisé les 3 refs griots de l'Acte VII (`elder/young/female.png`) pour les 3 griots de la "prophétie" Acte I. Aziz a immédiatement détecté la répétition visuelle : "pourquoi ces personnages reviennent ?". Le spectateur voit littéralement les MÊMES 3 personnes dans l'Acte I (XIIIe siècle prophétie) ET dans l'Acte VII (griots modernes 800 ans plus tard) — incohérence narrative.

**Règle opérationnelle** :
- **Réutilisation autorisée** uniquement pour le MÊME personnage canonique récurrent (ex: Soundjata adulte canon Acte IV/V/VI)
- **Réutilisation INTERDITE** pour des rôles différents même si visuellement similaires (ex: griots prophétie ≠ griots transmission moderne)
- **Coût d'éviter** : +$0.24 (3 refs supplémentaires) — négligeable
- **Coût d'oublier** : régen complet du clip ($4) + perte de cohérence narrative

**Cross-check obligatoire** dans tout Visual Plan : pour chaque ref personnage réutilisée d'un autre Acte, demander explicitement "est-ce le MÊME personnage narrativement, ou juste un personnage du même type ?". Si type seulement → créer un nouveau ref.

### Règle 19 — Refs personnages secondaires : période historique explicite (VALIDÉE 2026-04-14 PM)

**Erreur production Acte I Soundjata** : la ref `village-children-ref.png` a été générée avec brief "couleurs distinctes" mais SANS spécifier la période historique. Gemini a glissé vers des vêtements modernes (Aziz a détecté "petite fille avec chandail moderne"). Seedance a fidèlement reproduit l'anomalie.

**Règle opérationnelle pour TOUT ref personnage secondaire** (foule, enfants, villageois, soldats anonymes) :
- **Spécifier explicitement la période historique** : "13th century West African", "12th century Sahelian", etc.
- **Forcer l'absence d'éléments modernes** : "no modern garments, no t-shirts, no synthetic fabrics, no contemporary hairstyles"
- **Ancrer dans le tissu/style traditionnel** : "traditional handwoven cotton, indigo dye, cowrie shells, leather sandals"
- **Pour les enfants spécifiquement** : "wearing simple traditional tunics or wraps, NOT colorful modern children's clothing"

Cette règle s'ajoute à la règle distinction couleurs (règle 16) — les deux sont complémentaires, pas alternatives. Couleurs distinctes ✅ + Période historique ancrée ✅ = ref utilisable.

### Règle 20 — Densité panels selon contemplatif-multi-beats : 5-6 panels idéal (VALIDÉE 2026-04-16)

**Preuve Acte I Soundjata v2** : 6 panels en 12s = 2s/plan a produit un résultat cinematographique fort, mais Aziz observe que ça reste un peu rapide. 5 panels (2.4s/plan) aurait été plus confortable pour une scène narrative contemplative multi-beats.

**Règle raffinée (complète la règle 17)** :

| Type de scène | Densité optimale | Ratio s/plan |
|---------------|------------------|--------------|
| Narratif contemplatif multi-beats (setup, intro, conclusion) | **4-5 panels** | 2.4-3.0s/plan |
| Narratif équilibré multi-beats | **5-6 panels** | 2.0-2.5s/plan |
| Action dense / combat | **7-9 panels** | 1.3-1.7s/plan |
| Contemplatif mono-beat continu | **8-9 panels** | 1.3-1.5s/plan |

**Question à poser avant de fixer le nombre** : "Cette scène demande-t-elle à ce que le viewer **absorbe** chaque beat (→ moins de panels, plus de temps) ou à ce qu'il **ressente un flow** continu (→ plus de panels, rythme rapide) ?"

Pour les Shorts Héros Oubliés, la majorité des Actes narratifs multi-beats gagnent à être en **5 panels** plutôt que 6. Tester 5 panels par défaut sur les prochains Actes de setup/intro/conclusion.

### Règle 21 — Seedance extrait des mots du prompt pour lip-sync (DÉCOUVERTE 2026-04-16)

**Observation production Acte I Soundjata v2** : le mot "Soumaoro" apparaissait 3 fois dans le prompt texte (identity lock). Seedance a généré un shot avec bouche de griot parlant, et **l'audio généré inclut clairement le mot "Soumaoro"** vocalisé.

**Implication** : Seedance 2.0 ne se contente PAS de faire du "mumble Sims-style" (règle 15). Il **lit le prompt textuel** et **peut extraire des mots-clés pour les vocaliser** dans l'audio généré quand une bouche apparaît dans le shot.

**Applications possibles** :
- **Pour renforcer l'identité audio-visuelle** : mentionner les noms-clés (personnage, lieu) dans le prompt augmente la chance qu'ils apparaissent phonétiquement dans l'audio Seedance
- **Pour éviter les mots parasites** : si un nom est sensible (mauvaise prononciation, erreur historique), le retirer du prompt ou le remplacer par une description ("the sorcerer-king")
- **Compatible keep-and-duck** : même si Seedance vocalise un mot, on mixe à 30% sous la narration ElevenLabs, donc c'est un bonus texture pas un risque

**À tester** : si on veut que Seedance vocalise un cri de bataille ou un mot-clé narratif (ex: "Mansa !"), l'inclure dans le prompt augmente les chances. À valider sur un clip combat.

### Règle 22 — Storyboard + refs = inspiration, pas exécution littérale (INSIGHT STRATÉGIQUE 2026-04-16)

**Observation production Acte I Soundjata v2** : avec un prompt minimaliste (~215 mots) + 4 refs canons + storyboard 6 panels v5, Seedance a produit un clip qui **dévie significativement** du storyboard littéral :
- Panel 1 storyboard = village en ruines → Seedance a produit désert rouge vide
- Panel 3 storyboard = 3 griots autour d'un feu → Seedance a produit gros plan bouche de vieillard
- Panel 4 storyboard = Soumaoro sur autel rituel → Seedance a produit œil rouge mystique
- Panel 5 storyboard = Sogolon en cour extérieure → Seedance a produit hutte intérieure

**Malgré ces déviations, le résultat final est MEILLEUR** que le storyboard littéral sur le plan cinématographique (validé par Aziz).

**Insight stratégique** : Seedance 2.0 traite storyboard + refs comme **brief narratif et mood**, pas comme **plan d'exécution pixel-par-pixel**. Il fait ses propres choix esthétiques pour **comment** traduire chaque beat en langage vidéo.

**Implication workflow NUANCEE (mise a jour 2026-04-16 soir apres A/B test)** :

Seedance est un **collaborateur creatif** mais il a besoin de **direction proportionnelle a la complexite de la scene** :

- **Scene simple mono-beat** (1 lieu, 1 perso, ambiance continue) : prompt minimaliste, laisser Seedance interpreter. Fonctionne bien (Acte I v2, Acte VII griots).
- **Scene multi-contexte** (plusieurs lieux, changements de perso, transitions narratives) : prompt detaille shot-by-shot OBLIGATOIRE. Sans direction precise, Seedance invente son propre style (3D-ish), ses propres objets (couronne hallucinee), et ses propres transitions (morphing cheval). Prouve par 3 tentatives sur Acte IV Clip 1.

**Regle operationnelle** :
- **Charger le storyboard comme COMPOSITION GUIDE** (ordre et cadrage)
- **Charger les refs canons pour verrouiller les identites**
- **Adapter la densite du prompt a la complexite de la scene** (voir regle 14 mise a jour)
- **Toujours inclure les anti-artefacts explicites** : no morphing, RIGID/NON-DEFORMING, ALREADY dismounted, NO crown/scepter, clean hard CUTS only
- **Regen si** : identite drift majeur, style drift (3D vs flat BD), artefact physique (morphing, objet hallucine)

**Corollaire preserve** : quand Seedance surprend en bien, capturer les shots inventes comme nouvelles cartes a jouer pour les Actes futurs.

### Regle 24 — Storyboard = EXECUTION STRICTE, pas inspiration (VALIDEE 2026-04-18)

**Erreur production Acte II Soundjata v3** : le prompt disait "COMPOSITION GUIDE ONLY for shot order, framing, and timing" — Seedance a interprete "guide" comme "suggestion" et a devie librement (Sogolon a genoux au lieu de debout, figurants clones non prevus dans le storyboard, compositions inventees).

**Correction** : le prompt doit etre **directif et sans ambiguite** sur le suivi du storyboard. Remplacer "COMPOSITION GUIDE ONLY" par des clauses explicitement contraignantes :

```
Image 1 = storyboard layout. You MUST follow this storyboard EXACTLY:
- Animate PRECISELY what is drawn in each panel
- Do NOT add characters, poses, or compositions not shown in the storyboard
- Do NOT deviate from the framing, camera angle, or character positions in each panel
- Each panel = one shot, in reading order, with the EXACT same composition
```

**Pourquoi "COMPOSITION GUIDE ONLY" echouait** : le mot "guide" + "only" = Seedance comprend "utilise ceci comme inspiration mais tu es libre". Il faut des verbes imperatifs : MUST, EXACTLY, PRECISELY, DO NOT DEVIATE.

**Cout de l'erreur** : $2.70 + frustration. Regle 22 (Seedance = collaborateur creatif) reste vraie pour le prompt TEXTUEL, mais le storyboard IMAGE doit etre suivi a la lettre.

---

## Candidats Soundjata Short

| Acte | Durée | Plan actuel | Storyboard-technique ? |
|------|-------|-------------|------------------------|
| **V Kirina** | 21.7s | 2 clips (bataille + fuite Soumaoro) | **OUI — meilleur test** (3-4 plans dans 10-12s : charge → choc → duel → fuite) |
| **IV Exil et retour** | 16.4s | 2 clips | Oui candidat (départ → errance → retour) |
| II setup humiliation | 16.1s | 1 clip (setup avant insulte) | Non — plan unique |
| III baobab | ~10s dans Acte III | 1 clip | Non — plan unique |
| VII griots | 13.2s | 1 clip | Non — plan unique |

---

## Prompts Seedance testés à capturer ici (au fur et à mesure)

(À remplir après test Acte V Kirina)

- [ ] Prompt V1 + résultat
- [ ] Prompt V2 + résultat
- [ ] Verdict qualité vs clip-par-clip
- [ ] Coût comparatif (gens storyboard vs gens clips séparés)

---

## Règle 25 — Storyboard 2×2 → image-to-video : VALIDÉ en style illustration BD (2026-05-10, EXPÉRIMENTAL)

**Test réalisé** : storyboard 2×2 (4 panels, griot + kora + baobab, style illustration BD chaude) généré par Gemini → Seedance 2.0 image-to-video 10s.

**Résultats** :
- Seedance a traité les 4 panels comme des **beats séquentiels** (walk → arrive → prepare → play) — PAS comme une image statique à animer ✅
- Style flat 2D préservé à 100% sur 10s — aucun drift photoréaliste ✅
- Identité personnage stable (tunique ocre, bonnet, proportions) ✅
- Labels P1-P4 du storyboard NON reproduits dans la vidéo ✅
- Transitions entre panels : **fondus continus** (pas de coupes nettes) — pour scènes contemplatives c'est supérieur, plus naturel ✅
- Artefact : premier frame = image storyboard brute visible ~0.3s → couper avec ffmpeg `-ss 0.3` ou fade-in 8f dans Remotion

**Limite confirmée** :
- P3 et P4 fusionnés en un seul plan close-up — Seedance interpole deux beats proches en une animation continue
- Coupes nettes entre panels impossibles en image-to-video — pour micro-cuts durs → générer chaque panel séparément + assembler Remotion

**Statut : EXPÉRIMENTAL** — validé sur un test, nécessite d'autres tests avant adoption en production.

**Calcul densité panels validé** :
- 10s ÷ 3s min par panel = **3-4 panels max** pour scène contemplative
- 2×2 grid (4 panels) = sweet spot pour scènes calmes 8-10s
- Ne PAS faire 16 panels sur 10s = 0.6s/panel, trop rapide pour animer correctement

**Périmètre d'application (NON-NEGOTIABLE)** :

| Cas d'usage | Storyboard → i2v ? |
|-------------|-------------------|
| Héros Oubliés — scènes narratives personnages | **OUI** — validé |
| Atlas inserts — action impossible en SVG 2D | **OUI** — à tester |
| Souverain — scènes vidéo avec personnages (témoins, reconstitutions) | **OUI** — à tester |
| Souverain — cartes, données, overlays, textes animés | **NON** — Remotion pur, pas de Seedance |
| Souverain — Mapbox, D3-geo, graphiques | **NON** — Remotion pur |

**Prompt Seedance validé pour scène contemplative 4 panels** :
```
This image is a 2x2 storyboard grid with 4 panels. Treat each panel as an individual cinematic beat — NOT as one static image to animate. Follow the panel sequence exactly: top-left to top-right, then bottom-left to bottom-right.

PANEL P1 (top-left, seconds 0-2.5): [description beat 1]
PANEL P2 (top-right, seconds 2.5-5): [description beat 2]
PANEL P3 (bottom-left, seconds 5-7.5): [description beat 3]
PANEL P4 (bottom-right, seconds 7.5-10): [description beat 4]

STYLE LOCK — NON-NEGOTIABLE: Preserve the EXACT flat 2D illustration style of the storyboard image throughout. [palette]. Thick black outlines. 2D flat — NO 3D rendering, NO depth of field, NO volumetric lighting, NO photorealism. Do NOT drift from the flat style at any point.

CHARACTER LOCK: [personnage] must remain visually identical across all 4 beats — same face, same costume, same proportions. No deformation, no drift, no style change between panels.
```

**Assets test** :
- Storyboard : `/tmp/storyboard-seedance-test-v2.png`
- Vidéo résultat : `/tmp/seedance-storyboard-test-v1.mp4` (10s, 720p, seed 436715027, ~$6.83)

---

## Règle 26 — GPT Image 2 > Nano Banana 2/Pro pour générer le storyboard lui-même (CONFIRMÉ 3 sources 2026-07-02)

**Recherche Tavily + 3 transcripts YouTube (Creative Pad Media, Sebastian Torres, créateur anonyme parkour/detective — mai-juin 2026)** convergent : pour la génération de la **grille de storyboard** (pas l'animation, qui reste Seedance), **GPT Image 2 produit un rendu plus réaliste, plus contrasté, plus "punchy"** que Nano Banana Pro sur le même prompt exact, testé sur 5+ scènes différentes (astronaute, Nike commercial, perroquet Pixar, manga Sherlock Holmes, parkour). Nano Banana 2/Pro tend vers un rendu "un peu cartoonish".

**Nuance pour notre registre** : ce constat vient de storyboards **photoréalistes/cinématiques**. Pour notre style encre/stick-figure minimaliste (StickRig), l'inverse a déjà été observé une fois dans l'autre sens sur des tests antérieurs (Gemini a mieux tenu la discipline de style sur un ASSET ISOLÉ, GPT a mieux composé une SCÈNE À PLUSIEURS OBJETS — voir `STARTER-PROMPT-16x9-narratif-personnages.md`). **Pas de vainqueur universel : à re-tester sur notre registre spécifique avant de trancher.**

**Workflow standard confirmé par les 3 sources (converge avec règles 1-4 déjà documentées ici)** :
1. PDF/prompt-guide dédié uploadé à ChatGPT (ou prompt direct à GPT Image 2 / Nano Banana) → génère la grille de storyboard en 1 seul appel à partir de refs perso + description de scène courte (1 phrase suffit)
2. Chaque panel porte une **micro-description textuelle sous l'image** — réutilisée telle quelle comme brique de prompt Seedance ensuite (gain de temps direct)
3. Character sheet séparée obligatoire (déjà notre règle 1 ci-dessus) — sinon dérive de proportions entre générations
4. Prompt Seedance final = "generate a scene following the attached storyboard panel by panel" + tag `@image1` sur le storyboard + micro-descriptions par panel

## Règle 27 — Chaînage par extraction de dernière frame = vidéos longues 71-90s (NOUVELLE TECHNIQUE, 2026-07-02)

**Source** : tutoriel "long AI videos" (fight scene 44s + short film 71s), technique différente et complémentaire de la règle 25 (storyboard 2×2 → i2v direct) et du Video Extend déjà documenté dans `seedance-rules.md` règle 89.

**Principe** : pour une scène qui dépasse largement 15s (limite dure Seedance), au lieu de Video Extend (reference-to-video, qui redessine parfois le style) :
1. Générer un storyboard **large** (12 panels en grille 3×4 ou 4×3) qui raconte toute l'arc narratif
2. **Découper la grille par LIGNE** (pas le grid complet) : 4 panels = 1 génération Seedance de 15s. Un storyboard 12 panels = 3 lignes = 3 clips de 15s = 45s total
3. Chaque ligne cropée doit être **layée sur un fond 16:9 complet** avant upload (contrainte technique Higgsfield/Seedance pour accepter l'image en input)
4. Prompt = "generate a scene using the shots in the uploaded film storyboard" + timing par shot ("first four seconds: [description panel 1]...") en réutilisant les micro-descriptions déjà générées sous chaque panel
5. **Continuité inter-clips (le point clé)** : extraire la DERNIÈRE FRAME du clip N (via un frame extractor) → l'utiliser comme point de départ visuel explicite dans le prompt du clip N+1 ("starting from this image frame of...") — évite les sauts de continuité (ex: personnage en chokehold puis soudain libre)
6. **Pour étendre encore plus loin** : redonner à GPT Image 2 le storyboard complet précédent (comme ref) + character sheets + 1 phrase de continuation → génère "la page suivante" du storyboard (12 panels de plus). Répéter le découpage par ligne. Un créateur a atteint 90s ainsi (raccourci à 71s après montage pour retirer répétitions)

**Différence avec Video Extend (règle 89 `seedance-rules.md`)** : Video Extend réinjecte la vidéo elle-même comme ref (bon pour préserver le mouvement de caméra exact) ; cette technique réinjecte une IMAGE fixe (dernière frame) + un NOUVEAU storyboard textuel (bon pour changer de beat narratif tout en gardant la continuité visuelle). Les deux sont compatibles avec la règle "storyboard = exécution stricte" (règle 24) — préciser MUST/EXACTLY dans le prompt du clip suivant aussi.

**Limite observée** : scènes d'action denses (combat) = animer chaque ligne séparément produit de bons clips individuels mais des **transitions dures entre clips** si on ne fait pas l'extraction de dernière frame (ex: perso en chokehold dans clip 1 → soudain libre et en position de combat dans clip 2). La technique frame-extraction résout ça spécifiquement pour ce cas.

## Règle 28 — Édition d'un seul panel après coup = peu fiable, préférer régénérer tout le grid (CONFIRMÉ, 2026-07-02)

**3 sources convergent** : demander à GPT Image 2 / Nano Banana de modifier UN SEUL panel d'un storyboard déjà généré (via sélection de zone ou instruction textuelle ciblée) donne des résultats insatisfaisants la plupart du temps — soit rien ne change, soit trop change. **Exception qui marche** : demander de régénérer un panel entier en le décrivant comme différent d'un autre panel similaire (ex: "adjust shot 11 so it's not a repeat of shot 3" a fonctionné dans un cas).

**Règle opérationnelle** : si un seul panel déçoit → régénérer tout le storyboard avec une note additionnelle dans le prompt ("this looks too much like X, change it, also make the scene brighter" a marché). Si contrôle frame-parfait requis sur un panel isolé → upscaler ce panel séparément en standalone (Nano Banana Pro > GPT Image 2 pour l'upscale spécifiquement, inversion notable par rapport à la génération) puis l'éditer isolément.

---

## Règle 29 — Stick-figure encre minimaliste : style tenu, TIMING précis NON tenu (TESTÉ 2026-07-02)

**Premier test Seedance 2.0 sur notre registre stick-figure/encre 16:9** (jamais testé avant — seuls paper-craft Thiaroye et pixel-art Hannibal étaient documentés). Frame source : docker StickRig extrait de `PortDechargement16x9.tsx`. Test : bras droit qui doit se lever/tenir/redescendre selon un script `SECONDS 0-2 / 2-4 / 4-6 / 6-8 / 8-10` très explicite (clauses RIGID/NON-DEFORMING, un seul membre bouge, reste du corps et du décor figé).

**Résultat** :
- ✅ **STYLE FIDELITY parfaite** : silhouette fine, aplats, pas de détail ajouté, décor entier (grue, cargo, usine, oiseaux, soleil) resté 100% figé comme demandé — zéro dérive, zéro régénération de background. Le registre stick-figure minimaliste est donc VIABLE sur Seedance 2.0.
- ❌ **TIMING chronométré NON respecté** : le bras est monté puis redescendu bien avant les 6s prévues, puis reparti pour un second cycle de levée non scripté vers 7s. Seedance a traité les timecodes `SECONDS X TO Y` comme une indication de rythme général ("fais un geste de levée-tenue-descente"), pas comme un mapping frame-perfect.

**Confirme et durcit la règle 22/24 déjà documentée** : même avec des timecodes explicites et des clauses anti-ambiguïté fortes ("only the right arm moves", repère "clock hand from 6 to 12"), Seedance reste un collaborateur créatif sur le TIMING d'un geste — il exécute l'intention (lever le bras, le tenir, le redescendre) mais pas la partition seconde par seconde. **Implication pratique** : pour un besoin de synchronisation stricte avec un beat narratif/musical précis (ex: le bras doit être levé PILE à la seconde 5 pour matcher un impact sonore), Seedance i2v n'est PAS l'outil adapté sur notre registre — préférer l'animation SVG-main (StickRig, contrôle frame-exact déjà prouvé) et réserver Seedance aux plans où le timing exact du geste importe peu (ambiance, mouvement de fond, plan large).

**Ne disqualifie PAS Seedance pour notre registre** : le style tient, donc utilisable pour des plans où seule la NATURE du mouvement compte (ex: "le docker travaille", pas "le docker lève le bras à la seconde 5 exacte").

Assets test : `out/_r-and-d/16x9-narratif/seedance-i2v-test/docker-bras-controle-v1.mp4` (+ `.meta.json`), prompt complet dans le meta.

---

## Liens

- Post source (démo 10s) : https://x.com/voxelplot/status/2043645442597007721
- Règles Seedance générales : `memory/tools/seedance-rules.md` (appliquent toujours)
- Prompts Seedance généraux : `memory/tools/seedance-prompts.md`
- Recherche X API 30 jours (2026-05-10) : `/Users/clawdbot/Documents/Last30Days/seedance-2-0-storyboard-technique-panel-image-to-video-paper-raw.md`
- Recherche Tavily + transcripts YouTube (2026-07-02, règles 26-28) : Creative Pad Media "Seedance 2.0 + GPT 2 IMAGE Storyboard = Controlled Composition" (youtu.be/Xcx3N7H9ctU), créateur anonyme "AI storyboard to movie, Nano Banana 2 vs GPT Image 2" (youtu.be/7qBYe_VX_lE), tutoriel "long AI videos via storyboard grid" (youtu.be/KxRR8uiex_s). Transcripts sauvegardés `/private/tmp/claude-502/.../seedance-storyboard/*.txt`.
