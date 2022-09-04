import Phaser from 'phaser';

import { Loading, Play, SelectPlayer } from './scenes';

new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: 'body',
    mode: Phaser.Scale.RESIZE,
  },
  backgroundColor: '#009db0',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: process.env.NODE_ENV === 'development',
      gravity: {
        y: 1000,
      },
    },
  },
  scene: [Loading, Play, SelectPlayer],
});
