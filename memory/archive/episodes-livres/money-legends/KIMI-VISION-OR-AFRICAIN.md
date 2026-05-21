# Kimi Creative Vision — Or Africain
> Generee 2026-05-06. A utiliser comme reference pour la session de production.

## Decisions retenues

### Beat 1 (0-8s)
- Fond noir uni (PAS grille Money Legends — trop occupé pour hook)
- Compteur 1000→5589$ en font monospace enorme (200px+), glow dynamique proportionnel a la valeur
- Tick/ping ElevenLabs a chaque tranche 1000$
- Apres 5589 : "RECORD HISTORIQUE" clignote rouge 1.5s
- Fade-in musique kora a 3s

### Beat 2 (8-22s)
- 2 courbes SVG : prix or (montante, orange) + royalties (plate a 5%, grise)
- Fill degrade gris-noir entre les deux = richesse captee par multinationales (idee forte, sans mots)
- Courbe 1 apparait progressive (stroke animation), courbe 2 apparait instant a 10s (stagnation)
- Zoom dolly-in 1.0→1.15x sur le gap maximal a 12s
- Option dollar sign rotatif : a evaluer (risque surcharge)

### Beat 3 (22-42s) — MAPBOX V5 (decision locked)
- Carte Mapbox 3D globe : zoom espace→Ghana (lerpCam existant)
- Arc SVG anime 5%→12% sur le territoire Ghana (path qui se dessine)
- Flags cascade 5 pays : stagger 0.3s (pas 0.5 — trop lent pour 20s)
- Bass rumble grave avant "ARRETEZ." + silence 1s apres
- "LE MESSAGE : ARRETEZ." plein ecran rouge

### Beat 4 (42-62s) — MAPBOX V5 pullback (decision locked)
- Carte SVG 2D Afrique (pas 3D)
- Pays s'allument successivement avec gong stagger (legers, moyens, graves)
- IDEE CLE : connexion path SVG courbe entre les 5 pays qui s'illumine progressivement (montre "meme mouvement")
- Compteur $430M pop a 4s
- Chiffres cles par pays : Ghana +7%, Mali $430M, Burkina "Code revise", Niger "100% nationalise"

### Beat 5 (62-75s)
- Fond noir uni, font serif elegante (Garamond)
- Lignes apparaissent stagger 1s (fade-in + translateY 20px)
- Silence complet 8-12s — le texte parle seul
- Aucun SFX, aucune surprise. Le silence EST la surprise.

## Palette canonique
- Fond : #0a0a0a
- Or/jaune : #f5d547
- Orange : #e89b3c
- Rouge accent : #d32f2f
- Gris carte : #4a4a4a

## Musique strategique
- 0-8s : fade-in kora lent 0→60%
- 8-42s : soutenu, tempo +5% a 20s
- 42-62s : tempo +10%, plus energique
- 62-75s : fade-out complet, silence dernier 1s

## SFX a generer (ElevenLabs sound-generation)
- ping leger (tick compteur Beat 1) x1
- whoosh zoom-in (Beat 3 entree carte) x1
- string stab tense (Beat 3 texte 5%→12%) x1
- gong leger + gong moyen + gong grave (Beat 4 pays) x3
- bass rumble grave (avant ARRETEZ Beat 3) x1
- Deja generes : sfx-swoosh-zoomin.mp3, sfx-swoosh-pullback.mp3, sfx-map-ping.mp3

## Gotchas anticipes
- Compteur Beat 1 : interpolate + Math.round() (sinon flutter decimals)
- Stagger flags Beat 3 : 0.3s pas 0.5s (trop lent sur 20s)
- Connexion path Beat 4 : bezier simple, pas path complexe (trop heavy mobile)
- Silence Beat 5 : fade-out musique AVANT le beat, pas couper abrupt
- Sous-titres karaoke Y ≥ 850 (safe zone TikTok)

## Additions Gemini 2.0 Flash (2026-05-06) — a integrer

### A GARDER
- Beat 1 : lingot d'or PixelLab qui grossit a chaque tranche 1000$ (en parallele du compteur)
- Beat 2 : particules Remotion qui montent vers courbe prix mais disparaissent avant royalties = flux capte visualise
- Beat 5 : texture sombre metallique Gemini en background (tres discrete, pas fond uni pur)
- Cross-beat final : scintillement ou vibration tres subtile a la derniere image (pas arret net — impression "a suivre")

### A EVALUER EN SESSION
- Beat 3 : personnages PixelLab dirigeants avec bulle "ARRETEZ" (risque surcharge — tester apres Beat 3 de base)
- Beat 4 : 1 clip Seedance mine en activite au moment ou un pays s'allume (budget $1-2, tester sur Mali uniquement)

### A REJETER
- Murmure "Hmmmm..." Beat 1 — trop gimmick
- Chuchotements fin chaque ligne Beat 5 — brise le silence intentionnel

## Prochaine session — checklist demarrage (ORDRE OBLIGATOIRE)

### Etape 0 — AVANT TOUT CODE
1. Relire script V2 + scan TTS obligatoire :
   - "5000 dollars" → "cinq mille dollars"
   - "430 millions" → "quatre cent trente millions"
   - "2010" → "deux mille dix"
   - "5%" → "cinq pour cent", "12%" → "douze pour cent"
   - Scanner TOUS les participes en e/ee + "ont + voyelle"
   - Verifier densite mots/seconde : ~2.0-2.4 mots/s sur 75s = 150-180 mots max
2. Generer TTS narration complete (voix z3gESu49naEZW8Af2Upm, eleven_v3, ~$0.30)
3. Ecouter + valider avec Aziz (obligatoire avant code)
4. Mesurer duree reelle avec ffprobe (determine tous les timings beats)
5. Forced alignment → timestamps mots exacts pour karaoke

### Etape 1 — SFX
6. Generer SFX manquants : ping compteur, whoosh zoom, gong x3, bass rumble (~$0.50)

### Etape 2 — CODE beat par beat
7. Coder beat 1 → render → valider → beat 2 → etc.

### NOTE : narration-typeB-v1.mp3 = POC TEST SEULEMENT
- Ce fichier contient le script court de test (28s), PAS le script Or Africain V2 complet
- Ne pas utiliser comme base de timing pour la production
