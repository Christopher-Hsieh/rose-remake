import { GAME_HEIGHT, GAME_WIDTH, Level, LEVELS, SCENES } from "../utils/constants";
import Phaser from "phaser";

const CX = GAME_WIDTH / 2;
const CY = GAME_HEIGHT / 2;

export class GameOver extends Phaser.Scene {
  keys: any;
  level: Level;

  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create(data: { score?: number; level?: Level }) {
    const score = data?.score ?? 0;
    this.level = data?.level ?? LEVELS.ROSE;

    // Dim overlay
    this.add
      .rectangle(CX, CY, GAME_WIDTH, GAME_HEIGHT, 0x1b1c22, 0.88)
      .setDepth(0);

    // Title
    this.add
      .text(CX, CY - 90, "GAME OVER", {
        color: "#ffffff",
        fontFamily: "VerminVerile",
        fontSize: "48px",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Score
    this.add
      .text(CX, CY - 35, `Score: ${score}`, {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "26px",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Try Again button
    const tryBtnY = CY + 30;
    const tryBtn = this.add
      .rectangle(CX, tryBtnY, 210, 50, 0xe8677e)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(CX, tryBtnY, "TRY AGAIN", {
        color: "#1b1c22",
        fontFamily: "VerminVerile",
        fontSize: "24px",
      })
      .setOrigin(0.5)
      .setDepth(2);

    tryBtn.on("pointerover", () => tryBtn.setFillStyle(0xff8fa4));
    tryBtn.on("pointerout", () => tryBtn.setFillStyle(0xe8677e));
    tryBtn.on("pointerdown", () => tryBtn.setFillStyle(0xc0556a));
    tryBtn.on("pointerup", () => this.retry());

    // Change Level button
    const changeBtnY = CY + 95;
    const changeBtn = this.add
      .rectangle(CX, changeBtnY, 210, 50, 0x2a2b33)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(CX, changeBtnY, "CHANGE LEVEL", {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "20px",
      })
      .setOrigin(0.5)
      .setDepth(2);

    changeBtn.on("pointerover", () => changeBtn.setFillStyle(0x3a3b45));
    changeBtn.on("pointerout", () => changeBtn.setFillStyle(0x2a2b33));
    changeBtn.on("pointerdown", () => changeBtn.setFillStyle(0x1b1c22));
    changeBtn.on("pointerup", () => this.goToLevelSelect());

    // Hint text
    this.add
      .text(CX, changeBtnY + 38, "or press  R", {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "14px",
      })
      .setOrigin(0.5)
      .setAlpha(0.4)
      .setDepth(1);

    this.keys = this.input.keyboard.addKeys("R");
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
      this.retry();
    }
  }

  private retry() {
    this.scene.stop(SCENES.GAME_OVER);
    this.scene.start(SCENES.MAIN_SCENE, { level: this.level });
  }

  private goToLevelSelect() {
    this.scene.stop(SCENES.GAME_OVER);
    this.scene.stop(SCENES.MAIN_SCENE);
    this.scene.start(SCENES.LEVEL_SELECT);
  }
}
