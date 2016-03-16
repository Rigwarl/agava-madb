export default {
  init(canvas) {
    this.canvas = canvas;
    this.toResize = new Set();
    this.resizeFlag = true;

    this.cw = this.canvas.width;
    this.ch = this.canvas.height;

    this.set();
    this.bindResize();
  },
  set() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    this.scaleX = this.ww / this.cw;
    this.scaleY = this.wh / this.ch;

    if (this.scaleX < this.scaleY) {
      this.scaleMin = this.scaleX;
      this.scaleMax = this.scaleY;
    } else {
      this.scaleMin = this.scaleY;
      this.scaleMax = this.scaleX;
    }
  },
  resize() {
    if (this.resizeFlag) {
      this.set();
      this.canvas.width = this.ww;
      this.canvas.height = this.wh;
      this.toResize.forEach(item => item());
      this.resizeFlag = false;
    }
  },
  bindResize() {
    window.addEventListener('resize', () => {
      this.resizeFlag = true;
    });
  },
};
