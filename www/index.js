(function (till) {
	'use strict';

	/**
	 * @type {!Object}
	 */
	till.index = {};

	/**
	 * @constructor
	 */
	till.index.Controller = function () {
		/**
		 * @type {!till.common.Service}
		 * @private
		 */
		this.service_ = new till.common.Service();

		this.run_();
	};

	/**
	 * @private
	 */
	till.index.Controller.prototype.run_ = function () {
		var qs = this.getQueryString_();
		var city = qs['city'];
		var query = qs['query'];
		this.service_.listAutos(this.handleListAutos_.bind(this), city, query);
	};

	/**
	 * @param {!Object.<string, string>} params
	 * @param {string} $0
	 * @param {string} $1
	 * @param {string} $2
	 * @param {string} $3
	 * @private
	 */
	till.index.Controller.prototype.bindParams_ = function(params, $0, $1, $2, $3) {
		params[$1] = $3;
	};

	/**
	 * @private
	 * @return {!Object.<string, string>}
	 */
	till.index.Controller.prototype.getQueryString_ = function () {
    var qs = window.location.search;
    var params = {};

		var re = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
    qs.replace(re, this.bindParams_.bind(this, params));
		return params;
	};

	/**
	 * @param {number} status
	 * @param {string} statusText
	 * @param {string} responseText
	 * @private
	 */
	till.index.Controller.prototype.handleListAutos_ = function(status, statusText, responseText) {
		var chart = document.getElementById('chart');
		var opts = {
			'drawPoints': true,
			'strokeWidth': 0.0
		};

		new Dygraph(chart, responseText, opts);
	};
}(window.till));
