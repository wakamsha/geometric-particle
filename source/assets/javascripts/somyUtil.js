var somyUtil =
{

	importJS: function(dir, scripts)
	{
		for (var i=0; i<scripts.length; i++)
		{
			//var src = '<script type="text/javascript" src="' + dir + scripts[i] +'"></script>';
			var src = '<script src="' + dir + scripts[i] +'"></script>';
			document.write(src);
		}
	},


	getJsDirectory: function(jsfile)
	{
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i<scripts.length; i++)
		{
			var script = scripts[i];
			if (!script.src) continue;

			var jsfileSlash = jsfile.indexOf("/") + 1;

			var src = script.src;
			var index = src.indexOf(jsfile);

			if (index > -1)
				return src.slice(0, index + jsfileSlash);
		}
		return false;
	},

	getJsParams: function(jsfile)
	{
		var searchStr = null;
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i<scripts.length; i++)
		{
			var script = scripts[i];
			if (!script.src) continue;

			var src = script.src;
			if (src.indexOf(jsfile)>-1) {
				if (src.match(/.*?\.js\?(.*)$/)) {
					searchStr = RegExp.$1;
					break;
				}
			}
		}
		if (!searchStr) return false;

		return somyUtil.uString.parseParams(searchStr);
	}
}





/* ------------------------------------------------------------------------
**	Random
** ------------------------------------------------------------------------
*/
somyUtil.Random = (function(window) {

	// private
	// random pattern function
	var randoms = {
		normal: function(max) {
			return Math.random() * max;
		},

		pow: function(max) {
			return Math.pow(Math.random(), 2) * max;
		},

		pow2: function(max) {
			return Math.random() * Math.random() * max;
		}
	}


	return {

		PATTERN_NOMAL: "normal",
		PATTERN_POW:   "pow",
		PATTERN_POW2:  "pow2",


		int: function(min, max, pattern) {
			var _pattern = pattern || this.PATTERN_NOMAL;
			var random = randoms[_pattern];

			if (!max) return random(min + 1) | 0;
			return (random(max - min + 1) | 0) + min;
		},

		number: function(min, max, pattern) {
			var _pattern = pattern || this.PATTERN_NOMAL;
			var random = randoms[_pattern];

			if (!max) return random(min);
			return random(max - min) + min;
		},

		boolean: function() {
			return (Math.random() < 0.5) ? true : false;
		},

		plusMinus: function() {
			return this.boolean() ? 1 : -1;
		}
	}

}(window));





/* ------------------------------------------------------------------------
**	String
** ------------------------------------------------------------------------
*/
somyUtil.uString = (function(window)
{

	return {

		parseParams: function(str)
		{
			var params = new Object;
			var values = str.split("&");
			for(var i = 0; i<values.length; i++)
			{
				var keyval = values[i].split("=");
				params[keyval[0]] = decodeURIComponent(keyval[1]);
			}
			return params;
		}

	}

}(window));



/* ------------------------------------------------------------------------
**	Array
** ------------------------------------------------------------------------
*/
somyUtil.uArray = (function(window)
{

	return {

		/**
		* 二次元配列のソート
		* @param array 配列
		* @param key ソート基準キー
		* @param order 1=昇順 -1=降順
		*/
		sort2D: function(array, key, order)
		{
			var _order = order || 1;
			array.sort(function(a, b)
			{
				return ((a[key] > b[key]) ? 1 : -1) * _order;
			})
			return(array);
		}

	}

}(window));





/* ------------------------------------------------------------------------
**	Object
** ------------------------------------------------------------------------
*/
somyUtil.uObject = (function(window)
{

	return {

		toQueryString: function(keyValue)
		{
			var str = [];
			for(var key in keyValue)
				str.push(encodeURIComponent(key) + "=" + encodeURIComponent(keyValue[key]));
			return str.join("&");
		}
	}

}(window));





/* ------------------------------------------------------------------------
**	Math
** ------------------------------------------------------------------------
*/
somyUtil.uMath = (function(window)
{

	return {

		minMax: function(min, num, max)
		{
			return (min < num) ? (max > num)? num : max : min;
		}

	}

}(window));