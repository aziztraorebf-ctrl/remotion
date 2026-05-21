# Amanirenas — Asset Library

## Seed officiel (SOURCE DE VERITE)

**`amanirenas-portrait-REF-v4-patch.png`**
- Utiliser CE fichier comme image de reference dans Recraft/Kling/Gemini
- C'est la version canonique AVEC le bandeau oculaire (eye patch gauche)
- Les versions `CANONICAL` et versions anterieures n'ont PAS l'eye patch — ne pas utiliser comme seed

## Assets canoniques

| Fichier | Role | Notes |
|---------|------|-------|
| `amanirenas-portrait-REF-v4-patch.png` | Seed portrait | Eye patch gauche, fond jaune, style flat graphic |
| `amanirenas-startframe-v3-sol.png` | Frame de depart Kling | Sol corrige (dore/ocre solide) — SANS eye patch (voir gotcha) |
| `amanirenas-endframe-v5-sol.png` | Frame d'arrivee Kling | Sol corrige, armee de dos |
| `amanirenas-warrior-type-REF-canonical.png` | Type guerrier Meroe | Silhouette dos, bouclier ovale terracotta, lance |

## Identite visuelle

- **Peau** : bleu marine tres fonce (#1a1f3c environ)
- **Couronne** : rouge cramoisi + or, cobra dore au centre
- **Eye patch** : noir sur oeil gauche (DISTINCTIF — ne jamais omettre)
- **Robe** : blanc pur, coupe droite, col V
- **Style** : flat graphic, blocs de couleurs purs, pas de degrades

## Palette de scene (startframe/endframe)

- Ciel : beige creme pale (#f5ede0)
- Soleil : orange vif (#e85c1a)
- Pyramides : bleu-gris fonce (#2d3a4a)
- Sol : doré/ocre chaud (#c8901a) — SOLIDE, pas de reflets

## Gotchas critiques

- **Sol = riviere** : les versions sans suffixe `-sol` ont un sol qui ressemble a une riviere en mouvement dans Kling. Toujours utiliser les versions `-sol`.
- **Startframe SANS eye patch** : `amanirenas-startframe-v3-sol.png` est correct pour le sol et la composition, mais le visage d'Amanirenas n'a pas le bandeau oculaire. Si ce frame est reutilise comme source Kling/Gemini, il faut : soit ajouter le patch via edition Gemini chirurgicale, soit passer `amanirenas-portrait-REF-v4-patch.png` en REF supplementaire avec mention explicite "black eye patch over left eye".
- **Eye patch obligatoire dans les prompts** : si le prompt ne mentionne pas l'eye patch, Kling/Recraft l'omettent systematiquement. Toujours inclure "black eye patch over left eye".
- **Versions CANONICAL obsoletes** : `amanirenas-startframe-CANONICAL.png` et `amanirenas-endframe-CANONICAL.png` sont les MAUVAISES versions (sol non corrige).

## Prompts Kling recommandes

### Prompt de style (a inclure dans tous les prompts)
```
flat graphic illustration style, bold color blocks, no gradients, minimal detail,
dark navy blue skin tone, red and gold Kushite crown with cobra motif,
black eye patch over left eye, white dress
```

### Pour les scenes de foule/armee
```
[scene description], army of dark warrior silhouettes with round shields and spears,
orange sun, dark pyramid silhouettes, golden ochre desert ground (solid, no river)
```
