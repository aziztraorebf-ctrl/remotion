# Soundjata — Plan de production (version finale)

> Derive de `timing-soundjata.ts` (2026-04-12)
> Audio de reference : `narration-full.mp3` (129.1s)
> FPS : 30 — Total frames : 3874

---

## Principe directeur

**1 acte = 1 scene cinematographique** (clip Seedance, ou composition Remotion pure avec assets Gemini).
Duree maximale par clip Seedance : **15s**. Si acte > 15s, splitter en 1 clip 15s + 1 clip 5s.
Pas d'images statiques avec zoom lent — soit clip anime, soit composition Remotion riche.

---

## Plan final — 8 actes

### ACT I — SETUP (12.1s)
- **Scenes couvertes** : tyrannie + prophetie + handicap
- **Strategie** : 1 clip Seedance 15s (on couvre 12.1s utiles, 2.9s de marge pour fondu)
- **Description clip** : Plan-sequence village mandingue sous tyrannie → feu de conseil griots → bebe Soundjata au sol
- **A generer** : 1 clip

---

### ACT II — HUMILIATION (16.1s)
- **Scenes couvertes** : soundjataRampe + epouseRidiculise + humiliationMere + insulte
- **Strategie** :
  - 1 clip Seedance 10-11s (soundjataRampe + epouseRidiculise + humiliationMere — setup)
  - + asset existant `insult-clip-v1.mp4` (5s) + `insult-dialogue.mp3` sur la scene insulte
  - On mute la narratrice sur la scene insulte (21.22s-28.78s) et on joue le clip Matrone a la place
- **Decision finale** : Option B retenue (clip dialogue existant)
- **A generer** : 1 clip setup (humiliation avant l'insulte)

---

### ACT III — TRANSFORMATION (19.3s)
- **Scenes couvertes** : reaction + barreDeFer + barreTord + baobab + neRamperaPlus
- **Strategie** :
  - Asset existant `soundjata-iron-bar-v1.mp4` (15s) — couvre reaction + barre
  - 1 clip Seedance 5s — baobab arrache + depose + close final
- **A generer** : 1 clip (baobab)

---

### ACT IV — EXIL ET RETOUR (16.4s)
- **Scenes couvertes** : exil + mema + messagers + lionRevient
- **Strategie** : 1 clip Seedance 15s (exil + mema + messagers) + 1 clip 5s (lionRevient dramatique)
- **A generer** : 2 clips

---

### ACT V — KIRINA (21.7s)
- **Scenes couvertes** : soumaoroInvulnerable + secretCoq + flecheCoq + kirinaDate + flecheAtteint + tyranFuite
- **Strategie** : 1 clip Seedance 15s (combat bataille, wide aerial signature) + 1 clip 5s (Soumaoro touche + fuite)
- **A generer** : 2 clips

---

### ACT VI — EMPIRE ET CHARTE (20.5s) — REMOTION PUR

**Scenes couvertes** : empireFonde + extraordinaire + charte + quaranteQuatre + droitsArticles + huitCents

**Approche** : 100% Remotion avec assets Gemini + animation SVG/texte.

**Structure detaillee** :

| Sub-scene | Duree | Asset Gemini | Animation Remotion |
|-----------|-------|--------------|--------------------|
| empireFonde | 4.86s | Pipeline carte d3-geo existant (HistoricalMap) | Empire Mali qui s'etend, route de l'or |
| extraordinaire | 2.06s | Gemini : parchemin roule, plume de griot | Parchemin qui se deroule, plume qui se leve |
| charte | 3.50s | Gemini : livre ouvert ou parchemin deploye | Texte "CHARTE DU MANDEN" qui apparait en calligraphie |
| quaranteQuatre | 0.80s | — | Chiffre "44" geant anime (compteur/apparition) |
| droitsArticles | 3.48s | Gemini : 3 icones symboliques (vie, femme, chaines brisees) | 3 icones qui apparaissent en sequence avec leur texte |
| huitCents | 3.38s | Gemini : 2 cadres paralleles (Mali 1236 / Monde 1948) | Timeline animee, punch line visuelle |

**A generer Gemini** : ~5 images base (parchemin, plume, livre, 3 icones, timeline)
**A coder Remotion** : composition dediee avec transitions fluides entre sub-scenes

---

### ACT VII — LEGENDE VIVANTE (13.2s)
- **Scenes couvertes** : griots + boucheOreille + pasDeVersion + chaqueGriot
- **Strategie** : 1 clip Seedance 15s — griot moderne qui chante avec kora, feu de camp, transmission intergenerationnelle
- **A generer** : 1 clip

---

### ACT VIII — CLOSE (6.5s) — REMOTION PUR + SIGNATURE SERIE
- **Scenes couvertes** : enfantRampait + close
- **Strategie** : **Split vertical signature serie** (voir `memory/heros-oublies-series-signature.md`)
  - A gauche : element visuel Soundjata (a decider — silhouette, baobab+barre de fer, ou enfant rampant)
  - A droite : element de contraste historique (a decider — probablement un symbole occidental lie a la Charte/droits de l'homme pour contraster avec le "800 ans avant")
  - En bas : texte signature "Et pourtant, l'histoire a presque oublie son nom."
- **A generer** : 2 images Gemini (gauche + droite) + composition Remotion SplitClose
- **Note** : ce pattern devient un element recurrent de la serie Heros Oublies (vu aussi sur Abou Bakari)

---

## Bilan final

### Clips Seedance a generer
- Acte I : 1 clip (setup)
- Acte II : 1 clip (humiliation pre-insulte)
- Acte III : 1 clip (baobab)
- Acte IV : 2 clips (exil + lion)
- Acte V : 2 clips (bataille + fuite)
- Acte VII : 1 clip (griots)
- Acte VIII : 1 clip (close)

**Total : 9 clips Seedance**
**Cout estime** : ~$20-25 (moyenne ~$2.50/clip avec iterations)

### Assets existants
- `soundjata-iron-bar-v1.mp4` (acte III)
- `insult-clip-v1.mp4` + `insult-dialogue.mp3` (acte II — scene insulte)

### Acte 100% Remotion (acte VI)
- Carte Mali animee (pipeline existant)
- ~5 images Gemini (parchemin, plume, livre, icones, timeline)
- Composition Remotion avec texte calligraphie anime

---

## Sequence de production recommandee

**Phase A — Acte VI en premier (gratuit, test du style hybride)**
- Generer les ~5 images Gemini
- Coder la composition Remotion avec texte anime
- Mini-render pour valider le style
- **Pourquoi en premier** : gratuit, valide que le style Gemini + Remotion tient pour le passage narratif le plus important du Short (la Charte = punch line historique)

**Phase B — Clips Seedance climax (priorite haute)**
- Batch 1 : acte II setup + acte III baobab + acte V bataille (les 3 moments visuels forts)
- Mini-render de chaque clip isole pour valider

**Phase C — Clips Seedance restants**
- Batch 2 : acte I setup + acte IV exil/lion + acte VII griots + acte VIII close

**Phase D — Assemblage complet**
- Integrer tous les clips dans SoundjataShort.tsx avec timings frame-precis
- Mini-render des transitions critiques entre actes
- Render final

**Phase E — Audio polish**
- Musique de fond (Minimax Music 2.6)
- Mix : voix 100% + musique ~-18dB + fade in/out

---

## Decisions restantes

1. **Acte VIII close** : clip Seedance flashback OU Remotion silhouette ?
2. **Ordre exact de production** — OK avec Phase A (acte VI Remotion) en premier ?
