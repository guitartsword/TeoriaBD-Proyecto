var DocenteController = require('./Controllers/DocenteController')

exports.endpoints = [{method: 'GET', path: '/', handler: function(request, reply){reply('YEAH, its working!!')}},
	{method: 'GET', path: '/v1/products', config: DocenteController.getProducts},
	{method: 'POST', path: '/v1/login', config: DocenteController.loginDocente},
	{method: 'POST', path: '/v1/registrarDocente', config: DocenteController.registrarDocente}
];
