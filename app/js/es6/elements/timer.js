import Element from './element.js';

export default class extends Element {
  constructor() {
    super();
    this.el = new createjs.Text('', '35px Kremlin', '#303030');
    this.set();
    this.addToResize();
  }
  set() {
    this.el.set({
      x: this.gb.ww / 2,
      y: 75,
      textAlign: 'center',
    });
  }
  toStr(time) {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    if (min < 10) min = `0${min}`;
    if (sec < 10) sec = `0${sec}`;

    return `Время: ${min}:${sec}`;
  }
  setValue(time) {
    this.el.text = this.toStr(time);
  }
}
