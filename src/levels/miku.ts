import { MIKU_BPMS } from "../utils/constants";

import { SpawnScene } from "./types";

/**
 * Spawn sequence for Miku — Anamanaguchi (BPM 128, MIKU_BPMS ≈ 469ms).
 * This is a placeholder choreography — tune the timings here to match the track.
 * Loop point: 90s → scene.restart
 */
export function setupMikuSequence(scene: SpawnScene) {
  // ── Intro: triangles (0 – 5s) ─────────────────────────────────────────────
  scene.time.addEvent({
    delay: MIKU_BPMS, startAt: MIKU_BPMS / 2, repeat: 8,
    callback: () => scene.addTriangle(),
  });
  scene.time.addEvent({
    delay: MIKU_BPMS * 2, startAt: MIKU_BPMS, repeat: 4,
    callback: () => scene.addTriangleJump(),
  });

  // ── Squares + pulse kick in at 5s ─────────────────────────────────────────
  scene.time.addEvent({
    delay: 5000,
    callback: () => {
      scene.time.addEvent({ delay: MIKU_BPMS, repeat: 999, callback: () => scene.addSquare() });
    },
  });
  scene.time.addEvent({
    delay: 5000,
    callback: () => scene.addPulseTween(999, MIKU_BPMS),
  });

  // ── Triangles return at 15s ───────────────────────────────────────────────
  scene.time.addEvent({
    delay: 15000,
    callback: () => {
      scene.time.addEvent({ delay: MIKU_BPMS, repeat: 16, callback: () => scene.addTriangle() });
      scene.time.addEvent({ delay: MIKU_BPMS, repeat: 16, callback: () => scene.addTriangleJump() });
    },
  });

  // ── Blue wall at 25s ──────────────────────────────────────────────────────
  scene.time.addEvent({
    delay: 25000,
    callback: () => {
      scene.time.addEvent({ delay: MIKU_BPMS * 2, repeat: 12, callback: () => scene.addBlue() });
    },
  });

  // ── Yellow starts at 35s ──────────────────────────────────────────────────
  scene.time.addEvent({
    delay: 35000,
    callback: () => {
      scene.time.addEvent({ delay: MIKU_BPMS, repeat: 30, callback: () => scene.addYellow() });
    },
  });

  // ── More triangles at 50s ─────────────────────────────────────────────────
  scene.time.addEvent({
    delay: 50000,
    callback: () => {
      scene.time.addEvent({ delay: MIKU_BPMS, repeat: 20, callback: () => scene.addTriangle() });
      scene.time.addEvent({ delay: MIKU_BPMS, repeat: 20, callback: () => scene.addTriangleJump() });
    },
  });

  // ── Spinning triangle finale at 70s ───────────────────────────────────────
  scene.time.addEvent({
    delay: 70000,
    callback: () => {
      scene.time.addEvent({ delay: 200, repeat: 30, callback: () => scene.addSpinningTriangle() });
    },
  });

  // ── Loop ──────────────────────────────────────────────────────────────────
  scene.time.addEvent({ delay: 90000, callback: () => scene.loopGame() });
}
