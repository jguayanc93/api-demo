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

let cargar_documento=(req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {galletas,nrdocumento} = req.body;
        let codven=jws.decode(galletas[0]).payload.vendedor;
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            documento_data(res,nrdocumento);
        });
    }
}

let documento_data = (res,nrdocumento)=>{
    // let c_sql="select TipEnt,codtra,Consig,dirent,codven_usu,observ,orde from mst01fac where ndocu=@nrdocumento";
    let c_sql="select b.despacho,c.nomtra,a.Consig,a.dirent,d.nomven,a.observ,a.orde from mst01fac a join tbl_tipo_despacho b on a.TipEnt=b.IDdespacho join tbl01tra c on a.codtra=c.codtra join tbl01ven d on a.codven_usu=d.codven where a.ndocu=@nrdocumento";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }
        else{ conexion.close(); }
    })
    consulta.addParameter('nrdocumento',TYPES.VarChar,nrdocumento);
    consulta.on("row",(row)=>{
        let valores=[];
        let valores2={};
        row.forEach(element => {
            if(typeof element.value=="number") valores.push(element.value)
            else{ valores.push(element.value.trim()); }
        });
        Object.assign(valores2,valores);
        let cadenitajson=JSON.stringify(valores2);
        res.status(200).json(cadenitajson);
    })
    conexion.execSql(consulta);
}
//////////////PARTE PARA MODIFICAR EL DOCUMENTO
let actualisar_tipoentrega=(req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {despacho,nrdocumento} = req.body;
        // console.log(typeof despacho);
        // let codven=jws.decode(galletas[0]).payload.vendedor;
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            modificar_data(res,Number(despacho),nrdocumento);
        });
    }
}

let modificar_data = (res,despacho,nrdocumento)=>{
    // console.log(typeof despacho);
    let c_sql="update mst01fac set TipEnt=@tipoentrega where ndocu=@ndocu";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }else{ conexion.close(); }
    })
    consulta.addParameter('tipoentrega',TYPES.Int,despacho);
    consulta.addParameter('ndocu',TYPES.VarChar,nrdocumento);

    consulta.on("requestCompleted",()=>{
        res.status(200).json({modificado:"modificado"})
    })
    conexion.execSql(consulta);
}

let actualisar_vendedor=(req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {vendedor,nrdocumento} = req.body;
        // console.log(req.body);
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            vendedor_data(res,vendedor);
        });
    }
}

let vendedor_data = (res,vendedor)=>{
    let comodin="%"+vendedor+"%";
    // let c_sql="select codven,nomven from tbl01ven where estado<>'2' and nomven like'% @nombre %'";
    let c_sql="select codven,nomven from tbl01ven where estado<>'2' and nomven like @nombre";
    let consulta = new Request(c_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(500).send("error interno");
        }else{
            conexion.close();
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
            let cadenitajson=JSON.stringify(respuesta2);
            res.status(200).json(cadenitajson);
            }
        }
    })
    consulta.addParameter('nombre',TYPES.VarChar,comodin);
    conexion.execSql(consulta);
}

router.post('/',cargar_documento,(req,res)=>{});

router.post('/ndocu',actualisar_tipoentrega,(req,res)=>{})

router.post('/vendedor',actualisar_vendedor,(req,res)=>{})

module.exports=router;