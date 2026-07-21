/**
 * VoxReproScene — reproduction FIDELE de la reference YouTube "I Built This Map Animation
 * Using Only Claude Code & Remotion" (MoSidd, https://youtu.be/Y6mOBK5peDU), transcript +
 * capture ecran Aziz (screen-recording-vox-ref.mov) analyses en detail.
 *
 * OBJECTIF DE CE FICHIER : verifier honnetement si LEUR methode (6 prompts, world-atlas +
 * TopoJSON + d3-geo, PAS Mapbox) est reproductible telle quelle avec Claude Code + Remotion —
 * sans s'appuyer sur nos briques Mapbox/warmap existantes (qui faussent la comparaison, cf
 * feedback Aziz 2026-07-07 : "je devais refaire la carte qu'ils ont, pas repartir de mes
 * prototypes existants"). Stack STRICTEMENT identique a la reference : world-atlas (donnees
 * pays brutes), topojson-client (unpacking), d3-geo (projection spherique -> 2D). Zero Mapbox,
 * zero token, zero WebGL — rendu 100% SVG cote client, comme leur pipeline.
 *
 * PROTO R&D — pas un livrable. Sujet neutre (pas Iran/Israel/Trump reels) : meme mecanique
 * technique (2 pays s'allument, jets, frappe, blocus), figures generiques (Gemini), pour
 * tester la METHODE sans reproduire un contenu politique sensible identifiable.
 *
 * Scene 1 (~8s, prompt 2 de la ref) : zoom monde -> pays A, glow blanc + cercle rouge,
 *   silhouette qui rise (ease-out), pan final vers pays B.
 * Scene 2 (~8s, prompt 3) : pays A+B s'allument (glow colore), 3 jets top-down traversent,
 *   explosion KEYEE EN SCREEN-BLEND (source PNG fond NOIR, pas alpha — le vrai trick de la
 *   reference, jamais teste avant sur nos protos Mapbox), marques rouges remanentes.
 * Scene 3 (~15s, prompt 4) : zoom serre sur un detroit fictif, missiles, ligne de blocus.
 *
 * Assemblage (prompt 5-6) : 1 seul <Sequence> continu par scene, chaque scene DEMARRE sur la
 * derniere frame de la precedente (regle explicite de la reference : "one continuous shot").
 */
import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  continueRender,
  delayRender,
} from "remotion";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";

// ─────────────────────────────────────────────────────────────────────────
// SETUP GEO — prompt 1 de la reference : "Get country shapes from World Atlas.
// Unpack them with TopoJSON." + projection d3-geo (mercator, comme la reference
// qui dit explicitement "it takes the Earth ... and projects it onto your 2D screen").
// ─────────────────────────────────────────────────────────────────────────

const WIDTH = 1920;
const HEIGHT = 1080;

// Style navy/gris — meme registre que la reference ("deep navy ocean, darken at edges,
// subtle film grain"). Pas invente : couleurs lues directement sur les frames de la video.
const NAVY_OCEAN = "#0d1b2a";
const LAND_FILL = "#aab4bd";
const LAND_STROKE = "#3a4a5a";

type CountryFeature = {
  type: "Feature";
  properties: { name: string };
  geometry: any;
  id?: string;
};

function useWorldCountries() {
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [handle] = useState(() => delayRender("vox-repro-load-topojson"));

  useEffect(() => {
    fetch(staticFile("_rnd/vox-repro/countries-110m.json"))
      .then((r) => r.json())
      .then((topo) => {
        // topojson.feature() = "unpack" — exactement le mot utilise dans le prompt 1 de la
        // reference ("Unpack them with TopoJSON"). Convertit l'objet Topology en FeatureCollection.
        const fc = topojson.feature(topo, topo.objects.countries) as unknown as {
          type: "FeatureCollection";
          features: CountryFeature[];
        };
        setCountries(fc.features);
        continueRender(handle);
      })
      .catch((e) => {
        console.warn("[VoxRepro] TopoJSON load failed:", e);
        continueRender(handle);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return countries;
}

// Camera d3-geo : centre + zoom -> projection mercator reconfiguree. Frame-driven (recalculee
// a chaque frame via interpolate sur les keyframes ci-dessous), jamais de transition CSS/JS
// imperative — meme discipline que la doctrine Mapbox mais appliquee a d3-geo.
type CamKeyframe = { f: number; center: [number, number]; scale: number };

function useProjection(camKeyframes: CamKeyframe[], frame: number) {
  return useMemo(() => {
    // interpolation lineaire entre keyframes (par segments), pas de easing custom ici —
    // le easing narratif se fait sur les overlays, la camera elle-meme reste lineaire/douce.
    let center: [number, number] = camKeyframes[0].center;
    let scale = camKeyframes[0].scale;
    for (let i = 0; i < camKeyframes.length - 1; i++) {
      const a = camKeyframes[i];
      const b = camKeyframes[i + 1];
      if (frame >= a.f && frame <= b.f) {
        const t = (frame - a.f) / (b.f - a.f);
        const ease = Easing.inOut(Easing.cubic)(t);
        center = [
          a.center[0] + (b.center[0] - a.center[0]) * ease,
          a.center[1] + (b.center[1] - a.center[1]) * ease,
        ];
        scale = a.scale + (b.scale - a.scale) * ease;
        break;
      }
      if (frame > camKeyframes[camKeyframes.length - 1].f) {
        center = camKeyframes[camKeyframes.length - 1].center;
        scale = camKeyframes[camKeyframes.length - 1].scale;
      }
    }
    const projection = d3geo
      .geoMercator()
      .center(center)
      .scale(scale)
      .translate([WIDTH / 2, HEIGHT / 2]);
    const path = d3geo.geoPath(projection);
    return { projection, path };
  }, [camKeyframes, frame]);
}

export { useWorldCountries, useProjection, NAVY_OCEAN, LAND_FILL, LAND_STROKE, WIDTH, HEIGHT };
export type { CountryFeature, CamKeyframe };
