import Element from './element.js';

export default class extends Element {
  constructor(queue) {
    super();
    this.el = new createjs.Bitmap(queue.getResult('bg'));
    this.set();
    this.addToResize();
  }
  set() {
    this.el.set({
      scaleX: this.gb.scaleMax,
      scaleY: this.gb.scaleMax,
      y: this.gb.scaleX > this.gb.scaleY ? this.gb.ch * (this.gb.scaleY - this.gb.scaleX) : 0,
    });
  }
}
