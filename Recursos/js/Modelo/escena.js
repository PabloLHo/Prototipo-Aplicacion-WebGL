/*Archivos JS encargado del modelado de una escena dentro de la interfaz web*/

/*Variable que nos permite activar la seleccion por primera vez */
var activacion = true;
var recortada = false;

var seleccionActivo = false;


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
var maxX = Number.MIN_VALUE;
var maxZ = Number.MIN_VALUE;
var maxY = Number.MIN_VALUE;
var minY = Number.MAX_VALUE;
var minX = Number.MAX_VALUE;
var minZ = Number.MAX_VALUE;
var medX = 0;
var medY = 0;
var medZ = 0;


//Coordenadas de posición de la textura
var coordenadas_textura = [];
var olivos_deteccion = []
var maxXT;
var maxYT;
var minXT;
var minYT;



/*Función que modela una escena preparada para albergar una nube de puntos*/
function Parcela(nombre) {

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
	var nube = false;
	obtenerTextura(nombre);

	fetch('Recursos/Modelos/Marmolejo_' + nombre + '.txt')
		.then(response => {
			if (response.ok) {
				nube = true;
				creacionParcela(scene, nombre);
			} else {
				nube = false;
			}
			document.getElementById("mensaje").style.display = "none";
			controlEscena(camera, cameraCenital, scene, nombre, nube);
	});


	//const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "Recursos/mapasAltura/prueba.png", { width: maxXT - minXT, height: maxYT - minYT, subdivisions: 20, minHeight: 0, maxHeight: 5 });
	//var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	//groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/ortofotos/Marmolejo_O_" + nombre + ".png", scene);
	//largeGround.material = groundMaterial;

	return scene;
}

/*Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb*/
async function creacionParcela(scene, parcela){	

	await fetch("Recursos/Modelos/Marmolejo_" + parcela + ".txt")
	  .then(res => res.text())
		.then(content => {
			let lines = content.split(/\n/);
			for (let i = 2; i < lines.length; i++) {
				campos = lines[i].split(" ");
				nube.push(lines[i]);
				comparar(campos);
			}

		});

	if (nube.length > 0) {
		medX = (maxX + minX) / 2;
		medZ = (maxZ + minZ) / 2;
		medY = (maxY + minY) / 2;


		var myfunc = function (particle, i) {
			campos = nube[i].split(" ");
			particle.position = new BABYLON.Vector3(parseFloat(campos[0]) - medX, parseFloat(campos[1]) - medY, -(parseFloat(campos[2]) - medZ));
			particle.color = new BABYLON.Color4(parseFloat(campos[3]), parseFloat(campos[4]), parseFloat(campos[5]), parseFloat(campos[6]));

		};

		pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
		for (let i = 0; i < nube.length; i++) {
			pcs.addPoints(1, myfunc);
		}
		pcs.buildMeshAsync();
		// BABYLON.GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
		// glb.downloadFiles();
		// });
	}

}


function reconstruirParcela() {
	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	var myfunc = function (particle, i) {
		campos = nube[i].split(" ");
		particle.position = new BABYLON.Vector3(parseFloat(campos[0]) - medX, parseFloat(campos[1]) - medY, (parseFloat(campos[2]) - medZ) * -1);
		particle.color = new BABYLON.Color4(parseFloat(campos[3]), parseFloat(campos[4]), parseFloat(campos[5]), parseFloat(campos[6]));
	};
	for (let i = 2; i < nube.length; i++) {
		pcs.addPoints(1, myfunc);
	}
	pcs.buildMeshAsync();
}

/*Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb*/
function recorteParcela(scene) {
	let vector = [];
	if (!recortada) {
		recortada = true;
		vector = nube.slice();
	} else {
		vector = nubeRecortada.slice();
	}
	nubeRecortada = [];
	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	var maxX2 = Number.MIN_VALUE;
	var maxZ2 = Number.MIN_VALUE;
	var maxY2 = Number.MIN_VALUE;
	var minY2 = Number.MAX_VALUE;
	var minX2 = Number.MAX_VALUE;
	var minZ2 = Number.MAX_VALUE;
	var actual = 0
	for (let i = 0; i < vector.length; i++) {
		punto = vector[i].split(" ");
		target = new BABYLON.Vector3(parseFloat(punto[0]) - medX, parseFloat(punto[1]) - medY, (parseFloat(punto[2]) - medZ) * -1);
		if (seleccionPuntos(target) != -1) {
			nubeRecortada.push(vector[i]);
			if (parseFloat(punto[0]) > maxX2)
				maxX2 = parseFloat(punto[0]);
			if (parseFloat(punto[0]) < minX2)
				minX2 = parseFloat(punto[0]);
			if (parseFloat(punto[1]) < minY2)
				minY2 = parseFloat(punto[1]);
			if (parseFloat(punto[1]) > maxY2)
				maxY2 = parseFloat(punto[1]);
			if (parseFloat(punto[2]) < minZ2)
				minZ2 = parseFloat(punto[2]);
			if (parseFloat(punto[2]) > maxZ2)
				maxZ2 = parseFloat(punto[2]);
		}
	}

	medX = (maxX2 + minX2) / 2;
	medZ = (maxZ2 + minZ2) / 2;
	medY = (maxY2 + minY2) / 2;
	myfunc = function (particle, i) {
		punto = nubeRecortada[i].split(" ");
		particle.position = new BABYLON.Vector3(parseFloat(punto[0]) - medX, parseFloat(punto[1]) - medY, (parseFloat(punto[2]) -medZ) * -1);
		particle.color = new BABYLON.Color4(parseFloat(punto[3]), parseFloat(punto[4]), parseFloat(punto[5]), parseFloat(punto[6]));
	};
	for (let i = 0; i < nubeRecortada.length; i++) {
		pcs.addPoints(1, myfunc);
	}
	pcs.buildMeshAsync();

}

function comparar(punto) {
	if (parseFloat(punto[0]) > maxX)
		maxX = parseFloat(punto[0]);
	if (parseFloat(punto[0]) < minX)
		minX = parseFloat(punto[0]);
	if (parseFloat(punto[1]) < minY)
		minY = parseFloat(punto[1]);
	if (parseFloat(punto[1]) > maxY)
		maxY = parseFloat(punto[1]);
	if (parseFloat(punto[2]) < minZ)
		minZ = parseFloat(punto[2]);
	if (parseFloat(punto[2]) > maxZ)
		maxZ = parseFloat(punto[2]);
}

function obtenerTextura(parcela) {
	var coordenadas = $.ajax({
		url: 'Recursos/php/obtenerParcela.php',
		data: { funcion: 'zona', modelo: parcela, zona: "" },
		dataType: 'text',
		async: false
	}).responseText;

	coordenadas = coordenadas.split("(")[2].split(")")[0];
	coordenadas = coordenadas.split(",");
	const corners = [];

	maxXT = Number.NEGATIVE_INFINITY;
	maxYT = Number.NEGATIVE_INFINITY;
	minYT = Number.MAX_VALUE;
	minXT = Number.MAX_VALUE;
	for (var i = 0; i < coordenadas.length; i++) {
		if (parseFloat(coordenadas[i].split(" ")[0]) > maxXT)
			maxXT = parseFloat(coordenadas[i].split(" ")[0]);
		if (parseFloat(coordenadas[i].split(" ")[0]) < minXT)
			minXT = parseFloat(coordenadas[i].split(" ")[0]);
		if (parseFloat(coordenadas[i].split(" ")[1]) < minYT)
			minYT = parseFloat(coordenadas[i].split(" ")[1]);
		if (parseFloat(coordenadas[i].split(" ")[1]) > maxYT)
			maxYT = parseFloat(coordenadas[i].split(" ")[1]);
	}

	medX = (maxXT + minXT) / 2;
	medY = (maxYT + minYT) / 2;

	if (zona != "") {
		var coordenadas_zona = $.ajax({
			url: 'Recursos/php/obtenerParcela.php',
			data: { funcion: 'zona', modelo: parcela, zona: zona },
			dataType: 'text',
			async: false
		}).responseText;
		coordenadas_zona = coordenadas_zona.split("(")[2].split(")")[0];
		coordenadas_zona = coordenadas_zona.split(",");

		var maxXT2 = Number.NEGATIVE_INFINITY;
		var maxYT2 = Number.NEGATIVE_INFINITY;
		var minYT2 = Number.MAX_VALUE;
		var minXT2 = Number.MAX_VALUE;

		for (var i = 0; i < coordenadas.length; i++) {
			if (parseFloat(coordenadas_zona[i].split(" ")[0]) > maxXT2)
				maxXT2 = parseFloat(coordenadas_zona[i].split(" ")[0]);
			if (parseFloat(coordenadas_zona[i].split(" ")[0]) < minXT2)
				minXT2 = parseFloat(coordenadas_zona[i].split(" ")[0]);
			if (parseFloat(coordenadas_zona[i].split(" ")[1]) < minYT2)
				minYT2 = parseFloat(coordenadas_zona[i].split(" ")[1]);
			if (parseFloat(coordenadas_zona[i].split(" ")[1]) > maxYT2)
				maxYT2 = parseFloat(coordenadas_zona[i].split(" ")[1]);
		}

		medX = (maxXT2 + minXT2) / 2;
		medY = (maxYT2 + minYT2) / 2;
	}

	maxXT -= medX;
	minXT -= medX;
	maxYT -= medY;
	minYT -= medY;



	for (var i = 0; i < coordenadas.length; i++) {
		corners.push(new BABYLON.Vector2(parseFloat(coordenadas[i].split(" ")[0]) - medX, parseFloat(coordenadas[i].split(" ")[1]) - medY));
	}
	const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
	sphere.position = new BABYLON.Vector3(parseFloat(coordenadas[2].split(" ")[0]) - medX, 0, parseFloat(coordenadas[2].split(" ")[1]) - medY);

	coordenadas_textura = corners;
}

function creacionPoligono(parcela, detectado) {

	var groundMaterial = new BABYLON.StandardMaterial("ground", escena);
	if (detectado) {
		groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/Scripts/Deteccion_Olivos/Output/OLIVE_DETECTION.jpg", escena);
	} else {
		groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/ortofotos/Marmolejo_O_" + parcela + ".png", escena);
	}

	const poly_tri = new BABYLON.PolygonMeshBuilder("polytri", coordenadas_textura);
	polygon = poly_tri.build();
	polygon.material = groundMaterial;
}


async function posicionamiento(posiciones, limiteX, limiteZ) {

	var factorX = (maxXT - minXT) / (parseFloat(limiteX));
	var factorZ = (maxYT - minYT) / (parseFloat(limiteZ));
	console.log(maxYT);
	console.log(limiteZ);
	console.log(minYT);
	for (let i = 0; i < posiciones.length; i++) {
		const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync("", "Recursos/Modelos/", "tree01.glb", scene);
		meshes[0].position.x = (posiciones[i].x * factorX) + minXT;
		//Se invierte porque el eje Z esta invertido en BabylonJS
		meshes[0].position.z = -(posiciones[i].y * factorZ) + maxYT;
		meshes[0].scalingDeterminant = 0.6;
		meshes.map((mesh) => {
			mesh.checkCollisions = true;
		});
		meshes.isPickable = true;
		meshes[0].getChildMeshes()[0].id = i;
		meshes[0].getChildMeshes()[0].metadata = "olivo";
		olivos_deteccion.push(meshes);
	}

}