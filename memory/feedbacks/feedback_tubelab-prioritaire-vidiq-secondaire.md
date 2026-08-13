# TubeLab = outil PRINCIPAL recherche marché, vidIQ = secondaire

**Regle** : pour toute exploration de marche/niche/sujet nouveau (chaines concurrentes, outliers,
volume de recherche), utiliser TubeLab en premier reflexe. vidIQ reste utile uniquement pour le
scoring de titres/thumbnails et les analytics de la chaine propre a Aziz (Kora & Cartes) — jamais
pour explorer un marche externe.

**Pourquoi** : vecu 2026-08-13 — confusion entre les deux MCP en debut de session (noms de fonctions
proches, ex. `search_outliers`), tentative d'utiliser vidIQ dont les credits etaient epuises (4/20)
alors que TubeLab avait 589 credits disponibles. Aziz a du corriger explicitement ("VidIQ n'a jamais
ete notre outil principal"). Detail deja ecrit dans `memory/tools/tubelab.md` (§ VidIQ MCP — verdict
pas prioritaire) mais l'erreur s'est reproduite malgre la doctrine ecrite.

**Comment appliquer** : avant de choisir quel outil utiliser pour une recherche marche, verifier le
solde de credits (`vidiq_balance` / `get_credits_balance`) plutot que de partir par reflexe sur
vidIQ — ou mieux, aller direct a TubeLab par defaut pour toute exploration/recherche de sujet.
