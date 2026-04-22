export const BPM = 181;
export const BPS = BPM / 60;
export const BPMS = 1000 / BPS;

export const MIKU_BPM = 128;
export const MIKU_BPS = MIKU_BPM / 60;
export const MIKU_BPMS = 1000 / MIKU_BPS;

// iPhone 13/14 landscape logical resolution — fixed aspect ratio (≈2.16:1)
// Phaser's FIT scale mode will scale this up/down to fill any viewport.
export const GAME_WIDTH = 844;
export const GAME_HEIGHT = 390;
export const SPAWN_ZONE = GAME_WIDTH + 100;

export const SCENES = {
    MAIN_SCENE: 'MainScene',
    GAME_OVER: 'GameOver',
    LEVEL_SELECT: 'LevelSelect',
    START: 'Start'
  } as const;

export const LEVELS = {
    ROSE: 'rose',
    MIKU: 'miku',
  } as const;

export type Level = typeof LEVELS[keyof typeof LEVELS];

export const SHAPES = {
    TRIANGLE: 'triangle',
    SQUARE: 'square',
    BLUE: 'blue',
    YELLOW: 'yellow',
    ORANGE: 'orange'
  } as const;