import { Input, Physics, Scene } from 'phaser';

class Player extends Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keyW: Input.Keyboard.Key;
  keyA: Input.Keyboard.Key;
  keyS: Input.Keyboard.Key;
  keyD: Input.Keyboard.Key;
  particle: string | null;
  scale: number;
  speed: number;
  height: number;
  isDownSpace: boolean;

  constructor({
    scene,
    x,
    y,
    particle,
    player,
    scale,
    speed,
  }: {
    scene: Scene;
    x: number;
    y: number;
    particle: string | null;
    player: string;
    scale: number;
    speed: number;
  }) {
    super(scene, x, y, player);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.particle = particle;
    this.scale = scale;
    this.speed = speed;
    this.height = this.scene.cameras.main.x;
    this.isDownSpace = false;
  }

  create() {
    this.scene.input.on('pointerdown', () => {
      this.handleTouch();
    });
    this.setScale(this.scale);
    this.setBounce(0.85, 1);
    this.setCollideWorldBounds(true);

    if (!this.particle) return;
    this.scene.add.particles(this.particle).createEmitter({
      speed: this.speed / 4,
      scale: { start: 0.1, end: 0.25 },
      blendMode: 'ADD',
      follow: this,
    });
  }

  update() {
    const isLeft = this.cursors.left.isDown || this.keyA.isDown;
    const isRight = this.cursors.right.isDown || this.keyD.isDown;
    const isBoost = this.cursors.shift.isDown;
    const isSpace = this.cursors.space.isDown;

    if (isLeft && !isBoost) return this.setVelocityX(-this.speed);
    if (isLeft && isBoost) return this.setVelocityX(-this.speed * 1.5);
    if (isRight && isBoost) return this.setVelocityX(this.speed * 1.5);
    if (isRight && !isBoost) return this.setVelocityX(this.speed);

    if (isSpace && !this.isDownSpace) {
      this.isDownSpace = true;
      return this.handleTouch();
    }

    if (this.cursors.space.isUp) {
      this.isDownSpace = false;
      return;
    }
  }

  handleTouch() {
    if (this.body.velocity.x <= 0) return this.setVelocityX(this.speed);
    if (this.body.velocity.x > 0) return this.setVelocityX(-this.speed);
  }
}

export default Player;
