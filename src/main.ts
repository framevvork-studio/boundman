import Phaser from 'phaser';

import { Loading } from './scenes';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1950,
  height: 900,
  backgroundColor: '#c5f5fd',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: Loading,
});
