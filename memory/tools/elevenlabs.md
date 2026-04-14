# ElevenLabs TTS — Guide complet V3 GeoAfrique
> Mise a jour : 2026-04-12 (refonte complete — doc officielle + tests production)
> Modele actif : `eleven_v3`

---

## Voix actives — profils et regles par voix

| Role | Voice ID | Type | V3 compatible |
|------|----------|------|--------------|
| Narrateur GeoAfrique (principal) | `ICHuIqamER7XZMdm2HYC` | Voice Studio | Oui |
| Narratrice GeoAfrique | `Y8XqpS6sj6cx5cCTLp8a` | Voice Studio | Oui |
| Narrateur B3 | `12mpLi4ieFNVlQlAIJ3m` | Voice Studio | Oui |
| Stephyra | `QMNPncWXVcTVhJ9rDEQO` | PVC (clone) | NON — PVC non optimises V3, eviter |
| Soundjata Rivale - Matrone Froide | `5eScDXbqClEhrA46NN4r` | Voice Design V3 | Oui — femme africaine mature, voix Mandinka cutting, ideal pour antagonistes/epouses royales |

### Narrateur GeoAfrique — profil valide par test (2026-04-12)
- **Caracteristique** : voix grave, debit naturellement rapide
- **Pauses** : NECESSAIRES — ralentissent une voix qui se depêche. 4-6 pauses sur un script 54s est une bonne zone.
- **Audio tags** : fonctionnent et sont perceptibles. Emphase sur les mots cles confirme (ex: "qu'on TE cache" monte en affirmation, "quatre cents MILLIARDS" plus affirmatif/fier)
- **Tags recommandes** : `[solemn]`, `[tense]`, `[proud]`, `[awe]`, `[whispers]` pour la close
- **Speed** : 0.90 (ne pas descendre sous 0.88 — voix devient trop lente)
- **Verdict** : version enrichie (pauses + tags emotion) = clairement superieure a version pauses seules

### Narratrice GeoAfrique — profil valide par test (2026-04-12)
- **Caracteristique** : voix feminine, debit naturellement lent, deja expressive
- **Pauses** : NECESSAIRES mais courtes et rares — `[pause]` uniquement, jamais `[long pause]`
- **Placement ideal des pauses** :
  - Apres une revelation chiffree forte ("quatre cents milliards de dollars. [pause]")
  - Avant une question rhetorioue ("[pause] Mais qui a fait la traversee en premier ?")
  - PAS entre deux beats narratifs — la voix gere seule la transition
- **`[long pause]`** : a eviter — semble trop long avec cette voix lente
- **Audio tags** : fonctionnent tres bien, perceptibles. `[whispers]` confirme sur la close (voix baisse en chuchotement naturel)
- **Regle finale** : tags emotion + pauses minimalistes bien placees = meilleur resultat
- **Speed** : 0.92 (leger accelerateur pour compenser le debit naturel lent)

---

## Parametres actifs (valides par experience)

```python
{
    "model_id": "eleven_v3",
    "voice_settings": {
        "stability": 0.30,       # Mode Creative — repond aux audio tags
        "similarity_boost": 0.75,
        "style": 0.25,           # Monter a 0.35-0.40 pour passages tres dramatiques
        "speed": 0.90,           # Defaut. Ajuster par segment (voir tableau ci-dessous)
    },
    "output_format": "mp3_44100_128",
}
```

### Stability — parametre LE PLUS IMPORTANT en V3

| Valeur | Mode | Effet |
|--------|------|-------|
| 0.20-0.35 | Creative | Expressif, repond parfaitement aux audio tags — notre zone |
| 0.40-0.55 | Natural | Equilibre, fidele a la voix, moins reactif aux tags |
| 0.70+ | Robust | Stable mais SOURD aux audio tags — a eviter |

**Regle absolue** : rester entre 0.25-0.35. Au-dela, les audio tags perdent leur effet.

### Speed par type de segment

| Segment | Speed | Raison |
|---------|-------|--------|
| Hook / accroche | 0.88-0.90 | Tension, rythme soutenu |
| Corps narratif | 0.90-0.92 | Clair, pose |
| Moments dramatiques | 0.82-0.85 | Laisser respirer |
| Dialogue | 0.85 | Naturel, humain |
| CTA final | 0.88 | Direct, net |

---

## Audio Tags V3 — Systeme complet

**Principe** : tags entre crochets places JUSTE AVANT le mot ou la phrase a affecter.
**Volume** : 40+ tags officiels, ~1450 variants reconnus.
**SSML** : NON supporte en V3. Pas de `<break time="1s"/>`. Utiliser les tags ci-dessous.

### Emotions & ton

```
[sorrowful]      — tristesse profonde, deuil
[awe]            — admiration, reverence
[excited]        — enthousiasme
[tired]          — fatigue, epuisement
[sarcastic]      — ironie
[curious]        — questionnement
[dramatic tone]  — ton dramatique general
[tense]          — tension narrative
[solemn]         — solennel, grave
[proud]          — fierte
[melancholic]    — melancolie douce
```

### Livraison vocale

```
[whispers]    — chuchotement (puissant pour closes intimes)
[quietly]     — voix basse sans chuchoter
[calm]        — apaisant, pose
[shouting]    — cri (parcimonie)
```

### Sons non-verbaux (inserer dans le script)

```
[sighs]                — soupire (bon avant une revelation)
[takes a deep breath]  — souffle avant moment fort
[inhales sharply]      — surprise, choc
[exhales]              — relachement de tension
[clears throat]        — transition naturelle
[laughs]               — rit
```

### Pauses et rythme

```
[pause]       — pause naturelle (~0.5s)
[short pause] — micro-pause (~0.2s)
[long pause]  — pause dramatique (~1s+)
```

**REGLE VALIDEE PAR TEST (2026-04-12) — pauses minimalistes + tags emotion**

Formule optimale : audio tags de couleur + pauses courtes placees aux bons moments.
Les pauses sont des signaux narratifs, pas des outils de rythme general.

| Tag | Quand | Notes |
|-----|-------|-------|
| `[pause]` | Apres revelation chiffree forte, avant question rhetorioue | Max 2-4 selon voix |
| `[long pause]` | A EVITER avec les deux voix GeoAfrique | Semble trop long |
| `[short pause]` | Micro-transition legere | Possible si necessaire |
| Retour a la ligne seul | Transition entre beats | Standard (libre) |
| Em-dash `—` | Rythme interne d'une phrase | Libre |

**Placements confirmes qui fonctionnent :**
- Apres un chiffre fort : "Quatre cents MILLIARDS de dollars. [pause]"
- Avant une question rhetorioue : "[pause] Mais qui a fait la traversee en premier ?"
- Avant la close chuchotee : "[pause] [whispers] Et pourtant..."

**Ce qui enrichit sans ralentir** : tags emotion/ton — zero duree ajoutee.
`[solemn]`, `[tense]`, `[proud]`, `[awe]`, `[whispers]` tous confirmes perceptibles.

### Tags combinables (stacking)

```
[sad][whispers]          — chuchotement melancolique
[awe][quietly]           — admiration reverentielle
[solemn][dramatic tone]  — ton grave et theatral
[tense][quietly]         — tension chuchotee
```

---

## Arsenal de techniques de script

### 1. Audio tags (V3 natif) — a privilegier
```
"En treize cent onze, [pause] un homme abdique son trone.
[long pause]
[whispers] Et pourtant — l'histoire a presque oublie son nom."
```

### 2. Retours a la ligne = pauses longues (tres fiable)
Un blanc entre deux paragraphes = pause longue naturelle.
Deux blancs = tres longue pause.
```
"Il ne reviendra jamais.

Cent quatre-vingt-un ans plus tard, Christophe Colomb traverse le meme ocean."
```

### 3. Em-dash = pause courte naturelle
```
"Il abdique. Il quitte son trone — son or — son pouvoir."
```
Double `— —` = pause plus longue.

### 4. Ellipses = hesitation, respiration
```
"Mais... qui a fait la traversee en premier ?"
```

### 5. Majuscules = emphase (V3 les supporte — ancienne regle "interdites" = obsolete)
```
"Ce n'est PAS ce que l'histoire officielle raconte."
"Il a ABDIQUE son trone."
"Quatre cents MILLIARDS de dollars."
```
Note : en V3, les majuscules sont un outil d'emphase valide. L'ancienne regle
"majuscules interdites" s'appliquait a des modeles anterieurs.

### 6. Dialogue tags dans le texte
```
"— L'empire est a toi, Moussa, dit-il calmement."
```
Le modele lit "dit-il calmement" comme indication de jeu — effet subtil mais reel.

### 7. Deuxieme personne pour les closes = ton plus intime
```
"L'Afrique a une histoire qu'on TE cache."   # Plus fort que "qu'on lui cache"
"Et c'est son nom que TU retiens."
```

---

## Regles francais (NON-NEGOTIABLE — scanner AVANT chaque script)

| Interdit | Correction |
|---------|-----------|
| Participes en "e/ee" fin de groupe : "terrifie", "obsede", "racontee" | Verbe conjugue : "la terreur le saisit", "qu'on te cache" |
| "ont + voyelle" : "ont accosté" | Passe simple : "firent escale" |
| Chiffres : "1311", "2000", "181" | Lettres : "treize cent onze", "deux mille", "cent quatre-vingt-un" |
| Noms de villes avec "s" final | Ecrire phonetiquement si necessaire |
| Accents manquants : "hante" sans accent | Toujours ecrire les accents dans le script Python |

**Scan obligatoire** : lister TOUS les mots en "e/ee" avant generation, verifier un par un.

---

## Template de script GeoAfrique (structure type annotee V3)

```
[HOOK — tension immediate]
En [date en lettres], [situation impossible]. [pause] Personne n'ose [action]. [pause] Sauf un homme.

[pause]

[PROTAGONIST — identite puissante]
[Nom]. [Titre]. [Pouvoir en chiffres en lettres]. [pause] Mais [faille/obsession].

[pause]

[ACTE 1 — escalade]
[takes a deep breath] Il [action audacieuse]. [pause] [Obstacle]. [pause] [Reaction inattendue].

[pause]

[PIVOT — decision irreversible]
[Nom] ne recule pas. [pause] Il [sacrifice]. [pause] [Consequence immediate].

[pause]

[ACTE 2 — consequence historique]
[Successeur/contexte]. [pause] [Contraste saisissant en majuscules sur le mot cle].

[pause]

[RECONTEXTUALISATION — la pique]
[Comparaison temporelle]. [pause] Et c'est [autre nom] que le monde retient.

[pause]

[CLOSE — intime, deuxieme personne]
[whispers] Et pourtant — l'histoire a presque oublie son nom.
L'Afrique a une histoire qu'on TE cache. [pause] Pour en savoir plus, le lien est en bio.
```

---

## Checklist avant generation

- [ ] Aucun participe passe en "e/ee" en fin de groupe
- [ ] Aucun "ont + voyelle"
- [ ] Tous les chiffres en lettres
- [ ] Audio tags places AVANT le mot/phrase (pas apres)
- [ ] Stability entre 0.25-0.35 (sinon tags ignores)
- [ ] Speed ajuste par segment (pas un seul speed pour tout)
- [ ] Voix = Voice Studio (pas PVC Stephyra)
- [ ] Accents ecrits dans le script Python
- [ ] Test sur segment court avant generation complete
