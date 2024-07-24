require('dotenv').config();
const express = require('express');
const router = express.Router();
const {config,Connection,Request,TYPES} = require('../conexion/cadena.js');
const cookieparser = require('cookie-parser');
const jws = require('jws');
const base64url = require('base64url');

router.use([express.json(),cookieparser()]);

const objvacio=(objcuerpo)=>{
    for(let propiedad in objcuerpo){ if(Object.hasOwn(objcuerpo,propiedad)){ return false; } }
    return true;
}
// select a.codcli,a.ruccli,a.nomcli,a.ndocu,a.codven,b.nomven,a.codven_usu from mst01ped a join tbl01ven b on a.codven=b.codven where a.codven='V0146' and fecha='2024-06-28'
let revisar_pedidos=(req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {fecha,galletas} = req.body;
        let codven=jws.decode(galletas[0]).payload.vendedor;///recordatorio decifrar primero el payload
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            pedidos_pendientes(res,fecha,codven);
        });
    }
}

let pedidos_pendientes = (res,fecha,vendedor)=>{
    // let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,a.codven,b.nomven,a.codven_usu from mst01ped a join tbl01ven b on a.codven=b.codven where fecha=@fecha and ndge='' and codven in ('V0000','V0235') and codven_usu in ('V0000','V0130','V0172')";
    let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,a.codven,b.nomven,a.codven_usu from mst01ped a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and a.ndge='' and a.codven in ('V0000','V0130',@codven) and a.codven_usu in ('V0000','V0130',@codven)";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }
        else{
            conexion.close();
            // console.log(rowCount);
            if(rows.length==0) res.status(400).send("sin resultados?");
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        tmp[contador]=data.value.trim();
                        contador++;
                    });
                    respuesta.push(tmp);
                })
                Object.assign(respuesta2,respuesta);
                console.log(respuesta2);
                let cadenitajson=JSON.stringify(respuesta2);
                res.status(200).json(cadenitajson);
            }
        }
    })
    consulta.addParameter('fecha',TYPES.VarChar,fecha);
    consulta.addParameter('codven',TYPES.VarChar,vendedor);
    conexion.execSql(consulta);
}

let revisar_cotizaciones=(req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {fecha,galletas} = req.body;
        let codven=jws.decode(galletas[0]).payload.vendedor;///recordatorio decifrar primero el payload
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            cotizaciones_pendientes(res,fecha,codven);
        });
    }
}

let cotizaciones_pendientes = (res,fecha,vendedor)=>{
    // let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,b.nomven,a.codven_usu from mst01cot a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and ndge='' order by fecha";
    // let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,a.codven,b.nomven,a.codven_usu from mst01cot a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and a.ndge='' and a.codven in ('V0000','V0130',@codven) and a.codven_usu in ('V0000','V0130',@codven)";
    let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,a.codven,b.nomven,a.codven_usu from mst01cot a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and a.ndge='' and a.codven in ('V0000','V0130',@codven) and a.codven_usu in ('V0000','V0130',@codven)";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }
        else{
            conexion.close();
            // console.log(rowCount);
            if(rows.length==0) res.status(400).send("sin resultados?");
            else{
                let respuesta=[];
                let respuesta2={};
                let docheader=[];
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        tmp[contador]=data.value.trim();
                        contador++;
                    });
                    respuesta.push(tmp);
                    // row[0].map((cabesera)=>{docheader.push(cabesera.metadata.colName)})
                })
                Object.assign(respuesta2,respuesta);
                let cadenitajson=JSON.stringify(respuesta2);
                res.status(200).json(cadenitajson);
            }
        }
    })
    // consulta.addParameter('fecha',TYPES.VarChar,fechita);
    consulta.addParameter('fecha',TYPES.VarChar,fecha);
    consulta.addParameter('codven',TYPES.VarChar,vendedor);
    // conexion.callProcedure(consulta);
    conexion.execSql(consulta);
}

let revisar_facturas=(req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {fecha,galletas} = req.body;
        let codven=jws.decode(galletas[0]).payload.vendedor;///recordatorio decifrar primero el payload
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            facturas_realizadas(res,fecha,codven);
        });
    }
}

let facturas_realizadas = (res,fecha,vendedor)=>{
    // let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,b.nomven,a.codven,a.codven_usu from mst01fac a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and a.cdocu='01' and a.flag<>'*' and a.codven=@vendedor";
    let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,b.nomven,a.codven,b.nomven,a.codven_usu from mst01fac a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and a.cdocu='01' and a.flag<>'*' and a.codven_usu=@vendedor";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0) res.status(400).send("sin resultados?");
            else{
                let respuesta=[];
                let respuesta2={};
                let docheader=[];
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        tmp[contador]=data.value.trim();
                        contador++;
                    });
                    respuesta.push(tmp);
                    // row[0].map((cabesera)=>{docheader.push(cabesera.metadata.colName)})
                })
                Object.assign(respuesta2,respuesta);
                let cadenitajson=JSON.stringify(respuesta2);
                res.status(200).json(cadenitajson);
            }
        }
    })
    consulta.addParameter('fecha',TYPES.VarChar,fecha);
    consulta.addParameter('vendedor',TYPES.VarChar,vendedor);
    // conexion.callProcedure(consulta);
    conexion.execSql(consulta);
}

let revisar_boletas = (req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {fecha,galletas} = req.body;
        let codven=jws.decode(galletas[0]).payload.vendedor;///recordatorio decifrar primero el payload
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            boletas_realizadas(res,fecha,codven);
        });
    }
}

let boletas_realizadas = (res,fecha,vendedor)=>{
    let c_sql="select a.codcli,a.ruccli,a.nomcli,a.ndocu,b.nomven,a.codven,b.nomven,a.codven_usu from mst01fac a join tbl01ven b on a.codven=b.codven where a.fecha=@fecha and a.cdocu='03' and a.flag<>'*' and a.codven_usu=@vendedor";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }
        else{
            conexion.close();
            if(rows.length==0) res.status(400).send("sin resultados?");
            else{
                let respuesta=[];
                let respuesta2={};
                let docheader=[];
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        tmp[contador]=data.value.trim();
                        contador++;
                    });
                    respuesta.push(tmp);
                    // row[0].map((cabesera)=>{docheader.push(cabesera.metadata.colName)})
                })
                Object.assign(respuesta2,respuesta);
                let cadenitajson=JSON.stringify(respuesta2);
                res.status(200).json(cadenitajson);
            }
        }
    })
    consulta.addParameter('fecha',TYPES.VarChar,fecha);
    consulta.addParameter('vendedor',TYPES.VarChar,vendedor);
    conexion.execSql(consulta);
}

router.get('/',(req,res)=>{});

// router.get('/pedidos',revisar_pedidos,(req,res)=>{});
router.post('/pedidos',revisar_pedidos,(req,res)=>{});

router.post('/cotizaciones',revisar_cotizaciones,(req,res)=>{});

router.post('/facturas',revisar_facturas,(req,res)=>{});

router.post('/boletas',revisar_boletas,(req,res)=>{});

module.exports=router;