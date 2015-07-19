'use strict';

goog.provide('till.Service');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.string.format');
goog.require('till.model.Automobile');
goog.require('till.model.City');

goog.scope(function() {



/**
 * @constructor
 */
till.Service = function() {
};

var Service = till.Service;


/**
 * @param {function(!Array.<!till.model.City>)} success
 * @param {function(goog.events.Event)} error
 */
Service.prototype.getCities = function(success, error) {
  var xhr = new goog.net.XhrIo();
  goog.events.listen(
      xhr, goog.net.EventType.SUCCESS,
      goog.bind(this.handleGetCitiesSuccess_, this, success, error));
  xhr.send('/cities', 'GET');
};


/**
 * @param {string} city
 * @param {string} query
 * @param {function(!Array.<!till.model.Automobile>)} success
 * @param {function(goog.events.Event)} error
 */
Service.prototype.getAutomobiles = function(city, query, success, error) {
  var xhr = new goog.net.XhrIo();
  goog.events.listen(
      xhr, goog.net.EventType.SUCCESS,
      goog.bind(this.handleGetAutomobilesSuccess_, this, success, error));

  var url = goog.string.format(
      '/automobiles/%s/%s', goog.string.urlEncode(city),
      goog.string.urlEncode(query));
  xhr.send(url, 'GET');
};


/**
 * @param {function(goog.events.Event)} error
 * @param {goog.events.Event} e
 * @private
 */
Service.prototype.handleError_ = function(error, e) {
  error(e);
};


/**
 * @param {function(!Array.<!till.model.City>)} success
 * @param {function(goog.events.Event)} error
 * @param {goog.events.Event} e
 * @private
 */
Service.prototype.handleGetCitiesSuccess_ = function(success, error, e) {
  var result = goog.object.get(e.target.getResponseJson(), 'cities', []);
  if (!goog.isArray(result)) {
    error(e);
    return;
  }

  success(goog.array.map(result, function(entry) {
    return /** @type {!till.model.City} */ ({
      city_id: entry['city_id'],
      name: entry['name']
    });
  }));
};


/**
 * @param {function(!Array.<!till.model.Automobile>)} success
 * @param {function(goog.events.Event)} error
 * @param {goog.events.Event} e
 * @private
 */
Service.prototype.handleGetAutomobilesSuccess_ = function(success, error, e) {
  var result = goog.object.get(e.target.getResponseJson(), 'automobiles', []);
  if (!goog.isArray(result)) {
    error(e);
    return;
  }

  success(goog.array.map(result, function(entry) {
    return /** @type {!till.model.Automobile} */ ({
      mileage: entry['mileage'],
      price: entry['price'],
      year: entry['year']
    });
  }));
};
});  // goog.scope
