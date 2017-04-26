'use strict';

const Server = require('./lib/server');
const fs = require('fs');
const path = require('path');

module.exports = function() {
  const server = new Server('http://localhost:55551/');

  describe('adduser', function() {
    const user = String(Math.random());
    const pass = String(Math.random());
    before(function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/user .* created/);
    });

    it('creating new user', function() {});

    it('should log in', function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/you are authenticated as/);
    });

    it('should not register more users', function() {
      return server.auth(String(Math.random()), String(Math.random()))
               .status(409)
               .body_error(/maximum amount of users reached/);
    });
  });

  describe('adduser created with htpasswd', function() {
    let user = 'preexisting';
    let pass = 'preexisting';
    before(function() {
      return fs.appendFileSync(
        path.join(__dirname, 'test-storage', '.htpasswd'),
        'preexisting:$apr1$4YSboUa9$yVKjE7.PxIOuK3M4D7VjX.'
      );
    });
    it('should log in', function() {
      return server.auth(user, pass)
               .status(201)
               .body_ok(/you are authenticated as/);
    });
  });
};
