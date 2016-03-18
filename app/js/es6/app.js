import game from './game.js';
import bounds from './bounds.js';
import load from './load.js';
import Intro from './elements/intro.js';
import LoadProgress from './elements/load_progress.js';

const assets = {
  intro: [
    { id: 'intro1', src: 'img/intro_1.jpg' },
    { id: 'intro2', src: 'img/intro_2.jpg' },
  ],
  main: [
    { id: 'hat', src: 'img/sombrero.png' },
    { id: 'bg', src: 'img/background.png' },
    { id: 'light', src: 'img/light.png' },
    { id: 'agava', src: 'img/agava.png' },
    { id: 'playBtn', src: 'img/play_btn.png' },
  ],
  sound: [
    { id: 'catch', src: 'sound/catch.wav' },
    { id: 'win', src: 'sound/win.mp3' },
    { id: 'loose', src: 'sound/loose.mp3' },
    { id: 'click', src: 'sound/click.mp3' },
  ],
};

const app = {
  init() {
    this.stage = new createjs.Stage('game-stage');
    bounds.init(this.stage.canvas);

    this.progress = new LoadProgress();
    this.progress.addTo(this.stage);

    load(assets.intro, {
      progress: e => this.progress.change(e),
    }).then(introQueue => {
      Promise.all([
        load(assets.main).then(queue => game.init({ queue, stage: this.stage })),
        this.initIntro(introQueue),
      ]).then(() => {
        this.intro.hide();
        this.intro.removeFrom(this.stage);
        game.start();
        load(assets.sound, { type: 'sound' }).then(() => game.initSound());
      });
    });

    this.setTicker();
    this.setEvents();
  },
  initIntro(queue) {
    this.intro = new Intro(queue);
    this.intro.addTo(this.stage);
    this.progress.removeFrom(this.stage);
    return this.intro.play();
  },
  setTicker() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener('tick', () => {
      bounds.resize();
      this.stage.update();
    });
  },
  setEvents() {
    this.stage.enableMouseOver(20);
    createjs.Touch.enable(this.stage);
  },
};

app.init();
