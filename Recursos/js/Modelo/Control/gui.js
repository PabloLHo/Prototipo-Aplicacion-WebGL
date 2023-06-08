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


var gui;

const smallDevice = window.matchMedia("(min-width: 576px)");

smallDevice.addListener(handleDeviceChange);

function handleDeviceChange(e) {
	if (e.matches) gui.open();
	else gui.close();
}


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


	let centrarVista = { Centrar: function () { centrado() } };
	gui.add(centrarVista, 'Centrar').name("Centrar visión");



	let volverInformacion = { Volver: function () { volverPagInformacion() } };
	gui.add(volverInformacion, 'Volver').name("Volver Información");

	setInterval(ajuste, 100);
}


function setChecked(){
	if(parameters["Tipo"] == "perspectiva" || parameters["Tipo"] == "rotar"){
		if(tipoCamara == "cenital"){
			f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
			f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
			f_b.add(system, 'rotationX', 0,Math.PI / 2.2).name("Rotación X").listen().onChange(function(){ rotar("x")}).setValue(Math.PI / 4);
			f_b.add(system, 'rotationY', 0,2 * Math.PI).name("Rotación Y").listen().onChange(function(){ rotar("y")}).setValue(0);
		}
		escena.activeCamera = camara;
		var CoT = new BABYLON.TransformNode("root");
		camara.parent = null;
		if(parameters["Tipo"] == "rotar"){
			camara.parent = CoT;
			var angle = 0;
			escena.registerBeforeRender(function(){
				CoT.rotation.y = angle;
				angle +=0.001;
			});
		}
		system["seleccion"] = false;
		system["Zoom"] = 175;
	}else{
		f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
		f_b.remove(f_b.__controllers[f_b.__controllers.length - 1]);
		f_b.add(system, 'moverX', -100,100).name("Desplazar en X").listen().onChange(function(){ mover()}).setValue(0);
		f_b.add(system, 'moverY', -50,50).name("Desplazar en Y").listen().onChange(function(){ mover()}).setValue(0);
		system["Zoom"] = 200;
		escena.activeCamera = camaraCenital;
	}
	tipoCamara = parameters["Tipo"];
	centrado();
}





	

//Control de funciones
function aplicarZoom(){	
	if(seleccionActivo && tipoCamara == "cenital"){
		zoom.value = 200;
	}else{
		if(tipoCamara == "cenital"){
			camaraCenital.position = new BABYLON.Vector3(0,system["Zoom"],0);
		}else{
			/*camara.radius = 30625 * 1 / system["Zoom"];*/
			camara.radius = system["Zoom"];
		}
	}
}

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

function mover(){
	
	camaraCenital.position = new BABYLON.Vector3(system["moverX"],200,system["moverY"]);
	
}

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

function volverPagInformacion(){
	location.href = "InformacionParcela.php?modelo=" + nombre_modelo;
}


function seleccion(){
	if (tipoCamara != "cenital") {
		document.getElementById("seleccion").style.display = "flex";
		system["seleccion"] = false;
		seleccionActivo = system["seleccion"];
	}else{
		seleccionActivo = system["seleccion"];
		if (seleccionActivo) {
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
		}else{
			camaraCenital.speed = 0.75;
			if(lineasSeleccion){
				lineasSeleccion.dispose();
				lineasSeleccion = null;
			}
			eliminarRecorte();
		}
	}
	
}

function crearRecorte(){
	
	var recorteFolder = gui.addFolder('Recorte');
	let recortar = {Recortar: function(){ recorte() }};
	recorteFolder.add(recortar,'Recortar').name("Recortar Parcela");
	
	let eliminarSelec = {EliminarSeleccion: function(){ eliminarSeleccion() }};
	recorteFolder.add(eliminarSelec,'EliminarSeleccion').name("Eliminar Selección");
	
	recorteFolder.open();
	
}

function eliminarRecorte(){
	
	gui.removeFolder(gui.__folders["Recorte"]);
	
}

function crearReestructuracion() {

	let reestructurar = { reestructurar: function () { recomponerNube() } };
	gui.add(reestructurar, 'reestructurar').name("Recomponer nube");

}

function eliminarReestructuracion() {

	gui.remove(gui.__controllers[2]);

}

function recomponerNube() {
	document.getElementById("mensaje").style.display = "block";
	pcs.dispose();
	eliminarReestructuracion();
	reconstruirParcela(false);
}

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
		//recorteParcela(scene);
		recorteParcelaVoxelizado(scene, coordenadas);
		crearReestructuracion();
	}else{
		alert("La selección no esta completa");
	}
	
}

function eliminarSeleccion(){
	
	if(lineasSeleccion){
		lineasSeleccion.dispose();
		lineasSeleccion = null;
		puntos = 0;
		coordenadas = [];
		finSeleccion = false;
	}
		
}

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
			document.getElementById("mensaje").style.display = "block";
			polygon.dispose();
			for (var i = 0; i < olivos_deteccion.length; i++) {
				olivos_deteccion[i][0].dispose();
			}
			if (tipoModelo != "combi") {
				reconstruirParcela(recortada);
			}
			tipoModelo = "nube";
		} else if (system["formato"] == "text") {
			if (system["seleccion"] == true) {
				eliminarRecorte();
			}
			system["seleccion"] = false;
			pcs.dispose();
			if (tipoModelo != "combi") {
				creacionPoligono(parcela, detectado);
			}
			tipoModelo = "text";
		} else {
			if (tipoModelo == "nube") {
				creacionPoligono(parcela, detectado);
			} else {
				document.getElementById("mensaje").style.display = "block";
				reconstruirParcela(recortada);
			}
			tipoModelo = "combi";
		}
	}
}

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

			posicionamiento(olivos, limites[1], limites[2]);

			if (nubeExists) {
				let integrarNube = { Detecc: function () { integrar() } };
				deteccion.add(integrarNube, 'Integracion').name("Identificar Olivos nube");
			}

			//var hl = new BABYLON.HighlightLayer("hl1", scene);
			////Ultimo olivo seleccionado
			//var ultimaSeleccion = 0;
			//escena.onPointerDown = (evt) => {
			//	if (evt.button == 2 && vision_pov) {
			//		//Convierte el raton en un joystick de manera que al moverlo se mueve la camara en primera persona
			//		engine.enterPointerlock();
			//	}
			//	if (evt.button == 1) {
			//		engine.exitPointerlock();
			//	}
			//	const ray = scene.createPickingRay(scene.pointerX, scene.pointerY);
			//	const raycastHit = scene.pickWithRay(ray);
			//	if (raycastHit.pickedMesh && raycastHit.pickedMesh.metadata == "olivo") {
			//		hl.removeAllMeshes();
			//		hl.addMesh(raycastHit.pickedMesh, BABYLON.Color3.Green());
			//		ultimaSeleccion = raycastHit.pickedMesh.id;
			//	}
			//	//Si se clica fuera de un olivo se deselecciona todo
			//	else {
			//		hl.removeAllMeshes();
			//		ultimaSeleccion = 0;
			//	}
			//}
		} else {
			document.getElementById('deteccion').style.display = 'flex';
		}
	}
}

function integrar() {
	deteccion.remove(deteccion.__controllers[deteccion.__controllers.length - 1]);

	analisisNube();
}

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
