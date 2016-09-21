var sql = require('mssql');
var joi = require('joi');
var boom = require('boom');
var SHA3 = require("crypto-js/sha3");


var dbName = 'Proyecto1'
var config = {
  user: 'user1',
  password: "proyecto1",
  server: 'localhost\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
  database: dbName,
  /*options: {
      encrypt: true // Use this if you're on Windows Azure
  }*/
};
var connection = new sql.Connection(config);
connection.connect(function(err){
  if(err){
    //connection.CONNECT ERROR
    console.log(err);
  }else{
    console.log("connect to db succesfull");
  }
});



/*
//THE CORE BACKEND IS HERE :3
*/
exports.storedProcedureExample = {
  auth: false,
  handler: function(request,reply){
    sqlrequest.execute('sp_bdI_ejemplo1',function(err, recordset, returnValue, affectedRows){
    if(err){
      console.log(err);
      return reply(err);
    }else{
      var x = "recordset " + recordset + "\n"
      + "returnValue: " + returnValue + "\n"
      + "affectedRows: " + affectedRows;
      return reply(recordset);
    }
    });
  }
}
exports.loginDocente = {
  auth: false,
  validate: {
    payload: {
      Email: joi.string().required(),
      Password: joi.string().min(2).max(200).required()
    }
  },
  handler: function(request,reply){
    var password = String(SHA3(request.payload.Password));
    var username = request.payload.Email;
    var sqlrequest = new sql.Request(connection);
    sqlrequest.input('Email',sql.NVarChar(50),username);
    sqlrequest.input('Password',sql.NChar(128),password);
    sqlrequest.output('Accepted',sql.Bit);
    sqlrequest.execute('sp_loginDocente',function(err, recordset, returnValue, affectedRows){
      if(err){
        console.log(err);
        return reply(boom.badData(err),request.payload);
      }else{
        if(recordset.length > 0){
          console.log(sqlrequest.parameters.Accepted.value);
          request.cookieAuth.set(recordset[0][0]);
          return reply(recordset[0][0]);
        }
        return reply('Wrong email or password');
      }
    });
  }
}
exports.registrarDocente = {
  auth: false,
  validate:{
    payload:{
      Email: joi.string().required(),
      Password: joi.string().min(6).max(30).required(),
      Nombre: joi.string().required(),
      Apellido: joi.string().required(),
      Departamento: joi.string().required(),
      Telefono: joi.number().integer().required(),
      Campus: joi.string().required(),
      isAdmin: joi.boolean().required()
    }
  },
  handler: function(request,reply){
    var sqlrequest = new sql.Request(connection);
    sqlrequest.input('Email',sql.NVarChar(30),request.payload.Email);
    sqlrequest.input('Nombre',sql.NVarChar(50),request.payload.Nombre);
    sqlrequest.input('Apellido',sql.NVarChar(50),request.payload.Apellido);
    sqlrequest.input('Telefono',sql.Int,request.payload.Telefono);
    sqlrequest.input('Departamento',sql.NVarChar(50),request.payload.Departamento);
    sqlrequest.input('Campus',sql.NVarChar(50),request.payload.Campus);
    sqlrequest.input('Password',sql.NChar(128),SHA3(request.payload.Password));
    sqlrequest.input('isAdmin',sql.Bit,request.payload.isAdmin);
    sqlrequest.execute('sp_registrarDocente',function(err, recordset, returnValue, affectedRows){
      if(err){
        console.log(err);
        return reply(boom.notAcceptable(err));
      }
      return reply('registered');
    });
  }
}
exports.logoutDocente = {
  auth: {
    mode:'required',
    strategy:'session'
  },
  handler: function(request, reply) {
    request.cookieAuth.clear();
    return reply('Logout Successful!');
  }
}
exports.agregarLaboratorio = {
  auth:{
    mode:'required',
    strategy:'session',
  },
  handler: function(request,reply){
    var sqlrequest = new sql.Request(connection);
    sqlrequest.input('id',sql.NVarChar(128),request.payload.id);
    sqlrequest.input('Nombre',sql.NVarChar(50),request.payload.Nombre);
    sqlrequest.input('Descripcion',sql.NVarChar(50),request.payload.Descripcion);
    sqlrequest.input('Ubicacion',sql.NVarChar(50),request.payload.Ubicacion);
    sqlrequest.input('Capacidad',sql.NVarChar(50),request.payload.Capacidad);
    sqlrequest.execute('sp_agregarLaboratorio',function(err, recordset, returnValue, affectedRows){
      if(err){
        console.log(err);
        return reply(boom.notAcceptable(err));
      }
      console.log('added correrctly');
      return reply('added correctly');
    });
  }
}
exports.getLaboratorio = {
  auth:{
    mode:'required',
    strategy:'session'
  },
  handler: function(request,reply){
    var sqlrequest = new sql.Request(connection);
    sqlrequest.input('id',sql.NVarChar(128),request.params.id);
    sqlrequest.input('Nombre',sql.NVarChar(50),request.payload.Nombre);
    sqlrequest.input('Descripcion',sql.NVarChar(50),request.payload.Descripcion);
    sqlrequest.input('Ubicacion',sql.NVarChar(50),request.payload.Ubicacion);
    sqlrequest.input('Capacidad',sql.NVarChar(50),request.payload.Capacidad);
    sqlrequest.execute('sp_getLaboratorio',function(err,recordset,returnValue,affectedRows){
      if(err){
        console.log(err);
        return reply(boom.notAcceptable(err));
      }
      console.log(recordset);
      return reply(recordset);
    });
  }
}
exports.getLaboratorios = {
  auth:{
    mode:'required',
    strategy:'session'
  },
  handler: function(request,reply){
    var sqlrequest = new sql.Request(connection);
    sqlrequest.execute('sp_getLaboratorios',function(err,recordset,returnValue,affectedRows){
      if(err){
        console.log(err);
        return reply(boom.notAcceptable(err));
      }
      console.log(recordset[0]);
      return reply(recordset[0]);
    });
  }
}