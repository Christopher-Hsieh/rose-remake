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

const CX = GAME_WIDTH / 2;

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
    this.load.audio('rose', [ rose_song_ogg, rose_song_mp3 ]);
    this.load.audio('miku', [ miku_mp3 ]);
    this.load.audio('parago', [ parago ]);
  }

  create() {
    this.add.text(CX, 50, "◻ⵔ△", { color: '#5F616E', fontSize: "40px" });
    this.add.text(CX + 100, 70, "v1.3", { color: '#5F616E', fontSize: "14px" });
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2.5, 0x5F616E, 1);

    this.keys = this.input.keyboard.addKeys("R");

    this.add.text(CX - 100, 150, "~ Click or Tap to Continue ~", {
      color: '#BDBEC7', fontFamily: 'VerminVerile', fontSize: "28px",
    });

    // ── PWA install banner ────────────────────────────────────────────────────
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    const hasPwaPrompt = !!(window as any)._pwaPrompt;

    let bannerVisible = false;
    if (!isStandalone && (hasPwaPrompt || isIOS)) {
      bannerVisible = true;
      this.showInstallBanner(isIOS, () => { bannerVisible = false; });
    }

    // ── Tap-to-continue (ignored while banner is visible) ─────────────────────
    let started = false;
    this.input.on('pointerdown', function () {
      if (bannerVisible || started) return;
      started = true;
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

    // Setup and play menu song
    this.parago = this.sound.add("parago", {
      volume: 0.065,
    }) as Phaser.Sound.HTML5AudioSound;
    this.parago.play();
  }

  update(_time: number, _delta: number): void {
    if (this.keys.R.isDown) {
      this.parago.stop();
      this.scene.start(SCENES.LEVEL_SELECT);
    }
  }

  private showInstallBanner(isIOS: boolean, onDismiss: () => void) {
    const BY = GAME_HEIGHT - 35;   // banner center Y
    const objs: Phaser.GameObjects.GameObject[] = [];

    const dismiss = () => {
      objs.forEach(o => o.destroy());
      onDismiss();
    };

    // Background strip
    objs.push(
      this.add.rectangle(CX, BY, GAME_WIDTH, 70, 0x2a2b33, 0.96).setDepth(10),
      this.add.rectangle(CX, BY - 35, GAME_WIDTH, 1.5, 0x5f616e, 0.35).setDepth(10),
    );

    if (isIOS) {
      objs.push(
        this.add.text(CX, BY - 10, 'Best experience: Add to Home Screen', {
          color: '#BDBEC7', fontFamily: 'VerminVerile', fontSize: '15px',
        }).setOrigin(0.5).setDepth(11),
        this.add.text(CX, BY + 12, 'Tap  ↑  then "Add to Home Screen"', {
          color: '#e8677e', fontFamily: 'VerminVerile', fontSize: '13px',
        }).setOrigin(0.5).setDepth(11),
      );
    } else {
      objs.push(
        this.add.text(30, BY, 'Install for the best experience', {
          color: '#BDBEC7', fontFamily: 'VerminVerile', fontSize: '15px',
        }).setOrigin(0, 0.5).setDepth(11),
      );

      const btn = this.add
        .rectangle(GAME_WIDTH - 110, BY, 130, 40, 0xe8677e)
        .setDepth(11)
        .setInteractive({ useHandCursor: true });
      objs.push(
        btn,
        this.add.text(GAME_WIDTH - 110, BY, 'INSTALL', {
          color: '#1b1c22', fontFamily: 'VerminVerile', fontSize: '15px',
        }).setOrigin(0.5).setDepth(12),
      );

      btn.on('pointerover',  () => btn.setFillStyle(0xff8fa4));
      btn.on('pointerout',   () => btn.setFillStyle(0xe8677e));
      btn.on('pointerdown',  () => btn.setFillStyle(0xc0556a));
      btn.on('pointerup', () => {
        const pwaPrompt = (window as any)._pwaPrompt;
        if (pwaPrompt) {
          pwaPrompt.prompt();
          pwaPrompt.userChoice.then(() => dismiss());
        }
      });
    }

    // Dismiss ✕
    const x = this.add.text(GAME_WIDTH - 20, BY - 26, '✕', {
      color: '#5f616e', fontFamily: 'VerminVerile', fontSize: '16px',
    }).setOrigin(0.5).setDepth(12).setInteractive({ useHandCursor: true });
    objs.push(x);
    x.on('pointerup', () => dismiss());
  }

  loadFont(name: string, url: string) {
    const newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(loaded => {
      document.fonts.add(loaded);
    }).catch(err => err);
  }
}
