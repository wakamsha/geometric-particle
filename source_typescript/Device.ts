class Device {
	public static ua =   /iPhone|iPod/.test(navigator.userAgent) ? 'iOS'
						: /iPad/.test(navigator.userAgent) ? 'iOS Tablet'
						: /Android/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent) ? 'Android'
						: /Android/.test(navigator.userAgent) ? 'Android Tablet'
						: 'PC';
	

	public static isMobile = (Device.ua === 'iOS' || Device.ua === 'Android') ? true : false;
	public static isTablet = (Device.ua.indexOf('Tablet') > 0) ? true : false;
	public static isPhone4inch = (Device.ua === 'iOS' && window.screen.height === 568) ? true : false;

	public static ratio = window.devicePixelRatio;
}