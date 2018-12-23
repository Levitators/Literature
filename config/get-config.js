'use strict'

const _ = require('underscore');
const dbDetails =  require('./' + (process.env.NODE_ENV || "test") + ".json");

const requiredParams = [
  'LITERATURE_LOG_PATH',
  'LITERATURE_PORT',
  'LITERATURE_MODE'
];

const envNotSet = []

for (let i = 0; i < requiredParams.length; i++) {
  if (!_.has(process.env, requiredParams[i])) {
    envNotSet.push(requiredParams[i])
  }
}

if (envNotSet.length !== 0) {
  console.log(
    'Error: environment variables have not been properly setup.',
    'The variables:',
    envNotSet,
    'was not found.'
  )
  throw new Error('Literature Environment Variables Not Properly Set')
}

module.exports = {
  appName: 'Literature',

  paths: {
    logPath: process.env.LITERATURE_LOG_PATH
  },

  port: process.env.LITERATURE_PORT,

  mode: process.env.LITERATURE_MODE,

  db : dbDetails
}