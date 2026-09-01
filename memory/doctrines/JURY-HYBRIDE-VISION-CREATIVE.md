# Workflow Jury AI Hybride — Vision créative pré-construction

> Migré depuis auto-memory le 2026-08-31, contenu original inchangé. ⚠️ Distinct de
> `tools/jury-3llms-api-gotchas.md` (gotchas techniques d'API pour évaluer visuellement des
> templates déjà codés) — ce fichier-ci est la MÉTHODOLOGIE du jury créatif en 2 passes, utilisé
> AVANT de coder les composants visuels. Les modèles/prix cités datent de 2026-05 et sont
> probablement périmés (cf. CLAUDE.md § modèles verrouillés) — le PATTERN (2 passes, structure de
> brief, synthèse) reste valide.

## Règle : étape Jury Hybride dans le pipeline Atlas (étape 7.5)

Apres l'etape 7 (Kimi creative pre-build sur les inserts existants), AVANT de continuer la construction visuelle, lancer un jury AI hybride de **3 LLMs differents** pour recueillir des visions creatives diversifiees.

## Pourquoi (vs jury defensif Peste 1347)

Le jury AI a 2 modes distincts :

| Mode | Question posee | Quand utiliser |
|------|---------------|----------------|
| **Defensif (Peste 1347)** | "Que voyez-vous de mauvais dans ce script ?" | Validation textuelle, sensibilite, faits historiques |
| **Hybride creatif (Shaka Zulu 2026-05-02)** | "Si vous deviez construire cette video, comment vous y prendriez-vous ?" | Vision creative pre-construction visuelle |

Le mode hybride est plus utile quand :
- Le script est deja verrouille (audio genere, ne sera pas regenere)
- On a un manifest visuel mais on n'a pas encore code les composants
- On veut diversifier les perspectives AVANT de s'engager sur un chemin

## Composition du jury (validee 2026-05-02, modèles à re-vérifier)

| LLM | Modele (a l'epoque) | Endpoint | Cout / appel ~9KB brief | Forces |
|-----|--------|----------|------------------------|--------|
| OpenAI | `gpt-4o` | `https://api.openai.com/v1/chat/completions` | ~$0.02 | Equilibre, prudence, structure narrative |
| xAI | `grok-4-fast` | `https://api.x.ai/v1/chat/completions` | ~$0.002 | Pragmatisme, alertes retention, audace |
| Google | `gemini-3-flash-preview` | `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` | ~$0.007 | Vision technique, optimisation Remotion |

**Cout total typique : ~$0.03** (largement sous tout cap raisonnable).

## Pieges a eviter sur les modeles (historique — verifier les modeles actuels avant tout appel)

- Toujours lister les modeles via API listing avant de coder un nom en dur (alias commerciaux vs noms API different souvent).
- Verifier org verification / disponibilite avant de lancer en production.

## Structure du brief (template)

Le brief markdown ~6-9 KB doit contenir :

1. **Contexte produit** (format, voix, style, audience, tonalite)
2. **Script integral** avec timestamps Forced Alignment
3. **Stack technique** : ce qu'on PEUT et NE PEUT PAS faire (precision indispensable)
4. **Etat actuel** : ce qui est VERROUILLE vs OUVERT
5. **Commentaires personnels du realisateur** (ce qui plait/inquiete Aziz)
6. **Reference philosophique** (pattern Mansa Moussa V2)
7. **5 questions** structurees :
   - Q1. Approche methodologique (par ou commencer ?)
   - Q2. Scene la plus risquee (et comment la securiser)
   - Q3. Pattern visuel recurrent (signature)
   - Q4. Idee creative concrete qu'on n'aurait pas pensee
   - Q5. Sensibilite historique / representation a eviter
8. **Format de reponse attendu** (template detaille)

## Synthese post-jury (obligatoire)

Apres reception des reponses, produire un fichier `JURY-SYNTHESE.md` :

1. **Notations globales** (note /10 par LLM)
2. **Alertes critiques** (les LLMs voient des risques que tu ne vois pas)
3. **Convergences** (3+ LLMs d'accord = signal fort, integrer obligatoirement)
4. **Idees uniques** (1 LLM seul mais forte valeur = a creuser)
5. **Top 5 idees a integrer** (toutes voix confondues, classees par priorite)
6. **Divergences** (notes pour reflexion future)
7. **Lecons workflow** (ce qui a marche, ce qui n'a pas, retours pour ameliorer le brief la prochaine fois)

## Pieges a eviter sur le mode hybride

- **Ne pas utiliser ce mode pour un script non verrouille.** Si le script bouge encore, les LLMs vont proposer des changements de script (perte de tokens). Le mode hybride est PRE-CONSTRUCTION VISUELLE, pas pre-ecriture.
- **Ne pas integrer toutes les idees.** 4 LLMs * 5 questions = 20 idees. Garder 5-7 max. La synthese sert a trier.
- **Verifier les modeles avant de lancer** (voir pieges plus haut).
- **Convergence != verite.** Si 3 LLMs sont d'accord mais qu'Aziz n'aime pas, son jugement creatif prime.

## Pipeline Atlas mis a jour

```
1. Script valide
2. Audio TTS ElevenLabs
3. ElevenLabs Forced Alignment
4. Whisper API (sous-titres karaoke)
5. timing.ts
6. <episode>-manifest.ts
7. Brief Kimi Creative + tri en vagues  (review inserts existants)
*** 7.5 NOUVEAU : Jury AI Hybride creatif PASS 1 (vision diversifiee) ***
*** 7.6 NOUVEAU : Jury AI Hybride creatif PASS 2 (validation lockdown) ***  ← apres tri Aziz
8. Generation assets vague 1
9. Composants Remotion vague 1
10. Mini-renders validation
11. Iterations vagues 2-3
12. Render final
```

## Pattern a 2 PASSES (valide 2026-05-02 sur Shaka Zulu)

Le jury hybride se fait en **deux temps distincts**, chacun avec un objectif different :

### PASS 1 — Vision diversifiee (creative)
- Brief : 5 questions methodologiques (par ou commencer, scene risquee, signature, idee creative, sensibilite)
- Objectif : recolter des perspectives DIVERSES et IDENTIFIER les angles morts
- Output : `JURY-SYNTHESE.md` avec convergences + divergences + idees uniques + Top 5
- Discussion avec realisateur (Aziz) : tri des idees, choix des priorites haute/moyenne, identification des limites du stack a interroger

### PASS 2 — Validation lockdown (operationnel)
**Declenche apres la discussion humain-Claude post-Pass 1.** A pour but de **verrouiller** une liste finale d'idees AVANT de coder.

Le brief Pass 2 contient :
1. **Liste verrouillee selectionnee** (5-8 idees priorite haute, 3-5 priorite moyenne)
2. **Stack precis disponible** (outils + couts + limites)
3. **Limites precises de Claude en SVG pur** (forces et faiblesses, pour eviter recommandations irrealistes)
4. **4 questions structurees** :
   - Q1. Validation idee par idee (oui / non / amendement + justification)
   - Q2. Implementation concrete par outil (decoupage : SVG / d3-geo / PixelLab / Gemini / Recraft pour chaque idee)
   - Q3. Question stylistique critique propre au projet (ex: transition cinematique → carte)
   - Q4. Gap detection (8e idee oubliee + pieges techniques anticipes)
5. **Consignes verrouillees** explicites ("audio + structure VERROUILLES, ne pas reproposer")

Output : `JURY-SYNTHESE-PASS2.md` + `VAGUE-X-LOCKED.md` (source de verite pour le code).

### Pourquoi 2 passes (pas 1 seule)

- **Pass 1 sans Pass 2** : on a la creativite mais pas la validation operationnelle. Risque : coder une idee qui parait bonne mais qui se heurte a une limite de l'agent ou du stack.
- **Pass 2 sans Pass 1** : on n'a pas explore l'espace creatif. Risque : verrouiller trop tot et passer a cote d'idees fortes.
- **Les deux** : creativite + validation = decisions robustes avec recettes techniques precises.

### Cout typique Pass 2

~$0.02-0.05 (brief plus court, reponses plus structurees). Largement sous tout cap raisonnable.

### Resultat concret Shaka Zulu Pass 2 (2026-05-02)

- Toutes les 7 idees priorite haute approuvees
- 3 amendements convergents identifies (cornes geometriques pures, deformation S4 sans Gemini, filtre grain papier transversal)
- 1 idee nouvelle ajoutee (animation typo 4 actes S2)
- 3 pieges techniques anticipes (perf d3-geo + filtres, fonts Google manquantes, PixelLab + raster overlay)
- Recettes techniques precises par outil pour chaque idee
- Cout : $0.0233 pour ~58s de calcul parallele 3 LLMs

## Premier cas d'usage : Atlas Shaka Zulu (2026-05-02)

- Brief : `memory/archive/episodes-livres/shaka-zulu/jury-brief-creative.md`
- Reponses : `memory/archive/episodes-livres/shaka-zulu/jury-reviews/`
- Synthese : `memory/archive/episodes-livres/shaka-zulu/JURY-SYNTHESE.md`

**Resultat :** 3 visions distinctes mais convergentes sur 4 points critiques (S4 risquee, cornes signature, cartes d3-geo essentielles, cartouches manquantes), 1 alerte critique format 150s qu'aucun de nous n'avait vu, et 4 idees uniques creatives (Voronoi, Echo Maternel, Blueprint, Conteur interactif).

## Why (incident concret)

Pendant la session Shaka Zulu, on n'avait que l'avis de Kimi (technique sur inserts) et le notre. On etait sur le point de continuer la construction sans realiser que :
- Le format 150s est probablement **trop long pour le Shorts Feed YouTube** (max 60s)
- Notre hook actuel manque d'impact viscereal en 3s (regle retention)
- On n'a pas encore code la vraie carte d3-geo qui est l'infrastructure visuelle critique

Sans le jury hybride, on aurait fini les 6 segments en gradient fake puis decouvert le probleme format en publication. Cout d'evitement : 10-20h de travail.
