
module.exports = (Mapa) => {

  Mapa.incidente = (next) => {
    var ds = Mapa.dataSource;

    var sql = "select to_char(inc_fecha_reporte, 'DD/MM/YYYY') as inc_fecha_reporte,inc_kp,inc_descripcion,inc_nro_verificaciones,inc_nro_reportes,inc_coordenada_3857_x,inc_coordenada_3857_y,(select array_agg(row_to_json(aa.*)) from  monitoreo.incidente_foto aa where aa.inc_id=a.inc_id) as fotos from monitoreo.incidente a";
   
    ds.connector.execute(sql, [], function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
    });  
  };

  Mapa.remoteMethod('incidente', {
    accepts: [
       

    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/incidente'
    }
  });
}