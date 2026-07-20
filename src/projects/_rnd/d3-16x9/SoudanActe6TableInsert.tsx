// B4 — Insert "table de negociation" (Acte 6, paradoxe des mediateurs).
//
// MIX-AND-MATCH valide Aziz 2026-07-20 : base FABLE 5 (fond, silhouettes en buste + leurs ombres au sol,
// cone de lumiere qui descend, jeton Emirats, grain/vignette) + PLATEAU BOIS de GPT-5.6 Sol (oval_table,
// pour la touche de couleur/matiere chaude au centre). Les 2 SVG ont ete generes sur le meme brief, compares
// aux 4 modeles (GPT/Gemini/Kimi/Fable), Aziz a choisi ce mix.
//
// AJOUT PROPRE (l'anim que les LLM ne font pas) : le spotlight + halo montent progressivement sur le jeton
// Emirats au fil du beat (de "les Emirats" a "celui qui l'alimente") — le contraste lumiere/ombre se RENFORCE,
// c'est lui qui porte le jugement. Piloté par tEmirats/tAlimente (frames relatives a l'insert).
import React from "react";
import { interpolate } from "remotion";

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// L'insert est rendu PAR-DESSUS le globe (cross-fade opacite gere par le parent). Coords viewBox 1920x1080.
export const SoudanActe6TableInsert: React.FC<{
  frame: number; // frame ABSOLUE de l'acte
  tStart: number; // b4Tables : la table apparait (cross-fade)
  tEmirats: number; // b4Emirats : le jeton EAU s'allume, le spotlight commence a monter
  tAlimente: number; // b4Alimente : le contraste lumiere/ombre culmine
  tEnd: number;
}> = ({ frame, tStart, tEmirats, tAlimente, tEnd }) => {
  const appear = interpolate(frame, [tStart, tStart + 26], [0, 1], clampB);
  const out = interpolate(frame, [tEnd - 24, tEnd], [1, 0], clampB);
  const op = appear * out;
  if (op <= 0.01) return null;

  // le spotlight/halo montent de 0 -> plein entre tEmirats et tAlimente (le jugement se revele)
  const spot = interpolate(frame, [tEmirats, tAlimente, tAlimente + 30], [0, 1, 1], clampB);
  const jetonReveal = interpolate(frame, [tEmirats, tEmirats + 20], [0, 1], clampB);

  // ===== ANIMATIONS (retour Aziz : la scene dure ~25s, ne pas laisser statique) =====
  const fl = frame - tStart; // frame locale depuis le debut de l'insert
  // 1. GLOW du pourtour de table qui RESPIRE (battement lent, subtil)
  const tableGlow = 0.5 + 0.5 * Math.sin(fl * 0.045);
  // 2. REFLET qui balaie lentement la surface du plateau (bande claire qui glisse)
  const reflectX = 480 + ((fl * 1.6) % 1400); // glisse de gauche a droite en boucle lente
  // 3. SPOTLIGHT qui BALAIE avant de se fixer : avant tEmirats, un halo cherche autour de la table ;
  //    apres tEmirats il se verrouille sur le jeton EAU. sweepAngle tourne tant qu'on n'a pas nomme les Emirats.
  const searching = frame < tEmirats;
  const sweepAngle = (fl * 0.03) % (Math.PI * 2);
  const sweepR = 300;
  const sweepX = 960 + Math.cos(sweepAngle) * sweepR;
  const sweepY = 560 + Math.sin(sweepAngle) * sweepR * 0.56;
  const searchOp = interpolate(frame, [tStart + 20, tStart + 50, tEmirats - 10, tEmirats], [0, 0.5, 0.5, 0], clampB);

  // 4. DERIVE DE CAMERA lente (Gemini+Kimi : "ne jamais laisser la scene fixe") — scale + drift continu
  //    sur toute la duree. Pas de vraie 3D (impossible en SVG) mais un mouvement perpetuel qui donne vie.
  const dur = tEnd - tStart;
  const camScale = interpolate(fl, [0, dur], [1.04, 1.10], clampB); // push-in tres lent
  const camX = Math.sin(fl * 0.012) * 14; // derive horizontale douce
  const camY = interpolate(fl, [0, dur], [8, -10], clampB); // glisse vertical lent
  const camTransform = `translate(${camX} ${camY}) scale(${camScale})`;
  const camOrigin = "960px 560px";
  // 5. PARTICULES "god rays" dans le faisceau (Gemini+Kimi : poussiere qui flotte = premium instantane).
  //    18 particules qui montent lentement le long du cone, position sinus, apparaissent avec le spotlight.
  const particles = Array.from({ length: 18 }, (_, i) => {
    const seed = i * 137.5;
    const life = ((fl * 0.4 + seed) % 200) / 200; // 0->1 cycle de vie
    const baseX = 960 + Math.sin(seed) * 90;
    const px = baseX + Math.sin(fl * 0.02 + i) * 18;
    const py = 935 - life * 620; // monte du jeton vers le haut du cone
    const pr = 1.5 + (i % 3) * 0.8;
    const pop = Math.sin(life * Math.PI) * 0.4 * spot; // fade in/out sur la vie, lie au spotlight
    return { px, py, pr, pop };
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, pointerEvents: "none" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          {/* --- defs FABLE (ambiance) --- */}
          <radialGradient id="a6t-pool" gradientUnits="userSpaceOnUse" cx={960} cy={850} r={320}>
            <stop offset="0" stopColor="#DAA520" stopOpacity={0.14} />
            <stop offset="0.55" stopColor="#DAA520" stopOpacity={0.06} />
            <stop offset="1" stopColor="#DAA520" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="a6t-halo" gradientUnits="userSpaceOnUse" cx={960} cy={935} r={215}>
            <stop offset="0" stopColor="#DAA520" stopOpacity={0.28} />
            <stop offset="0.45" stopColor="#DAA520" stopOpacity={0.12} />
            <stop offset="1" stopColor="#DAA520" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="a6t-cone" gradientUnits="userSpaceOnUse" x1={960} y1={0} x2={960} y2={935}>
            <stop offset="0" stopColor="#DAA520" stopOpacity={0.02} />
            <stop offset="0.6" stopColor="#DAA520" stopOpacity={0.07} />
            <stop offset="1" stopColor="#DAA520" stopOpacity={0.16} />
          </linearGradient>
          <radialGradient id="a6t-jetonlum" cx="0.5" cy="0.28" r="0.8">
            <stop offset="0" stopColor="#f5e6c4" stopOpacity={0.16} />
            <stop offset="0.5" stopColor="#f5e6c4" stopOpacity={0.05} />
            <stop offset="1" stopColor="#0a0d12" stopOpacity={0.25} />
          </radialGradient>
          <radialGradient id="a6t-vignette" gradientUnits="userSpaceOnUse" cx={960} cy={540} r={1150}>
            <stop offset="0" stopColor="#05070a" stopOpacity={0} />
            <stop offset="0.62" stopColor="#05070a" stopOpacity={0} />
            <stop offset="1" stopColor="#05070a" stopOpacity={0.82} />
          </radialGradient>
          <clipPath id="a6t-clipjeton"><circle cx={960} cy={935} r={76} /></clipPath>
          {/* clip du plateau (pour le reflet qui balaie la surface) */}
          <clipPath id="a6t-cliptable"><ellipse cx={960} cy={540} rx={610} ry={300} /></clipPath>
          {/* reflet lineaire clair (bande qui glisse sur le bois) */}
          <linearGradient id="a6t-reflect" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f5e6c4" stopOpacity={0} />
            <stop offset="0.5" stopColor="#f5e6c4" stopOpacity={0.1} />
            <stop offset="1" stopColor="#f5e6c4" stopOpacity={0} />
          </linearGradient>
          {/* --- defs GPT (plateau bois) --- */}
          <linearGradient id="a6t-wood" x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#493a31" />
            <stop offset="0.48" stopColor="#302720" />
            <stop offset="1" stopColor="#1b1817" />
          </linearGradient>
          <linearGradient id="a6t-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6e5944" stopOpacity={0.72} />
            <stop offset="1" stopColor="#171515" />
          </linearGradient>
        </defs>

        {/* fond (Fable) — HORS derive camera (reste fixe) */}
        <g id="fond">
          <rect x={0} y={0} width={1920} height={1080} fill="#0a0d12" />
          <ellipse cx={960} cy={700} rx={920} ry={430} fill="#0c1118" />
        </g>

        {/* ===== CONTENU sous DERIVE DE CAMERA (mouvement perpetuel, retour Aziz + Gemini/Kimi) ===== */}
        <g transform={camTransform} style={{ transformOrigin: camOrigin }}>
        {/* PLATEAU BOIS GPT (oval_table), recale a cy=540 pour s'emboiter avec les silhouettes Fable.
            Groupe translate de -(500-540)=+40 en y par rapport a l'original GPT (cy 500 -> 540). */}
        <g id="table-gpt" transform="translate(0 40)">
          <ellipse cx={960} cy={514} rx={618} ry={309} fill="#11151a" stroke="#090c0f" strokeWidth={28} opacity={0.72} />
          <path d="M350 520 Q366 760 638 829 Q960 911 1282 829 Q1554 760 1570 520 L1570 550 Q1548 799 1270 875 Q960 959 650 875 Q372 799 350 550Z" fill="#171515" stroke="#080a0c" strokeWidth={5} />
          <ellipse cx={960} cy={500} rx={610} ry={300} fill="url(#a6t-wood)" stroke="#78644f" strokeWidth={7} />
          <ellipse cx={960} cy={500} rx={584} ry={275} fill="none" stroke="url(#a6t-rim)" strokeWidth={3} />
          <path d="M433 425 Q688 331 954 384 Q1217 437 1479 400" fill="none" stroke="#9b7956" strokeWidth={3} opacity={0.22} />
          <path d="M410 548 Q690 470 978 531 Q1260 590 1507 504" fill="none" stroke="#bb9365" strokeWidth={2.5} opacity={0.17} />
          <path d="M478 653 Q711 579 936 632 Q1173 688 1435 621" fill="none" stroke="#aa8159" strokeWidth={3} opacity={0.16} />
          <path d="M560 302 Q770 250 946 295 Q1117 339 1355 286" fill="none" stroke="#d1ae78" strokeWidth={2} opacity={0.12} />
          <path d="M600 743 Q780 692 966 734 Q1146 775 1325 728" fill="none" stroke="#090b0d" strokeWidth={4} opacity={0.3} />
          <path d="M443 487 Q620 443 769 470 M1128 418 Q1312 453 1467 390 M705 582 Q848 550 990 588 M1060 656 Q1208 685 1364 641" fill="none" stroke="#171413" strokeWidth={5} opacity={0.42} />
          <path d="M642 262 Q960 178 1278 262" fill="none" stroke="#dbc18e" strokeWidth={2} opacity={0.17} />
          <path d="M652 814 Q960 895 1268 814" fill="none" stroke="#bc985f" strokeWidth={4} opacity={0.22} />
          {/* REFLET qui balaie la surface (bande claire glissante, clippee au plateau) */}
          <g clipPath="url(#a6t-cliptable)">
            <rect x={reflectX - 140} y={240} width={280} height={600} fill="url(#a6t-reflect)" opacity={0.7} />
          </g>
        </g>
        {/* GLOW du pourtour qui RESPIRE (subtil, sous les silhouettes) */}
        <ellipse cx={960} cy={540} rx={624} ry={312} fill="none" stroke="#8a6a3a" strokeWidth={3}
          opacity={appear * (0.12 + 0.16 * tableGlow)} />
        {/* SPOTLIGHT de RECHERCHE qui tourne autour de la table avant de se fixer sur les Emirats */}
        {searching && searchOp > 0.01 && (
          <ellipse cx={sweepX} cy={sweepY} rx={130} ry={70} fill="url(#a6t-halo)" opacity={searchOp} />
        )}

        {/* SILHOUETTES (Fable) — 6 delegations grises anonymes en buste, avec ombre au sol */}
        <g id="silhouettes">
          {[
            { t: "translate(413 797) rotate(66.6) scale(1.05)", body: "#4a5462", head: "#3f4855", strokeC: "#10151c", gold: true },
            { t: "translate(278 475) rotate(97.1) scale(0.92)", body: "#414b59", head: "#37404c", strokeC: "#10151c" },
            { t: "translate(656 218) rotate(138.4) scale(0.82)", body: "#39424f", head: "#303844", strokeC: "#0e131a" },
            { t: "translate(1264 218) rotate(-138.4) scale(0.82)", body: "#39424f", head: "#303844", strokeC: "#0e131a" },
            { t: "translate(1642 475) rotate(-97.1) scale(0.92)", body: "#414b59", head: "#37404c", strokeC: "#10151c" },
            { t: "translate(1507 797) rotate(-66.6) scale(1.05)", body: "#4a5462", head: "#3f4855", strokeC: "#10151c", gold: true },
          ].map((s, i) => {
            // BOBBING renforce (retour Aziz + Gemini/Kimi "respiration") : chaque delegue respire/bouge,
            // phase decalee. La silhouette 0 (face aux Emirats, en bas) TAPOTE (agitation = tension).
            const bob = Math.sin(fl * 0.06 + i * 1.7) * 3.2; // +-3.2px vertical (renforce)
            const tilt = Math.sin(fl * 0.04 + i * 2.3) * 2.0; // +-2deg de tangage
            const tap = i === 0 && frame > tAlimente - 60 ? Math.sin(fl * 0.5) * 1.6 : 0; // tapotement nerveux
            return (
              <g key={i} transform={s.t}>
                <ellipse cx={0} cy={16} rx={74} ry={30} fill="#04060a" fillOpacity={0.45} />
                {/* le buste + tete bougent ensemble (l'ombre au sol reste fixe) */}
                <g transform={`translate(${tap} ${bob}) rotate(${tilt})`}>
                  <ellipse cx={0} cy={10} rx={66} ry={30} fill={s.body} stroke={s.strokeC} strokeWidth={2} />
                  <circle cx={0} cy={-14} r={24} fill={s.head} stroke={s.strokeC} strokeWidth={2} />
                  {s.gold && <ellipse cx={0} cy={10} rx={66} ry={30} fill="none" stroke="#DAA520" strokeWidth={2} strokeOpacity={0.1} />}
                </g>
              </g>
            );
          })}
        </g>

        {/* SPOTLIGHT (Fable) — monte progressivement (spot 0->1) : le jugement se revele */}
        <g id="spotlight" opacity={spot}>
          <ellipse cx={960} cy={845} rx={300} ry={105} fill="url(#a6t-pool)" />
          <polygon points="918,-20 1002,-20 1105,920 815,920" fill="url(#a6t-cone)" />
          <ellipse cx={960} cy={935} rx={205} ry={88} fill="url(#a6t-halo)" />
        </g>
        {/* PARTICULES "god rays" dans le faisceau (poussiere qui flotte, Gemini+Kimi) */}
        <g id="particles">
          {particles.map((p, i) => p.pop > 0.01 && (
            <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#f5e6c4" opacity={p.pop} />
          ))}
        </g>

        {/* SIEGE 7 au premier plan (Fable) */}
        <g id="siege-7">
          <ellipse cx={960} cy={952} rx={104} ry={50} fill="#04060a" fillOpacity={0.5} />
          <path d="M856 948 Q960 1034 1064 948 Q960 1010 856 948 Z" fill="#2a3444" stroke="#101720" strokeWidth={2} />
          <ellipse cx={960} cy={940} rx={98} ry={48} fill="#202935" stroke="#101720" strokeWidth={2} />
        </g>

        {/* JETON EMIRATS (Fable) — drapeau EAU dessine, revele au tEmirats */}
        <g id="jeton-emirats" opacity={0.4 + 0.6 * jetonReveal}>
          <circle cx={960} cy={935} r={82} fill="#0a0d12" />
          <g clipPath="url(#a6t-clipjeton)">
            <rect x={884} y={857} width={156} height={53} fill="#2f6e4a" />
            <rect x={884} y={910} width={156} height={52} fill="#ddd8c9" />
            <rect x={884} y={962} width={156} height={53} fill="#23262b" />
            <rect x={884} y={857} width={42} height={158} fill="#9d3039" />
            <circle cx={960} cy={935} r={76} fill="url(#a6t-jetonlum)" />
          </g>
          <circle cx={960} cy={935} r={76} fill="none" stroke="#0a0d12" strokeWidth={4} />
          <circle cx={960} cy={935} r={79} fill="none" stroke="#DAA520" strokeWidth={2.5} strokeOpacity={0.35 + 0.4 * spot} />
        </g>
        </g>{/* ===== fin CONTENU sous derive camera ===== */}

        {/* AMBIANCE (Fable) — vignette (hors derive, reste stable) */}
        <g id="ambiance">
          <rect x={0} y={0} width={1920} height={1080} fill="url(#a6t-vignette)" />
        </g>
      </svg>
    </div>
  );
};

export default SoudanActe6TableInsert;
