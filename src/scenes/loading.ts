import Phaser from 'phaser';

class Loading extends Phaser.Scene {
  constructor() {
    super('loading');
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const title = this.add.text(centerX, 100, 'BOUNDMAN', { font: '900 160px sans-serif' }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: centerY,
      duration: 1500,
      ease: 'Power',
      yoyo: true,
      loop: -1,
    });

    this.input.on('pointerup', () => {
      this.scene.start('select-player');
    });
  }
}

export default Loading;
