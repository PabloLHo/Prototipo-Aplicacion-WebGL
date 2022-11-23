

/*Crea la ventana de visualización para un olivo concreto
	modelo: El nombre de la función de visualización a la que llamar
*/
const createScene = (modelo) => {
	return window["Parking"]();
}


/* Función encargada de repinta o recargar el modelo en caso de que se realize un cambio de modelo dentro de una misma página */
function resize() {		
	initFunction().then(() => {
		sceneToRender = scene   
	});
}

function Parking(){
	const scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 6, 150, new BABYLON.Vector3(0,1,0), scene);
	camera.upperBetaLimit = Math.PI / 2.2;
	camera.attachControl(canvas, true);
	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
	light.intensity = 1;
    // Load the model

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
	BABYLON.SceneLoader.ImportMeshAsync("","Recursos/Modelos/", "fileName.glb", scene);
	var CoT = new BABYLON.TransformNode("root");
	camera.parent = CoT;
	var angle = 0;
	scene.registerBeforeRender(function(){
        CoT.rotation.y = angle;
        angle +=0.001;
    });
	
    return scene;
}


