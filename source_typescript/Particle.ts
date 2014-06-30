
interface IParticleSymbol {
	updateShape():void;

}



class Particle {
	private container: createjs.Container;
	private symbols: IParticleSymbol[]
	private nums: number;
	private _isReady: boolean = false;

	constructor(args) {
		this.container = args.container;

		this.nums = Device.isMobile ? 3 : 40;
		this.symbols = [];
		var types: string[] = ['Square', 'Line', 'Circle'];

		for (var i=0; i<this.nums; i++) {
			var type = types[i % types.length];
			var symbol: ParticleSymbol;
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

	get isReady():boolean {
		return this._isReady;
	}

	update() {
		for (var i=0; i<this.nums; i++) {
			this.symbols[i].updateShape();
		}
	}
}

/**
 * シンボル親クラス
 */
class ParticleSymbol extends createjs.Shape implements IParticleSymbol {

	_x:         number;
	perX:       number;
	offX:       number;
	ampX:       number;
	velX:       number;
	velY:       number;
	velYAccel:  number;
	rotationP:  number;
	radius:     number;
	color:      string;
	alpha:      number;
	height:     number = 50;
	width:      number = 50;


	constructor() {
		super();
	}

	public checkPosition():boolean {
		if ((this.y < -this.radius - 5) || this.y > (window.innerHeight * window.devicePixelRatio + this.radius + 5)) {
			return false;
		}
		return true;
	}

	public initShape():void {
		var w: number = window.innerWidth * window.devicePixelRatio;
		var h: number = window.innerHeight * window.devicePixelRatio;

		this._x = Math.random() * w;
		this.y = (this.radius + h) * Random.num(0.5, 1);
		this.perX = (1 + Math.random()) * h;
		this.offX = Math.random() * h;
		this.ampX = this.perX * 0.1 * (0.2 + Math.random());
		this.velX = Random.num(15, 70);
		this.velY = Random.num(-1, -3);
		this.velYAccel = this.velY * -1;
		this.rotationP = Random.num(-1, 1);
	}

	public doUpdateShape():void {
		this.y += this.velY;
		this.x = this._x + Math.cos((this.offX + this.y) / this.perX * Math.PI * 2) * this.ampX;
	}

	public createShape():void {
		this.color = createjs.Graphics.getHSL(Random.int(360), 100, 50);
		this.alpha = 0;

		var g = this.graphics;
		g.clear();
		g.beginFill(this.color).rect(-this.width, -this.height, this.width*2, this.height*2);

		createjs.Tween.get(this).wait(Random.int(500)).to({alpha: Random.num(0.05,0.25)}, 500);
	}

	public updateShape():void {
		console.log('updateShape');
	}
}


/**
 * 矩形シンボル
 */
class ParticleSymbolSquare extends ParticleSymbol {

	constructor() {
		this.updateShape = ()=> {
			if (!this.checkPosition()) {
				this.resetShape();
			}
			this.doUpdateShape();
		};

		this.createShape = () => {
			this.radius = Random.int(10, 150);
			this.width = this.radius;
			this.height = this.radius;

			super.createShape();
		};

		super();

		this.resetShape();

		this.y = window.innerHeight * window.devicePixelRatio * Math.random();
	}

	private resetShape():void {
		this.createShape();
		this.initShape();
	}
}

/**
 * 円形シンボル
 */
class ParticleSymbolCircle extends ParticleSymbol {

	constructor() {
		this.updateShape = ()=> {
			if (!this.checkPosition()) {
				this.resetShape();
			}
			this.doUpdateShape();
		};

		this.createShape = () => {
			this.radius = Random.int(10, 150);
			this.width = this.radius;
			this.height = this.radius;

			this.color = createjs.Graphics.getHSL(Random.int(360), Random.int(200,255), Random.int(200,255));
			this.alpha = 0;

			var g = this.graphics;
			g.clear();
			g.beginFill(this.color).drawCircle(-this.width, -this.height, this.width*2);

			createjs.Tween.get(this).wait(Random.int(500)).to({alpha: Random.num(0.05,0.25)}, 500);
		};

		super();

		this.resetShape();

		this.y = window.innerHeight * window.devicePixelRatio * Math.random();
	}

	private resetShape():void {
		this.createShape();
		this.initShape();
	}
}

/**
 * ラインシンボル
 */
class ParticleSymbolLine extends ParticleSymbol {

	constructor() {
		this.doUpdateShape = ()=> {
			super.doUpdateShape();
			this.rotation += this.rotationP;
		};

		this.updateShape = ()=> {
			if (!this.checkPosition()) {
				this.resetShape();
			}
			this.doUpdateShape();
		};
		
		this.createShape = () => {
			this.width = Random.int(10, 250);
			this.height = this.width / 150 + 0.5;
			this.radius = this.width;

			super.createShape();
		};

		super();

		this.resetShape();

		this.y = window.innerHeight * window.devicePixelRatio * Math.random();
	}

	private resetShape():void {
		this.createShape();
		this.initShape();
	}
}