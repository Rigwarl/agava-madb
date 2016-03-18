import Element from './element.js';

export default class extends Element {
  constructor(queue) {
    super();
    this.queue = queue;
    this.el = new createjs.Bitmap(this.queue.getResult('intro1'));
    this.el.alpha = 0;
    this.bounds = this.el.getBounds();
    this.set();
    this.addToResize();
  }
  play() {
    return new Promise(resolve => {
      createjs.Tween.get(this.el)
        .to({
          alpha: 1,
        }, 500)
        .wait(5000)
        .to({
          alpha: 0,
          image: this.queue.getResult('intro2'),
        }, 500)
        .to({
          alpha: 1,
        }, 500)
        .wait(4000)
        .call(resolve);
    });
  }
  hide() {
    createjs.Tween.get(this.el)
      .to({ alpha: 0 }, 500);
  }
  set() {
    const scaleX = this.gb.ww / this.bounds.width;
    const scaleY = this.gb.wh / this.bounds.height;
    const minScale = scaleX < scaleY ? scaleX : scaleY;

    this.el.set({
      x: this.gb.ww / 2,
      regX: this.bounds.width / 2,
      y: this.gb.wh / 2,
      regY: this.bounds.height / 2,
      scaleX: minScale,
      scaleY: minScale,
    });
  }
}
