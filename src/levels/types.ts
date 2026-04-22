/**
 * The subset of MainScene that level sequence files need.
 * Keeping this interface separate avoids circular imports between
 * main-scene.ts and the individual level files.
 */
export interface SpawnScene {
  time: Phaser.Time.Clock;
  addTriangle(): void;
  addTriangleJump(): void;
  addSquare(): void;
  addBlue(): void;
  addYellow(): void;
  addSpinningTriangle(): void;
  addPulseTween(repeat_count: number, bpms?: number): void;
  loopGame(): void;
}
