require('dotenv').config();
const express = require('express');
const router = express.Router();
const {config,Connection,Request,TYPES} = require('../conexion/cadena.js');
const cookieparser = require('cookie-parser');
const jws = require('jws');
const base64url = require('base64url');

const objvacio=(objcuerpo)=>{
    for(let propiedad in objcuerpo){
        if(Object.hasOwn(objcuerpo,propiedad)){ return false; }
    }
    return true;
}

let login = (req,res,next)=>{
    if(objvacio(req.body)) res.send("body objeto vacio");
    else{
        let {userclient,passclient} = req.body;
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>{
            if(err) console.log("ERROR: ",err);
            //sentencia(res,conexion,userclient,passclient);
            sentencia(res,userclient,passclient);
        });
    }
}

let sentencia = (res,usu,pass)=>{
// let sentencia = (res,conexion,usu,pass)=>{
    let sp_sql="jc_user_identificador";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            res.status(401).send("error interno");
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
                // let cadenitajson=JSON.stringify(respuesta2);
                // res.locals.respuesta=respuesta;//variables locales
                respuesta2.permisos=tkgenerator(respuesta2);
                let cadenitajson=JSON.stringify(respuesta2);
                console.log(respuesta2);
                res.status(200).json(cadenitajson);///COMPLETADO PARA EL ENVIO
            }
            //let dataconjunto=[respuesta,docheader];
        }
    })
    consulta.addParameter('usercuenta',TYPES.VarChar,usu);
    consulta.addParameter('passcuenta',TYPES.VarChar,pass);
    // consulta.on('row',(columns)=>{ console.log(columns); })
    conexion.callProcedure(consulta);
    // conexion.execSql(consulta);
}
let tkgenerator = (obj)=>{
    let userpayloaddata = {
        "identificador":obj[0][0],
        "nombre":obj[0][1],
        "vendedor":obj[0][3],
        "modulos":[2,4,5],
        "acciones":{
            "create":false,
            "read":true,
            "update":true,
            "delete":false
        }
    }
    const firma = {
        header:{alg:'HS256',"typ":"JWT"},
        payload:userpayloaddata,
        secret:process.env.PALABRA_CLAVE
    }
    // let signature = jws.sign(firma)
    return jws.sign(firma);
    // return signature;
}

//router.use([express.json(),login]);
router.use([express.json(),cookieparser()]);

router.post('/recibimiento',(req,res)=>{
    let minuto = 1000*60;
    res.cookie("test1","secreto",{
        maxAge:minuto,
        path:'/',
        httpOnly:true,
        secure:false,
        sameSite:"none"
    })
    // res.set('Access-Control-Allow-Origin',req.headers.origin);
    // res.set('Access-Control-Allow-Credentials','true');
    res.status(200).send("recibido");
})
let revisar_tokens=(tokens)=>{
    let extraido={};
    tokens.forEach(valor=>{
        // if(jws.verify(valor,'HS256',process.env.PALABRA_CLAVE)) aceptables.push(jws.verify(valor,'HS256',process.env.PALABRA_CLAVE));
        if(jws.verify(valor,'HS256',process.env.PALABRA_CLAVE)){
            let decode=jws.decode(valor);
            Object.assign(extraido,decode.payload);
        };
    })
    return extraido;
}
router.post('/chekear',(req,res)=>{
    if(objvacio(req.body)) res.status(200).send("body objeto vacio");
    else{
        let resultados=revisar_tokens(req.body.galletas);
        // res.status(200).send("body analizado");
        res.status(200).json(resultados);
    }
})

router.post('/',login,(req,res)=>{});

module.exports=router;

////usar consultas//select TipEnt,codtra,codcli,Consig,dirent,codven,codven_usu,observ,orde from mst01fac where ndocu='F009-0514549'