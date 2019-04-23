
module.exports = (Indicador) => {

  Indicador.controlAcceso = (desde,hasta, next) => {
    var visitas_institucion = null;
    var visitas_personas = null;
    var salida_comuneros = null;
    //var regreso_comuneros = null;

    var ds = Indicador.dataSource;


    let param = [
      desde,
      hasta
    ];

    Promise.resolve()
    .then(()=> {
      return new Promise(function(resolve, reject) {

        var sql = "select c.com_nombre comunidad,e.emp_nombre_abreviado institucion  ,sum(cvi_nro_visitas) nro_visitas"+
          " from monitoreo.hist_ca_visita_institucion v"+
          " left join general.comunidad c on c.com_id=v.com_id"+
          " left join general.empresa e on e.emp_id=v.emp_id"+
          " where v.cvi_mes between $1 and $2"+
          " group by 1,2"+
          " order by 1,3 desc";
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              visitas_institucion = data;
              resolve();
            }
        });  
      })
    })

    .then((datos)=> {
      return new Promise(function(resolve, reject) {

        var sql = "select    c.com_nombre,coalesce(sum(cvp_colonos_nro_visitas),0) colonos "+
                  " ,coalesce(sum(cvp_nativos_nro_visitas),0) nativos"+
                  " from monitoreo.hist_ca_visita_persona v"+
                  " left join general.comunidad c on c.com_id=v.com_id"+
                  " where v.cvp_mes between $1 and $2"+
                  " group by 1"+
                  " order by 1  desc";
        ds.connector.execute(sql, param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              visitas_personas = data;
              resolve();
            }
        });  
      })
    })

    .then((datos)=> {
      return new Promise(function(resolve, reject) {

        var sql = "select "+
                  " c.com_nombre  desde"+
                  " , cp.mnomcp hasta"+
                  " , coalesce(sum(csc_nro_comuneros),0) nro_comuneros"+
                  " from monitoreo.hist_ca_salida_comunero s"+
                  " left join general.comunidad c on c.com_id=s.com_id"+
                  " left join general.ccpp_med cp on cp.codcp::integer=coalesce(s.des_id,0)"+
                  " where s.csc_mes between $1 and $2"+
                  " group by 1,2"+
                  " order by 1,3 desc";
        ds.connector.execute(sql, param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              salida_comuneros = data;
              resolve();
            }
        });  
      })
    })
    .then((datos)=> {
      return new Promise(function(resolve, reject) {

        var sql = "select "+
                  " cp.mnomcp  desde"+
                  " , c.com_nombre hasta"+
                  " , sum(crc_nro_comuneros) nro_comuneros"+
                  " from monitoreo.hist_ca_regreso_comunero r"+
                  " left join general.comunidad c on c.com_id=r.com_id"+
                  " left join general.ccpp_med cp on cp.codcp::integer=coalesce(r.des_id,0)"+
                  " where r.crc_mes between $1 and $2"+
                  " group by 1,2"+
                  " order by 1,3 desc";
        ds.connector.execute(sql, param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //regreso_comuneros = data;
              next(null,{
                error:false,
                visitas_institucion:visitas_institucion,
                visitas_personas:visitas_personas,
                salida_comuneros:salida_comuneros,
                regreso_comuneros:data
              });
            }
        });  
      })
    })

    .catch(function(err){
        console.log(err);
        next(null,{error:true,mensaje:"Ocurrio un error realizar búsqueda"});   
    });
     
  };

  Indicador.remoteMethod('controlAcceso', {
    accepts: [  
        {
              arg: 'desde', //yyyymm
              type: 'string', 
              required: true
        }, 
        {
              arg: 'hasta', 
              type: 'string', 
              required: true
        }, 
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/controlAcceso'
    }
  });
}