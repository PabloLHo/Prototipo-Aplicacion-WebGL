//Script para el manejo del GUI de controles del modelado


var camara;
var camaraCenital;
var escena;
var parcela = "";
var tipoCamara = "perspectiva";
var tipoModelo = "nube";
var polygon;
var nubeExists;
var system;
var parameters;
var deteccion;
var f_b;
var detectado = false;
var mostrarVoxelizacion;
var ultimaSeleccion;
var traslacion = false;
var hl;


var gui;

const smallDevice = window.matchMedia("(min-width: 576px)");

smallDevice.addListener(handleDeviceChange);

/*
 * Función que determina cuando la GUI debe abrirse o cerrarse automaticamente según el tamaño de la ventana
 *
 * e: Listener que controla que el tamaño de la ventana sea superior a 576px
 *
 */
function handleDeviceChange(e) {
	if (e.matches) gui.open();
	else gui.close();
}


/*
 * Función de inicialización de parámetros
 *
 * camera: Variable de Babylon que almacena la camara del sistema
 * cameraCenital: Variable del sistema que almacena la camara cpm visión cenital del sistema
 * _parcela: Variable string con el nombre de la parcela a renderizar
 * nube: Variable booleana que determina si existe o no nube de puntos
 * 
 */
function controlEscena(camera, cameraCenital, scene, _parcela, nube) {
	gui = new dat.GUI({ name: 'GUI', width: 250 });
	handleDeviceChange(smallDevice);
	crearGUI();
	camara = camera;
	camaraCenital = cameraCenital;
	escena = scene;
	parcela = _parcela;
	nubeExists = nube;
	if (!nubeExists) {
		system["formato"] = "text";
		cambioModelo();
	}

}


/*
 * 
 * Función de creación de la GUI
 *
 */
function crearGUI() {

	system = {
		Zoom: 175,
		rotationX: Math.PI / 4,
		rotationY: 0,
		moverX: 0,
		moverY: 0,
		seleccion: false,
		formato: "nube",
	};


	f_b = gui.addFolder('Base');
	f_b.open();
	f_b.add(system, 'seleccion', false).name("Recorte").listen().onChange(function () { seleccion() });
	f_b.add(system, "formato", { Nube: "nube", Textura: "text", Combinación: "combi" }).name("Formato 3D").listen().onChange(function () { cambioModelo() });
	f_b.add(system, 'Zoom', 0, 400).name("Zoom").listen().onChange(function () { aplicarZoom() });
	f_b.add(system, 'rotationX', 0, Math.PI / 2.2).name("Rotación X").listen().onChange(function () { rotar("x") });
	f_b.add(system, 'rotationY', 0, 2 * Math.PI).name("Rotación Y").listen().onChange(function () { rotar("y") });


	parameters = {
		Tipo: "perspectiva",
	}

	var first = gui.addFolder("Camara");
	first.add(parameters, "Tipo", { Cenital: "cenital", Perspectiva: "perspectiva", Rotatoria: "rotar" }).name("Tipo Visión").listen().onChange(function () { setChecked() });
	first.open();

	deteccion = gui.addFolder('Detección Objetos');
	let deteccionObjetos = { Detecc: function () { detectar() } };
	deteccion.add(deteccionObjetos, 'Detecc').name("Detectar Olivos");

	mostrarVoxelizacion = { mostrarVox: false };
	gui.add(mostrarVoxelizacion, 'mostrarVox', false).name("Mostrar Voxeles").listen().onChange(function () { mostrarVox() });

	let centrarVista = { Centrar: function () { centrado() } };
	gui.add(centrarVista, 'Centrar').name("Centrar visión");

	


	let volverInformacion = { Volver: function () { volverPagInformacion() } };
	gui.add(volverInformacion, 'Volver').name("Volver Información");

	setInterval(ajuste, 100);
}


/*
 * 
 * Función que ajusta los valores de la cámara según el tipo de visión
 *
 */
function setChecked() {
	if (!traslacion) {
		if (parameters["Tipo"] == "perspectiva" || parameters["Tipo"] == "rotar") {
			if (tipoCamara == "cenital") {
				f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
				f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
				f_b.add(system, 'rotationX', 0, Math.PI / 2.2).name("Rotación X").listen().onChange(function () { rotar("x") }).setValue(Math.PI / 4);
				f_b.add(system, 'rotationY', 0, 2 * Math.PI).name("Rotación Y").listen().onChange(function () { rotar("y") }).setValue(0);
			}
			escena.activeCamera = camara;
			var CoT = new BABYLON.TransformNode("root");
			camara.parent = null;
			if (parameters["Tipo"] == "rotar") {
				camara.parent = CoT;
				var angle = 0;
				escena.registerBeforeRender(function () {
					CoT.rotation.y = angle;
					angle += 0.001;
				});
			}
			document.getElementById("recorte").style.display = "none";
			document.getElementById("seleccion").style.display = "none";
			if (system["seleccion"] == true) {
				eliminarRecorte();
			}
			system["seleccion"] = false;
			system["Zoom"] = 175;
		} else {
			f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
			f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
			f_b.add(system, 'moverX', -100, 100).name("Desplazar en X").listen().onChange(function () { mover() }).setValue(0);
			f_b.add(system, 'moverY', -50, 50).name("Desplazar en Y").listen().onChange(function () { mover() }).setValue(0);
			system["Zoom"] = 200;
			escena.activeCamera = camaraCenital;
		}
		tipoCamara = parameters["Tipo"];
		centrado();
	} else {
		parameters["Tipo"] = "cenital";
    }
}


/*
 * 
 * Función control del zoom de la cámara
 *
 */
function aplicarZoom(){	
	if(seleccionActivo && tipoCamara == "cenital"){
		zoom.value = 200;
	}else{
		if(tipoCamara == "cenital"){
			camaraCenital.position = new BABYLON.Vector3(0,system["Zoom"],0);
		}else{
			camara.radius = system["Zoom"];
		}
	}
}


/*
 * Función de control de la rotación de la cámara sobre un eje
 * 
 * eje: Enum que determina sobre que eje se esta rotando
 *
 */
function rotar(eje){
	if(eje == "x"){
		if(tipoCamara == "cenital"){
		}else{
			camara.beta = system["rotationX"];
		}
	}else if(eje == "y"){
		if(tipoCamara == "cenital"){
		}else{
			camara.alpha = system["rotationY"];
		}
	}else{

	}
}


/*
 * 
 * Función de control de movimientos horizontales y verticales de la cámara
 *
 */
function mover(){
	
	camaraCenital.position = new BABYLON.Vector3(system["moverX"],200,system["moverY"]);
	
}


/*
 * 
 * Función de encargada de devolver la cámara a su posición original
 *
 */
function centrado(){
	if(tipoCamara == "cenital"){
		camaraCenital.setTarget(BABYLON.Vector3.Zero());
		camaraCenital.position = new BABYLON.Vector3(0,200,0);
	}else{
		camara.setTarget(new BABYLON.Vector3(0,1,0));
		camara.beta = Math.PI / 6;
		camara.alpha = 0;
	}
}


/*
 * 
 * Función para volver a la página de información previa a la escena
 *
 */
function volverPagInformacion(){
	location.href = "InformacionParcela.php?modelo=" + nombre_modelo;
}


/*
 * 
 * Función de activación de la selección previa al recorte
 *
 */
function seleccion() {
	if (tipoCamara != "cenital") {
		document.getElementById("seleccion").style.display = "flex";
		system["seleccion"] = false;
		seleccionActivo = system["seleccion"];
	} else {
		seleccionActivo = system["seleccion"];
		if (seleccionActivo) {
			document.getElementById("seleccion").style.display = "none";
			if (activacion) {
				seleccionPoligonal(escena, camaraCenital);
				activacion = false;
			} else {
				puntos = 0;
				coordenadas = [];
				finSeleccion = false;
			}
			crearRecorte();
			camaraCenital.speed = 0;
		} else {
			camaraCenital.speed = 0.75;
			if (lineasSeleccion) {
				lineasSeleccion.dispose();
				lineasSeleccion = null;
			}
			eliminarRecorte();
			document.getElementById("recorte").style.display = "none";
		}
	}
}


/*
 * 
 * Función de creación de los elementos de recorte
 *
 */
function crearRecorte(){
	
	var recorteFolder = gui.addFolder('Recorte');
	let recortar = {Recortar: function(){ recorte() }};
	recorteFolder.add(recortar,'Recortar').name("Recortar Parcela");
	
	let eliminarSelec = {EliminarSeleccion: function(){ eliminarSeleccion() }};
	recorteFolder.add(eliminarSelec,'EliminarSeleccion').name("Eliminar Selección");
	
	recorteFolder.open();
	
}


/*
 * 
 * Función de eliminación de los elementos de recorte
 *
 */
function eliminarRecorte(){
	
	gui.removeFolder(gui.__folders["Recorte"]);
	eliminarSeleccion();
	seleccionActivo = false;

}


/*
 * 
 * Función de inicialización de parámetros para reconstruir la nube
 *
 */
function crearReestructuracion() {

	let reestructurar = { reestructurar: function () { recomponerNube() } };
	gui.add(reestructurar, 'reestructurar').name("Recomponer nube");

}


/*
 * 
 * Función de eliminación de parámetros para reconstruir la nube
 *
 */
function eliminarReestructuracion() {

	gui.remove(gui.__controllers[3]);

}


/*
 * 
 * Función de llamada a la reconstrucción de la nube
 *
 */
function recomponerNube() {
	mostrarVoxelizacion["mostrarVox"] = false;
	mostrarVox();
	document.getElementById("mensaje").style.display = "block";
	pcs.dispose();
	eliminarReestructuracion();
	reconstruirParcela(false);
}


/*
 * 
 * Función de preparación previa al recorte de la nube
 *
 */
function recorte() {
	if(finSeleccion){
		for (var i = 0; i < coordenadas.length - 1; i++){
			//Se multiplica por Y para bajar las coordenadas a la altura de la nube, pues la camara se encuentra a altura Y.
			coordenadas[i].x = coordenadas[i].x * coordenadas[i].y;
			coordenadas[i].z = coordenadas[i].z * coordenadas[i].y;
		}
		if(lineasSeleccion){
			lineasSeleccion.dispose();
			lineasSeleccion = null;
		}
		eliminarRecorte();
		pcs.dispose();
		system["seleccion"] = false;
		mostrarVoxelizacion["mostrarVox"] = false;
		mostrarVox();
		//recorteParcela(scene);
		recorteParcelaVoxelizado(scene, coordenadas);
		crearReestructuracion();
	}else{
		alert("La selección no esta completa");
	}
	
}


/*
 * 
 * Función para eliminar la selección poligonal
 *
 */
function eliminarSeleccion(){
	
	if(lineasSeleccion){
		lineasSeleccion.dispose();
		lineasSeleccion = null;
		puntos = 0;
		coordenadas = [];
		finSeleccion = false;
	}
		
}


/*
 * 
 * Función para el control del modelado a mostrar
 *
 */
function cambioModelo() {
	if (!nubeExists) {
		creacionPoligono(parcela, detectado);
		if (system["seleccion"] == true) {
			eliminarRecorte();
		}
		system["seleccion"] = false;
		tipoModelo = "text";
	} else {
		if (system["formato"] == "nube") {
			polygon.dispose();
			for (var i = 0; i < olivos_deteccion.length; i++) {
				olivos_deteccion[i][0].dispose();
			}
			if (tipoModelo != "combi") {
				document.getElementById("mensaje").style.display = "block";
				reconstruirParcela(recortada);
			}
			tipoModelo = "nube";
		} else if (system["formato"] == "text") {
			document.getElementById("recorte").style.display = "none";
			document.getElementById("seleccion").style.display = "none";
			if (system["seleccion"] == true) {
				eliminarRecorte();
			}
			system["seleccion"] = false;
			pcs.dispose();
			if (tipoModelo != "combi") {
				creacionPoligono(parcela, escena);
			}
			tipoModelo = "text";
		} else {
			if (tipoModelo == "nube") {
				creacionPoligono(parcela, escena);
			} else {
				document.getElementById("mensaje").style.display = "block";
				reconstruirParcela(recortada);
			}
			tipoModelo = "combi";
		}
	}
}


/*
 * 
 * Función de llamada a la detección de entidades
 *
 */
function detectar() {
	if (!detectado) {
		if (system["formato"] == "text" || system["formato"] == "combi") {

			var valores = $.ajax({
				url: 'Recursos/Scripts/Deteccion_Olivos/Debug/deteccion.php',
				data: { parcela: parcela },
				dataType: 'text',
				async: false
			}).responseText;
			limites = valores.split("/");
			detectado = true;

			//Mostrar la textura con el resultado de la detección
			//polygon.dispose();
			//creacionPoligono(parcela, detectado);

			aux = limites[3].split("-");
			olivos = []
			for (var i = 0; i < aux.length - 1; i++) {
				olivos.push(new BABYLON.Vector2(parseFloat(aux[i].split(",")[0].split("[")[1]), parseFloat(aux[i].split(",")[1].split("]")[0])));
			}
			document.getElementById("procesamientoVisual").style.display = "flex";
			posicionamiento(olivos, limites[1], limites[2]);

			if (nubeExists) {
				let integrarNube = { Integracion: function () { integrar() } };
				deteccion.add(integrarNube, 'Integracion').name("Identificar Olivos nube");
			}

			hl = new BABYLON.HighlightLayer("hl1", scene);
			//Ultimo olivo seleccionado
			ultimaSeleccion = 0;
			escena.onPointerDown = (evt) => {
				const ray = scene.createPickingRay(scene.pointerX, scene.pointerY);
				const raycastHit = scene.pickWithRay(ray);
				if (traslacion) {
					moverMesh(ultimaSeleccion, scene.pointerX, scene.pointerY);
				} else {
					if (raycastHit.pickedMesh && raycastHit.pickedMesh.metadata == "olivo") {
						hl.removeAllMeshes();
						hl.addMesh(raycastHit.pickedMesh, BABYLON.Color3.Green());
						if (ultimaSeleccion == 0) {
							let eliminarOlivo = { eliminaOlivo: function () { eliminaDetectado(ultimaSeleccion) } };
							deteccion.add(eliminarOlivo, 'eliminaOlivo').name("Eliminar olivo");
							let moverOlivo = { mueveOlivo: function () { moverDetectado() } };
							deteccion.add(moverOlivo, 'mueveOlivo').name("Mover olivo");
						}
						ultimaSeleccion = raycastHit.pickedMesh.id;
					}
					//Si se clica fuera de un olivo se deselecciona todo
					else {
						hl.removeAllMeshes();
						if (ultimaSeleccion != 0) {

							deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);
							deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);
						}
						ultimaSeleccion = 0;
					}
				}
			}
		} else {
			document.getElementById('deteccion').style.display = 'flex';
		}
	}
}


/*
 *
 * Función de inicialización de parámetros para análisis de puntos de la nube
 *
 */
function integrar() {
	if (deteccion.__controllers.length > 2) {
		deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);
		deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);
    }
	deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);

	analisisNube();
}


/*
 *
 * Función de muestreo de la voxelización
 *
 */
function mostrarVox() {

	for (var i = 0; i < voxelizacion.length; i++) {
		for (var x = 0; x < voxelizacion[i].length; x++) {
			for (var z = 0; z < voxelizacion[i][x].length; z++) {
				boundingBoxes[i][x][z].showBoundingBox = mostrarVoxelizacion["mostrarVox"];
			}
		}
	}

}


/*
 *
 * Función de ajuste de los valores de la GUI a los reales de la cámara
 *
 */
function ajuste() {
	if (tipoCamara != "cenital") {
		system["Zoom"] = camara.radius;
		system["rotationX"] = camara.beta;
		system["rotationY"] = camara.alpha;
	} else {
		system["Zoom"] = camaraCenital.position.y;
		system["moverX"] = camaraCenital.position.x;
		system["moverY"] = camaraCenital.position.z;
	}

}


/*
 *
 * Función de eliminación de un olivo detectado en la textura
 *
 */
function eliminaDetectado(id) {
	olivos_deteccion[id][0].dispose();
	deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);
	deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);
	ultimaSeleccion = 0;
}


/*
 *
 * Función de movimiento de un olivo detectado en la textura
 *
 */
function moverDetectado() {
	document.getElementById("mueveOlivo").style.display = "flex";
	parameters["Tipo"] = "cenital";
	setChecked();
	traslacion = true;

}


/*
 *
 * Función para la proyección de coordenadas de un olivo que se quiere desplazar
 *
 */
function moverMesh(id, posicionX, posicionY) {
	document.getElementById("mueveOlivo").style.display = "none";
	const getWorldPoint = () => {
		const point = BABYLON.Vector3.Unproject(
			new BABYLON.Vector3(posicionX, posicionY, 0),
			engine.getRenderWidth(),
			engine.getRenderHeight(),
			BABYLON.Matrix.Identity(),
			scene.getViewMatrix(),
			scene.getProjectionMatrix()
		);
		return point;
	};
	var posicion = getWorldPoint();

	olivos_deteccion[id][0].position.x = posicion.x * posicion.y;
	olivos_deteccion[id][0].position.z = posicion.z * posicion.y;
	traslacion = false;
}


/*
 *
 * Función de cancelación del movimiento
 *
 */
function cancelarMovimiento() {
	document.getElementById('mueveOlivo').style.display = 'none'
	traslacion = false;
}
