'use strict';

/*
 * Standardizes json responses from the server to client
 *
 * @param {Object} Express response object
 * @param {Int} Response status code
 * @param {Object} Any Error thrown that should be propagated to client
 * @param {Object, Array, Number, String} Any object that should be sent that can be serialized
 */
module.exports = function(res, status, error, payload) {
    res.status(status).send(JSON.stringify({
        error: error,
        payload: payload,
        status: status
    }));
};
