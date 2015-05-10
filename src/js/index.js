'use strict';

goog.provide('till.index.Controller');

goog.require('till.common.Service');

goog.scope(function () {
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
  var form = document.querySelector('form');
  form.addEventListener('submit', this.onSubmit_.bind(this));
};

/**
 * @param {!Object.<string, string>} params
 * @param {string} $0
 * @param {string} $1
 * @param {string} $2
 * @param {string} $3
 * @private
 */
till.index.Controller.prototype.bindParams_ = function (params, $0, $1, $2, $3) {
  params[$1] = $3;
};

/**
 * @private
 */
till.index.Controller.prototype.clearCharts_ = function () {
  var divs = document.querySelectorAll('div.chart');
  for (var i = 0, j = divs.length; i < j; ++i) {
    divs[i].classList.add('hidden');
  }
};

/**
 * @param {string} csv
 * @return {!Array.<!Array.<string>>}
 * @private
 */
till.index.Controller.prototype.csvToArray_ = function (csv) {
  var pattern = new RegExp(('(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\"\\,\\r\\n]*))'), 'gi');
  var result = [[]];
  var matches = null;
  while (true) {
    matches = pattern.exec(csv);
    if (!matches) {
      break;
    }

    var match = matches[1];
    if (match.length && match != ',') {
      result.push([]);
    }

    var value = matches[2] ? matches[2].replace(new RegExp('\"\"', 'g'), '\"') : matches[3];
    result[result.length - 1].push(value);
  }

  return result;
};

/**
 * @param {number} status
 * @param {string} statusText
 * @param {string} responseText
 * @private
 */
till.index.Controller.prototype.handleListAutos_ = function (status, statusText, responseText) {
  var charts = document.getElementsByClassName('chart');
  for (var i = 0, j = charts.length; i < j; ++i) {
    charts[i].classList.remove('hidden');
  }

  var rows = this.csvToArray_(responseText);
  this.renderPriceByYearChart_(rows);
  this.renderPriceByMileageChart_(rows);
  this.renderMileageByYearChart_(rows);
};

/**
 * @param {Event} e
 * @private
 */
till.index.Controller.prototype.onSubmit_ = function (e) {
  e.preventDefault();
  this.clearCharts_();

  var city = e.target.querySelector('[name=city]').value;
  var query = e.target.querySelector('[name=query]').value;
  this.service_.listAutos(this.handleListAutos_.bind(this), city, query);
};

/**
 * @param {string} id
 * @param {string} csv
 * @private
 */
till.index.Controller.prototype.renderChart_ = function (id, csv) {
  var chart = document.getElementById(id);
  var opts = {
    'drawPoints': true,
    'strokeWidth': 0.0
  };

  new window.Dygraph(chart, csv, opts);
};

/**
 * @param {!Array.<!Array.<string>>} rows
 * @private
 */
till.index.Controller.prototype.renderMileageByYearChart_ = function (rows) {
  var csv = '';
  for (var i = 0, j = rows.length; i < j; ++i) {
    csv += rows[i][2] + ',' + rows[i][0] + '\n';
  }

  this.renderChart_('chart-mileage-by-year', csv);
};

/**
 * @param {!Array.<!Array.<string>>} rows
 * @private
 */
till.index.Controller.prototype.renderPriceByYearChart_ = function (rows) {
  var csv = '';
  for (var i = 0, j = rows.length; i < j; ++i) {
    csv += rows[i][2] + ',' + rows[i][1] + '\n';
  }

  this.renderChart_('chart-price-by-year', csv);
};

/**
 * @param {!Array.<!Array.<string>>} rows
 * @private
 */
till.index.Controller.prototype.renderPriceByMileageChart_ = function (rows) {
  var csv = '';
  for (var i = 0, j = rows.length; i < j; ++i) {
    csv += rows[i][0] + ',' + rows[i][1] + '\n';
  }

  this.renderChart_('chart-price-by-mileage', csv);
};

new till.index.Controller();
});
