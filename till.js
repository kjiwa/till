'use strict';

goog.provide('till');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Select');
goog.require('till.Service');
goog.require('till.model.Automobile');
goog.require('till.templates');

goog.scope(function() {



/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
var App = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  /**
   * @private {!till.Service}
   */
  this.service_ = new till.Service();

  /**
   * @private {!goog.ui.Select}
   */
  this.citySelect_ = new goog.ui.Select(
      'Select a city', undefined, undefined, opt_domHelper);
  this.addChild(this.citySelect_);

  /**
   * @private {!Element}
   */
  this.queryInput_ = this.dom_.createDom(goog.dom.TagName.INPUT);

  /**
   * @private {!goog.ui.Button}
   */
  this.queryButton_ = new goog.ui.Button('Query', undefined, this.dom_);
  this.addChild(this.queryButton_);
};
goog.inherits(App, goog.ui.Component);


/**
 * @override
 */
App.prototype.createDom = function() {
  this.decorateInternal(goog.soy.renderAsElement(till.templates.container));
};


/**
 * @override
 */
App.prototype.enterDocument = function() {
  App.superClass_.enterDocument.call(this);

  this.renderCitySelect_();
  this.renderQueryInput_();
  this.renderQueryButton_();
  this.bindEvents_();

  this.service_.getCities(
      goog.bind(this.handleGetCities_, this),
      goog.bind(this.handleError_, this));
};


/**
 * @private
 */
App.prototype.renderCitySelect_ = function() {
  var element = this.dom_.getElementByClass(
      goog.getCssName('till-form'), this.getElement());
  this.citySelect_.render(element);
};


/**
 * @private
 */
App.prototype.renderQueryInput_ = function() {
  var attributes = {
    'placeholder': 'Enter a search query',
    'type': 'text'
  };

  this.dom_.setProperties(this.queryInput_, attributes);

  var element = this.dom_.getElementByClass(
      goog.getCssName('till-form'), this.getElement());
  this.dom_.appendChild(element, this.queryInput_);
};


/**
 * @private
 */
App.prototype.renderQueryButton_ = function() {
  var element = this.dom_.getElementByClass(
      goog.getCssName('till-form'), this.getElement());
  this.queryButton_.render(element);
};


/**
 * @private
 */
App.prototype.bindEvents_ = function() {
  this.getHandler().listen(
      this.queryInput_, goog.events.EventType.KEYPRESS,
      this.handleQueryInputKeyPress_);

  this.getHandler().listen(
      this.queryButton_, goog.ui.Component.EventType.ACTION,
      this.handleQueryButtonAction_);
};


/**
 * @param {goog.events.KeyEvent} e
 * @private
 */
App.prototype.handleQueryInputKeyPress_ = function(e) {
  if (this.citySelect_.getSelectedItem() && e.keyCode == 13) {
    this.submitQuery_();
  }
};


/**
 * @param {goog.events.Event} e
 * @private
 */
App.prototype.handleQueryButtonAction_ = function(e) {
  this.submitQuery_();
};


/**
 * @private
 */
App.prototype.submitQuery_ = function() {
  var city = this.citySelect_.getSelectedItem();
  var query = this.queryInput_.value;
  if (!city || !query) {
    return;
  }

  city = city.getCaption();
  this.service_.getAutomobiles(
      city, query, goog.bind(this.handleGetAutomobiles_, this),
      goog.bind(this.handleError_, this));
};


/**
 * @param {goog.events.Event} e
 * @private
 */
App.prototype.handleError_ = function(e) {
  window.console.log(e);
};


/**
 * @param {!Array.<!till.model.Automobile>} automobiles
 * @private
 */
App.prototype.handleGetAutomobiles_ = function(automobiles) {
  var container = this.dom_.getElementByClass(
      goog.getCssName('till-results'), this.getElement());
  if (!container) {
    return;
  }

  this.dom_.removeChildren(container);
  this.renderPriceByYearChart_(container, automobiles);
  this.renderPriceByMileageChart_(container, automobiles);
  this.renderMileageByYearChart_(container, automobiles);
};


/**
 * @param {!Array.<string>} cities
 * @private
 */
App.prototype.handleGetCities_ = function(cities) {
  goog.array.forEach(cities, function(city) {
    this.citySelect_.addItem(
        new goog.ui.MenuItem(city, undefined, this.dom_));
  }, this);
};


/**
 * @param {!Element} container
 * @param {!Array.<!till.model.Automobile>} automobiles
 * @private
 */
App.prototype.renderPriceByYearChart_ = function(container, automobiles) {
  this.renderChart_(
      container, 'Price by Year', automobiles, ['Year', 'Price'],
      function(automobile) {
        return automobile.year + ',' + automobile.price;
      });
};


/**
 * @param {!Element} container
 * @param {!Array.<!till.model.Automobile>} automobiles
 * @private
 */
App.prototype.renderPriceByMileageChart_ = function(container, automobiles) {
  this.renderChart_(
      container, 'Price by Mileage', automobiles, ['Mileage', 'Price'],
      function(automobile) {
        return automobile.mileage + ',' + automobile.price;
      });
};


/**
 * @param {!Element} container
 * @param {!Array.<!till.model.Automobile>} automobiles
 * @private
 */
App.prototype.renderMileageByYearChart_ = function(container, automobiles) {
  this.renderChart_(
      container, 'Mileage by Year', automobiles, ['Year', 'Mileage'],
      function(automobile) {
        return automobile.year + ',' + automobile.mileage;
      });
};


/**
 * @param {!Element} container
 * @param {string} title
 * @param {!Array.<!till.model.Automobile>} automobiles
 * @param {!Array.<string>} header
 * @param {function(!till.model.Automobile): string} mapFn
 * @private
 */
App.prototype.renderChart_ = function(
    container, title, automobiles, header, mapFn) {
  var rows = goog.array.map(automobiles, mapFn);
  rows.sort(function(a, b) { return a.split(',')[0] - b.split(',')[0]; });

  var element = /** @type {!HTMLDivElement} */ (
      this.dom_.createDom(goog.dom.TagName.DIV));
  this.dom_.appendChild(container, element);

  var attrs = {
    'drawPoints': true,
    'strokeWidth': 0.0,
    'title': title
  };

  new Dygraph(element, [header.join(',')].concat(rows).join('\n'), attrs);
  goog.dom.classlist.add(element, goog.getCssName('till-results-chart'));
};

new App().render();
});  // goog.scope
