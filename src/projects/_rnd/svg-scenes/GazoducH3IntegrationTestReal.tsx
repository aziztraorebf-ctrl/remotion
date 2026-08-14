// GazoducH3IntegrationTestReal — R&D EXPLORATION (2026-08-14), suite de GazoducH3IntegrationTest.
// Reprend le test d'intégration H3 avec les VRAIS éléments : vraie carte D3 (geoData réel, zoom Adrar
// via le mécanisme camFor déjà utilisé en production), vrai gabarit + vrai texte de l'overlay
// "chantier Adrar" (breakdown-v5-json/beat2-breakdown.json § TURNING_POINT), clip H3 en boucle.
// But : juger le rendu en conditions proches du réel avant de généraliser au recodage du Beat 2.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Loop, staticFile, interpolate, useCurrentFrame } from "remotion";
import geoData from "../d3-16x9/gazoducGeoElargie.json";

export const GAZODUC_H3_INTEGRATION_TEST_REAL_FRAMES = 240;

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

const LAND = "#102E4D";
const LAND_STROKE = "#5E789A";
const CYAN = "#2CD7FF";
const GOLD = "#D9A13B";

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);
const ALGERIA = (geoData.centroids as unknown as Record<string, [number, number]>).Algeria;

type Cam = { scale: number; tx: number; ty: number };
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
}
function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return { scale: a.scale + (b.scale - a.scale) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t };
}

const camWide = camFor(ALGERIA, 1.6);
// Décalage horizontal : le breakdown place le pin Adrar à x≈0.365 de l'écran (PAS centré) pour laisser
// la carte-overlay chantier occuper x=0.46→0.86 sans jamais recouvrir le pin/connecteur — reproduit
// ici en décalant le centre caméra vers la droite de (0.5-0.365)*W, ce qui pousse le sujet projeté
// vers la gauche de l'écran.
const camAdrarCentered = camFor(ALGERIA, 6.5);
const camAdrar: Cam = { ...camAdrarCentered, tx: camAdrarCentered.tx - (0.5 - 0.365) * W };

export const GazoducH3IntegrationTestReal: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== Vraie caméra : dézoom large -> push-in Adrar, jamais figée (règle 4 du breakdown) =====
  const p = interpolate(frame, [0, S(3.4)], [0, 1], { ...clampB, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const camBase = lerpCam(camWide, camAdrar, p);
  // micro-pan/zoom résiduel continu sous l'overlay (breakdown: "pan très lent 0.3° + zoom +3.5%")
  const driftT = frame * 0.006;
  const cam: Cam = {
    scale: camBase.scale * (1 + interpolate(frame, [S(3.4), S(8)], [0, 0.035], clampB)),
    tx: camBase.tx + Math.sin(driftT) * 4,
    ty: camBase.ty + Math.cos(driftT * 0.7) * 3,
  };

  const algeria = byName("Algeria");

  // ===== Overlay chantier : timing réel du breakdown (46.2s->51.6s décalé à 0s->5.4s pour ce test) =====
  const overlayStart = S(3.4);
  const overlayEnd = S(8.8);
  const dimIn = interpolate(frame, [overlayStart, overlayStart + S(0.35)], [0, 0.62], clampB);
  const dimOut = interpolate(frame, [overlayEnd - S(0.4), overlayEnd], [0.62, 0], clampB);
  const dimOpacity = frame < overlayEnd - S(0.4) ? dimIn : dimOut;

  const cardIn = interpolate(frame, [overlayStart + S(0.15), overlayStart + S(0.6)], [0, 1], clampB);
  const cardOut = interpolate(frame, [overlayEnd - S(0.35), overlayEnd], [1, 0], clampB);
  const cardOpacity = frame < overlayEnd - S(0.35) ? cardIn : cardOut;
  const cardScale = interpolate(cardIn, [0, 1], [0.94, 1]);

  const connectorDraw = interpolate(frame, [overlayStart + S(0.15), overlayStart + S(0.55)], [0, 1], clampB);
  const progressCircle = interpolate(frame, [overlayStart + S(0.9), overlayStart + S(1.9)], [0, 0.37], clampB);

  // Position écran du pin Adrar (projection réelle, suit la caméra)
  const adrarScreenX = ALGERIA[0] * cam.scale + cam.tx;
  const adrarScreenY = ALGERIA[1] * cam.scale + cam.ty;

  return (
    <AbsoluteFill style={{ background: "#06172B" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {countries.map((c, i) => (
            <path key={i} d={c.d} fill={LAND} fillOpacity={0.62} stroke={LAND_STROKE} strokeWidth={1.1 / cam.scale} />
          ))}
          {algeria && (
            <path d={algeria.d} fill="#143B61" fillOpacity={0.92} stroke={CYAN} strokeWidth={1.8 / cam.scale} />
          )}
        </g>

        {/* Assombrissement de la carte pendant l'overlay — DOIT être dessiné AVANT (donc en dessous
            de) le pin et le connecteur, sinon il les masque : le point/pulse et la flèche restent
            l'ancrage visuel vers l'overlay, ils doivent traverser le voile, pas disparaître dessous
            (retour Aziz 2026-08-14 : "garder la petite flèche qui relie à l'overlay"). */}
        <rect x={0} y={0} width={W} height={H} fill="rgba(0,8,18,1)" opacity={dimOpacity} />

        {/* Connecteur doré pin -> carte, tracé (breakdown: strokeDashoffset_draw) — reste visible
            PENDANT toute la durée de l'overlay, pas seulement lors du tracé initial. */}
        <path
          d={`M ${adrarScreenX} ${adrarScreenY} L ${adrarScreenX + (W * 0.09)} ${adrarScreenY - H * 0.055} L ${W * 0.46} ${H * 0.205 + H * 0.46 * 0.5}`}
          stroke={GOLD} strokeWidth={1.5} strokeDasharray="5 5" fill="none"
          opacity={connectorDraw > 0.05 ? 0.95 : 0}
          pathLength={1}
          strokeDashoffset={1 - connectorDraw}
        />

        {/* Pin Adrar ancré à l'écran (suit la vraie projection caméra) — pulse continu et fluide
            (sinusoïdal, jamais un reset brutal type frame%30) pour lire "vivant". */}
        <g transform={`translate(${adrarScreenX} ${adrarScreenY})`}>
          {(() => {
            const pulsePeriodF = S(1.6);
            const pulseT = (frame % pulsePeriodF) / pulsePeriodF;
            const pulseR = 12 + pulseT * 34;
            const pulseOp = (1 - pulseT) * 0.6;
            const pulseT2 = ((frame + pulsePeriodF / 2) % pulsePeriodF) / pulsePeriodF;
            const pulseR2 = 12 + pulseT2 * 34;
            const pulseOp2 = (1 - pulseT2) * 0.6;
            return (
              <>
                <circle r={pulseR} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={pulseOp} />
                <circle r={pulseR2} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={pulseOp2} />
              </>
            );
          })()}
          <circle r={48} fill="none" stroke={GOLD} strokeWidth={1.5} strokeDasharray="5 5"
            opacity={0.92}
            transform={`rotate(${frame * 0.66})`} />
          <circle r={9} fill="#06172B" stroke={CYAN} strokeWidth={3} />
          <circle r={4} fill={CYAN} />
        </g>
      </svg>

      {/* ===== Carte-overlay chantier — VRAI gabarit + VRAI texte du breakdown Beat 2 TURNING_POINT ===== */}
      <div
        style={{
          position: "absolute",
          left: `${0.46 * 100}%`,
          top: `${0.205 * 100}%`,
          width: `${0.4 * 100}%`,
          height: `${0.46 * 100}%`,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          background: "rgba(7, 24, 45, 0.96)",
          border: `1.5px solid ${CYAN}`,
          borderRadius: 6,
          boxShadow: `0 0 22px rgba(44, 215, 255, 0.22)`,
          padding: "3% 3.5%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{
          alignSelf: "flex-start",
          background: "rgba(14, 32, 48, 0.95)",
          border: `1.4px solid ${GOLD}`,
          borderRadius: 4,
          padding: "6px 14px",
          color: "#FFD06A",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.06em",
          marginBottom: 14,
        }}>
          4 JUIN 2026
        </div>

        <div style={{
          position: "relative",
          width: "100%",
          flex: "0 0 49%",
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${CYAN}44`,
          background: "#000",
        }}>
          <Loop durationInFrames={Math.floor(5.166 * FPS)}>
            <OffthreadVideo
              src={staticFile("_rnd/minimax-h3-tests/gazoduc-pelleteuse/pelleteuse-1080p-v1.mp4")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
          </Loop>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: "5%", gap: 16 }}>
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <svg width={56} height={56} viewBox="0 0 56 56">
              <circle cx={28} cy={28} r={22} fill="none" stroke="#263C55" strokeWidth={8} />
              <circle
                cx={28} cy={28} r={22} fill="none" stroke={CYAN} strokeWidth={8}
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - progressCircle)}
                transform="rotate(-90 28 28)"
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#EAF6FF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700,
            }}>
              {Math.round(progressCircle * 100)}%
            </div>
          </div>
          <div>
            <div style={{ color: CYAN, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>
              TRAVAUX EN COURS
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{
                  width: 5, height: 21,
                  background: i < 6 ? CYAN : "#263C55",
                }} />
              ))}
            </div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "#5E789A", opacity: 0.5, marginLeft: 8 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: interpolate(frame, [overlayStart + S(1.35), overlayStart + S(1.6)], [0, 1], clampB) }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${CYAN}`,
              background: `${CYAN}14`, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth={2}>
                <path d="M4 20 L4 12 L12 4 L20 12 L20 20 Z" />
              </svg>
            </div>
            <div style={{ color: "#EAF6FF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>
              ACTIVITÉ<br />ÉLEVÉE
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default GazoducH3IntegrationTestReal;
