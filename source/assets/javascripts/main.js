var Random = (function () {
    function Random() {
    }
    Random.int = function (min, max) {
        if (!max) {
            return (Math.random() * (min + 1)) >> 0;
        }
        return ((Math.random() * (max - min + 1)) >> 0) + min;
    };

    Random.num = function (min, max) {
        if (!max) {
            return Math.random() * min;
        }
        return Math.random() * (max - min) + min;
    };
    return Random;
})();
var Device = (function () {
    function Device() {
    }
    Device.ua = /iPhone|iPod/.test(navigator.userAgent) ? 'iOS' : /iPad/.test(navigator.userAgent) ? 'iOS Tablet' : /Android/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent) ? 'Android' : /Android/.test(navigator.userAgent) ? 'Android Tablet' : 'PC';

    Device.isMobile = (Device.ua === 'iOS' || Device.ua === 'Android') ? true : false;
    Device.isTablet = (Device.ua.indexOf('Tablet') > 0) ? true : false;
    Device.isPhone4inch = (Device.ua === 'iOS' && window.screen.height === 568) ? true : false;

    Device.ratio = window.devicePixelRatio;
    return Device;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Particle = (function () {
    function Particle(args) {
        this._isReady = false;
        this.container = args.container;

        this.nums = Device.isMobile ? 3 : 40;
        this.symbols = [];
        var types = ['Square', 'Line', 'Circle'];

        for (var i = 0; i < this.nums; i++) {
            var type = types[i % types.length];
            var symbol;
            switch (type) {
                case 'Square':
                    symbol = new ParticleSymbolSquare();
                    break;
                case 'Line':
                    symbol = new ParticleSymbolLine();
                    break;
                case 'Circle':
                    symbol = new ParticleSymbolCircle();
                    break;
            }
            this.symbols.push(symbol);

            this.container.addChild(symbol);
        }

        this._isReady = true;
    }
    Object.defineProperty(Particle.prototype, "isReady", {
        get: function () {
            return this._isReady;
        },
        enumerable: true,
        configurable: true
    });

    Particle.prototype.update = function () {
        for (var i = 0; i < this.nums; i++) {
            this.symbols[i].updateShape();
        }
    };
    return Particle;
})();

var ParticleSymbol = (function (_super) {
    __extends(ParticleSymbol, _super);
    function ParticleSymbol() {
        _super.call(this);
        this.height = 50;
        this.width = 50;
    }
    ParticleSymbol.prototype.checkPosition = function () {
        if ((this.y < -this.radius - 5) || this.y > (window.innerHeight * window.devicePixelRatio + this.radius + 5)) {
            return false;
        }
        return true;
    };

    ParticleSymbol.prototype.initShape = function () {
        var w = window.innerWidth * window.devicePixelRatio;
        var h = window.innerHeight * window.devicePixelRatio;

        this._x = Math.random() * w;
        this.y = (this.radius + h) * Random.num(0.5, 1);
        this.perX = (1 + Math.random()) * h;
        this.offX = Math.random() * h;
        this.ampX = this.perX * 0.1 * (0.2 + Math.random());
        this.velX = Random.num(15, 70);
        this.velY = Random.num(-1, -3);
        this.velYAccel = this.velY * -1;
        this.rotationP = Random.num(-1, 1);
    };

    ParticleSymbol.prototype.doUpdateShape = function () {
        this.y += this.velY;
        this.x = this._x + Math.cos((this.offX + this.y) / this.perX * Math.PI * 2) * this.ampX;
    };

    ParticleSymbol.prototype.createShape = function () {
        this.color = createjs.Graphics.getHSL(Random.int(360), 100, 50);
        this.alpha = 0;

        var g = this.graphics;
        g.clear();
        g.beginFill(this.color).rect(-this.width, -this.height, this.width * 2, this.height * 2);

        createjs.Tween.get(this).wait(Random.int(500)).to({ alpha: Random.num(0.05, 0.25) }, 500);
    };

    ParticleSymbol.prototype.updateShape = function () {
        console.log('updateShape');
    };
    return ParticleSymbol;
})(createjs.Shape);

var ParticleSymbolSquare = (function (_super) {
    __extends(ParticleSymbolSquare, _super);
    function ParticleSymbolSquare() {
        var _this = this;
        this.updateShape = function () {
            if (!_this.checkPosition()) {
                _this.resetShape();
            }
            _this.doUpdateShape();
        };

        this.createShape = function () {
            _this.radius = Random.int(10, 150);
            _this.width = _this.radius;
            _this.height = _this.radius;

            _super.prototype.createShape.call(_this);
        };

        _super.call(this);

        this.resetShape();

        this.y = window.innerHeight * window.devicePixelRatio * Math.random();
    }
    ParticleSymbolSquare.prototype.resetShape = function () {
        this.createShape();
        this.initShape();
    };
    return ParticleSymbolSquare;
})(ParticleSymbol);

var ParticleSymbolCircle = (function (_super) {
    __extends(ParticleSymbolCircle, _super);
    function ParticleSymbolCircle() {
        var _this = this;
        this.updateShape = function () {
            if (!_this.checkPosition()) {
                _this.resetShape();
            }
            _this.doUpdateShape();
        };

        this.createShape = function () {
            _this.radius = Random.int(10, 150);
            _this.width = _this.radius;
            _this.height = _this.radius;

            _this.color = createjs.Graphics.getHSL(Random.int(360), Random.int(200, 255), Random.int(200, 255));
            _this.alpha = 0;

            var g = _this.graphics;
            g.clear();
            g.beginFill(_this.color).drawCircle(-_this.width, -_this.height, _this.width * 2);

            createjs.Tween.get(_this).wait(Random.int(500)).to({ alpha: Random.num(0.05, 0.25) }, 500);
        };

        _super.call(this);

        this.resetShape();

        this.y = window.innerHeight * window.devicePixelRatio * Math.random();
    }
    ParticleSymbolCircle.prototype.resetShape = function () {
        this.createShape();
        this.initShape();
    };
    return ParticleSymbolCircle;
})(ParticleSymbol);

var ParticleSymbolLine = (function (_super) {
    __extends(ParticleSymbolLine, _super);
    function ParticleSymbolLine() {
        var _this = this;
        this.doUpdateShape = function () {
            _super.prototype.doUpdateShape.call(_this);
            _this.rotation += _this.rotationP;
        };

        this.updateShape = function () {
            if (!_this.checkPosition()) {
                _this.resetShape();
            }
            _this.doUpdateShape();
        };

        this.createShape = function () {
            _this.width = Random.int(10, 250);
            _this.height = _this.width / 150 + 0.5;
            _this.radius = _this.width;

            _super.prototype.createShape.call(_this);
        };

        _super.call(this);

        this.resetShape();

        this.y = window.innerHeight * window.devicePixelRatio * Math.random();
    }
    ParticleSymbolLine.prototype.resetShape = function () {
        this.createShape();
        this.initShape();
    };
    return ParticleSymbolLine;
})(ParticleSymbol);
var Main;
(function (Main) {
    var stage;
    var container;
    var particle;
    var resizeTimer;
    var interval = Math.floor(1000 / 30 * 1);

    var createMainCanvas = function () {
        var canvasId = 'main-canvas';
        var s = new createjs.Stage(canvasId);
        resize(s);

        return s;
    };

    var resize = function (s) {
        var ratio = Device.ratio;
        var h = window.innerHeight;
        var w = window.innerWidth;

        if (Device.ua === "iOS") {
            if (Device.isPhone4inch) {
                h = (window.innerHeight > window.innerWidth) ? 568 : 320;
            } else {
                h = (window.innerHeight > window.innerWidth) ? 416 : 268;
            }
        }

        var canvas = s.canvas;
        canvas.height = h * ratio;
        canvas.width = w * ratio;
        canvas.style.height = h + 'px';
        canvas.style.width = w + 'px';
    };

    var exec = function () {
        stage = createMainCanvas();
        container = new createjs.Container();
        stage.addChild(container);

        particle = new Particle({
            container: container
        });

        createjs.Ticker.setFPS(24);
        createjs.Ticker.addEventListener('tick', function (event) {
            stage.update();
            particle.update();
        });
    };

    window.addEventListener('resize', function (event) {
        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function () {
            console.log('resized');

            resize(stage);
        }, interval);
    });

    window.addEventListener('load', function (event) {
        exec();
    });
})(Main || (Main = {}));
