import { RequestHelper } from '../classes';

class ScoreBoard extends Phaser.Scene {
  requestHelper: RequestHelper;
  scores: any[];

  constructor() {
    super('score-board');

    this.requestHelper = new RequestHelper();
    this.scores = [];
  }

  async create() {
    const {
      response: { data },
    } = await this.requestHelper.getScores();
    this.scores = data;

    const screenCenterX = this.cameras.main.centerX;
    const initialPositionY = 100;

    const currentWeek = this.getCurrentWeek();
    this.add.text(screenCenterX, initialPositionY, `WEEK ${currentWeek} BOUND MAN`, { font: '900 64px sans-serif' }).setOrigin(0.5);

    this.add.text(screenCenterX - 150, initialPositionY + 50, 'Ranking');
    this.add.text(screenCenterX, initialPositionY + 50, 'Character');
    this.add.text(screenCenterX + 150, initialPositionY + 50, 'Player');
    this.add.text(screenCenterX + 300, initialPositionY + 50, 'Score');

    this.scores.map(({ character, playerName, score }, index) => {
      this.add.text(screenCenterX - 150, initialPositionY + 50 + (index + 1) * 50, `${index + 1}`);
      this.add.sprite(screenCenterX, initialPositionY + 50 + (index + 1) * 50, character).setScale(0.1);
      this.add.text(screenCenterX + 150, initialPositionY + 50 + (index + 1) * 50, playerName, {
        color: index + 1 <= 5 ? '#f2d422' : '#ffffff',
        font: '900 16px sans-serif',
      });
      this.add.text(screenCenterX + 300, initialPositionY + 50 + (index + 1) * 50, score);
    });

    this.input.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.start('play');
    });
  }

  getCurrentWeek() {
    const now = new Date();

    const startDate = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(now - startDate) / (24 * 60 * 60 * 1000);

    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
  }
}

export default ScoreBoard;
