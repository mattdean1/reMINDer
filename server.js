'use strict';
var AlexaAppServer = require( 'alexa-app-server' );

var server = new AlexaAppServer( {
	httpsEnabled: false,

} );

server.start();
