/* Función encargada de repinta o recargar el modelo en caso de que se realize un cambio de modelo dentro de una misma página */
function Parcela(){
	const scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 3, 150, new BABYLON.Vector3(0,1,0), scene);
	camera.upperBetaLimit = Math.PI / 2.2;
	camera.attachControl(canvas, true);
	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
	light.intensity = 1;
    // Load the model
	
	//Carga un fichero glb con la nube de puntos
	BABYLON.SceneLoader.ImportMeshAsync("","Recursos/Modelos/", "fileName.glb", scene);
	var CoT = new BABYLON.TransformNode("root");
	camera.parent = CoT;
	var angle = 0;
	scene.registerBeforeRender(function(){
        CoT.rotation.y = angle;
        angle +=0.0005;
    });
	
    return scene;
}


