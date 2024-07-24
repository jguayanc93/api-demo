const bd = require('../conexion/cadena.js')
const express = require('express');
const router = express.Router();
// const XLSX = require("xlsx");

////LLAMADA DE LA CLASE TEDIOUS
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

let sentencia = (res,usunom,usupass)=>{
    let respuesta=[];
    let docheader=[];
    let contador=0;
    // let c_sql="select top 2 ndocu,codcli,nomcli from mst01ped order by fecha desc";
    let sp_sql="V_MAC_JOC_REP_MARCAS_V1 @Tipo=@seleccion,@Fecha=@rango";
    let consulta = new Request(sp_sql,(err,rowCount,row)=>{
        if(err){console.log("error")}
        else{
            conexion.close();
            row.forEach(fila=>{
                if(contador<fila.length){
                    let tmp={};
                    let arrtemp=fila.map((data)=>{///RESUELTO
                        tmp[contador]=data.value;
                        // ({[contador]:data.value});//no borrar
                        contador++;
                    });
                    respuesta.push(tmp);
                }
                else{
                    contador=0;
                    let tmp={};
                    let arrtemp=fila.map((data)=>{
                        tmp[contador]=data.value;
                        contador++;
                    });
                    respuesta.push(tmp);
                }
            })
            let arrhead=row[0].map((cabesera)=>{docheader.push(cabesera.metadata.colName)})

            let dataconjunto=[respuesta,docheader];
            // res.json(respuesta);
            res.json(dataconjunto);
            const worksheet = XLSX.utils.json_to_sheet(respuesta);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook,worksheet,"pagina1");
            //XLSX.utils.sheet_add_aoa(worksheet,[["usuario","password"]],{origin:"A1"});///no necesario
            XLSX.utils.sheet_add_aoa(worksheet,[docheader],{origin:"A1"});
            worksheet["!cols"]=[{wch:14}];
            XLSX.writeFile(workbook,"exelplantilla.xlsx");
        }
        /////console.log(row);////DEBE MANEJARSE NO SIRVE EN ESTE ESTADO
        ///if(row.length==0) res.status(401).json({"msg":"invalido"});
        ////else{return res.status(200).json(respuesta)}
    })
    consulta.addParameter('seleccion',TYPES.VarChar,'RES');
    consulta.addParameter('rango',TYPES.Int,0);
    consulta.on('row',(filas)=>{})
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

router.get('/',(req,res)=>{})

module.exports=router;