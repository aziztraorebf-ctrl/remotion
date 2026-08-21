#!/bin/bash
# test-fiche-inject.sh — suite de non-regression du hook fiche-inject.sh
#
# POURQUOI CETTE SUITE EXISTE (2026-08-21)
# ----------------------------------------
# Le hook fiche-inject.sh n'avait AUCUN test. Deux trous ont ete payes le meme jour
# (gabarit client Zambie) :
#   1. la branche Bash excluait `cat *`, donc une scene creee via `cat > Scene.tsx <<EOF`
#      n'injectait AUCUNE fiche. Mesure sur le fichier reel : CAM=6, HAS_D=2 — la
#      FICHE-CAMERA se serait declenchee via Write et n'a rien injecte via Bash.
#      Consequence : `camAtContinu()` existait, personne ne me l'a mis sous les yeux.
#   2. aucune fiche ne nommait l'ARSENAL (jetons, cartouches, effets vivants). Les fiches
#      enseignaient la methode, jamais ce qu'on possede -> scene codee en <circle> a la main
#      alors que GisementMarker existait. Livrable juge "prototype", a refaire.
#
# Le correctif du gate moteur avait DEJA regresse une fois faute de test sur le bon cas.
# Ces scenarios sont donc graves ici, pas seulement verifies a la main.

cd "$(dirname "$0")/../.." || exit 1
HOOK=".claude/hooks/fiche-inject.sh"
OK=0
FAIL=0

# Un session_id different par cas : l'anti-repetition du hook est PAR SESSION,
# deux cas dans la meme session fausseraient le resultat du second.
# ⚠️ Les helpers sont des FICHIERS (tests/hooks/lib/) et non des heredocs imbriques :
# un heredoc dans une fonction shell appelee en pipeline s'est revele instable
# (4 faux echecs a l'ecriture de cette suite, 2026-08-21).
LIB="tests/hooks/lib"

# ⛔ PURGE DES SENTINELLES avant de tester. L'anti-repetition du hook ecrit un marqueur par
# (session, fiche) dans TMPDIR et refuse toute reinjection ensuite. Sans cette purge, la suite
# passait au 1er run puis echouait a tous les suivants : 4 faux echecs qui accusaient le hook
# alors que le hook faisait exactement son travail (diagnostique 2026-08-21).
# Le cas G, lui, teste l'anti-repetition VOLONTAIREMENT, dans sa propre session.
rm -rf "${TMPDIR:-/tmp}"/fiche-inject-s-* 2>/dev/null

payload() { python3 "$LIB/mkpayload.py" "$@"; }
fiches_of() { python3 "$LIB/readfiches.py"; }

check() { # $1=label $2=attendu(substring ou VIDE) $3=obtenu
  if [ "$2" = "VIDE" ]; then
    if [ -z "$3" ]; then echo "  ok   [VIDE] $1"; OK=$((OK+1));
    else echo "  FAIL attendu=aucune injection obtenu=[$3] — $1"; FAIL=$((FAIL+1)); fi
  else
    if printf '%s' "$3" | grep -q "$2"; then echo "  ok   [$2] $1"; OK=$((OK+1));
    else echo "  FAIL attendu=[$2] obtenu=[$3] — $1"; FAIL=$((FAIL+1)); fi
  fi
}

echo "=== A. Scene creee en BASH — le trou paye le 2026-08-21 ==="
CMD='cat > src/projects/demo/Neuve.tsx <<EOF
// MOTEUR: D3
const p = projection([1,2]); const q = projection([3,4]);
return <svg><circle cx={p[0]} cy={p[1]} r={3}/><circle cx={1} cy={2} r={3}/></svg>;
EOF'
R=$(payload s-bash-scene Bash "$CMD" | bash "$HOOK" 2>/dev/null | fiches_of)
check "cat > Scene.tsx injecte l'arsenal" "ARSENAL" "$R"

echo "=== B. Parite Write : une scene qui dessine recoit l'arsenal ==="
C='<svg><path d={d}/><circle cx={1} cy={2} r={3}/></svg>'
R=$(payload s-write-draw Write "/tmp/SceneDessin.tsx" "$C" | bash "$HOOK" 2>/dev/null | fiches_of)
check "Write scene dessinee" "ARSENAL" "$R"

echo "=== C. Marqueurs geo sans primitive dessinee -> arsenal quand meme ==="
C='const a = map.project([lon,lat]); const b = map.project([x,y]);'
R=$(payload s-geo Write "/tmp/SceneGeo.tsx" "$C" | bash "$HOOK" 2>/dev/null | fiches_of)
check "marqueurs geo (map.project x2)" "ARSENAL" "$R"

echo "=== D. Camera : la fiche camera reste declenchee ==="
C='const a=interpolate(f,[0,1],[0,1]); const b=interpolate(f,[0,2],[0,1]); const c=lerpCam(x,y,t);'
R=$(payload s-cam Write "/tmp/SceneCam.tsx" "$C" | bash "$HOOK" 2>/dev/null | fiches_of)
check "motifs camera" "CAMERA" "$R"

echo "=== E. NE DOIT RIEN INJECTER (anti-bavardage) ==="
R=$(payload s-ls Bash "ls -la src/" | bash "$HOOK" 2>/dev/null | fiches_of)
check "commande Bash quelconque" "VIDE" "$R"

C='export const T = () => <div style={{fontSize:42}}>Bonjour</div>;'
R=$(payload s-text Write "/tmp/Titre.tsx" "$C" | bash "$HOOK" 2>/dev/null | fiches_of)
check "composant de texte pur" "VIDE" "$R"

R=$(payload s-arch Write "/Users/clawdbot/Workspace/remotion/src/_archive/Vieux.tsx" '<svg><path d={d}/><circle r={1}/></svg>' | bash "$HOOK" 2>/dev/null | fiches_of)
check "zone _archive" "VIDE" "$R"

echo "=== F. Faux positif : un interpreteur qui PARLE de .tsx n'en cree pas ==="
R=$(payload s-py Bash 'python3 -c "print(open(\"Scene.tsx\").read())"' | bash "$HOOK" 2>/dev/null | fiches_of)
check "python3 mentionnant .tsx" "VIDE" "$R"

echo "=== G. Anti-repetition : 2e passe sur la meme cible, meme session ==="
C='<svg><path d={d}/><circle cx={1} cy={2} r={3}/></svg>'
payload s-rep Write "/tmp/Repete.tsx" "$C" | bash "$HOOK" >/dev/null 2>&1
R=$(payload s-rep Write "/tmp/Repete.tsx" "$C" | bash "$HOOK" 2>/dev/null | fiches_of)
check "2e injection sur meme fichier+session" "VIDE" "$R"

echo
echo "RESULTAT : $OK ok / $FAIL echec(s)"
[ "$FAIL" -eq 0 ]
