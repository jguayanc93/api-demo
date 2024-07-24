const bd = require('../conexion/cadena.js')////DATA CONSTANTE DE LA BD
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

conexion = new Connection(bd.config);

module.exports=conexion;