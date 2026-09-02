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

## 🎬 Pages de production (Artifact)

| Sujet | Lien | Contenu |
|---|---|---|
| **Rétrospective Foster** ⭐ | https://claude.ai/code/artifact/6bfbbd43-9720-4055-9918-9487b89f3a7d | Ce que le test a prouvé, les 3 façons de se tromper en mesurant, le signal « plafond vs dosage ». À relire avant une repro ou un chantier de mesure. |
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

### Chill meter (Abigail, AbiGirl Reacts) — revision 1 du jalon 1, 02/09/2026
Les 4 pieces jointes preparees pour l'envoi (⛔ noms neutres : aucun modele, version ni jargon).
Envoi fait par Aziz lui-meme depuis son telephone.
- Texture sobre, en contexte : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/chill-meter-restrained-texture-sBNwc2DBwjDzLYxg51FvB2rYua1psl.png
- Texture marquee, en contexte : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/chill-meter-heavy-texture-TttHilpFzMMfELbNS9dlnYExxTnqGB.png
- Reference degivree sobre : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/reference-metal-restrained-FeJsMBthyt5Dg5AsWtxgR5tRkJH2qL.png
- Reference degivree rouillee : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1/reference-metal-heavy-H5HsrgUVaLFEOv06leIa6YdNSrhgoW.png
- Page de comparaison interne (⛔ NE PAS envoyer a la cliente) : https://claude.ai/code/artifact/2297faf9-08b0-46a2-994a-ab46a27c3eb8
