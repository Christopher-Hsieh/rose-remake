import { SCENES } from "../utils/constants";
import Phaser from "phaser";

export class GameOver extends Phaser.Scene {
  keys: any;
  parago: Phaser.Sound.HTML5AudioSound;
  graphics;
  constructor() {
    super({key: SCENES.GAME_OVER});
  }
  create() {
    this.keys = this.input.keyboard.addKeys("R");
    this.scene.setVisible(false, SCENES.GAME_OVER);
    // Setup and Play song
    // this.parago = this.sound.add("parago", {
    //   volume: 0.01,
    // }) as Phaser.Sound.HTML5AudioSound;
    // this.parago.play();

    // this.input.once(
    //   "pointerdown",
    //   function () {
    //     this.scene.start(SCENES.MAIN_SCENE);
    //     this.parago.stop();
    //   },
    // );
  }
  

  update(time: number, delta: number): void {
    if (this.keys.R.isDown) {
      this.scene.start(SCENES.MAIN_SCENE);
      // this.parago.stop();
    }
    if (this.input.pointer1.active) {
      this.scene.start(SCENES.MAIN_SCENE);
      // this.parago.stop();
    }
  }
}
