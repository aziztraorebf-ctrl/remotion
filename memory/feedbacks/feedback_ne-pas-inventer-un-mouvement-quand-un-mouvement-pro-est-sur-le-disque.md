# ⛔ Ne pas INVENTER un mouvement quand un mouvement PRO dort sur le disque

> Repere par Aziz le 2026-08-29, sur le cycle de marche du personnage V3.
> **3e occurrence du meme piege dans la MEME session.**

## Ce qui s'est passe

J'ai anime un cycle de marche en ecrivant des **sinusoides a la main** : amplitudes
devinees, dephasage devine, flexion de genou devinee. Verdict d'Aziz : « le balancement
des jambes n'est pas naturel, ce n'est pas ce qu'un professionnel ferait ».

⛔ **Pendant ce temps, `13_Hiker_Walking_Theme_Cycle.lottie` etait sur notre disque** —
un cycle de marche COMPLET, fait par un pro, **13 calques en rotation animee**. Je l'avais
demonte pour mesurer sa GEOMETRIE (proportions, recouvrements) sans jamais penser a lire
ses **CLES D'ANIMATION**. J'avais la reponse sous la main et j'ai invente a cote.

## La regle

**Un mouvement qui existe deja, valide par un professionnel, se REJOUE — il ne se
re-invente pas.** C'est ce qui a fait la reussite des 2 meilleurs travaux du projet :
- le **douanier** : on a repris SON geste, on ne l'a pas invente ;
- le **chien** : construit en visant une piece pro, pas depuis l'imagination.

⭐ Corollaire outille : notre format de **partitions** (`_shared/stick-figure-svg/
partitions/`) sert justement a ca — **importer** une table de cles mesuree sur une piece
pro, pas a heberger des valeurs devinees.

## ⚠️ AVERTISSEMENT — ceci n'est PAS un interdit definitif

Aziz insiste : **on se permet de TESTER**. Inventer un mouvement reste legitime pour un
proto, une mecanique qu'aucune reference ne couvre, ou pour explorer. Ce qui est proscrit,
c'est d'inventer **par defaut, sans avoir regarde si une reference existait** — et de
presenter le resultat comme s'il valait un mouvement valide.
=> Le reflexe a acquerir : **CHERCHER d'abord** (« ce geste existe-t-il deja, mesure,
quelque part sur le disque ? »), inventer ensuite **en le disant**.

## Le pattern plus large (3 occurrences le meme jour)

1. **planche_calques.py** : outil existant inadapte, resultat faux mais plausible.
2. **Les gestes stick-figure** : ~70 lignes de code raisonne reecrites a chaque geste,
   alors que le format « table de nombres » existait chez les pros.
3. **Ce cycle de marche** : invente alors que le Hiker etait sur le disque.

⭐ Le fil commun : **je regarde ce que je sais faire avant de regarder ce qui existe deja.**
Recoupe `reutiliser-assets-approuves` et la regle CLAUDE.md « ameliorer/remplacer
l'existant avant de creer ».

## Ce qui reste vrai malgre tout

Les acquis de la session ne sont pas annules : le **brief structurel chiffre** (Fable bat
3 modeles), le **format de geste en nombres**, et la mesure « 2 pieces pilotables sur 23 ».
⭐ Le format de partitions devient meme PLUS utile avec cette lecon : c'est le vehicule
qui permet de **rejouer** une marche pro au lieu de la deviner.
