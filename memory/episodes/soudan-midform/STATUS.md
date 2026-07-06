# Soudan Mid-form — STATUS

**Dernière mise à jour :** 2026-07-06 — ✅ **Prototype d'insert tactique SVG "état-major" VALIDÉ** par
Aziz (beat #5 : attaque RSF coordonnée sur Khartoum, 15 avril 2023 — aéroport + palais + tour TV).
**Branche :** `feat/warmap-sahel-short-v3-carte-continue` (le prototype a été committé ici, commit
`c59d0dd` ; ⚠️ nom de branche trompeur — chantier Khartoum distinct du Short Sahel qui occupe aussi
cette branche). **Format cible :** vidéo mid-form Soudan, insert plein écran 16:9 (1920x1080).

---

## ✅ FAIT (validé Aziz)

- **Prototype insert `KhartoumEtatMajorSVG`** entièrement validé (registre médaillon d'état-major SVG
  pur, PAS Mapbox). Render : `out/_rnd/khartoum-etatmajor-svg/versions/khartoum-etatmajor-PROTOTYPE-VALIDE.mp4`
  · catbox `https://files.catbox.moe/t96in1.mp4`.
- Contenu final : fond recomposé (terrain+Nil+3 bâtiments topdown) · formation de 4 portraits RSF qui
  avancent (mouvement organique + poussière) · impacts onde de choc · fumée post-impact · statut
  capturée (bâtiment semi-transparent + sceau R) · 4 phases + sous-titres.
- **Doctrine + workflow réutilisable écrits** : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md` ⭐.
  C'est notre manière de faire les inserts « carte de guerre / prise de territoire » en SVG.
- Assets R&D consolidés dans `out/_rnd/khartoum-etatmajor-svg/` (SVG sources + DECODE-NOTES + fx-demo).

## 🎬 NEXT (prochaine session Soudan)

- **Assembler la séquence beat #5 complète** avec narration/audio (le prototype est l'insert visuel ;
  reste à le caler sur la voix off + intégrer dans le montage mid-form).
- Décider si d'autres beats du Soudan réutilisent le même insert SVG (autres prises de territoire).
- Reste aussi les jetons/effets en stock non tous exploités (cf `svg-library/elements/militaire/`).

## ⚠️ Points d'attention

- Le fichier `khartoum-impact-batiment-glm-A-CORRIGER.json` a un bug de halo connu (non utilisé dans le
  proto final — le proto utilise ses propres effets). Ne pas le reprendre sans corriger.
- Ne PAS repartir sur Mapbox pour cet insert (piste écartée, cf DECODE-NOTES.md).

## 📁 Où retrouver

- Code : `src/projects/warmap/KhartoumEtatMajorSVG.tsx` (compo Remotion `KhartoumEtatMajorSVG`).
- Effets R&D : `src/projects/warmap/_rnd/KhartoumFxDemo.tsx` (compo `KhartoumFxDemo`).
- Doctrine/workflow : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`.
- Décodage/méthode : `out/_rnd/khartoum-etatmajor-svg/DECODE-NOTES.md`.
