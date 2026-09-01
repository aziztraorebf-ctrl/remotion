Vecu 2026-08-16 (Gazoduc Acte 5, robinet qui s'ouvre). Pour faire tourner le volant d'un robinet
dessine par GPT-5.5, j'ai enchaine **4 essais mesures** en desossant son SVG a la main :
1. centre de rotation en coordonnees ECRAN → le volant part hors cadre et disparait ;
2. centre local ESTIME (430,350) → il se detache de sa tige de 30px ;
3. centre local MESURE sur la bbox (426,380) + `rotate()` → il BASCULE dans le plan de l'image
   (se couche sur le cote) au lieu de tourner sur son axe ;
4. `scaleX` oscillant → enfin credible (un volant de profil tourne autour d'un axe VERTICAL).

**Aziz** : « au lieu de se casser la tete, autant envoyer les SVG a GPT ou a Fable et lui demander de
fixer ses groupes et de rajouter les fonctions qu'on veut, au lieu que ce soit a nous de tout faire. »

**Why** : le modele qui a DESSINE l'objet sait ou est son axe, quels traces forment quelle piece, et
comment les regrouper. Moi je le decouvre par mesure et par essai/erreur — c'est plus lent, et chaque
essai coute un render. Le desossage manuel reste legitime quand la structure est deja bonne (ex :
greffe d'un seul `path`, panneau 1) ; il devient absurde des qu'il faut INVENTER un decoupage.

**How to apply** :
- Dans le brief de generation SVG, exiger d'emblee : groupes nommes par PIECE MOBILE (`#wheel`,
  `#handle`, `#lid`), avec le **centre/axe de rotation documente en commentaire** dans le SVG.
- Si un SVG deja recu resiste : le RENVOYER a son modele avec la demande precise (« separe le volant
  du corps, donne-moi son centre de rotation, prevois que je vais l'ouvrir d'un quart de tour »)
  plutot que d'ouvrir les `d=` a la main.
- Seuil concret : **2 essais infructueux sur le meme pivot** → deleguer au modele. C'est le protocole
  « 2+ echecs = deleguer » (CLAUDE.md global) applique au SVG, pas seulement au debug technique.

Lie a [[feedback_gemini-image-to-image-ordre-des-parts]] (meme famille : suspecter NOTRE cablage
avant de conclure a une limite du modele).
