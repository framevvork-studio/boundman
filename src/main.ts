import Phaser from 'phaser';

import { Loading } from './scenes';

new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: 'body',
    mode: Phaser.Scale.RESIZE,
  },
  backgroundColor: '#c5f5fd',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: process.env.NODE_ENV === 'development',
      gravity: {
        y: 1000,
      },
    },
  },
  scene: Loading,
});
