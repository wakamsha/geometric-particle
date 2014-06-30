class Random {

	static int(min: number, max?: number):number {
		if (!max) {
			return (Math.random() * (min + 1)) >> 0;
		}
		return ((Math.random() * (max - min + 1)) >> 0) + min;
	}

	static num(min: number, max?: number):number {
		if (!max) {
			return Math.random() * min;
		}
		return Math.random() * (max - min) + min;
	}
}