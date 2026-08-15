# H3 — Blocs de prompt réutilisables (gabarits copiables)

> **Ce fichier est un presse-papier, pas un cours.** Chaque bloc ci-dessous a fait la différence
> mesurée entre un échec et une réussite sur un clip réel. Les copier tels quels, adapter le sujet.
> Contexte, mesures et historique : `memory/tools/minimax-h3-comfy-cloud.md`.
> Quand les utiliser : `src/projects/_shared/INTENTION-FORME-INDEX.md` § INSERT MATIÈRE / INSERT LIEU.

## Structure d'un prompt R2V qui marche (ossature)

```
<Picture 1> is the exact starting frame. Animate ONLY <ce qui doit bouger>.
<tout le reste> is COMPLETELY STATIC and never moves, never changes shape, never changes color.

0-1s: <micro-action précise>
1-2s: <micro-action précise>
2-3s: ...
3-4s: ...
4-5s: ...

<LOCKS applicables — voir ci-dessous>

STRICT NEGATIVE: <liste de mots-clés courts, séparés par des virgules>
```

Quatre piliers, tous nécessaires (validés A/B) : **(1)** séquençage par tranches · **(2)** décor
verrouillé explicitement · **(3)** LOCK adapté au sujet · **(4)** STRICT NEGATIVE en mots-clés.

⚠️ **Négatifs en MOTS-CLÉS COURTS, jamais en phrases** noyées dans le texte narratif (confirmé 2×) :
une phrase « No horizon line, no ground » est ignorée ; `negative_keywords: horizon, ground` est suivi.

---

## ⭐ SIZE LOCK — quand une QUANTITÉ doit rester constante

**Symptôme sans ce bloc** : le niveau baisse tout seul, la flamme s'éteint, le tas se vide.
**Cause** : n'interdire que « never grows » laisse le modèle faire DÉCROÎTRE. Il faut les deux sens.

```
SIZE LOCK: the <sujet> keeps EXACTLY the same overall size, height and position throughout the
entire clip. It is the SAME size in the last frame as in the first frame. It never grows, never
expands, never gets bigger, AND never shrinks, never dies down, never gets smaller, never goes out.
Only its internal shape churns and flickers in place.
```
+ dans STRICT NEGATIVE : `no growing <sujet>, no shrinking <sujet>, no <sujet> going out`

⛔ **JAMAIS d'adjectif de jugement** dans le prompt (`insufficient`, `scarce`, `failing`, `depleted`) :
le modèle le joue comme une **ACTION à mettre en scène**, pas comme un état. Décrire la quantité de
façon neutre et la verrouiller. *(Cas vécu : « the gas is thin, sparse and insufficient » → la
conduite s'est vidée sur 5 s.)*

---

## ⭐ ANCHOR LOCK — quand l'objet GLISSE de façon crédible

**Pour quoi** : navire, véhicule, avion, char — tout objet qui, dans la vraie vie, se déplace. Le
SIZE LOCK ne suffit pas : H3 suit la logique de l'objet et le fait naviguer/rouler.
**Symptôme** : dérive horizontale (mesurée −15 px sur un FLNG censé être à quai).

**La clé : nommer un REPÈRE FIXE présent dans l'image**, pas juste dire « ne bouge pas ».

```
ANCHOR LOCK (most important): the <sujet> is PERMANENTLY MOORED. Its distance to the <repère fixe
visible: digue / quai / rive / bâtiment> stays EXACTLY THE SAME in every single frame. The <sujet>'s
<extrémités: bow and stern> stay at the exact same horizontal pixel positions from the first frame
to the last frame. It is tied up, not underway.
```
+ STRICT NEGATIVE : `no sailing, no vessel moving, no drifting, no translating sideways, no leaving,
no approaching, no change in distance between <sujet> and <repère>`

→ résultat mesuré après application : **0 px de dérive**.

---

## ⭐ LIGHT LOCK — quand la scène doit garder sa lumière

**Pour quoi** : tout clip en registre JOUR (H3 a un biais à assombrir / basculer en coucher de soleil).

```
LIGHT LOCK: the scene stays bright DAYTIME throughout. The sky stays pale and luminous, the sea
stays <couleur>. It never darkens, never becomes night, never turns into a sunset.
```
+ STRICT NEGATIVE : `no darkening, no night, no sunset, no color change`

---

## ⭐ EMPTINESS LOCK — quand le sujet est une ABSENCE

**Pour quoi** : un plan dont le sens est qu'il ne s'y passe rien (site non exploité, zone
abandonnée). Sans ce bloc, le modèle a une forte tendance à **meubler**.

```
The <lieu> is completely empty apart from <le seul élément présent>. Nothing arrives, nothing
appears, nothing is built. The emptiness is the entire point of the shot and must be preserved for
the full duration.
```
+ STRICT NEGATIVE exhaustif de tout ce qui pourrait apparaître :
`no ship, no vessel, no boat, no platform, no rig, no industrial structure, no crane, no flare,
no tower, no building, no coastline, no land appearing, no people, no birds`

→ validé : 5 s de mer vide, rien n'est apparu.

---

## Rappels d'exécution (pas du prompt, mais indissociables)

- **Image d'abord, toujours** : Gemini compose (verrouille), H3 anime (turbulence seule). ⛔ Jamais
  de T2V pour un insert — le modèle recompose la scène à chaque essai.
- **H3 est LITTÉRAL** : il reproduit fidèlement les défauts de l'image source, il ne corrige rien.
  Soigner l'image AVANT (cadrage, centrage, contact sol, teinte).
- **Piste audio parasite systématique** (node `VAEDecodeAudio`) → monter le clip `muted`.
- **Toujours logger le `prompt_id`** retourné, avant même de savoir si le résultat est bon.
- **Toujours mesurer avant de juger à l'œil** : `scripts/tools/measure-insert-clip.py`.
