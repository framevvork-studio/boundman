import Phaser from 'phaser';

import { Player, RequestHelper } from '../classes';
import { IPlayer } from '../interfaces';

class Play extends Phaser.Scene {
  score: number;
  scoreText: Phaser.GameObjects.Text | undefined;

  height: number;
  width: number;

  selectedPlayer: IPlayer | null;
  player: Player | null;
  isGameOver: boolean;
  requestHelper: RequestHelper;
  startTime: string | null;
  endTime: string | null;
  stars: Phaser.Physics.Arcade.Group | null;
  timerToCreateStars: Phaser.Time.TimerEvent | null;
  bottom: Phaser.Physics.Arcade.StaticGroup | null;

  constructor() {
    super('play');

    this.score = 0;
    this.height = 0;
    this.width = 0;
    this.player = null;
    this.selectedPlayer = null;
    this.isGameOver = false;
    this.requestHelper = new RequestHelper();
    this.startTime = null;
    this.endTime = null;
    this.stars = null;
    this.timerToCreateStars = null;
    this.bottom = null;
  }

  preload() {
    this.height = this.sys.game.canvas.height;
    this.width = this.sys.game.canvas.width;
    this.scoreText = this.add.text(this.cameras.main.centerX, 144, '0', { font: '900 160px sans-serif' }).setOrigin(0.5);
    this.load.image('star', './../assets/star.png');
  }

  create() {
    this.bottom = this.physics.add.staticGroup({ key: '' }).create(0, this.height, '').setScale(this.width, 0.001).refreshBody();

    this.add
      .text(50, 50, 'BACK', { font: '900 64px sans-serif' })
      .on('pointerup', () => {
        this.scene.start('select-player');
      })
      .setInteractive();

    this.player = new Player({
      scene: this,
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY * 2 - this.selectedPlayer?.initialPositionX,
      particle: this.selectedPlayer?.particle,
      player: this.selectedPlayer?.id,
      scale: this.selectedPlayer?.scale,
      speed: this.selectedPlayer?.speed,
    });

    this.player.create();

    this.timerToCreateStars = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.createStars();
      },
    });

    this.handleGameOver();
    this.startTime = new Date().toISOString();
  }

  update() {
    this.player?.update();
  }

  init({ player }: { player: IPlayer }) {
    this.selectedPlayer = player;
  }

  createStars() {
    const initialPositionX = (Math.random() * this.width) / 2;
    const initialPositionY = Math.random() * 100;

    const repeat = Math.trunc((this.width - initialPositionX) / 300);
    const stepX = (this.width - initialPositionX) / repeat;

    this.stars = this.physics.add.group({
      key: 'star',
      setXY: { x: initialPositionX, y: initialPositionY, stepX },
      collideWorldBounds: true,
      repeat,
      setScale: { x: 0.1, y: 0.1 },
    });

    this.stars.children.iterate((star: Phaser.GameObjects.GameObject) => {
      const gravityX = 50 - Math.random() * 150;
      const gravityY = Math.trunc(Math.random() * 1000) - 950;

      star.setGravity(gravityX, gravityY);

      this.physics.add.collider(this.bottom, star, () => {
        this.score += 1;
        this.scoreText?.setText(`${this.score}`);
        star.destroy();
      });

      this.physics.add.overlap(this.player, star, () => {
        this.overlapPlayerAndStar();
      });
    });
  }

  handleGameOver() {
    this.input.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.isGameOver) return;
      this.score = 0;
      this.scoreText?.setText(`${this.score}`);
      this.endTime = null;
      this.isGameOver = false;
      this.scene.restart();
    });
  }

  async overlapPlayerAndStar() {
    this.timerToCreateStars?.remove();
    this.cameras.main.shake(1000);
    this.physics.pause();

    this.endTime = new Date().toISOString();

    await this.requestHelper.createScore({
      score: this.score,
      character: this.selectedPlayer?.id,
      playerName: 'beom',
      startTime: this.startTime,
      endTime: this.endTime,
    });

    setTimeout(() => {
      this.isGameOver = true;
    }, 2000);
  }
}

export default Play;
