# passport-oauth2-public-client

OAuth 2.0 public client authentication strategy for [Passport](https://github.com/jaredhanson/passport).

This module lets you identify requests containing a client_id in the
request body, as [defined](http://tools.ietf.org/html/rfc6749#section-4.1.3)
by the OAuth 2.0 specification.  This approach is typically used as an
alternative when HTTP Basic authentication because the client was not
issued any credentials on registration (most likely because it is in a
category of clients that are not able to reliably keep their secrets).

## Install

    $ npm install passport-oauth2-public-client

## Usage

#### Configure Strategy

The OAuth 2.0 public client "authentication" strategy identifies clients
using only a claimed client ID.  The strategy requires a `verifyPublic` callback,
which accepts that ID and calls `done` providing a client.

    passport.use(new PublicClientStrategy(
      function(clientId, done) {
        Clients.findOne({ clientId: clientId }, function (err, client) {
          if (err) { return done(err); }
          if (!client) { return done(null, false); }
          // Client was issued credentials, and must authenticate with them
          if (client.clientSecret) { return done(null, false); }
          return done(null, client);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'oauth2-public-client'`
strategy, to "authenticate" requests.  This strategy is typically used in
combination with HTTP Basic authentication (as provided by [passport-http][http])
and OAuth2 Client Password (as provided by [passport-oauth2-client-password][pass]),
allowing clients without credentials to exchange authorization codes for access tokens.

[http]: https://github.com/jaredhanson/passport-http
[pass]: https://github.com/jaredhanson/passport-oauth2-client-password

For example, as route middleware in an [Express](http://expressjs.com/)
application, using [OAuth2orize](https://github.com/jaredhanson/oauth2orize)
middleware to implement the token endpoint:

    app.post('/oauth/token', 
      passport.authenticate(['basic', 'oauth2-client-password', 'oauth2-public-client'], { session: false }),
      oauth2orize.token());

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/timshadel/passport-oauth2-public-client.png)](http://travis-ci.org/timshadel/passport-oauth2-public-client)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson) (client password implementation)
  - [Tim Shadel](http://github.com/timshadel)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
Copyright (c) 2013 Tim Shadel <[http://timshadel.com/](http://timshadel.com/)>
