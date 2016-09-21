var DocenteController = require('./Controllers/DocenteController')

exports.endpoints = [{method: 'GET', path: '/', handler: function(request, reply){reply('YEAH, its working!!')}},
	{method: 'POST', path: '/v1/loginDocente', config: DocenteController.loginDocente},
	{method: 'POST', path: '/v1/registrarDocente', config: DocenteController.registrarDocente},
	{method: 'GET', path: '/v1/logoutDocente', config: DocenteController.logoutDocente},
	{method: 'POST', path: '/v1/agregarLaboratorio', config: DocenteController.agregarLaboratorio}/*,
	{method: 'POST', path: '/v1/borrarLaboratorio', config: DocenteController.borrarLaboratorio},
	{method: 'GET', path: '/v1/Laboratorio/{id}', config: DocenteController.borrarLaboratorio}*/
];
