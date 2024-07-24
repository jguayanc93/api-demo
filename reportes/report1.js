const XLSX = require("xlsx");
///IMPORT FS PARA LEER Y ESCRIBIR ARCHIVO
const fs = require("fs");
////import stream for stream suport
const {Readable} = require("stream");
///data prueba
const tipo1={nombre:"usuario",contraseña:"secreto"};
const tipo2=[{nombre:"usuario",contraseña:"secreto"}];
const tipo3=[{nombre:"usuario1",contraseña:"secreto1"},{nombre:"usuario2",contraseña:"secreto2"}];///siguiente renglon
const worksheet = XLSX.utils.json_to_sheet(tipo2);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook,worksheet,"test");
///cabesera 
XLSX.utils.sheet_add_aoa(worksheet,[["usuario","password"]],{origin:"A1"});
///columna anchura
worksheet["!cols"]=[{wch:12}];
/////empaketar data
XLSX.writeFile(workbook,"usuario.xlsx");

