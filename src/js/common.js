goog.scope(function () {
	'use strict';

	goog.provide('till.common.Service');

	/**
	 * @constructor
	 */
	till.common.Service = function () {
	};

	/**
	 * @param {function(number, string, string)} callback
	 * @param {string} city
	 * @param {query} query
	 */
	till.common.Service.prototype.listAutos = function (callback, city, query) {
		var url = '/_/list-autos?city=' + encodeURIComponent(city) + '&query=' + encodeURIComponent(query);
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = this.handleXmlHttpReadyStateChange_.bind(this, xhr, callback);
		xhr.open('GET', url, true);
		xhr.send();
	};

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {function(number, string, string)} callback
	 */
	till.common.Service.prototype.handleXmlHttpReadyStateChange_ = function(xhr, callback) {
		if (xhr.readyState == 4) {
			callback(xhr.status, xhr.statusText, xhr.responseText);
		}
	};
});
