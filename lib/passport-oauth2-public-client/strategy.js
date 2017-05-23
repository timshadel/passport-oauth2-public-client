/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util');


/**
 * `PublicClientStrategy` constructor.
 *
 * @api protected
 */
function Strategy(options, verifyPublic) {
  if (typeof options == 'function') {
    verifyPublic = options;
    options = {};
  }
  if (!verifyPublic) throw new Error('OAuth 2.0 public client strategy requires a verifyPublic function');

  passport.Strategy.call(this);
  this.name = 'oauth2-public-client';
  this._verifyPublic = verifyPublic;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on client credentials in the request body.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req) {
  if (!req.body || !req.body['client_id']) {
    return this.fail('Missing client_id');
  }

  var clientId = req.body['client_id'];

  var self = this;

  function verified(err, client, info) {
    if (err) { return self.error(err); }
    if (!client) { return self.fail('Invalid client_id'); }
    self.success(client, info);
  }

  if (self._passReqToCallback) {
    this._verifyPublic(req, clientId, verified);
  } else {
    this._verifyPublic(clientId, verified);
  }
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
