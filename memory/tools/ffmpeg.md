# ffmpeg — pièges généralisables

> Source de vérité pour les pièges ffmpeg qui reviennent d'un projet à l'autre (montage,
> concat, mesure). Créé le 2026-09-08 depuis le chantier cauri — aucun fichier ffmpeg
> dédié n'existait avant, le piège ci-dessous était en train de se noyer dans un fichier
> outil tiers (`elevenlabs.md`) sans rapport avec sa cause réelle.

## ⛔⛔ `-ss`/`-t` : la position autour de `-i` change ce qu'ils bornent

**Le piège** : `-ss`/`-t` **avant** `-i` bornent l'**entrée** (ce qui est décodé, donc ce que
voit le `filter_complex`). `-ss`/`-t` **après** `-i` bornent la **sortie** (le muxage final),
et agissent *après* les filtres — invisibles pour `volumedetect`/`silencedetect`, qui reçoivent
alors tout le flux restant et rendent une moyenne plate sur toute cette durée au lieu de la
fenêtre voulue.

**Le symptôme qui trompe** : ça ne plante pas — un nombre sort, l'air valide. Un mix qui
devrait creuser nettement à un instant précis mesure plat partout (vécu : -34/-35 dB sur toute
une fenêtre de 2s, aucune baisse détectable) et fait suspecter à tort un bug du *filtre*
(`volume=enable=...`) plutôt qu'un bug de la *commande de mesure*.

```bash
# FAUX pour mesurer un extrait — -ss/-t après -i, invisible pour volumedetect
ffmpeg -i out.wav -ss 18.0 -t 0.15 -af volumedetect -f null -

# CORRECT — -ss/-t avant -i
ffmpeg -ss 18.0 -t 0.15 -i out.wav -af volumedetect -f null -

# CORRECT et robuste au réordonnancement des flags — atrim dans le graphe
ffmpeg -i out.wav -filter_complex "[0:a]atrim=start=18.0:end=18.15,volumedetect[o]" -map "[o]" -f null -
```

**Comment appliquer** : avant d'écrire un script de mesure (`volumedetect`, `silencedetect`,
`loudnorm` en mode mesure), toujours `-ss`/`-t` **avant** `-i`, ou `atrim` dans le
`filter_complex` si la position des flags n'est pas garantie. Si une mesure ffmpeg est
anormalement plate/uniforme sur toute la durée d'un extrait cadré → suspecter CE piège
en premier, avant de suspecter le filtre ou le mix lui-même.

Deux pièges annexes rencontrés en creusant celui-ci :
- `-v error` **supprime la sortie de `volumedetect`** (niveau `info`). Utiliser `-hide_banner`
  seul si tu veux voir `mean_volume`/`max_volume` dans les logs.
- Le préfixe `[Parsed_volumedetect_N @ 0x...]` a un `N` qui **varie selon la position du
  filtre dans le graphe** (`0` avec `-af` simple, `1`+ après un `atrim`). Grepper `mean_volume`
  seul, pas `Parsed_volumedetect_0` — sinon un résultat valide est raté silencieusement.

Source : `memory/starters/STARTER-piece-cauri.md` (chantier cauri, 2026-09-08) — diagnostic
initial délégué à un agent qui a confirmé ce piège précis sur un cas isolé, mais le vrai bug
du mix (chevauchement du creux avec le son de l'impact) était un problème DIFFÉRENT découvert
en vérifiant le fix de l'agent sur le fichier réel — les deux s'étaient superposés.
