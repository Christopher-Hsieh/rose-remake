import Phaser from "phaser";
import circle_white from '../assets/circle-white.png';
import square_red from '../assets/square-red.png';
import square_blue from '../assets/square-blue.png';
import square_magenta from '../assets/square-magenta.png';
import triangle_green from '../assets/triangle-green.png';
import circle_orange from '../assets/circle-orange.png';
import rose_song_mp3 from '../assets/rose.mp3';
import parago from '../assets/parago.mp3';
import rose_song_ogg from '../assets/rose.ogg';
import miku_mp3 from '../assets/Miku.mp3';
import virtual_rave from '../assets/fonts/VirtualRave.ttf';
import vermin_verile from '../assets/fonts/VerminVerile.ttf';
import glitch from '../assets/fonts/glitch.ttf';
import { GAME_HEIGHT, GAME_WIDTH, SCENES } from "../utils/constants";

export class Preloader extends Phaser.Scene {
  keys: any;
  parago: Phaser.Sound.HTML5AudioSound;
  graphics: Phaser.GameObjects.Graphics;
  
    preload() {
        this.loadFont("VirtualRave", virtual_rave);
        this.loadFont("VerminVerile", vermin_verile);
        this.loadFont("glitch", glitch);
        this.load.image('player',          circle_white);
        this.load.image('triangle-green',  triangle_green);
        this.load.image('square-red',      square_red);
        this.load.image('square-blue',     square_blue);
        this.load.image('square-magenta',  square_magenta);
        this.load.image('circle-orange',   circle_orange);
        this.load.audio('rose', [ rose_song_ogg, rose_song_mp3]);
        this.load.audio('miku', [ miku_mp3 ]);
        this.load.audio('parago', [ parago ]);
      }

      create() {
        
        this.add.text((GAME_WIDTH/2),GAME_HEIGHT-(GAME_HEIGHT-50),"◻ⵔ△", { color: '#5F616E', fontSize: "40px" });
        this.add.text((GAME_WIDTH/2)+100,GAME_HEIGHT-(GAME_HEIGHT-70),"v1.3", { color: '#5F616E', fontSize: "14px" });
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2.5, 0x5F616E, 1);

        this.keys = this.input.keyboard.addKeys("R");

        this.add.text((GAME_WIDTH/2)-100, GAME_HEIGHT-(GAME_HEIGHT-150), "~ Click or Tap to Continue ~", { color: '#BDBEC7', fontFamily: 'VerminVerile', fontSize: "28px" });
            
        this.input.once('pointerdown', function () {
          // On mobile, grab fullscreen on the same gesture that starts the game
          if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            const el = document.documentElement as any;
            if (el.requestFullscreen) {
              el.requestFullscreen().catch(() => {});
            } else if (el.webkitRequestFullscreen) {
              el.webkitRequestFullscreen();
            }
          }
          this.parago.stop();
          this.scene.start(SCENES.LEVEL_SELECT);
        }, this);

        // Setup and Play song
        this.parago = this.sound.add("parago", {
          volume: 0.065,
        }) as Phaser.Sound.HTML5AudioSound;
        this.parago.play();
      }

      update(time: number, delta: number): void {
        if (this.keys.R.isDown) {
          this.parago.stop();
          this.scene.start(SCENES.LEVEL_SELECT);
        }
    }

    loadFont(name, url) {
      var newFont = new FontFace(name, `url(${url})`);
      newFont.load().then(function (loaded) {
          document.fonts.add(loaded);
      }).catch(function (error) {
          return error;
      });
  }
}
