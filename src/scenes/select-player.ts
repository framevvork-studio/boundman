import Phaser from 'phaser';

import { IPlayer } from '../interfaces';

class SelectPlayer extends Phaser.Scene {
  players: IPlayer[];

  constructor() {
    super('select-player');

    this.players = [
      { id: 'boundMan', displayName: 'BOUND MAN', initialPositionX: 200, link: './../assets/players/bound-man.png', particle: 'blue', scale: 0.5, speed: 800 },
      {
        id: 'boundGirl',
        displayName: 'BOUND GIRL',
        initialPositionX: 200,
        link: './../assets/players/bound-girl.png',
        particle: 'yellow',
        scale: 0.5,
        speed: 800,
      },
      { id: 'boundDog', displayName: 'BOUND DOG', initialPositionX: 180, link: './../assets/players/bound-dog.png', particle: 'red', scale: 0.3, speed: 900 },
      {
        id: 'boundBall',
        displayName: 'BOUND BALL',
        initialPositionX: 250,
        link: './../assets/players/bound-ball.png',
        particle: 'white',
        scale: 1,
        speed: 900,
      },
    ];
  }

  preload() {
    const particles = ['blue', 'red', 'white', 'yellow'];
    particles.forEach((particle) => {
      this.load.image(particle, `./../assets/particles/${particle}.png`);
    });
    this.players.forEach(({ id, link }) => this.load.image(id, link));
  }

  create() {
    const screenCenterX = this.cameras.main.centerX;
    const initialPositionY = 100;

    this.add.text(screenCenterX, initialPositionY, 'SELECT PLAYER', { font: '900 64px sans-serif' }).setOrigin(0.5);

    this.players.map(({ id, displayName }, index) => {
      const player = this.add
        .text(screenCenterX, initialPositionY + (index + 1) * 200, displayName, { font: '900 64px sans-serif' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => {
          player.setStyle({ fill: '#f2d422' });
        })
        .on('pointerout', () => {
          player.setStyle({ fill: '#ffffff' });
        })
        .on('pointerdown', () => {
          player.setStyle({ fill: '#f2d422' });
        })
        .on('pointerup', () => {
          this.scene.start('play', { player: this.players.find((player) => player.id === id) });
        });
    });
  }
}

export default SelectPlayer;