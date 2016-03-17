import Element from './element.js';

export default class extends Element {
  constructor(sprite, config) {
    super();
    this.el = new createjs.Sprite(sprite);
    this.bounds = this.el.getBounds();
    this.frames = sprite.getNumFrames();
    this.set(config);
    this.bindEvents(config);
  }
  set(config) {
    this.el.gotoAndStop(0);
    this.el.set({
      x: Math.random() * this.gb.cw,
      regX: this.bounds.width / 2,
    });
    setTimeout(() => this.el.play(), Math.random() * config.agavaDelay);
  }
  bindEvents(config) {
    this.el.addEventListener('animationend', () => this.set(config));
  }
}
