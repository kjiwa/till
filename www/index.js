(function (till) {
	'use strict';

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
	};
}(window.till));
