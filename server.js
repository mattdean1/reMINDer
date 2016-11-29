'use strict';
var AlexaAppServer = require( 'alexa-app-server' );

var server = new AlexaAppServer( {
	httpsEnabled: false,
  port: 8080,
} );

module.exports = server;
