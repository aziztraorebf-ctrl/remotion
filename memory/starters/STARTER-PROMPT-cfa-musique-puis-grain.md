# STARTER — Franc CFA : la musique, puis le grain sur UNE scène

> Écrit en fin de session le 2026-07-29. **Ordre fixé par Aziz**, à respecter.
> Worktree : `/Users/clawdbot/Workspace/remotion-cfa` · branche `feat/cfa-nuit1994-svg-mix`
> ⚠️ Le worktree peut être resté sur `rnd/stick-figures-gestes` — vérifier `git branch --show-current`.

## Où on en est (vérifié, pas supposé)

L'épisode est **assemblé en v3** : 4 min 28 (8046 frames), sans musique, **aucun gel**
(265 empreintes uniques / 268), **−17,1 LUFS** identique au jalon v2.
- Livrable : `scratchpad/cfa-fix3/v3-beats/cfa-midform-v3-NOMUSIC.mp4` (⚠️ scratchpad = volatil,
  **le rapatrier** dans `out/episodes/franc-cfa-midform/` en début de session).
- Lien : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/cfa-midform-v3-compressed-p9a1q1xFDV9DS3LSjKH7Zv1vLkjxLI.mp4

Les **3 fixes du visionnage sont FAITS et VALIDÉS Aziz** (commits `f8c72545`, `0456ff96`,
`a2c36905`) : Guinée visible · rappel du sac de riz retiré · pings de connexion audibles.
⛔ Le seul plateau restant (2 s à t=153 s, beat 5a) est **pré-existant**, pas une régression.

---

## ÉTAPE 1 — LA MUSIQUE (commence par l'index, il existe maintenant)

⭐ **`public/_shared/audio/INDEX-MUSIQUES.md`** — créé cette session, c'est le point de départ.
67 pistes uniques mesurées (durée · amplitude · bande 200 Hz–2 kHz · **écart de boucle**).

**Ce que l'index dit déjà** :
- ⛔ **La durée n'est PAS un critère** (correction d'Aziz) : les pistes Minimax sont faites pour
  BOUCLER. Une piste de 127 s est parfaitement valable. Ma 1re version de l'index filtrait sur
  `durée ≥ 249 s` et ne gardait que 12 pistes sur 67 — erreur corrigée, **58 pistes retenues**.
- Le critère qui compte pour une boucle : **`loop`** = écart de niveau tête(3 s) ↔ queue(3 s).
  < 2 dB = raccord quasi transparent · > 5 dB = `acrossfade` long obligatoire.
- Les 2 autres critères valides : **amplitude < 15 dB** (sinon trous sous la voix) et **bande
  200 Hz–2 kHz basse** (sinon masquage de la narration).

**Têtes de liste mesurées** (à écouter, pas à croire) : `soudan-music-B-kora-dundun` (127 s,
loop **0,1 dB** — le meilleur raccord de la banque) · `music-C-fierte` (219 s, loop 0,1) ·
`music-A-tension-industrielle` (141 s, loop 0,5).

**⛔ Le choix est un jugement de goût d'Aziz, à l'oreille.** Ne pas trancher seul.
**Méthode proposée** : préparer 3-4 extraits COURTS (~30 s) de candidates **mixées sous un
passage narré réel**, uploadés (`scripts/tools/upload-to-blob.py`) — écouter 12 pistes entières
est impraticable, et une piste seule ne dit rien de son comportement sous la voix.

**Après le choix** : ⛔ **recalculer le volume PAR BANDE 200 Hz–2 kHz**, jamais en RMS global.
Le `0.26` de l'ancienne piste ne vaut plus ; le défaut `0.07` de la doctrine donnerait une
musique inaudible. Fenêtre musicale : démarrer après le beat 1 (déjà mixé) et s'arrêter à
l'écran typewriter — **à recalculer sur 268,2 s** (l'ancienne fenêtre 19,5→268 s visait 278 s).

**Chantier ouvert soulevé par Aziz** : « le véritable défi sera peut-être la **classification et
l'organisation** ». L'index a 7 familles provisoires **déduites des noms de fichiers**, pas du
contenu. Manque : le registre réel (tempo, instrumentation), l'usage narratif par type de beat,
et le lien piste ↔ épisode où elle a déjà servi. Aziz : une page d'écoute comparative « n'est pas
non plus le plus complexe ».

---

## ÉTAPE 2 — LE GRAIN, SUR UNE SEULE SCÈNE D'ABORD (consigne explicite d'Aziz)

> « Au lieu de tout appliquer sur la vidéo, choisir une scène de la vidéo, n'importe laquelle, et
> appliquer le changement — par exemple le grain — pour voir ce que cela change avant de
> complètement modifier la vidéo au complet. »

⭐ C'est un **test à variable unique** : même scène, seul le grain change. Même protocole que le
test du décor du 2026-07-29 (qui a tranché *participant vs inerte*).

**Scène recommandée : le beat 6a** (`CfaActe6aVolonte16x9.tsx`, compo `CFA-Acte6a-Volonte16x9`).
Raison : on vient de le retoucher, on a une frame de référence sous les yeux (la Guinée, frame
689/722), donc le avant/après est immédiatement lisible. Mais **n'importe quelle scène convient** —
Aziz a laissé le choix libre.

**Le seul point que les 2 modèles ET le code confirment** : il n'y a **aucun grain nulle part**
(`grep feTurbulence` revient vide). Filtre proposé par Kimi, à tester tel quel puis ajuster :
```
<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
```
en calque plein écran à ~3 % d'opacité + `drop-shadow` sur les objets volumineux.
⚠️ Vérifier le **coût de rendu** (un filtre SVG plein écran sur 8046 frames peut être lourd) et
juger **uniquement sur render `scale=1`** — un render 0.4 est flou et ferait douter à tort.

**Puis** : si Aziz valide sur cette scène → étendre aux 8 beats en **brique partagée** (pas 8
copies), re-render complet, ré-assemblage, validation.

---

## ⛔ CE QU'IL NE FAUT PAS APPLIQUER (vérifié FAUX cette session)

Sur les 6 points des TOP 3 des deux modèles, **3 sont faux** — les appliquer ajouterait ce qui
existe déjà :
- **Kimi, « funambule en translation linéaire »** → FAUX : trajectoire en **Bézier quadratique**
  + cycle de marche + bob vertical. Son TOP 1 ajouterait l'existant.
- **Kimi, « signatures 1994 en fondu »** → FAUX : elles **se tracent déjà** (4 plumes sans main,
  + micro-pulse du papier). Son TOP 3 est déjà implémenté.
- **Gemini, temps morts à 00:33–00:55 et 02:01–02:20** → FAUX, **mesuré** : ce sont les passages
  les **plus animés** du film (1,49 et 0,77 contre une médiane de 0,16).

**Les VRAIS creux, mesurés nous-mêmes** (aucun modèle ne les a trouvés) : **2:29 pendant 6 s**
(beat 5a, le plateau connu) · **4:11 (3 s)** et **4:24 (4 s)** (beat 6b — la chute s'essouffle) ·
**0:43–0:46** et **0:52–0:54** (beat 2, après la fin du dézoom). Piste : `camera drift` lent.

---

## Références

- ⭐ **`memory/doctrines/GRILLE-JUGEMENT-MIDFORM.md`** — la grille des 7 critères gravée cette
  session, avec le niveau baseline de cette vidéo et le mode d'emploi des reviews LLM.
- Reviews brutes : `scratchpad/cfa-fix3/REVIEW-PREMIUM.md` (Gemini) · `REVIEW-KIMI.md` (Kimi).
  ⚠️ scratchpad volatil → à rapatrier si on veut les garder.
- Outil créé : `scripts/tools/kimi-video-review-custom.py` (mono-vidéo, brief libre).

## ⚠️ Leçon de méthode de cette session

J'ai accusé Gemini d'avoir halluciné un « compteur sur un sac de riz » — **c'était moi qui me
trompais** : le beat 6b contient bien un sac de riz avec une estampille de prix, exactement là
où les deux modèles le situaient (3:45–4:10). J'avais confondu avec le prototype « porteur » du
matin, et j'ai propagé cette fausse accusation dans le brief de Kimi (qui a eu raison contre mes
instructions). **La règle « vérifier avant d'affirmer » s'applique à moi autant qu'aux modèles**,
et le symptôme d'un contexte saturé est de se fier à son souvenir plutôt qu'au fichier.
