import AgavaStage from './elements/agava_stage.js';
import PlayBtn from './elements/playBtn.js';
import EndText from './elements/endText.js';
import Timer from './elements/timer.js';
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
    this.stage = stage;
    this.queue = queue;

    this.bg = new Bg(this.queue);
    this.score = new Score(config);
    this.endText = new EndText();
    this.timer = new Timer();

    this.createAgavas();
    this.createHat();
    this.createPlayBtn();

    this.stage.addChild(this.bg.el, this.playBtn.el);
  },
  initSound() {
    this.soundReady = true;
  },
  playSound(sound) {
    if (this.soundReady) createjs.Sound.play(sound);
  },
  start() {
    this.playing = true;
    this.stage.cursor = 'none';
    this.scoreVal = 0;
    this.time = config.time;
    this.timer.setValue(this.time);

    this.initTimer();
    this.agavaStage.agavas.forEach(agava => agava.set());

    this.playBtn.removeFrom(this.stage);
    this.stage.addChild(this.agavaStage.el, this.hat.el, this.timer.el, this.score.el);
  },
  createPlayBtn() {
    this.playBtn = new PlayBtn(this.queue);
    this.playBtn.el.addEventListener('click', () => {
      this.playSound('click');
      this.start();
    });
  },
  createHat() {
    this.hat = new Hat(this.queue);
    this.stage.addEventListener('stagemousemove', e => this.hat.move(e.stageX));
  },
  initTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.time) this.end('loose');
      this.timer.setValue(--this.time);
    }, 1000);
  },
  createAgavas() {
    this.agavaStage = new AgavaStage(this.queue, config);
    this.agavaStage.agavas.forEach(agava => {
      agava.el.addEventListener('change', () => this.catchCheck(agava));
    });
  },
  catchCheck(agava) {
    if (agava.el.currentFrame === 32 && this.playing) {
      const agavaX = this.agavaStage.el.localToGlobal(agava.el.x, 0).x;

      if (agavaX > this.hat.el.x - this.hat.realWidth / 2 &&
          agavaX < this.hat.el.x + this.hat.realWidth / 2) {
        this.hat.catch();
        this.playSound('catch');
        agava.set();
        this.addScore();
      }
    }
  },
  addScore() {
    this.score.setValue(++this.scoreVal);
    if (this.scoreVal === config.toCatch) this.end('win');
  },
  end(result) {
    this.playing = false;

    clearInterval(this.timerInterval);
    this.stage.removeChild(this.timer.el);

    this.playSound(result);
    this.endText.addTo(this.stage);
    this.endText.show(result);

    this.hat.hide(result).then(() => {
      this.stage.removeChild(this.agavaStage.el, this.score.el, this.hat.el, this.endText.el);
      this.stage.addChild(this.playBtn.el);
      this.stage.cursor = null;
      this.hat.set();
    });
  },
};
