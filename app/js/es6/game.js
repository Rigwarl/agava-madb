import AgavaStage from './elements/agava_stage.js';
import Bg from './elements/background.js';
import Hat from './elements/hat.js';

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

    const bg = new Bg(queue);
    bg.addTo(stage);

    this.createAgavas();
    this.createHat();
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

      if (agavaX > this.hat.el.x - this.hat.bounds.width / 2 &&
          agavaX < this.hat.el.x + this.hat.bounds.width / 2) {
        this.hat.catch();
      }
    }
  },
};
