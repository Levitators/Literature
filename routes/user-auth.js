'use_strict'
const express = require('express')
const router = express.Router()
const _ = require('underscore')
const userHandler = require('../handlers/user-auth');
const literatureResponse = require('../utils/literature-response');
const errors = require('../utils/lattis-errors');
const logger = require('../utils/logger');



// for user registration
router.post('/registration', (req, res) => {
  if (!_.has(req.body, 'user_name') || !_.has(req.body, 'pic')) {
    logger('Could not register user. The user is invalid')
    literatureResponse(res, errors.missingParameter(true), null)
    return
  }

  userHandler.signUp(req.body, (error, user) => {
    if (error) {
      logger('Error: processing user:', error)
      literatureResponse(res, errors.formatErrorForWire(error), null)
      return
    }

    literatureResponse(res, errors.noError(), null)
  })
})

module.exports = router