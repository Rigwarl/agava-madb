import AgavaStage from './elements/agava_stage.js';
import Score from './elements/score.js';
import Hat from './elements/hat.js';
import Bg from './elements/background.js';

const config = {
  toCatch: 40,
  time: 20,
  agavaNum: 7,
  agavaDelay: 850,
};

export default {
  init({ queue, stage }) {
    this.queue = queue;
    this.stage = stage;
    this.stage.cursor = 'none';

    this.createBg();
    this.createAgavas();
    this.createHat();
    this.createScore();

    this.scoreVal = 0;
  },
  createBg() {
    this.bg = new Bg(this.queue);
    this.bg.addTo(this.stage);
  },
  createScore() {
    this.score = new Score(config);
    this.score.addTo(this.stage);
  },
  createHat() {
    this.hat = new Hat(this.queue);
    this.hat.addTo(this.stage);
    this.stage.addEventListener('stagemousemove', e => this.hat.move(e.stageX));
  },
  createAgavas() {
    this.agavaStage = new AgavaStage(this.queue, config);
    this.agavaStage.addTo(this.stage);
    this.agavaStage.agavas.forEach(agava => {
      agava.el.addEventListener('change', () => this.catchCheck(agava));
    });
  },
  catchCheck(agava) {
    if (agava.el.currentFrame === 32) {
      const agavaX = this.agavaStage.el.localToGlobal(agava.el.x, 0).x;
      console.log(this.hat.bounds.width);

      if (agavaX > this.hat.el.x - this.hat.realWidth / 2 &&
          agavaX < this.hat.el.x + this.hat.realWidth / 2) {
        this.hat.catch();
        agava.set();
        this.addScore();
      }
    }
  },
  addScore() {
    this.score.setValue(this.scoreVal++);
    if (this.scoreVal > config.toCatch) this.win();
  },
  win() {

  },
  loose() {

  },
};
