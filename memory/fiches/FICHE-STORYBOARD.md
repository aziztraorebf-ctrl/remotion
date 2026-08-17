# STORYBOARD / BRIEF CRÉATIF — fiche de déclenchement (lire AVANT d'écrire un brief ou de coder une scène)
> **49 % de tout le code du projet est du RE-TRAVAIL** (audit 2026-08-17). Schéma dominant : coder toute une
> partie → découvrir le bon modèle → tout refondre. Cas mesuré : `Partie2Blocage.tsx`, **13 retouches en une
> journée**, commit « refonte premium complète sur modèle 2.4 validé » — le modèle validé est arrivé APRÈS le code.
> Le storyboard déplace le jugement de goût d'APRÈS le code (cher) vers AVANT le code (gratuit).
> ⚠️ Si ce que tu lis ici ne correspond PAS au réel sous tes yeux : **c'est la fiche qui a tort**. Corrige-la.
> Dernière vérification des chemins : 2026-08-17.

## L'ORDRE — ne jamais l'inverser
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
3 règles payées : (1) déclarer le HORS-SCOPE (« the base map is FIXED and untouchable ») sinon il critique le
fond de carte ; (2) exiger des NOMBRES (*« not "make it more vivid" but the actual values to type »*) ;
(3) ⛔⛔ **vérifier chaque gap contre nos décisions** — sur 4A, un gap HIGH proposait de faire passer l'AAGP
par le Sahara alors qu'il **est** côtier : erreur factuelle + cohérence de série cassée. Un gap plausible ≠ vrai.
⭐ Après tout appel comparatif, TOUJOURS proposer le 2e appel génératif (« comment on corrige, avec notre
arsenal ? ») — c'est lui qui produit la valeur actionnable (`memory/doctrines/DA-BRIEF-GATE.md` § PATTERN 2 APPELS).

## INTERDITS — erreurs déjà payées
⛔ **Coder avant validation de la direction.** Le modèle PROPOSE, Aziz valide, PUIS breakdown (prouvé 4×).
⛔ **1 image = 1 concept.** Un montage 3-concepts en 1024×1024 est illisible — et vérifier la résolution
RÉELLE reçue (`PIL Image.size`) avant de conclure à un échec de contenu.
⛔ **Un DA-brief textuel ne remplace pas un storyboard IMAGE** (rendu Acte 3 plat malgré un brief écrit soigné).
⛔ **Le breakdown TRANSCRIT, il ne CRÉE pas** — et le demander au MODÈLE QUI A GÉNÉRÉ L'IMAGE, pas à Claude
qui interprète (un breakdown écrit par Claude a réintroduit un widget HUD déjà interdit → code rejeté).
⚠️ La doctrine contient encore l'ANCIENNE méthode (« Claude écrit le breakdown ») AVANT sa correction — c'est
la version corrigée qui fait foi.
Avant d'écrire un breakdown : relire les DA-briefs déjà actés sur CE segment, `grep "VERDICT\|REJET"`.
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
