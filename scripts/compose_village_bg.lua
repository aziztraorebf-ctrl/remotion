-- Village Background Composer for Aseprite
-- Plague 1347 - Opening Scene "L'Europe. 1347."
-- Run via: Script > Run Script in Aseprite
--
-- Canvas: 1920x1080 (16:9)
-- Ground line: Y = 900 (feet of nearest NPCs)
-- Buildings anchored at their bottom edge = GROUND_Y

local CANVAS_W = 1920
local CANVAS_H = 1080
local GROUND_Y = 900
local COBBLE_H = 64  -- height of cobblestone strip

-- Asset paths (absolute)
local BASE = app.fs.userConfigPath
-- We resolve relative to this script's location
local SCRIPT_DIR = app.fs.filePath(debug.getinfo(1, "S").source:sub(2))

local ASSETS_BASE = "/Users/clawdbot/Workspace/remotion/public/assets/peste-pixel/pixellab"

-- Buildings: { path, nativeW, nativeH, x, layer_name }
-- x = left edge of building on 1920px canvas
-- All buildings bottom-anchored at GROUND_Y
local BUILDINGS = {
  { path = ASSETS_BASE .. "/buildings-test/hut-peasant-side.png",  w = 120, h = 160, x = 60,   scale = 2.8, layer = "bg",    label = "Hut Left" },
  { path = ASSETS_BASE .. "/buildings-test/house-side-test.png",   w = 160, h = 300, x = 360,  scale = 2.8, layer = "front", label = "House Timber 1" },
  { path = ASSETS_BASE .. "/buildings-test/tavern-side.png",       w = 200, h = 260, x = 750,  scale = 2.8, layer = "front", label = "Tavern" },
  { path = ASSETS_BASE .. "/buildings-test/house-stone-side.png",  w = 160, h = 240, x = 1180, scale = 2.8, layer = "bg",    label = "House Stone" },
  { path = ASSETS_BASE .. "/buildings-test/hut-peasant-side.png",  w = 120, h = 160, x = 1520, scale = 2.8, layer = "bg",    label = "Hut Right" },
  { path = ASSETS_BASE .. "/buildings-test/house-side-test.png",   w = 160, h = 300, x = 1760, scale = 2.8, layer = "front", label = "House Timber 2" },
}

local TILESET_PATH = ASSETS_BASE .. "/tilesets/cobblestone-sideview.png"

-- ============================================================
-- Create new document
-- ============================================================
local spr = Sprite(CANVAS_W, CANVAS_H, ColorMode.RGB)
spr.filename = "/Users/clawdbot/Workspace/remotion/output/village-bg.aseprite"

-- Rename the default layer
spr.layers[1].name = "Sky"

-- ============================================================
-- LAYER 1: SKY GRADIENT
-- Draw sky as horizontal bands simulating gradient
-- Top: #5B8FD4 (mid blue), Bottom: #E8C882 (warm golden)
-- ============================================================
app.activeLayer = spr.layers[1]
local sky_cel = app.activeLayer:cel(1)
if sky_cel == nil then
  app.command.NewCel()
  sky_cel = app.activeLayer:cel(1)
end

-- Draw gradient band by band
-- Colors: top=#5B8FD4, mid=#7FB8E8, lower=#B8D9F2, bottom=#E8C882
local sky_colors = {
  { y_end = 300,  r = 91,  g = 143, b = 212 },  -- #5B8FD4 deep blue
  { y_end = 540,  r = 127, g = 184, b = 232 },  -- #7FB8E8 mid blue
  { y_end = 750,  r = 184, g = 217, b = 242 },  -- #B8D9F2 pale blue
  { y_end = 1080, r = 232, g = 200, b = 130 },  -- #E8C882 warm golden horizon
}

local img = sky_cel.image
local y_start = 0
for _, band in ipairs(sky_colors) do
  local c = Color(band.r, band.g, band.b, 255)
  for y = y_start, band.y_end - 1 do
    for x = 0, CANVAS_W - 1 do
      img:drawPixel(x, y, c)
    end
  end
  y_start = band.y_end
end

-- ============================================================
-- LAYER 2: Ground (solid brown below GROUND_Y)
-- ============================================================
local ground_layer = spr:newLayer()
ground_layer.name = "Ground"

local ground_img = Image(CANVAS_W, CANVAS_H - GROUND_Y + 20, ColorMode.RGB)
local ground_c = Color(107, 94, 74, 255)  -- #6B5E4A
for y = 0, ground_img.height - 1 do
  for x = 0, ground_img.width - 1 do
    ground_img:drawPixel(x, y, ground_c)
  end
end
local ground_cel = spr:newCel(ground_layer, 1, ground_img, Point(0, GROUND_Y - 20))

-- ============================================================
-- LAYER 3: Cobblestone tileset strip
-- The tileset PNG is 64x64 containing a 4x4 grid of 16x16 tiles
-- We use the top-left tile (platform top) and repeat it
-- ============================================================
local cobble_layer = spr:newLayer()
cobble_layer.name = "Cobblestone"

-- Load the tileset
local tileset_img = Image { fromFile = TILESET_PATH }
if tileset_img then
  -- Extract just the top row = first 4 tiles (top of platform)
  -- Tile 0 at (0,0), 16x16
  -- We want to show these as a repeating strip
  -- The tileset's top tiles show the platform surface

  -- Crop to the top platform tile row (16px high)
  -- For a side-view platform, first tile row represents surface
  local strip_h = 32  -- show 2 rows for depth illusion
  local strip_y = GROUND_Y - strip_h + 4  -- slightly overlap with ground

  -- Tile the cobblestone across the full width
  local cobble_strip = Image(CANVAS_W, strip_h, ColorMode.RGB)

  -- Fill with first tile (or first row of tiles)
  local tile_w = 16
  local x = 0
  while x < CANVAS_W do
    -- Cycle through 4 tile variants for natural look
    local tile_idx = math.floor(x / tile_w) % 4
    local src_x = tile_idx * tile_w
    for ty = 0, strip_h - 1 do
      for tx = 0, tile_w - 1 do
        if src_x + tx < tileset_img.width and ty < tileset_img.height then
          local px = tileset_img:getPixel(src_x + tx, ty)
          cobble_strip:drawPixel(x + tx, ty, px)
        end
      end
    end
    x = x + tile_w
  end

  spr:newCel(cobble_layer, 1, cobble_strip, Point(0, strip_y))
else
  app.alert("Tileset not found: " .. TILESET_PATH)
end

-- ============================================================
-- LAYER 4+: Buildings (bg layer first, then front)
-- Each building gets its own layer so Aziz can adjust independently
-- Bottom of building anchored at GROUND_Y
-- ============================================================

-- Process bg buildings first, then front buildings
local function load_building(bldg)
  local layer = spr:newLayer()
  layer.name = bldg.label

  local raw_img = Image { fromFile = bldg.path }
  if not raw_img then
    app.alert("Building not found: " .. bldg.path)
    return
  end

  -- Scale the image (nearest neighbor)
  local scale = bldg.scale
  local disp_w = math.floor(bldg.w * scale)
  local disp_h = math.floor(bldg.h * scale)

  local scaled_img = Image(disp_w, disp_h, raw_img.colorMode)

  -- Nearest-neighbor upscale
  for dy = 0, disp_h - 1 do
    for dx = 0, disp_w - 1 do
      local sx = math.floor(dx / scale)
      local sy = math.floor(dy / scale)
      if sx < raw_img.width and sy < raw_img.height then
        scaled_img:drawPixel(dx, dy, raw_img:getPixel(sx, sy))
      end
    end
  end

  -- Remove white/near-white background pixels
  for y = 0, scaled_img.height - 1 do
    for x = 0, scaled_img.width - 1 do
      local px = scaled_img:getPixel(x, y)
      local r = app.pixelColor.rgbaR(px)
      local g = app.pixelColor.rgbaG(px)
      local b = app.pixelColor.rgbaB(px)
      -- Remove pure or near-pure white (threshold >235 on all channels)
      if r > 235 and g > 235 and b > 235 then
        scaled_img:drawPixel(x, y, app.pixelColor.rgba(0, 0, 0, 0))
      end
    end
  end

  -- Anchor bottom of building at GROUND_Y
  local top_y = GROUND_Y - disp_h

  spr:newCel(layer, 1, scaled_img, Point(bldg.x, top_y))
end

-- Load bg buildings first
for _, bldg in ipairs(BUILDINGS) do
  if bldg.layer == "bg" then
    load_building(bldg)
  end
end

-- Load front buildings on top
for _, bldg in ipairs(BUILDINGS) do
  if bldg.layer == "front" then
    load_building(bldg)
  end
end

-- ============================================================
-- LAYER: Ground line marker (helper, can be deleted)
-- A thin line at GROUND_Y so Aziz can see the alignment
-- ============================================================
local guide_layer = spr:newLayer()
guide_layer.name = "_GROUND_GUIDE (delete me)"
local guide_img = Image(CANVAS_W, 2, ColorMode.RGB)
local guide_c = Color(255, 0, 0, 200)
for x = 0, CANVAS_W - 1 do
  guide_img:drawPixel(x, 0, guide_c)
  guide_img:drawPixel(x, 1, guide_c)
end
spr:newCel(guide_layer, 1, guide_img, Point(0, GROUND_Y))

-- ============================================================
-- Save the file
-- ============================================================
spr:saveAs("/Users/clawdbot/Workspace/remotion/output/village-bg.aseprite")

app.alert("Village background composed!\n\nFile saved: output/village-bg.aseprite\n\nLayers:\n- Sky (gradient)\n- Ground (brown fill)\n- Cobblestone (tileset strip)\n- Hut Left / House Timber / Tavern / House Stone / Hut Right / House Timber 2\n- _GROUND_GUIDE (red line at Y=900, delete when done)\n\nAdjust building X positions or Y positions as needed, then\nFile > Export As > village-bg.png")
