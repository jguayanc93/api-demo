const bd = require('../conexion/cadena.js')
const express = require('express');
const router = express.Router();
const XLSX = require("xlsx");

////LLAMADA DE LA CLASE TEDIOUS
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

let sentencia = (res,usunom,usupass)=>{
    let c_sql="select nomusu from fcu0000 where nomacc=@usuario and dbo.fn_DesEncrip(clausu)=@password";
    let consulta = new Request(c_sql,(err,rowCount,row)=>{
        if(err)console.log("error en el logeo")
        conexion.close();
        console.log(row.length);
        if(row.length==0) res.status(401).json({"msg":"invalido"});
        else{return res.status(200).json(row[0][0].value)}
    })
    consulta.addParameter('usuario',TYPES.VarChar,usunom);
    consulta.addParameter('password',TYPES.VarChar,usupass);
    conexion.execSql(consulta);
}

let login = (req,res,next)=>{
    let usuario=req.body.usuario;
    let contraseña=req.body.contrasena;
    conexion = new Connection(bd.config);
    conexion.on('connect',(err)=>{
        if(err)console.log(err)
        sentencia(res,usuario,contraseña)
    });
    conexion.connect();
}



router.use([express.json(),login]);

router.post('/',(req,res)=>{})

router.get('/exel',(req,res)=>{})

module.exports=router;