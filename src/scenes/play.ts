import Phaser from 'phaser';

import { Player } from '../classes';
import { IPlayer } from '../interfaces';

class Play extends Phaser.Scene {
  score: number;
  scoreText: Phaser.GameObjects.Text | undefined;

  height: number;
  width: number;

  selectedPlayer: IPlayer | null;
  player: Player | null;

  constructor() {
    super('play');

    this.score = 0;
    this.height = 0;
    this.width = 0;
    this.player = null;
    this.selectedPlayer = null;
  }

  preload() {
    this.height = this.sys.game.canvas.height;
    this.width = this.sys.game.canvas.width;
    this.scoreText = this.add.text(this.cameras.main.centerX, 144, '0', { font: '900 160px sans-serif' }).setOrigin(0.5);
    this.load.image('star', './../assets/star.png');
  }

  create() {
    if (this.selectedPlayer === null) return;

    const bottom = this.physics.add.staticGroup({ key: '' }).create(0, this.height, '').setScale(this.width, 0.001).refreshBody();

    this.add
      .text(50, 50, 'BACK', { font: '900 64px sans-serif' })
      .on('pointerup', () => {
        this.scene.start('select-player');
      })
      .setInteractive();

    this.player = new Player({
      scene: this,
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY * 2 - this.selectedPlayer.initialPositionX,
      particle: this.selectedPlayer.particle,
      player: this.selectedPlayer.id,
      scale: this.selectedPlayer.scale,
      speed: this.selectedPlayer.speed,
    });

    this.player.create();

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const initialPositionX = (Math.random() * this.width) / 2;
        const initialPositionY = Math.random() * 100;

        const repeat = (this.width - initialPositionX) / 300;
        const stepX = (this.width - initialPositionX) / repeat;
        const stars = this.physics.add.group({
          key: 'star',
          setXY: { x: initialPositionX, y: initialPositionY, stepX },
          collideWorldBounds: true,
          repeat,
          setScale: { x: 0.1, y: 0.1 },
        });

        stars.children.iterate((star: Phaser.GameObjects.GameObject) => {
          const gravityX = 50 - Math.random() * 150;
          const gravityY = Math.trunc(Math.random() * 1000) - 950;

          star.setGravity(gravityX, gravityY);

          this.physics.add.collider(star, bottom, () => {
            this.score += 1;
            this.scoreText.setText(`${this.score}`);
            star.destroy();
          });

          this.physics.add.overlap(star, this.player, () => {
            this.cameras.main.shake(1000);
            this.time.delayedCall(1000, () => {
              this.scene.pause();
              this.score = 0;
              this.scoreText.setText(`${this.score}`);
              this.scene.restart();
            });
          });
        });
      },
    });
  }

  update() {
    if (this.player === null) return;
    this.player.update();
  }

  init({ player }: { player: IPlayer }) {
    this.selectedPlayer = player;
  }
}

export default Play;
