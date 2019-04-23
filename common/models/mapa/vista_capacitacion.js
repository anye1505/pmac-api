
module.exports = (Mapa) => {

  Mapa.capacitacion = (next) => {
    var ds = Mapa.dataSource;

    var sql = "select "+
       " to_char(fecha_inicio, 'DD/MM/YYYY') as fecha_inicio "+
       " ,to_char(fecha_fin, 'DD/MM/YYYY') as fecha_fin "+
       " ,lugar,tipo_capacitacion,nro_dias,nro_horas,componentes,temas,responsables,asistentes_varones,asistentes_mujeres "+
       " ,pmac_monitores,pmac_comite,pmac_tecnicos,nro_autoridades "+
       " ,(select array_agg(row_to_json(aa.*)) from  monitoreo.capacitacion_foto aa where aa.id_capacitacion=a.id_capacitacion) as fotos  "+
       " ,st_x(st_transform(st_setsrid(st_makepoint(cp.xgd,cp.ygd),4326),3857))+random()*250 as longitud "+
       " , st_y(st_transform(st_setsrid(st_makepoint(cp.xgd,cp.ygd),4326),3857))+random()*250 latitud"+
       " from monitoreo.capacitacion a "+
       " inner join general.ccpp_med cp on a.codcp=cp.codcp "
   
    ds.connector.execute(sql, [], function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
    });  
  };

  Mapa.remoteMethod('capacitacion', {
    accepts: [
       

    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/capacitacion'
    }
  });
}