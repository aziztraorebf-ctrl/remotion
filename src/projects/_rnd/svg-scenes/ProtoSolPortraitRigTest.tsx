/**
 * ProtoSolPortraitRigTest — test decisif du portrait "rig-first" genere par openai/gpt-5.6-sol
 * (memory/tools/openrouter-svg.md, session 2026-07-10). Le SVG brut declare des groupes nommes
 * (eyebrow-left/right, eye-left/right-open, eyelid-left/right, mouth-neutral, mouth-open, head, hat)
 * avec des pivots reportes en JSON. Ce proto verifie si les transforms REELS (pas juste le JSON)
 * tiennent : clignement (scale eyelid depuis son pivot), parole (cross-fade mouth), hochement (rotate head).
 */
import React from "react";
import {
  AbsoluteFill, useCurrentFrame, interpolate, Easing,
} from "remotion";

export const PROTO_SOL_PORTRAIT_RIG_TEST_FRAMES = 210;

const HEAD_PIVOT = { x: 300, y: 282 };

// pivots reportes par Sol lui-meme (sol-portrait-rigfirst-pivots.json)
const EYELID_LEFT_PIVOT = { x: 244, y: 241 };
const EYELID_RIGHT_PIVOT = { x: 357, y: 241 };

function blinkScaleY(frame: number, blinkStart: number) {
  // 0 = ouvert (paupiere quasi invisible, deja scale .08 dans le SVG source) -> 1 = ferme (couvre l'oeil)
  const t = interpolate(
    frame,
    [blinkStart, blinkStart + 4, blinkStart + 8, blinkStart + 12],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  // le SVG source a deja scale(1 0.08) code en dur sur le groupe -> on ADDITIONNE un facteur par-dessus
  // via un second scale Y de 1 (repos) a 12.5 (= 1/0.08, pour annuler l'aplatissement source et couvrir l'oeil)
  return 1 + t * (1 / 0.08 - 1);
}

export const ProtoSolPortraitRigTest: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // clignements a 40, 110, 170
  const blinkStarts = [40, 110, 170];
  const activeBlink = blinkStarts.find((s) => frame >= s && frame <= s + 12);
  const eyelidScaleY = activeBlink !== undefined ? blinkScaleY(frame, activeBlink) : 1;

  // parole : cross-fade mouth-neutral / mouth-open, boucle rapide entre 60 et 150
  const talkPhase = interpolate(frame, [60, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const talking = frame >= 60 && frame <= 150;
  const mouthOpenOpacity = talking ? (Math.sin(frame / 4) * 0.5 + 0.5) : 0;

  // hochement de tete doux, continu
  const headTiltDeg = Math.sin(frame / 45) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: "#e9d9b0" }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2b2117", marginBottom: 16 }}>
          Test transforms reels — portrait rig-first GPT-5.6 Sol (clignement + parole + hochement)
        </div>
        <svg width={480} height={480} viewBox="0 0 600 600">
          <defs>
            <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3dcae" />
              <stop offset="1" stopColor="#d8b878" />
            </linearGradient>
            <linearGradient id="skin-gradient" x1="0.18" y1="0.08" x2="0.82" y2="0.92">
              <stop offset="0" stopColor="#a96138" />
              <stop offset="0.52" stopColor="#8b482b" />
              <stop offset="1" stopColor="#6d3425" />
            </linearGradient>
            <linearGradient id="neck-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6e3525" />
              <stop offset="0.48" stopColor="#985131" />
              <stop offset="1" stopColor="#673023" />
            </linearGradient>
            <linearGradient id="shirt-gradient" x1="0" y1="0" x2="0.85" y2="1">
              <stop offset="0" stopColor="#315e68" />
              <stop offset="1" stopColor="#173a45" />
            </linearGradient>
            <linearGradient id="hat-gradient" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0" stopColor="#d3b56f" />
              <stop offset="0.55" stopColor="#af8a4d" />
              <stop offset="1" stopColor="#846439" />
            </linearGradient>
            <pattern id="canvas-weave" width={12} height={12} patternUnits="userSpaceOnUse">
              <path d="M0 3H12M0 9H12" fill="none" stroke="#f1dda7" strokeWidth={1} opacity={0.25} />
              <path d="M3 0V12M9 0V12" fill="none" stroke="#60482e" strokeWidth={0.8} opacity={0.18} />
            </pattern>
            <clipPath id="face-clip">
              <path d="M191 197C189 154 219 126 265 116C309 106 367 119 395 157C415 185 412 241 405 290C398 341 377 390 337 414C314 428 283 427 260 416C217 395 194 352 187 302C181 260 180 222 191 197Z" />
            </clipPath>
          </defs>

          <rect width={600} height={600} fill="url(#bg-gradient)" />
          <circle cx={79} cy={94} r={54} fill="#fff1c8" opacity={0.35} />

          <path d="M231 383C234 417 224 431 206 444C239 474 274 486 301 486C333 486 370 472 394 445C373 431 365 413 368 382Z" fill="url(#neck-gradient)" stroke="#2b211d" strokeWidth={6} strokeLinejoin="round" />

          <path d="M66 600L78 512C83 474 117 447 178 430L243 414C259 443 279 457 301 458C324 458 344 443 357 414L423 430C483 447 517 475 523 514L535 600Z" fill="url(#shirt-gradient)" stroke="#19292c" strokeWidth={7} strokeLinejoin="round" />
          <path d="M258 500L279 526L301 458L322 526L343 500" fill="#102e38" stroke="#19292c" strokeWidth={4} strokeLinejoin="round" />

          {/* head group : rotation autour du pivot report par Sol (300, 282) */}
          <g transform={`rotate(${headTiltDeg} ${HEAD_PIVOT.x} ${HEAD_PIVOT.y})`}>
            <path d="M192 244C169 236 155 251 158 276C161 301 174 319 195 316L205 285Z" fill="#854329" stroke="#2b211d" strokeWidth={6} strokeLinejoin="round" />
            <path d="M408 244C431 236 445 251 442 276C439 301 426 319 405 316L395 285Z" fill="#783922" stroke="#2b211d" strokeWidth={6} strokeLinejoin="round" />

            <path d="M191 197C189 154 219 126 265 116C309 106 367 119 395 157C415 185 412 241 405 290C398 341 377 390 337 414C314 428 283 427 260 416C217 395 194 352 187 302C181 260 180 222 191 197Z" fill="url(#skin-gradient)" stroke="#2b211d" strokeWidth={7} strokeLinejoin="round" />

            <g clipPath="url(#face-clip)" opacity={0.43} fill="none" strokeLinecap="round">
              <path d="M211 182L233 171M215 192L241 179M221 201L247 187M354 174L382 188M350 184L384 200M354 196L386 211" stroke="#d98b58" strokeWidth={3} />
              <path d="M200 286L226 277M202 298L229 288M207 310L233 300M374 278L401 288M372 290L398 301M368 302L394 313" stroke="#552a22" strokeWidth={3} />
              <path d="M217 326L242 316M220 338L247 326M226 350L251 338M348 320L382 331M345 333L376 344M341 346L369 357" stroke="#4f2821" strokeWidth={3} />
            </g>

            <path d="M287 250C284 276 280 299 272 316C267 328 278 336 295 334" fill="none" stroke="#4b2923" strokeWidth={5} strokeLinecap="round" />
            <path d="M307 245C310 270 313 296 323 316C328 327 318 336 303 334" fill="none" stroke="#c2764b" strokeWidth={3.5} strokeLinecap="round" opacity={0.72} />

            {/* eyes */}
            <g id="eye-left-open">
              <path d="M216 252C228 239 249 236 268 250C254 265 231 267 216 252Z" fill="#f3dfc3" stroke="#2b211d" strokeWidth={4} strokeLinejoin="round" />
              <ellipse cx={244} cy={252} rx={10.5} ry={12.5} fill="#4a2c1d" />
              <ellipse cx={244} cy={252} rx={5} ry={7} fill="#171716" />
              <circle cx={248} cy={248} r={2.5} fill="#fff7df" />
            </g>
            <g id="eye-right-open">
              <path d="M332 250C349 237 371 239 384 252C369 267 346 265 332 250Z" fill="#f3dfc3" stroke="#2b211d" strokeWidth={4} strokeLinejoin="round" />
              <ellipse cx={357} cy={252} rx={10.5} ry={12.5} fill="#4a2c1d" />
              <ellipse cx={357} cy={252} rx={5} ry={7} fill="#171716" />
              <circle cx={361} cy={248} r={2.5} fill="#fff7df" />
            </g>

            {/* eyelids : scale Y anime EN PLUS depuis le pivot rapporte par Sol (transform-origin manuel) */}
            <g transform={`translate(${EYELID_LEFT_PIVOT.x} ${EYELID_LEFT_PIVOT.y}) scale(1 ${eyelidScaleY}) translate(${-EYELID_LEFT_PIVOT.x} ${-EYELID_LEFT_PIVOT.y})`}>
              <g transform="translate(0 241) scale(1 0.08) translate(0 -241)">
                <path d="M214 249C228 233 252 232 270 248C261 264 230 270 215 254C212 252 212 251 214 249Z" fill="#995333" stroke="#2b211d" strokeWidth={4} vectorEffect="non-scaling-stroke" />
              </g>
            </g>
            <g transform={`translate(${EYELID_RIGHT_PIVOT.x} ${EYELID_RIGHT_PIVOT.y}) scale(1 ${eyelidScaleY}) translate(${-EYELID_RIGHT_PIVOT.x} ${-EYELID_RIGHT_PIVOT.y})`}>
              <g transform="translate(0 241) scale(1 0.08) translate(0 -241)">
                <path d="M330 248C348 232 372 233 386 249C388 251 388 252 385 254C370 270 339 264 330 248Z" fill="#8b472d" stroke="#2b211d" strokeWidth={4} vectorEffect="non-scaling-stroke" />
              </g>
            </g>

            <g id="eyebrow-left">
              <path d="M211 224C227 210 252 207 273 218C269 224 265 228 260 230C245 223 229 224 214 232C210 230 209 227 211 224Z" fill="#30231e" />
            </g>
            <g id="eyebrow-right">
              <path d="M327 218C348 207 373 210 389 224C391 227 390 230 386 232C371 224 355 223 340 230C335 228 331 224 327 218Z" fill="#30231e" />
            </g>

            <path d="M247 367C263 359 281 357 299 360C318 356 339 359 354 368C342 380 323 386 300 385C278 386 259 381 247 367Z" fill="#5b2a26" opacity={0.72} />

            {/* mouth : cross-fade neutral <-> open pour simuler la parole */}
            <g id="mouth-neutral" opacity={1 - mouthOpenOpacity}>
              <path d="M247 366C264 361 280 361 299 364C318 360 336 362 354 368C337 375 319 376 300 374C281 376 263 374 247 366Z" fill="#52251f" stroke="#2b211d" strokeWidth={3.5} strokeLinejoin="round" />
              <path d="M260 378C274 384 286 386 300 386C315 386 328 383 340 378C329 393 314 399 300 399C284 399 269 392 260 378Z" fill="#7b382e" stroke="#2b211d" strokeWidth={3} />
            </g>
            <g id="mouth-open" opacity={mouthOpenOpacity}>
              <path d="M247 366C263 357 282 357 299 361C318 357 339 360 354 368C344 397 325 410 300 410C274 410 255 396 247 366Z" fill="#4a2423" stroke="#2b211d" strokeWidth={4} strokeLinejoin="round" />
              <path d="M260 371C275 365 286 365 299 368C314 364 328 366 342 372C325 379 277 379 260 371Z" fill="#f0d5bd" />
            </g>

            <g id="hat">
              <path d="M195 166C198 123 220 87 255 73C286 60 332 62 365 77C395 91 410 125 408 169C355 184 249 186 195 166Z" fill="url(#hat-gradient)" stroke="#2b211d" strokeWidth={7} strokeLinejoin="round" />
              <path d="M195 166C198 123 220 87 255 73C286 60 332 62 365 77C395 91 410 125 408 169C355 184 249 186 195 166Z" fill="url(#canvas-weave)" opacity={0.85} />
              <path d="M184 157C220 145 260 148 299 154C340 146 390 145 426 161C434 165 432 176 423 181C388 200 346 199 300 190C253 199 211 197 176 179C166 173 171 162 184 157Z" fill="url(#hat-gradient)" stroke="#2b211d" strokeWidth={7} strokeLinejoin="round" />
            </g>
          </g>
        </svg>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#4a3a28", marginTop: 12 }}>
          frame {frame} — clignements @40/110/170, parole 60-150, hochement continu
        </div>
      </div>
    </AbsoluteFill>
  );
};
