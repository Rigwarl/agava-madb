import game from './game.js';
import bounds from './bounds.js';
import load from './load.js';
import LoadProgress from './elements/load_progress.js';

const app = {
  init() {
    this.stage = new createjs.Stage('game-stage');
    bounds.init(this.stage.canvas);

    const progress = new LoadProgress();
    progress.addTo(this.stage);

    load([
      { id: 'intro1', src: 'img/intro_1.jpg' },
      { id: 'intro2', src: 'img/intro_2.jpg' },
      { id: 'hat', src: 'img/sombrero.png' },
      { id: 'bg', src: 'img/background.png' },
      { id: 'light', src: 'img/light.png' },
      { id: 'agava', src: 'img/agava.png' },
      { id: 'playBtn', src: 'img/play_btn.png' },
    ], {
      progress: progress.change.bind(progress), // удалится ли прогресс?
    }).then(queue => {
      progress.remove();
      game.init({ queue, stage: this.stage });
    });

    this.setTicker();
  },
  setTicker() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener('tick', () => {
      bounds.resize();
      this.stage.update();
    });
  },
};

app.init();

  // ss: {
  //   sound: [
  //     { id: 'catch', src: 'sound/catch.wav' },
  //     { id: 'win', src: 'sound/win.mp3' },
  //     { id: 'loose', src: 'sound/loose.mp3' },
  //     { id: 'click', src: 'sound/click.mp3' },
  //   ],
  // },
