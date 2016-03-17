import Element from './element.js';

export default class extends Element {
  constructor(queue) {
    super();
    this.el = new createjs.Bitmap(queue.getResult('hat'));
    this.bounds = this.el.getBounds();
    this.set();
    this.addToResize();
  }
  set() {
    this.el.set({
      x: this.gb.ww / 2,
      y: this.gb.wh,
      regX: this.bounds.width / 2,
      regY: this.bounds.height,
      scaleX: this.gb.scaleMin,
      scaleY: this.gb.scaleMin,
    });
  }
  move(x) {
    this.el.x = x;
  }
  catch() {
    createjs.Tween.get(this.el, { override: true })
      .to({
        y: this.gb.wh + 35,
        scaleY: 0.93 * this.gb.scaleMin,
      }, 85)
      .to({
        y: this.gb.wh,
        scaleY: this.gb.scaleMin,
      }, 85);
  }
}
