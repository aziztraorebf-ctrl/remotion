**De FACE, une stick figure ne peut PAS marcher** — les jambes ne peuvent que glisser, ce qui
produit exactement le defaut "l'objet glisse sans intention" que la doctrine proscrit.
**De PROFIL, les jambes s'ecartent en CISEAU dans le plan de l'image** : la marche devient
naturelle, et surtout **plus SIMPLE a animer**, pas plus compliquee.

**Why:** constat d'Aziz (2026-07-26, beat 4 CFA "le filet de securite"). J'avais code le
funambule de face ; il glissait sur son fil. Aziz a identifie la cause (le plan de vue) ET la
solution, en notant que le profil serait "peut-etre plus simple etant donne que c'est un simple
stick figure". Prouve dans la foulee : le personnage marche, trebuche, chute et rebondit dans un
filet — le tout en SVG frame-driven, sans rig.

Portee reelle : **la doctrine ecartait le "personnage complet anime" en prod ("pantin bien anime",
non maitrise). Cet ecart vaut pour le personnage RICHE (organique, articule, gros plan), PAS pour
la stick figure de profil.** Aziz : "ça prouve qu'on n'a pas a s'inquieter d'animer un stick
figure (...) ce qui ouvre des possibilites pour d'autres videos ou scenes plus narratives, je
pense qu'on vient de debloquer quelque chose d'assez interessant. Et ça marche tout a fait avec
le style SVG minimaliste aussi."

**How to apply:** des qu'une scene demande un humain qui SE DEPLACE (marcher, avancer vers un
objet, 2 personnages qui interagissent, quelqu'un qui tombe), coder la silhouette **de profil** :
- 2 jambes en ciseau depuis une hanche commune (`Math.sin(phase)` sur l'angle d'ouverture),
- un leger bob vertical du corps (`Math.abs(Math.cos(phase))`) — c'est ce qui fait lire "il marche",
- pas d'articulation genou/cheville : inutile a petite taille, et c'est ce qui fait le pantin.
Implementation de reference : `FunambuleProfil` dans
`src/projects/_rnd/fable-svg/CfaActe4Filet16x9.tsx` (worktree CFA).

⛔ Corollaire : si le personnage doit rester de FACE, il ne doit PAS se deplacer lateralement —
l'immobiliser et ne faire vivre que son equilibre. Voir [[premium-d-abord-anti-paresse]] et la
regle "un element ne glisse jamais sans intention narrative".
