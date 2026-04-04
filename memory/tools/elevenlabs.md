# ElevenLabs TTS — Regles francais
> Prononciation, tags TTS, gotchas. Scanner AVANT chaque generation audio.
> Mise a jour : 2026-04-02

---

## Regles de prononciation (NON-NEGOTIABLE)

1. **ZERO participe passe en "e/ee" en fin de groupe** : ElevenLabs drop l'accent final.
   - INTERDIT : "terrifie", "hante", "obsede", "tente", "prepare", "racontee", "traversee"
   - CORRECTION : reformuler avec verbe conjugue ("la terreur le saisit", "l'horizon le hante")
2. **ZERO "ont + voyelle"** : liaison bizarre. Remplacer par passe simple ("ont accosthe" -> "firent escale")
3. **Noms de villes "s" final** : liaison bizarre. Ecrire sans "s" phonetique ("A Londre,")
4. **Nombres en lettres** : "1311" -> "treize cent onze" (TTS lit les chiffres de facon robotique)
5. **Accents obligatoires** dans le script Python : "hante" sans accent -> prononce "hant". Toujours ecrire les accents.
6. **Majuscules INTERDITES** : artefacts garantis, voix qui grince. Emphase = ponctuation (tirets, points de suspension).

### Scan obligatoire AVANT generation
Avant generation, lister TOUS les mots en "e/ee" du script et verifier un par un.

---

## Tags TTS (ElevenLabs V3 + Fish Audio S2)

| Tag | Verdict |
|-----|---------|
| `[pause]` / `[long pause]` | Fiable. `[long pause]` = ~1.5-2s. |
| `[sad]` | Fiable |
| `[whispering]` | Aleatoire (1/2). Tester et regenerer. |
| `[sighing]` | Neutre (respiration, pas vrai soupir) |
| `[panting]` / `[soft]` | Eviter / Ignore |
| `<break time="Xs" />` | NON SUPPORTE en V3. Utiliser `[pause]`. |

- Emotion contextuelle sans tag souvent meilleure que tags explicites.

---

## Voix actives

Voir `memory/voices-v3.md` pour les IDs de voix permanents (Narratrice + Narrateur africains V3).
