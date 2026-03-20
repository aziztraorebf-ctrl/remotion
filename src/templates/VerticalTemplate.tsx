import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * VerticalTemplate — 1080x1920 (9:16) Short-form video wrapper
 *
 * Safe zones for TikTok / YouTube Shorts / Instagram Reels:
 *   Top    : 120px — profile bar, live indicator
 *   Bottom : 340px — nav bar, caption, CTA buttons
 *   Left   : 80px  — margin
 *   Right  : 140px — like / comment / share / follow buttons
 *
 * Usage:
 *   <VerticalTemplate background={<MyAsset />} overlay={<MyText />} />
 *
 * For horizontal (16:9) assets scaled to fill width:
 *   Pass scale={SCALE_16_9_TO_9_16} to your background component.
 *   The asset will be centered vertically, cropping top and bottom.
 */

export const VERTICAL_WIDTH = 1080;
export const VERTICAL_HEIGHT = 1920;

export const SAFE_ZONES = {
  top: 120,
  bottom: 340,
  left: 80,
  right: 140,
} as const;

/**
 * Scale factor to fit a 16:9 asset (1920x1080) into a 9:16 frame (1080x1920)
 * by filling the full width. The asset will be ~3.16x taller than the frame,
 * so only the center portion is visible — crop top and bottom intentionally.
 *
 * 1080 / 1920 = 0.5625
 * At scale 0.5625: asset renders 1080px wide, 607px tall (letterboxed)
 *
 * To fill width without letterbox: scale = 1080 / 1920 = 0.5625 (width match)
 * Asset height at this scale: 1080 * 0.5625 = 607px — leaves 1313px empty
 *
 * To fill height instead: scale = 1920 / 1080 = 1.778
 * Asset width at this scale: 1920 * 1.778 = 3413px — crops sides heavily
 *
 * RECOMMENDED for horizontal assets: use a viewBox crop instead of CSS scale.
 * See comments in VerticalFlotteShort.tsx for the implementation pattern.
 */
export const SCALE_FIT_WIDTH = VERTICAL_WIDTH / 1920;
export const SCALE_FIT_HEIGHT = VERTICAL_HEIGHT / 1080;

/**
 * Inner content area excluding safe zones.
 * Use these constants to position text and UI elements.
 */
export const CONTENT_ZONE = {
  top: SAFE_ZONES.top,
  bottom: VERTICAL_HEIGHT - SAFE_ZONES.bottom,
  left: SAFE_ZONES.left,
  right: VERTICAL_WIDTH - SAFE_ZONES.right,
  width: VERTICAL_WIDTH - SAFE_ZONES.left - SAFE_ZONES.right,
  height: VERTICAL_HEIGHT - SAFE_ZONES.top - SAFE_ZONES.bottom,
} as const;

interface VerticalTemplateProps {
  background?: React.ReactNode;
  overlay?: React.ReactNode;
  ui?: React.ReactNode;
  showSafeZones?: boolean;
}

export const VerticalTemplate: React.FC<VerticalTemplateProps> = ({
  background,
  overlay,
  ui,
  showSafeZones = false,
}) => {
  return (
    <AbsoluteFill>
      {/* Layer 1 : background asset */}
      {background && <AbsoluteFill>{background}</AbsoluteFill>}

      {/* Layer 2 : text / overlay content */}
      {overlay && (
        <AbsoluteFill
          style={{
            top: SAFE_ZONES.top,
            bottom: SAFE_ZONES.bottom,
            left: SAFE_ZONES.left,
            right: SAFE_ZONES.right,
            height: CONTENT_ZONE.height,
          }}
        >
          {overlay}
        </AbsoluteFill>
      )}

      {/* Layer 3 : UI elements (progress bar, watermark, etc.) */}
      {ui && <AbsoluteFill>{ui}</AbsoluteFill>}

      {/* Debug : safe zone outlines — only visible when showSafeZones=true */}
      {showSafeZones && (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          {/* Top safe zone */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: SAFE_ZONES.top,
              backgroundColor: 'rgba(255,0,0,0.15)',
              borderBottom: '2px dashed rgba(255,0,0,0.6)',
            }}
          />
          {/* Bottom safe zone */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: SAFE_ZONES.bottom,
              backgroundColor: 'rgba(255,0,0,0.15)',
              borderTop: '2px dashed rgba(255,0,0,0.6)',
            }}
          />
          {/* Right safe zone */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: SAFE_ZONES.right,
              backgroundColor: 'rgba(255,165,0,0.15)',
              borderLeft: '2px dashed rgba(255,165,0,0.6)',
            }}
          />
          {/* Left safe zone */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: SAFE_ZONES.left,
              backgroundColor: 'rgba(255,165,0,0.15)',
              borderRight: '2px dashed rgba(255,165,0,0.6)',
            }}
          />
          {/* Content zone label */}
          <div
            style={{
              position: 'absolute',
              top: SAFE_ZONES.top + 8,
              left: SAFE_ZONES.left + 8,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 24,
              fontFamily: 'monospace',
            }}
          >
            {`CONTENT ZONE ${CONTENT_ZONE.width}x${CONTENT_ZONE.height}px`}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
