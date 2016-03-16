import bounds from '../bounds.js';

export default class {
  constructor() {
    this.gb = bounds;
  }
  addTo(parent) {
    this.parent = parent;
    parent.addChild(this.el);
  }
  remove() {
    this.parent.removeChild(this.el);
    if (this.resize) this.removeFromResize();
  }
  addToResize() {
    this.resize = this.set.bind(this); // завяжутся ли ссылки друг на друга?
    bounds.toResize.add(this.resize);
  }
  removeFromResize() {
    bounds.toResize.delete(this.resize);
  }
}
