// MOTEUR: AUCUN NOUVEAU — ce fichier ne cree AUCUNE scene. C'est un fichier de CADRAGE (fenetres de
// montage) qui reutilise deux scenes existantes sans toucher a leur code visuel. Les moteurs sont
// donc herites, tels quels : GEOMETRIE D3 pour l'extrait 4C (axe temporel + courbe + barre — le beat
// porte sur le TEMPS et la QUANTITE, cf en-tete de GazoducActe4Calendrier.tsx) et OBJET/METAPHORE SVG
// pour l'extrait Acte 2 (elevation technique de conduite + plume + trace dore, cf en-tete de
// GazoducActe2Financement.tsx). Aucun registre nouveau n'est introduit ici, donc rien a arbitrer.
//
// GazoducPortfolioEN — extraits ANGLOPHONES du Gazoduc pour le portfolio freelance 2D.
//
// POURQUOI CE FICHIER : les scenes de production sont francaises et calees sur la narration reelle
// (49.5s pour 4C, 51.3s pour le Financement). Un portfolio demande des extraits COURTS (~15-18s),
// muets, en anglais, et surtout en 1920x1080 — l'acte 2 n'existait qu'en 960x540 sur disque.
//
// PRINCIPE : ZERO duplication de code visuel. On ne recopie pas une scene pour la traduire — on
// REUTILISE le composant de production tel quel, en decalant sa frame d'entree via <Sequence from>
// negatif (le pattern "fenetre" : le composant croit demarrer a sa frame N, le rendu commence a 0).
// Les compositions FR de production ne sont pas touchees : GazoducActe4Calendrier garde son defaut
// francais (CALENDRIER_LABELS_FR), on ne fait que lui passer la variante EN ici.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  GazoducActe4Calendrier,
  CALENDRIER_LABELS_EN,
} from "./GazoducActe4Calendrier";
import { GazoducActe2Financement } from "./GazoducActe2Financement";

const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);

// ===== EXTRAIT 1 — "European demand curve" (4C) =====
// Fenetre choisie sur le CODE de GazoducActe4Calendrier (pas au hasard) : le decrochage de la courbe
// court de M.declinerDemande (29.84s) a S(40.5), et le RETRECISSEMENT de 42.56s a ~44.8s. On demarre
// a 27s pour laisser voir la courbe encore PLATE (sinon on ne comprend pas qu'elle decroche), et on
// tient jusqu'a 44.5s : plateau -> glissement -> croisement (35.8s) -> contraction finale.
export const DEMAND_CURVE_EN_START_F = S(27);
export const DEMAND_CURVE_EN_FRAMES = S(17.5);

export const GazoducDemandCurveEN: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050c1a" }}>
      <Sequence from={-DEMAND_CURVE_EN_START_F}>
        <GazoducActe4Calendrier labels={CALENDRIER_LABELS_EN} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ===== EXTRAIT 2 — "Pipeline blueprint" (Acte 2, Financement) — AUCUN TEXTE A TRADUIRE =====
// Verifie sur le code ET sur les frames du rendu 960x540 : ce composant ne contient pas un seul
// element <text>. La scene est purement graphique (elevation technique, plume, trace dore), donc
// l'extrait est deja utilisable pour un portfolio anglophone sans la moindre traduction.
//
// Fenetre : le trace dore (fantomeProgress/traceProgress) court de 20s a 46s dans le composant. On
// entre a 22s — le tuyau, le gouffre, le document et la plume sont tous entierement dessines (leurs
// interpolations se terminent a 20-21s) — et on tient 17.5s, pendant lesquelles le gaz progresse en
// continu a travers les sections fantomes. C'est la meme portion que le repere 98-116s du montage.
export const BLUEPRINT_HD_START_F = S(22);
export const BLUEPRINT_HD_FRAMES = S(17.5);

export const GazoducBlueprintHD: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#182746" }}>
      <Sequence from={-BLUEPRINT_HD_START_F}>
        <GazoducActe2Financement />
      </Sequence>
    </AbsoluteFill>
  );
};
