import Element from './element.js';

export default class extends Element {
  constructor() {
    super();
    this.el = new createjs.Text('', '55px Kremlin', '#303030');
    this.set();
    this.addToResize();
  }
  set() {
    this.el.set({
      x: this.gb.ww / 2,
      y: this.gb.wh / 2,
      textAlign: 'center',
      textBaseline: 'middle',
    });
  }
  show(result) {
    const text = {
      win: 'Вы выиграли',
      loose: 'Время вышло',
    };
    this.el.text = text[result];

    createjs.Tween.get(this.el)
      .to({
        scaleX: 2,
        scaleY: 2,
      }, 650);
  }
}
