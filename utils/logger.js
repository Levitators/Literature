'use strict';

const _ = require('underscore');
const moment = require('moment');
const config = require('../config/get-config.js');
const fs = require('fs');


module.exports = function() {
  let message = moment.utc().format() + ' :: ';
  for (let i=0; i < arguments.length; i++) {
    let argument = arguments[i];
    if (typeof argument === 'string' || argument instanceof String) {
      message += argument;
    } else {
      message += JSON.stringify(argument);
    }

    if (i !== arguments.length - 1) {
      message += ' ';
    }
  }

  console.log(message);
  if (_.has(config, 'paths') && _.has(config.paths, 'logPath') && config.paths.logPath) {
    message += '\n';
    fs.appendFile(config.paths.logPath, message, function(error) {
      if (error) {
        console.log('Error: failed to write to log at:', config.paths.logPath);
      }
    });
  }
};
