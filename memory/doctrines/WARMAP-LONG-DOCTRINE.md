# Doctrine War-Map Long Format (5-7min)

> **Lock 2026-06-06.** Nouveau genre validé lors de la session AES/Sahel.
> Distinct de Souverain Mid-form (alterne map/data-viz) et de War-Map Short (9:16, 60-90s).
> Format : 16:9, 5-7min, carte permanente à l'écran, overlays semi-transparents.
> Référence script : `memory/episodes/warmap-sahel/SCRIPT-V3-FINAL-2026-06-06.md`

---

## Positionnement — Ce que ce format est (et n'est pas)

**Ce que c'est :**
- Un format analytique géopolitique long — entre Al Jazeera English explainer et war-map cartographique
- Public : africain engagé + international curieux, connaît vaguement le sujet, veut le cadre interprétatif
- Ton : réalisme stratégique sobre — jamais partisan, jamais "HUMILIE/SHOCKS"
- Référent BBC Afrique x33 : sobre + factuel + question ouverte = performance maximale

**Ce que ce n'est pas :**
- Souverain Mid-form : qui alterne carte et data-viz plein écran
- War-Map Short : qui est 9:16, 60-90s, action pure
- Atlas : qui est narratif historique avec personnages
- Script César ou Médiéval Mindset : structures de compression pour Shorts

---

## La règle fondamentale — La carte ne disparaît jamais

La carte est l'ancre visuelle permanente. Elle est à l'écran du début à la fin.

Les données viennent à la carte. La carte ne va jamais aux données.

**Pourquoi :** le cerveau développe une relation spatiale avec la carte au fil de la vidéo. Chaque coupure vers un plein écran data-viz rompt cette relation. Le viewer doit reconstruire mentalement où il était sur la carte. C'est une friction invisible mais réelle qui érode la rétention.

**Ce que font les war-maps à haute rétention (Ollie Bye, Al Jazeera carto) :** la carte ne quitte jamais l'écran. Les informations sont des calques sur la carte, pas des remplacements.

> ⭐ **Règles overlay/plein écran : voir WARMAP-GRAMMAIRE.md sections 2, 6, 9 (source de vérité, prime sur ce fichier).**

---

## Structure en 5 actes (5-7min)

| Acte | Durée | Rôle | Régime audio-visuel dominant |
|---|---|---|---|
| **1 — Rupture** | 0:00-0:55 | Anomalie + question centrale + contexte carte | Question posée, carte s'active |
| **2 — Blocage** | 0:55-2:35 | Mécanisme causal profond — pourquoi ça a échoué | Dense, overlays N2 fréquents, slow drift |
| **3 — Épreuve terrain** | 2:35-4:05 | Événement clé sur la carte — symbole concret | War-map pur, flèches, zoom tactique |
| **4 — Coût réel** | 4:05-5:00 | Populations + ressources — qui paie, qui tient | Overlays N3 humanitaires, respiration |
| **5 — Perspective** | 5:00-5:25 | Question ouverte — pas de verdict | Dézoom, carte globale, silence |

---

## RÈGLE ABSOLUE — Script-first avant tout code (NON-NEGOTIABLE)

**Avant de coder TOUTE scène, TOUT acte, TOUT effet visuel :**

1. **Ouvrir le script visuel** (`SCRIPT-VX-FINAL.md` de l'épisode)
2. **Lire la section correspondante phrase par phrase**
3. **Lister les événements visuels attendus** (pays qui s'allume, overlay qui apparaît, sprite qui entre)
4. **Mapper chaque événement sur un trigger frame** (depuis `TIMING-V1.md` ou le forced alignment)
5. **Coder SEULEMENT ce qui est dans le script** — jamais interpoler ou "compléter" de mémoire

**Erreur mortelle :** partir du pattern Sudan/engine existant et "adapter" en espérant que le comportement global correspond. Le résultat : un hook de 10 secondes complètement vide alors que le script demande 7 événements visuels précis.

**Format de traçabilité obligatoire dans le code :**
```typescript
// SCRIPT: "Ils ont expulsé leurs partenaires militaires."
// VISUEL: Mali s'allume en blanc → frame ~240 (trigger depuis TIMING-V1)
```

Chaque bloc de code visuel doit tracer sa source au script. S'il n'y a pas de ligne de script correspondante — le code ne doit pas exister.

---

## Le hook — Structure obligatoire

Le hook d'un War-Map Long doit combiner deux canaux simultanément :

**Audio (Option A — contradiction chiffrée) :**
> [Chiffre d'investissement/présence] + [résultat inverse] + [promesse narrative]
> Exemple : "5 500 soldats, dix ans, deux milliards par an. Les groupes armés contrôlent plus de territoire qu'au départ. Ce n'est pas un échec de plus — c'est la rupture qui a tout déclenché."

**Visuel (Option C — carte qui s'étend) :**
> La carte montre l'expansion de la zone de conflit en temps réel pendant que l'audio pose les chiffres.

Les deux canaux se renforcent. L'audio pose le paradoxe, le visuel le prouve géographiquement.

**Cible de rétention à 30 secondes :** >70%. Si le hook ne crée pas de réaction ("attends, quoi ?") dans les 10 premières secondes — réécrire.

---

## Trois régimes audio-visuel — Reconnaître et choisir

**Régime 2 — Complémentarité (cible permanente)**
La voix dit A, le visuel montre B qui prouve ou amplifie A.
→ "La zone rouge s'étend" + la carte s'étend réellement.
→ Rétention maximale. Viser ce régime sur 70%+ de la vidéo.

**Régime 1 — Redondance (à éviter)**
Le visuel montre exactement ce que la voix dit.
→ "La France envoie des soldats" + image de soldats.
→ Le cerveau traite deux fois la même information. Ennui.

**Régime 3 — Compétition (danger)**
Le visuel est si complexe qu'il capte toute l'attention au détriment de l'audio. Ou l'audio est si dense que le viewer arrête de regarder la carte.
→ Passages analytiques abstraits (accords diplomatiques, mécanismes économiques) sans ancrage visuel.
→ Résoudre avec overlay N2 synchronisé ou slow drift.

---

## Règles de mouvement caméra pendant overlays

| Moment | Mouvement carte | Pourquoi |
|---|---|---|
| Overlay N2 informatif | Slow drift continu | La carte vit, ne compete pas avec le chiffre |
| Overlay N3 humanitaire | Figée 2-3s max, puis slow drift | Le viewer lit le chiffre, puis la carte reprend |
| Passage abstrait sans overlay | Slow zoom très lent (10-15s pour 10%) | L'œil est occupé sans décoder |
| Acte de terrain (flèches, offensive) | Zoom tactique dynamique | La carte EST l'action |
| Question finale | Dézoom lent vers vue globale | Respiration + ouverture |

---

## Différences avec Souverain Mid-form

| Critère | Souverain Mid-form | War-Map Long |
|---|---|---|
| Carte | 40-50% du temps | 100% du temps |
| Data-viz | 25-30% plein écran | Overlays sur carte uniquement |
| Public | Grand public, ne connaît pas | Engagé, connaît vaguement |
| Ton | Macro-économique analytique | Géopolitique réalisme stratégique |
| Structure | 4 actes | 5 actes |
| Hook | Chiffre choc + question | Contradiction + carte qui prouve |
| Transitions | Changement visuel marqué | Zoom/dézoom dans la même carte |

---

## Niveau de langage

Grade 10-11 obligatoire. Voir `SCRIPT-ORAL-DOCTRINE.md` pour les règles complètes.

Spécificités War-Map Long :
- Vocabulaire géopolitique autorisé si tampleté (JNIM, CEDEAO, CSP...)
- Vocabulaire militaire sobre autorisé (offensive, positions, reconquête)
- Interdit : jargon universitaire, constructions nominales abstraites, "acteur", "dynamique", "paradigme"

---

## Checklist avant audio lock (War-Map Long)

**Script :**
- [ ] Anomalie + contradiction dans les 10 premières secondes
- [ ] Question centrale posée avant 0:20
- [ ] Tous les acronymes tamponnés au premier passage
- [ ] Phrase de liaison entre chaque acte
- [ ] Aucune phrase > 22 mots
- [ ] Chiffres clés : 6-8 max sur tout le script

**Synchronisation audio-visuelle :**
- [ ] Chaque lieu cité = point qui s'allume sur la carte au mot exact
- [ ] Chaque overlay N2 placé sur la phrase exacte qu'il illustre
- [ ] Aucun passage abstrait > 30s sans overlay ou mouvement caméra
- [ ] La carte ne disparaît jamais

**Ton :**
- [ ] Zéro terme partisan ("jante" → "transition militaire", "coup" → "basculement")
- [ ] Multi-perspective explicite : au moins 2 lectures factuelles sur les événements clés
- [ ] Question finale ouverte — pas de verdict

---

## Pipeline production War-Map Long

1. **Recherche OSINT** — ACLED/UCDP/ISW + web + fact-check (`WARMAP-RESEARCH-PLAYBOOK.md`)
2. **Données JSON** — schema canonique `sahel.warmap.json`
3. **Script V1** — draft libre, fond analytique
4. **Jury LLM** — perspective africaine + biais géopolitique (session séparée)
5. **Script V2** — corrections jury
6. **Script V3-final** — toutes corrections : hook, liaisons, tampons, grade 10-11, synchro audio-visuelle
7. **Fact-check Perplexity** — tous les chiffres avant audio lock
8. **Audio ElevenLabs** — GéoAfrique V2, règles TTS françaises
9. **Code WarMapEngine** — moteur Sahel à partir de Sudan comme base
10. **Render + review**

---

## Référence script canonique — À IMITER (lock 2026-06-07)

**`memory/episodes/warmap-sahel/SCRIPT-V4-FINAL-2026-06-07.md`** — référence obligatoire pour tout nouveau script War-Map Long.

Ce script est la référence canonique à imiter sur :
- **Ton** : réalisme stratégique sobre, jamais partisan, multi-perspective explicite (France = intérêts nommés + Moura documenté + CFA posé comme question ouverte)
- **Style oral** : grade 10-11 appliqué — phrases ≤22 mots, "et alors?" visible entre chaque, constructions verbales avec sujet, tampons sur tous les acronymes (JNIM, EIGS, FAMa, CSP, MINUSMA, Africa Corps, CEDEAO, Liptako-Gourma)
- **Structure 5 actes** : Rupture (anomalie+question <20s) → Blocage (causal dense) → Épreuve terrain (war-map pur, Kidal) → Coût réel (populations+ressources) → Perspective (question ouverte, pas de verdict)
- **Hook validé** : Option C visuel (carte s'étend + flammes) + Option A audio ("cinq mille cinq cents soldats, dix ans, près d'un milliard par an. Les groupes armés contrôlent plus de territoire qu'au départ.")
- **Synchro audio-visuelle précise** : chaque lieu allumé au mot exact prononcé (Djibo/Ménaka/Tillabéri séquentiels, Kidal au mot "flotte", Gao/Ménaka/Niamey séquentiels pour bases militaires), sprites chars JNIM/EIGS/FAMa/CSP, drapeau malien au mot exact, silhouettes réfugiés au mot exact
- **Perspective africaine** : intérêts nommés sans hiérarchisation morale, populations comme sujets (noms de villes), "elle appartient aux Sahéliens" final non-commenté
- **Chiffres fact-checkés** : 5 corrections appliquées (Moura cinq jours, budget Barkhane ~1Md€/an, uranium "fournissait une part significative", 3 millions déplacés, 18 millions insécurité alimentaire)

**Pour démarrer un nouveau script War-Map Long :** lire ce fichier complet AVANT de rédiger. Puis appliquer la structure 5 actes + checklist ci-dessus.

---

## ⭐ BLUEPRINT VISUEL — dérivé de l'Acte 1 Sahel (validé Aziz 2026-06-08)

> L'Acte 1 Sahel (`SahelActe1-Final`, render `acte1-FINAL.mp4`, catbox `6zixyj`) est la
> **RÉFÉRENCE DE STYLE** de la série. Toutes les briques ci-dessous sont codées en
> `acte1Final` dans `SahelWarMapEngine.tsx` et à REPORTER sur les Actes 2-5.
> Validé par downstream DA-brief (Gemini+Kimi convergents) : ce sont les "piliers signature".

**SIGNATURE À REPORTER (ne pas réinventer) :**
1. **Grammaire "voix nomme → zone pulse"** : quand la narration nomme un territoire, sa
   silhouette admin-1 s'embrase 2-3s (contour + glow couleur faction) puis s'apaise.
   Table `A1_REGION_PULSES` (trigger forced-align + regions[] + faction). Carte cognitive immédiate.
   ⚠️ HIÉRARCHISER sur 5 actes (sinon lassitude) : lieu mineur = surbrillance contour 1s ;
   région majeure = contour + glow interne 2-3s.
2. **Timeline graduée glissante** (bas-écran) : curseur continu sur axe temporel de l'acte,
   année sur le curseur, encoches aux événements qui FLASHENT au passage du curseur.
   Remplace tout compteur de date précise (qui "saute" = confusion). Position remontée →
   source préservée dessous. Adapter AX_Y0/AX_Y1 + encoches par acte.
3. **Jetons-combattants incarnés** : cercle parchemin + bordure faction + silhouette hachurée +
   ombre portée (flottent au-dessus = "plateau d'état-major"). Différenciés par PERSONNAGE.
   Taches d'influence = `blobPath` (organic JNIM / angular EIGS), clippées au front (anti muddy-overlap).
4. **Couple vignette cinéma + grain papier** (overlays SVG plein écran) = "état-major premium,
   distingue de Google Maps". + respiration finale (assombrissement de suspension entre actes).
5. **Légende factions** (haut-gauche) permanente. **Hiérarchie frontières** : contour national
   épais (source `sahel-countries` dissoute) + régions internes discrètes (opacity 0.30).

**CONSEILS ACTE 2+ (DA-brief, à appliquer) :**
- **Règle "Fade to Background"** : tout élément qui n'est plus le sujet de la voix >5s → opacité ~40%.
  La carte se remplit vite (bases, Kidal, réfugiés, ressources) → gestion du vide = arme anti-chaos.
- **Nouveaux registres pour ne pas faire "5× le même acte"** : formes géométriques statiques
  (carrés/hexagones) pour infrastructures FIXES (bases, Kidal) ≠ jetons ronds mobiles ;
  flèches `stroke-dasharray` animées pour FLUX réfugiés ≠ zones de couleur ;
  "suture" SVG englobante pour naissance AES (inverse de la fissure CEDEAO).
- ⚠️ Gemini HALLUCINE sur les frames downscalées (a cru voir des cercles parfaits = c'étaient
  des blobPath organiques). Toujours VÉRIFIER dans le code avant d'appliquer un fix DA.

---

## Références internes

- `memory/doctrines/WARMAP-PLAYBOOK.md` — doctrine design war-map (briques, R1-R6)
- `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` — doctrine données OSINT
- `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` — règles script oral grade 10-11
- `src/projects/warmap/WARMAP-INDEX.md` — point d'entrée code
- `memory/episodes/warmap-sahel/SCRIPT-V4-FINAL-2026-06-07.md` — **RÉFÉRENCE CANONIQUE** (remplace V3-FINAL)
