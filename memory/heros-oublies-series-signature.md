# Heros Oublies — Signature de serie

> Elements recurrents qui definissent l'identite visuelle de la serie Heros Oublies.
> Etabli : 2026-04-12 (Soundjata, inspire du close Abou Bakari)

---

## Close signature — Split vertical

**Chaque episode de la serie se termine de la meme maniere** : un split vertical 50/50 avec :
- A gauche : un element visuel du heros (silhouette, scene emblematique, ou asset du Short)
- A droite : un element de contraste historique (un autre personnage, un autre empire, ou un symbole qui renvoie au "Et pourtant...")
- En bas : le texte signature qui apparait
  > *"Et pourtant, l'histoire a presque oublie son nom."*

### Pourquoi c'est efficace
- **Identite de serie** : un spectateur qui voit 2-3 episodes associe immediatement le split vertical + phrase a la serie
- **Punch final** : la phrase ne change jamais — c'est le "hook signature" comme chez les grandes chaines YouTube
- **Contraste visuel** : le split raconte automatiquement l'oubli historique (le heros vs ce qu'on retient)

### Origine
Pattern valide sur le close Abou Bakari II :
- Gauche : silhouette Abou Bakari
- Droite : navire de Christophe Colomb
- Bas : texte signature

### Adaptation par episode

| Episode | Gauche (heros) | Droite (contraste) | Phrase |
|---------|---------------|--------------------|--------|
| Abou Bakari II | Silhouette Abou Bakari | Navire Colomb | Signature |
| Soundjata | **A DECIDER** | **A DECIDER** | Signature |
| Nzinga | TBD | TBD | Signature |
| Lat Dior | TBD | TBD | Signature |
| Yaa Asantewaa | TBD | TBD | Signature |
| Hannibal | TBD | TBD | Signature |

### Structure technique Remotion
- Composition 1080x1920 (9:16)
- Deux Sequences AbsoluteFill avec `width: 540` (moitie)
- Texte en bas avec `bottom: 120px` minimum (safe zone 60px + padding)
- Fade-in/out pour les deux cotes + texte
- Duree conseillee : 5-8s

---

## Autres elements recurrents (a formaliser au fil des episodes)

### Palette GeoAfrique
- Or `#D4AF37` — accents royaux, titres, chiffres cles
- Ambre `#C8820A` — complements terre
- Creme `#F5E6C8` — textes clairs
- Contraste chromatique : 1 personnage en couleur vs monde desature (regle R37 Seedance)

### Audio
- Narratrice GeoAfrique V3 (`Y8XqpS6sj6cx5cCTLp8a`) — voix principale de la serie
- Musique : Minimax Music 2.6 — style regional au heros (Mande, Ashanti, Zulu, etc.)

### Ouverture (a formaliser)
- **Hypothese** : chaque Short s'ouvre sur un plan epoque/lieu avec un texte date/contexte
  - Ex Soundjata : "Treizieme siecle. Le pays mandingue."
  - Ex Abou Bakari : "Treize cent onze."
- A valider apres 2-3 Shorts pour confirmer le pattern

### Fin (close signature)
- Split vertical + texte signature (voir ci-dessus)
