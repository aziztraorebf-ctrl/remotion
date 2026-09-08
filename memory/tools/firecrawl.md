# Firecrawl — gotchas scraping marketplace (Fiverr mesure 2026-09-05)

> ⚠️ **Tavily reste l'outil de recherche PAR DEFAUT** (`memory/tools/tavily.md`). Firecrawl sert
> quand la page est une galerie JS ou que les donnees vivent derriere du rendu client — c'est
> exactement le cas de Fiverr. Ne pas payer l'abo mensuel Firecrawl : la session keyless suffit.

## ✅ CE QUI PASSE (mesure sur 9 gigs, 2026-09-05)

- **Fiverr ne bloque pas** : `proxy: basic` suffit, ni stealth ni Playwright necessaires.
  (Contraste : `curl` direct sur un lien court `fiverr.com/s/XXXX` renvoie **403** — passer par
  Firecrawl, qui resout la redirection et rend la page.)
- **Extraction structuree** : `formats:["json"]` + `jsonOptions.prompt` sort proprement titre,
  vendeur, badges, note, nombre d'avis, pays, anciennete, et les 3 forfaits avec prix/delais/
  revisions. C'est la voie la plus rentable, bien avant le markdown brut (52 Ko/page).
- ⭐⭐ **LES VIDEOS SE TELECHARGENT.** Fiverr expose des **poster frames** `.png` sur
  `fiverr-res.cloudinary.com`. **Remplacer l'extension par `.mp4` donne le fichier source.**
  25 videos recuperees ainsi (demos de gig + portfolios clients).
  ⚠️ Un `HEAD` renvoie `HTTP 200` + `content-length: 0` : **ne prouve rien**. Telecharger
  reellement et verifier avec `ffprobe` (cf. `feedback_upload-hosts-fallback.md`, meme piege).
  ⚠️ Telecharger **en sequentiel** : 12 `curl` lances en parallele dans le meme dossier ont tous
  echoue silencieusement, les memes en boucle simple ont tous reussi.
- ⭐⭐⭐ **LES AVIS EXPOSENT LE PRIX REELLEMENT PAYE.** Chaque avis porte sa fourchette de commande
  (« $200-$400 »), sa duree de projet, et le marqueur « Ongoing collaboration ». **C'est la seule
  source qui dit le prix PRATIQUE contre le prix AFFICHE** — l'ecart mesure va jusqu'a x6.
  ⛔ Necessite **`waitFor: 12000`** (ms). En dessous, la section n'est pas encore rendue et
  l'extraction revient vide sans erreur.

## ⛔ LA LIMITE — ne pas re-tenter sans nouveau moyen

**Les pieces jointes aux avis (livrables clients) ne sont PAS dans le HTML.** Elles se chargent au
clic. Verifie en localisant la zone des avis dans le `rawHtml` (2 Mo) : elle contient le texte, la
note, le prix, la duree — **zero asset**.
→ **Relier un livrable precis a un montant paye est HORS DE PORTEE** par scrape statique.

⛔⛔ **Une extraction a renvoye la MEME piece jointe pour DEUX clients differents** — le modele
avait attrape une image du **carrousel portfolio** (section separee) et l'avait rattachee aux avis
par proximite. **Resultat faux, ecarte.** Regle : tout mapping livrable→client→prix issu d'une
extraction par prompt doit etre verifie contre le HTML brut avant d'etre presente comme un fait.

✅ **Ce qui reste faisable** : les pieces du **portfolio public** du vendeur (chemins
`video-attachments/delivery/asset/<hash>/<nom>.mp4`), avec leurs **noms de projets clients reels**
— mais sans prix associe.

## Cout

`firecrawl_scrape` avec `formats:["json"]` = **5 credits/page**. `formats:["links"]` = 1.
Une recherche `firecrawl_search` = 4. Budget d'une reconnaissance de 9 gigs + avis : ~70 credits.
