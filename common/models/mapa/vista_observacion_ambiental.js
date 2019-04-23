
module.exports = (Mapa) => {

  Mapa.ambiental = (comunidad, observacion, existente, clasificacion, desde, hasta,descripcion, next) => {
    var ds = Mapa.dataSource;
    /*page = page || 1;
    limit = limit || 10;

    var skip = (page - 1) * limit;
    */
    var data = {};
    var where = '';
    var param = [];

    var sql = "select *,st_x(st_transform(((ST_SetSRID(ST_Point(x, y),4326))::GEOMETRY),3857)) as x1,"
      +"st_y(st_transform(((ST_SetSRID(ST_Point(x, y),4326))::GEOMETRY),3857)) as y1 from monitoreo.vista_observacion_ambiental";


    if(comunidad != null){
      param.push(comunidad);
      where = ' com_id = $'+param.length;
    }

    if(observacion != null ){
      if(observacion.length > 0){
        where += (where.length>0?' and ':'') + ' tipo_observacion in (';
        for(var i=0;i<observacion.length;i++){
          param.push(observacion[i]);
          where +=( i>0 ? ',':'' )+ '$'+param.length;  
        }
        where +=' ) ';
      }
    }

    if(existente != null && existente != ''){
      param.push(existente);
      where +=  (where.length>0?' and ':'') +' existente = $'+param.length;      
    }

    if(clasificacion != null && clasificacion != ''){
      param.push(clasificacion);
      where +=  (where.length>0?' and ':'') +' clasificacion = $'+param.length;           
    }
    if(desde != null){
      param.push(desde);
      where +=  (where.length>0?' and ':'') +" to_date(fecha_identificacion, 'DD/MM/YYYY')  >= $"+param.length;   
      
      if(hasta != null){
        param.push(hasta);
        where +=  (where.length>0?' and ':'') +" to_date(fecha_identificacion, 'DD/MM/YYYY')  <= $"+param.length;   
        
      }
    }

    if(descripcion != null && descripcion != ''){
      param.push(descripcion);
      where +=  (where.length>0?' and ':'') +" descripcion ~* $"+param.length+"";         
    }

    if(where.length > 0){
      sql +=  ' where '+ where;
    }

console.log(sql);
console.log(param);
      
     
      ds.connector.execute(sql, param, function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
      });  
  };

  Mapa.remoteMethod('ambiental', {
    accepts: [
        {
              arg: 'comunidad', 
              type: 'number', 
              required: false
        }, 
        {
            arg: 'observacion',
            type: 'array', 
            required: false
        },

        {
            arg: 'existente',
            type: 'string', 
            required: false
        },
        {
            arg: 'clasificacion',
            type: 'string', 
            required: false
        },
        {
            arg: 'desde',
            type: 'date', 
            required: false
        },
        {
            arg: 'hasta',
            type: 'date', 
            required: false
        },
        {
            arg: 'descripcion',
            type: 'string', 
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
      path: '/ambiental'
    }
  });
}