# ⛔⛔ `<ThreeCanvas camera={{...}}>` N'EST PAS REACTIF — animer camZ ne fait RIEN

> Decouvert le 2026-08-26 (repro Foster, plan 1). **A coute 2 rendus complets**
> (v3 et v4) et un faux diagnostic « c'est un probleme de dosage ».

## Le symptome
On anime la distance camera pour faire un zoom / pull back :

```tsx
const camZ = interpolate(tSec, [0, 1.3], [3.5, 8.4]);   // <-- calcule, mais INERTE
<ThreeCanvas camera={{ fov: 40, position: [0, 0, camZ] }}> ... </ThreeCanvas>
```

Le rendu sort avec un objet **de taille strictement constante**. Aucune erreur,
aucun warning : le code a l'air juste, la valeur est bien recalculee a chaque
frame, et pourtant rien ne bouge a l'ecran.

## La cause
La prop `camera` de react-three-fiber (donc de `@remotion/three`) est une
**valeur par DEFAUT lue a l'initialisation du canvas**, pas une liaison reactive.
Changer l'objet passe en prop ne repositionne pas la camera existante.

## ⚠️ Le piege qui rend le bug invisible
`DeviceInScene.tsx` (`PhoneOnDesk`, `LaptopOnDesk`) **a l'air** d'animer sa
camera — il calcule un `camZ` interpole et le passe au canvas. Son zoom marche,
donc on en deduit que le pattern fonctionne. **Il fonctionne pour une autre
raison** : `phoneScale` est recalcule sur `camZ` a chaque frame
(`scaleForRealSize(..., camZ, ...)`), et c'est CE scale qui produit tout le
mouvement. La camera, elle, n'a jamais bouge.

⛔ Corollaire : « figer le scale a la distance finale pour ne pas fausser
l'echelle » (ce qui semble plus correct) **supprime le seul mecanisme qui
marchait** et donne un plan totalement immobile. C'est exactement l'erreur v4.

## Le fix
Faire porter le mouvement par le **scale** (du modele ou d'un `<group>`), en
gardant la camera a distance fixe :

```tsx
const CAM_Z = 8.4;                       // fixe
const pull = interpolate(tSec, [0, 1.3], [2.2, 1.0]);   // le geste
const scaleBase = scaleForRealSize(3.2, PHONE_H_CM, PX_PER_CM, CAM_Z, height);
<ThreeCanvas camera={{ fov: 40, position: [0, 0, CAM_Z] }}>
  <PhoneModel scale={scaleBase * pull} ... />
</ThreeCanvas>
```

Les couches 2D (decor, ombre, halo) doivent etre multipliees par le **meme**
`pull` pour rester solidaires.

## Si un vrai deplacement de camera est necessaire
(travelling avec parallaxe reelle, pas un simple zoom) : il faut muter l'objet
camera dans une boucle `useFrame` / via `useThree().camera`, pas via la prop.
⚠️ Non teste chez nous a ce jour — le scale a suffi. Ne pas l'affirmer sans essai.

## Comment on l'a trouve
En mesurant la taille de l'objet frame par frame sur le rendu (constante a 1 px
pres) au lieu de re-doser les valeurs. **Meme signature que le bug du globe D3
du 2026-08-02** : un cablage mort qui se lit comme un probleme d'amplitude.
Cf. `feedback_globe-d3-scaleMul-doit-piloter-tous-cercles`.


---

# ⛔ BONUS (meme session) : `npx tsc | grep` AVANT un render AVORTE le render

```bash
npx tsc --noEmit 2>&1 | grep -i MaComposition | head -3   # <-- grep sans match = exit 1
npx remotion render ...                                    # <-- NE S'EXECUTE JAMAIS
```

Quand le `grep` ne trouve rien (= le typecheck est PROPRE, donc le cas nominal),
il sort en statut 1 et la chaine s'interrompt : **le render n'est jamais lance**.
Symptome : la sortie du job ne contient que les echos precedents, aucun message
Remotion, et le `.mp4` n'existe pas — sans la moindre erreur affichee.

**A coute 2 relances le 2026-08-26** (plan 1 v4, puis plan 2 v4).

✅ **Fix** : lancer le typecheck et le render dans **deux commandes separees**, ou
terminer le grep par `|| true`.


---

# ⛔ `interpolate` : bornes STRICTEMENT croissantes (piege du « pas de fondu de sortie »)

```tsx
// ⛔ PLANTE : « je veux qu'il reste affiche jusqu'a la coupe a 11,44 s »
interpolate(t, [9.7, 9.95, 11.44, 11.44], [0, 1, 1, 0])
//  Error: inputRange must be strictly monotonically increasing
```

Deux bornes egales suffisent a faire echouer le render **a la frame 0**.

✅ **Fix** : borner AU-DELA de la fin du plan, l'element reste alors visible
jusqu'a la coupe : `interpolate(t, [9.7, 9.95, 12.5, 13.0], [0, 1, 1, 0])`.

⚠️ **Le job de render sort en `exit code 0` malgre l'echec** — la notification dit
« completed », mais aucun fichier n'est produit. **Toujours verifier le FICHIER
(existence + `nb_frames` attendu), jamais le statut du job.** Vaut pour tout render
lance en arriere-plan.
