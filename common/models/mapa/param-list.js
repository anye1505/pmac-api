
module.exports = (Mapa) => {

  Mapa.param = ( next) => {
    var ds = Mapa.dataSource;
    var datos = {
      ambiental_comunidad:[],
      ambiental_tipo_observacion:[],
      ambiental_existente:[],
      ambiental_clasificacion:[],

      geotecnico_comunidad:[],
      geotecnico_tipo_observacion:[],
      geotecnico_existente:[],
      geotecnico_clasificacion:[],

    };

     Promise.resolve()
      .then(()=> {
      return new Promise(function(resolve, reject) {

        var sql = "select com_id,com_nombre from monitoreo.vista_observacion_ambiental   group by com_id,com_nombre order by 2";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.ambiental_comunidad = data;
              resolve();
            }
        });  
      })
    })
    .then(()=>{
      return new Promise(function(resolve, reject) {

        var sql = "select tipo_observacion from monitoreo.vista_observacion_ambiental   group by tipo_observacion order by 1";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.ambiental_tipo_observacion = data;
              resolve();
            }
        });  
      })
    })
    .then(()=>{
      return new Promise(function(resolve, reject) {

        var sql = "select existente from monitoreo.vista_observacion_ambiental   group by existente order by 1";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.ambiental_existente = data;
              resolve();
            }
        });  
      })
    })
    .then(()=>{
      return new Promise(function(resolve, reject) {

        var sql = "select clasificacion from monitoreo.vista_observacion_ambiental   group by clasificacion order by 1";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.ambiental_clasificacion = data;
              resolve();
            }
        });  
      })
    })


      .then(()=> {
      return new Promise(function(resolve, reject) {

        var sql = "select com_id,com_nombre from monitoreo.vista_observacion_geotecnico   group by com_id,com_nombre order by 2";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.geotecnico_comunidad = data;
              resolve();
            }
        });  
      })
    })
    .then(()=>{
      return new Promise(function(resolve, reject) {

        var sql = "select tipo_observacion from monitoreo.vista_observacion_geotecnico   group by tipo_observacion order by 1";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.geotecnico_tipo_observacion = data;
              resolve();
            }
        });  
      })
    })
    .then(()=>{
      return new Promise(function(resolve, reject) {

        var sql = "select existente from monitoreo.vista_observacion_geotecnico   group by existente order by 1";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.geotecnico_existente = data;
              resolve();
            }
        });  
      })
    })
    .then(()=>{
      return new Promise(function(resolve, reject) {

        var sql = "select clasificacion from monitoreo.vista_observacion_geotecnico   group by clasificacion order by 1";
        ds.connector.execute(sql, [], function(err, data) {
            if (err){        
              reject(err);
            }else{
              datos.geotecnico_clasificacion = data;
              next(null,{error:false,datos:datos});
            }
        });  
      })
    })


    .catch(function(err){
        console.log(err);
        next(null,{error:true,data:"Ocurrio un error al cargar los parametros de búsqueda"});   
    });






     
  };

  Mapa.remoteMethod('param', {
    accepts: [
         
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/param'
    }
  });
}