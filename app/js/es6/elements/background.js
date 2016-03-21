import Element from './element.js';

export default class extends Element {
  constructor(queue) {
    super();
    this.el = new createjs.Container();
    this.el.addChild(
      new createjs.Bitmap(queue.getResult('bg')),
      new createjs.Bitmap(queue.getResult('light'))
    );
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
