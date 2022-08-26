import Phaser from 'phaser';

class Loading extends Phaser.Scene {
  cursors: any;
  player: any;
  stars: any;
  bottom: any;
  score: any;
  scoreText: any;
  delay: any;
  timer: any;
  speed: any;

  height: number;
  width: number;

  constructor() {
    super('loading');
    this.score = 0;
    this.delay = 10;
    this.height = 0;
    this.width = 0;
    this.speed = 800;
  }

  preload() {
    this.height = this.sys.game.canvas.height;
    this.width = this.sys.game.canvas.width;
    this.load.image('star', './../assets/star.png');
    this.load.image('player', './../assets/player.png');
  }

  create() {
    this.scoreText = this.add.text(16, 16, `SCORE : ${this.score}`, { fontSize: '32px', fill: '#000000' });
    this.bottom = this.physics.add.staticGroup({ key: '' });
    this.bottom.create(0, this.height, '').setScale(this.width, 0.001).refreshBody();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', () => {
      if (this.player.body.velocity.x === 0) {
        this.player.setVelocityX(this.speed);
      } else {
        this.player.setVelocityX(-this.player.body.velocity.x);
      }
    });
    this.player = this.physics.add.sprite(+this.width / 2, +this.height - 100, 'player');
    this.player.setBounce(0.7, 1);
    this.player.setCollideWorldBounds(true);
    const calculatedDelay = 100000 / this.width;
    console.log(calculatedDelay);
    this.timer = this.time.addEvent({
      delay: calculatedDelay,
      loop: true,
      callback: () => {
        const stars = this.physics.add.group({
          key: 'star',
          setXY: { x: Math.random() * this.sys.game.canvas.width, y: 0 },
          collideWorldBounds: true,
        });

        stars.children.iterate((star: any) => {
          const a = Math.random() < 0.5 ? -1 : 1;
          star.setGravity(a * 100);
          this.physics.add.collider(star, this.bottom, () => {
            this.score += 1;
            this.scoreText.setText(`SCORE : ${this.score}`);
            star.destroy();
          });

          this.physics.add.collider(star, this.player, () => {
            this.cameras.main.shake(1000);
            this.time.delayedCall(1000, () => {
              this.scene.pause();
              this.score = 0;
              this.scoreText.setText(`SCORE : ${this.score}`);
              this.scene.restart();
            });
          });
        });
      },
    });
  }

  update() {
    this.handleKeyboard();
  }

  handleKeyboard() {
    const speed = 800;
    if (this.cursors.left.isDown) {
      if (this.cursors.shift.isDown) {
        this.player.setVelocityX(-1.5 * speed);
      } else {
        this.player.setVelocityX(-1 * speed);
      }
    }

    if (this.cursors.right.isDown) {
      if (this.cursors.shift.isDown) {
        this.player.setVelocityX(1.5 * speed);
      } else {
        this.player.setVelocityX(speed);
      }
    }
  }
}

export default Loading;
