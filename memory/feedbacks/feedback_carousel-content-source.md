# Règle : Contenu carousel = vidéo source uniquement

**Règle :** Avant de rédiger le brief d'un carousel, extraire le transcript/frames de la vidéo source et construire le contenu UNIQUEMENT à partir de ce qui est dit/montré dans la vidéo. Ne jamais improviser des faits à partir de la connaissance générale du sujet.

**Why :** Sur Niger Uranium, Claude a ajouté des faits non présents dans la vidéo (70% sans électricité, expulsion de l'ambassadeur, etc.) en improvisant à partir de sa connaissance générale. Le carousel a dû être abandonné car il racontait une histoire différente de la vidéo. Le lecteur qui regarde le carousel puis la vidéo doit retrouver exactement les mêmes faits.

**How to apply :**
1. Extraire frames toutes les 10s : `ffmpeg -i video.mp4 -vf "fps=1/10" frame-%03d.jpg`
2. Lire les sous-titres brûlés dans chaque frame
3. Construire le mapping slides → faits uniquement à partir de ce corpus
4. Vérifier chaque fait avant de l'écrire dans le brief : "est-ce dans la vidéo ?"

**Carousel Niger Uranium abandonné pour cette raison (2026-05-31).**

---
Migré depuis auto-memory (`feedback_carousel-content-source.md`) le 2026-08-31, contenu original inchangé.
