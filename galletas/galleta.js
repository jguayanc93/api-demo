const express = require('express');
const router = express.Router();
const cookieparser = require('cookie-parser');

const kukiopt=new Object();
kukiopt.expires=new Date(Date.now()+30*1000);

router.use(express.json())
router.use(cookieparser())

// router.get('/',(req,res)=>{
//     console.log("saco galleta");
//     //res.status(201).cookie('kukis','oferton',kukiopt);
//     res.status(201).cookie('kukis','oferton');
//     res.status(200).json({msg:"consumido"});
// })

router.get('/',(req,res)=>{
    console.log("saco galleta");
    //res.status(201).cookie('kukis','oferton').json({msg:"consumido"});
    // res.status(201).cookie('kukis','oferton');
    res.cookie('galletita','comida',{
        maxAge:40000,
        // expires:new Date(Date.now()+40000),
        httpOnly:true,
        sameSite:'lax'
    });
    res.send("creado");
    // res.cookie('recuerdame','1',{expires:new Date(Date.now()+40000),httpOnly:true}).redirect('/galletas/tienda');
})

router.get('/tienda',(req,res)=>{
    console.log(req.cookies);
    res.status(200).send("pasa");
})

router.post('/',(req,res)=>{
    console.log("saco galleta");
    //res.cookie('recuerdame','1',{expires:new Date(Date.now()+40000),httpOnly:true}).redirect('/galletas/tienda');
    //res.status(200).cookie('recuerdame','secreto',{expires:new Date(Date.now()+40000),httpOnly:true}).send("creado");
    res.status(200).cookie('recuerdame','secreto',{maxAge:1000000,httpOnly:true}).send("creado");
})
router.get('/kitar',(req,res)=>{
    console.log("eliminando la galleta");
    res.status(200).cookie("nombre").json({msg:"eliminado"});
})

router.get('/setcooki',(req,res)=>{
    res.cookie('galletita','comida',{
        maxAge:40000,
        httpOnly:true,
        sameSite:'lax'
    });
    res.send("creado");
})
router.get('/getcooki',(req,res)=>{
    console.log(req.cookies);
    res.send("mira el server");
})

module.exports=router;