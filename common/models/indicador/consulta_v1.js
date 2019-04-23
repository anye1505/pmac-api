
module.exports = (Indicador) => {

  Indicador.consulta = (desde,hasta,comunidad,categoria_observacion,tipo_observacion, next) => {
    var ds = Indicador.dataSource;
   

    comunidad = comunidad==null?'':comunidad.join(',');
    tipo_observacion = tipo_observacion==null?'':tipo_observacion.join(',');

    let param = [
      desde,
      hasta,
      comunidad,
      categoria_observacion,
      tipo_observacion
    ]
    console.log(param);
    Promise.resolve()
    .then(()=> {
      return new Promise(function(resolve, reject) {
        var sql = "select * from monitoreo.sp_consultar_indicador_comunidad1($1,$2,$3,$4,$5)";
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              resolve(data);
            }
        });  
      })
    })

    .then((datos)=> {
      return new Promise(function(resolve, reject) {
        var sql = "select * from monitoreo.sp_consultar_indicador_mensual($1,$2,$3,$4,$5)";
        ds.connector.execute(sql, param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              next(null,{error:false,comunidad:datos,mensual:data});
            }
        });  
      })
    })
    .catch(function(err){
        console.log(err);
        next(null,{error:true,mensaje:"Ocurrio un error realizar búsqueda"});   
    });
     
  };

  Indicador.remoteMethod('consulta', {
    accepts: [
        {
              arg: 'desde', //yyyymm
              type: 'string', 
              required: false
        }, 
        {
              arg: 'hasta', 
              type: 'string', 
              required: false
        }, 
        {
            arg: 'comunidad',
            type: 'array', 
            required: false
        },
        {
              arg: 'categoria_observacion', 
              type: 'string', 
              required: true
        }, 

        {
            arg: 'tipo_observacion',
            type: 'array', 
            required: false
        }
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/consulta'
    }
  });
}