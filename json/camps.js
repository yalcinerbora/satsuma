const express = require('express');
const router = express.Router();

// Auth Funcs
const authAnyUser = require('../authentication').authAnyUser;
const authAnyUserId = require('../authentication').authAnyUserId;
const authElevatedUser = require('../authentication').authElevatedUser;
const authAdminUser = require('../authentication').authAdminUser;

module.exports = router;