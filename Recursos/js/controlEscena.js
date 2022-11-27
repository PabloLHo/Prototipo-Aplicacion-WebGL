/*Archivos JS encargado del modelado de una escena dentro de la interfaz web*/

async function loadGUI(scene, camera,cameraCenital, button2) {
    controlGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await controlGUI.parseFromURLAsync("Recursos/Modelos/Menu.json")
	controlGUI.getControlByName("Opciones").isVisible = true;
	controlGUI.getControlByName("Opciones").left = "0%";
    controlGUI.getControlByName("Opciones").isPointerBlocker = false;
    scene.onKeyboardObservable.add((ev) => {
        if (ev.event.key === "Escape") {
            controlGUI.rootContainer.isVisible = false;
        }else if (ev.event.key === "m" || ev.event.key === "M") {
            controlGUI.rootContainer.isVisible = !controlGUI.rootContainer.isVisible;
        }
    }, BABYLON.KeyboardEventTypes.KEYUP);
	button2.onPointerUpObservable.add(function() {
		controlGUI.rootContainer.isVisible = !controlGUI.rootContainer.isVisible;
	});
	configuracionGUI(controlGUI, camera,cameraCenital,scene);
	

}

function configuracionGUI(controlGUI, camera,cameraCenital,scene){
	vision = "Perspectiva";
	const botonSalir = controlGUI.getControlByName("Cerrar_Menu");
	botonSalir.onPointerUpObservable.add(function() {
		controlGUI.rootContainer.isVisible = false;
	});
	const botonSeleccion = controlGUI.getControlByName("Seleccion");
	botonSeleccion.onIsCheckedChangedObservable.add(function(value) {
		seleccionActivo = value;
		if(!vision_cenital){
			botonSeleccion.isChecked = false;
			controlBotonesSeleccion.rootContainer.isVisible = false;
		}else{
			if (seleccionActivo) {
				controlBotonesSeleccion.rootContainer.isVisible = true;
				if (activacion) {
					seleccionRectangular(scene, cameraCenital, controlGUI);
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
	const zoom = controlGUI.getControlByName("Zoom");
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
	const perspectiva = controlGUI.getControlByName("Perspectiva");
	perspectiva.onIsCheckedChangedObservable.add(function(state) {
        if (state) {
			vision_cenital = false;
			vision = "Perspectiva";
			scene.activeCamera = camera;
			camera.parent = null;
        }
    });
	const perspectivaMovimiento = controlGUI.getControlByName("Perspectiva Movimiento");		
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
	const cenital = controlGUI.getControlByName("Cenital");
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
	});

	const botonCentrado = controlGUI.getControlByName("CentrarVista");
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
	
	
	const botonInformacion = controlGUI.getControlByName("InformacionSeleccion");
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
			for(var i = 0; i < coordenadas.length - 1; i++){
				coordenadas[i].x = coordenadas[i].x * coordenadas[i].y;
				coordenadas[i].z = coordenadas[i].z * coordenadas[i].y;
			}
			if(lineasSeleccion){
				lineasSeleccion.dispose();
				lineasSeleccion = null;
			}
			controlBotonesSeleccion.rootContainer.isVisible = false;
			controlGUI.getControlByName("Seleccion").isChecked = false;
			pcs.dispose();
			recorteParcela(scene);
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