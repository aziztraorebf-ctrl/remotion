# INDEX DES LIENS — pointeur simple, hors mémoire active

> **À quoi sert ce fichier** : Aziz demande régulièrement « où est la page de X ? »,
> « c'est quoi le lien du dashboard ? ». Sans index, la réponse coûte plusieurs
> recherches — ou pire, un lien recréé en double parce que l'ancien était introuvable.
>
> ⭐ **Il ne vit PAS dans `MEMORY.md`** : une seule ligne y pointe vers ici. Des dizaines
> d'URL dans le fichier chargé à chaque session engorgeraient la mémoire active pour
> une information qu'on ne consulte qu'à la demande. C'est un **pointeur**, pas une mémoire.
>
> **Entretien** : quand un lien est mort ou une page périmée, on la **supprime** d'ici —
> git garde l'historique. Un index qui accumule des liens morts ne vaut pas mieux que pas
> d'index. ⚠️ Ne rien ajouter ici « au cas où » : seulement ce qu'on voudra retrouver.

---

## 🎬 Pages de production (Artifact)

| Sujet | Lien | Contenu |
|---|---|---|
| **Repro Foster** (vidéo Fiverr) | https://claude.ai/code/artifact/d5fb3169-7cb4-47e8-a94a-dfca377d204f | Les 11 plans côte à côte avec l'original, lecture image par image. 1 page par SUJET — à enrichir, pas à dupliquer. |
| **Repro Foster — le montage complet** | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/foster-FINAL-zGlYVidLOsQZncjnceaYO3KbQv6isp.mp4 | 42,77 s, musique + SFX. Hébergé sur Blob : 29 Mo, au-delà du plafond Artifact (16 Mo). |

## 🔊 Banque audio (Artifact)

> ⛔ **À ouvrir AVANT toute génération Minimax/fal.ai/ElevenLabs.** La règle projet est
> « réutiliser avant de créer », et `INDEX-MUSIQUES.md` le dit : générer sans avoir
> regardé, c'est re-payer ce qu'on possède déjà.

| Sujet | Lien | Contenu |
|---|---|---|
| **SFX** — 142 effets | https://claude.ai/code/artifact/6bf90c2f-e269-43cd-b295-48b80b2ee78b | Écoutables en entier, classés par usage (interface, transitions, impacts, écriture, nature…). Chemin `staticFile()` sous chaque son. |
| **Musiques I** — 26 pistes | https://claude.ai/code/artifact/57a122f2-9c7d-488f-91a3-f9a3ce977b20 | Extraits de 60 s, par famille. Durée = celle du fichier complet. |
| **Musiques II** — 27 pistes | https://claude.ai/code/artifact/dfcf9a81-a52a-425a-b217-335ecc11afcd | Idem, seconde moitié. |

**Sources de vérité sur disque** (les mesures, pas l'écoute) :
`public/_shared/audio/INDEX-MUSIQUES.md` (amplitude · bande voix · raccord de boucle)
et `public/_shared/sfx/SFX-INDEX.md` (⛔ y sont listés les fichiers corrompus).

## 🎥 Démos et vitrines

| Sujet | Lien | Contenu |
|---|---|---|
| **Galerie des 21 mouvements de caméra** | https://aziztraorebf-ctrl.github.io/remotion/ | Une démo par geste. Sert d'appui aux piliers B2B. ⚠️ Gotchas de déploiement dans `memory/NEXT-ACTION.md` (data.json généré, .mp4 hors git). |

## 📦 Dépôts

| Sujet | Lien |
|---|---|
| Dépôt principal | https://github.com/aziztraorebf-ctrl/remotion |

---

## ⛔ Liens morts ou périmés — retirés

> On les note ici **une seule fois** quand ils ont servi, pour ne pas les rechercher.

- `scripts/tools/render-on-vercel.py` → **POC ABANDONNÉ**, pointait vers un dépôt Vercel
  séparé figé au 2026-03-27 avec 3 compositions de démo. Ne verra jamais nos vraies
  compositions. Render local (`npx remotion render`), ou `scripts/render-mapbox.sh`
  pour tout ce qui touche à Mapbox/WebGL.
