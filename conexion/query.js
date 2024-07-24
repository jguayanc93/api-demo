let res="la data de response para posiblemente enviar al resolverse";
let consulta="consulta o procedimiento sql definido correctamente para poder luego reemplazar sus variables";
let variables="variables a llamar para cada campo";
let agregar_cantidad_de_addparameter="incrustar los addparameter necesarios para añadirle las variables";
function reqerido(res){}
let sentencia = (res,usu,pass)=>{
    let c_sql="select codusu,nomusu,codgru,codven,codalm from fcu0000 where nomacc=@nomacc and dbo.fn_DesEncrip(clausu)=@clausu";
    let consulta = new Request(c_sql,(err,rowCount,row)=>{
        conexion.close();
        if(err) console.log(err);
        else{
            if(rowCount==0) res.status(400).send("sin resultados");
            else{
                let respuesta=[];
                let respuesta2={};
                let docheader=[];
                let contador=0;
                row.forEach(fila=>{
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
            //let dataconjunto=[respuesta,docheader];
        }
    })
    consulta.addParameter('nomacc',TYPES.VarChar,usu);
    consulta.addParameter('clausu',TYPES.VarChar,pass);
    conexion.execSql(consulta);
}