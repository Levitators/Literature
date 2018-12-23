'use strict';

/*
 * Standardizes event responses from the server to client
 *
 * @param {Object} Express response object
 * @param {Int} Response status code
 * @param {Object} Any Error thrown that should be propagated to client
 * @param {Object, Array, Number, String} Any object that should be sent that can be serialized
 */
module.exports = function(status, error, payload) {
  let data = {
    status: status,
    error: error,
    payload: payload
  };
  return data;
};
