import Phaser from 'phaser';

class Loading extends Phaser.Scene {
  constructor() {
    super('loading');
  }

  preload() {
    this.load.image('logo', './../assets/logo.png');
  }

  create() {
    const logo = this.add.image(975, 450, 'logo');

    this.tweens.add({
      targets: logo,
      y: 250,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}

export default Loading;
