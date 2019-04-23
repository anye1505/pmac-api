
module.exports = (Indicador) => {

  Indicador.gestionSocial = (desde,hasta, next) => {
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

        var sql = 'select '
        +' com_nombre'

        +' ,sum(sca_vivienda_nueva) as sca_vivienda_nueva'
        +' , sum(sca_vivienda_mejorada) as sca_vivienda_mejorada'
        +' , sum(sca_vivienda_abandonada) as sca_vivienda_abandonada'

        +' ,sum(sca_instalacion_nueva_agua) as sca_instalacion_nueva_agua'
        +' , sum(sca_instalacion_nueva_luz) as sca_instalacion_nueva_luz'
        +' , sum(sca_instalacion_nueva_tvcable) as sca_instalacion_nueva_tvcable'


        +' ,sum(sca_negocio_nuevo_bodega) as sca_negocio_nuevo_bodega'
        +' , sum(sca_negocio_nuevo_bar) as sca_negocio_nuevo_bar'
        +' , sum(sca_negocio_nuevo_restaurante) as sca_negocio_nuevo_restaurante'
        +' , sum(sca_negocio_nuevo_otro) as sca_negocio_nuevo_otro'

        +' ,sum(sca_negocio_crecio_bodega) as sca_negocio_crecio_bodega'
        +' , sum(sca_negocio_crecio_bar) as sca_negocio_crecio_bar'
        +' , sum(sca_negocio_crecio_restaurante) as sca_negocio_crecio_restaurante'
        +' , sum(sca_negocio_crecio_otro) as sca_negocio_crecio_otro'

        +' ,avg(sca_faena_participante_mujer) as sca_faena_participante_mujer'
        +' , avg(sca_faena_participante_varon) as sca_faena_participante_varon'
        +' , sum(sca_faena_numero) as sca_faena_numero'


        /*+' , sum(sca_viviena_mejorada) as sca_viviena_mejorada'
        +' , sum(sca_viviena_mejorada) as sca_viviena_mejorada'
        +' , sum(sca_viviena_mejorada) as sca_viviena_mejorada'
        +' , sum(sca_viviena_mejorada) as sca_viviena_mejorada'*/
        +' from monitoreo.hist_social_a where sca_mes >= $1 and sca_mes <= $2 group by com_nombre '
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //next(null,{error:false,data:data});   
              resolve(data);
            }
        });  
      })
    })
    .then((data1)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select'
                  +' sum(sca_caza_nro_cazadores) x'
                  +' , sum(sca_caza_animales_cazados) y'
                  +' , case when sum(sca_caza_animales_cazados)=0 then 0 else round(sum(sca_caza_animales_consumo)::numeric / sum(sca_caza_animales_cazados)::numeric,1)*100 end z'
                  +' , c.com_nombre comunidad'
                  +' , c.com_abrev nombre'
                  +' from monitoreo.hist_social_a sa left outer join general.comunidad c'
                  +'    on sa.com_id=c.com_id'
                  +' where   sca_mes between $1 and $2  '
                  +' group by c.com_nombre, c.com_abrev ';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //next(null,{error:false,data:data1,data2:data});   
              resolve({data1:data1,data2:data});
            }
        });  
      })
    })
    .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select  '
                  +' round(avg(sca_caza_nro_cazadores)::numeric,1) avg_x'
                  +' , round(avg(sca_caza_animales_cazados)::numeric,1) avg_y  ' 
                  +' from monitoreo.hist_social_a '
                  +' where   sca_mes between $1 and $2';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //next(null,{error:false,data:obj.data1,data2:obj.data2,avg_x:data[0].avg_x,avg_y:data[0].avg_y});   
              obj["avg_x"]= data[0].avg_x;
              obj["avg_y"]= data[0].avg_y;
              resolve(obj);
            }
        });  
      })
    })



    .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select'
                  +' avg(sca_caza_salieron_chacra) chacra_salidas'
                  +' , avg(coalesce(sca_caza_horas_chacra,0)) chacra_horas'
                  +' , avg(sca_caza_salieron_bosque) bosque_salidas'
                  +' , avg(coalesce(sca_caza_horas_bosque,0)) bosque_horas    '
                  +' , c.com_nombre comunidad'
                  +' , c.com_abrev nombre'
                  +' from monitoreo.hist_social_a sa left outer join general.comunidad c'
                  +' on sa.com_id=c.com_id'
                  +' where   sca_mes between $1 and $2     '
                  +' group by c.com_nombre, c.com_abrev';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              obj['data3'] = data;
              //next(null,{error:false,data:obj.data1,data2:obj.data2,avg_x:obj.avg_x,avg_y:obj.avg_y,data3:data});   
              resolve(obj);
            }
        });  
      })
    })

    .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select'
            +' a.ani_nombre animal    '
            +" , -sum(case when sca_lugar_caza='CHACRA' then 1 else 0 end) chacra "
            +" , sum(case when sca_lugar_caza='BOSQUE' then 1 else 0 end) bosque "
            +' ,count(*) total '
            +' from monitoreo.hist_social_a_caza ca '
            +' left outer join general.animal a '
            +' on ca.ani_id=a.ani_id '
            +' where sca_mes between $1 and $2    ' 
            +' group by a.ani_nombre '
            +' order by 4 desc';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //next(null,{error:false,data:obj.data1,data2:obj.data2,avg_x:obj.avg_x,avg_y:obj.avg_y,data3:obj.data3,data4:data});   
              //resolve();
              obj['data4'] = data;
              //next(null,{error:false,data:obj.data1,data2:obj.data2,avg_x:obj.avg_x,avg_y:obj.avg_y,data3:data});   
              resolve(obj);
            }
        });  
      })
    })

/// pesca
  .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select'
                  +' sum(sca_pesca_nro_pescadores) x'
                  +' , sum(sca_pesca_kg_pescado) y '
                  +' , case when sum(sca_pesca_kg_pescado)=0 then 0 else round(sum(sca_pesca_kg_consumo)::numeric / sum(sca_pesca_kg_pescado)::numeric,1)*100 end z'
                  +' , c.com_nombre comunidad'
                  +' , c.com_abrev nombre'
                  +' from monitoreo.hist_social_a sa left outer join general.comunidad c'
                  +'    on sa.com_id=c.com_id'
                  +' where   sca_mes between $1 and $2  '
                  +' group by c.com_nombre, c.com_abrev ';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //next(null,{error:false,data:data1,data2:data});   
              obj['data5'] = data;
              resolve(obj);
            }
        });  
      })
    })

    .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select  '
                  +' round(avg(sca_pesca_nro_pescadores)::numeric,1) avg_x'
                  +' , round(avg(sca_pesca_kg_pescado)::numeric,1) avg_y  ' 
                  +' from monitoreo.hist_social_a '
                  +' where   sca_mes between $1 and $2';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              //next(null,{error:false,data:obj.data1,data2:obj.data2,avg_x:data[0].avg_x,avg_y:data[0].avg_y});   
              obj["avg_x_pesca"]= data[0].avg_x;
              obj["avg_y_pesca"]= data[0].avg_y;
              resolve(obj);
            }
        });  
      })
    })

 .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select'
                  +' avg(sca_pesca_salieron_rio) rio_salidas'
                  +' , avg(sca_pesca_horas_rio) rio_horas'
                  +' , avg(sca_pesca_salieron_quebrada) quebrada_salidas'
                  +' , avg(sca_pesca_horas_quebrada) quebrada_horas '
                  +' , c.com_nombre comunidad'
                  +' , c.com_abrev nombre'
                  +' from monitoreo.hist_social_a sa left outer join general.comunidad c'
                  +' on sa.com_id=c.com_id'
                  +' where   sca_mes between $1 and $2     '
                  +' group by c.com_nombre, c.com_abrev';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              obj['data6'] = data;
              //next(null,{error:false,data:obj.data1,data2:obj.data2,avg_x:obj.avg_x,avg_y:obj.avg_y,data3:data});   
              resolve(obj);
            }
        });  
      })
    })


 .then((obj)=> {
      return new Promise(function(resolve, reject) {
        var sql = 'select'
            +' a.ani_nombre pez    '
            +" , -sum(case when spe_lugar_pesca='RIO' then 1 else 0 end) rio  "
            +" ,  sum(case when spe_lugar_pesca='QUEBRADA' then 1 else 0 end) quebrada "
            +' ,count(*) total '
            +' from monitoreo.hist_social_a_pesca ca  '
            +' left outer join general.animal a '
            +' on ca.ani_id=a.ani_id '
            +' where spe_mes between $1 and $2    ' 
            +' group by a.ani_nombre '
            +' order by 4 desc';
        ds.connector.execute(sql,param, function(err, data) {
            if (err){        
              reject(err);
            }else{
              next(null,{error:false,data:obj.data1,data2:obj.data2
                ,avg_x:obj.avg_x,avg_y:obj.avg_y,data3:obj.data3,data4:obj.data4
                ,avg_x_pesca:obj.avg_x_pesca,avg_y_pesca:obj.avg_y_pesca,data5:obj.data5
                ,data6:obj.data6,data7:data});   
              resolve();
            }
        });  
      })
    })

////
    .catch(function(err){
        console.log(err);
        next(null,{error:true,mensaje:"Ocurrio un error realizar búsqueda"});   
    });
     
  };

  Indicador.remoteMethod('gestionSocial', {
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
      path: '/gestionSocial'
    }
  });
}