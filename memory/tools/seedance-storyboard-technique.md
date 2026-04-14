# Seedance 2.0 — Technique Storyboard-to-Video

> Source : @voxelplot sur X, 2026-04-13 (thread "Seedance 2.0 — Série de Workflows Avancés, #7 Storyboard vers Vidéo")
> Démo archivée : `memory/tools/references/seedance-storyboard-voxelplot-demo.mov` (10s, anime combat hero vs phoenix)
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

## Liens

- Post source : https://x.com/voxelplot/status/2043645442597007721
- Démo locale : `memory/tools/references/seedance-storyboard-voxelplot-demo.mov`
- Règles Seedance générales : `memory/tools/seedance-rules.md` (appliquent toujours)
- Prompts Seedance généraux : `memory/tools/seedance-prompts.md`
