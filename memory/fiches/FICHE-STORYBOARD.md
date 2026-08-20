# STORYBOARD / BRIEF CRÉATIF — fiche de déclenchement (lire AVANT d'écrire un brief ou de coder une scène)
> **49 % de tout le code du projet est du RE-TRAVAIL** (audit 2026-08-17). Schéma dominant : coder toute une
> partie → découvrir le bon modèle → tout refondre. Cas mesuré : `Partie2Blocage.tsx`, **13 retouches en une
> journée**, commit « refonte premium complète sur modèle 2.4 validé » — le modèle validé est arrivé APRÈS le code.
> Le storyboard déplace le jugement de goût d'APRÈS le code (cher) vers AVANT le code (gratuit).
> ⚠️ Si ce que tu lis ici ne correspond PAS au réel sous tes yeux : **c'est la fiche qui a tort**. Corrige-la.
> Dernière vérification des chemins : 2026-08-18 (⚠️ § « méthode en vigueur » : décision non outillée, voir son encadré).

## L'ORDRE — ne jamais l'inverser
⚠️ **AVANT l'intention de scène, il y a la FORME NARRATIVE de la vidéo** (non déclarée = héritée par
défaut = documentaire explicatif). Chaîne : **SUJET → FORME NARRATIVE → script → intention de scène →
forme visuelle → MOTEUR → code**. 7 formes, **UNE SEULE par vidéo**. Gate `.claude/hooks/forme-narrative-gate.sh`
(**bloque en exit 2** un nouveau fichier de script sans ligne `FORME:`). Doctrine : `memory/doctrines/FORMES-NARRATIVES.md`.
⚠️ *Statut : gate ACTIF, coût pas encore mesuré (doctrine du 2026-08-17). Inscrit ici parce qu'un gate
bloquant sans fiche qui prévienne est précisément le mode d'échec que ce système corrige — à requalifier
en « règle payée » au premier blocage réel.*
**INTENTION (1 verbe : ce qu'on veut faire RESSENTIR) → FORME (le geste visuel) → ⛔MOTEUR → TEMPLATE.**
Partir du catalogue = le piège des ~10 essais (`memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md`). Le catalogue
(`src/projects/_shared/INTENTION-FORME-INDEX.md`) s'ouvre APRÈS l'intention, comme question binaire
« a-t-on déjà cette forme ? ». ⛔ **Lire les listes jusqu'au bout** : 3 agents sur 3 ont manqué la 5e entrée
d'une liste de 5.

⛔⛔ **L'étape MOTEUR ne se saute pas.** 6 registres : carte Mapbox · géométrie D3 · objet/métaphore SVG ·
acteur stick-figure · matière filmée H3 · **LE RACCORD/montage — on a le droit de QUITTER la carte, couper,
alterner**. Amplitude prouvée de chacun + les 8 trous : `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md`.
Coût de l'avoir sauté (2026-08-15, Gazoduc 4B) : storyboard entièrement en flèches/tracés — pas par manque
d'idées des modèles, mais parce que **le brief n'ouvrait aucune autre porte**. Un moteur absent du brief est
un moteur que le modèle ne proposera jamais. Gate : `.claude/hooks/moteur-visuel-gate.sh`.

## CADRER UN BRIEF — les 4 leviers
> Preuve : même beat, même modèle, 3 briefs. v1 → 6 panneaux de flèches. v2 → concepts **infaisables** (3D,
> perspective). v3 → 3 concepts originaux ET codables. Le modèle n'a pas changé, le brief si.
1. ⛔ **Ne JAMAIS écrire les concepts soi-même.** v1 contenait « OPTION A / OPTION B » rédigées par nous → les
   2 modèles ont **illustré** nos idées. Demander : *« propose 3 concepts DISTINCTS, dis lequel tu défends »*.
2. ⭐ **Montrer le MATÉRIAU réel, pas le nommer.** Dire « SVG » laisse imaginer de la 3D. Joindre une image
   DOUBLE : (A) frame de notre carte + (B) **frame d'un insert SVG de production réel**. Coût du manque :
   un mécanisme à biseaux métalliques auto-évalué « 100 % codable » — faux, repris sans vérifier.
   ⛔ Une note de faisabilité écrite par le modèle n'est PAS une faisabilité. Lister les interdits de matière.
3. ⭐⭐ **« Nomme LE geste unique par panneau »** (« le territoire se remplit », « le contour se déforme en
   barre »). *« Si un panneau demande trois gestes, il est trop cher : simplifie-le. »* Le coût devient visible
   sans demander au modèle de s'auto-évaluer — il se trompe systématiquement, dans le sens optimiste.
4. ⛔ **Contraindre le MATÉRIAU, jamais l'AMBITION.** Ne pas dire « fais simple » (→ images plates).
   **GUIDER SANS BRIDER** : exigence + arsenal (« voici ce qu'on sait faire, VA PLUS LOIN ») + interdits —
   jamais une checklist de techniques. Prouvé : les agents ont dépassé l'arsenal au lieu de le cocher.
⭐ La **frame de référence dicte la COMPOSITION**, pas que le style : joindre un insert composé → 6 panneaux
d'inserts. Poser un plafond chiffré (« AT MOST ONE composed insert in this ENTIRE beat »).
Gabarit prouvé : `memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/4B/PROMPT-storyboard-4B-v3.txt`.

## LA BOUCLE FERMÉE
`storyboard (N modèles concurrents)` → **validation Aziz** → `breakdown JSON` → `CODE` → **3e appel COMPARATIF**
→ corrections. Le code est le PREMIER BROUILLON, pas la fin. Gain mesuré (4A) : 13 écarts dont 6 majeurs,
activité visuelle 5,75 % → 10,28 % de pixels modifiés.
Recette : 5-6 frames aux ÉTATS du storyboard → planche 2×3 → image A/B verticale (cible en haut, rendu en bas)
→ `scripts/tools/openrouter-vision-breakdown.py --model openai/gpt-5.5`. Gabarit à copier tel quel :
`memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/PROMPT-comparatif-rendu-vs-storyboard.txt`.
⛔⛔ **4e règle (2026-08-18) — un rapport de gap CHIFFRÉ peut porter sur un objet qui n'aurait jamais
dû exister.** Vécu : Grok a classé **priorité 2/5** un gap sur la « tranchée », avec 8 valeurs chiffrées
(ratio 16.5x, `edgeNoiseAmplitude: 13.5 px`, `noiseFrequency: 0.042 km⁻¹`) — sur un objet supprimé le
jour même parce que le script n'en parle pas. Le modèle auditait fidèlement un storyboard déjà
contaminé par mon brief : **un gap peut être rigoureusement mesuré ET porter sur une erreur en amont.**
Un chiffre à 3 décimales sur un objet imaginaire coûte plus cher qu'une remarque vague — il
court-circuite le jugement.
→ Ne retenir que la **LECTURE D'ÉCART** (« le tracé occupe 5 % du cadre au lieu de 50 % ») ; jeter les
valeurs prescrites et re-dériver dans NOS unités (celles de Grok étaient des coordonnées Mapbox sur une
scène D3 — inapplicables). Et avant de trier : **vérifier que chaque gap porte sur un élément que le
SCRIPT justifie**. Un gap hors-script se supprime, il ne s'implémente pas.

3 règles payées : (1) déclarer le HORS-SCOPE (« the base map is FIXED and untouchable ») sinon il critique le
fond de carte ; (2) exiger des NOMBRES (*« not "make it more vivid" but the actual values to type »*) ;
(3) ⛔⛔ **vérifier chaque gap contre nos décisions** — sur 4A, un gap HIGH proposait de faire passer l'AAGP
par le Sahara alors qu'il **est** côtier : erreur factuelle + cohérence de série cassée. Un gap plausible ≠ vrai.
⭐ Après tout appel comparatif, TOUJOURS proposer le 2e appel génératif (« comment on corrige, avec notre
arsenal ? ») — c'est lui qui produit la valeur actionnable (`memory/doctrines/DA-BRIEF-GATE.md` § PATTERN 2 APPELS).

## ⛔⛔ LA MÉTHODE STORYBOARD — DÉCISION DU 2026-08-18 (✅ outillée le 18/08)

> **Statut** : décidée avec Aziz, testée à la main (Grok conforme · Gemini conforme mais a écrit des
> titres interdits · GPT inexploitable, 2 cases au lieu de 4). ✅ **OUTILLÉE le 2026-08-18** :
> `storyboard-dual-gen.py` lance les **3 dessinateurs** (`--models` défaut `gemini,gpt,grok`, `gen_grok`).
> ⛔ **Une ref passée en CLI n'est PAS une ref reçue par le modèle** : `gen_gpt` a ignoré `--ref` EN
> SILENCE (endpoint text-to-image pur) — on croyait briefer 2 modèles sur la même référence, seul
> Gemini la voyait. Corrigé (routage `edit-image` + `input_fidelity`). → **Après tout appel avec
> `--ref`, lire la console : chaque modèle doit annoncer ses refs** (`[gpt] … edit-image N ref`).
> ⚠️ Grok en mode `edits` : la ref **écrase le style demandé** — la présenter comme REGISTRE, pas
> comme modèle à copier. À requalifier en « règle payée » après un 2e test réel de la chaîne outillée.
> L'étape conception TEXTE (`storyboard-concepts-texte.py`, **Kimi inclus**) reste utile en amont.

### ⛔⛔ 1. AUDIT DU BRIEF PAR UN MODÈLE TIERS — OBLIGATOIRE (seule partie déjà payée)
Faire relire le brief par `openai/gpt-5.5`, consigne unique : *« détecte tout ce qui souffle une
réponse »*. Puis corriger. **Le levier « ne pas écrire les concepts soi-même » ne suffit pas** : un
VOCABULAIRE glissé dans les exemples suffit. Payé le 18/08 — `trench`, `it has started digging`,
`underground` dans mon brief → **3 modèles sur 4** ont proposé une tranchée, codée, rendue, jetée.
⚠️ `moteur-visuel-gate.sh` n'attrape PAS ce biais (il cherche « OPTION A/B », pas un lexique).
Autres biais trouvés par l'audit : citer le CONTENU des actes qui marchent · décrire le défaut actuel
en image (souffle l'image même en négatif) · sanctuariser l'existant (« validé, à garder ») · un mot
en CAPITALES.
⭐ Après réception : **grepper le brief avec les mots-clés des concepts reçus.** S'ils y sont, la
convergence est un ARTEFACT — pas un signal. Relancer avec un brief lavé.

### 2. LA FORME VISÉE
3 dessinateurs, 1 appel chacun, **2 concepts par planche** (3 → 12 cases sous 400 px = illisible) :
Grok `grok-imagine-image-2.0` (`/v1/images/generations`, 0,04 $) · GPT-image (fal.ai) · Gemini
flash-image (⛔ exige le tail anti-prose, voir § suivant). Kimi ne dessine pas : il reste en conception
texte. Le modèle **ne rédige pas** — il pose un liseré sur la rangée qu'il défend.
⭐ **Après le choix d'Aziz** : demander la description case-par-case **au modèle qui a dessiné** (jamais
l'écrire soi-même — c'est le biais du point 1), pour briefer ensuite le modèle SVG.

## ⛔⛔ LA DERNIÈRE LIGNE DU BRIEF DÉCIDE SI TU REÇOIS UNE IMAGE (prouvé 2026-08-17, 36 appels réels)


⛔ **CONCEVOIR et DESSINER sont 2 compétences — ne JAMAIS les demander au même appel.**
Un appel qui demande « les images **+ ton analyse écrite** » laisse le modèle choisir la sortie la
moins chère : Gemini écrit 8 000 caractères de markdown et 0 image ; GPT dessine une PAGE DE TEXTE
(vignettes à 120 px, titres corrompus « Lee routes croisées », « CONCEEPT », 3e concept hors cadre).

**Le tail décide, et il n'est PAS le même selon le modèle** (⚠️ le fix de l'un aggrave l'autre) :
- **Gemini image** — mesuré **1/6 → 3/3** en ne changeant QUE la dernière ligne. Il faut la négation
  explicite : `DELIVERABLE — GENERATE AN IMAGE (not a text description). […] Do not reply with prose.
  Output the image now.` Une formulation molle (« GENERATE THE STORYBOARD IMAGES NOW ») ne suffit pas : 1/4.
  ⚠️ Le constat « `responseModalities:["image"]` seul dégrade (`NO_IMAGE`, `parts=[]`) » datait du
  2026-08-17 et portait sur la variante *preview*, **modèle mort depuis**. ⛔ NON REPRODUIT sur le
  défaut actuel (Lite) : `["IMAGE"]`, `["image","text"]` et *aucun flag* renvoient tous 1 image
  (testé 2026-08-20). Le levier reste la DERNIÈRE LIGNE du brief, pas le flag.
  ⛔ Modèle : importer `IMAGE_MODEL` de `scripts/tools/gemini_models.py`, jamais en dur.
- **GPT image** — la corruption du texte est **proportionnelle à la quantité de texte demandée**.
  Réduit aux SEULS timecodes → « 0,0s » « 3,5s », zéro faute. Lui demander ses notes DANS l'image →
  le pire résultat mesuré. ⛔ Ne jamais lui faire écrire d'analyse dans une planche.
- **Contenu coupé au bord** : ajouter `Leave a clear empty margin of at least 5% on ALL FOUR sides —
  nothing may touch or be cut off by the edge.` (sans : coupé ; avec : propre).

⚠️ **Méthode en 2 temps — REMPLACÉE le 2026-08-18** (voir § LA MÉTHODE EN VIGUEUR ci-dessus ;
conservée pour mémoire, et parce que l'étape texte reste utile si on veut un avis de Kimi) — `scripts/tools/storyboard-concepts-texte.py` :
1. **CONCEPTION en TEXTE**, N modèles en parallèle → débloque **Kimi** (meilleure vision artistique)
   et **Grok** (instinct accroche), jusque-là exclus parce qu'ils ne dessinent pas. Chacun rend ses
   concepts + la **description case par case** du concept qu'il défend, prête à dessiner.
2. **CHOIX HUMAIN** (Aziz tranche) — ⛔ pas forcément le concept que le modèle défend.
3. **DESSIN** : 1 concept = 1 planche, 4 cases horizontales, **timecodes comme seul texte**.
   ⛔ Ne PAS faire 1 appel par case : le problème était la charge de TEXTE, pas le nombre de cases.

## INTERDITS — erreurs déjà payées
⛔ **Coder avant validation de la direction.** Le modèle PROPOSE, Aziz valide, PUIS breakdown (prouvé 4×).
⛔ **1 image = 1 concept.** Un montage 3-concepts en 1024×1024 est illisible — et vérifier la résolution
RÉELLE reçue (`PIL Image.size`) avant de conclure à un échec de contenu.
⛔ **`storyboard-dual-gen.py` perdait 2 images sur 3** (retour au 1er `inlineData` alors que Gemini en
renvoie souvent 3) et écrivait du **JPEG dans un `.png`** — corrigé le 2026-08-17. Si tu retrouves ce
motif ailleurs : boucler sur toutes les parts, écrire l'extension d'après les magic bytes.
⛔ **Un DA-brief textuel ne remplace pas un storyboard IMAGE** (rendu Acte 3 plat malgré un brief écrit soigné).
⛔ **Le breakdown TRANSCRIT, il ne CRÉE pas** — et le demander au MODÈLE QUI A GÉNÉRÉ L'IMAGE, pas à Claude
qui interprète (un breakdown écrit par Claude a réintroduit un widget HUD déjà interdit → code rejeté).
⚠️ La doctrine contient encore l'ANCIENNE méthode (« Claude écrit le breakdown ») AVANT sa correction — c'est
la version corrigée qui fait foi.
⛔⛔ **REPRENDRE un STORYBOARD/PLAN/breakdown HÉRITÉ : chercher son VERDICT DE REJET AVANT de le rendre
ou de le présenter.** `grep -n "VERDICT\|REJET\|ne PAS repartir\|rejeté"` sur le breakdown, le STATUS **et**
le doc de fusion de l'épisode. Un livrable dont le rejet est documenté ne se « vérifie » pas — il se
**refait depuis la source approuvée**. Vécu 2026-08-14 (Gazoduc Acte 3) : v3 rendue et présentée à Aziz
en la croyant à jour, alors que `BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md` contenait déjà « VERDICT AZIZ
— REJETÉ » avec les 3 défauts et « Ne PAS repartir du code v3 actuel ». Coût : 1 aller-retour complet +
un rendu invalide présenté. ⭐ Corollaire : un beat refait ne valide pas ses voisins — **un fichier n'est
jamais homogène en qualité**.
⛔ **Hériter d'une géo par continuité** : un texte sans relation spatiale réelle codé en carte = redite du beat
précédent, renommée. Aucune vérification technique ne détecte ça.
⛔ **Ajouter un geste pour « dépasser »** une référence éprouvée → confusion. Mieux EXÉCUTER le même geste.
⭐ Storyboard basse résolution → SVG premium : recadrer le panneau retenu, le renvoyer en référence avec
l'intention EN MOTS + corrections obligatoires + palette + groupes nommés. Prouvé 3× ; Fable 5 a gagné.
⭐ GPT Image 2 > Gemini pour le storyboard annoté (français propre, annotations caméra réalisateur,
panneaux numérotés). Encourager explicitement ces annotations, ne pas les traiter comme du bruit.

## SI UN CONCEPT EST REJETÉ 2×
**Seuil = 2 rejets sur le MÊME chantier** (pas au 1er jet). STOP, ne pas proposer une 3e variante soi-même :
Claude tourne en rond sur les mêmes idées. → skill **`creative-director-dual`** : 2 agents `creative-director`
en PARALLÈLE, brief strictement identique (script + historique des rejets + contraintes dures), **zéro
suggestion d'angle** de l'orchestrateur, chacun ignorant l'autre. Ils produisent des PROPOSITIONS, jamais du
code, et Aziz arbitre. Confirmé 2× (Sahel 2026-07-07 après 4 rejets ; Sénégal Short D3 2026-07-15).
Coût de ne pas l'avoir fait : 4 rejets.
