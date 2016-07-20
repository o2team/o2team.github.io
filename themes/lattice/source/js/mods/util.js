var Util = {
	debounce: function (func, wait, immediate) {
		var timeout;
		wait = wait || 100;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},

	getParam: function(key) {
		var url = window.location.href;
		key = key.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)", "i"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

};