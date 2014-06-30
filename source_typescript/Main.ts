/// <reference path="typings/tsd.d.ts" />

/// <reference path="Random.ts" />
/// <reference path="Device.ts" />

/// <reference path="Particle.ts" />


module Main {

	var stage: createjs.Stage;
	var container: createjs.Container
	var particle: Particle;
	var resizeTimer;
	var interval: number = Math.floor(1000 / 30 * 1);


	var createMainCanvas = ():createjs.Stage => {
		var canvasId:string = 'main-canvas';
		var s:createjs.Stage = new createjs.Stage(canvasId);
		resize(s);

		return s;
	};

	var resize = (s: createjs.Stage):void => {
		var ratio:number = Device.ratio;
		var h:number = window.innerHeight;
		var w:number = window.innerWidth;

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

	var exec = ():void => {
		stage = createMainCanvas();
		container = new createjs.Container();
		stage.addChild(container);

		particle = new Particle({
			container: container
		});


		createjs.Ticker.setFPS(24);
		createjs.Ticker.addEventListener('tick', (event:Event) => {
			stage.update();
			particle.update();
		});
	};
	
	window.addEventListener('resize', (event:Event) => {
		if (resizeTimer !== false) {
			clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(() => {
			console.log('resized');
			// do something ...
			resize(stage);
		}, interval);
	});

	window.addEventListener('load', (event:Event) => {
		exec();
	});
}
