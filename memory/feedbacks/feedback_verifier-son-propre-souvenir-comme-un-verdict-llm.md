# Mon souvenir d'un livrable se vérifie comme un verdict de LLM

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Le 2026-07-29 (session CFA), j'ai accuse Gemini d'avoir **hallucine** une scene : « un compteur de
prix qui s'emballe sur un sac de riz », que j'ai declare absente de l'episode. Puis j'ai inscrit
cette fausse accusation **dans le brief de Kimi**, en lui interdisant de commenter cette scene.
Kimi l'a commentee quand meme — et il avait raison : le beat 6b contient bien un sac de riz avec
une estampille de prix, exactement au timecode que les deux modeles citaient (3:45-4:10). Le code
le disait noir sur blanc (« l'estampille FRAPPE le prix dans la toile »). Je confondais avec le
prototype « porteur » du matin.

**Why** : la doctrine dit « verifier le verdict d'un agent/LLM dans le code reel avant de le
presenter comme un fait ». Je l'ai appliquee **contre** les modeles et pas **contre moi**. Or mon
souvenir d'un livrable est exactement le meme type d'objet qu'un verdict de LLM : une affirmation
plausible, non sourcee, produite par un systeme qui degrade quand son contexte se charge. Le
symptome d'un contexte sature n'est pas de dire « je ne sais plus » — c'est de se fier a son
souvenir plutot qu'au fichier, avec la meme assurance qu'a une affirmation verifiee. C'est Aziz qui
a fait le diagnostic : « le fait que tu as accuse Gemini ou que tu sembles te souvenir mal de
certaines informations montre que ton contexte est rendu assez charge. »

Cout reel : un brief de review pollue (donc un appel partiellement gaspille), un modele accuse a
tort, et un point presente a Aziz comme un fait alors qu'il etait faux.

**How to apply** :
- Avant d'ecrire « cette scene n'existe pas », « ce composant ne fait pas X », « on n'a jamais
  fait Y » : **grep/Read d'abord**. Une negation sur l'etat d'un livrable est une affirmation
  factuelle, pas un souvenir — elle se source comme la capacite d'un outil (cf.
  [[feedback_relire-lecon-avant-geste-similaire]]).
- **Ne jamais propager un doute non verifie dans un brief adresse a un modele.** Un interdit dans
  un prompt (« ne commente pas X, ca n'existe pas ») a le poids d'un fait : s'il est faux, il
  degrade la reponse et rend le desaccord du modele illisible.
- Quand je contredis un modele sur du factuel, ecrire **la preuve** a cote (chemin + ligne), pas
  la conclusion seule. Si je ne peux pas produire la preuve en une commande, je ne contredis pas.
- ⭐ Traiter la fausse certitude comme un **signal de fin de session**, pas comme un incident
  isole a corriger : c'est le moment de graver et de passer la main, pas de continuer a produire.
  Lie a [[feedback_autocritique-agent-signal-pas-verdict]] et a la regle « verification avant
  affirmation » (cas 5 : mon propre etat d'execution).

---

## Cas 2026-08-15 — une ALERTE de MEMORY.md relayée sans vérifier l'état réel

J'ai affirmé à Aziz qu'un livrable FINAL « dormait non publié » et je le lui ai présenté comme un
point de douleur. **Faux** : Soudan était programmé au 20/08, CFA au 11/08.

⭐ **Le plus instructif : la mémoire, elle, était JUSTE.** Vérification faite en clôture, `MEMORY.md`
§ PUBLICATION dit noir sur blanc « CFA/Soudan **programmés** ». Je n'ai donc pas relayé une note
périmée — j'ai relayé **mon souvenir d'une note** (l'alerte « si un FINAL dort → le signaler », lue
en début de session) **sans relire la ligne qui donnait l'état réel**. La source était bonne et à
portée ; je ne l'ai pas rouverte.

**Le piège** : une alerte formulée à l'impératif (« signaler si… ») se mémorise comme un fait
(« il y a un FINAL qui dort »). L'impératif conditionnel devient un constat dans le souvenir.

**Règle** : toute alerte de mémoire formulée au présent sur un état (« X dort », « Y n'est pas fait »,
« Z est bloqué ») est une **hypothèse à vérifier** dans la source qu'elle désigne elle-même, avant
d'être relayée. Un signalement faux coûte plus cher qu'un signalement absent : il fait douter Aziz de
son propre suivi.
