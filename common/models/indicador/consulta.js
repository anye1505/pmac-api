
module.exports = (Indicador) => {

  Indicador.consulta = (desde,hasta,comunidad, next) => {
    var ds = Indicador.dataSource;
   

    comunidad = comunidad==null?'':comunidad.join(',');
    //tipo_observacion = tipo_observacion==null?'':tipo_observacion.join(',');

    let param = [
      desde,
      hasta,
      desde,
      hasta
    ]

    //console.log(param);
    Promise.resolve()
    .then(()=> {
      return new Promise(function(resolve, reject) {
        var sql = "select case when existente='SI' then 'Existente' else 'No existente' end existente,sum(q) q from ( "+

"select trim(upper(existente)) existente, count(*) q from monitoreo.hist_observacion_ambiental "+

"where to_char(fecha_identificacion,'yyyymm')::integer between $1 and $2 "+

"group by existente "+

"union "+

"select trim(upper(existente)) existente, count(*) q from monitoreo.hist_observacion_geotecnico "+

"where to_char(fecha_identificacion,'yyyymm')::integer between $3 and $4 "+

"group by existente "+

") i group by case when existente='SI' then 'Existente' else 'No existente' end order by existente"; 
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              let datos = {
                grafico_1:data
              }
              resolve(datos);
            }
        });  
      })
    })

    .then((datos)=> {
      return new Promise(function(resolve, reject) {
        var sql = "select tipo,clasificacion,sum(q) q from ( "+

"select 'Ambiental' tipo, clasificacion, count(*) q from monitoreo.hist_observacion_ambiental "+

"where upper(existente)='SI' and to_char(fecha_identificacion,'yyyymm')::integer between $1 and $2 "+

"group by com_nombre,clasificacion "+

"union "+

"select 'Geotécnico' tipo, clasificacion, count(*) q from monitoreo.hist_observacion_geotecnico "+

"where upper(existente)='SI' and to_char(fecha_identificacion,'yyyymm')::integer between $3 and $4 "+

"group by com_nombre,clasificacion "+

") i group by tipo,clasificacion order by tipo,clasificacion";
        ds.connector.execute(sql, param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos['grafico_2']=data;
              resolve(datos);
              //next(null,{error:false,comunidad:datos,mensual:data});
            }
        });  
      })
    })


    .then((datos)=> {
      return new Promise(function(resolve, reject) {
        var sql = "select * from ( "+

"select com_nombre comunidad,'Ambiental' tipo, clasificacion, count(*) q from monitoreo.hist_observacion_ambiental "+

"where upper(existente)='SI' and to_char(fecha_identificacion,'yyyymm')::integer between $1 and $2 "+

"group by com_nombre,clasificacion "+

"union "+

"select com_nombre comunidad,'Geotécnico' tipo, clasificacion, count(*) q from monitoreo.hist_observacion_geotecnico "+

"where upper(existente)='SI' and to_char(fecha_identificacion,'yyyymm')::integer between $3 and $4 "+

"group by com_nombre,clasificacion "+

") i order by comunidad,tipo,clasificacion";
        ds.connector.execute(sql, param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos['grafico_3']=data;
              resolve(datos);
            }
        });  
      })
    })

   /* .then(()=> {
      return new Promise(function(resolve, reject) {
        var sql = "select * from monitoreo.sp_consultar_indicador_comunidad_total($1,$2,$3)";
        ds.connector.execute(sql,paramSt, function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos['comunidad']=data;
              resolve(datos);
            }
        });  
      })
    })*/

    .then((datos)=> {
      return new Promise(function(resolve, reject) {

    let paramSt = [
      desde,
      hasta,
      comunidad,
      '',
      ''
    ]
        var sql = "select * from monitoreo.sp_consultar_indicador_mensual($1,$2,$3,$4,$5)";
        ds.connector.execute(sql, paramSt, function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos['comunidad']=[];
              datos['mensual']=data;
              datos['error']=false;
              next(null,datos);
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