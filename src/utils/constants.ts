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
  TRIANGLE_GREEN:  'triangle-green',
  SQUARE_RED:      'square-red',
  SQUARE_BLUE:     'square-blue',
  SQUARE_MAGENTA:  'square-magenta',
  CIRCLE_ORANGE:   'circle-orange',
} as const;

export type ShapeKey = typeof SHAPES[keyof typeof SHAPES];

/** Maps each gameplay role to a texture key, per level. */
export const LEVEL_SHAPES: Record<Level, {
  triangle: ShapeKey;
  square:   ShapeKey;
  wall:     ShapeKey;
  fast:     ShapeKey;
}> = {
  [LEVELS.ROSE]: {
    triangle: SHAPES.TRIANGLE_GREEN,
    square:   SHAPES.SQUARE_RED,
    wall:     SHAPES.SQUARE_BLUE,
    fast:     SHAPES.SQUARE_MAGENTA,
  },
  [LEVELS.MIKU]: {
    triangle: SHAPES.TRIANGLE_GREEN,
    square:   SHAPES.SQUARE_BLUE,
    wall:     SHAPES.SQUARE_MAGENTA,
    fast:     SHAPES.SQUARE_RED,
  },
};