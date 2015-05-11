'use strict';

goog.provide('till.Service');

goog.require('goog.string');

goog.scope(function() {



/**
 * @constructor
 */
till.Service = function() {
};

var Service = till.Service;


/**
 * @param {function(number, string, string)} callback
 * @param {string} city
 * @param {string} query
 */
Service.prototype.listAutos = function(callback, city, query) {
  var url = goog.string.buildString(
      '/_/list-autos?city=',
      encodeURIComponent(city),
      '&query=',
      encodeURIComponent(query));
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = this.handleXmlHttpReadyStateChange_.bind(
      this, xhr, callback);
  xhr.open('GET', url, true);
  xhr.send();
};


/**
 * @param {XMLHttpRequest} xhr
 * @param {function(number, string, string)} callback
 * @private
 */
Service.prototype.handleXmlHttpReadyStateChange_ = function(xhr, callback) {
  if (xhr.readyState == 4) {
    callback(xhr.status, xhr.statusText, xhr.responseText);
  }
};
});  // goog.scope
