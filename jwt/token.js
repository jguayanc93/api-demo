const express = require('express');
const router = express.Router();
const cookieparser = require('cookie-parser');
const jws = require('jws');
const base64url = require('base64url');

router.use(express.json())
router.use(cookieparser())

const objvacio=(objcuerpo)=>{
    for(let propiedad in objcuerpo){
        if(Object.hasOwn(objcuerpo,propiedad)){ return false; }
    }
    return true;
}

const userpayloaddata = {
    "identificador":"V123",
    "nombre":"juncarlos",
    "modulos":{
        "ventas":true,
        "despacho":false,
        "almacen":false
    },
    "acciones":{
        "crear":false,
        "revisar":true,
        "modificar":true,
        "eliminar":false
    }
}

const firma = {
    header:{alg:'HS256',"typ":"JWT"},
    payload:userpayloaddata,
    secret:'chistemas'
}

// const signature = jws.sign(firma);

router.get('/',(req,res)=>{
    if(objvacio(req.body)) console.log("no enviaste nada gil")
    else{
        console.log("analisando su data enviada");
        let {userclient,passclient}=req.body;
        // if(jws.verify(signature,HS256,))
        if(userclient=="juancarlos" && passclient=="secreto"){///validar con una consulta ala base de datos
            let signature = jws.sign(firma);
            console.log(signature);
            let separacion=signature.split('.');
            console.log(separacion);
            console.log(base64url.decode(separacion[1]));
            console.log("verificar la firma");
            console.log(separacion[2]);
            //console.log(jws.verify(separacion[2],'HS256','chistemas'));
            console.log("aora verificaremos q sea cierto");
            console.log(jws.verify(signature,'HS256','chistemas'));
            console.log("veremos q lo traia la firma");
            let decodificado=jws.decode(signature);
            // console.log(jws.decode(signature));
            console.log("aora veremos si realmente compararemos la signatur")
            let cadenita="contenido";
            console.log(jws.verify(signature,'HS256','ventas'));

        }
        else{
            console.log("no puedo firmar eso porqe no es valido tu usuario");
        }
    }
    //let hsha256 = base64url.encode('{"alg":"HS256","typ":"JWT"}');
    //let cadenaobj = '{"alg":"HS256","typ":"JWT"}';
    // console.log(hsha256);
    //console.log(JSON.parse(cadenaobj));
    //console.log(base64url.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
    
    res.status(200).send("seccion de tokens");
})

router.get('/firmado',(req,res)=>{

})

router.get('/validar',(req,res)=>{})

module.exports=router;