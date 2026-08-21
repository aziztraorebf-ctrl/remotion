#!/bin/bash
# Batterie de tests du moteur-visuel-gate.
# Verifie les 2 sens : ce qui DOIT bloquer, et ce qui NE DOIT PAS bloquer.
cd /Users/clawdbot/Workspace/remotion
HOOK=".claude/hooks/moteur-visuel-gate.sh"
PASS=0; FAIL=0

run() { # nom | attendu(BLOCK/PASS) | json
  local nom="$1" attendu="$2" json="$3"
  local out rc
  out=$(echo "$json" | bash "$HOOK" 2>&1); rc=$?
  local got="PASS"; [ $rc -eq 2 ] && got="BLOCK"
  if [ "$got" = "$attendu" ]; then
    echo "  ok   [$got] $nom"; PASS=$((PASS+1))
  else
    echo "  FAIL attendu=$attendu obtenu=$got — $nom"; echo "       $out" | head -3; FAIL=$((FAIL+1))
  fi
}

echo "=== A. Write .tsx — DOIT BLOQUER (nouvelle scene, pas de moteur) ==="
# ⚠️ Utiliser un nom de fichier qui N'EXISTERA JAMAIS sur disque : le gate ne bloque que les
# CREATIONS (un fichier existant = une edition, il passe volontairement). Un test qui nomme un vrai
# fichier de scene devient faux des que ce fichier est cree (vecu : GazoducActe4Objectifs.tsx).
run "nouvelle scene sans moteur" BLOCK '{"tool_name":"Write","tool_input":{"file_path":"src/projects/souverain/gazoduc-aagp-tsgp/__GateTestNeverExists.tsx","content":"import React from \"react\";\nexport const X = () => <div/>;"}}'

echo "=== B. Write .tsx — NE DOIT PAS BLOQUER ==="
run "moteur declare (MOTEUR:)" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/souverain/gazoduc-aagp-tsgp/NouvelleScene.tsx","content":"// MOTEUR: D3 — geometrie calculee (proportion, pas un lieu)\nexport const X = () => null;"}}'
run "moteur declare (@moteur)" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/souverain/gazoduc-aagp-tsgp/Autre.tsx","content":"// @moteur SVG — metaphore du robinet\nexport const X = () => null;"}}'
run "moteur declare (MOTEUR DOMINANT :)" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/souverain/gazoduc-aagp-tsgp/Encore.tsx","content":"// MOTEUR DOMINANT : MiniMax H3\nexport const X = () => null;"}}'
run "fichier EXISTANT (edition)" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe4RessourceUnique.tsx","content":"pas de moteur ici"}}'
run "brique _shared" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/_shared/components/Truc.tsx","content":"export const X = () => null;"}}'
run "non-tsx (.ts)" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/souverain/gazoduc-aagp-tsgp/Timing.ts","content":"export const A = 1;"}}'
run "archive" PASS '{"tool_name":"Write","tool_input":{"file_path":"src/projects/_archive/Vieux.tsx","content":"export const X = () => null;"}}'

echo "=== C. Write .tsx — proto _rnd DOIT BLOQUER (volontaire) ==="
run "proto _rnd sans moteur" BLOCK '{"tool_name":"Write","tool_input":{"file_path":"src/projects/_rnd/svg-scenes/ProtoTest.tsx","content":"export const X = () => null;"}}'

echo "=== D. Bash storyboard — DOIT BLOQUER (brief trop etroit) ==="
cat > /tmp/brief-etroit.txt <<'EOF'
The map carries this beat. Use routes that draw progressively, pulses that travel
along a route, and cartographic pins anchored to geo coordinates. Mapbox style.
EOF
run "brief 2 familles" BLOCK '{"tool_name":"Bash","tool_input":{"command":"python3 scripts/tools/storyboard-dual-gen.py --prompt-file /tmp/brief-etroit.txt --ref-image /tmp/x.png --out /tmp/y.png"}}'

echo "=== E. Bash storyboard — NE DOIT PAS BLOQUER (brief large) ==="
cat > /tmp/brief-large.txt <<'EOF'
Constraints: D3 cartography with real GeoJSON, globe projection available.
You may also use SVG illustration, a cross-section cutaway, a human character,
filmed matter (MiniMax H3 footage), or CUT away from the map to a full-screen scene.
Montage is a capability: you are allowed to leave the map.
TASK: propose 3 distinct concepts of your own, and say which one you defend.
EOF
run "brief 6 familles + question ouverte" PASS '{"tool_name":"Bash","tool_input":{"command":"python3 scripts/tools/storyboard-dual-gen.py --prompt-file /tmp/brief-large.txt --ref-image /tmp/x.png --out /tmp/y.png"}}'

# Le meme brief large SANS question ouverte doit bloquer (c'est le defaut n°1 du 4B reel)
cat > /tmp/brief-large-sans-question.txt <<'EOF'
Constraints: D3 cartography with real GeoJSON, globe projection available.
You may also use SVG illustration, a cross-section cutaway, a human character,
filmed matter (MiniMax H3 footage), or CUT away from the map to a full-screen scene.
Montage is a capability: you are allowed to leave the map.
EOF
run "brief large SANS question ouverte" BLOCK '{"tool_name":"Bash","tool_input":{"command":"python3 scripts/tools/storyboard-dual-gen.py --prompt-file /tmp/brief-large-sans-question.txt --ref-image /tmp/x.png --out /tmp/y.png"}}'

# ⭐ NON-REGRESSION : le VRAI brief 4B qui a produit les fleches DOIT etre attrape
run "LE VRAI brief 4B fautif" BLOCK '{"tool_name":"Bash","tool_input":{"command":"python3 scripts/tools/storyboard-dual-gen.py --prompt-file memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/4B/PROMPT-storyboard-4B.txt --ref-image x.png --out y.png"}}'

echo "=== F. Bash — hors scope, NE DOIT PAS BLOQUER ==="
run "commande quelconque" PASS '{"tool_name":"Bash","tool_input":{"command":"ls -la"}}'
run "render remotion" PASS '{"tool_name":"Bash","tool_input":{"command":"npx remotion render src/index.ts Comp out/x.mp4"}}'
run "storyboard sans --prompt-file" PASS '{"tool_name":"Bash","tool_input":{"command":"python3 scripts/tools/storyboard-dual-gen.py --help"}}'
run "prompt-file inexistant" PASS '{"tool_name":"Bash","tool_input":{"command":"python3 scripts/tools/storyboard-dual-gen.py --prompt-file /tmp/nexistepas-xyz.txt"}}'

echo "=== G. Autres tools — jamais bloquer ==="
run "Read" PASS '{"tool_name":"Read","tool_input":{"file_path":"x.tsx"}}'
run "Edit" PASS '{"tool_name":"Edit","tool_input":{"file_path":"src/projects/souverain/x.tsx","new_string":"rien"}}'

# ─────────────────────────────────────────────────────────────────────────────
# H. CREATION DE SCENE PAR BASH — le trou paye le 2026-08-21 (gabarit Zambie).
# Le gate ne surveillait que l'outil Write. Une scene creee via `cat > Scene.tsx <<EOF`
# passait sous le radar, moteur jamais declare. La consigne de session poussant a
# travailler en Bash, cette porte laterale etait le chemin PAR DEFAUT, pas un cas rare.
# ─────────────────────────────────────────────────────────────────────────────
echo "=== H. Bash cree une scene .tsx — DOIT BLOQUER sans moteur ==="
run "cat > scene neuve sans moteur" BLOCK '{"tool_name":"Bash","tool_input":{"command":"cat > src/projects/souverain/demo/Neuve.tsx <<EOF\nimport React from \"react\";\nEOF"}}'
run "cp vers scene neuve" BLOCK '{"tool_name":"Bash","tool_input":{"command":"cp /tmp/S.tsx src/projects/souverain/demo/Copie.tsx"}}'
run "tee vers scene neuve" BLOCK '{"tool_name":"Bash","tool_input":{"command":"tee src/projects/souverain/demo/Beat9.tsx < /tmp/x"}}'

echo "=== I. Bash cree une scene .tsx — NE DOIT PAS BLOQUER ==="
run "cat > scene AVEC moteur declare" PASS '{"tool_name":"Bash","tool_input":{"command":"cat > src/projects/souverain/demo/Neuve.tsx <<EOF\n// MOTEUR: D3 — geometrie calculee\nEOF"}}'
run "cat > brique _shared" PASS '{"tool_name":"Bash","tool_input":{"command":"cat > src/projects/_shared/mapbox/Truc.tsx <<EOF\nrien\nEOF"}}'
run "cat > fichier EXISTANT" PASS '{"tool_name":"Bash","tool_input":{"command":"cat > src/projects/_client-sim/zambia-peacecorps/ZambiaTraitementA.tsx <<EOF\nrien\nEOF"}}'
# Faux positif reel, rencontre en ecrivant ce gate : un script python contenant l'exemple
# "cp x Scene.tsx" etait bloque alors qu'il ne cree aucune scene.
run "python3 qui PARLE de .tsx" PASS '{"tool_name":"Bash","tool_input":{"command":"python3 -c \"s = 42\""}}'
run "sed qui PARLE de .tsx" PASS '{"tool_name":"Bash","tool_input":{"command":"sed -i s/x/y/ note.txt"}}'
# Faux positif reel n2 : le message de commit DECRIVANT le fix contenait "cat > Scene.tsx",
# et la commande commencait par `cd ... && git add` — le motif ancre en tete ne matchait pas.
# Un message de commit qui decrit une commande n'est pas une commande.
run "git commit decrivant cat > Scene.tsx" PASS '{"tool_name":"Bash","tool_input":{"command":"cd /Users/x/repo && git add -A && git commit -m \"fix: cat > Scene.tsx contournait le gate\""}}'
run "echo decrivant un .tsx" PASS '{"tool_name":"Bash","tool_input":{"command":"echo \"cp a.tsx b.tsx\" >> notes.md"}}'

echo
echo "RESULTAT : $PASS ok / $FAIL echec(s)"
[ $FAIL -eq 0 ] || exit 1
