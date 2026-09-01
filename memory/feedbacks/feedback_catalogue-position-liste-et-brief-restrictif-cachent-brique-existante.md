Preuve : test à 6 agents Claude Code contexte vierge (2026-08-07, session "studio réutilisable") —
4 agents sur l'Acte 3 Gazoduc réel + 2 sur des sujets 100% fictifs (barrage transfrontalier, dévaluation
monétaire, zéro lien avec un épisode réel). Trois mécanismes de trou/succès identifiés, tous vérifiés sur
cas concrets, pas des suppositions :

1. **Position en fin de liste = trou de découvrabilité, même dans un catalogue bien peuplé.**
   `KhartoumEtatMajorSVG` (5e et dernière variante d'une liste de 5 dans `WARMAP-COMPOSANTS-INDEX.md`
   § "MOTEUR D'AFFRONTEMENT 2 FACTIONS") a été manquée par 3 agents sur 3, chacun ayant pourtant suivi
   correctement la méthode intention→forme→catalogue. Un 4e agent, brief identique mais avec l'instruction
   explicite "lis les listes de catalogue jusqu'au bout, pas seulement les 2-3 premières entrées", l'a
   trouvée sans effort. Le catalogue n'était pas en cause — l'absence de consigne de lecture exhaustive l'était.

2. **Un brief trop restreint peut cacher une brique existante, indépendamment de la qualité du catalogue.**
   Les 3 premiers agents avaient reçu un brief "focus Segment A [cartographique]" — ils ont traité les
   Segments B/C en survol plutôt qu'avec la même rigueur, ratant une brique pertinente pour B. Une fois
   le brief élargi (poids égal aux 3 segments), la brique a été trouvée ET évaluée honnêtement (retenue ou
   écartée selon l'intention réelle, pas juste "trouvée donc appliquée").

3. **Un agent qui vérifie sur disque peut détecter et corriger nos propres erreurs de catalogage, le jour même.**
   L'agent testé sur le sujet fictif "dévaluation monétaire" a grep les fichiers réels avant de recommander
   une brique — et a détecté que 5 entrées écrites le matin même dans `COMPOSANTS-INDEX.md`
   (`PriceTagImpact`, chemin faux ; puis `ImpactStamp`/`TetherFlow`/`PopulationDots`/`SelfWritingSignatures`,
   noms de composants inventés/reformulés à partir d'une lecture de code, jamais isolés en fonction nommée
   dans le fichier source réel) ne correspondaient pas à la réalité du code. Toutes corrigées le même jour.

**Why** : un catalogue de composants réutilisables n'est utile que si (a) toute son étendue est lue, pas
juste le début, et (b) le brief donné à l'agent qui cherche ne restreint pas artificiellement son périmètre
de recherche. Un rattrapage d'indexation rapide (plusieurs agents en parallèle, comme celui du 2026-08-07 —
voir [[STUDIO-REUTILISABLE-GATE]]) produit forcément quelques erreurs de nommage/chemin ; la vraie garantie
n'est pas "zéro erreur à l'écriture" mais "un mécanisme qui les détecte vite" — ici, des agents de test qui
vérifient sur disque avant de recommander.

4. ⭐⭐ **Une entrée de catalogue qui affirme une ABSENCE est aussi faillible qu'une entrée qui affirme
   une présence — et bien plus dangereuse.** Ajout 2026-08-15 : `INTENTION-FORME-INDEX.md` déclarait
   `⛔ AnimatedCaravan.tsx = fichier FANTÔME (cité en mémoire, n'existe pas)`. **Faux** — le fichier
   existe (`_reference-atlas-poc/composants-tsx/AnimatedCaravan.tsx`, tracké par git), vérifié par
   `ls` + `git ls-files` en 10 secondes. La note voulait probablement dire « non porté / inutilisable
   depuis `src/` » (ce qui est vrai : imports locaux au POC non résolus) et l'a durci à tort en
   « n'existe pas ». Une entrée « ça n'existe pas » ferme la recherche : personne ne va vérifier, et
   la brique reste invisible pour toujours. Deux autres pièges trouvés le même jour dans le même
   fichier : un chemin de dossier faux, et **deux composants distincts portant le même nom**
   (`GeoFlowConnection` dans `_shared/mapbox/` = sprite orienté vs dans `warmap/_shared/` = marqueur
   nu, contrats opposés, l'un dormant l'autre publié) sans aucune levée d'ambiguïté.

**How to apply** :
- ⭐ **Vérifier sur disque toute affirmation d'ABSENCE avant de s'en servir** (`ls` + `git ls-files`,
  10 secondes) — et ne jamais ÉCRIRE « n'existe pas » sans l'avoir fait. Formuler la vraie nature du
  problème (« non porté », « imports non résolus », « archivé ») plutôt qu'une absence, qui est
  presque toujours une exagération d'un « inutilisable en l'état ».
- ⭐ **Deux composants homonymes = piège d'import garanti.** Si un grep de nom renvoie 2 fichiers,
  l'écrire explicitement dans le catalogue avec le contrat de chacun, pas seulement le nom.
- Toute liste de variantes/briques dans un catalogue (WARMAP-COMPOSANTS-INDEX, COMPOSANTS-INDEX, etc.)
  devrait porter une consigne explicite "lire jusqu'au bout, ne pas s'arrêter à la 1ère correspondance
  plausible" — pas encore appliqué partout, à faire au prochain passage sur ces fichiers.
- Avant de conclure qu'un catalogue est complet/suffisant, tester sa découvrabilité avec un brief LARGE
  (pas restreint à une sous-partie du sujet) — un brief trop ciblé peut donner un faux négatif.
- Un test périodique sur sujet 100% fictif (aucun biais de mémoire de session) est un bon détecteur
  d'erreurs de catalogage fraîches — à refaire après chaque rattrapage/enrichissement de catalogue
  significatif, pas une seule fois.
- Corollaire pour l'Agent EXTRACTOR (`~/.claude/skills/wrap/SKILL.md`) : quand il décrit un mécanisme
  repéré dans le code, il doit citer le NOM RÉEL de la fonction/composant (vérifié par grep), pas un nom
  descriptif inventé — sinon un futur agent qui grep ce nom pour vérifier l'existant échouera à tort.
