**Une convergence de modeles mesure ce qu'on lui a demande de mesurer.** Si le brief ne pose pas
le bon critere comme ELIMINATOIRE, la convergence est un faux signal — elle mesure alors
l'elegance, la richesse ou la nouveaute, pas ce qui compte.

**Why:** 2026-07-26, refonte du beat 4 CFA. Passe upstream a 3 voix (Gemini + Kimi + DeepSeek),
brief demandant "une direction neuve" pour 32,5 s. Les 3 ont converge spontanement sur une **coupe
verticale de terrain** (nappe d'or en profondeur = la garantie / veines de surface = le depot).
J'ai suivi ce signal en invoquant [[convergence-spontanee-2-modeles-signal-fort]].

Aziz a stoppe : "est-ce que quelqu'un peut comprendre dans une seconde ou deux (...) ou est-ce que
ça devient trop complexe comme metaphore ? Ne pas retourner dans le piege que nous avions eu avec
la scene 6b." Verification a froid : la scene demandait **5 conventions arbitraires a memoriser**
(nappe = garantie financiere, cailloux = reserves, veines = obligation de depot, eboulement =
reforme juridique, pulsation = permanence). Exactement le defaut de la v1 du beat 6b, rejetee pour
"trop abstrait, je n'arrivais pas a comprendre en quoi tout ceci avait rapport l'un avec l'autre".

**La convergence etait reelle mais hors-sujet** : mon brief demandait une image forte et interdisait
la redondance avec le beat 2 ; il ne posait NULLE PART "comprehensible en 2 secondes par quelqu'un
qui ne connait pas le sujet". Les 3 modeles ont donc optimise la force de l'image. Ils ont bien
repondu — a la mauvaise question.

**How to apply:**
1. Avant toute passe LLM (upstream ou downstream), ecrire le critere N°1 **en toutes lettres et
   comme ELIMINATOIRE** dans le brief. Pour nos scenes : "si un spectateur qui ne connait rien au
   sujet ne comprend pas en 2 s, la proposition est rejetee, quelle que soit sa beaute".
2. Une convergence reste un signal fort — mais **verifier d'abord qu'elle porte sur le bon axe**
   avant de la suivre. Question de controle : "sur quoi exactement ont-ils converge, et est-ce que
   c'est ce que je voulais mesurer ?"
3. Le **test aveugle** est la parade concrete : appel SEPARE, extrait COURT (6-12 s), sans son, sans
   script, a un modele sans contexte : "que comprenez-vous ?". Un modele qui a vu la video entiere a
   deja vu le denouement — il comprend forcement, sa reponse ne prouve rien. Prouve utile le
   2026-07-26 (le filet a passe le test : "filet de securite ou fondation de soutien" + sujet devine).

Voir aussi [[feedback_doute-utilisateur-post-verdict-jury-llm-priorite]] (le doute d'Aziz prime sur
un verdict LLM) et [[premium-d-abord-anti-paresse]].

---

## 2e cas (2026-08-27, repro Foster) — la convergence peut etre FACTUELLEMENT fausse

Le cas de juillet montrait 3 modeles convergeant sur une bonne reponse **a la mauvaise question**.
Ici, breakdown du plan 10 a 3 voix (Gemini + GPT + Grok) : les 3 ont converge sur deux affirmations
simplement **FAUSSES**, et toutes deux structurantes — coder d'apres leur releve aurait produit un
faux plan.

1. **« Coupes franches entre les phrases »** (Grok en annoncait 5, Gemini idem) -> la diff
   inter-frames **PLAFONNE a 3,08** sur 372 frames : ce sont des fondus. Une vraie coupe donne
   > 90 (mesure : 94,3 et 150,5 aux plans 8 et 9 de la meme video).
2. **« Tout est centre a 50 % »** (Gemini ET GPT) -> chaque phrase a une **ANCRE GAUCHE FIXE** :
   pendant que la phrase 1 s'allonge de 99 a 1355 px, `x0` ne bouge pas d'un pixel.

⛔ **La regle qui s'ajoute** : sur une question a reponse MESURABLE (geometrie, timing, amplitude),
une convergence a 3 voix ne remplace pas la mesure — elle la rend seulement plus **tentante a
sauter**. Les modeles decrivent QUOI, ils ne mesurent pas COMBIEN.

⭐ **Corollaire, pour savoir quand la convergence vaut quelque chose** : elle est un signal sur les
questions de JUGEMENT (direction, lisibilite, force d'une image) ; sur une question de FAIT
geometrique ou temporel, l'unanimite de 3 modeles vaut **zero mesure**.

⚠️ Ce qui reste vrai : la 3e voix a quand meme paye. Grok (le plus riche, 10 331 car. contre 4 085
a Gemini) a ete le SEUL a voir 3 details reels — « FosterWith » colle sans espace avec le split de
couleur au milieu du mot, le « x » plus petit, le logo qui reste sur le noir final. **Les faire
diverger sert ; les croire sur un chiffre, non.**
