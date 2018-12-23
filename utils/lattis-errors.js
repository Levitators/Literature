'use strict';

const _ = require('underscore');
const responseCodes = require('./../helpers/response-codes');


function LiteratureError(message, code, name = 'LiteratureError') {
    this.name = name;
    this.message = message || 'Default Message';
    this.code = code;
    this.stack = (new Error()).stack;
}

LiteratureError.prototype = Object.create(Error.prototype);
LiteratureError.prototype.constructor = LiteratureError;

module.exports = {
    missingParameter: function(formatForWire){
        const error = new LiteratureError(
            'There are one or more parameters missing in the supplied request',
            responseCodes.BadRequest,
            'MissingParameter'
        );
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    cardNotExist: function(formatForWire) {
        const error = new LiteratureError('Card Not Exist', responseCodes.Conflict, 'cardNotExist');
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    cardExist: function(formatForWire) {
        const error = new LiteratureError('Card Already Exist', responseCodes.Conflict, 'cardExist');
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    internalServer: function(formatForWire){
        const error = new LiteratureError(
            'Internal server error',
            responseCodes.InternalServer,
            'InternalServerError'
        );
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    resourceNotFound: function(formatForWire){
        const error = new LiteratureError('Resource Not Found', responseCodes.ResourceNotFound, 'ResourceNotFound');
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    unauthorizedAccess: function(formatForWire){
        const error = new LiteratureError(
            'Unauthorized access to resource',
            responseCodes.Unauthorized,
            'UnauthorizedAccess'
        );
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    invalidParameter: function(formatForWire){
        const error = new LiteratureError(
            'Invalid parameter in request body',
            responseCodes.BadRequest,
            'InvalidParameter'
        );
        return formatForWire ? this.formatErrorForWire(error) : error;
    },
    noError: function(){
        return null;
    },
    errorWithMessage: function(error){
        return new LiteratureError((_.has(error, 'message') ? error.message : ''));
    },
    formatErrorForWire: function(literatureError){
        return _.omit(literatureError, 'stack');
    }
};
