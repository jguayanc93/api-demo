const bd = require('../conexion/cadena.js')////DATA CONSTANTE DE LA BD
const express = require('express');
const router = express.Router();
// const path = require('path')

////LLAMADA DE LA CLASE TEDIOUS
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
/////DECLARACION DE MIDLEWARE PARA LA RUTA
let sentencia = (res,usunom,usupass)=>{
// let sentencia=function(usunom,usupass){
    let c_sql="select nomusu from fcu0000 where nomacc=@usuario and dbo.fn_DesEncrip(clausu)=@password";
    let consulta = new Request(c_sql,(err,rowCount,row)=>{
        if(err){console.log(err)}
        else{
            conexion.close()
            res.json(row[0][0].value);//si vale
            //res.redirect('/');
            // return row[0][0].value;
            //console.log(rowCount);///filas afectadas
            // console.log(consulta.rows[0][0].value);
        }
    })
    consulta.addParameter('usuario',TYPES.VarChar,usunom);
    consulta.addParameter('password',TYPES.VarChar,usupass);
    // consulta.on('row',(resultado)=>{
    //     return resultado[0].value;
    //     // valor=resultado[0].value;
    // })
    let capturador = (filas)=>{
        //let val=filas[0].value;
        return filas[0].value;
    }
    consulta.on('row',capturador)
    conexion.execSql(consulta);
    // return capturador(filas);
}

let login = (req,res,next)=>{
    let nom = req.body.nomusu;
    let clausu = req.body.clausu;
    req.login=Date.now();
    conexion = new Connection(bd.config);
    conexion.on('connect',(err)=>{
        if(err){console.log(err);}
        //sentencia(nom,clausu);////CREAR EL REQUERIMIENTO EN OTRO LADO SINO MASAMORRA
        sentencia(res,nom,clausu);
        // console.log(sentencia(nom,clausu))
        //res.send(sentencia(nom,clausu))///FALLA EN RESPONDER
    });
    conexion.connect();
    // conexion.connect(function(err){
    //     if(err){console.log(err)}
    //     //objeto = sentencia(nom,clausu);
    //     sentencia(res,nom,clausu);
    //     // res.send("conexion establecida");
    // });
    // next();
}
///activacion del midleware
// router.use(express.json())
router.use([express.json(),login])
///////FALTA AGREGAR LA CADENA DE METODOS PARA UNIFICAR SOLO 1 RUTA
router.get('/',(req,res)=>{
    // res.send(req.login);
})

router.get('/:id',(req,res)=>{
    console.log(req.params.id);
    res.send(res.tim)
})

module.exports=router