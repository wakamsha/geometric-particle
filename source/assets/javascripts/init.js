// IE Avoid console error
if (!('console' in window)) {
	window.console =
	{
		log:   function (){ return },
		trace: function (){ return },
		debug: function (){ return },
		info:  function (){ return },
		warn:  function (){ return },
		error: function (){ return }
	}
}


// userAgent
var UA =  /iPhone|iPod/.test(navigator.userAgent) ? 'iOS'
		: /iPad/.test(navigator.userAgent) ? 'iOS Tablet'
		: /Android/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent) ? 'Android'
		: /Android/.test(navigator.userAgent) ? 'Android Tablet'
		: 'PC';

var isMobile = (UA == 'iOS' || UA == 'Android') ? true : false;
var isTablet = (UA.indexOf('Tablet') > 0) ? true : false;
var isPhone5 = (UA == 'iOS' && window.screen.height==568) ? true : false;




MODE_TOP =  false;
MODE_COMP = false;
MODE_NEWS = false;
MODE_SPEC = false;
MODE_RECU = false;
MODE_MISC = false;
NONVISUAL = false;

$(function()
{
	var id = $("body").attr("id");

	switch (id)
	{
		case "top":          MODE_TOP =  true; break;
		case "company":      MODE_COMP = true; break;
		case "news":         MODE_NEWS = true; break;
		case "topics":       MODE_NEWS = true; break;
		case "specialities": MODE_SPEC = true; break;
		case "recruitment":  MODE_RECU = true; break;
		case "misc":         MODE_MISC = true; break;
		default:             NONVISUAL = true; break;
	}
});



// Random
var Random = somyUtil.Random;


// importJS
(function(window)
{
	if (typeof MODE_DEBUG === 'undefined') return;

	var dir = somyUtil.getJsDirectory("visual/init.js");
	var scripts = (typeof SCRIPTS_SRC === 'undefined') ? ['src_combine.js'] : SCRIPTS_SRC;

	somyUtil.importJS(dir, scripts);

}(window));