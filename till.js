'use strict';

goog.provide('till');

goog.require('goog.soy');
goog.require('till.Service');
goog.require('till.templates');

goog.scope(function() {



/**
 * @constructor
 */
var App = function() {
  /**
   * @type {!till.Service}
   * @private
   */
  this.service_ = new till.Service();

  this.run_();
};


/**
 * @private
 */
App.prototype.run_ = function() {
  document.body.appendChild(goog.soy.renderAsElement(till.templates.container));
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
App.prototype.bindParams_ = function(params, $0, $1, $2, $3) {
  params[$1] = $3;
};


/**
 * @private
 */
App.prototype.clearCharts_ = function() {
  var divs = document.querySelectorAll('div.' + goog.getCssName('chart'));
  for (var i = 0, j = divs.length; i < j; ++i) {
    divs[i].classList.add(goog.getCssName('hidden'));
  }
};


/**
 * @param {string} csv
 * @return {!Array.<!Array.<string>>}
 * @private
 */
App.prototype.csvToArray_ = function(csv) {
  var pattern = new RegExp(
      '(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\"\\,\\r\\n]*))',
      'gi');
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

    var value = null;
    if (matches[2]) {
      value = matches[2].replace(new RegExp('\"\"', 'g'), '\"');
    } else {
      value = matches[3];
    }

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
App.prototype.handleListAutos_ = function(status, statusText, responseText) {
  var charts = document.getElementsByClassName(goog.getCssName('chart'));
  for (var i = 0, j = charts.length; i < j; ++i) {
    charts[i].classList.remove(goog.getCssName('hidden'));
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
App.prototype.onSubmit_ = function(e) {
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
App.prototype.renderChart_ = function(id, csv) {
  var chart = document.getElementById(id);
  var opts = {
    'drawPoints': true,
    'strokeWidth': 0.0
  };

  new window['Dygraph'](chart, csv, opts);
};


/**
 * @param {!Array.<!Array.<string>>} rows
 * @private
 */
App.prototype.renderMileageByYearChart_ = function(rows) {
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
App.prototype.renderPriceByYearChart_ = function(rows) {
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
App.prototype.renderPriceByMileageChart_ = function(rows) {
  var csv = '';
  for (var i = 0, j = rows.length; i < j; ++i) {
    csv += rows[i][0] + ',' + rows[i][1] + '\n';
  }

  this.renderChart_('chart-price-by-mileage', csv);
};

new App();
});  // goog.scope
