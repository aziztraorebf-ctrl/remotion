# PixelLab Expert - Memory

## CORRECTIONS CRITIQUES (schema reel vs prompt systeme)

### create_sidescroller_tileset - parametres REELS (verifies 2026-02-21)

| Param prompt systeme | Param REEL | Note |
|---|---|---|
| inner_tile_description | lower_description | REQUIRED |
| outer_tile_description | transition_description | REQUIRED |
| ai_border_freedom | tileset_adherence_freedom | range [0, 500] |
| tile_size (int) | tile_size (object) | {"width": 32, "height": 32} |
| tile_strength 1-9+ | tile_strength 0.1-2.0 | MAX = 2.0, utiliser 2.0 |
| tileset_adherence 0-100 | tileset_adherence 0-500 | range [0, 500] |
| outline "single_color" | "single color outline" | Avec espaces |
| shading "medium" | "medium shading" | Avec " shading" |
| detail "low" | "low detail" | Avec " detail" |

### Appel MCP via JSON-RPC HTTP (seul moyen depuis Bash)

Les outils MCP ne sont PAS accessibles via les alias `mcp__pixellab__*` dans ce contexte agent.
Utiliser curl vers l'endpoint MCP avec JSON-RPC :

```bash
curl -s "https://api.pixellab.ai/mcp" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":N,"method":"tools/call","params":{"name":"TOOL","arguments":{...}}}'
```

Response format SSE : parser les lignes `data: {...}`.

### Endpoint REST API v2 (NE PAS utiliser pour tilesets)

- `POST /v2/create-sidescroller-tileset` -> 404 Not Found
- Les tilesets sont MCP ONLY (confirme dans memory/pixellab-api-v2.md)

---

## Assets Generes

### Tileset cobblestone side-view (2026-02-21)
- ID : f40fcd40-08f2-4744-9b77-be91234eb20b
- Fichier PNG : public/assets/peste-pixel/pixellab/tilesets/cobblestone-sideview.png
- Metadata JSON : public/assets/peste-pixel/pixellab/tilesets/cobblestone-sideview-metadata.json
- Dimensions : 128x128px (grille 4x4 = 16 tiles de 32x32)
- Mode : RGBA (transparent background)
- Parametres : lower="medieval stone cobblestone", transition="dark earth dirt medieval", tile_size=32, transition_size=0.5, tile_strength=2.0, tileset_adherence=90, tileset_adherence_freedom=200
- Outline : "single color outline", shading : "medium shading", detail : "low detail"

### Tileset cobblestone top-down existant (2026-02-17)
- ID : d2e02261-5dd7-4ccb-b60c-c45729bd0338
- Fichier : public/assets/peste-pixel/pixellab/tilesets/cobblestone-tileset.png
- View : "high top-down" (pas side-view)
- tile_strength : 1.0 (valeur par defaut - ancienne methode)

---

## Poll Protocol

Apres create_* :
1. sleep 120 (Bash)
2. get_sidescroller_tileset(tileset_id) via JSON-RPC
3. Si pas de tiles : attendre 30s de plus et re-poll
4. Download via : https://api.pixellab.ai/mcp/sidescroller-tilesets/ID/image
5. Metadata via : https://api.pixellab.ai/mcp/sidescroller-tilesets/ID/metadata
