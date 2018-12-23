'use strict'
const responseCodes = require('../helpers/response-codes');
const jsonResponse = require('./json-response');

module.exports = function (res, error, payload) {
  let status
  if (error) {
    status = error.code || responseCodes.BadRequest;
  } else {
    status = responseCodes.OK;
  }

  jsonResponse(res, status, error, payload)
}
