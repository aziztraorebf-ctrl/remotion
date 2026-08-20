# shotcraft-lib — composants IMPORTES de video-shotcraft (Apache-2.0)

Source : https://github.com/Vincentwei1021/video-shotcraft (template/src/aifl/)
Licence Apache-2.0 — reutilisation commerciale permise, attribution requise.

Copies TELLES QUELLES (aucune modification), pour tester le systeme a sa pleine
mesure plutot que de le reimplementer :

| Fichier | Role |
|---|---|
| `PageCam.tsx` | ⭐ Camera 2.5D par keyframes sur une capture pleine page. Le socle de tous leurs plans "vraie page". Gotcha central resolu : en mode 3D il utilise la propriete CSS `zoom` et NON `transform: scale` — scale fait rasteriser Chromium a la taille de layout 1920 puis agrandir en GPU, ce qui floute le texte. `zoom` agrandit la boite de layout, donc le texte reste net sous perspective. |
| `FlashCut.tsx` | Flash blanc chaud a cheval sur une coupe franche (from = coupe - 5). |
| `DigitRoll.tsx` | Compteur de chiffres qui roule. |
| `PaperTitleCard.tsx` | Carton-respiration entre 2 plans de fonctionnalite. |

⚠️ `PaperTitleCard` est calibre sur leur palette papier/encre/ambre. Sur notre
registre sombre NorthShield il faut passer les couleurs en props ou le forker.
