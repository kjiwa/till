(function (till) {
	'use strict';

	/**
	 * @constructor
	 */
	till.common.Service = function () {
	};

	/**
	 * @param {function(number, string, string)} callback
	 */
	till.common.Service.prototype.list = function (callback) {
		callback(status, statusText, responseText);
	};
}(window.till));
