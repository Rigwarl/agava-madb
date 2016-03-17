import Element from './element.js';
import Agava from './agava.js';

export default class extends Element {
  constructor(queue, config) {
    super();
    this.queue = queue;
    this.el = new createjs.Container();

    this.createAgavas(config);
    this.set();
    this.addToResize();
  }
  set() {
    const offsetY = this.gb.wh - this.gb.ch * this.gb.scaleY;
    this.el.set({
      y: offsetY,
      x: this.gb.ww / 2,
      regX: this.gb.cw / 2,
      scaleX: this.gb.scaleMin,
      scaleY: this.gb.scaleMin,
    });
  }
  createAgavas(config) {
    const sprite = this.createSprite();
    this.agavas = [];

    for (let i = 0; i < config.agavaNum; i++) {
      const agava = new Agava(sprite, config);

      this.agavas.push(agava);
      agava.addTo(this.el);
    }
  }
  createSprite() {
    return new createjs.SpriteSheet({
      images: [this.queue.getResult('agava')],
      frames: [
        [292, 0, 292, 600], // agavaFall_00
        [876, 1200, 292, 600], // agavaFall_01
        [584, 0, 292, 600], // agavaFall_02
        [876, 0, 292, 600], // agavaFall_03
        [1168, 0, 292, 600], // agavaFall_04
        [0, 600, 292, 600], // agavaFall_05
        [292, 600, 292, 600], // agavaFall_06
        [584, 600, 292, 600], // agavaFall_07
        [876, 600, 292, 600], // agavaFall_08
        [1168, 600, 292, 600], // agavaFall_09
        [1460, 0, 292, 600], // agavaFall_10
        [1460, 600, 292, 600], // agavaFall_11
        [1752, 0, 292, 600], // agavaFall_12
        [1752, 600, 292, 600], // agavaFall_13
        [0, 1200, 292, 600], // agavaFall_14
        [292, 1200, 292, 600], // agavaFall_15
        [584, 1200, 292, 600], // agavaFall_16
        [0, 0, 292, 600], // agavaFall_17
        [1168, 1200, 292, 600], // agavaFall_18
        [1460, 1200, 292, 600], // agavaFall_19
        [1752, 1200, 292, 600], // agavaFall_20
        [2044, 0, 292, 600], // agavaFall_21
        [2044, 600, 292, 600], // agavaFall_22
        [2044, 1200, 292, 600], // agavaFall_23
        [2336, 0, 292, 600], // agavaFall_24
        [2336, 600, 292, 600], // agavaFall_25
        [2336, 1200, 292, 600], // agavaFall_26
        [0, 1800, 292, 600], // agavaFall_27
        [292, 1800, 292, 600], // agavaFall_28
        [584, 1800, 292, 600], // agavaFall_29
        [876, 1800, 292, 600], // agavaFall_30
        [1168, 1800, 292, 600], // agavaFall_31
        [1460, 1800, 292, 600], // agavaFall_32
        [1752, 1800, 292, 600], // agavaFall_33
      ],
    });
  }
}
