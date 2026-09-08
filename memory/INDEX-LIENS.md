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

## 💼 Clients & contrats (Upwork)

> ⭐ **Une page par CLIENT**, enrichie au fil du contrat — pas une page par livraison.
> C'est ici qu'on cherche quand Aziz dit « la page pour <client> » ou « le lien du contrat ».

| Client / contrat | Lien | Contenu |
|---|---|---|
| **Abigail — AbiGirl Reacts** ⭐<br>Max Chill Factor Meter | https://claude.ai/code/artifact/652c7c39-1529-45a7-8d0b-929098180b9b | Contrat signé le 30/08 (350 $, 3 jalons). Historique complet, vérification contre le brief, calendrier des jalons, message de livraison prêt à copier. ⛔ **Le bouton d'enregistrement de la page ne fonctionne pas de façon fiable** — les 2 fichiers à envoyer sont sur Blob (liens ci-dessous, ouvrir + appui long pour enregistrer). |
| ↳ Jalon 1 — chassis seul | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/01-meter-design-final-PeKpctxBRUhpKlfvEy29HKKFbPioUU.png | PNG, 491 Ko, vérifié |
| ↳ Jalon 1 — en contexte | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/02-meter-in-context-final-nMDmZxSyGbZWIrteuNKA9CY22XS34k.png | PNG, 2 Mo, vérifié |
| ↳ **Page de suivi — révision 06-07/09** ⭐ | https://claude.ai/code/artifact/5850aa17-cd86-4f75-9d8b-e0be02de5592 | L'ancrage au sol, les 5 corrections, le récap client animé. LA page du chantier de révision — l'enrichir, ne pas en créer une 2e. |
| ↳ **Récap client** (vidéo, 26 s) | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/RECAP-client-v5-hklzVBMz9Bjw56k85W9Anl9lcTTT6I.mp4 | Version envoyée : cadre plein, 2 chapitres (jalon 1 à valider / aperçu). S'arrête au 75 %, pas de 100 %. |
| ↳ **⭐ LES 6 MOV ALPHA À LIVRER** (sur disque, 208 Mo) | `out/_r-and-d/chill-meter-upwork/v2-07-09/` | ⛔ **Pas en ligne** — trop lourds pour un Artifact (16 Mo), ils partent par Upwork. Rendus le 08/09, ProRes 4444, 1920×1080. Alpha **vérifié en décodant** (93 % du cadre transparent), corrections présentes (objet x 189..715, descendu de 85 px vs les périmés). Les 6 du 23/08 ont été **supprimés** — regénérables via `ChillMeter-{Entrance,Idle,Fill25,Fill50,Fill75,Fill100}` avec `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le` (⛔ le pixel-format est obligatoire, sinon pas d'alpha). |

## 🎬 Pages de production (Artifact)

| Sujet | Lien | Contenu |
|---|---|---|
| **Rétrospective Foster** ⭐ | https://claude.ai/code/artifact/6bfbbd43-9720-4055-9918-9487b89f3a7d | Ce que le test a prouvé, les 3 façons de se tromper en mesurant, le signal « plafond vs dosage ». À relire avant une repro ou un chantier de mesure. |
| **Repro Foster** (vidéo Fiverr) | https://claude.ai/code/artifact/d5fb3169-7cb4-47e8-a94a-dfca377d204f | Les 11 plans côte à côte avec l'original, lecture image par image. 1 page par SUJET — à enrichir, pas à dupliquer. |
| **Pièce cauri** ⭐ | https://claude.ai/code/artifact/5b60ada3-4e0d-41fa-aded-a19d384f4d55 | Animatic de travail (20,6 s, gris neutre, jetable) + les 7 états mesurés + ce qui reste à trancher. LA page du sujet cauri — l'enrichir, ne pas en créer une 2e. |
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

### Chill meter (Abigail, AbiGirl Reacts) — revision 1 du jalon 1, 02/09/2026
Les 4 pieces jointes preparees pour l'envoi (⛔ noms neutres : aucun modele, version ni jargon).
Envoi fait par Aziz lui-meme depuis son telephone.
- Texture sobre, en contexte : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/chill-meter-restrained-texture-sBNwc2DBwjDzLYxg51FvB2rYua1psl.png
- Texture marquee, en contexte : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/chill-meter-heavy-texture-TttHilpFzMMfELbNS9dlnYExxTnqGB.png
- Reference degivree sobre : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/reference-metal-restrained-FeJsMBthyt5Dg5AsWtxgR5tRkJH2qL.png
- Reference degivree rouillee : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/reference-metal-heavy-H5HsrgUVaLFEOv06leIa6YdNSrhgoW.png
- Page de comparaison interne (⛔ NE PAS envoyer a la cliente) : https://claude.ai/code/artifact/2297faf9-08b0-46a2-994a-ab46a27c3eb8

### Chill meter — clip allumage (entrance), version claire, 03/09/2026
Sequence complete : arrivee en diagonale, atterrissage, allumage progressif. Composee sur son
plateau reel, meme placement/centrage que les images fixes.
- ⛔ Clip 2s (premier jet, remplace) : lien conserve pour historique, ne plus utiliser
- ⭐ Clip FINAL 4s (entrance + 2.5s d'ecran allume, sur le plateau) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1c/entrance-4s-on-set-vPySH05dsZqZFnbSyc94vG93ZxriC1.mp4

### Chill meter — 2 planches finales (design + contexte plateau), 03/09/2026
- Sombre (dark gunmetal) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1d/chill-meter-dark-gunmetal-uBz5luPLGv2kvz0uvcIEgN2OaKnqdQ.jpg
- Claire (light gunmetal) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1d/chill-meter-light-gunmetal-0hsCOnsAKF37ntGjNJ2eQeizkbHGLw.jpg
+ clip 4s (entrance-4s-on-set, deja dans ce fichier plus haut). 3 fichiers au total pour l'envoi.

## Chill-meter — session 2026-09-04 (chassis rustique)
- Calage au pixel : https://claude.ai/code/artifact/939f45dd-98eb-4ec6-8e4c-db5f414eebcd
- Cibles 75/100 % : https://claude.ai/code/artifact/33ac07b5-93cd-4c63-82c3-24f8cbd435ae
- Vapeur 3D (3 versions) : https://claude.ai/code/artifact/7dc2e733-bf7c-40f9-9d53-b723905efcea
- Ideation 4 LLM sur la progression : https://claude.ai/code/artifact/42473d83-81b5-4a0f-acd0-56959b5cb4ca
