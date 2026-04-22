import { GAME_HEIGHT, GAME_WIDTH, SCENES } from "../utils/constants";
import Phaser from "phaser";

const CX = GAME_WIDTH / 2;
const CY = GAME_HEIGHT / 2;

export class GameOver extends Phaser.Scene {
  keys: any;

  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create(data: { score?: number }) {
    const score = data?.score ?? 0;

    // Dim overlay
    this.add
      .rectangle(CX, CY, GAME_WIDTH, GAME_HEIGHT, 0x1b1c22, 0.88)
      .setDepth(0);

    // Title
    this.add
      .text(CX, CY - 85, "GAME OVER", {
        color: "#ffffff",
        fontFamily: "VerminVerile",
        fontSize: "48px",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Score
    this.add
      .text(CX, CY - 28, `Score: ${score}`, {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "26px",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Button
    const btnW = 210;
    const btnH = 52;
    const btnY = CY + 50;

    const btnBg = this.add
      .rectangle(CX, btnY, btnW, btnH, 0xe8677e)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(CX, btnY, "TRY AGAIN", {
        color: "#1b1c22",
        fontFamily: "VerminVerile",
        fontSize: "24px",
      })
      .setOrigin(0.5)
      .setDepth(2);

    // Hint text
    this.add
      .text(CX, btnY + 40, "or press  R", {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "14px",
        alpha: 0.6,
      })
      .setOrigin(0.5)
      .setAlpha(0.5)
      .setDepth(1);

    btnBg.on("pointerover", () => btnBg.setFillStyle(0xff8fa4));
    btnBg.on("pointerout", () => btnBg.setFillStyle(0xe8677e));
    btnBg.on("pointerdown", () => btnBg.setFillStyle(0xc0556a));
    btnBg.on("pointerup", () => this.restart());

    this.keys = this.input.keyboard.addKeys("R");
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
      this.restart();
    }
  }

  private restart() {
    this.scene.stop(SCENES.GAME_OVER);
    this.scene.start(SCENES.MAIN_SCENE);
  }
}
