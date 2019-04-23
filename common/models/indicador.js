
module.exports = function(Indicador) {	
  	require('./indicador/param')(Indicador);
  	require('./indicador/consulta')(Indicador);
  	require('./indicador/control-acceso')(Indicador);
  	require('./indicador/gestion-social')(Indicador);

};
