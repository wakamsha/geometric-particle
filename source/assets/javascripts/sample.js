var RTEC = {
	canvas: null,
	stage: null,
	container: null,

	canvasID: "backVisualCanvas",
	canvasContainerID: "#backVisual",
	canvasEnabled: false,
	canvasWidth: null,
	canvasHeight: null,
	updateDisable: false,

	mousePosXRate: 0,
	scrollVelocityY: 0
}



RTEC.Main = (function(window) {
	var canvas;
	var stage;
	var container;

	var parent = RTEC;

	return {

		init: function() {
			
			try {
				document.getElementById(parent.canvasID).getContext("2d");
			} catch (e) {

				console.log("canvas not support");
				return;
			}

			
			$("body").addClass("useCanvas"); 
			$(parent.canvasContainerID).show();
			parent.canvasEnabled = true;


			
			canvas = parent.canvas = document.getElementById(RTEC.canvasID);
			this.resize();


			
			stage = parent.stage = new createjs.Stage(canvas);
			container = parent.container = new createjs.Container();
			stage.addChild(parent.container);

			createjs.Ticker.addListener(this);
			createjs.Ticker.setFPS(30);


			setTimeout(function() {
				
				parent.positionWatch.init();

				
				parent.Particle.init();
			},
			500)
		},

		resize: function() {
			if (!canvas) return;

			var width = window.innerWidth;
			var height = window.innerHeight;

			if (UA == "iOS") {
				if (isPhone5) {
					width = document.body.clientWidth;
					height = (Math.abs(window.orientation) === 90) ? 320 : 568;
				} else {
					width = document.body.clientWidth;
					height = (Math.abs(window.orientation) === 90) ? 268 : 416;
				}
			} else if (isTablet) {
				var zoomScale = width / $(document).width();
				var updateEnable = (zoomScale >= 1);
				parent.setEnabled(updateEnable);
			}

			if (!parent.updateDisable) {
				parent.canvasWidth = canvas.width = width;
				parent.canvasHeight = canvas.height = height;
			}
		},

		tick: function() {
			if (parent.updateDisable && parent.Particle.isReady()) {
				return;
			}
			parent.Particle.update();

			stage.update();
		}

	}

}(window));


RTEC.setEnabled = (function(window) {
	var parent = RTEC;

	return function(enableBool) {
		if (enableBool) {
			parent.updateDisable = false;
			$(parent.canvasContainerID).css("visibility", "visible");
			$("#"+parent.canvasID).show();
		} else {
			parent.updateDisable = true;
			$(parent.canvasContainerID).css("visibility", "hidden");
			$("#"+parent.canvasID).hide();

		}
	}

}(window));


RTEC.positionWatch = (function(window) {
	var parent = RTEC;

	var targetX  = 0;
	var targetY  = 0;

	var self = null;


	return {

		mobileSensorValue: null,


		init: function() {
			self = this;

			targetY  = (MODE_TOP) ? -1500 : 0;

			setInterval(this.update, 1000/30);

			if (isMobile || isTablet) {
				window.addEventListener("deviceorientation", function(e) {
					self.mobileSensorValue = e;
				});
			}
		},

		update: function() {
			self.updateScroll();
			(isMobile || isTablet) ? self.updateSensorGamma() : self.updateMouseX();
		},

		updateScroll: function() {
			var currentY = $(window).scrollTop();
			targetY -= (targetY - currentY) * 0.05;
			parent.scrollVelocityY = (Math.round(targetY) - currentY) * 0.02;
		},

		updateMouseX: function() {
			var currentX = (parent.stage.mouseX / parent.canvas.width - 0.5) * 2;
			targetX -= (targetX - currentX) * 0.07;
			parent.mousePosXRate = targetX;
		},

		updateSensorGamma: function() {
			if (!self.mobileSensorValue) return;

			var slope;

			if (Math.abs(window.orientation) === 90) {
				
				slope = self.mobileSensorValue.beta; 
				if (window.orientation < 0) slope *= -1;
			} else {
				
				slope = self.mobileSensorValue.gamma; 
				if (window.orientation === 180) slope *= -1;
			}

			var currentX = (slope * 2.5 | 0) / 100;
			targetX -= (targetX - currentX) * 0.25;
			parent.mousePosXRate = somyUtil.uMath.minMax(-1, targetX, 1) * 4;

		}

	}

}(window));



RTEC.Particle = (function(window) {
	var parent = RTEC;

	var canvas;
	var container;

	var nums = null;
	var symbols = [];

	var _isReady = false;


	return {

		init: function() {
			canvas = parent.canvas;
			container = parent.container;


			if      (MODE_TOP)  nums = (!isMobile) ? 70 : 2;
			else if (MODE_COMP) nums = (!isMobile) ? 30 : 1;
			else if (MODE_NEWS) nums = (!isMobile) ? 40 : 1;
			else if (MODE_SPEC) nums = (!isMobile) ? 20 : 2;
			else if (MODE_RECU) nums = (!isMobile) ? 15 : 1;
			else if (MODE_MISC) nums = (!isMobile) ? 15 : 1;


			var types = ["Square", "Circle", "Triangle", "Pentagon", "Line"]; 
			for (var i = 0; i<nums; i++) {
				var symbol;

				if (MODE_TOP) {
					var type = types[i % (types.length)];
					symbol = new RTEC.ParticleSymbol[type]();
				} else if (MODE_COMP) {
					symbol = new RTEC.ParticleSymbol.Square();
				} else if (MODE_NEWS) {
					symbol = new RTEC.ParticleSymbol.Triangle();
				} else if (MODE_SPEC) {
					symbol = new RTEC.ParticleSymbol.Line();
				} else if (MODE_RECU) {
					symbol = new RTEC.ParticleSymbol.Circle();
				} else if (MODE_MISC) {
					symbol = new RTEC.ParticleSymbol.Pentagon();
				}

				symbols.push(symbol);

				var s = symbol.shape;
				
				container.addChild(s);
			}

			if (MODE_RECU) {
				container.alpha = 0;
				createjs.Tween
					.get(container)
					.to({alpha:1}, 2000)
			}

			_isReady = true;
		},

		isReady: function() {
			return _isReady;
		},

		update: function() {
			for (var i = 0; i<nums; i++)
				symbols[i].update();
		}

	}

}(window));
RTEC.Shape = {
	getRandomColor: function() {
		return createjs.Graphics.getHSL(Random.int(360), 100, 50);
	}
}



/**
 * 四角形 シェイプ
 * @return {createjs.Shape}
 * @constructor
 */
RTEC.Shape.Square = function() {
	var parent = RTEC.Shape;
	var color, alpha, radius;

	if (MODE_TOP) {
		color = parent.getRandomColor();
		alpha = Random.number(0.05, 0.10);
		radius = Random.int(10, 150, Random.PATTERN_POW2);
	} else {
		color = createjs.Graphics.getHSL(Random.int(180, 215), 100, 50);
		alpha = Random.number(0.05, 0.15);
		radius = Random.int(5, 150, Random.PATTERN_POW2);
	}

	var shape = new createjs.Shape();
	shape.alpha = alpha;
	shape.radius = radius;

	var g = shape.graphics;
	g.beginFill(color).rect(-radius, -radius, radius*2, radius*2);

	return shape;
}



/**
 * 丸 シェイプ
 * @return {createjs.Shape}
 * @constructor
 */
RTEC.Shape.Circle = function() {
	var parent = RTEC.Shape;
	var color, alpha, radius;

	if (MODE_TOP) {
		color = parent.getRandomColor();
		alpha = Random.number(0.05, 0.1);
		radius = Random.int(10, 150, Random.PATTERN_POW2);
	} else {
		color = createjs.Graphics.getHSL(Random.int(66, 80), 100, 50);
		alpha = Random.number(0.05, 0.1);
		
		radius = Random.int(50, 160, Random.PATTERN_POW2);
	}

	var shape = new createjs.Shape();
	shape.alpha = alpha;
	shape.radius = radius;

	var g = shape.graphics;
	g.beginFill(color).drawCircle(0, 0, radius);

	return shape;
}



/**
 * ライン シェイプ
 * @return {createjs.Shape}
 * @constructor
 */
RTEC.Shape.Line = function() {
	var parent = RTEC.Shape;
	var color, alpha, radius, max, min;
	var width, height;

	if (MODE_TOP) {
		color = parent.getRandomColor();
		alpha = Random.number(0.05, 0.1);
		max = 150;
		min = 10;
		width = Random.int(min, max, Random.PATTERN_POW2);
		height = (width/max)+0.5;
	} else {
		color = createjs.Graphics.getHSL(Random.int(280, 360), 100, 50);
		alpha = Random.number(0.03, 0.09);
		max = 300;
		min = 50;
		width = Random.int(min, max, Random.PATTERN_POW2);
		height = (width/max)*20;
	}

	var shape = new createjs.Shape();
	shape.alpha = alpha;
	shape.radius = width;

	var g = shape.graphics;
	g.beginFill(color).rect(-width, -height, width*2, height*2);

	return shape;
}



/**
 * 多角形シェイブ作成
 * @param polyNums 頂点数
 * @param radius 半径
 * @param color 色
 * @param alpha 透明度
 * @return {createjs.Shape}
 * @constructor
 */
RTEC.Shape.Polygon = function(polyNums, radius, color, alpha) {
	var shape = new createjs.Shape();
	shape.alpha = alpha;
	shape.radius = radius;


	var g = shape.graphics;

	g.beginFill(color).moveTo (radius, 0);

	for (var i = 0; i<polyNums; i++) {
		var rad = i/polyNums * Math.PI * 2;
		g.lineTo(
			Math.cos(rad)*radius,
			Math.sin(rad)*radius
		)
	}

	g.endFill();

	return shape;
}


/**
 * 三角形 シェイプ
 * @return {createjs.Shape}
 * @constructor
 */
RTEC.Shape.Triangle = function() {
	var parent = RTEC.Shape;
	var color, alpha, radius;

	if (MODE_TOP) {
		color = parent.getRandomColor();
		alpha = Random.number(0.05, 0.1);
		radius = Random.int(10, 150, Random.PATTERN_POW2);
	} else {
		color = createjs.Graphics.getHSL(Random.int(50, 60), 100, 50);
		alpha = Random.number(0.1, 0.25);
		radius = Random.int(15, 50, Random.PATTERN_POW2);
	}

	return new RTEC.Shape.Polygon(3, radius, color, alpha);
}



/**
 * 五角形 シェイプ
 * @return {createjs.Shape}
 * @constructor
 */
RTEC.Shape.Pentagon = function() {
	var parent = RTEC.Shape;
	var color, alpha, radius;

	if (MODE_TOP) {
		color = parent.getRandomColor();
		alpha = Random.number(0.05, 0.1);
		radius = Random.int(10, 150, Random.PATTERN_POW2);
	} else {
		color = createjs.Graphics.getHSL(Random.int(50, 180), 25, Random.int(40, 45));
		alpha = Random.number(0.05, 0.13);
		radius = Random.int(10, 180);
	}

	return new RTEC.Shape.Polygon(5, radius, color, alpha);
}
/**
 * パーティクルシンボル
 * @type {Object}
 */
RTEC.ParticleSymbol = {
	getRandomRotation: function() {
		return Random.number(-1, 1);
	},

	getRandomVelocityX: function() {
		return Random.number(15, 70);
	},

	getRandomVelocityY: function() {
		return Random.number(-0.7, -3);
	},

	getRandomHeightY: function(shape) {
		return Random.int(-shape.radius, RTEC.canvasHeight+shape.radius);
	},

	timeTopFadein: 500,


	/**
	 * 画面内にシンボルがあるかチェック。画面外だったらfalse、画面内true
	 * @param shape
	 * @return {Boolean}
	 */
	checkPosition: function(shape) {
		if (shape.y < (-shape.radius - 5) || shape.y > (RTEC.canvasHeight + shape.radius + 5)) return false;
		return true;
	},

	topShapeReset: function(shape) {
		var width = RTEC.canvasWidth;
		var height = RTEC.canvasHeight;

		var s = shape;

		s._x = Math.random() * width;
		s.y = (s.y < 0) ? s.radius+height : -s.radius;
		s.perX = (1 + Math.random()) * height;
		s.offX = Math.random() * height;
		s.ampX = s.perX * 0.1 * (0.2 + Math.random());
		s.velX = this.getRandomVelocityX();
		s.velY = this.getRandomVelocityY();
		s.velYAccel = s.velY*-1*0.5;
		s.rotationP = this.getRandomRotation();
	},

	topShapeUpdate: function(shape) {
		var s = shape;

		s.y += s.velY;
		s.x = s._x + Math.cos((s.offX + s.y) / s.perX * Math.PI * 2) * s.ampX;
		s.y += RTEC.scrollVelocityY*s.velYAccel;
		s.x += RTEC.mousePosXRate*s.velX;
		if (s.rotationP) s.rotation += s.rotationP;
	}
}
/**
 * 四角形 シンボル
 * @type {Object}
 */
RTEC.ParticleSymbol.Square = (function(window) {

	var parent = RTEC.ParticleSymbol;


	var Class = function() {
		this.shape = null;

		p.init = (MODE_TOP) ? p.top.init : p.sub.init;
		p.reset = (MODE_TOP) ? p.top.reset : p.sub.reset;
		p.update = (MODE_TOP) ? p.top.update : p.sub.update;

		this.init();
	}


	var p = Class.prototype;

	
	p.createShape = function() {
		var _y;

		if (this.shape) {
			_y = this.shape.y;
			RTEC.container.removeChild(this.shape);
			this.shape = null;
		}

		this.shape = new RTEC.Shape.Square();
		if (_y) this.shape.y = _y;

		RTEC.container.addChild(this.shape);
	}


	
	p.top = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
			;
		},

		reset: function() {
			this.createShape();
			parent.topShapeReset(this.shape);
		},

		update: function() {
			if (!parent.checkPosition(this.shape)) this.reset();
			parent.topShapeUpdate(this.shape);
		}
	}

	
	p.sub = {
		init: function() {
			var self = this;
			setTimeout(function(){self.reset()}, Random.int(3000))
		},

		reset: function() {
			if (this.tween) createjs.Tween.removeTweens(this.shape);

			this.createShape();

			var width = RTEC.canvasWidth;
			var height = RTEC.canvasHeight;

			var s = this.shape;

			s.x = s._x = Math.random() * width;
			s.y = Math.random() * height;
			s.velX = parent.getRandomVelocityX();
			s.velY = parent.getRandomVelocityY();
			s.velYAccel = s.radius/(150/2);

			s.scaleX = s.scaleY = 0;
			s.visible = true;

			var time = Random.int(3000, 7000);

			this.tween = createjs.Tween
				.get(this.shape, {override:true})
				.to({scaleX:0, scaleY:0}, 1)
				.wait(Random.int(1000))
				.to({scaleX:1, scaleY:1}, time, createjs.Ease.quartOut)
				.wait(Random.int(1500, 4000))
				.to({scaleX:0, scaleY:0}, time, createjs.Ease.quartIn)
				.call(this.reset, [], this)
		},

		update: function() {
			var s = this.shape;
			if (s == null) return;

			if (!parent.checkPosition(s)) this.reset();

			s.y += RTEC.scrollVelocityY*s.velYAccel;
			s.x = s._x + RTEC.mousePosXRate*s.velX;
		}
	}

	return Class;

}(window));
/**
 * 丸 シンボル
 * @type {Object}
 */
RTEC.ParticleSymbol.Circle = (function(window) {

	var parent = RTEC.ParticleSymbol;


	var Class = function() {
		this.shape = null;

		p.init = (MODE_TOP) ? p.top.init : p.sub.init;
		p.reset = (MODE_TOP) ? p.top.reset : p.sub.reset;
		p.update = (MODE_TOP) ? p.top.update : p.sub.update;

		this.init();
	}


	var p = Class.prototype;

	
	p.createShape = function() {
		var _y = 0;

		if (this.shape) {
			_y = this.shape.y;
			RTEC.container.removeChild(this.shape);
			this.shape = null;
		}

		this.shape = new RTEC.Shape.Circle();
		if (_y) this.shape.y = _y;

		RTEC.container.addChild(this.shape);
	}


	
	p.top = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
		},

		reset: function() {
			this.createShape();

			parent.topShapeReset(this.shape);
			this.shape.rotationP = null;
		},

		update: function() {
			if (!parent.checkPosition(this.shape)) this.reset();
			parent.topShapeUpdate(this.shape);
		}
	}

	
	p.sub = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();

		},

		reset: function() {
			if (this.tween) createjs.Tween.removeTweens(this.shape);

			this.createShape();

			var width = RTEC.canvasWidth;
			var height = RTEC.canvasHeight;

			var s = this.shape;

			s._x = Math.random() * width;
			s.y = (s.y < 0) ? s.radius+height : -s.radius;
			s.perX = (1 + Math.random()) * height;
			s.offX = Math.random() * height;
			s.ampX = s.perX * 0.03 * (0.2 + Math.random());
			s.velX = parent.getRandomVelocityX();
			s.velY = Random.number(-0.35, -1);
			s.velYAccel = s.radius/(150/1.8);

			this.animate();
		},

		update: function() {
			var s = this.shape;
			if (s == null) return;


			if (!parent.checkPosition(this.shape)) {

				this.reset();
			}

			s.y += s.velY;
			s.x = s._x + Math.cos((s.offX + s.y) / s.perX * Math.PI * 2) * s.ampX;
			s.y += RTEC.scrollVelocityY*s.velYAccel;
			s.x += RTEC.mousePosXRate*s.velX;
		}
	}


	p.animate = function() {
		var s = this.shape;

		var maxAlpha = Random.number(0.05, 0.2)+s.alpha;
		var scale = Random.number(0.2)+1;
		var time = Random.int(3000, 6000);

		var min = {alpha:s.alpha, scaleX:0.9, scaleY:0.9};
		var max = {alpha:maxAlpha, scaleX:scale, scaleY:scale};

		this.tween = createjs.Tween
			.get(s, {override:true, loop:true})
			.to(min, 1)
			.wait(Random.int(300))
			.to(max, time, createjs.Ease.cubicInOut)
			.to(min, time, createjs.Ease.cubicInOut)
		;
		this.tween.setPosition(Random.int(time*2));
	}


	return Class;

}(window));
/**
 * ライン シンボル
 * @type {Object}
 */
RTEC.ParticleSymbol.Line = (function(window) {

	var parent = RTEC.ParticleSymbol;


	var Class = function() {
		this.shape = null;

		p.init = (MODE_TOP) ? p.top.init : p.sub.init;
		p.reset = (MODE_TOP) ? p.top.reset : p.sub.reset;
		p.update = (MODE_TOP) ? p.top.update : p.sub.update;

		this.init();
	}


	var p = Class.prototype;

	
	p.createShape = function() {
		var _y;

		if (this.shape) {
			_y = this.shape.y;
			RTEC.container.removeChild(this.shape);
			this.shape = null;
		}

		this.shape = new RTEC.Shape.Line();
		if (_y) this.shape.y = _y;

		RTEC.container.addChild(this.shape);
	}


	
	p.top = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
			;
		},

		reset: function() {
			this.createShape();
			parent.topShapeReset(this.shape);
		},

		update: function() {
			if (!parent.checkPosition(this.shape)) this.reset();
			parent.topShapeUpdate(this.shape);
		}
	}

	
	p.sub = {
		init: function() {
			this.reset();

			this.shape.x = RTEC.canvasWidth * Math.random();
		},

		reset: function() {
			if (this.tween) createjs.Tween.removeTweens(this.shape);

			this.createShape();

			var width = RTEC.canvasWidth;
			var height = RTEC.canvasHeight;

			var s = this.shape;

			s.x = width * Math.random();
			s.y = parent.getRandomHeightY(s);
			s.velX = Random.number(0.3, 1)*Random.plusMinus();
			s.velXMouse = Random.number(0.5, 2);
			s.velYAccel = s.radius/(300/2);
			s.rotation = 125;

			s._alpha = s.alpha;
			
			s.scaleX = s.scaleY = 0;

			var a = s._alpha;
			var time = Random.int(2500, 4000);

			this.tween = createjs.Tween
				.get(this.shape, {override:true})
				.to({scaleX:0, scaleY:0}, 1)
				.wait(Random.int(500))
				.to({scaleX:1, scaleY:1}, time, createjs.Ease.quartOut)
				.wait(Random.int(5000, 8000))
				.to({scaleX:0, scaleY:0}, time, createjs.Ease.quartIn)
				.call(this.reset, [], this)
		},

		update: function() {
			var s = this.shape;

			if (!parent.checkPosition(this.shape) || s.x<-s.radius || s.x>RTEC.canvasWidth+ s.radius) this.reset();

			s.x += s.velX;
			s.y += RTEC.scrollVelocityY*s.velYAccel;
			s.x += RTEC.mousePosXRate*s.velXMouse;
		}
	}

	return Class;

}(window));
/**
 * 三角形 シンボル
 * @type {Object}
 */
RTEC.ParticleSymbol.Triangle = (function(window) {

	var parent = RTEC.ParticleSymbol;


	var Class = function() {
		this.shape = null;

		p.init = (MODE_TOP) ? p.top.init : p.sub.init;
		p.reset = (MODE_TOP) ? p.top.reset : p.sub.reset;
		p.update = (MODE_TOP) ? p.top.update : p.sub.update;

		this.init();
	}


	var p = Class.prototype;

	
	p.createShape = function() {
		var _y;

		if (this.shape) {
			_y = this.shape.y;
			RTEC.container.removeChild(this.shape);
			this.shape = null;
		}

		this.shape = new RTEC.Shape.Triangle();
		if (_y) this.shape.y = _y;

		RTEC.container.addChild(this.shape);
	}


	
	p.top = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
			;
		},

		reset: function() {
			this.createShape();
			parent.topShapeReset(this.shape);
		},

		update: function() {
			if (!parent.checkPosition(this.shape)) this.reset();
			parent.topShapeUpdate(this.shape);
		}
	}

	
	p.sub = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
			;
		},

		reset: function() {
			this.createShape();

			var width = RTEC.canvasWidth;
			var height = RTEC.canvasHeight;

			var s = this.shape;

			s.x = s._x = Math.random() * width + (-width*0.2*RTEC.mousePosXRate);
			s.y = s._y = (s.y < 0) ? s.radius+height : -s.radius;
			s.velX = Random.number(15, 70);
			s.velY = Random.number(-1, -3);
			s.velYAccel = s.velY*-1 / 2;
			s.rotation = s._rotation = -90;
			s._r = s.rotation;
		},

		update: function() {
			var s = this.shape;

			if (!parent.checkPosition(this.shape)) this.reset();

			var height = RTEC.canvasHeight;

			var radius = s.velY;
			var rad = s.rotation/360 * Math.PI * 2;
			s.x += Math.cos(rad)*radius*-1;
			s.y += s.velY + RTEC.scrollVelocityY*s.velYAccel;
			var posRate = (isMobile || isTablet) ? RTEC.mousePosXRate/4 : RTEC.mousePosXRate;
			var rRate = somyUtil.uMath.minMax(0, (height- s.y)/height, 1);
			s._r += posRate * rRate;
			s._r = somyUtil.uMath.minMax(-120, s._r, -60);

			s.rotation = s._r + (posRate*30);
		}
	}

	return Class;

}(window));
/**
 * 五角形 シンボル
 * @type {Object}
 */
RTEC.ParticleSymbol.Pentagon = (function(window) {

	var parent = RTEC.ParticleSymbol;


	var Class = function() {
		this.shape = null;

		p.init = (MODE_TOP) ? p.top.init : p.sub.init;
		p.reset = (MODE_TOP) ? p.top.reset : p.sub.reset;
		p.update = (MODE_TOP) ? p.top.update : p.sub.update;

		this.init();
	}


	var p = Class.prototype;

	
	p.createShape = function() {
		var _y;

		if (this.shape) {
			_y = this.shape.y;
			RTEC.container.removeChild(this.shape);
			this.shape = null;
		}

		this.shape = new RTEC.Shape.Pentagon();
		if (_y) this.shape.y = _y;

		RTEC.container.addChild(this.shape);
	}


	
	p.top = {
		init: function() {
			this.reset();

			this.shape.y = RTEC.canvasHeight * Math.random();
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
			;
		},

		reset: function() {
			this.createShape();
			parent.topShapeReset(this.shape);
		},

		update: function() {
			if (!parent.checkPosition(this.shape)) this.reset();
			parent.topShapeUpdate(this.shape);
		}
	}

	
	p.sub = {
		init: function() {
			this.reset();

			this.shape.y = parent.getRandomHeightY(this.shape);
			this.shape.alphaEnd = this.shape.alpha;
			this.shape.alpha = 0;

			createjs.Tween
				.get(this.shape)
				.wait(Random.int(500))
				.to({alpha:this.shape.alphaEnd}, parent.timeTopFadein)
			;
		},

		reset: function() {
			this.createShape();

			var width = RTEC.canvasWidth;
			var height = RTEC.canvasHeight;

			var s = this.shape;

			s._x = Math.random() * width;
			s.y = (s.y < 0) ? s.radius+height : -s.radius;
			s.perX = (1 + Math.random()) * height;
			s.offX = Math.random() * height;
			s.ampX = s.perX * 0.1 * (0.2 + Math.random());
			s.velX = parent.getRandomVelocityX();
			s.velY = Random.number(0.5, 2);
			s.velYAccel = s.radius/(180/1.5);
			s.rotationP = Random.number(-0.5, 0.5);
		},

		update: function() {
			var s = this.shape;

			if (!parent.checkPosition(this.shape)) this.reset();

			s.y += s.velY;
			s.x = s._x + Math.cos((s.offX + s.y) / s.perX * Math.PI * 2) * s.ampX;
			s.y += -RTEC.scrollVelocityY*s.velYAccel;
			s.x += RTEC.mousePosXRate*s.velX;
			s.rotation += s.rotationP;
		}
	}

	return Class;

}(window));

window.onresize = function() {
	if (!NONVISUAL) RTEC.Main.resize();
}

window.addEventListener("load", function(e) {
	window.removeEventListener("load", arguments.callee, false);
	if (!NONVISUAL) RTEC.Main.init();
},
false);
