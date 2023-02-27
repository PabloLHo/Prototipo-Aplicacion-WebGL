/*Archivos JS encargado de la correcta inicialización de babylon y su correspondiente llamada al modelado oportuno*/
var valor = "";
var nombre_modelo = "";

var canvas = document.getElementById("renderCanvas");
var startRenderLoop = function (engine, canvas) {
	engine.runRenderLoop(function () {
		if (sceneToRender && sceneToRender.activeCamera) {
			sceneToRender.render();
		}
	});
}
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

window.initFunction = async function() {
	var asyncEngineCreation = async function() {
		try {
			return createDefaultEngine();
		} catch(e) {
			console.log("the available createEngine function failed. Creating the default engine instead");
			return createDefaultEngine();
		}
	}
	window.engine = await asyncEngineCreation();
	if (!engine) throw 'engine should not be null.';
	startRenderLoop(engine, canvas);
	inicio();
	window.scene = createScene("Parcela");
};
	
	
initFunction().then(() => {
	sceneToRender = scene   
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});

/*Crea la ventana de visualización para una escena
	modelo: El nombre de la función de visualización a la que llamar
*/
const createScene = (modelo) => {
	return window[modelo](nombre_modelo);
}

function inicio() {
	//Obtenemos el valor de la parcela, olivo o zona a la que queremos ir
	var remplaza = /\+/gi;
	var url = window.location.href;
	url = unescape(url);
	url = url.replace(remplaza, " ");
	url = url.toUpperCase();
	variable = "modelo";
	var variable_may = variable.toUpperCase();
	var variable_pos = url.indexOf(variable_may);
	if (variable_pos != -1) {
		var pos_separador = url.indexOf("&", variable_pos);
		if (pos_separador != -1) {
			valor = url.substring(variable_pos + variable_may.length + 1, pos_separador);
		} else {
			valor = url.substring(variable_pos + variable_may.length + 1, url.length);
		}
		valor = valor.toLowerCase();
		valor = valor.split("/");
		valor[0] = valor[0][0].toUpperCase() + valor[0].slice(1);
		nombre_modelo = valor[0];
	} else {
		nombre_modelo = "";
	}

}
