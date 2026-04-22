# Template Hook — Ouverture Short (5s cold-open)

> Pattern validee 2026-04-22 sur Sonjata Papercraft.
> Objectif : maximiser retention sur les 3 premieres secondes (swipe vs stay).

---

## Structure bloc hook (5s)

```
0.0-0.3s : Close-up serre sur un detail visuel fort (main, objet, visage tendu)
0.3-3.0s : Plan plus large qui revele le contexte tout en GARDANT la tension
3.0-5.0s : Narration se termine, silence suspendu, cut vers scene 1
Audio    : narration seule, AUCUNE musique (contraste silence -> musique a scene 1)
```

**Regle absolue** : le hook doit teaser une action/tension **SANS reveler le climax**. Le spectateur doit finir le hook avec une **question ouverte**.

---

## Recette phrase-choc

Formule testee : **"[Constat impossible]. [Promesse au futur]."**

Exemples valides :
- "Cet enfant ne peut pas se lever. Il fondera un empire africain." (Sonjata)
- "Ce village a disparu en 1347. Voici pourquoi c'est un mensonge." (Peste 1347 — a tester)
- "Ce roi africain etait plus riche qu'aujourd'hui toute l'Europe. Son nom a ete efface." (Mansa Moussa — a tester)

### Contraintes techniques phrase
- **Max 14 mots** pour tenir en 5s a debit narratif Narratrice GeoAfrique v2
- **2 phrases courtes** > 1 phrase longue (rythme meilleur)
- **Point fort en fin de 2e phrase** (mot de fin = ce que le spectateur retient)
- **Scan TTS francais obligatoire** (`memory/tools/elevenlabs.md`) :
  - Pas de participe "e/ee" en fin de groupe
  - Pas de "ont + voyelle"
  - Pas de chiffres (ecrire en lettres)

---

## Recette clip visuel (5s)

### Source
Reutiliser un **segment existant** d'une scene deja produite :
- Zero cout (deja rendu)
- Garantit coherence visuelle avec la suite
- Valide l'ancrage narratif (le spectateur revoit ce moment plus tard = payoff)

### Criteres de choix du segment
1. **Tension sans resolution** — l'effort est visible, le resultat non
2. **Close-up au debut** — un detail serre engage immediatement
3. **Pas de dialogue dans le clip** (on met notre propre narration hook)
4. **Preserver le climax** — ne PAS inclure le moment payoff (reserve a la scene concernee)

### Exemple Sonjata
- Segment extrait : 37s-42s du render complet (scene 4, avant le "IL SE LEVE")
- Visuel : main agrippe barre (close-up) -> enfant a genoux qui lutte (plan large)
- Climax preserve : la scene 4 garde toute sa puissance quand elle revient (plan du lever absent du hook)

---

## Integration Remotion

```tsx
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = HOOK_DURATION_S * FPS;

// Hook : silencieux sauf narration
<Sequence from={0} durationInFrames={HOOK_FRAMES} premountFor={FPS}>
  <OffthreadVideo
    src={staticFile("path/to/hook-clip.mp4")}
    muted  // IMPORTANT : le clip source a son propre audio, on le coupe
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
  <Audio src={staticFile("path/to/hook-narration.mp3")} />
</Sequence>

// Scenes + musique : apres le hook
const SCENES_START_FRAME = HOOK_FRAMES;
// Decaler le 'cumulative' initial au calcul de startFrames
// La musique commence a SCENES_START_FRAME avec fade-in 2s
```

**Option B (validee 2026-04-22)** : musique COMMENCE a scene 1, PAS a frame 0. Contraste silence -> kora = effet "ouverture cinema".

Reference implementation : `src/projects/geoafrique-shorts/SonjataShortFull.tsx`

---

## Workflow production

1. **Selectionner segment video** (5s, tension sans climax) a partir du render existant
   ```bash
   ffmpeg -ss <START>s -i <RENDER>.mp4 -t 5.0 -an -c:v libx264 -preset fast -crf 20 \
     -movflags +faststart <OUT>/hook-xxx-5s.mp4
   ```

2. **Review visuelle** 3 frames du clip (debut/milieu/fin) AVANT de generer la narration

3. **Ecrire phrase-choc** en suivant la formule, scan TTS

4. **Generer narration ElevenLabs** (voix projet, config max-style si Narratrice GeoAfrique v2)

5. **Mesurer duree** avec ffprobe — doit etre 4.0-5.0s
   - Si > 5.5s : raccourcir phrase OU etendre clip a 5.5s
   - Si < 4.0s : clip aura un silence en fin (OK si respiration voulue)

6. **Integrer dans composition** Remotion (Sequence 0 + decalage scenes +HOOK_FRAMES)

7. **Render test local** + upload Vercel pour validation mobile

---

## Checklist avant generation narration hook

- [ ] Phrase <= 14 mots
- [ ] 2 phrases courtes (pas 1 longue)
- [ ] Scan TTS : aucun participe "e/ee" en fin
- [ ] Scan TTS : aucun "ont + voyelle"
- [ ] Scan TTS : zero chiffre
- [ ] Credits ElevenLabs suffisants (char count <= credits restants)
- [ ] Clip video deja extrait et review fait
- [ ] Climax de la scene source preserve (pas dans le hook)

---

## Anti-patterns (eviter)

- **Hook sur plan large statique** : zero tension, swipe immediat
- **Hook qui spoile le climax** : affaiblit la scene de resolution
- **Phrase trop longue** : depasse 5s, chevauche scene 1
- **Musique des le hook** : dilue la phrase-choc, perd le contraste dramatique
- **3 phrases ou plus** : rythme casse, spectateur perd le fil
