import { BPMS } from "../utils/constants";
import { SpawnScene } from "./types";

/**
 * Spawn sequence for {Rose} — BPM 181.
 * All timings are hand-tuned to the original rose.mp3 / rose.ogg track.
 * Loop point: 75.5s → scene.restart
 */
export function setupRoseSequence(scene: SpawnScene) {
  // Beat-sync pulse on shapes (starts at the first big hit)
  scene.time.addEvent({
    delay: 6800,
    callback: () => scene.addPulseTween(111),
  });
  // Second pulse wave kicks in after the drop at ~46s
  scene.time.addEvent({
    delay: 46000,
    callback: () => scene.addPulseTween(-1),
  });

  // ── Intro triangles (0 – 4s) ──────────────────────────────────────────────
  scene.time.addEvent({
    delay: 600, startAt: 550, repeat: 10,
    callback: () => scene.addTriangle(),
  });
  scene.time.addEvent({
    delay: 620, startAt: 450, repeat: 11,
    callback: () => scene.addTriangleJump(),
  });

  // ── Squares start at 4s ───────────────────────────────────────────────────
  scene.time.addEvent({
    delay: 4000,
    callback: () => {
      scene.time.addEvent({ delay: 360, repeat: 172, callback: () => scene.addSquare() });
    },
  });

  // ── Triangles return at 18.4s ─────────────────────────────────────────────
  scene.time.addEvent({
    delay: 18400,
    callback: () => {
      scene.time.addEvent({ delay: BPMS, repeat: 23, callback: () => scene.addTriangle() });
      scene.time.addEvent({ delay: BPMS, repeat: 26, callback: () => scene.addTriangleJump() });
    },
  });

  // ── Blue wall at 28s (clap section) ───────────────────────────────────────
  scene.time.addEvent({
    delay: 28000,
    callback: () => {
      scene.time.addEvent({ delay: 700, startAt: 600, repeat: 14, callback: () => scene.addBlue() });
    },
  });

  // ── Triangles briefly at 38.5s ────────────────────────────────────────────
  scene.time.addEvent({
    delay: 38500,
    callback: () => {
      scene.time.addEvent({ delay: BPMS, repeat: 12, callback: () => scene.addTriangle() });
      scene.time.addEvent({ delay: BPMS, repeat: 18, callback: () => scene.addTriangleJump() });
    },
  });

  // ── Yellow chaos at 45.8s drop ────────────────────────────────────────────
  scene.time.addEvent({
    delay: 45800,
    callback: () => {
      scene.time.addEvent({ delay: BPMS, repeat: 45, callback: () => scene.addYellow() });
    },
  });

  // ── Triangles after drop at 49.5s ─────────────────────────────────────────
  scene.time.addEvent({
    delay: 49500,
    callback: () => {
      scene.time.addEvent({ delay: BPMS, repeat: 12, callback: () => scene.addTriangle() });
      scene.time.addEvent({ delay: BPMS, repeat: 20, callback: () => scene.addTriangleJump() });
    },
  });

  // ── Spinning triangle finale at 66s ───────────────────────────────────────
  scene.time.addEvent({
    delay: 66000,
    callback: () => {
      scene.time.addEvent({ delay: 150, repeat: 40, callback: () => scene.addSpinningTriangle() });
    },
  });

  // ── Loop ──────────────────────────────────────────────────────────────────
  scene.time.addEvent({ delay: 75500, callback: () => scene.loopGame() });
}
