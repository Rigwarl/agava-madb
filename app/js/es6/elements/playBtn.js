import Element from './element.js';

export default class extends Element {
  constructor(queue) {
    super();
    this.el = new createjs.Bitmap(queue.getResult('playBtn'));
    this.bounds = this.el.getBounds();
    this.el.cursor = 'pointer';

    this.el.hitArea = new createjs.Shape();
    this.el.hitArea.graphics.beginFill('#000')
      .drawRect(0, 0, this.bounds.width, this.bounds.height);

    this.set();
    this.addToResize();
    this.bindEvents();
  }
  set() {
    this.el.set({
      x: this.gb.ww / 2,
      y: this.gb.wh / 2,
      regY: this.bounds.height / 2,
      regX: this.bounds.width / 2,
    });
  }
  bindEvents() {
    this.el.addEventListener('mouseover', () => createjs.Tween.get(this.el)
      .to({
        scaleX: 1.2,
        scaleY: 1.2,
      }, 55));
    this.el.addEventListener('mouseout', () => createjs.Tween.get(this.el)
      .to({
        scaleX: 1,
        scaleY: 1,
      }, 55));
  }
}
