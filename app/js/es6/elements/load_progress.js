import Element from './element.js';

export default class extends Element {
  constructor() {
    super();
    this.el = new createjs.Text('Загрузка 0%', '45px Kremlin', '#000');
    this.set();
    this.addToResize();
  }
  set() {
    this.el.set({
      x: this.gb.ww / 2,
      y: this.gb.wh / 2,
      textAlign: 'center',
    });
  }
  change(e) {
    this.el.text = `Загрузка ${Math.floor(e.loaded * 100)}%`;
  }
}
