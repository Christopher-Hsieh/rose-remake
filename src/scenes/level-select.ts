import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, LEVELS, SCENES } from "../utils/constants";

const CX = GAME_WIDTH / 2;
const CY = GAME_HEIGHT / 2;

export class LevelSelect extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.LEVEL_SELECT });
  }

  create() {
    // Header
    this.add
      .text(CX, 38, "SELECT LEVEL", {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "22px",
      })
      .setOrigin(0.5)
      .setAlpha(0.6);

    this.createCard(
      CX - 185,
      CY + 10,
      "{Rose}",
      "BPM 181",
      () => this.startLevel(LEVELS.ROSE)
    );

    this.createCard(
      CX + 185,
      CY + 10,
      "Miku",
      "Anamanaguchi",
      () => this.startLevel(LEVELS.MIKU)
    );
  }

  private createCard(
    x: number,
    y: number,
    title: string,
    subtitle: string,
    onSelect: () => void
  ) {
    const cardW = 300;
    const cardH = 200;
    const baseColor = 0x2a2b33;
    const hoverColor = 0x3a3b45;
    const pressColor = 0xe8677e;

    const bg = this.add
      .rectangle(x, y, cardW, cardH, baseColor)
      .setInteractive({ useHandCursor: true });

    // Border
    const border = this.add.graphics();
    border.lineStyle(1.5, 0x5f616e, 0.6);
    border.strokeRect(x - cardW / 2, y - cardH / 2, cardW, cardH);

    this.add
      .text(x, y - 28, title, {
        color: "#ffffff",
        fontFamily: "VerminVerile",
        fontSize: "36px",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 22, subtitle, {
        color: "#BDBEC7",
        fontFamily: "VerminVerile",
        fontSize: "18px",
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    const tapHint = this.add
      .text(x, y + 62, "TAP TO PLAY", {
        color: "#e8677e",
        fontFamily: "VerminVerile",
        fontSize: "14px",
      })
      .setOrigin(0.5)
      .setAlpha(0.5);

    bg.on("pointerover", () => {
      bg.setFillStyle(hoverColor);
      tapHint.setAlpha(1);
    });
    bg.on("pointerout", () => {
      bg.setFillStyle(baseColor);
      tapHint.setAlpha(0.5);
    });
    bg.on("pointerdown", () => bg.setFillStyle(pressColor));
    bg.on("pointerup", () => onSelect());
  }

  private startLevel(level: string) {
    this.scene.start(SCENES.MAIN_SCENE, { level });
  }
}
