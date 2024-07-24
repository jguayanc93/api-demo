////control de acceso
function logeado(req,res,next){
    console.log("logeandose desde modulo externo")
    next();
}

module.exports=logeado;