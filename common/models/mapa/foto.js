var fs = require('fs');
var path = require('path');
var loopback = require('loopback');
var crypto = require('crypto');
const uuidv1 = require('uuid/v1');
var { exec } = require('child_process');
module.exports = (Descarga) => {
	Descarga.foto = function(id, tipo,adicional,  res,  cb) {
		var file;
		var nameDownload;
		var descarga;
			console.log("id:",typeof id);
		 Promise.resolve()
	    .then(function() {
			return new Promise(function(resolve, reject) {
				if(tipo==1){
					file = 	path.join(Descarga.app.get("path").imagen_ambiental,id+'.jpg');
				}else if(tipo==2){
					file = 	path.join(Descarga.app.get("path").imagen_geotecnico,id+'.jpg');				
				}else if(tipo==3){
					file = 	path.join(Descarga.app.get("path").imagen_incidente,adicional);	
				}else if(tipo==4){
					file = 	path.join(Descarga.app.get("path").imagen_capacitacion,adicional);	
				}
				nameDownload = adicional;
				resolve();				  	
			});
	    })
	    .then(function() {
			return new Promise(function(resolve, reject) {	
				console.log(file);
				if(!fs.existsSync(file)){
					//res.type('application/json');
					res.status(400).send(  "Archivo no existe" );
				}else{  								
  					let reader = fs.createReadStream(file);
					reader.on('error', function (err) {
						console.log(err);
						//descarga.destroy();
						//res.type('application/json');
						res.status(500).send("No se puede descargar archivo" );
						//cb("Error al descagar archivo",null);
					});
					reader.on('open',()=>{			
							//if(err)res.status(500).send(  "Vuelva a intentarlo en unos momentos..." );
							res.set('Content-Type','application/force-download');
							res.set('Content-Type','application/octet-stream');
							res.set('Content-Type','application/download');
							res.set('Content-Disposition','attachment;filename='+nameDownload);
							reader.pipe(res);

					});
				}
			});
	    })
		.catch(function(err){
			console.log(err);
			next('Ocurrio un error, vuelva a intentar en unos minutos.....');
		});


	};

	Descarga.remoteMethod('foto', {
		//isStatic: true,
		accepts: [
			{arg: 'id', type: 'string', required: true},			
			{arg: 'tipo', type: 'number', required: true},	
			{arg: 'adicional', type: 'string', required: false},
    		{arg: 'res', type: 'object', 'http': {source: 'res'}}
		],
		//http: { verb: 'get', path: '/download/:token' },
		http: { verb: 'get', path: '/foto' }
	});
}
