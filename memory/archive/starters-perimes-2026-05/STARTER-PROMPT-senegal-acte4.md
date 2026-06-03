# STARTER PROMPT — Sénégal Acte 4 (L'IMPLICATION — final épisode)

> Coller ce fichier en début de session. C'est la dernière scène de l'épisode.

---

## Contexte session précédente

**Acte 3 COMPLET (2026-05-24)** :
- Beat11 (Mécanisme 1 — Contrat) : `beat11-FINAL.mp4`
- Beat12 (Mécanisme 2 — Piège Norvège) : `beat12-FINAL.mp4`
- Beat13 (Mécanisme 3 — Coulisses Yakaar) : `beat13-FINAL.mp4`

**Acte 4 = dernière scène à produire.** Après ça, montage final épisode.

---

## Brief créatif Acte 4

**Script (SCRIPT-V2.md, lignes 305-340)** — ne pas réécrire, juste exécuter :

```
"Voilà où en est le Sénégal.
Un pays qui, en dix mois, est passé de zéro à exportateur de pétrole et de gaz.
Des garde-fous qui existent — le FONSIS, l'ITIE [...] — et une loi qui oblige
les compagnies étrangères à recruter et former des Sénégalais sur place.

Et des fragilités réelles aussi. Une dette élevée. Des contrats pas entièrement
publics. Un troisième champ dont l'avenir dépend de qui sera à la table.

La Norvège et le Botswana n'ont pas réussi par accident. Ils ont construit des
règles au moment précis où l'argent n'était pas encore là. C'est le moment le
plus difficile pour le faire — et le seul où c'est encore possible.

Le Sénégal est exactement dans ce moment-là. Maintenant.

[FOND NAVY, TEXTE GOLD]
"Les décisions prises dans les cinq prochaines années vont définir la prochaine génération."

[CTA prochaine vidéo — fonds souverains africains]
```

**Ton** : récapitulatif analytique → bascule émotionnelle finale → CTA discret.
**Durée** : 346.36s → 420.26s = **73.9s = 2217 frames @ 30fps**.

---

## Timestamps Whisper (mots-pivots) — DÉJÀ MESURÉS

| Timestamp | Mot pivot | Phase narrative |
|---|---|---|
| **346.36s** | "Voilà" | DÉBUT BEAT — startFrom audio |
| 347.54s | "Sénégal" | Bilan ouvert |
| 372.10s | "fragilités" | Bascule positif → fragilités |
| 384.36s | "Norvège" | Comparaison Norvège/Botswana |
| 399.72s | "Sénégal est exactement" | Punch ligne |
| 405.04s | "décisions" | Phrase clé fond navy |
| 413.44s | "vidéo" | CTA |
| **420.26s** | (fin) | endAt audio |

**Calcul frames** depuis `startFrom = 10391` (346.36s × 30 = 10390.8) :
- "fragilités" → +25.74s → f772
- "Norvège" → +38.00s → f1140
- "Sénégal exactement" → +53.36s → f1601
- "décisions" → +58.68s → f1760
- "vidéo" → +67.08s → f2012
- Fin → f2217

---

## Mécaniques à inventer (PAS de réutilisation paresseuse)

**Règle premium-d'abord** (DOCTRINE §1) : viser le mieux, pas le facile. Mais réutilisation OK si justifiée (DOCTRINE §2).

**Phases narratives suggérées** (à challenger en début de session, pas figées) :

1. **A — Bilan ouvert (f0→f772, ~26s)** — "Sénégal en dix mois..."
   - Idée : Dezoom Mapbox progressif (Yakaar → Sénégal → Afrique de l'Ouest → globe). Continuité avec Beat13 qui finit zoomé sur Yakaar. Le dezoom raconte "voilà où on en est".
   - Garde-fous (FONSIS, ITIE, loi local content) apparaissent comme **3 piliers** debout, animés en spring.

2. **B — Fragilités (f772→f1140, ~12s)** — "Et des fragilités réelles..."
   - Idée : Les 3 piliers se fissurent / s'inclinent. Anti-paresse : pas de simple liste, mais une mécanique visuelle qui exprime "ça tient mais c'est fragile".
   - 3 fragilités : dette, contrats opaques, Yakaar incertain (rappel visuel du Beat13).

3. **C — Comparaison Norvège/Botswana (f1140→f1601, ~15s)** — "ont construit des règles au bon moment"
   - Idée : Timeline parallèle — Norvège 1969 / Botswana 1967 / Sénégal 2024. Le **point commun** = règles AVANT l'argent. Mécanique = curseur temporel qui place les 3 pays sur l'axe "AVANT/APRÈS l'argent".

4. **D — Punch + Phrase clé (f1601→f2012, ~14s)** — "Le Sénégal est exactement dans ce moment-là. Maintenant."
   - Idée : Transition fond kraft → fond navy `#16213a`. Texte gold géant : "LES DÉCISIONS DES 5 PROCHAINES ANNÉES VONT DÉFINIR LA PROCHAINE GÉNÉRATION."
   - Typographie premium, pas de surcharge. Respiration.

5. **E — CTA (f2012→f2217, ~7s)** — "la prochaine vidéo..."
   - Idée : Discret. Pas de gros bouton youtube. Une ligne sobre + flèche fine. Couleur gold subtile.

---

## Contraintes techniques (rappel rapide)

**Audio** :
- `startFrom={10391}` (346.36s) | `endAt={12608}` (420.26s)
- Narration : volume normal (pas de mute initial nécessaire — la voix démarre dès f0)
- Musique : **loop obligatoire** si elle s'arrête (piste 321s, beat démarre à 346s → musique déjà épuisée → relancer depuis 0 dès f0). Voir DOCTRINE §3.7 point 4.

**Mapbox (Phase A)** :
- Watermark masqué via `<style>` dans le container (DOCTRINE §3.7)
- `MAPBOX_STYLES.dark`, useEffect simple sans delayRender
- Render via `./scripts/render-mapbox.sh "Senegal-Beat14" out/episodes/senegal-petrole-gaz/wip/beat14_v1.mp4`

**Workflow** :
1. Whisper d'abord pour confirmer les pivots (déjà fait ici, mais re-vérifier si modif)
2. Proposer les 5 mécaniques de phase à Aziz AVANT de coder
3. Coder phase par phase, mini-render entre chaque
4. Pipeline `beat-session.py` accepte maintenant le pattern constantes inline (pas besoin de manifest.ts)

---

## NEXT après Acte 4

Montage final épisode complet : `acte1-FINAL` + `acte2-FINAL` + Beat10/11/12/13 + Beat14 → `senegal-petrole-gaz-FINAL.mp4` dans `out/PRET-PUBLICATION/`.

**Vérifier avant montage** : continuité audio entre actes (pas de cut brutal, fade musique cohérent).

---

## Commande de démarrage suggérée

```
Acte 4 Sénégal — dernière scène épisode. Lis memory/STARTER-PROMPT-senegal-acte4.md.
Avant de coder : propose-moi les 5 mécaniques de phase (A→E) en 1 paragraphe
chacune, avec les patterns existants que tu réutilises et ceux que tu inventes.
J'attends ta proposition créative AVANT toute génération de code.
```
