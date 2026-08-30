# Avis Fiverr — segment UI / SaaS product / micro-interaction (2026-08-30)

> **Resultat : AUCUNE donnee collectee. CAPTCHA rencontre des la premiere page, mission arretee.**
> Perimetre assigne : "ui animation", "saas product animation" / "product demo animation",
> "micro interaction animation". (Les requetes "lottie animation" / "app animation" etaient
> couvertes par un autre agent, hors de ce fichier.)

---

## 1. Playwright a-t-il passe le mur ? NON

**Pages reellement chargees : 1** (une seule navigation, puis arret).

| Element | Valeur observee |
|---|---|
| URL tentee | `https://www.fiverr.com/search/gigs?query=ui%20animation&sort_by=best_selling` |
| Statut HTTP | **403** |
| Titre de page | « It needs a human touch » |
| Texte | « Complete the task and we'll get you right back into Fiverr. » |
| Code d'erreur | **ERRCODE PXCR10002539** |
| iframe de challenge | `https://js.px-cloud.net/?t=...` → **PerimeterX** (pas Cloudflare) |
| IP vue par Fiverr | 96.21.64.45 |
| traceId | 9a91b182a2264a8fa540f0749fc71f4e |

**Nature du blocage** : ce n'est pas un mur Cloudflare mais un challenge **PerimeterX (px-cloud.net)**,
c'est-a-dire une **verification humaine explicite** — la page demande litteralement de « completer la
tache ». C'est un refus adresse a un humain.

**Decision** : arret immediat, conformement a la regle absolue n°3 de la mission. Le CAPTCHA n'a
pas ete resolu, pas contourne, et **aucun chemin alternatif n'a ete cherche pour l'eviter** (pas de
rotation d'User-Agent, pas de proxy, pas de patch anti-detection, pas de tentative sur un autre
domaine/miroir). Navigateur ferme.

**Ce que ca signifie, comme resultat** : Playwright « tel quel », en navigation anonyme, ne passe
pas le mur anti-bot de Fiverr en 2026-08. Le blocage tombe **des la page de resultats de recherche**,
avant meme d'atteindre une fiche de gig. Ce n'est donc pas un probleme de selecteurs ou de rythme :
c'est un refus a l'entree.

---

## 2. Les AVIS

**Neant.** Zero avis collecte. Aucune page de gig n'a pu etre ouverte.

⛔ Aucun verbatim n'est reproduit ici, ni reconstitue, ni approxime, ni tire d'une connaissance
generale. Un avis fabrique orienterait de vraies decisions commerciales : il n'y en a aucun.

---

## 3. Les VOLUMES

**Neant.** Aucun « N orders in queue », aucun nombre d'avis, aucune note moyenne, aucun total de
commandes. Rien n'a ete lu sur une page reellement chargee.

---

## 4. Paliers, formats, nommage par emplacement produit

**Neant.** Aucun palier Basic/Standard/Premium observe, aucun delai, aucun nombre de revisions,
aucun format livre (.json / .aep / .mp4 / GIF / dotLottie).

La question specifique a ce lot — **les gigs les mieux vendus nomment-ils un EMPLACEMENT PRODUIT
(hero section, onboarding, dashboard, preloader) plutot qu'une technique, et est-ce que ca se voit
dans leur prix ?** — reste **entierement ouverte**. Elle n'a pas recu le debut d'un element de reponse.

---

## 5. ⛔ CE QUE JE N'AI PAS PU ETABLIR (explicite)

Tout, sur les 3 requetes de mon perimetre. Precisement :

- Le texte des avis acheteurs — **0 avis, sur 0 gig**.
- Ce qui est REPETE vs ISOLE dans les retours (delai / revisions / format / comprehension du brief /
  communication) — **impossible a etablir sans corpus**.
- Les volumes de commandes et le nombre d'avis par gig — **0 gig mesure**.
- Les paliers de prix reels et les formats livres — **0 gig mesure**.
- Le nommage par emplacement produit et sa correlation au prix — **non teste**.

**Portee de ce qui suit : je n'ai vu 0 gig.** Rien ici ne permet la moindre affirmation sur le marche
UI / SaaS product animation sur Fiverr — ni sur les prix, ni sur les volumes, ni sur ce que disent
les acheteurs. Ne generaliser a partir de ce fichier serait generaliser a partir de rien.

---

## 6. Ce qui reste vrai apres cette tentative

Un seul fait acquis, et il est methodologique :

> **Fiverr est protege par PerimeterX et sert un challenge humain (403 + ERRCODE PXCR10002539) des
> la premiere requete de recherche, en navigation Playwright anonyme.** Toute future collecte d'avis
> Fiverr par navigateur automatise se heurtera au meme mur — ce n'est pas un aleatoire a re-tenter.

Corollaire pour la suite : la parole d'acheteur sur ce segment devra venir d'une source qui ne
demande pas de franchir une verification humaine. Pistes **non explorees ici** (hors perimetre de
cette mission, a arbitrer par Aziz) : plateformes sans mur anti-bot equivalent, avis publics
indexes par des moteurs de recherche, ou consultation manuelle par un humain.

---

*Rapport ecrit apres 1 page chargee, 1 CAPTCHA rencontre, 0 donnee collectee. Aucun commit effectue.*
