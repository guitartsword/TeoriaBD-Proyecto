var sql = require('mssql');
var joi = require('joi');
var boom = require('boom');
var SHA3 = require("crypto-js/sha3");


var dbName = 'NORTHWND'
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
var sqlrequest = new sql.Request(connection);


/*
//THE CORE BACKEND IS HERE :3
*/
console.log("exports");
exports.storedProcedureExample = {
  auth: false,
  handler: function(request,reply){
    sqlrequest.execute('sp_bdI_ejemplo1',function(err, recordset, returnValue, affectedRows){
    if(err){
      console.log(err);
    }else{
      var x = "recordset " + recordset + "\n"
      + "returnValue: " + returnValue + "\n"
      + "affectedRows: " + affectedRows;
      reply(recordset);
    }
    });
  }
}
exports.loginDocente = {
  auth: false,
  validate: {
    payload: {
      username: joi.string().required(),
      password: joi.string().min(2).max(200).required()
    }
  },
  handler: function(request,reply){
    var password = String(SHA3(request.payload.password));
    var username = request.payload.username;
    sqlrequest.input('username',sql.NVarChar(20),username);
    sqlrequest.input('password',sql.NVarChar(128),password);
    sqlrequest.execute('loginDocente',function(err, recordset, returnValue, affectedRows){
      if(err){
        return reply(boom.notAcceptable('Error Executing Query'));
      }else{
        if(recordset.length > 0){
          request.auth.session.set(recordset[0]);
          return reply(recordset[0]);
        }
        return reply(boom.unauthorized('Wrong email or password'));
      }
    });
  }
}
exports.getProducts = {
  auth: false/*{
    mode:'required',
    strategy:'session',
    scope: ['admin', 'regular']
  }*/,
  handler: function(request,reply){
    sqlrequest.query('select * from Products P where P.ProductID = 1').then(function(recordset) {
      reply(recordset[0]);
    }).catch(function(err) {
      console.log("QUERY ERROR");
      console.log(err);
    // ... query error checks
    });
  }
}
