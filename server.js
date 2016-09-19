var hapi = require('hapi');
var routes = require('./routes');
var inert = require('inert');
var auth = require('hapi-auth-cookie');

var server = new hapi.Server();
server.connection({
    port: ~~process.env.PORT || 8000,
    routes: { cors: {
                  credentials: true,
                  origin: ["*"]
                }
            }
});
server.register([inert, auth], function(err){

  server.auth.strategy('session', 'cookie', {
    password: 'calendarencryptedpassword',
    cookie: 'calendarcookies',
    ttl: 24 * 60 * 60 * 1000, // Set session to 1 day
    isSecure: false
  });

	server.route(routes.endpoints);

	server.start(function () {
	    console.log('Server running at:', server.info.uri);
	});

});
