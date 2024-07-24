const bd = require('./conexion/cadena.js')////DATA CONSTANTE DE LA BD?
const express = require('express')
const cors = require('cors')

const app = express()
/////FUNCIONES PROPIAS llamadas
const logearse = require('./controladores/acceso.js')

const port = 3000;//puerto debera ser separado

/////MIDDLEWARE EXTERNOS PARA EL CONSUMO
// app.use(cors())
app.use(cors({
    origin:"http://127.0.0.1",///bloqea el cors request de origen
    methods:['GET','POST'],///bloquea el request del metodo
    credentials:true///bloquea el request de la cabesera?
}))

app.use(express.json())
// app.use('/',express.static('public'),logearse);

////RUTAS PRINCIPALES DECLARDAS POR MODULOS
const usuarios = require('./rutas/usuarios.js');
const vendedor = require('./rutas/vendedor.js');
const reportes = require('./reportes/report2.js');
// const modulos = require('./modulos/vendedor.js');
const galletas = require('./galletas/galleta.js');
const tokens = require('./jwt/token.js');
const login = require('./login/loggeo.js');
const ejecutivo = require('./rutas/ejecutivo.js');
const documento = require('./rutas/documento.js');
/////
////Route handlers
app.get('/',(req,res)=>{
    // res.send("punto de partida a las rutas");
    console.log("consumido desde otro lado por get")
    res.json({"msg":"hola invitado get"})
})
app.post('/',(req,res)=>{
    //let nom = req.body.user;
    //let pass = req.body.pass;
    console.log("consumido desde otro lado por post")
    console.log(req.body.usuario)
    //res.json({"msg":"hola invitado post"})
    res.json({"msg":`hola usuario ${req.body.usuario}`})
})

app.get('/logeado',(req,res)=>{
    res.send("punto de logeado");
})
//////
////CONSUMO E INSERCION DE RUTAS EXTERNAS PARA EL MANEJADOR DE RUTAS
app.use('/usuarios',usuarios);
app.use('/vendedor',vendedor);
app.use('/reporte',reportes);
// app.use('/modulos',modulos);
app.use('/galletas',galletas);
app.use('/token',tokens);
app.use('/login',login);
app.use('/ejecutivo',ejecutivo);
app.use('/documento',documento);
/////////


app.listen(port,()=>{
    console.log("servidor levantado");
})