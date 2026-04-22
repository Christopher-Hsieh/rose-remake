import { MIKU_BPMS } from "../utils/constants";
import { SpawnScene } from "./types";

/**
 * Spawn sequence for Miku — Anamanaguchi (BPM 128 ≈ 469ms/beat).
 * Audio starts at the 10s mark of the file (seek: 10 in main-scene).
 * All onset timestamps below are (original audio time − 10s).
 *
 * Sections:
 *   0  –  5s   Intro      — steady blue squares, no obstacles yet
 *   5s          →          pulse starts, BPM-locked to 128
 *   5  – 20s   Chorus 1   — wall drops on accent pairs, triangles on beats
 *   20 – 35s   Drop       — spinning triangles, yellow, walls on every hit
 *   35 – 49s   Outro      — sparse wind-down
 *   49.5s       →          loop
 */
export function setupMikuSequence(scene: SpawnScene) {
  const at = (ms: number, fn: () => void) =>
    scene.time.addEvent({ delay: ms, callback: fn });

  // ── INTRO: Blue squares for 5 seconds ────────────────────────────────────
  scene.time.addEvent({
    delay: MIKU_BPMS, repeat: 10,
    callback: () => scene.addSquare(),
  });

  // ── 5s: Pulse starts + continuous square stream carries on ────────────────
  at(5000, () => {
    scene.addPulseTween(999, MIKU_BPMS);
    scene.time.addEvent({ delay: MIKU_BPMS, repeat: 94, callback: () => scene.addSquare() });
  });

  // ── CHORUS 1: Walls + triangles on detected beats (5.44 – 19.95s) ────────
  // Original audio 15.44s → gameplay 5.44s
  at(5440,  () => scene.addBlue());
  at(5910,  () => scene.addBlue());   // 1-beat pair

  at(6860,  () => scene.addTriangle());
  at(7780,  () => scene.addBlue());

  // Big single hit after 1.4s gap → wall + triangle together
  at(9190,  () => { scene.addBlue(); scene.addTriangle(); });

  at(10590, () => scene.addTriangle());
  at(11530, () => scene.addTriangle());
  at(12470, () => scene.addBlue());

  // Triplet (2-beat, 1-beat, 1-beat)
  at(13410, () => scene.addTriangle());
  at(13880, () => scene.addTriangleJump());
  at(14340, () => scene.addBlue());

  at(15280, () => scene.addTriangle());
  at(16220, () => { scene.addBlue(); scene.addTriangle(); });
  at(17160, () => scene.addTriangle());
  at(18100, () => scene.addBlue());

  // Triplet building into the drop
  at(19030, () => scene.addTriangle());
  at(19510, () => scene.addTriangleJump());
  at(19950, () => { scene.addBlue(); scene.addTriangleJump(); });

  // ── DROP: Dense chaos (20 – 35s) ─────────────────────────────────────────
  at(20900, () => { scene.addSpinningTriangle(); scene.addBlue(); });
  at(21850, () => scene.addSpinningTriangle());

  // 1-beat pair
  at(22320, () => scene.addBlue());
  at(22770, () => scene.addSpinningTriangle());

  at(23710, () => { scene.addSpinningTriangle(); scene.addBlue(); });
  at(24640, () => scene.addYellow());

  // Near-double (0.23s) → two fast hits
  at(25130, () => scene.addSpinningTriangle());
  at(25360, () => { scene.addSpinningTriangle(); scene.addBlue(); });

  at(26060, () => scene.addYellow());
  at(26520, () => { scene.addBlue(); scene.addSpinningTriangle(); });
  at(27460, () => scene.addSpinningTriangle());
  at(28390, () => { scene.addBlue(); scene.addYellow(); });
  at(29350, () => scene.addSpinningTriangle());

  // 1-beat pair
  at(29820, () => scene.addBlue());
  at(30280, () => { scene.addSpinningTriangle(); scene.addYellow(); });

  at(31210, () => scene.addBlue());

  // 1-beat pair
  at(31690, () => scene.addSpinningTriangle());
  at(32140, () => { scene.addBlue(); scene.addYellow(); });

  at(33110, () => scene.addSpinningTriangle());

  // 1-beat pair
  at(33560, () => scene.addBlue());
  at(34010, () => { scene.addYellow(); scene.addSpinningTriangle(); });

  // Half-beat burst (0.23s apart) → maximum chaos
  at(34240, () => { scene.addBlue(); scene.addSpinningTriangle(); });
  at(34480, () => { scene.addSpinningTriangle(); scene.addBlue(); });

  // Final drop peak — everything at once
  at(35430, () => { scene.addBlue(); scene.addYellow(); scene.addSpinningTriangle(); });

  // ── OUTRO: Wind down (35 – 49s) ──────────────────────────────────────────
  at(36370, () => scene.addSpinningTriangle());
  at(37310, () => scene.addBlue());
  at(38250, () => scene.addSpinningTriangle());
  at(39180, () => { scene.addBlue(); scene.addTriangle(); });

  // 1-beat pair
  at(41060, () => scene.addSpinningTriangle());
  at(41540, () => scene.addBlue());

  // Big gaps — isolated, dramatic final hits
  at(44350, () => { scene.addSpinningTriangle(); scene.addYellow(); });
  at(47140, () => scene.addBlue());
  at(48090, () => scene.addSpinningTriangle());
  at(49030, () => scene.addBlue());

  // ── Loop ─────────────────────────────────────────────────────────────────
  scene.time.addEvent({ delay: 49500, callback: () => scene.loopGame() });
}
