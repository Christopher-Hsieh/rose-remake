import Phaser from "phaser";
import {
  BPMS,
  GAME_HEIGHT,
  GAME_WIDTH,
  LEVELS,
  Level,
  SCENES,
  SHAPES,
  SPAWN_ZONE,
} from "../utils/constants";
import { handleTouchControl, setupMouseControl } from "../utils/input";
import { setupRoseSequence } from "../levels/rose";
import { setupMikuSequence } from "../levels/miku";

export class MainScene extends Phaser.Scene {
  keys: any;
  wasd_debug_text: Phaser.GameObjects.Text;
  hit_debug_text: Phaser.GameObjects.Text;
  score_text: Phaser.GameObjects.Text;
  score: number;
  level: Level;
  player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  canvas: HTMLCanvasElement;
  shapes: Phaser.Physics.Arcade.Group;
  song: Phaser.Sound.HTML5AudioSound;
  triangles_group: Phaser.GameObjects.Group;
  squares_group: Phaser.GameObjects.Group;
  blue_group: Phaser.GameObjects.Group;
  yel_group: Phaser.GameObjects.Group;
  hsv: Phaser.Types.Display.ColorObject[];
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  parent;
  sizer;

  constructor(score: number) {
    super(SCENES.MAIN_SCENE);
    this.score = score || 0;
  }

  create(data: { level?: Level; score?: number }) {
    this.level = data?.level ?? LEVELS.ROSE;
    this.score = data?.score ?? this.score ?? 0;

    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    this.parent = new Phaser.Structs.Size(width, height);
    this.sizer = new Phaser.Structs.Size(GAME_WIDTH, GAME_HEIGHT, Phaser.Structs.Size.FIT, this.parent);
    this.parent.setSize(width, height);
    this.sizer.setSize(width, height);

    // Setup scoreboard
    this.score_text = this.add
      .text(GAME_WIDTH-200, 20, "Score: " + this.score.toString(), {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "22px",
      })
      .setAlpha(0.7);
    this.hit_debug_text = this.add
      .text(280, 120, " ", {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "32px",
      })
      .setAlpha(0.9);

    // Setup Player
    this.player = this.physics.add
      .image(400, 300, "player")
      .setScale(0.4)
      .setCircle(38);
    this.player.setCollideWorldBounds(true);

    this.emitter = this.add.particles(0, 0, "player", {
      lifespan: 100,
      alpha: { start: 0.5, end: 0 },
      scale: 0.39,
      //@ts-ignore
      deathZone: new Phaser.Geom.Rectangle(0, 0, 1, 1),
    });

    // Setup fun color change on click
    this.hsv = Phaser.Display.Color.HSVColorWheel();
    this.input.on(
      "pointerdown",
      function () {
        const randomTint =
          this.hsv[Phaser.Math.Between(0, this.hsv.length)].color;
        this.player.setTint(randomTint);
        this.emitter.setParticleTint(randomTint);
      },
      this
    );

    // Setup Input
    this.keys = this.input.keyboard.addKeys("W,A,S,D");
    setupMouseControl(this.input, this.player);

    // Setup physics groups
    this.triangles_group = this.physics.add.group({
      defaultKey: SHAPES.TRIANGLE,
      createCallback: function (triangle: Phaser.Physics.Arcade.Sprite) {
        triangle.setScale(0.4).setSize(50, 50);
        triangle.setVelocityX(-220);
      },
    });

    this.squares_group = this.physics.add.group({
      defaultKey: SHAPES.SQUARE,
      createCallback: function (square: Phaser.Physics.Arcade.Sprite) {
        square.setScale(0.4).setSize(60, 60);
        square.setAngle(Phaser.Math.Between(-26, 26));
        square.setVelocity(Phaser.Math.Between(-475, -220), 0);
      },
    });

    this.blue_group = this.physics.add.group({
      defaultKey: SHAPES.BLUE,
      createCallback: function (square: Phaser.Physics.Arcade.Sprite) {
        square.setScale(0.4).setSize(60, 60);
        square.setAngle(Phaser.Math.Between(-26, 26));
        square.setVelocity(Phaser.Math.Between(-400, -200), 0);
      },
    });

    this.yel_group = this.physics.add.group({
      defaultKey: SHAPES.YELLOW,
      createCallback: function (square: Phaser.Physics.Arcade.Sprite) {
        square.setScale(0.4).setSize(60, 60);
        square.setAngle(Phaser.Math.Between(-10, 10));
        square.setVelocity(Phaser.Math.Between(-800, -450), 0);
      },
    });

    // Spawn sequence based on selected level
    if (this.level === LEVELS.MIKU) {
      setupMikuSequence(this);
    } else {
      setupRoseSequence(this);
    }

    // Setup Colliders
    this.setupColliders([
      this.triangles_group,
      this.squares_group,
      this.blue_group,
      this.yel_group,
    ]);

    // Setup and play level song
    this.song = this.sound.add(this.level, {
      volume: 0.14,
    }) as Phaser.Sound.HTML5AudioSound;
    this.song.play();
  }

  // ─── Game lifecycle ─────────────────────────────────────────────────────────

  loopGame() {
    this.song.stop();
    this.scene.restart({ score: this.score, level: this.level });
  }

  update(time: number, delta: number): void {
    this.incrementScoreAndKill(100, this.triangles_group);
    this.incrementScoreAndKill(50, this.squares_group);
    this.incrementScoreAndDestroy(250, this.blue_group.getChildren());
    this.incrementScoreAndDestroy(275, this.yel_group.getChildren());

    this.emitter.emitParticleAt(this.player.x, this.player.y, 1);

    if (this.input.pointer1.isDown) {
      handleTouchControl(this.input, this.player);
    }

    this.player.setVelocity(0);
    if (this.keys.A.isDown) {
      this.player.setVelocityX(-260);
    } else if (this.keys.D.isDown) {
      this.player.setVelocityX(260);
    }

    if (this.keys.W.isDown) {
      this.player.setVelocityY(-260);
    } else if (this.keys.S.isDown) {
      this.player.setVelocityY(260);
    }
  }

  // ─── Scoring ────────────────────────────────────────────────────────────────

  incrementScoreAndKill(num: number, group: Phaser.GameObjects.Group) {
    for (const child of group.getChildren()) {
      //@ts-ignore
      if (child.x < -50 && child.active) {
        group.kill(child);
        this.incrementScore(num);
      }
    }
  }

  incrementScoreAndDestroy(num: number, group: Phaser.GameObjects.GameObject[]) {
    for (const child of group) {
      //@ts-ignore
      if (child.x < -50 && child.active) {
        child.destroy();
        this.incrementScore(num);
      }
    }
  }

  incrementScore(num: number) {
    this.score = this.score + num;
    this.score_text.setText("Score: " + this.score.toString());
  }

  activateObj(obj: any) {
    obj.setActive(true).setVisible(true);
  }

  // ─── Spawn helpers ──────────────────────────────────────────────────────────

  addPulseTween(repeat_count: number, bpms: number = BPMS) {
    const targets = [
      () => this.squares_group.getChildren(),
      () => this.blue_group.getChildren(),
      () => this.yel_group.getChildren(),
    ];
    for (const getTargets of targets) {
      this.time.addEvent({
        delay: bpms, repeat: repeat_count,
        callback: () => {
          this.tweens.add({
            targets: getTargets(),
            props: { scaleX: 0.475, scaleY: 0.475 },
            ease: "Sine.easeInOut", duration: 40, yoyo: true,
          });
        },
      });
    }
  }

  addTriangleJump() {
    const children = this.triangles_group.getChildren();
    this.tweens.add({
      targets: children,
      props: {
        x: {
          getEnd: function (target) { return target.x - 180; },
          getStart: function (target) { return target.x; },
          ease: "Sine.easeInOut",
        },
        angle: {
          getEnd: function (target) { return target.angle - 120; },
          getStart: function (target) { return target.angle; },
        },
      },
      duration: 300,
    });
  }

  addTriangle() {
    const triangle = this.triangles_group.get(
      SPAWN_ZONE,
      Phaser.Math.Between(GAME_HEIGHT / 10, (GAME_HEIGHT * 9) / 10)
    );
    if (!triangle) return;
    this.activateObj(triangle);
  }

  addSpinningTriangle() {
    const triangle = this.triangles_group.get(
      SPAWN_ZONE,
      Phaser.Math.Between(GAME_HEIGHT / 10, (GAME_HEIGHT * 9) / 10)
    );
    if (!triangle) return;
    this.activateObj(triangle);
    triangle.setVelocityX(-600);
    this.tweens.add({
      targets: triangle,
      props: {
        angle: {
          getEnd: function (target) { return target.angle - 1440; },
          getStart: function (target) { return target.angle; },
        },
      },
      duration: 2500,
    });
  }

  addSquare() {
    const square = this.squares_group.get(
      SPAWN_ZONE,
      Phaser.Math.Between(0, GAME_HEIGHT)
    );
    if (!square) return;
    this.activateObj(square);
  }

  addYellow() {
    const square = this.yel_group.get(
      SPAWN_ZONE,
      Phaser.Math.Between(20, (GAME_HEIGHT * 14) / 15)
    );
    if (!square) return;
    this.activateObj(square);
    this.tweens.add({
      targets: square,
      ease: "Power2.easeIn",
      props: {
        y: Phaser.Math.Between(20, (GAME_HEIGHT * 14) / 15),
        x: -150,
      },
      duration: Phaser.Math.Between(1400, 2250),
    });
  }

  addBlue() {
    const square_1 = this.blue_group.get(SPAWN_ZONE, Phaser.Math.Between(0, GAME_HEIGHT / 4));
    const square_2 = this.blue_group.get(SPAWN_ZONE, Phaser.Math.Between(GAME_HEIGHT / 4, GAME_HEIGHT / 2));
    const square_3 = this.blue_group.get(SPAWN_ZONE, Phaser.Math.Between(GAME_HEIGHT / 2, (GAME_HEIGHT * 3) / 4));
    const square_4 = this.blue_group.get(SPAWN_ZONE, Phaser.Math.Between((GAME_HEIGHT * 3) / 4, GAME_HEIGHT));
    if (!square_1 || !square_2 || !square_3 || !square_4) return;
    this.activateObj(square_1);
    this.activateObj(square_2);
    this.activateObj(square_3);
    this.activateObj(square_4);
    this.tweens.add({
      targets: [square_1, square_2, square_3, square_4],
      props: {
        x: { value: -100, duration: 2500, ease: "Quad.easeIn" },
        y: {
          getEnd: function (target) { return target.y + Phaser.Math.Between(-300, 300); },
          getStart: function (target) { return target.y; },
          duration: 2500,
          ease: "Quad.easeIn",
        },
      },
    });
  }

  hitShape() {
    this.song.stop();
    this.physics.pause();
    this.scene.pause();
    this.input.mouse.releasePointerLock();
    this.scene.launch(SCENES.GAME_OVER, { score: this.score, level: this.level });
    this.score = 0;
  }

  setupColliders(groups: Phaser.GameObjects.Group[]) {
    for (var i = 0; i < groups.length; i++) {
      this.physics.add.collider(this.player, groups[i], this.hitShape, null, this);
    }
  }
}
