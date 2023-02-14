/*Archivos JS encargado del modelado de una escena dentro de la interfaz web*/

/*Variable que nos permite activar la seleccion por primera vez */
var activacion = true;
var recortada = false;
var menu = false;

var seleccionActivo = false;

/*Atributos booleanos que definen el tipo de visión de la camara en la escena, si los dos se encuentran en false tendremos una visión en perspectiva*/
var vision_cenital = false;

//Definicion tipo modelo
var funcion = "";
var nombre_modelo = "";

//Seleccion
var lineasSeleccion = null;
var finSeleccion;
var puntos = 0;
var coordenadas = [];

//Vectores coordenadas nube
var pcs;
var nube = [];
var nubeRecortada = [];

//Elemento terreno para textura
var ground;



/*Función que modela una escena preparada para albergar una nube de puntos*/
function Parcela(nombre){

	nombre_modelo = nombre
	const scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 4, 175, new BABYLON.Vector3(0,1,0), scene);
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

	creacionParcela(scene);

	// const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "Recursos/imagenes/prueba.jpg", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
    // var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    // groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/imagenes/ParcelaMarmolejo.jpg", scene);
	
	// ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 40, width: 126, subdivisions: 4});
    // ground.material = groundMaterial;
	
	controlEscena(camera,cameraCenital,scene);
	
    return scene;
}

/*Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb*/
async function creacionParcela(scene){	

	await fetch('Recursos/Modelos/olivar.txt')
	  .then(res => res.text())
		.then(content => {
			pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
			let lines = content.split(/\n/);
			var myfunc = function (particle, i) {
				  campos = lines[i+2].split(" ");
				  nube.push(lines[i+2]);
				  particle.position = new BABYLON.Vector3(parseFloat(campos[0]), parseFloat(campos[1]) + 20, parseFloat(campos[2]) + 30);
				  particle.color = new BABYLON.Color4(parseFloat(campos[3]), parseFloat(campos[4]), parseFloat(campos[5]), parseFloat(campos[6]));
			};
			for (let i = 2; i < lines.length; i++) {
				pcs.addPoints(1, myfunc);
			}
			pcs.buildMeshAsync();
			// BABYLON.GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
				// glb.downloadFiles();
			// });

	});

}

/*Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb*/
function recorteParcela(scene){	
	let vector = [];
	if(!recortada){
		recortada = true;
		vector = nube.slice();
	}else{
		vector = nubeRecortada.slice();
	}
	nubeRecortada = [];
	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	var actual = 0
	var myfunc = function (particle, i) {
		punto = vector[actual].split(" ");
		nubeRecortada.push(vector[actual]);
		particle.position = new BABYLON.Vector3(parseFloat(punto[0]), parseFloat(punto[1]) + 20, parseFloat(punto[2]) + 30);
		particle.color = new BABYLON.Color4(parseFloat(punto[3]), parseFloat(punto[4]), parseFloat(punto[5]), parseFloat(punto[6]));
	};
	for (let i = 0; i < vector.length; i++) {
		punto = vector[i].split(" ");
		target = new BABYLON.Vector3(parseFloat(punto[0]),parseFloat(punto[1]) + 20,parseFloat(punto[2]) + 30);
		if(seleccionPuntos(target) != -1){
			actual = i;
			pcs.addPoints(1, myfunc);
		}
	}
	pcs.buildMeshAsync();
}
