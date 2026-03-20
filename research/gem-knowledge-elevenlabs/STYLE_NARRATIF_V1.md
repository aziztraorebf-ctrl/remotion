# STYLE_NARRATIF — Ecriture pour ElevenLabs francais
> Version 1.0 — principes de rythme, emphase, structure narrative
> Contexte : videos documentaires YouTube / YouTube Shorts, ton epique

---

## Principe fondamental

Un script TTS n'est pas un script lu a voix haute par un humain.
Il est LU par une machine qui interprete les signaux typographiques.
Chaque decision d'ecriture a un impact sonore direct.

---

## 1. Longueur des phrases — rythme narratif

**Court = impact.** Les phrases courtes frappent plus fort en TTS.

**Mauvais :**
> "Abou Bakari II, qui etait le Mansa du Mali et regnait sur l'empire le plus riche du monde, etait pourtant obsede par l'horizon."

**Bon :**
> "Abou Bakari II. Mansa du Mali. Roi des rois. Il regne sur l'empire le plus riche du monde. Mais il est obsede par l'horizon."

**Regle :** phrases de 5-12 mots pour le rythme epique. Varier : courte / longue / tres courte (choc).

---

## 2. Structure en "coups"

Le documentaire YouTube Shorts fonctionne en revelations successives.
Chaque phrase = une nouvelle information. Pas de subordonnees empilees.

**Pattern efficace :**
```
[Contexte court.]
[Fait surprenant.]
[Consequence.]
[Choc final.]
```

Exemple :
> "Un seul bateau revient. Le capitaine est terrorise. Un courant titanesque. En plein milieu de la mer !"

---

## 3. Pauses strategiques avec `<break>`

Les pauses ne sont pas des silences — elles sont des moments de tension.

**Avant une revelation :**
> "Personne ne sait ce qu'il y a de l'autre cote.<break time="0.6s" />Personne... sauf UN homme."

**Apres un chiffre frappant :**
> "Quatre cents milliards de dollars actuels.<break time="0.8s" />Abou Bakari a TOUT abandonne... pour une boussole."

**Pour creer un rythme haletant :**
> "Il laisse son trone.<break time="0.3s" />Son or.<break time="0.3s" />Son pouvoir absolu."

---

## 4. Emphase — quand utiliser les majuscules

Majuscules = emphase vocale forte. A reserver pour les mots qui changent le sens.

**Bon usage :**
- Contraste : "Au lieu de reculer... Abou Bakari ABDIQUE."
- Surprise : "Il monte LUI-MEME dans l'une des embarcations."
- Accumulation : "Il laissa TOUT."

**Mauvais usage :**
- Majuscules decoratives sans intention narrative
- Plus de 2 emphases par paragraphe

---

## 5. Appel a l'action final (CTA)

Le CTA doit sonner naturel, pas commercial.

**Mauvais :**
> "N'oublie pas de liker et de t'abonner si tu as aime cette video !"

**Bon :**
> "Et toi ? Tu penses qu'il a reussi a toucher terre ? Dis-le moi en commentaire."

**Regle :** question directe, ton conversationnel, une seule phrase. Pas de "liker/abonner" dans la voix — le visuel s'en charge.

---

## 6. Adaptation selon la duree cible

| Format | Duree | Mots approximatifs | Rythme |
|--------|-------|-------------------|--------|
| YouTube Short | 60-75s | 130-160 mots | Tres soutenu, zero respiration |
| YouTube Long (hook) | 20-30s | 50-70 mots | Rapide, accrocheur |
| YouTube Long (corps) | 90-120s par segment | 200-280 mots | Varie, respiration entre idees |

**Regle Short :** chaque mot compte. Supprimer tout adjectif non essentiel.
Supprimer "qui", "que", "dont" partout ou c'est possible sans perdre le sens.

---

## 7. Nos projets — ton reference

### GeoAfrique — Abou Bakari II
- Ton : epique, cinematique, mysterieux
- Modele de reference : voix-over documentaire Netflix en francais
- Phrases courtes, revelations en cascade, CTA conversationnel
- Exemple : "Cent quatre-vingt-un ans plus tard... Christophe Colomb debarquait en Amerique."

### Peste 1347
- Ton : grave, solennel, historique
- Phrases un peu plus longues, rythme plus lent
- Atmosphere pesante maintenue — pas de CTA "fun"

---

## 8. Ce qui ne se corrige PAS en post-production

Si une phrase sonne mal apres generation, la solution n'est PAS de changer les parametres voix.
La solution est de **reecrire la phrase**.

Les parametres voix (stability, style) changent le caractere general de la voix.
Ils ne corrigent pas une construction grammaticale mal lue.

**Si une phrase sonne mal :** réécrire d'abord, regénérer ensuite.
