# Vercel Blob Asset Gallery — workflow détaillé

> Migré depuis auto-memory 2026-08-31 (setup mars 2026). Complète `memory/apis-and-tools.md`
> (référence sommaire de `upload-to-blob.py`) avec le détail du workflow gallery multi-assets.
> ⚠️ Section "Remotion Vercel Renderer" ci-dessous documente un projet séparé
> (`aziztraorebf-ctrl/remotion-renderer`) explicitement marqué **POC ABANDONNÉ** dans CLAUDE.md
> racine ("NE PAS UTILISER" — figé au 2026-03-27, ne verra jamais les vraies compositions du
> projet). Conservé ici pour mémoire historique uniquement, ne pas relancer.

## Vercel Blob Store (Public) — Asset Review Gallery

**Project Vercel** : `remotion-assets` (prj_rrLqyQtJVr3T4npZNH0o2U0JEcxq)
**Store ID** : `store_T6oLmi2NlOe9nhkg`
**Base URL** : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/`
**Access** : Public — URLs accessibles sans token depuis n'importe quel device

**Script upload** : `scripts/tools/upload-to-blob.py` (⚠️ chemin à vérifier — `scripts/upload-to-blob.py` selon le fichier d'origine mais `apis-and-tools.md` le liste sans chemin complet)
- Upload : `python scripts/tools/upload-to-blob.py <fichier> --folder <dossier>`
- List : `python scripts/tools/upload-to-blob.py --list`
- Folders : `images/`, `audio/`, `renders/`, `clips/`, `test/`

**Token** : `BLOB_READ_WRITE_TOKEN` dans `.env` (requis pour écriture, pas pour lecture)

**Workflow mobile** :
1. Générer un asset (image/audio/clip)
2. Uploader via le script → obtenir URL publique
3. Donner le lien à Aziz → ouvre sur téléphone
4. Aziz valide ou demande modifications
5. Re-générer, re-uploader, nouveau lien

**Gallery mode** : `--gallery "Titre" fichier1 fichier2 ... --folder review/date`
- Génère une page HTML responsive (fond noir, grid images, players audio/video inline)
- Images cliquables pour zoom. Audio avec play/pause/progression/download.
- Un seul lien à partager = tous les assets d'une review.

⚠️ **Note 2026-08-31** : cette gallery mode date d'avant l'adoption de l'Artifact Claude comme
défaut pour les images/pages HTML (cf `memory/feedbacks/feedback_upload-hosts-fallback.md` §
MISE À JOUR 2026-08-27). Pour une nouvelle review, privilégier Artifact ; garder ce mode gallery
Vercel Blob en fallback si Artifact indisponible ou pour des vidéos > 16 Mo.

**Durée des liens** : permanents (pas d'expiration). `--list` pour retrouver.

## Remotion Vercel Renderer — Remote Video Rendering (⛔ POC ABANDONNÉ, ne pas utiliser)

**Projet séparé** : `/Users/clawdbot/Workspace/remotion-renderer/` (existe toujours sur disque au 2026-08-31)
**GitHub** : `aziztraorebf-ctrl/remotion-renderer`
**Vercel Project** : `remotion-renderer` (prj_izmAgDTeMBuaQGsz6v2hdIsltNJO)

⛔ **Confirmé PÉRIMÉ par CLAUDE.md racine** : figé au 2026-03-27, 3 compositions de démo
(`MyComp`/`GeoTest`/`NextLogo`) seulement — ne verra jamais les vraies compositions du projet, porter
est disproportionné vu le volume d'assets + Mapbox/deck.gl. Pour un render >30s (D3/SVG pur, PAS
Mapbox/WebGL) → `npx remotion render` classique en local. Pour Mapbox/WebGL →
`scripts/render-mapbox.sh` obligatoire.

Détail technique conservé pour mémoire (ne pas relancer sans re-validation explicite) :

**Trigger script** : `scripts/render-on-vercel.py` — **NE PAS UTILISER** (cf ci-dessus)
**API endpoint** : `POST /api/render`
**Architecture** : Next.js 16 + @remotion/vercel + @vercel/sandbox + @vercel/blob
- Sandbox crée une VM éphémère, rend la vidéo, uploade le MP4 sur Blob
- Snapshot pre-build au deploy (Chrome + FFmpeg pré-installés)
- Hobby plan : 45 min timeout, 10 sandboxes simultanées
