(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _game = require('./game.js');

var _game2 = _interopRequireDefault(_game);

var _bounds = require('./bounds.js');

var _bounds2 = _interopRequireDefault(_bounds);

var _load = require('./load.js');

var _load2 = _interopRequireDefault(_load);

var _intro = require('./elements/intro.js');

var _intro2 = _interopRequireDefault(_intro);

var _load_progress = require('./elements/load_progress.js');

var _load_progress2 = _interopRequireDefault(_load_progress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assets = {
  intro: [{ id: 'intro1', src: 'img/intro_1.jpg' }, { id: 'intro2', src: 'img/intro_2.jpg' }],
  main: [{ id: 'hat', src: 'img/sombrero.png' }, { id: 'bg', src: 'img/background.png' }, { id: 'light', src: 'img/light.png' }, { id: 'agava', src: 'img/agava.png' }, { id: 'playBtn', src: 'img/play_btn.png' }],
  sound: [{ id: 'catch', src: 'sound/catch.wav' }, { id: 'win', src: 'sound/win.mp3' }, { id: 'loose', src: 'sound/loose.mp3' }, { id: 'click', src: 'sound/click.mp3' }]
};

var app = {
  init: function init() {
    var _this = this;

    this.stage = new createjs.Stage('game-stage');
    _bounds2.default.init(this.stage.canvas);

    this.progress = new _load_progress2.default();
    this.progress.addTo(this.stage);

    (0, _load2.default)(assets.intro, {
      progress: function progress(e) {
        return _this.progress.change(e);
      }
    }).then(function (introQueue) {
      Promise.all([(0, _load2.default)(assets.main).then(function (queue) {
        return _game2.default.init({ queue: queue, stage: _this.stage });
      }), _this.initIntro(introQueue)]).then(function () {
        _this.intro.hide();
        _this.intro.removeFrom(_this.stage);
        _game2.default.start();
        (0, _load2.default)(assets.sound, { type: 'sound' }).then(function () {
          return _game2.default.initSound();
        });
      });
    });

    this.setTicker();
    this.setEvents();
  },
  initIntro: function initIntro(queue) {
    this.intro = new _intro2.default(queue);
    this.intro.addTo(this.stage);
    this.progress.removeFrom(this.stage);
    return this.intro.play();
  },
  setTicker: function setTicker() {
    var _this2 = this;

    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener('tick', function () {
      _bounds2.default.resize();
      _this2.stage.update();
    });
  },
  setEvents: function setEvents() {
    this.stage.enableMouseOver(20);
    createjs.Touch.enable(this.stage);
  }
};

app.init();

},{"./bounds.js":2,"./elements/intro.js":9,"./elements/load_progress.js":10,"./game.js":14,"./load.js":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  init: function init(canvas) {
    this.canvas = canvas;
    this.toResize = new Set();
    this.resizeFlag = true;

    this.cw = this.canvas.width;
    this.ch = this.canvas.height;

    this.set();
    this.bindResize();
  },
  set: function set() {
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
  resize: function resize() {
    if (this.resizeFlag) {
      this.set();
      this.canvas.width = this.ww;
      this.canvas.height = this.wh;
      this.toResize.forEach(function (item) {
        return item();
      });

      window.scrollTo(0, 0);
      this.resizeFlag = false;
    }
  },
  bindResize: function bindResize() {
    var _this = this;

    window.addEventListener('resize', function () {
      _this.resizeFlag = true;
    });
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(sprite, config) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.config = config;
    _this.el = new createjs.Sprite(sprite);
    _this.bounds = _this.el.getBounds();
    _this.bindEvents();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      var _this2 = this;

      this.el.gotoAndStop(0);
      this.el.set({
        x: Math.random() * this.gb.cw,
        regX: this.bounds.width / 2
      });
      setTimeout(function () {
        return _this2.el.play();
      }, Math.random() * this.config.agavaDelay);
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this3 = this;

      this.el.addEventListener('animationend', function () {
        return _this3.set();
      });
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

var _agava = require('./agava.js');

var _agava2 = _interopRequireDefault(_agava);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(queue, config) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.queue = queue;
    _this.el = new createjs.Container();

    _this.createAgavas(config);
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        y: this.gb.wh - this.gb.ch * this.gb.scaleMin,
        x: this.gb.ww / 2,
        regX: this.gb.cw / 2,
        scaleX: this.gb.scaleMin,
        scaleY: this.gb.scaleMin
      });
    }
  }, {
    key: 'createAgavas',
    value: function createAgavas(config) {
      var sprite = this.createSprite();
      this.agavas = [];

      for (var i = 0; i < config.agavaNum; i++) {
        var agava = new _agava2.default(sprite, config);

        this.agavas.push(agava);
        agava.addTo(this.el);
      }
    }
  }, {
    key: 'createSprite',
    value: function createSprite() {
      return new createjs.SpriteSheet({
        images: [this.queue.getResult('agava')],
        frames: [[292, 0, 292, 600], // agavaFall_00
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
        [1752, 1800, 292, 600]]
      });
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./agava.js":3,"./element.js":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(queue) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.el = new createjs.Container();
    _this.el.addChild(new createjs.Bitmap(queue.getResult('bg')), new createjs.Bitmap(queue.getResult('light')));
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        scaleX: this.gb.scaleMax,
        scaleY: this.gb.scaleMax,
        y: this.gb.scaleX > this.gb.scaleY ? this.gb.ch * (this.gb.scaleY - this.gb.scaleX) : 0
      });
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bounds = require('../bounds.js');

var _bounds2 = _interopRequireDefault(_bounds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.gb = _bounds2.default;
  }

  _createClass(_class, [{
    key: 'addTo',
    value: function addTo(parent) {
      parent.addChild(this.el);
    }
  }, {
    key: 'removeFrom',
    value: function removeFrom(parent) {
      parent.removeChild(this.el);
    }
  }, {
    key: 'addToResize',
    value: function addToResize() {
      this.resize = this.set.bind(this); // завяжутся ли ссылки друг на друга?
      _bounds2.default.toResize.add(this.resize);
    }
  }, {
    key: 'removeFromResize',
    value: function removeFromResize() {
      _bounds2.default.toResize.delete(this.resize);
      this.resize = null;
    }
  }]);

  return _class;
}();

exports.default = _class;

},{"../bounds.js":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class() {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.el = new createjs.Text('', '55px Kremlin', '#303030');
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        x: this.gb.ww / 2,
        y: this.gb.wh / 2,
        textAlign: 'center',
        textBaseline: 'middle'
      });
    }
  }, {
    key: 'show',
    value: function show(result) {
      var text = {
        win: 'Вы выиграли',
        loose: 'Время вышло'
      };
      this.el.text = text[result];

      createjs.Tween.get(this.el).to({
        scaleX: 2,
        scaleY: 2
      }, 650);
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(queue) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.el = new createjs.Bitmap(queue.getResult('hat'));
    _this.bounds = _this.el.getBounds();
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        x: this.gb.ww / 2,
        y: this.gb.wh,
        regX: this.bounds.width / 2,
        regY: this.bounds.height,
        scaleX: this.gb.scaleMin,
        scaleY: this.gb.scaleMin
      });
      this.realWidth = this.bounds.width * this.gb.scaleMin;
    }
  }, {
    key: 'move',
    value: function move(x) {
      this.el.x = x;
    }
  }, {
    key: 'catch',
    value: function _catch() {
      createjs.Tween.get(this.el, { override: true }).to({
        y: this.gb.wh + 35,
        scaleY: 0.93 * this.gb.scaleMin
      }, 85).to({
        y: this.gb.wh,
        scaleY: this.gb.scaleMin
      }, 85);
    }
  }, {
    key: 'hide',
    value: function hide(result) {
      var _this2 = this;

      var params = {
        win: {
          scaleY: 0.8,
          y: this.gb.wh + this.bounds.height
        },
        loose: {
          scaleY: 0.1,
          y: this.gb.wh + 25
        }
      };

      return new Promise(function (resolve) {
        createjs.Tween.get(_this2.el, { override: true }).to(params[result], 500).wait(4000).call(resolve);
      });
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(queue) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.queue = queue;
    _this.el = new createjs.Bitmap(_this.queue.getResult('intro1'));
    _this.el.alpha = 0;
    _this.bounds = _this.el.getBounds();
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'play',
    value: function play() {
      var _this2 = this;

      return new Promise(function (resolve) {
        createjs.Tween.get(_this2.el).to({
          alpha: 1
        }, 500).wait(5000).to({
          alpha: 0,
          image: _this2.queue.getResult('intro2')
        }, 500).to({
          alpha: 1
        }, 500).wait(4000).call(resolve);
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      createjs.Tween.get(this.el).to({ alpha: 0 }, 500);
    }
  }, {
    key: 'set',
    value: function set() {
      var scaleX = this.gb.ww / this.bounds.width;
      var scaleY = this.gb.wh / this.bounds.height;
      var minScale = scaleX < scaleY ? scaleX : scaleY;

      this.el.set({
        x: this.gb.ww / 2,
        regX: this.bounds.width / 2,
        y: this.gb.wh / 2,
        regY: this.bounds.height / 2,
        scaleX: minScale,
        scaleY: minScale
      });
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class() {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.el = new createjs.Text('Загрузка 0%', '45px Kremlin', '#000');
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        x: this.gb.ww / 2,
        y: this.gb.wh / 2,
        textAlign: 'center'
      });
    }
  }, {
    key: 'change',
    value: function change(e) {
      this.el.text = 'Загрузка ' + Math.floor(e.loaded * 100) + '%';
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(queue) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.el = new createjs.Bitmap(queue.getResult('playBtn'));
    _this.bounds = _this.el.getBounds();
    _this.el.cursor = 'pointer';

    _this.el.hitArea = new createjs.Shape();
    _this.el.hitArea.graphics.beginFill('#000').drawRect(0, 0, _this.bounds.width, _this.bounds.height);

    _this.set();
    _this.addToResize();
    _this.bindEvents();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        x: this.gb.ww / 2,
        y: this.gb.wh / 2,
        regY: this.bounds.height / 2,
        regX: this.bounds.width / 2
      });
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this2 = this;

      this.el.addEventListener('mouseover', function () {
        return createjs.Tween.get(_this2.el).to({
          scaleX: 1.2,
          scaleY: 1.2
        }, 55);
      });
      this.el.addEventListener('mouseout', function () {
        return createjs.Tween.get(_this2.el).to({
          scaleX: 1,
          scaleY: 1
        }, 55);
      });
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class(config) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.config = config;
    _this.el = new createjs.Text('', '35px Kremlin', '#303030');
    _this.setValue(0);
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        x: 100,
        y: this.gb.wh - 100
      });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.el.text = 'Поймано ' + value + '/' + this.config.toCatch;
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _element = require('./element.js');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Element) {
  _inherits(_class, _Element);

  function _class() {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));

    _this.el = new createjs.Text('', '35px Kremlin', '#303030');
    _this.set();
    _this.addToResize();
    return _this;
  }

  _createClass(_class, [{
    key: 'set',
    value: function set() {
      this.el.set({
        x: this.gb.ww / 2,
        y: 75,
        textAlign: 'center'
      });
    }
  }, {
    key: 'toStr',
    value: function toStr(time) {
      var min = Math.floor(time / 60);
      var sec = time % 60;

      if (min < 10) min = '0' + min;
      if (sec < 10) sec = '0' + sec;

      return 'Время: ' + min + ':' + sec;
    }
  }, {
    key: 'setValue',
    value: function setValue(time) {
      this.el.text = this.toStr(time);
    }
  }]);

  return _class;
}(_element2.default);

exports.default = _class;

},{"./element.js":6}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _agava_stage = require('./elements/agava_stage.js');

var _agava_stage2 = _interopRequireDefault(_agava_stage);

var _playBtn = require('./elements/playBtn.js');

var _playBtn2 = _interopRequireDefault(_playBtn);

var _endText = require('./elements/endText.js');

var _endText2 = _interopRequireDefault(_endText);

var _timer = require('./elements/timer.js');

var _timer2 = _interopRequireDefault(_timer);

var _score = require('./elements/score.js');

var _score2 = _interopRequireDefault(_score);

var _hat = require('./elements/hat.js');

var _hat2 = _interopRequireDefault(_hat);

var _background = require('./elements/background.js');

var _background2 = _interopRequireDefault(_background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  toCatch: 40,
  time: 20,
  agavaNum: 7,
  agavaDelay: 850
};

exports.default = {
  init: function init(_ref) {
    var queue = _ref.queue;
    var stage = _ref.stage;

    this.stage = stage;
    this.queue = queue;

    this.bg = new _background2.default(this.queue);
    this.score = new _score2.default(config);
    this.endText = new _endText2.default();
    this.timer = new _timer2.default();

    this.createAgavas();
    this.createHat();
    this.createPlayBtn();
  },
  start: function start() {
    this.bg.el.alpha = 0;
    this.playBtn.el.alpha = 0;

    createjs.Tween.get(this.bg.el).to({ alpha: 1 }, 500);
    createjs.Tween.get(this.playBtn.el).to({ alpha: 1 }, 500);

    this.stage.addChild(this.bg.el, this.playBtn.el);
  },
  initSound: function initSound() {
    this.soundReady = true;
  },
  playSound: function playSound(sound) {
    if (this.soundReady) createjs.Sound.play(sound);
  },
  play: function play() {
    var _this = this;

    this.playing = true;
    this.stage.cursor = 'none';
    this.scoreVal = 0;
    this.time = config.time;
    this.timer.setValue(this.time);
    this.initTimer();

    // иначе летят все сразу на слоу девайсах
    setTimeout(function () {
      _this.agavaStage.agavas.forEach(function (agava) {
        return agava.set();
      });
    }, 0);

    this.playBtn.removeFrom(this.stage);
    this.stage.addChild(this.agavaStage.el, this.hat.el, this.timer.el, this.score.el);
  },
  createPlayBtn: function createPlayBtn() {
    var _this2 = this;

    this.playBtn = new _playBtn2.default(this.queue);
    this.playBtn.el.addEventListener('click', function () {
      _this2.playSound('click');
      _this2.play();
    });
  },
  createHat: function createHat() {
    var _this3 = this;

    this.hat = new _hat2.default(this.queue);
    this.stage.addEventListener('stagemousemove', function (e) {
      return _this3.hat.move(e.stageX);
    });
  },
  initTimer: function initTimer() {
    var _this4 = this;

    this.timerInterval = setInterval(function () {
      if (!_this4.time) _this4.end('loose');
      _this4.timer.setValue(--_this4.time);
    }, 1000);
  },
  createAgavas: function createAgavas() {
    var _this5 = this;

    this.agavaStage = new _agava_stage2.default(this.queue, config);
    this.agavaStage.agavas.forEach(function (agava) {
      agava.el.addEventListener('change', function () {
        return _this5.catchCheck(agava);
      });
    });
  },
  catchCheck: function catchCheck(agava) {
    if (agava.el.currentFrame === 32 && this.playing) {
      var agavaX = this.agavaStage.el.localToGlobal(agava.el.x, 0).x;

      if (agavaX > this.hat.el.x - this.hat.realWidth / 2 && agavaX < this.hat.el.x + this.hat.realWidth / 2) {
        this.hat.catch();
        this.playSound('catch');
        agava.set();
        this.addScore();
      }
    }
  },
  addScore: function addScore() {
    this.score.setValue(++this.scoreVal);
    if (this.scoreVal === config.toCatch) this.end('win');
  },
  end: function end(result) {
    var _this6 = this;

    this.playing = false;

    clearInterval(this.timerInterval);
    this.stage.removeChild(this.timer.el);

    this.playSound(result);
    this.endText.addTo(this.stage);
    this.endText.show(result);

    this.hat.hide(result).then(function () {
      _this6.stage.removeChild(_this6.agavaStage.el, _this6.score.el, _this6.hat.el, _this6.endText.el);
      _this6.stage.addChild(_this6.playBtn.el);
      _this6.stage.cursor = null;
      _this6.hat.set();
    });
  }
};

},{"./elements/agava_stage.js":4,"./elements/background.js":5,"./elements/endText.js":7,"./elements/hat.js":8,"./elements/playBtn.js":11,"./elements/score.js":12,"./elements/timer.js":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (manifest) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var progress = _ref.progress;
  var type = _ref.type;
  return new Promise(function (resolve, reject) {
    var queue = new createjs.LoadQueue();

    if (type === 'sound') queue.installPlugin(createjs.Sound);
    if (progress) queue.addEventListener('progress', progress);

    queue.addEventListener('complete', function () {
      return resolve(queue);
    });
    queue.addEventListener('error', reject);

    queue.loadManifest(manifest);
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvZXM2L2FwcC5qcyIsImFwcC9qcy9lczYvYm91bmRzLmpzIiwiYXBwL2pzL2VzNi9lbGVtZW50cy9hZ2F2YS5qcyIsImFwcC9qcy9lczYvZWxlbWVudHMvYWdhdmFfc3RhZ2UuanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL2JhY2tncm91bmQuanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL2VsZW1lbnQuanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL2VuZFRleHQuanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL2hhdC5qcyIsImFwcC9qcy9lczYvZWxlbWVudHMvaW50cm8uanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL2xvYWRfcHJvZ3Jlc3MuanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL3BsYXlCdG4uanMiLCJhcHAvanMvZXM2L2VsZW1lbnRzL3Njb3JlLmpzIiwiYXBwL2pzL2VzNi9lbGVtZW50cy90aW1lci5qcyIsImFwcC9qcy9lczYvZ2FtZS5qcyIsImFwcC9qcy9lczYvbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxTQUFTO0FBQ2IsU0FBTyxDQUNMLEVBQUUsSUFBSSxRQUFKLEVBQWMsS0FBSyxpQkFBTCxFQURYLEVBRUwsRUFBRSxJQUFJLFFBQUosRUFBYyxLQUFLLGlCQUFMLEVBRlgsQ0FBUDtBQUlBLFFBQU0sQ0FDSixFQUFFLElBQUksS0FBSixFQUFXLEtBQUssa0JBQUwsRUFEVCxFQUVKLEVBQUUsSUFBSSxJQUFKLEVBQVUsS0FBSyxvQkFBTCxFQUZSLEVBR0osRUFBRSxJQUFJLE9BQUosRUFBYSxLQUFLLGVBQUwsRUFIWCxFQUlKLEVBQUUsSUFBSSxPQUFKLEVBQWEsS0FBSyxlQUFMLEVBSlgsRUFLSixFQUFFLElBQUksU0FBSixFQUFlLEtBQUssa0JBQUwsRUFMYixDQUFOO0FBT0EsU0FBTyxDQUNMLEVBQUUsSUFBSSxPQUFKLEVBQWEsS0FBSyxpQkFBTCxFQURWLEVBRUwsRUFBRSxJQUFJLEtBQUosRUFBVyxLQUFLLGVBQUwsRUFGUixFQUdMLEVBQUUsSUFBSSxPQUFKLEVBQWEsS0FBSyxpQkFBTCxFQUhWLEVBSUwsRUFBRSxJQUFJLE9BQUosRUFBYSxLQUFLLGlCQUFMLEVBSlYsQ0FBUDtDQVpJOztBQW9CTixJQUFNLE1BQU07QUFDVix3QkFBTzs7O0FBQ0wsU0FBSyxLQUFMLEdBQWEsSUFBSSxTQUFTLEtBQVQsQ0FBZSxZQUFuQixDQUFiLENBREs7QUFFTCxxQkFBTyxJQUFQLENBQVksS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFaLENBRks7O0FBSUwsU0FBSyxRQUFMLEdBQWdCLDZCQUFoQixDQUpLO0FBS0wsU0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixLQUFLLEtBQUwsQ0FBcEIsQ0FMSzs7QUFPTCx3QkFBSyxPQUFPLEtBQVAsRUFBYztBQUNqQixnQkFBVTtlQUFLLE1BQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsQ0FBckI7T0FBTDtLQURaLEVBRUcsSUFGSCxDQUVRLHNCQUFjO0FBQ3BCLGNBQVEsR0FBUixDQUFZLENBQ1Ysb0JBQUssT0FBTyxJQUFQLENBQUwsQ0FBa0IsSUFBbEIsQ0FBdUI7ZUFBUyxlQUFLLElBQUwsQ0FBVSxFQUFFLFlBQUYsRUFBUyxPQUFPLE1BQUssS0FBTCxFQUExQjtPQUFULENBRGIsRUFFVixNQUFLLFNBQUwsQ0FBZSxVQUFmLENBRlUsQ0FBWixFQUdHLElBSEgsQ0FHUSxZQUFNO0FBQ1osY0FBSyxLQUFMLENBQVcsSUFBWCxHQURZO0FBRVosY0FBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixNQUFLLEtBQUwsQ0FBdEIsQ0FGWTtBQUdaLHVCQUFLLEtBQUwsR0FIWTtBQUlaLDRCQUFLLE9BQU8sS0FBUCxFQUFjLEVBQUUsTUFBTSxPQUFOLEVBQXJCLEVBQXNDLElBQXRDLENBQTJDO2lCQUFNLGVBQUssU0FBTDtTQUFOLENBQTNDLENBSlk7T0FBTixDQUhSLENBRG9CO0tBQWQsQ0FGUixDQVBLOztBQXFCTCxTQUFLLFNBQUwsR0FyQks7QUFzQkwsU0FBSyxTQUFMLEdBdEJLO0dBREc7QUF5QlYsZ0NBQVUsT0FBTztBQUNmLFNBQUssS0FBTCxHQUFhLG9CQUFVLEtBQVYsQ0FBYixDQURlO0FBRWYsU0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQUFLLEtBQUwsQ0FBakIsQ0FGZTtBQUdmLFNBQUssUUFBTCxDQUFjLFVBQWQsQ0FBeUIsS0FBSyxLQUFMLENBQXpCLENBSGU7QUFJZixXQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsRUFBUCxDQUplO0dBekJQO0FBK0JWLGtDQUFZOzs7QUFDVixhQUFTLE1BQVQsQ0FBZ0IsVUFBaEIsR0FBNkIsU0FBUyxNQUFULENBQWdCLFdBQWhCLENBRG5CO0FBRVYsYUFBUyxNQUFULENBQWdCLE1BQWhCLENBQXVCLEVBQXZCLEVBRlU7QUFHVixhQUFTLE1BQVQsQ0FBZ0IsZ0JBQWhCLENBQWlDLE1BQWpDLEVBQXlDLFlBQU07QUFDN0MsdUJBQU8sTUFBUCxHQUQ2QztBQUU3QyxhQUFLLEtBQUwsQ0FBVyxNQUFYLEdBRjZDO0tBQU4sQ0FBekMsQ0FIVTtHQS9CRjtBQXVDVixrQ0FBWTtBQUNWLFNBQUssS0FBTCxDQUFXLGVBQVgsQ0FBMkIsRUFBM0IsRUFEVTtBQUVWLGFBQVMsS0FBVCxDQUFlLE1BQWYsQ0FBc0IsS0FBSyxLQUFMLENBQXRCLENBRlU7R0F2Q0Y7Q0FBTjs7QUE2Q04sSUFBSSxJQUFKOzs7Ozs7OztrQkN2RWU7QUFDYixzQkFBSyxRQUFRO0FBQ1gsU0FBSyxNQUFMLEdBQWMsTUFBZCxDQURXO0FBRVgsU0FBSyxRQUFMLEdBQWdCLElBQUksR0FBSixFQUFoQixDQUZXO0FBR1gsU0FBSyxVQUFMLEdBQWtCLElBQWxCLENBSFc7O0FBS1gsU0FBSyxFQUFMLEdBQVUsS0FBSyxNQUFMLENBQVksS0FBWixDQUxDO0FBTVgsU0FBSyxFQUFMLEdBQVUsS0FBSyxNQUFMLENBQVksTUFBWixDQU5DOztBQVFYLFNBQUssR0FBTCxHQVJXO0FBU1gsU0FBSyxVQUFMLEdBVFc7R0FEQTtBQVliLHNCQUFNO0FBQ0osU0FBSyxFQUFMLEdBQVUsT0FBTyxVQUFQLENBRE47QUFFSixTQUFLLEVBQUwsR0FBVSxPQUFPLFdBQVAsQ0FGTjtBQUdKLFNBQUssTUFBTCxHQUFjLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxDQUhwQjtBQUlKLFNBQUssTUFBTCxHQUFjLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxDQUpwQjs7QUFNSixRQUFJLEtBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxFQUFhO0FBQzdCLFdBQUssUUFBTCxHQUFnQixLQUFLLE1BQUwsQ0FEYTtBQUU3QixXQUFLLFFBQUwsR0FBZ0IsS0FBSyxNQUFMLENBRmE7S0FBL0IsTUFHTztBQUNMLFdBQUssUUFBTCxHQUFnQixLQUFLLE1BQUwsQ0FEWDtBQUVMLFdBQUssUUFBTCxHQUFnQixLQUFLLE1BQUwsQ0FGWDtLQUhQO0dBbEJXO0FBMEJiLDRCQUFTO0FBQ1AsUUFBSSxLQUFLLFVBQUwsRUFBaUI7QUFDbkIsV0FBSyxHQUFMLEdBRG1CO0FBRW5CLFdBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxFQUFMLENBRkQ7QUFHbkIsV0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixLQUFLLEVBQUwsQ0FIRjtBQUluQixXQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCO2VBQVE7T0FBUixDQUF0QixDQUptQjs7QUFNbkIsYUFBTyxRQUFQLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBTm1CO0FBT25CLFdBQUssVUFBTCxHQUFrQixLQUFsQixDQVBtQjtLQUFyQjtHQTNCVztBQXFDYixvQ0FBYTs7O0FBQ1gsV0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFNO0FBQ3RDLFlBQUssVUFBTCxHQUFrQixJQUFsQixDQURzQztLQUFOLENBQWxDLENBRFc7R0FyQ0E7Ozs7Ozs7Ozs7OztBQ0FmOzs7Ozs7Ozs7Ozs7Ozs7QUFHRSxrQkFBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCOzs7OztBQUUxQixVQUFLLE1BQUwsR0FBYyxNQUFkLENBRjBCO0FBRzFCLFVBQUssRUFBTCxHQUFVLElBQUksU0FBUyxNQUFULENBQWdCLE1BQXBCLENBQVYsQ0FIMEI7QUFJMUIsVUFBSyxNQUFMLEdBQWMsTUFBSyxFQUFMLENBQVEsU0FBUixFQUFkLENBSjBCO0FBSzFCLFVBQUssVUFBTCxHQUwwQjs7R0FBNUI7Ozs7MEJBT007OztBQUNKLFdBQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsQ0FBcEIsRUFESTtBQUVKLFdBQUssRUFBTCxDQUFRLEdBQVIsQ0FBWTtBQUNWLFdBQUcsS0FBSyxNQUFMLEtBQWdCLEtBQUssRUFBTCxDQUFRLEVBQVI7QUFDbkIsY0FBTSxLQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLENBQXBCO09BRlIsRUFGSTtBQU1KLGlCQUFXO2VBQU0sT0FBSyxFQUFMLENBQVEsSUFBUjtPQUFOLEVBQXNCLEtBQUssTUFBTCxLQUFnQixLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQWpELENBTkk7Ozs7aUNBUU87OztBQUNYLFdBQUssRUFBTCxDQUFRLGdCQUFSLENBQXlCLGNBQXpCLEVBQXlDO2VBQU0sT0FBSyxHQUFMO09BQU4sQ0FBekMsQ0FEVzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEJmOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQUdFLGtCQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkI7Ozs7O0FBRXpCLFVBQUssS0FBTCxHQUFhLEtBQWIsQ0FGeUI7QUFHekIsVUFBSyxFQUFMLEdBQVUsSUFBSSxTQUFTLFNBQVQsRUFBZCxDQUh5Qjs7QUFLekIsVUFBSyxZQUFMLENBQWtCLE1BQWxCLEVBTHlCO0FBTXpCLFVBQUssR0FBTCxHQU55QjtBQU96QixVQUFLLFdBQUwsR0FQeUI7O0dBQTNCOzs7OzBCQVNNO0FBQ0osV0FBSyxFQUFMLENBQVEsR0FBUixDQUFZO0FBQ1YsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSLEdBQWEsS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLEtBQUssRUFBTCxDQUFRLFFBQVI7QUFDN0IsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSLEdBQWEsQ0FBYjtBQUNILGNBQU0sS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLENBQWI7QUFDTixnQkFBUSxLQUFLLEVBQUwsQ0FBUSxRQUFSO0FBQ1IsZ0JBQVEsS0FBSyxFQUFMLENBQVEsUUFBUjtPQUxWLEVBREk7Ozs7aUNBU08sUUFBUTtBQUNuQixVQUFNLFNBQVMsS0FBSyxZQUFMLEVBQVQsQ0FEYTtBQUVuQixXQUFLLE1BQUwsR0FBYyxFQUFkLENBRm1COztBQUluQixXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFPLFFBQVAsRUFBaUIsR0FBckMsRUFBMEM7QUFDeEMsWUFBTSxRQUFRLG9CQUFVLE1BQVYsRUFBa0IsTUFBbEIsQ0FBUixDQURrQzs7QUFHeEMsYUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQixFQUh3QztBQUl4QyxjQUFNLEtBQU4sQ0FBWSxLQUFLLEVBQUwsQ0FBWixDQUp3QztPQUExQzs7OzttQ0FPYTtBQUNiLGFBQU8sSUFBSSxTQUFTLFdBQVQsQ0FBcUI7QUFDOUIsZ0JBQVEsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLE9BQXJCLENBQUQsQ0FBUjtBQUNBLGdCQUFRLENBQ04sQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEdBQVQsRUFBYyxHQUFkLENBRE07QUFFTixTQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksR0FBWixFQUFpQixHQUFqQixDQUZNO0FBR04sU0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLEdBQVQsRUFBYyxHQUFkLENBSE07QUFJTixTQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsR0FBVCxFQUFjLEdBQWQsQ0FKTTtBQUtOLFNBQUMsSUFBRCxFQUFPLENBQVAsRUFBVSxHQUFWLEVBQWUsR0FBZixDQUxNO0FBTU4sU0FBQyxDQUFELEVBQUksR0FBSixFQUFTLEdBQVQsRUFBYyxHQUFkLENBTk07QUFPTixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixDQVBNO0FBUU4sU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FSTTtBQVNOLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLENBVE07QUFVTixTQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixHQUFqQixDQVZNO0FBV04sU0FBQyxJQUFELEVBQU8sQ0FBUCxFQUFVLEdBQVYsRUFBZSxHQUFmLENBWE07QUFZTixTQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixHQUFqQixDQVpNO0FBYU4sU0FBQyxJQUFELEVBQU8sQ0FBUCxFQUFVLEdBQVYsRUFBZSxHQUFmLENBYk07QUFjTixTQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixHQUFqQixDQWRNO0FBZU4sU0FBQyxDQUFELEVBQUksSUFBSixFQUFVLEdBQVYsRUFBZSxHQUFmLENBZk07QUFnQk4sU0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FoQk07QUFpQk4sU0FBQyxHQUFELEVBQU0sSUFBTixFQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FqQk07QUFrQk4sU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEdBQVAsRUFBWSxHQUFaLENBbEJNO0FBbUJOLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBbkJNO0FBb0JOLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBcEJNO0FBcUJOLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBckJNO0FBc0JOLFNBQUMsSUFBRCxFQUFPLENBQVAsRUFBVSxHQUFWLEVBQWUsR0FBZixDQXRCTTtBQXVCTixTQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixHQUFqQixDQXZCTTtBQXdCTixTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsR0FBYixFQUFrQixHQUFsQixDQXhCTTtBQXlCTixTQUFDLElBQUQsRUFBTyxDQUFQLEVBQVUsR0FBVixFQUFlLEdBQWYsQ0F6Qk07QUEwQk4sU0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsR0FBakIsQ0ExQk07QUEyQk4sU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEdBQWIsRUFBa0IsR0FBbEIsQ0EzQk07QUE0Qk4sU0FBQyxDQUFELEVBQUksSUFBSixFQUFVLEdBQVYsRUFBZSxHQUFmLENBNUJNO0FBNkJOLFNBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxHQUFaLEVBQWlCLEdBQWpCLENBN0JNO0FBOEJOLFNBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxHQUFaLEVBQWlCLEdBQWpCLENBOUJNO0FBK0JOLFNBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxHQUFaLEVBQWlCLEdBQWpCLENBL0JNO0FBZ0NOLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBaENNO0FBaUNOLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBakNNO0FBa0NOLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBbENNLENBQVI7T0FGSyxDQUFQLENBRGE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDakI7Ozs7Ozs7Ozs7Ozs7OztBQUdFLGtCQUFZLEtBQVosRUFBbUI7Ozs7O0FBRWpCLFVBQUssRUFBTCxHQUFVLElBQUksU0FBUyxTQUFULEVBQWQsQ0FGaUI7QUFHakIsVUFBSyxFQUFMLENBQVEsUUFBUixDQUNFLElBQUksU0FBUyxNQUFULENBQWdCLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFwQixDQURGLEVBRUUsSUFBSSxTQUFTLE1BQVQsQ0FBZ0IsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXBCLENBRkYsRUFIaUI7QUFPakIsVUFBSyxHQUFMLEdBUGlCO0FBUWpCLFVBQUssV0FBTCxHQVJpQjs7R0FBbkI7Ozs7MEJBVU07QUFDSixXQUFLLEVBQUwsQ0FBUSxHQUFSLENBQVk7QUFDVixnQkFBUSxLQUFLLEVBQUwsQ0FBUSxRQUFSO0FBQ1IsZ0JBQVEsS0FBSyxFQUFMLENBQVEsUUFBUjtBQUNSLFdBQUcsS0FBSyxFQUFMLENBQVEsTUFBUixHQUFpQixLQUFLLEVBQUwsQ0FBUSxNQUFSLEdBQWlCLEtBQUssRUFBTCxDQUFRLEVBQVIsSUFBYyxLQUFLLEVBQUwsQ0FBUSxNQUFSLEdBQWlCLEtBQUssRUFBTCxDQUFRLE1BQVIsQ0FBL0IsR0FBaUQsQ0FBbkY7T0FITCxFQURJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiUjs7Ozs7Ozs7O0FBR0Usb0JBQWM7OztBQUNaLFNBQUssRUFBTCxvQkFEWTtHQUFkOzs7OzBCQUdNLFFBQVE7QUFDWixhQUFPLFFBQVAsQ0FBZ0IsS0FBSyxFQUFMLENBQWhCLENBRFk7Ozs7K0JBR0gsUUFBUTtBQUNqQixhQUFPLFdBQVAsQ0FBbUIsS0FBSyxFQUFMLENBQW5CLENBRGlCOzs7O2tDQUdMO0FBQ1osV0FBSyxNQUFMLEdBQWMsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLElBQWQsQ0FBZDtBQURZLHNCQUVaLENBQU8sUUFBUCxDQUFnQixHQUFoQixDQUFvQixLQUFLLE1BQUwsQ0FBcEIsQ0FGWTs7Ozt1Q0FJSztBQUNqQix1QkFBTyxRQUFQLENBQWdCLE1BQWhCLENBQXVCLEtBQUssTUFBTCxDQUF2QixDQURpQjtBQUVqQixXQUFLLE1BQUwsR0FBYyxJQUFkLENBRmlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQnJCOzs7Ozs7Ozs7Ozs7Ozs7QUFHRSxvQkFBYzs7Ozs7QUFFWixVQUFLLEVBQUwsR0FBVSxJQUFJLFNBQVMsSUFBVCxDQUFjLEVBQWxCLEVBQXNCLGNBQXRCLEVBQXNDLFNBQXRDLENBQVYsQ0FGWTtBQUdaLFVBQUssR0FBTCxHQUhZO0FBSVosVUFBSyxXQUFMLEdBSlk7O0dBQWQ7Ozs7MEJBTU07QUFDSixXQUFLLEVBQUwsQ0FBUSxHQUFSLENBQVk7QUFDVixXQUFHLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxDQUFiO0FBQ0gsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSLEdBQWEsQ0FBYjtBQUNILG1CQUFXLFFBQVg7QUFDQSxzQkFBYyxRQUFkO09BSkYsRUFESTs7Ozt5QkFRRCxRQUFRO0FBQ1gsVUFBTSxPQUFPO0FBQ1gsYUFBSyxhQUFMO0FBQ0EsZUFBTyxhQUFQO09BRkksQ0FESztBQUtYLFdBQUssRUFBTCxDQUFRLElBQVIsR0FBZSxLQUFLLE1BQUwsQ0FBZixDQUxXOztBQU9YLGVBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBbUIsS0FBSyxFQUFMLENBQW5CLENBQ0csRUFESCxDQUNNO0FBQ0YsZ0JBQVEsQ0FBUjtBQUNBLGdCQUFRLENBQVI7T0FISixFQUlLLEdBSkwsRUFQVzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJmOzs7Ozs7Ozs7Ozs7Ozs7QUFHRSxrQkFBWSxLQUFaLEVBQW1COzs7OztBQUVqQixVQUFLLEVBQUwsR0FBVSxJQUFJLFNBQVMsTUFBVCxDQUFnQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBcEIsQ0FBVixDQUZpQjtBQUdqQixVQUFLLE1BQUwsR0FBYyxNQUFLLEVBQUwsQ0FBUSxTQUFSLEVBQWQsQ0FIaUI7QUFJakIsVUFBSyxHQUFMLEdBSmlCO0FBS2pCLFVBQUssV0FBTCxHQUxpQjs7R0FBbkI7Ozs7MEJBT007QUFDSixXQUFLLEVBQUwsQ0FBUSxHQUFSLENBQVk7QUFDVixXQUFHLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxDQUFiO0FBQ0gsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSO0FBQ0gsY0FBTSxLQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLENBQXBCO0FBQ04sY0FBTSxLQUFLLE1BQUwsQ0FBWSxNQUFaO0FBQ04sZ0JBQVEsS0FBSyxFQUFMLENBQVEsUUFBUjtBQUNSLGdCQUFRLEtBQUssRUFBTCxDQUFRLFFBQVI7T0FOVixFQURJO0FBU0osV0FBSyxTQUFMLEdBQWlCLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxFQUFMLENBQVEsUUFBUixDQVRqQzs7Ozt5QkFXRCxHQUFHO0FBQ04sV0FBSyxFQUFMLENBQVEsQ0FBUixHQUFZLENBQVosQ0FETTs7Ozs2QkFHQTtBQUNOLGVBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBbUIsS0FBSyxFQUFMLEVBQVMsRUFBRSxVQUFVLElBQVYsRUFBOUIsRUFDRyxFQURILENBQ007QUFDRixXQUFHLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxFQUFiO0FBQ0gsZ0JBQVEsT0FBTyxLQUFLLEVBQUwsQ0FBUSxRQUFSO09BSG5CLEVBSUssRUFKTCxFQUtHLEVBTEgsQ0FLTTtBQUNGLFdBQUcsS0FBSyxFQUFMLENBQVEsRUFBUjtBQUNILGdCQUFRLEtBQUssRUFBTCxDQUFRLFFBQVI7T0FQWixFQVFLLEVBUkwsRUFETTs7Ozt5QkFXSCxRQUFROzs7QUFDWCxVQUFNLFNBQVM7QUFDYixhQUFLO0FBQ0gsa0JBQVEsR0FBUjtBQUNBLGFBQUcsS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLEtBQUssTUFBTCxDQUFZLE1BQVo7U0FGbEI7QUFJQSxlQUFPO0FBQ0wsa0JBQVEsR0FBUjtBQUNBLGFBQUcsS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLEVBQWI7U0FGTDtPQUxJLENBREs7O0FBWVgsYUFBTyxJQUFJLE9BQUosQ0FBWSxtQkFBVztBQUM1QixpQkFBUyxLQUFULENBQWUsR0FBZixDQUFtQixPQUFLLEVBQUwsRUFBUyxFQUFFLFVBQVUsSUFBVixFQUE5QixFQUNHLEVBREgsQ0FDTSxPQUFPLE1BQVAsQ0FETixFQUNzQixHQUR0QixFQUVHLElBRkgsQ0FFUSxJQUZSLEVBR0csSUFISCxDQUdRLE9BSFIsRUFENEI7T0FBWCxDQUFuQixDQVpXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQ2Y7Ozs7Ozs7Ozs7Ozs7OztBQUdFLGtCQUFZLEtBQVosRUFBbUI7Ozs7O0FBRWpCLFVBQUssS0FBTCxHQUFhLEtBQWIsQ0FGaUI7QUFHakIsVUFBSyxFQUFMLEdBQVUsSUFBSSxTQUFTLE1BQVQsQ0FBZ0IsTUFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixRQUFyQixDQUFwQixDQUFWLENBSGlCO0FBSWpCLFVBQUssRUFBTCxDQUFRLEtBQVIsR0FBZ0IsQ0FBaEIsQ0FKaUI7QUFLakIsVUFBSyxNQUFMLEdBQWMsTUFBSyxFQUFMLENBQVEsU0FBUixFQUFkLENBTGlCO0FBTWpCLFVBQUssR0FBTCxHQU5pQjtBQU9qQixVQUFLLFdBQUwsR0FQaUI7O0dBQW5COzs7OzJCQVNPOzs7QUFDTCxhQUFPLElBQUksT0FBSixDQUFZLG1CQUFXO0FBQzVCLGlCQUFTLEtBQVQsQ0FBZSxHQUFmLENBQW1CLE9BQUssRUFBTCxDQUFuQixDQUNHLEVBREgsQ0FDTTtBQUNGLGlCQUFPLENBQVA7U0FGSixFQUdLLEdBSEwsRUFJRyxJQUpILENBSVEsSUFKUixFQUtHLEVBTEgsQ0FLTTtBQUNGLGlCQUFPLENBQVA7QUFDQSxpQkFBTyxPQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLFFBQXJCLENBQVA7U0FQSixFQVFLLEdBUkwsRUFTRyxFQVRILENBU007QUFDRixpQkFBTyxDQUFQO1NBVkosRUFXSyxHQVhMLEVBWUcsSUFaSCxDQVlRLElBWlIsRUFhRyxJQWJILENBYVEsT0FiUixFQUQ0QjtPQUFYLENBQW5CLENBREs7Ozs7MkJBa0JBO0FBQ0wsZUFBUyxLQUFULENBQWUsR0FBZixDQUFtQixLQUFLLEVBQUwsQ0FBbkIsQ0FDRyxFQURILENBQ00sRUFBRSxPQUFPLENBQVAsRUFEUixFQUNvQixHQURwQixFQURLOzs7OzBCQUlEO0FBQ0osVUFBTSxTQUFTLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBRHhCO0FBRUosVUFBTSxTQUFTLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBRnhCO0FBR0osVUFBTSxXQUFXLFNBQVMsTUFBVCxHQUFrQixNQUFsQixHQUEyQixNQUEzQixDQUhiOztBQUtKLFdBQUssRUFBTCxDQUFRLEdBQVIsQ0FBWTtBQUNWLFdBQUcsS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLENBQWI7QUFDSCxjQUFNLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsQ0FBcEI7QUFDTixXQUFHLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxDQUFiO0FBQ0gsY0FBTSxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLENBQXJCO0FBQ04sZ0JBQVEsUUFBUjtBQUNBLGdCQUFRLFFBQVI7T0FORixFQUxJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ1I7Ozs7Ozs7Ozs7Ozs7OztBQUdFLG9CQUFjOzs7OztBQUVaLFVBQUssRUFBTCxHQUFVLElBQUksU0FBUyxJQUFULENBQWMsYUFBbEIsRUFBaUMsY0FBakMsRUFBaUQsTUFBakQsQ0FBVixDQUZZO0FBR1osVUFBSyxHQUFMLEdBSFk7QUFJWixVQUFLLFdBQUwsR0FKWTs7R0FBZDs7OzswQkFNTTtBQUNKLFdBQUssRUFBTCxDQUFRLEdBQVIsQ0FBWTtBQUNWLFdBQUcsS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLENBQWI7QUFDSCxXQUFHLEtBQUssRUFBTCxDQUFRLEVBQVIsR0FBYSxDQUFiO0FBQ0gsbUJBQVcsUUFBWDtPQUhGLEVBREk7Ozs7MkJBT0MsR0FBRztBQUNSLFdBQUssRUFBTCxDQUFRLElBQVIsaUJBQTJCLEtBQUssS0FBTCxDQUFXLEVBQUUsTUFBRixHQUFXLEdBQVgsT0FBdEMsQ0FEUTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJaOzs7Ozs7Ozs7Ozs7Ozs7QUFHRSxrQkFBWSxLQUFaLEVBQW1COzs7OztBQUVqQixVQUFLLEVBQUwsR0FBVSxJQUFJLFNBQVMsTUFBVCxDQUFnQixNQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsQ0FBcEIsQ0FBVixDQUZpQjtBQUdqQixVQUFLLE1BQUwsR0FBYyxNQUFLLEVBQUwsQ0FBUSxTQUFSLEVBQWQsQ0FIaUI7QUFJakIsVUFBSyxFQUFMLENBQVEsTUFBUixHQUFpQixTQUFqQixDQUppQjs7QUFNakIsVUFBSyxFQUFMLENBQVEsT0FBUixHQUFrQixJQUFJLFNBQVMsS0FBVCxFQUF0QixDQU5pQjtBQU9qQixVQUFLLEVBQUwsQ0FBUSxPQUFSLENBQWdCLFFBQWhCLENBQXlCLFNBQXpCLENBQW1DLE1BQW5DLEVBQ0csUUFESCxDQUNZLENBRFosRUFDZSxDQURmLEVBQ2tCLE1BQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsTUFBSyxNQUFMLENBQVksTUFBWixDQURyQyxDQVBpQjs7QUFVakIsVUFBSyxHQUFMLEdBVmlCO0FBV2pCLFVBQUssV0FBTCxHQVhpQjtBQVlqQixVQUFLLFVBQUwsR0FaaUI7O0dBQW5COzs7OzBCQWNNO0FBQ0osV0FBSyxFQUFMLENBQVEsR0FBUixDQUFZO0FBQ1YsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSLEdBQWEsQ0FBYjtBQUNILFdBQUcsS0FBSyxFQUFMLENBQVEsRUFBUixHQUFhLENBQWI7QUFDSCxjQUFNLEtBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsQ0FBckI7QUFDTixjQUFNLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsQ0FBcEI7T0FKUixFQURJOzs7O2lDQVFPOzs7QUFDWCxXQUFLLEVBQUwsQ0FBUSxnQkFBUixDQUF5QixXQUF6QixFQUFzQztlQUFNLFNBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBbUIsT0FBSyxFQUFMLENBQW5CLENBQ3pDLEVBRHlDLENBQ3RDO0FBQ0Ysa0JBQVEsR0FBUjtBQUNBLGtCQUFRLEdBQVI7U0FId0MsRUFJdkMsRUFKdUM7T0FBTixDQUF0QyxDQURXO0FBTVgsV0FBSyxFQUFMLENBQVEsZ0JBQVIsQ0FBeUIsVUFBekIsRUFBcUM7ZUFBTSxTQUFTLEtBQVQsQ0FBZSxHQUFmLENBQW1CLE9BQUssRUFBTCxDQUFuQixDQUN4QyxFQUR3QyxDQUNyQztBQUNGLGtCQUFRLENBQVI7QUFDQSxrQkFBUSxDQUFSO1NBSHVDLEVBSXRDLEVBSnNDO09BQU4sQ0FBckMsQ0FOVzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJmOzs7Ozs7Ozs7Ozs7Ozs7QUFHRSxrQkFBWSxNQUFaLEVBQW9COzs7OztBQUVsQixVQUFLLE1BQUwsR0FBYyxNQUFkLENBRmtCO0FBR2xCLFVBQUssRUFBTCxHQUFVLElBQUksU0FBUyxJQUFULENBQWMsRUFBbEIsRUFBc0IsY0FBdEIsRUFBc0MsU0FBdEMsQ0FBVixDQUhrQjtBQUlsQixVQUFLLFFBQUwsQ0FBYyxDQUFkLEVBSmtCO0FBS2xCLFVBQUssR0FBTCxHQUxrQjtBQU1sQixVQUFLLFdBQUwsR0FOa0I7O0dBQXBCOzs7OzBCQVFNO0FBQ0osV0FBSyxFQUFMLENBQVEsR0FBUixDQUFZO0FBQ1YsV0FBRyxHQUFIO0FBQ0EsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSLEdBQWEsR0FBYjtPQUZMLEVBREk7Ozs7NkJBTUcsT0FBTztBQUNkLFdBQUssRUFBTCxDQUFRLElBQVIsZ0JBQTBCLGNBQVMsS0FBSyxNQUFMLENBQVksT0FBWixDQURyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakJsQjs7Ozs7Ozs7Ozs7Ozs7O0FBR0Usb0JBQWM7Ozs7O0FBRVosVUFBSyxFQUFMLEdBQVUsSUFBSSxTQUFTLElBQVQsQ0FBYyxFQUFsQixFQUFzQixjQUF0QixFQUFzQyxTQUF0QyxDQUFWLENBRlk7QUFHWixVQUFLLEdBQUwsR0FIWTtBQUlaLFVBQUssV0FBTCxHQUpZOztHQUFkOzs7OzBCQU1NO0FBQ0osV0FBSyxFQUFMLENBQVEsR0FBUixDQUFZO0FBQ1YsV0FBRyxLQUFLLEVBQUwsQ0FBUSxFQUFSLEdBQWEsQ0FBYjtBQUNILFdBQUcsRUFBSDtBQUNBLG1CQUFXLFFBQVg7T0FIRixFQURJOzs7OzBCQU9BLE1BQU07QUFDVixVQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsT0FBTyxFQUFQLENBQWpCLENBRE07QUFFVixVQUFJLE1BQU0sT0FBTyxFQUFQLENBRkE7O0FBSVYsVUFBSSxNQUFNLEVBQU4sRUFBVSxZQUFVLEdBQVYsQ0FBZDtBQUNBLFVBQUksTUFBTSxFQUFOLEVBQVUsWUFBVSxHQUFWLENBQWQ7O0FBRUEseUJBQWlCLFlBQU8sR0FBeEIsQ0FQVTs7Ozs2QkFTSCxNQUFNO0FBQ2IsV0FBSyxFQUFMLENBQVEsSUFBUixHQUFlLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZixDQURhOzs7Ozs7Ozs7Ozs7Ozs7O0FDekJqQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxTQUFTO0FBQ2IsV0FBUyxFQUFUO0FBQ0EsUUFBTSxFQUFOO0FBQ0EsWUFBVSxDQUFWO0FBQ0EsY0FBWSxHQUFaO0NBSkk7O2tCQU9TO0FBQ2IsNEJBQXVCO1FBQWhCLG1CQUFnQjtRQUFULG1CQUFTOztBQUNyQixTQUFLLEtBQUwsR0FBYSxLQUFiLENBRHFCO0FBRXJCLFNBQUssS0FBTCxHQUFhLEtBQWIsQ0FGcUI7O0FBSXJCLFNBQUssRUFBTCxHQUFVLHlCQUFPLEtBQUssS0FBTCxDQUFqQixDQUpxQjtBQUtyQixTQUFLLEtBQUwsR0FBYSxvQkFBVSxNQUFWLENBQWIsQ0FMcUI7QUFNckIsU0FBSyxPQUFMLEdBQWUsdUJBQWYsQ0FOcUI7QUFPckIsU0FBSyxLQUFMLEdBQWEscUJBQWIsQ0FQcUI7O0FBU3JCLFNBQUssWUFBTCxHQVRxQjtBQVVyQixTQUFLLFNBQUwsR0FWcUI7QUFXckIsU0FBSyxhQUFMLEdBWHFCO0dBRFY7QUFjYiwwQkFBUTtBQUNOLFNBQUssRUFBTCxDQUFRLEVBQVIsQ0FBVyxLQUFYLEdBQW1CLENBQW5CLENBRE07QUFFTixTQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLEtBQWhCLEdBQXdCLENBQXhCLENBRk07O0FBSU4sYUFBUyxLQUFULENBQWUsR0FBZixDQUFtQixLQUFLLEVBQUwsQ0FBUSxFQUFSLENBQW5CLENBQ0csRUFESCxDQUNNLEVBQUUsT0FBTyxDQUFQLEVBRFIsRUFDb0IsR0FEcEIsRUFKTTtBQU1OLGFBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBbUIsS0FBSyxPQUFMLENBQWEsRUFBYixDQUFuQixDQUNHLEVBREgsQ0FDTSxFQUFFLE9BQU8sQ0FBUCxFQURSLEVBQ29CLEdBRHBCLEVBTk07O0FBU04sU0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFLLEVBQUwsQ0FBUSxFQUFSLEVBQVksS0FBSyxPQUFMLENBQWEsRUFBYixDQUFoQyxDQVRNO0dBZEs7QUF5QmIsa0NBQVk7QUFDVixTQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FEVTtHQXpCQztBQTRCYixnQ0FBVSxPQUFPO0FBQ2YsUUFBSSxLQUFLLFVBQUwsRUFBaUIsU0FBUyxLQUFULENBQWUsSUFBZixDQUFvQixLQUFwQixFQUFyQjtHQTdCVztBQStCYix3QkFBTzs7O0FBQ0wsU0FBSyxPQUFMLEdBQWUsSUFBZixDQURLO0FBRUwsU0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixNQUFwQixDQUZLO0FBR0wsU0FBSyxRQUFMLEdBQWdCLENBQWhCLENBSEs7QUFJTCxTQUFLLElBQUwsR0FBWSxPQUFPLElBQVAsQ0FKUDtBQUtMLFNBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBSyxJQUFMLENBQXBCLENBTEs7QUFNTCxTQUFLLFNBQUw7OztBQU5LLGNBU0wsQ0FBVyxZQUFNO0FBQ2YsWUFBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLE9BQXZCLENBQStCO2VBQVMsTUFBTSxHQUFOO09BQVQsQ0FBL0IsQ0FEZTtLQUFOLEVBRVIsQ0FGSCxFQVRLOztBQWFMLFNBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IsS0FBSyxLQUFMLENBQXhCLENBYks7QUFjTCxTQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQUssVUFBTCxDQUFnQixFQUFoQixFQUFvQixLQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsS0FBSyxLQUFMLENBQVcsRUFBWCxFQUFlLEtBQUssS0FBTCxDQUFXLEVBQVgsQ0FBcEUsQ0FkSztHQS9CTTtBQStDYiwwQ0FBZ0I7OztBQUNkLFNBQUssT0FBTCxHQUFlLHNCQUFZLEtBQUssS0FBTCxDQUEzQixDQURjO0FBRWQsU0FBSyxPQUFMLENBQWEsRUFBYixDQUFnQixnQkFBaEIsQ0FBaUMsT0FBakMsRUFBMEMsWUFBTTtBQUM5QyxhQUFLLFNBQUwsQ0FBZSxPQUFmLEVBRDhDO0FBRTlDLGFBQUssSUFBTCxHQUY4QztLQUFOLENBQTFDLENBRmM7R0EvQ0g7QUFzRGIsa0NBQVk7OztBQUNWLFNBQUssR0FBTCxHQUFXLGtCQUFRLEtBQUssS0FBTCxDQUFuQixDQURVO0FBRVYsU0FBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsZ0JBQTVCLEVBQThDO2FBQUssT0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLEVBQUUsTUFBRjtLQUFuQixDQUE5QyxDQUZVO0dBdERDO0FBMERiLGtDQUFZOzs7QUFDVixTQUFLLGFBQUwsR0FBcUIsWUFBWSxZQUFNO0FBQ3JDLFVBQUksQ0FBQyxPQUFLLElBQUwsRUFBVyxPQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWhCO0FBQ0EsYUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixFQUFFLE9BQUssSUFBTCxDQUF0QixDQUZxQztLQUFOLEVBRzlCLElBSGtCLENBQXJCLENBRFU7R0ExREM7QUFnRWIsd0NBQWU7OztBQUNiLFNBQUssVUFBTCxHQUFrQiwwQkFBZSxLQUFLLEtBQUwsRUFBWSxNQUEzQixDQUFsQixDQURhO0FBRWIsU0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLE9BQXZCLENBQStCLGlCQUFTO0FBQ3RDLFlBQU0sRUFBTixDQUFTLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DO2VBQU0sT0FBSyxVQUFMLENBQWdCLEtBQWhCO09BQU4sQ0FBcEMsQ0FEc0M7S0FBVCxDQUEvQixDQUZhO0dBaEVGO0FBc0ViLGtDQUFXLE9BQU87QUFDaEIsUUFBSSxNQUFNLEVBQU4sQ0FBUyxZQUFULEtBQTBCLEVBQTFCLElBQWdDLEtBQUssT0FBTCxFQUFjO0FBQ2hELFVBQU0sU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsYUFBbkIsQ0FBaUMsTUFBTSxFQUFOLENBQVMsQ0FBVCxFQUFZLENBQTdDLEVBQWdELENBQWhELENBRGlDOztBQUdoRCxVQUFJLFNBQVMsS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFZLENBQVosR0FBZ0IsS0FBSyxHQUFMLENBQVMsU0FBVCxHQUFxQixDQUFyQixJQUN6QixTQUFTLEtBQUssR0FBTCxDQUFTLEVBQVQsQ0FBWSxDQUFaLEdBQWdCLEtBQUssR0FBTCxDQUFTLFNBQVQsR0FBcUIsQ0FBckIsRUFBd0I7QUFDbkQsYUFBSyxHQUFMLENBQVMsS0FBVCxHQURtRDtBQUVuRCxhQUFLLFNBQUwsQ0FBZSxPQUFmLEVBRm1EO0FBR25ELGNBQU0sR0FBTixHQUhtRDtBQUluRCxhQUFLLFFBQUwsR0FKbUQ7T0FEckQ7S0FIRjtHQXZFVztBQW1GYixnQ0FBVztBQUNULFNBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsRUFBRSxLQUFLLFFBQUwsQ0FBdEIsQ0FEUztBQUVULFFBQUksS0FBSyxRQUFMLEtBQWtCLE9BQU8sT0FBUCxFQUFnQixLQUFLLEdBQUwsQ0FBUyxLQUFULEVBQXRDO0dBckZXO0FBdUZiLG9CQUFJLFFBQVE7OztBQUNWLFNBQUssT0FBTCxHQUFlLEtBQWYsQ0FEVTs7QUFHVixrQkFBYyxLQUFLLGFBQUwsQ0FBZCxDQUhVO0FBSVYsU0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixLQUFLLEtBQUwsQ0FBVyxFQUFYLENBQXZCLENBSlU7O0FBTVYsU0FBSyxTQUFMLENBQWUsTUFBZixFQU5VO0FBT1YsU0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixLQUFLLEtBQUwsQ0FBbkIsQ0FQVTtBQVFWLFNBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsTUFBbEIsRUFSVTs7QUFVVixTQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsTUFBZCxFQUFzQixJQUF0QixDQUEyQixZQUFNO0FBQy9CLGFBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsT0FBSyxVQUFMLENBQWdCLEVBQWhCLEVBQW9CLE9BQUssS0FBTCxDQUFXLEVBQVgsRUFBZSxPQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsT0FBSyxPQUFMLENBQWEsRUFBYixDQUF2RSxDQUQrQjtBQUUvQixhQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE9BQUssT0FBTCxDQUFhLEVBQWIsQ0FBcEIsQ0FGK0I7QUFHL0IsYUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixJQUFwQixDQUgrQjtBQUkvQixhQUFLLEdBQUwsQ0FBUyxHQUFULEdBSitCO0tBQU4sQ0FBM0IsQ0FWVTtHQXZGQzs7Ozs7Ozs7OztrQkNmQSxVQUFDLFFBQUQ7bUVBQWdDOztNQUFuQjtNQUFVO1NBQWdCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDckYsUUFBTSxRQUFRLElBQUksU0FBUyxTQUFULEVBQVosQ0FEK0U7O0FBR3JGLFFBQUksU0FBUyxPQUFULEVBQWtCLE1BQU0sYUFBTixDQUFvQixTQUFTLEtBQVQsQ0FBcEIsQ0FBdEI7QUFDQSxRQUFJLFFBQUosRUFBYyxNQUFNLGdCQUFOLENBQXVCLFVBQXZCLEVBQW1DLFFBQW5DLEVBQWQ7O0FBRUEsVUFBTSxnQkFBTixDQUF1QixVQUF2QixFQUFtQzthQUFNLFFBQVEsS0FBUjtLQUFOLENBQW5DLENBTnFGO0FBT3JGLFVBQU0sZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsTUFBaEMsRUFQcUY7O0FBU3JGLFVBQU0sWUFBTixDQUFtQixRQUFuQixFQVRxRjtHQUFyQjtDQUFuRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUuanMnO1xuaW1wb3J0IGJvdW5kcyBmcm9tICcuL2JvdW5kcy5qcyc7XG5pbXBvcnQgbG9hZCBmcm9tICcuL2xvYWQuanMnO1xuaW1wb3J0IEludHJvIGZyb20gJy4vZWxlbWVudHMvaW50cm8uanMnO1xuaW1wb3J0IExvYWRQcm9ncmVzcyBmcm9tICcuL2VsZW1lbnRzL2xvYWRfcHJvZ3Jlc3MuanMnO1xuXG5jb25zdCBhc3NldHMgPSB7XG4gIGludHJvOiBbXG4gICAgeyBpZDogJ2ludHJvMScsIHNyYzogJ2ltZy9pbnRyb18xLmpwZycgfSxcbiAgICB7IGlkOiAnaW50cm8yJywgc3JjOiAnaW1nL2ludHJvXzIuanBnJyB9LFxuICBdLFxuICBtYWluOiBbXG4gICAgeyBpZDogJ2hhdCcsIHNyYzogJ2ltZy9zb21icmVyby5wbmcnIH0sXG4gICAgeyBpZDogJ2JnJywgc3JjOiAnaW1nL2JhY2tncm91bmQucG5nJyB9LFxuICAgIHsgaWQ6ICdsaWdodCcsIHNyYzogJ2ltZy9saWdodC5wbmcnIH0sXG4gICAgeyBpZDogJ2FnYXZhJywgc3JjOiAnaW1nL2FnYXZhLnBuZycgfSxcbiAgICB7IGlkOiAncGxheUJ0bicsIHNyYzogJ2ltZy9wbGF5X2J0bi5wbmcnIH0sXG4gIF0sXG4gIHNvdW5kOiBbXG4gICAgeyBpZDogJ2NhdGNoJywgc3JjOiAnc291bmQvY2F0Y2gud2F2JyB9LFxuICAgIHsgaWQ6ICd3aW4nLCBzcmM6ICdzb3VuZC93aW4ubXAzJyB9LFxuICAgIHsgaWQ6ICdsb29zZScsIHNyYzogJ3NvdW5kL2xvb3NlLm1wMycgfSxcbiAgICB7IGlkOiAnY2xpY2snLCBzcmM6ICdzb3VuZC9jbGljay5tcDMnIH0sXG4gIF0sXG59O1xuXG5jb25zdCBhcHAgPSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5zdGFnZSA9IG5ldyBjcmVhdGVqcy5TdGFnZSgnZ2FtZS1zdGFnZScpO1xuICAgIGJvdW5kcy5pbml0KHRoaXMuc3RhZ2UuY2FudmFzKTtcblxuICAgIHRoaXMucHJvZ3Jlc3MgPSBuZXcgTG9hZFByb2dyZXNzKCk7XG4gICAgdGhpcy5wcm9ncmVzcy5hZGRUbyh0aGlzLnN0YWdlKTtcblxuICAgIGxvYWQoYXNzZXRzLmludHJvLCB7XG4gICAgICBwcm9ncmVzczogZSA9PiB0aGlzLnByb2dyZXNzLmNoYW5nZShlKSxcbiAgICB9KS50aGVuKGludHJvUXVldWUgPT4ge1xuICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICBsb2FkKGFzc2V0cy5tYWluKS50aGVuKHF1ZXVlID0+IGdhbWUuaW5pdCh7IHF1ZXVlLCBzdGFnZTogdGhpcy5zdGFnZSB9KSksXG4gICAgICAgIHRoaXMuaW5pdEludHJvKGludHJvUXVldWUpLFxuICAgICAgXSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuaW50cm8uaGlkZSgpO1xuICAgICAgICB0aGlzLmludHJvLnJlbW92ZUZyb20odGhpcy5zdGFnZSk7XG4gICAgICAgIGdhbWUuc3RhcnQoKTtcbiAgICAgICAgbG9hZChhc3NldHMuc291bmQsIHsgdHlwZTogJ3NvdW5kJyB9KS50aGVuKCgpID0+IGdhbWUuaW5pdFNvdW5kKCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFRpY2tlcigpO1xuICAgIHRoaXMuc2V0RXZlbnRzKCk7XG4gIH0sXG4gIGluaXRJbnRybyhxdWV1ZSkge1xuICAgIHRoaXMuaW50cm8gPSBuZXcgSW50cm8ocXVldWUpO1xuICAgIHRoaXMuaW50cm8uYWRkVG8odGhpcy5zdGFnZSk7XG4gICAgdGhpcy5wcm9ncmVzcy5yZW1vdmVGcm9tKHRoaXMuc3RhZ2UpO1xuICAgIHJldHVybiB0aGlzLmludHJvLnBsYXkoKTtcbiAgfSxcbiAgc2V0VGlja2VyKCkge1xuICAgIGNyZWF0ZWpzLlRpY2tlci50aW1pbmdNb2RlID0gY3JlYXRlanMuVGlja2VyLlJBRl9TWU5DSEVEO1xuICAgIGNyZWF0ZWpzLlRpY2tlci5zZXRGUFMoMjApO1xuICAgIGNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgKCkgPT4ge1xuICAgICAgYm91bmRzLnJlc2l6ZSgpO1xuICAgICAgdGhpcy5zdGFnZS51cGRhdGUoKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0RXZlbnRzKCkge1xuICAgIHRoaXMuc3RhZ2UuZW5hYmxlTW91c2VPdmVyKDIwKTtcbiAgICBjcmVhdGVqcy5Ub3VjaC5lbmFibGUodGhpcy5zdGFnZSk7XG4gIH0sXG59O1xuXG5hcHAuaW5pdCgpO1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBpbml0KGNhbnZhcykge1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMudG9SZXNpemUgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5yZXNpemVGbGFnID0gdHJ1ZTtcblxuICAgIHRoaXMuY3cgPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICB0aGlzLmNoID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5zZXQoKTtcbiAgICB0aGlzLmJpbmRSZXNpemUoKTtcbiAgfSxcbiAgc2V0KCkge1xuICAgIHRoaXMud3cgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLndoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuc2NhbGVYID0gdGhpcy53dyAvIHRoaXMuY3c7XG4gICAgdGhpcy5zY2FsZVkgPSB0aGlzLndoIC8gdGhpcy5jaDtcblxuICAgIGlmICh0aGlzLnNjYWxlWCA8IHRoaXMuc2NhbGVZKSB7XG4gICAgICB0aGlzLnNjYWxlTWluID0gdGhpcy5zY2FsZVg7XG4gICAgICB0aGlzLnNjYWxlTWF4ID0gdGhpcy5zY2FsZVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2NhbGVNaW4gPSB0aGlzLnNjYWxlWTtcbiAgICAgIHRoaXMuc2NhbGVNYXggPSB0aGlzLnNjYWxlWDtcbiAgICB9XG4gIH0sXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5yZXNpemVGbGFnKSB7XG4gICAgICB0aGlzLnNldCgpO1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnd3O1xuICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy53aDtcbiAgICAgIHRoaXMudG9SZXNpemUuZm9yRWFjaChpdGVtID0+IGl0ZW0oKSk7XG5cbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgIHRoaXMucmVzaXplRmxhZyA9IGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgYmluZFJlc2l6ZSgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZXNpemVGbGFnID0gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcbn07XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihzcHJpdGUsIGNvbmZpZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5lbCA9IG5ldyBjcmVhdGVqcy5TcHJpdGUoc3ByaXRlKTtcbiAgICB0aGlzLmJvdW5kcyA9IHRoaXMuZWwuZ2V0Qm91bmRzKCk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuZWwuZ290b0FuZFN0b3AoMCk7XG4gICAgdGhpcy5lbC5zZXQoe1xuICAgICAgeDogTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2IuY3csXG4gICAgICByZWdYOiB0aGlzLmJvdW5kcy53aWR0aCAvIDIsXG4gICAgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVsLnBsYXkoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY29uZmlnLmFnYXZhRGVsYXkpO1xuICB9XG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB0aGlzLnNldCgpKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50LmpzJztcbmltcG9ydCBBZ2F2YSBmcm9tICcuL2FnYXZhLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBFbGVtZW50IHtcbiAgY29uc3RydWN0b3IocXVldWUsIGNvbmZpZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5xdWV1ZSA9IHF1ZXVlO1xuICAgIHRoaXMuZWwgPSBuZXcgY3JlYXRlanMuQ29udGFpbmVyKCk7XG5cbiAgICB0aGlzLmNyZWF0ZUFnYXZhcyhjb25maWcpO1xuICAgIHRoaXMuc2V0KCk7XG4gICAgdGhpcy5hZGRUb1Jlc2l6ZSgpO1xuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLmVsLnNldCh7XG4gICAgICB5OiB0aGlzLmdiLndoIC0gdGhpcy5nYi5jaCAqIHRoaXMuZ2Iuc2NhbGVNaW4sXG4gICAgICB4OiB0aGlzLmdiLnd3IC8gMixcbiAgICAgIHJlZ1g6IHRoaXMuZ2IuY3cgLyAyLFxuICAgICAgc2NhbGVYOiB0aGlzLmdiLnNjYWxlTWluLFxuICAgICAgc2NhbGVZOiB0aGlzLmdiLnNjYWxlTWluLFxuICAgIH0pO1xuICB9XG4gIGNyZWF0ZUFnYXZhcyhjb25maWcpIHtcbiAgICBjb25zdCBzcHJpdGUgPSB0aGlzLmNyZWF0ZVNwcml0ZSgpO1xuICAgIHRoaXMuYWdhdmFzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5hZ2F2YU51bTsgaSsrKSB7XG4gICAgICBjb25zdCBhZ2F2YSA9IG5ldyBBZ2F2YShzcHJpdGUsIGNvbmZpZyk7XG5cbiAgICAgIHRoaXMuYWdhdmFzLnB1c2goYWdhdmEpO1xuICAgICAgYWdhdmEuYWRkVG8odGhpcy5lbCk7XG4gICAgfVxuICB9XG4gIGNyZWF0ZVNwcml0ZSgpIHtcbiAgICByZXR1cm4gbmV3IGNyZWF0ZWpzLlNwcml0ZVNoZWV0KHtcbiAgICAgIGltYWdlczogW3RoaXMucXVldWUuZ2V0UmVzdWx0KCdhZ2F2YScpXSxcbiAgICAgIGZyYW1lczogW1xuICAgICAgICBbMjkyLCAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8wMFxuICAgICAgICBbODc2LCAxMjAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8wMVxuICAgICAgICBbNTg0LCAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8wMlxuICAgICAgICBbODc2LCAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8wM1xuICAgICAgICBbMTE2OCwgMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMDRcbiAgICAgICAgWzAsIDYwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMDVcbiAgICAgICAgWzI5MiwgNjAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8wNlxuICAgICAgICBbNTg0LCA2MDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzA3XG4gICAgICAgIFs4NzYsIDYwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMDhcbiAgICAgICAgWzExNjgsIDYwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMDlcbiAgICAgICAgWzE0NjAsIDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzEwXG4gICAgICAgIFsxNDYwLCA2MDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzExXG4gICAgICAgIFsxNzUyLCAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8xMlxuICAgICAgICBbMTc1MiwgNjAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8xM1xuICAgICAgICBbMCwgMTIwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMTRcbiAgICAgICAgWzI5MiwgMTIwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMTVcbiAgICAgICAgWzU4NCwgMTIwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMTZcbiAgICAgICAgWzAsIDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzE3XG4gICAgICAgIFsxMTY4LCAxMjAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8xOFxuICAgICAgICBbMTQ2MCwgMTIwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMTlcbiAgICAgICAgWzE3NTIsIDEyMDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzIwXG4gICAgICAgIFsyMDQ0LCAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8yMVxuICAgICAgICBbMjA0NCwgNjAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8yMlxuICAgICAgICBbMjA0NCwgMTIwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMjNcbiAgICAgICAgWzIzMzYsIDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzI0XG4gICAgICAgIFsyMzM2LCA2MDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzI1XG4gICAgICAgIFsyMzM2LCAxMjAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8yNlxuICAgICAgICBbMCwgMTgwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMjdcbiAgICAgICAgWzI5MiwgMTgwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMjhcbiAgICAgICAgWzU4NCwgMTgwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMjlcbiAgICAgICAgWzg3NiwgMTgwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMzBcbiAgICAgICAgWzExNjgsIDE4MDAsIDI5MiwgNjAwXSwgLy8gYWdhdmFGYWxsXzMxXG4gICAgICAgIFsxNDYwLCAxODAwLCAyOTIsIDYwMF0sIC8vIGFnYXZhRmFsbF8zMlxuICAgICAgICBbMTc1MiwgMTgwMCwgMjkyLCA2MDBdLCAvLyBhZ2F2YUZhbGxfMzNcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHF1ZXVlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVsID0gbmV3IGNyZWF0ZWpzLkNvbnRhaW5lcigpO1xuICAgIHRoaXMuZWwuYWRkQ2hpbGQoXG4gICAgICBuZXcgY3JlYXRlanMuQml0bWFwKHF1ZXVlLmdldFJlc3VsdCgnYmcnKSksXG4gICAgICBuZXcgY3JlYXRlanMuQml0bWFwKHF1ZXVlLmdldFJlc3VsdCgnbGlnaHQnKSlcbiAgICApO1xuICAgIHRoaXMuc2V0KCk7XG4gICAgdGhpcy5hZGRUb1Jlc2l6ZSgpO1xuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLmVsLnNldCh7XG4gICAgICBzY2FsZVg6IHRoaXMuZ2Iuc2NhbGVNYXgsXG4gICAgICBzY2FsZVk6IHRoaXMuZ2Iuc2NhbGVNYXgsXG4gICAgICB5OiB0aGlzLmdiLnNjYWxlWCA+IHRoaXMuZ2Iuc2NhbGVZID8gdGhpcy5nYi5jaCAqICh0aGlzLmdiLnNjYWxlWSAtIHRoaXMuZ2Iuc2NhbGVYKSA6IDAsXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBib3VuZHMgZnJvbSAnLi4vYm91bmRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmdiID0gYm91bmRzO1xuICB9XG4gIGFkZFRvKHBhcmVudCkge1xuICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzLmVsKTtcbiAgfVxuICByZW1vdmVGcm9tKHBhcmVudCkge1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcbiAgfVxuICBhZGRUb1Jlc2l6ZSgpIHtcbiAgICB0aGlzLnJlc2l6ZSA9IHRoaXMuc2V0LmJpbmQodGhpcyk7IC8vINC30LDQstGP0LbRg9GC0YHRjyDQu9C4INGB0YHRi9C70LrQuCDQtNGA0YPQsyDQvdCwINC00YDRg9Cz0LA/XG4gICAgYm91bmRzLnRvUmVzaXplLmFkZCh0aGlzLnJlc2l6ZSk7XG4gIH1cbiAgcmVtb3ZlRnJvbVJlc2l6ZSgpIHtcbiAgICBib3VuZHMudG9SZXNpemUuZGVsZXRlKHRoaXMucmVzaXplKTtcbiAgICB0aGlzLnJlc2l6ZSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5lbCA9IG5ldyBjcmVhdGVqcy5UZXh0KCcnLCAnNTVweCBLcmVtbGluJywgJyMzMDMwMzAnKTtcbiAgICB0aGlzLnNldCgpO1xuICAgIHRoaXMuYWRkVG9SZXNpemUoKTtcbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5lbC5zZXQoe1xuICAgICAgeDogdGhpcy5nYi53dyAvIDIsXG4gICAgICB5OiB0aGlzLmdiLndoIC8gMixcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICB0ZXh0QmFzZWxpbmU6ICdtaWRkbGUnLFxuICAgIH0pO1xuICB9XG4gIHNob3cocmVzdWx0KSB7XG4gICAgY29uc3QgdGV4dCA9IHtcbiAgICAgIHdpbjogJ9CS0Ysg0LLRi9C40LPRgNCw0LvQuCcsXG4gICAgICBsb29zZTogJ9CS0YDQtdC80Y8g0LLRi9GI0LvQvicsXG4gICAgfTtcbiAgICB0aGlzLmVsLnRleHQgPSB0ZXh0W3Jlc3VsdF07XG5cbiAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5lbClcbiAgICAgIC50byh7XG4gICAgICAgIHNjYWxlWDogMixcbiAgICAgICAgc2NhbGVZOiAyLFxuICAgICAgfSwgNjUwKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBFbGVtZW50IHtcbiAgY29uc3RydWN0b3IocXVldWUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWwgPSBuZXcgY3JlYXRlanMuQml0bWFwKHF1ZXVlLmdldFJlc3VsdCgnaGF0JykpO1xuICAgIHRoaXMuYm91bmRzID0gdGhpcy5lbC5nZXRCb3VuZHMoKTtcbiAgICB0aGlzLnNldCgpO1xuICAgIHRoaXMuYWRkVG9SZXNpemUoKTtcbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5lbC5zZXQoe1xuICAgICAgeDogdGhpcy5nYi53dyAvIDIsXG4gICAgICB5OiB0aGlzLmdiLndoLFxuICAgICAgcmVnWDogdGhpcy5ib3VuZHMud2lkdGggLyAyLFxuICAgICAgcmVnWTogdGhpcy5ib3VuZHMuaGVpZ2h0LFxuICAgICAgc2NhbGVYOiB0aGlzLmdiLnNjYWxlTWluLFxuICAgICAgc2NhbGVZOiB0aGlzLmdiLnNjYWxlTWluLFxuICAgIH0pO1xuICAgIHRoaXMucmVhbFdpZHRoID0gdGhpcy5ib3VuZHMud2lkdGggKiB0aGlzLmdiLnNjYWxlTWluO1xuICB9XG4gIG1vdmUoeCkge1xuICAgIHRoaXMuZWwueCA9IHg7XG4gIH1cbiAgY2F0Y2goKSB7XG4gICAgY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuZWwsIHsgb3ZlcnJpZGU6IHRydWUgfSlcbiAgICAgIC50byh7XG4gICAgICAgIHk6IHRoaXMuZ2Iud2ggKyAzNSxcbiAgICAgICAgc2NhbGVZOiAwLjkzICogdGhpcy5nYi5zY2FsZU1pbixcbiAgICAgIH0sIDg1KVxuICAgICAgLnRvKHtcbiAgICAgICAgeTogdGhpcy5nYi53aCxcbiAgICAgICAgc2NhbGVZOiB0aGlzLmdiLnNjYWxlTWluLFxuICAgICAgfSwgODUpO1xuICB9XG4gIGhpZGUocmVzdWx0KSB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgd2luOiB7XG4gICAgICAgIHNjYWxlWTogMC44LFxuICAgICAgICB5OiB0aGlzLmdiLndoICsgdGhpcy5ib3VuZHMuaGVpZ2h0LFxuICAgICAgfSxcbiAgICAgIGxvb3NlOiB7XG4gICAgICAgIHNjYWxlWTogMC4xLFxuICAgICAgICB5OiB0aGlzLmdiLndoICsgMjUsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5lbCwgeyBvdmVycmlkZTogdHJ1ZSB9KVxuICAgICAgICAudG8ocGFyYW1zW3Jlc3VsdF0sIDUwMClcbiAgICAgICAgLndhaXQoNDAwMClcbiAgICAgICAgLmNhbGwocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHF1ZXVlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnF1ZXVlID0gcXVldWU7XG4gICAgdGhpcy5lbCA9IG5ldyBjcmVhdGVqcy5CaXRtYXAodGhpcy5xdWV1ZS5nZXRSZXN1bHQoJ2ludHJvMScpKTtcbiAgICB0aGlzLmVsLmFscGhhID0gMDtcbiAgICB0aGlzLmJvdW5kcyA9IHRoaXMuZWwuZ2V0Qm91bmRzKCk7XG4gICAgdGhpcy5zZXQoKTtcbiAgICB0aGlzLmFkZFRvUmVzaXplKCk7XG4gIH1cbiAgcGxheSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjcmVhdGVqcy5Ud2Vlbi5nZXQodGhpcy5lbClcbiAgICAgICAgLnRvKHtcbiAgICAgICAgICBhbHBoYTogMSxcbiAgICAgICAgfSwgNTAwKVxuICAgICAgICAud2FpdCg1MDAwKVxuICAgICAgICAudG8oe1xuICAgICAgICAgIGFscGhhOiAwLFxuICAgICAgICAgIGltYWdlOiB0aGlzLnF1ZXVlLmdldFJlc3VsdCgnaW50cm8yJyksXG4gICAgICAgIH0sIDUwMClcbiAgICAgICAgLnRvKHtcbiAgICAgICAgICBhbHBoYTogMSxcbiAgICAgICAgfSwgNTAwKVxuICAgICAgICAud2FpdCg0MDAwKVxuICAgICAgICAuY2FsbChyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuICBoaWRlKCkge1xuICAgIGNyZWF0ZWpzLlR3ZWVuLmdldCh0aGlzLmVsKVxuICAgICAgLnRvKHsgYWxwaGE6IDAgfSwgNTAwKTtcbiAgfVxuICBzZXQoKSB7XG4gICAgY29uc3Qgc2NhbGVYID0gdGhpcy5nYi53dyAvIHRoaXMuYm91bmRzLndpZHRoO1xuICAgIGNvbnN0IHNjYWxlWSA9IHRoaXMuZ2Iud2ggLyB0aGlzLmJvdW5kcy5oZWlnaHQ7XG4gICAgY29uc3QgbWluU2NhbGUgPSBzY2FsZVggPCBzY2FsZVkgPyBzY2FsZVggOiBzY2FsZVk7XG5cbiAgICB0aGlzLmVsLnNldCh7XG4gICAgICB4OiB0aGlzLmdiLnd3IC8gMixcbiAgICAgIHJlZ1g6IHRoaXMuYm91bmRzLndpZHRoIC8gMixcbiAgICAgIHk6IHRoaXMuZ2Iud2ggLyAyLFxuICAgICAgcmVnWTogdGhpcy5ib3VuZHMuaGVpZ2h0IC8gMixcbiAgICAgIHNjYWxlWDogbWluU2NhbGUsXG4gICAgICBzY2FsZVk6IG1pblNjYWxlLFxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWwgPSBuZXcgY3JlYXRlanMuVGV4dCgn0JfQsNCz0YDRg9C30LrQsCAwJScsICc0NXB4IEtyZW1saW4nLCAnIzAwMCcpO1xuICAgIHRoaXMuc2V0KCk7XG4gICAgdGhpcy5hZGRUb1Jlc2l6ZSgpO1xuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLmVsLnNldCh7XG4gICAgICB4OiB0aGlzLmdiLnd3IC8gMixcbiAgICAgIHk6IHRoaXMuZ2Iud2ggLyAyLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICB9KTtcbiAgfVxuICBjaGFuZ2UoZSkge1xuICAgIHRoaXMuZWwudGV4dCA9IGDQl9Cw0LPRgNGD0LfQutCwICR7TWF0aC5mbG9vcihlLmxvYWRlZCAqIDEwMCl9JWA7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHF1ZXVlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVsID0gbmV3IGNyZWF0ZWpzLkJpdG1hcChxdWV1ZS5nZXRSZXN1bHQoJ3BsYXlCdG4nKSk7XG4gICAgdGhpcy5ib3VuZHMgPSB0aGlzLmVsLmdldEJvdW5kcygpO1xuICAgIHRoaXMuZWwuY3Vyc29yID0gJ3BvaW50ZXInO1xuXG4gICAgdGhpcy5lbC5oaXRBcmVhID0gbmV3IGNyZWF0ZWpzLlNoYXBlKCk7XG4gICAgdGhpcy5lbC5oaXRBcmVhLmdyYXBoaWNzLmJlZ2luRmlsbCgnIzAwMCcpXG4gICAgICAuZHJhd1JlY3QoMCwgMCwgdGhpcy5ib3VuZHMud2lkdGgsIHRoaXMuYm91bmRzLmhlaWdodCk7XG5cbiAgICB0aGlzLnNldCgpO1xuICAgIHRoaXMuYWRkVG9SZXNpemUoKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5lbC5zZXQoe1xuICAgICAgeDogdGhpcy5nYi53dyAvIDIsXG4gICAgICB5OiB0aGlzLmdiLndoIC8gMixcbiAgICAgIHJlZ1k6IHRoaXMuYm91bmRzLmhlaWdodCAvIDIsXG4gICAgICByZWdYOiB0aGlzLmJvdW5kcy53aWR0aCAvIDIsXG4gICAgfSk7XG4gIH1cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IGNyZWF0ZWpzLlR3ZWVuLmdldCh0aGlzLmVsKVxuICAgICAgLnRvKHtcbiAgICAgICAgc2NhbGVYOiAxLjIsXG4gICAgICAgIHNjYWxlWTogMS4yLFxuICAgICAgfSwgNTUpKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4gY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuZWwpXG4gICAgICAudG8oe1xuICAgICAgICBzY2FsZVg6IDEsXG4gICAgICAgIHNjYWxlWTogMSxcbiAgICAgIH0sIDU1KSk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5lbCA9IG5ldyBjcmVhdGVqcy5UZXh0KCcnLCAnMzVweCBLcmVtbGluJywgJyMzMDMwMzAnKTtcbiAgICB0aGlzLnNldFZhbHVlKDApO1xuICAgIHRoaXMuc2V0KCk7XG4gICAgdGhpcy5hZGRUb1Jlc2l6ZSgpO1xuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLmVsLnNldCh7XG4gICAgICB4OiAxMDAsXG4gICAgICB5OiB0aGlzLmdiLndoIC0gMTAwLFxuICAgIH0pO1xuICB9XG4gIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5lbC50ZXh0ID0gYNCf0L7QudC80LDQvdC+ICR7dmFsdWV9LyR7dGhpcy5jb25maWcudG9DYXRjaH1gO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWwgPSBuZXcgY3JlYXRlanMuVGV4dCgnJywgJzM1cHggS3JlbWxpbicsICcjMzAzMDMwJyk7XG4gICAgdGhpcy5zZXQoKTtcbiAgICB0aGlzLmFkZFRvUmVzaXplKCk7XG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuZWwuc2V0KHtcbiAgICAgIHg6IHRoaXMuZ2Iud3cgLyAyLFxuICAgICAgeTogNzUsXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIH0pO1xuICB9XG4gIHRvU3RyKHRpbWUpIHtcbiAgICBsZXQgbWluID0gTWF0aC5mbG9vcih0aW1lIC8gNjApO1xuICAgIGxldCBzZWMgPSB0aW1lICUgNjA7XG5cbiAgICBpZiAobWluIDwgMTApIG1pbiA9IGAwJHttaW59YDtcbiAgICBpZiAoc2VjIDwgMTApIHNlYyA9IGAwJHtzZWN9YDtcblxuICAgIHJldHVybiBg0JLRgNC10LzRjzogJHttaW59OiR7c2VjfWA7XG4gIH1cbiAgc2V0VmFsdWUodGltZSkge1xuICAgIHRoaXMuZWwudGV4dCA9IHRoaXMudG9TdHIodGltZSk7XG4gIH1cbn1cbiIsImltcG9ydCBBZ2F2YVN0YWdlIGZyb20gJy4vZWxlbWVudHMvYWdhdmFfc3RhZ2UuanMnO1xuaW1wb3J0IFBsYXlCdG4gZnJvbSAnLi9lbGVtZW50cy9wbGF5QnRuLmpzJztcbmltcG9ydCBFbmRUZXh0IGZyb20gJy4vZWxlbWVudHMvZW5kVGV4dC5qcyc7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9lbGVtZW50cy90aW1lci5qcyc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi9lbGVtZW50cy9zY29yZS5qcyc7XG5pbXBvcnQgSGF0IGZyb20gJy4vZWxlbWVudHMvaGF0LmpzJztcbmltcG9ydCBCZyBmcm9tICcuL2VsZW1lbnRzL2JhY2tncm91bmQuanMnO1xuXG5jb25zdCBjb25maWcgPSB7XG4gIHRvQ2F0Y2g6IDQwLFxuICB0aW1lOiAyMCxcbiAgYWdhdmFOdW06IDcsXG4gIGFnYXZhRGVsYXk6IDg1MCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdCh7IHF1ZXVlLCBzdGFnZSB9KSB7XG4gICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgIHRoaXMucXVldWUgPSBxdWV1ZTtcblxuICAgIHRoaXMuYmcgPSBuZXcgQmcodGhpcy5xdWV1ZSk7XG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29yZShjb25maWcpO1xuICAgIHRoaXMuZW5kVGV4dCA9IG5ldyBFbmRUZXh0KCk7XG4gICAgdGhpcy50aW1lciA9IG5ldyBUaW1lcigpO1xuXG4gICAgdGhpcy5jcmVhdGVBZ2F2YXMoKTtcbiAgICB0aGlzLmNyZWF0ZUhhdCgpO1xuICAgIHRoaXMuY3JlYXRlUGxheUJ0bigpO1xuICB9LFxuICBzdGFydCgpIHtcbiAgICB0aGlzLmJnLmVsLmFscGhhID0gMDtcbiAgICB0aGlzLnBsYXlCdG4uZWwuYWxwaGEgPSAwO1xuXG4gICAgY3JlYXRlanMuVHdlZW4uZ2V0KHRoaXMuYmcuZWwpXG4gICAgICAudG8oeyBhbHBoYTogMSB9LCA1MDApO1xuICAgIGNyZWF0ZWpzLlR3ZWVuLmdldCh0aGlzLnBsYXlCdG4uZWwpXG4gICAgICAudG8oeyBhbHBoYTogMSB9LCA1MDApO1xuXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmJnLmVsLCB0aGlzLnBsYXlCdG4uZWwpO1xuICB9LFxuICBpbml0U291bmQoKSB7XG4gICAgdGhpcy5zb3VuZFJlYWR5ID0gdHJ1ZTtcbiAgfSxcbiAgcGxheVNvdW5kKHNvdW5kKSB7XG4gICAgaWYgKHRoaXMuc291bmRSZWFkeSkgY3JlYXRlanMuU291bmQucGxheShzb3VuZCk7XG4gIH0sXG4gIHBsYXkoKSB7XG4gICAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN0YWdlLmN1cnNvciA9ICdub25lJztcbiAgICB0aGlzLnNjb3JlVmFsID0gMDtcbiAgICB0aGlzLnRpbWUgPSBjb25maWcudGltZTtcbiAgICB0aGlzLnRpbWVyLnNldFZhbHVlKHRoaXMudGltZSk7XG4gICAgdGhpcy5pbml0VGltZXIoKTtcblxuICAgIC8vINC40L3QsNGH0LUg0LvQtdGC0Y/RgiDQstGB0LUg0YHRgNCw0LfRgyDQvdCwINGB0LvQvtGDINC00LXQstCw0LnRgdCw0YVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuYWdhdmFTdGFnZS5hZ2F2YXMuZm9yRWFjaChhZ2F2YSA9PiBhZ2F2YS5zZXQoKSk7XG4gICAgfSwgMCk7XG5cbiAgICB0aGlzLnBsYXlCdG4ucmVtb3ZlRnJvbSh0aGlzLnN0YWdlKTtcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMuYWdhdmFTdGFnZS5lbCwgdGhpcy5oYXQuZWwsIHRoaXMudGltZXIuZWwsIHRoaXMuc2NvcmUuZWwpO1xuICB9LFxuICBjcmVhdGVQbGF5QnRuKCkge1xuICAgIHRoaXMucGxheUJ0biA9IG5ldyBQbGF5QnRuKHRoaXMucXVldWUpO1xuICAgIHRoaXMucGxheUJ0bi5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMucGxheVNvdW5kKCdjbGljaycpO1xuICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfSk7XG4gIH0sXG4gIGNyZWF0ZUhhdCgpIHtcbiAgICB0aGlzLmhhdCA9IG5ldyBIYXQodGhpcy5xdWV1ZSk7XG4gICAgdGhpcy5zdGFnZS5hZGRFdmVudExpc3RlbmVyKCdzdGFnZW1vdXNlbW92ZScsIGUgPT4gdGhpcy5oYXQubW92ZShlLnN0YWdlWCkpO1xuICB9LFxuICBpbml0VGltZXIoKSB7XG4gICAgdGhpcy50aW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnRpbWUpIHRoaXMuZW5kKCdsb29zZScpO1xuICAgICAgdGhpcy50aW1lci5zZXRWYWx1ZSgtLXRoaXMudGltZSk7XG4gICAgfSwgMTAwMCk7XG4gIH0sXG4gIGNyZWF0ZUFnYXZhcygpIHtcbiAgICB0aGlzLmFnYXZhU3RhZ2UgPSBuZXcgQWdhdmFTdGFnZSh0aGlzLnF1ZXVlLCBjb25maWcpO1xuICAgIHRoaXMuYWdhdmFTdGFnZS5hZ2F2YXMuZm9yRWFjaChhZ2F2YSA9PiB7XG4gICAgICBhZ2F2YS5lbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB0aGlzLmNhdGNoQ2hlY2soYWdhdmEpKTtcbiAgICB9KTtcbiAgfSxcbiAgY2F0Y2hDaGVjayhhZ2F2YSkge1xuICAgIGlmIChhZ2F2YS5lbC5jdXJyZW50RnJhbWUgPT09IDMyICYmIHRoaXMucGxheWluZykge1xuICAgICAgY29uc3QgYWdhdmFYID0gdGhpcy5hZ2F2YVN0YWdlLmVsLmxvY2FsVG9HbG9iYWwoYWdhdmEuZWwueCwgMCkueDtcblxuICAgICAgaWYgKGFnYXZhWCA+IHRoaXMuaGF0LmVsLnggLSB0aGlzLmhhdC5yZWFsV2lkdGggLyAyICYmXG4gICAgICAgICAgYWdhdmFYIDwgdGhpcy5oYXQuZWwueCArIHRoaXMuaGF0LnJlYWxXaWR0aCAvIDIpIHtcbiAgICAgICAgdGhpcy5oYXQuY2F0Y2goKTtcbiAgICAgICAgdGhpcy5wbGF5U291bmQoJ2NhdGNoJyk7XG4gICAgICAgIGFnYXZhLnNldCgpO1xuICAgICAgICB0aGlzLmFkZFNjb3JlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBhZGRTY29yZSgpIHtcbiAgICB0aGlzLnNjb3JlLnNldFZhbHVlKCsrdGhpcy5zY29yZVZhbCk7XG4gICAgaWYgKHRoaXMuc2NvcmVWYWwgPT09IGNvbmZpZy50b0NhdGNoKSB0aGlzLmVuZCgnd2luJyk7XG4gIH0sXG4gIGVuZChyZXN1bHQpIHtcbiAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcblxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsKTtcbiAgICB0aGlzLnN0YWdlLnJlbW92ZUNoaWxkKHRoaXMudGltZXIuZWwpO1xuXG4gICAgdGhpcy5wbGF5U291bmQocmVzdWx0KTtcbiAgICB0aGlzLmVuZFRleHQuYWRkVG8odGhpcy5zdGFnZSk7XG4gICAgdGhpcy5lbmRUZXh0LnNob3cocmVzdWx0KTtcblxuICAgIHRoaXMuaGF0LmhpZGUocmVzdWx0KS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhZ2UucmVtb3ZlQ2hpbGQodGhpcy5hZ2F2YVN0YWdlLmVsLCB0aGlzLnNjb3JlLmVsLCB0aGlzLmhhdC5lbCwgdGhpcy5lbmRUZXh0LmVsKTtcbiAgICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy5wbGF5QnRuLmVsKTtcbiAgICAgIHRoaXMuc3RhZ2UuY3Vyc29yID0gbnVsbDtcbiAgICAgIHRoaXMuaGF0LnNldCgpO1xuICAgIH0pO1xuICB9LFxufTtcbiIsImV4cG9ydCBkZWZhdWx0IChtYW5pZmVzdCwgeyBwcm9ncmVzcywgdHlwZSB9ID0ge30pID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgY29uc3QgcXVldWUgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKCk7XG5cbiAgaWYgKHR5cGUgPT09ICdzb3VuZCcpIHF1ZXVlLmluc3RhbGxQbHVnaW4oY3JlYXRlanMuU291bmQpO1xuICBpZiAocHJvZ3Jlc3MpIHF1ZXVlLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgcHJvZ3Jlc3MpO1xuXG4gIHF1ZXVlLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgKCkgPT4gcmVzb2x2ZShxdWV1ZSkpO1xuICBxdWV1ZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XG5cbiAgcXVldWUubG9hZE1hbmlmZXN0KG1hbmlmZXN0KTtcbn0pO1xuIl19
