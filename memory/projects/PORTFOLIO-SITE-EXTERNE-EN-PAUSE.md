# Site portfolio externe — EN PAUSE (2026-08-23)

> Chantier suspendu au profit du portfolio Upwork natif, qui est ce que les clients regardent
> en premier. Le travail est conservé ici, prêt à reprendre.

## Pourquoi la pause

Décision d'Aziz, 2026-08-23 : sur Upwork, le portfolio de la plateforme convertit mieux qu'un
lien externe (moins de friction, le client reste dans son écosystème). Le site externe reste
un actif utile — indépendant de la plateforme, réutilisable sur Fiverr, adressable par Google —
mais ce n'est pas la priorité tant qu'aucun contrat n'est signé.

## Ce qui existe ici

| Fichier | Quoi |
|---|---|
| `index.html` | La page v1, autonome (CSS inline). Rejetée : « crie généré par IA » |
| `shot-desktop.png` | Capture de cette v1 — l'état à dépasser |
| `design-gemini.jpg` | **Direction A** — galerie éditoriale, fond papier, pièce vedette + mosaïque, onglets. **La plus affirmée.** |
| `design-gpt.png` | **Direction B** — flux vertical une colonne, onglets de filtre, fond blanc. Plus sage. |
| `brief-design.txt` | Le brief qui a produit les 2 directions (ouvert, demande au modèle de CONCEVOIR) |

⚠️ Les 8 extraits vidéo de la v1 ne sont PAS ici : ils sont périmés (découpés en 1280x720 pour
le web, et 3 d'entre eux étaient en français). Repartir des pièces anglaises 1920x1080 de
`out/_r-and-d/portfolio-en/UPWORK/`.

## Défauts mesurés de la v1 (à ne pas reproduire)

- Grilles à trous : une carte seule sur une ligne de trois, deux fois
- Le format vertical minuscule dans un océan de vide
- Sombre bleu-nuit + accent doré + cartes arrondies + puces numérotées = signature du template généré
- Aucune navigation : 3000 px de scroll sans repère
- `noindex,nofollow` hérité de la galerie interne — invisible pour Google

## ⚠️ Un site Netlify VIDE existe déjà

`aziztraore-animation` a été **créé** sur le compte Netlify d'Aziz (site id `608c67eb-8478-4e7a-be20-58fdd8b81b36`,
URL `aziztraore-animation.netlify.app`) mais **jamais déployé** : le connecteur MCP a renvoyé une
erreur 502 deux fois de suite. Ne pas en recréer un second — reprendre celui-là.

Alternative si le connecteur échoue encore : la CLI Netlify, qui demande un token d'accès
(Account settings → Applications → New access token). Aucun token n'est stocké dans le repo.

## Contraintes acquises (valables pour toute reprise)

⛔ **Aucune coordonnée sur ce site tant qu'il est lié depuis Upwork** — ni email, ni formulaire
de contact. Poster des coordonnées joignables hors plateforme avant contrat est de la
« circumvention », sanctionnable jusqu'à la fermeture du compte. Le site doit rester une
VITRINE PURE ; le contact se fait sur Upwork.

⛔ Aucune simulation client non autorisée (Zambie, Flowdesk, chill-meter, NorthShield).

- Anglais uniquement · vidéos muettes en boucle · mobile d'abord (390 px)
- Les deux modèles ont convergé sans se concerter sur des **onglets de catégories** : signal fort.
