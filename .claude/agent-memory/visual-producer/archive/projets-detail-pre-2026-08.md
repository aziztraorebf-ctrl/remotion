# Archive — Détail projets terminés (pré 2026-08)

> Détail complet déplacé ici depuis MEMORY.md (compaction 2026-08-07, index dépassait 200 lignes).
> Ces projets sont terminés/publiés (voir MEMORY.md principal du workspace). Consulter uniquement
> pour retrouver un chemin d'asset précis ou un incident similaire.

## Sonjata Papercraft
- v3 FINAL valide 2026-04-23. 10 scenes + hook + CTA validees.
- Pipeline : Gemini storyboard → refs canon → Seedance V2 i2v 5-7s.
- Refs canoniques : `sonjata-papercraft/refs/` (sunjata-child / adult / king charsheets).

## Thiaroye V5
- Scene 1 V5 VALIDEE 2026-04-23 (formule Sonjata-chorégraphique 7s).
- Images scenes 2-6 generees 2026-04-24 (2 variations A/B par scene) :
  scene2 (v1a/v1b — v1b PREFERE OTS dominant), scene3a (v1a FORT seul face ligne / v1b wide),
  scene3b (v1a plan-tableau pont / v1b main+lettre+flaque SYNECDOQUE FORTE),
  scene4a (v1a main gantee tiroir / v1b perspective archives FORT),
  scene4b (v1a close-up mains / v1b wide tribunal PREFERE),
  scene5a (v1a Biram+mur portraits FORT / v1b-fixed close-up texte supprime),
  scene5b (v1a-v2 pierre+feuille / v1b-v2 pierre+fleurs+lettre),
  scene6 (v1a dos camera coucher soleil MAGNIFIQUE / v1b profil+pirogues).
- GOTCHA scene5b : Gemini genere du texte sur gravures memorielles meme avec "NO readable text".
  Fix : pierre SANS gravure + feuille/fleurs seuls elements.
- Clips generes 2026-04-24 (ordre 4B→5A→6→3B), script `scripts/tools/seedance-thiaroye-scenes-2to6.py` :
  s4b-tribunal-v1.mp4 (10s seed 1295902921), s5a-biram-memorial-v1.mp4 (10s seed 1352359353 —
  Biram tourne dos vers portraits, pas demande mais fort), s6-dakar-cote-v1.mp4 (7s seed
  1537110455, EXCELLENT), s3b-aftermath-v1.mp4 (7s seed 1741250381).
  Budget clips $10.20, cumule ~$23.35.
- Style anchor : `public/assets/thiaroye-1944/scene1/scene1-source-v4.png`
- Charrefs : `public/assets/thiaroye-1944/refs/{tirailleur-principal,officier-francais,biram-senghor,jeune-temoin}-charsheet.png`
- Dashboard : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-v5-dashboard/dashboard-bundled-tvBAGU73c18yglrIydagBZy7r3glpd.html

## Abou Bakari II
- 8 images + 4 charrefs valides session 2026-04-26. Budget depense $0.84/$30.00.
- Dashboard v1.3 FINAL : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-v4UfsGc5wztLsTfbPgnt2HkfgPLcIt.html
- Metadata : 88.52s, 9:16, paper-craft sepia. Voix z3gESu49naEZW8Af2Upm.
- Epoch spec : boubou indigo/ocre, pirogues bois 10-20m, lances bois+fer forge, adobe Djinguereber.
  Palette : ocre #D4943F / sienna #8B4513 / creme #F5E6C8 / or #D4AF37 / indigo #1A1A4E / atlantique #0A3D6B.
- Musique Minimax v2.6 : variante-A-royal-kora-balafon.mp3 (regal/hopeful, scenes royales+depart),
  variante-E-royal-contemplatif-ngoni.mp3 (sombre/contemplatif, scenes ocean+obsession).
- Charrefs Vercel : abou_bakari_royal, abou_bakari_marin, mansa_moussa, capitaine_pirogue,
  style_anchor — URLs dans dashboard.
- Images locales : `public/assets/abou-bakari/scenes/scene-{ocean,empire,fleet-a,fleet-b,name,
  abdication,obsession,colomb}-v*.png`
- 8 scenes, strategie clips + Video Extend, total estime ~$22.30 (detail seed/duree dans
  ancien scenes.json si besoin de reproduire).
- Corrections documentees : empire (4×, style anchor palette only), fleet-b (4×, R-SKIN-EXPLICITE),
  name (5×, R-DIRECTION-PERSONNAGE), abdication (3×, taille throne), obsession (3×, style drift BD).
  Valides au 1er essai : ocean, fleet-a, colomb.

### Regle dashboard (validee 2026-04-26, applicable a tous projets futurs)
Dashboard = source de verite visuelle Aziz. DOIT inclure :
1. Image validee visible dans chaque carte (balise `<img>` depuis URL Vercel)
2. Section "References de style" en haut (charrefs + style anchor, grille scrollable)
3. Images depuis URLs Vercel publiques (pas base64, pas chemins locaux)
4. Lightbox au clic (fullscreen mobile)
5. Uploader refs locales manquantes AVANT de construire la section References
Upload : `python3 scripts/tools/upload-to-blob.py <dashboard.html> --folder <projet>/dashboard`

## REVISION LOG (historique complet)
- 2026-04-26 (s2) : dashboard Abou Bakari II v1.2. 8 images + 4 charrefs. Prompts Seedance 8 scenes.
- 2026-04-26 (s1) : 6 regles ajoutees RULES-ACTIVE (STYLE-ANCHOR-PALETTE-ONLY, EDIT-CHIRURGICAL,
  DIRECTION-PERSONNAGE, SKIN-EXPLICITE, RICHESSE-ARCHITECTURALE, ANIMATION-AVANT-VALIDATION).
- 2026-04-25 : 4 regles promues ARCHIVE→ACTIVE (STORYBOARD-DENSITE, I2V-VS-STARTEND,
  STORYBOARD-REGEN-COMPLET, VETEMENTS-EPOQUE).
- 2026-04-24 : purge 791→~200 lignes. R-DYNAMIC v2 + R-VIVANT-PARTOUT fusionnes en R-VIVANT v3.
- 2026-04-23 : Thiaroye V5 Scene 1 validee. Sonjata v3 FINAL valide.
