import Element from './element.js';

export default class extends Element {
  constructor(config) {
    super();
    this.config = config;
    this.el = new createjs.Text(`Поймано 0/${this.config.toCatch}`, '35px Kremlin', '#303030');
    this.set();
    this.addToResize();
  }
  set() {
    this.el.set({
      x: 100,
      y: this.gb.wh - 100,
    });
  }
  setValue(value) {
    this.el.text = `Поймано ${value}/${this.config.toCatch}`;
  }
}
