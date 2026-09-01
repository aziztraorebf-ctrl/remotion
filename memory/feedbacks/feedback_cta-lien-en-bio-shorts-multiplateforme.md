# CTA lien en bio — Shorts multiplateforme

> Migré depuis auto-memory 2026-08-31 (modifié 2026-08-01).

Un Short repost sur Instagram/Facebook/TikTok en plus de YouTube ne doit JAMAIS dire "lien en
description" dans son CTA — ces 3 plateformes n'ont pas de description cliquable par-video comme
YouTube, seulement un lien en bio de profil. Dire "en description" y cree une confusion (le
spectateur cherche un champ qui n'existe pas).

**Verification faite (2026-08-01, recherche web)** : pas de preuve de PENALITE ALGORITHMIQUE liee
au contenu semantique de l'audio parle sur ces plateformes — le risque reel est UX/confiance du
spectateur, pas un signal de ranking. Donc pas besoin de paniquer/re-render en urgence pour cette
raison-la, mais la coherence CTA reste une bonne pratique editoriale a appliquer partout.

**⛔⛔ PIEGE DECOUVERT (a ne pas re-rater)** : le texte affiche existe a DEUX endroits distincts
par Short, pas un seul :
1. Le CTA visuel graphique (cartouche "L'HISTOIRE COMPLETE" + bandeau texte) — evident, cherche
   facilement.
2. Le SOUS-TITRE KARAOKE (transcript Whisper mot-par-mot, `WHISPER_WORDS`) qui affiche fidelement
   ce que dit la voix, DONC affiche aussi "description" au meme instant si l'audio dit ce mot.
   Facile a rater car il vit dans un fichier de donnees (`whisper-words-*.ts`), pas dans le
   composant visuel qu'on a le reflexe de chercher en premier.

→ Toujours grep `"description"` dans TOUT le dossier du Short (composants ET fichiers de donnees
whisper/timing), pas juste le composant CTA visible.

**⛔ Corollaire "fichier au nom evident n'est pas forcement celui utilise"** : sur le Short AES,
`CtaCard.tsx` (nom qui hurle "c'est moi le CTA") etait un composant ORPHELIN — le vrai texte
affiche dans le rendu final vivait inline dans `AesShortPart2.tsx`. Toujours VERIFIER par le
rendu/grep du texte exact affiche, jamais deduire du nom de fichier seul.

## Methode de correction — splice cible, PAS re-render integral

Corriger un texte a 2-15s de la fin d'un Short de 80-115s ne justifie pas un re-render complet
(risque, temps, et pour CFA l'audio narration source n'existait meme plus). Methode utilisee avec
succes sur les 3 Shorts (Senegal/AES/CFA) le 2026-08-01 :

1. Localiser le texte exact affiche (grep + verification visuelle par extraction de frame, pas
   confiance au nom de fichier).
2. Corriger le texte dans le/les fichier(s) source (composant CTA + fichier whisper si sous-titre
   karaoke present).
3. Calculer la frame de debut du segment final a corriger (chercher `F_CTA`/timing dans le fichier
   d'assemblage, prendre une marge de securite avant pour capturer le fade-in).
4. `npx remotion render <COMPOSITION-ID> out.mp4 --frames=<start>-<end-1>` — render UNIQUEMENT ce
   segment depuis la composition COMPLETE (pas le composant isole) pour garantir un etat exact.
5. Decouper la video ORIGINALE avant ce segment : `ffmpeg -i original.mp4 -frames:v <start>
   -c:v libx264 -crf 16 -c:a aac -af "atrim=end=<start/fps>,asetpts=PTS-STARTPTS" before.mp4`.
6. Concatener via le FILTRE ffmpeg `concat=` (jamais le demuxer `-f concat`).
7. Verifier : duree finale = duree originale exacte (a la frame-rounding pres) + gel-check hashing
   1fps sur toute la duree (0 gel reel attendu — un hash duplique au niveau d'un fondu de sortie
   stable n'est PAS un gel, verifier visuellement les 2 frames avant de conclure).
8. Reconstruire le cover B (0.5s cover + fade) sur la video corrigee.
9. Cote TryPost : AUCUN endpoint pour remplacer/retirer un media d'un post existant — supprimer le
   post (`delete-post-tool`, irreversible) et le recreer entierement (meme caption, meme
   `scheduled_at`, nouvel upload + attach) est la methode fiable.

## Gotcha specifique CFA — fichiers supprimes apres le premier rendu

Le Short CFA avait ete construit dans un chantier anterieur puis ses fichiers source (.tsx des 3
scenes + composant CTA + assemblage + une dependance `cfaShortHookGroups.ts`) avaient ete
SUPPRIMES du repo apres le rendu final (nettoyage post-worktree, probablement). Seul le .mp4 final
survivait. Recuperation : `git show <commit>:<chemin> > <chemin>` pour chaque fichier, en
identifiant le commit exact via `git log --all --oneline -- "*nom-fichier*"`. L'audio narration
source (`.mp3`, jamais commite car `*.mp3` est dans `.gitignore`) n'existait plus DU TOUT nulle
part — contournement : extraire l'audio du rendu final `.mp4` (`ffmpeg -i final.mp4 -vn
audio.mp3`) pour satisfaire la reference du composant Remotion (le composant l'exige mais dans la
methode splice ci-dessus, cet audio n'est de toute facon jamais utilise dans le rendu final — seul
le VISUEL du segment renere est repris, l'audio vient du splice sur l'original).
La composition n'etait plus non plus enregistree dans `Root.tsx` (supprimee avec le reste) —
reajoutee de facon PERMANENTE (decision Aziz) pour eviter de refaire ce travail si le Short CFA
doit etre retouche a nouveau.

**Lecon generale** : un fichier `.mp4` final dans `PRET-PUBLICATION` n'implique PAS que son code
source Remotion existe encore. Verifier avant de promettre une correction rapide.
