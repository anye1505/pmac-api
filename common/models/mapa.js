
module.exports = function(Mapa) {	
  	require('./mapa/vista_observacion_ambiental')(Mapa);
  	require('./mapa/vista_observacion_geotecnico')(Mapa);
  	require('./mapa/param-list')(Mapa);
  	require('./mapa/foto')(Mapa);
  	require('./mapa/vista_incidente')(Mapa);
  	require('./mapa/vista_capacitacion')(Mapa);

};
