/*Archivos JS encargado del modelado de una escena dentro de la interfaz web*/

/*Variable que nos permite activar la seleccion por primera vez */
var activacion = true;
/*Atributos booleanos que definen si esos objetos se observaran dentro de la escena*/
var menu = false;
var seleccionActivo = false;

/*Atributos booleanos que definen el tipo de visión de la camara en la escena, si los dos se encuentran en false tendremos una visión en perspectiva*/
var vision_cenital = false;

/*Cambiar codigo para quitar*/
var xMax = -1000;
var xMin = 1000;
var zMax = -1000;
var zMin = 1000;

var funcion = "";
var nombre_modelo = "";

var lineasSeleccion = null;
var finSeleccion;
var puntos = 0;
var coordenadas = [];

var controlBotones;
var controlBotonesSeleccion;


/*Función que modela una escena preparada para albergar una nube de puntos*/
function Parking(nombre){
	nombre_modelo = nombre
	funcion = "Parking";
	const scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 6, 175, new BABYLON.Vector3(0,1,0), scene);
	camera.upperBetaLimit = Math.PI / 2.2;
	camera.attachControl(canvas, true);
	scene.activeCamera = camera;
	
	var cameraCenital = new BABYLON.FreeCamera("CameraCenital",new BABYLON.Vector3(0,200,0), scene);
	cameraCenital.setTarget(BABYLON.Vector3.Zero());
	cameraCenital.attachControl(canvas, true);
	
	//Eliminar controles anteriores
	cameraCenital.keysUp.pop();
	cameraCenital.keysDown.pop();
	//Zoom
	cameraCenital.keysUp.push(87); // "w"
	cameraCenital.keysDown.push(83); // "s"
	//Moverse
    cameraCenital.keysUpward.push(38); // "flecha arriba"
    cameraCenital.keysDownward.push(40); // "flecha abajo"
	cameraCenital.keysRotateRight.push(65);
	cameraCenital.keysRotateLeft.push(68);
	cameraCenital.speed = 0.75;
	cameraCenital.angularSensibility = 200000000000;

	
	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
	light.intensity = 1;
	
	// const x = [
        // new BABYLON.Vector3(-100000, 0, 0),
        // new BABYLON.Vector3(10, 0, 0)
    // ]
    // const y = [
        // new BABYLON.Vector3(0, -100000, 0),
        // new BABYLON.Vector3(0, 100000, 0)
    // ]
    // const z = [
        // new BABYLON.Vector3(0, 0, -100000),
        // new BABYLON.Vector3(0, 0, 10)
    // ]

    // const xl = BABYLON.MeshBuilder.CreateLines("lines", {points: x});
    // xl.color = new BABYLON.Color3(1, 0, 0);
    // const yl = BABYLON.MeshBuilder.CreateLines("lines", {points: y});
    // yl.color = new BABYLON.Color3(1, 1, 0);
    // const zl = BABYLON.MeshBuilder.CreateLines("lines", {points: z});
    // zl.color = new BABYLON.Color3(1, 0, 1);


	
	//Carga un fichero glb con la nube de puntos
	// BABYLON.SceneLoader.ImportMeshAsync("","Recursos/Modelos/", "fileName.glb", scene);
	parkingUja(scene);	
	
	
	creacionBotones(camera,cameraCenital,scene);
	
    return scene;
}

/*Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb*/
function parkingUja(scene){	
	fetch('Recursos/Modelos/olivar.txt')
	  .then(res => res.text())
	  .then(content => {
		var pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
		let lines = content.split(/\n/);
		var myfunc = function(particle,i) {
			campo = lines[i+2].split(" ");
			comparacionValores(campo);
			particle.position = new BABYLON.Vector3(parseFloat(campo[0]) ,parseFloat(campo[1]) + 20, parseFloat(campo[2]) + 30);
			particle.color = new BABYLON.Color4(parseFloat(campo[3]),parseFloat(campo[4]), parseFloat(campo[5]), parseFloat(campo[6]) );
		};
		for (let i = 2; i < lines.length; i++){
			pcs.addPoints(1, myfunc);	
		}
		pcs.buildMeshAsync();
		// BABYLON.GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
			// glb.downloadFiles();
		// });
		console.log(xMin);
		console.log(xMax);
		console.log(zMin);
		console.log(zMax);
	});
}

/* Función que compara todos los puntos de una nube y obtiene el mayor y menor en los ejes X y Z */
function comparacionValores(campo){
	if(xMin > parseFloat(campo[0])){
		xMin = parseFloat(campo[0]);
	}else if(xMax < parseFloat(campo[0])){
		xMax = parseFloat(campo[0]);
	}
	if(zMin > parseFloat(campo[2])){
		zMin = parseFloat(campo[2]);
	}else if(zMax < parseFloat(campo[2])){
		zMax = parseFloat(campo[2]);
	}
}


function seleccionRectangular(scene,camera,advancedTexture){
	controlBotonesSeleccion.rootContainer.isVisible = true;
    const getWorldPoint = () => {
        const point = BABYLON.Vector3.Unproject(
            new BABYLON.Vector3(scene.pointerX, scene.pointerY, 0),
            engine.getRenderWidth(),
            engine.getRenderHeight(),
            BABYLON.Matrix.Identity(),
            scene.getViewMatrix(),
            scene.getProjectionMatrix()
        );
        return point;
    };
    coordenadas = [];
    puntos = 0;
	finSeleccion = false;
    scene.onPointerObservable.add((eventData) => {
		if (!finSeleccion && vision_cenital && seleccionActivo) {
			if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
				var mousePoint = getWorldPoint();
				puntos += 1;
				coordenadas.push(mousePoint);
				if(puntos > 1){
					const options = {
						points: coordenadas,
						updatable: true
					}
					if(lineasSeleccion){
						lineasSeleccion.dispose();
						lineasSeleccion = null;
					}
					lineasSeleccion = BABYLON.MeshBuilder.CreateLines("lines", options);
				}
			}else if(eventData.type === BABYLON.PointerEventTypes.POINTERMOVE){
				if(puntos > 0){
					if(puntos > 1){
						coordenadas.pop();
						lineasSeleccion.dispose();
						lineasSeleccion = null;
						puntos -= 1;
					}
					var mousePoint = getWorldPoint();
					coordenadas.push( mousePoint);
					puntos += 1;
					options = {
						points: coordenadas,
						updatable: true
					}
					lineasSeleccion = BABYLON.MeshBuilder.CreateLines("lines", options);
				}	
			}else if(eventData.type === BABYLON.PointerEventTypes.POINTERDOUBLETAP){
				finSeleccion = true;
				coordenadas.pop();
				coordenadas.pop();
				coordenadas.push(coordenadas[0]);
				console.log(coordenadas);
				options = {
						points: coordenadas,
						updatable: true
				}
				lineasSeleccion.dispose();
				lineasSeleccion = null;
				lineasSeleccion = BABYLON.MeshBuilder.CreateLines("lines", options);
				camera.speed = 0;
				controlBotonesSeleccion.getControlByName("but4")._isVisible = true;
			}
		}
    });
	
}


async function loadGUI(scene, camera,cameraCenital, button2) {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await advancedTexture.parseFromURLAsync("Recursos/Modelos/Menu.json")
	advancedTexture.getControlByName("Opciones").isVisible = true;
	advancedTexture.getControlByName("Opciones").left = "0%";
    advancedTexture.getControlByName("Opciones").isPointerBlocker = false;
    scene.onKeyboardObservable.add((ev) => {
        if (ev.event.key === "Escape") {
            advancedTexture.rootContainer.isVisible = false;
        }else if (ev.event.key === "m" || ev.event.key === "M") {
            advancedTexture.rootContainer.isVisible = !advancedTexture.rootContainer.isVisible;
        }
    }, BABYLON.KeyboardEventTypes.KEYUP);
	button2.onPointerUpObservable.add(function() {
		advancedTexture.rootContainer.isVisible = !advancedTexture.rootContainer.isVisible;
	});
	configuracionGUI(advancedTexture, camera,cameraCenital,scene);
	

}

function configuracionGUI(advancedTexture, camera,cameraCenital,scene){
	vision = "Perspectiva";
	const botonSalir = advancedTexture.getControlByName("Cerrar_Menu");
	botonSalir.onPointerUpObservable.add(function() {
		advancedTexture.rootContainer.isVisible = false;
	});
	const botonSeleccion = advancedTexture.getControlByName("Seleccion");
	botonSeleccion.onIsCheckedChangedObservable.add(function(value) {
		seleccionActivo = value;
		if(!vision_cenital){
			botonSeleccion.isChecked = false;
			controlBotonesSeleccion.rootContainer.isVisible = false;
		}else{
			if (seleccionActivo) {
				controlBotonesSeleccion.rootContainer.isVisible = true;
				if (activacion) {
					seleccionRectangular(scene, cameraCenital, advancedTexture);
					activacion = false;
				} else {
					puntos = 0;
					coordenadas = [];
					finSeleccion = false;
				}
				cameraCenital.speed = 0;
			}else{
				cameraCenital.speed = 0.75;
				controlBotonesSeleccion.rootContainer.isVisible = false;
				if(lineasSeleccion){
					lineasSeleccion.dispose();
					lineasSeleccion = null;
				}
			}
		}
	});
	const zoom = advancedTexture.getControlByName("Zoom");
	zoom.minimum = 0;
	zoom.maximum = 400;
	zoom.value = 200;
	zoom.onValueChangedObservable.add(function(value) {
		if(seleccionActivo && vision_cenital){
			zoom.value = 200;
		}else{
			if(vision_cenital){
				cameraCenital.position = new BABYLON.Vector3(0,value,0);
			}else{
				camera.radius = value;
			}
		}
	});
	const perspectiva = advancedTexture.getControlByName("Perspectiva");
	perspectiva.onIsCheckedChangedObservable.add(function(state) {
        if (state) {
			vision_cenital = false;
			vision = "Perspectiva";
			scene.activeCamera = camera;
			camera.parent = null;
        }
    });
	const perspectivaMovimiento = advancedTexture.getControlByName("Perspectiva Movimiento");		
	perspectivaMovimiento.onIsCheckedChangedObservable.add(function(state) {
        if (state) {
			vision_cenital = false;
			scene.activeCamera = camera;
			vision = "PerspectivaMovimiento";
			var CoT = new BABYLON.TransformNode("root");
			camera.parent = CoT;
			var angle = 0;
			scene.registerBeforeRender(function(){
				CoT.rotation.y = angle;
				angle +=0.001;
			});
        }
    });
	const cenital = advancedTexture.getControlByName("Cenital");
	cenital.onIsCheckedChangedObservable.add(function(state) {
        if (state) {
            vision_cenital = true;
			scene.activeCamera = cameraCenital;
			vision = "Cenital";
        }else{
			botonSeleccion.isChecked = false;
			controlBotonesSeleccion.rootContainer.isVisible = false;
			if(lineasSeleccion){
				lineasSeleccion.dispose();
				lineasSeleccion = null;
			}
		}
		if(seleccionActivo && vision_cenital){
			seleccionRectangular(scene,cameraCenital);
		}
	});

	const botonCentrado = advancedTexture.getControlByName("CentrarVista");
	botonCentrado.onPointerUpObservable.add(function() {
		
		if(vision == "Perspectiva"){
			camera.setTarget(new BABYLON.Vector3(0,1,0));
			camera.beta = Math.PI / 6;
			camera.alpha = 0;
		}else if(vision == "PerspectivaMovimiento"){
			camera.setTarget(new BABYLON.Vector3(0,1,0));
			camera.beta = Math.PI / 6;
			camera.alpha = 0;
		}else{
			cameraCenital.setTarget(BABYLON.Vector3.Zero());
			cameraCenital.position = new BABYLON.Vector3(0,200,0);
		}
	});
	
	
	const botonInformacion = advancedTexture.getControlByName("InformacionSeleccion");
	botonInformacion.onPointerUpObservable.add(function() {
		location.href = "InformacionSeleccion.php?modelo=" + nombre_modelo;
	});
}


function creacionBotones(camera,cameraCenital,scene){
	controlBotones = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI"); 
	
	var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "< Volver");
	button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.width = "5%"
    button1.height = "3%";
	button1.fontSize = "2%";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        location.href = "InformacionParcela.php?modelo=" + nombre_modelo;
    });
    controlBotones.addControl(button1);
	
	var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Menu");
	button2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    button2.width = "10%"
    button2.height = "5%";
	button2.fontSize = "3%";
    button2.color = "white";
    button2.cornerRadius = 20;
    button2.background = "green";
    button2.onPointerUpObservable.add(function() {
        if(!menu){
			menu = true;
			loadGUI(scene, camera,cameraCenital, button2);
		}
    });
    controlBotones.addControl(button2);
	
	controlBotonesSeleccion = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	var button4 = BABYLON.GUI.Button.CreateSimpleButton("but4", "Recortar");
	button4.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
	button4.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	button4.width = "10%"
	button4.height = "5%";
	button4.fontSize = "2%";
	button4.color = "white";
	button4.cornerRadius = 20;
	button4.background = "green";
	button4.onPointerUpObservable.add(function() {
		if(finSeleccion){
			console.log("Recortar");
		}else{
			alert("La selección no esta completa");
		}
	});
	controlBotonesSeleccion.addControl(button4);
	
	var button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Eliminar Seleccion");
	button3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	button3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	button3.width = "10%"
	button3.height = "5%";
	button3.fontSize = "2%";
	button3.color = "white";
	button3.cornerRadius = 20;
	button3.background = "green";
	button3.onPointerUpObservable.add(function() {
		if(lineasSeleccion){
			lineasSeleccion.dispose();
			lineasSeleccion = null;
			puntos = 0;
			coordenadas = [];
			finSeleccion = false;
		}
	});
	controlBotonesSeleccion.addControl(button3);
	
	controlBotonesSeleccion.rootContainer.isVisible = false;
}
