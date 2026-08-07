# Script voix — NorthShield (V1 brouillon Claude, avant jury LLM)

> Statut : BROUILLON SOUMIS AU JURY — pas encore validé par Aziz. Cible ~55s.
> Structure : 1. Tension (systèmes tout-ou-rien) -> 2. Question/pivot -> 3. Mécanisme (4 signaux)
> -> 4. Preuve UI cas bas risque (Sarah, Toronto, 18/100) -> 5. Preuve UI cas haut risque
> (Sarah, Berlin, 82/100) -> 6. Close / message de marque.

## Texte taggé (version API, accents complets)

```
[serious] Chaque connexion, on la traite pareil. [pause] Trop de contrôles — et vos équipes s'épuisent. Pas assez — et le risque passe inaperçu.

[pause]

[curious] Et si la sécurité savait faire la différence, en temps réel ?

[pause]

[deliberate] NorthShield observe chaque connexion. [pause] L'appareil. Le lieu. L'historique. Le comportement. Quatre signaux, croisés en continu.

[pause]

[calm] Sarah se connecte depuis son ordinateur habituel, à Toronto. [pause] Score DIX-HUIT sur cent. Aucune friction — elle travaille.

[pause]

[tense] Le même compte, un appareil inconnu, cette fois depuis Berlin. [pause] Score QUATRE-VINGT-DEUX. NorthShield le voit — et demande une vérification.

[pause]

[proud] NorthShield. La sécurité se manifeste quand il le faut — [pause] et s'efface le reste du temps.
```

## Version plain-text (forced alignment / sous-titres)

```
Chaque connexion, on la traite pareil. Trop de contrôles, et vos équipes s'épuisent. Pas assez, et le risque passe inaperçu.

Et si la sécurité savait faire la différence, en temps réel ?

NorthShield observe chaque connexion. L'appareil. Le lieu. L'historique. Le comportement. Quatre signaux, croisés en continu.

Sarah se connecte depuis son ordinateur habituel, à Toronto. Score dix-huit sur cent. Aucune friction, elle travaille.

Le même compte, un appareil inconnu, cette fois depuis Berlin. Score quatre-vingt-deux. NorthShield le voit, et demande une vérification.

NorthShield. La sécurité se manifeste quand il le faut, et s'efface le reste du temps.
```

## Scan anti-pièges TTS FR

- Participes é/ée fin de groupe : aucun trouvé en position finale de groupe rythmique.
- "ont + voyelle" : zéro occurrence.
- Chiffres : 18 -> "dix-huit", 82 -> "quatre-vingt-deux", 100 -> "cent", tous en lettres.
- Accents : complets dans la version taggée.
- Durée estimée : ~145 mots -> ~50-55s.

## Pourquoi ce brouillon part au jury avant génération

Décision Aziz (session du 2026-08-06) : réutiliser la méthode jury LLM appliquée à la refonte
script AES (V1->V4, 3 passes) plutôt que de figer ce brouillon directement. Objectif : un script
SaaS avec show-don't-tell, dynamisme motion-design, ton pro mais avec personnalité vivante
(référence Grok : punchy, pas un explainer générique "généré par IA").
