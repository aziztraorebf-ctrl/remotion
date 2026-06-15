/**
 * hooks-lib/theme.ts — Palette + profils d'animation centralises pour la bibliotheque de hooks.
 *
 * Source unique des couleurs de charte (fini les `const GOLD = ...` redefinis dans chaque hook)
 * et des profils de spring (evite l'AI-slop "tous les springs identiques" signale par le DA 3 modeles).
 *
 * Doctrine : memory/HOOKS-LIBRARY-PLAN.md (chantier hooks reutilisables, 2026-06-15).
 */

import type { SpringConfig } from "remotion";

// ── Palette de charte (NON-NEGOCIABLE) ──────────────────────────────────────
export const HOOK_COLORS = {
  navy: "#16213a", // fond / ocean profond
  gold: "#c8a951", // accent principal (pays focus, faisceaux)
  ivory: "#f2ebd9", // texte
  red: "#e63946", // tension / conflit UNIQUEMENT
} as const;

// ── Profils de spring (4 personnalites de mouvement) ────────────────────────
// Eviter d'utiliser le meme partout = la cle anti-AI-slop (cf. DA Kimi/DeepSeek).
// impact : slam d'un chiffre, overshoot marque.
// lourd  : objet massif qui se pose (cartouche, plaque).
// sec    : verrouillage net, peu de rebond (viseur qui lock).
// respir : apparition douce d'un label, aucun overshoot.
export const SPRING: Record<"impact" | "lourd" | "sec" | "respir", Partial<SpringConfig>> = {
  impact: { damping: 11, stiffness: 200, mass: 0.8 },
  lourd: { damping: 16, stiffness: 120, mass: 1.4 },
  sec: { damping: 26, stiffness: 320, mass: 0.6 },
  respir: { damping: 200, stiffness: 100, mass: 1 },
};

// ── Polices ─────────────────────────────────────────────────────────────────
export const HOOK_FONTS = {
  display: "'Bebas Neue', 'Impact', sans-serif", // chiffres/mots choc
  mono: "'IBM Plex Mono', monospace", // sous-textes techniques
} as const;
