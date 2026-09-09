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
| **Pièce cauri** ⛔ CLOS | https://claude.ai/code/artifact/cb64511e-047e-4012-aaf2-045646470903 | Chantier clos en R&D concluante (2026-09-08, verdict Aziz : pas au niveau portfolio). Page gardée comme trace du dernier mix testé — voir `memory/starters/STARTER-piece-cauri.md` pour le verdict final. Ne pas reprendre sans besoin explicite. |
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
| **Gig Fiverr Lottie/UI — page de recherche + texte** ⭐ | https://claude.ai/code/artifact/6758c1d3-089d-4f63-8ad1-6b0d1154ee01 | « Le vrai prix du Lottie » (05/09) : 9 vendeurs Fiverr mesurés (grilles vs commandes réellement payées) + le texte intégral du gig (titre, tiers 50/120/250, FAQ). Le texte est recopié dans `memory/freelance-linkedin/GIG-PAGE-VALIDEE.md` — cette page-ci est la SOURCE avec tout le raisonnement de marché. |
| **Gig Fiverr — quel mot-clé de titre** ⭐⭐ | https://claude.ai/code/artifact/6a6e07f7-ef1f-4dd2-8e5d-7188794a8870 | « La bonne case Fiverr » (08/09, 2 parties) : "micro interactions" = meilleur signal pour le gig Lottie/UI. Partie 2 : le marché streamer/widget creusé — "goal widget" (Shapla Khatun) = signal le plus fort de toute la recherche pour un objet type chill-meter ; explication vérifiée de pourquoi Rive est "live" (state machine calculée côté client vs Lottie qui rejoue une bande). 2 marchés Fiverr distincts identifiés, à ne pas fusionner. Journal brut : `memory/freelance-linkedin/RECHERCHE-CATEGORIE-08-09.md`. |

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

### Chill meter — storyboard des effets d ecran (6 concepts), 04/09/2026
3 gestes par palier (75 % et 100 %), generes depuis le device rustique givre. ⛔ CIBLES DE
DIRECTION, pas des rendus : Gemini a redessine le plateau, le device est flou. Ne PAS envoyer
comme apercu du livrable. Reco : B (montee) au 75 %, D (onde) au 100 % — les 2 qui se codent.
- Page de choix : https://claude.ai/code/artifact/34a247e1-7890-492f-9776-1dff6771a0b3
- Fichiers : out/_r-and-d/chill-meter-3d/storyboard/

### Chill meter — parcours 0→100 % sur le device RUSTIQUE, 04/09/2026
Le nouveau chassis (son image comme decor + nos couches) : entree, idle, 4 paliers, givre en
3 planches. Usage INTERNE — rien n'a ete envoye a la cliente.
- Video HQ 21 s (CRF 15, 2,1 Mo) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-2/CHILL-METER-parcours-HQ-DRBkMMEzxw8qfhWarmgaD869DxwoDd.mp4
- Page de suivi (video + mesures + planches) : https://claude.ai/code/artifact/3244ead5-6fa8-4fcd-8dc0-e84722712ae7

### Chill meter — 2 planches finales (design + contexte plateau), 03/09/2026
- Sombre (dark gunmetal) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1d/chill-meter-dark-gunmetal-uBz5luPLGv2kvz0uvcIEgN2OaKnqdQ.jpg
- Claire (light gunmetal) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/chill-meter/revision-1d/chill-meter-light-gunmetal-0hsCOnsAKF37ntGjNJ2eQeizkbHGLw.jpg
+ clip 4s (entrance-4s-on-set, deja dans ce fichier plus haut). 3 fichiers au total pour l'envoi.

## Chill-meter — session 2026-09-04 (chassis rustique)
- Calage au pixel : https://claude.ai/code/artifact/939f45dd-98eb-4ec6-8e4c-db5f414eebcd
- Cibles 75/100 % : https://claude.ai/code/artifact/33ac07b5-93cd-4c63-82c3-24f8cbd435ae
- Vapeur 3D (3 versions) : https://claude.ai/code/artifact/7dc2e733-bf7c-40f9-9d53-b723905efcea
- Ideation 4 LLM sur la progression : https://claude.ai/code/artifact/42473d83-81b5-4a0f-acd0-56959b5cb4ca
