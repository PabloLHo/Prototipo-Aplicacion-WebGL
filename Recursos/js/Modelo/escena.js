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
var voxelizacion = [];
var boundingBoxes = [];
var voxelesAnalizar = [];
var tamVoxel = 10;

//Elementos terreno para textura
var ground;
var max = new BABYLON.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
var min = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
var med = new BABYLON.Vector3(0, 0, 0);

//Elementos recorte
var nubeRecortada = [];
var maxR = new BABYLON.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
var minR = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
var medR = new BABYLON.Vector3(0, 0, 0);


//Coordenadas de posición de la textura
var coordenadas_textura = [];
var olivos_deteccion = [];
var maxT = new BABYLON.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
var minT = new BABYLON.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
var medT = new BABYLON.Vector2(0,0);



/*Función que modela una escena preparada para albergar una nube de puntos*/
function Parcela(nombre) {

	const scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 4, 175, new BABYLON.Vector3(0,1,0), scene);
	//camera.upperBetaLimit = Math.PI / 2.2;
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
				creacionParcela(scene, nombre,camera, cameraCenital, nube);
			} else {
				nube = false;
				document.getElementById("mensaje").style.display = "none";
				controlEscena(camera, cameraCenital, scene, nombre, nube);
			}
			
	});

	//const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "Recursos/mapasAltura/prueba.png", { width: maxXT - minXT, height: maxYT - minYT, subdivisions: 20, minHeight: 0, maxHeight: 5 });
	//var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	//groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/ortofotos/Marmolejo_O_" + nombre + ".png", scene);
	//largeGround.material = groundMaterial;


	return scene;
}

/*Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb*/
async function creacionParcela(scene, parcela, camera, cameraCenital, nubeBool){

	await fetch("Recursos/Modelos/Marmolejo_" + parcela + ".txt")
	  .then(res => res.text())
		.then(content => {
			let lines = content.split(/\n/);
			for (let i = 2; i < lines.length; i++) {
				campos = lines[i].split(" ");
				datos = new Array();
				for (var x = 0; x < campos.length; x++) {
					datos.push(parseFloat(campos[x]));
				}
				nube.push(datos);
				comparar(campos);
			}

		});
	if (nube.length > 0) {

		med.x = (max.x + min.x) / 2, med.y = (max.y + min.y) / 2, med.z = (max.z + min.z) / 2;

		min.x -= med.x, max.x -= med.x;
		min.y -= med.y, max.y -= med.y;
		min.z -= med.z, max.z -= med.z;


		voxelizar(max, min, med);

		var myfunc = function (particle, i) {
			nube[i][0] -= med.x;
			nube[i][1] -= med.y;
			nube[i][2] = - (nube[i][2] - med.z);
			particle.position = new BABYLON.Vector3(nube[i][0], nube[i][1], nube[i][2]);
			particle.color = new BABYLON.Color4(nube[i][3], nube[i][4], nube[i][5], nube[i][6]);
			var y = parseInt((nube[i][0] - min.x) / tamVoxel);
			var x = parseInt((nube[i][1] - min.y) / tamVoxel);
			var z = parseInt((nube[i][2] - min.z) / tamVoxel);

			voxelizacion[y][x][z].push(i);
		};

		pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
		for (var i = 0; i < nube.length; i++) {
			pcs.addPoints(1, myfunc);
		}
		pcs.buildMeshAsync();
		document.getElementById("mensaje").style.display = "none";
		controlEscena(camera, cameraCenital, scene, parcela, nubeBool);
	}

}


function reconstruirParcela(origen) {
	if (!origen) {
		pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
		recortada = false;
		voxelizar(max, min);
		var myfunc = function (particle, i) {
			particle.position = new BABYLON.Vector3(nube[i][0], nube[i][1], nube[i][2]);
			particle.color = new BABYLON.Color4(nube[i][3], nube[i][4], nube[i][5], nube[i][6]);
			var y = parseInt((nube[i][0] - min.x) / tamVoxel);
			var x = parseInt((nube[i][1] - min.y) / tamVoxel);
			var z = parseInt((nube[i][2] - min.z) / tamVoxel);
			voxelizacion[y][x][z].push(i);
		};
		for (let i = 2; i < nube.length; i++) {
			pcs.addPoints(1, myfunc);
		}
		pcs.buildMeshAsync();
		document.getElementById("mensaje").style.display = "none";
	} else {
		pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
		var myfunc = function (particle, i) {
			particle.position = new BABYLON.Vector3(nubeRecortada[i][0], nubeRecortada[i][1], nubeRecortada[i][2]);
			particle.color = new BABYLON.Color4(nubeRecortada[i][3], nubeRecortada[i][4], nubeRecortada[i][5], nubeRecortada[i][6]);
		};
		for (let i = 2; i < nubeRecortada.length; i++) {
			pcs.addPoints(1, myfunc);
		}
		pcs.buildMeshAsync();
		document.getElementById("mensaje").style.display = "none";
    }
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
	maxR = new BABYLON.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
	minR = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
	for (let i = 0; i < vector.length; i++) {
		target = new BABYLON.Vector3(vector[i][0], vector[i][1], vector[i][2]);
		if (seleccionPuntos(target) != -1) {
			nubeRecortada.push(vector[i]);
			if (vector[i][0] > maxR.x)
				maxR.x = vector[i][0];
			if (vector[i][0] < minR.x)
				minR.x = vector[i][0];
			if (vector[i][1] < minR.y)
				minR.y = vector[i][1];
			if (vector[i][1] > maxR.y)
				maxR.y = vector[i][1];
			if (vector[i][2] < minR.z)
				minR.z = vector[i][2];
			if (vector[i][2] > maxR.z)
				maxR.z = vector[i][2];
		}
	}

	medR.x = (maxR.x + minR.x) / 2, medR.z = (maxR.z + minR.z) / 2, medR.y = (maxR.y + minR.y) / 2;

	minR.x -= medR.x, maxR.x -= medR.x;
	minR.y -= medR.y, maxR.y -= medR.y;
	minR.z -= medR.z, maxR.z -= medR.z;

	medR.x = (maxR.x + minR.x) / 2, medR.z = (maxR.z + minR.z) / 2, medR.y = (maxR.y + minR.y) / 2;

	voxelizar(maxR, minR);

	myfunc = function (particle, i) {
		nubeRecortada[i][0] -= medR.x;
		nubeRecortada[i][1] -= medR.y;
		nubeRecortada[i][2] -= medR.z;
		particle.position = new BABYLON.Vector3(nubeRecortada[i][0], nubeRecortada[i][1], nubeRecortada[i][2]);
		particle.color = new BABYLON.Color4(nubeRecortada[i][3], nubeRecortada[i][4], nubeRecortada[i][5], nubeRecortada[i][6]);
		var y = parseInt((nubeRecortada[i][0] - minR.x) / tamVoxel);
		var x = parseInt((nubeRecortada[i][1] - minR.y) / tamVoxel);
		var z = parseInt((nubeRecortada[i][2] - minR.z) / tamVoxel);
		voxelizacion[y][x][z].push(i);
	};

	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	for (let i = 0; i < nubeRecortada.length; i++) {
		pcs.addPoints(1, myfunc);
	}
	pcs.buildMeshAsync();

}

function recorteParcelaVoxelizado(scene, coordenadas) {
	let vector = [];
	if (!recortada) {
		recortada = true;
		vector = nube.slice();
		minR = min;
		maxR = max;
	} else {
		vector = nubeRecortada.slice();
	}


	var minVoxX, minVoxZ, maxVoxX, maxVoxZ;
	minVoxX = minVoxZ = Number.MAX_VALUE;
	maxVoxX = maxVoxZ = 0;
	for (var i = 0; i < coordenadas.length; i++) {
		if (coordenadas[i].x < minR.x)
			auxX = 0;
		else if (coordenadas[i].x > maxR.x)
			auxX = voxelizacion.length - 1;
		else
			auxX = parseInt((coordenadas[i].x - minR.x) / tamVoxel);
		if (coordenadas[i].z < minR.z)
			auxZ = 0;
		else if (coordenadas[i].z > maxR.z)
			auxZ = voxelizacion[0][0].length - 1;
		else
			auxZ = parseInt((coordenadas[i].z - minR.z) / tamVoxel);
		if (auxX < minVoxX)
			minVoxX = auxX;
		if (auxZ < minVoxZ)
			minVoxZ = auxZ;
		if (auxX > maxVoxX)
			maxVoxX = auxX + 1;
		if (auxZ > maxVoxZ)
			maxVoxZ = auxZ + 1;
	}

	nubeRecortada = [];
	maxR = new BABYLON.Vector3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
	minR = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
	for (let i = minVoxX; i < maxVoxX; i++) {
		for (let x = 0; x < voxelizacion[i].length; x++) {
			for (let z = minVoxZ; z < maxVoxZ; z++) {
				for (let p = 0; p < voxelizacion[i][x][z].length; p++) {
					punto = vector[voxelizacion[i][x][z][p]];
					target = new BABYLON.Vector3(punto[0], punto[1], punto[2]);
					if (seleccionPuntos(target) != -1) {
						nubeRecortada.push(vector[voxelizacion[i][x][z][p]]);
						if (punto[0] > maxR.x)
							maxR.x = punto[0];
						if (punto[0] < minR.x)
							minR.x = punto[0];
						if (punto[1] < minR.y)
							minR.y = punto[1];
						if (punto[1] > maxR.y)
							maxR.y = punto[1];
						if (punto[2] < minR.z)
							minR.z = punto[2];
						if (punto[2] > maxR.z)
							maxR.z = punto[2];
					}
				}
			}
		}
	}

	medR.x = (maxR.x + minR.x) / 2, medR.z = (maxR.z + minR.z) / 2, medR.y = (maxR.y + minR.y) / 2;


	voxelizar(maxR, minR);

	myfunc = function (particle, i) {
		particle.position = new BABYLON.Vector3(nubeRecortada[i][0], nubeRecortada[i][1], nubeRecortada[i][2]);
		particle.color = new BABYLON.Color4(nubeRecortada[i][3], nubeRecortada[i][4], nubeRecortada[i][5], nubeRecortada[i][6]);
		var y = parseInt((nubeRecortada[i][0] - minR.x) / tamVoxel);
		var x = parseInt((nubeRecortada[i][1] - minR.y) / tamVoxel);
		var z = parseInt((nubeRecortada[i][2] - minR.z) / tamVoxel);
		voxelizacion[y][x][z].push(i);
	};

	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	for (let i = 0; i < nubeRecortada.length; i++) {
		pcs.addPoints(1, myfunc);
	}
	pcs.buildMeshAsync();

}

function comparar(punto) {
	if (parseFloat(punto[0]) > max.x)
		max.x = parseFloat(punto[0]);
	if (parseFloat(punto[0]) < min.x)
		min.x = parseFloat(punto[0]);
	if (parseFloat(punto[1]) < min.y)
		min.y = parseFloat(punto[1]);
	if (parseFloat(punto[1]) > max.y)
		max.y = parseFloat(punto[1]);
	if (parseFloat(punto[2]) < min.z)
		min.z = parseFloat(punto[2]);
	if (parseFloat(punto[2]) > max.z)
		max.z = parseFloat(punto[2]);
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
	maxT = new BABYLON.Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
	minT = new BABYLON.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);

	for (var i = 0; i < coordenadas.length; i++) {
		if (parseFloat(coordenadas[i].split(" ")[0]) > maxT.x)
			maxT.x = parseFloat(coordenadas[i].split(" ")[0]);
		if (parseFloat(coordenadas[i].split(" ")[0]) < minT.x)
			minT.x = parseFloat(coordenadas[i].split(" ")[0]);
		if (parseFloat(coordenadas[i].split(" ")[1]) < minT.y)
			minT.y = parseFloat(coordenadas[i].split(" ")[1]);
		if (parseFloat(coordenadas[i].split(" ")[1]) > maxT.y)
			maxT.y = parseFloat(coordenadas[i].split(" ")[1]);
	}

	medT.x = (maxT.x + minT.x) / 2;
	medT.y = (maxT.y + minT.y) / 2;

	if (zona != "") {
		var coordenadas_zona = $.ajax({
			url: 'Recursos/php/obtenerParcela.php',
			data: { funcion: 'zona', modelo: parcela, zona: zona },
			dataType: 'text',
			async: false
		}).responseText;
		coordenadas_zona = coordenadas_zona.split("(")[2].split(")")[0];
		coordenadas_zona = coordenadas_zona.split(",");

		for (var i = 0; i < coordenadas.length; i++) {
			if (parseFloat(coordenadas_zona[i].split(" ")[0]) > maxT2.x)
				maxT2.x = parseFloat(coordenadas_zona[i].split(" ")[0]);
			if (parseFloat(coordenadas_zona[i].split(" ")[0]) < minT2.x)
				minT2.x = parseFloat(coordenadas_zona[i].split(" ")[0]);
			if (parseFloat(coordenadas_zona[i].split(" ")[1]) < minT2y)
				minT2.y = parseFloat(coordenadas_zona[i].split(" ")[1]);
			if (parseFloat(coordenadas_zona[i].split(" ")[1]) > maxT2.y)
				maxT2.y = parseFloat(coordenadas_zona[i].split(" ")[1]);
		}

		medT.x = (maxT2.x + minT2.x) / 2;
		medT.y = (maxT2.y + minT2.y) / 2;
	}

	maxT.x -= medT.x, minT.x -= medT.x;
	maxT.y -= medT.y, minT.y -= medT.y;


	for (var i = 0; i < coordenadas.length; i++) {
		corners.push(new BABYLON.Vector2(parseFloat(coordenadas[i].split(" ")[0]) - medT.x, parseFloat(coordenadas[i].split(" ")[1]) - medT.y));
	}

	medT.x = (maxT.x + minT.x) / 2;
	medT.y = (maxT.y + minT.y) / 2;


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

	var factorX = (maxT.x - minT.x) / (parseFloat(limiteX));
	var factorZ = (maxT.y - minT.y) / (parseFloat(limiteZ));
	voxelesAnalizar = new Array();
	for (let i = 0; i < posiciones.length; i++) {
		const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync("", "Recursos/Modelos/", "tree01.glb", scene);
		meshes[0].position.x = (posiciones[i].x * factorX) + minT.x;
		//Se invierte porque el eje Z esta invertido en BabylonJS
		meshes[0].position.z = -(posiciones[i].y * factorZ) + maxT.y;
		meshes[0].scalingDeterminant = 0.6;
		meshes.map((mesh) => {
			mesh.checkCollisions = true;
		});
		meshes.isPickable = true;
		meshes[0].getChildMeshes()[0].id = i;
		meshes[0].getChildMeshes()[0].metadata = "olivo";
		olivos_deteccion.push(meshes);
		ray = lanzarRayo(meshes[0]);

		voxeles = new Array();
		//rayTraversal(ray, voxeles, new BABYLON.Vector3(minT.x, -20, minT.y), new BABYLON.Vector3(maxT.x, 20, maxT.y));

		rayTraversalSimplificado(ray, voxeles, new BABYLON.Vector3(minT.x, -20, minT.y), new BABYLON.Vector3(maxT.x, 20, maxT.y));

		for (var x = 0; x < voxeles.length; x++) {
			if (voxelesAnalizar.indexOf(voxeles[x]) == -1) {
				voxelesAnalizar.push(voxeles[x]);
			}
		}
		
	}
}

function lanzarRayo(olivo) {
	var origin = olivo.position;
	var length = 100;
	var forward = new BABYLON.Vector3(0, 1, 0);
	forward = vecToLocal(forward, olivo);

	var direction = forward.subtract(origin);
	direction = BABYLON.Vector3.Normalize(direction);


	var ray = new BABYLON.Ray(origin, direction, length);
	//let rayHelper = new BABYLON.RayHelper(ray);

	//rayHelper.show(scene);
	//rayHelper._renderLine.color = new BABYLON.Color3(1, 0, 0);
	return ray;

}

function vecToLocal(vector, mesh) {
	var m = mesh.getWorldMatrix();
	var v = BABYLON.Vector3.TransformCoordinates(vector, m);
	return v;
}


function analisisNube() {
	var puntosOlivos = new Array();

	for (var i = 0; i < voxelesAnalizar.length; i++) {
		for (var x = 0; x < voxelesAnalizar[i].length; x++) {
			var color = new BABYLON.Color3(voxelesAnalizar[i][x][3] * 255, voxelesAnalizar[i][x][4] * 255, voxelesAnalizar[i][x][5] * 255)
			if ((color.g - 60) > color.r && (color.g - 60) > color.b)
				puntosOlivos.push(voxelesAnalizar[i][x]);
        }
	}
	pcs.dispose();
	var myfunc = function (particle, i) {
		particle.position = new BABYLON.Vector3(puntosOlivos[i][0], puntosOlivos[i][1], puntosOlivos[i][2]);
		particle.color = new BABYLON.Color4(puntosOlivos[i][3], puntosOlivos[i][4], puntosOlivos[i][5], puntosOlivos[i][6]);
	};

	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	for (var i = 0; i < puntosOlivos.length; i++) {
		pcs.addPoints(1, myfunc);
	}
	pcs.buildMeshAsync();
	//var umbralDistancia = 2;
	//var clusters = new Array();
	//var centroides = new Array();
	//clusters.push(new Array());
	//clusters[0].push(puntosOlivos[0]);
	//centroides.push(new BABYLON.Vector3(puntosOlivos[0][0], puntosOlivos[0][1], puntosOlivos[0][2]));

	////proceso de clustering
	//for (var i = 1; i < puntosOlivos.length; i++) {
	//	var min = FLT_MAX;
	//	var indice = -1;
	//	for (var x = 0; x < centroides.length; x++) {
	//		distancia = distancia(puntosOlivos[i], centroides[x]);
	//		if (distancia < min) {
	//			min = distancia;
	//			indice = x;
 //           }
	//	}
	//	if (min <= umbralDistancia) {
	//		clusters[indice].push(puntosOlivos[i]);
	//		centroide = recalculoCentroide(clusters[indice]);
	//		centroides[indice] = centroide;
	//	} else {
	//		clusters.push(new Array());
	//		clusters[clusters.length - 1].push(puntosOlivos[i]);
	//		centroides.push(new BABYLON.Vector3(puntosOlivos[i][0], puntosOlivos[i][1], puntosOlivos[i][2]));
 //       }
	//}
	//console.log(centroides);
	//console.log(clusters);
}

function distancia(punto, punto_2) {

	var dx = punto[0] - punto_2[0];
	var dy = punto[1] - punto_2[1];
	var dz = punto[2] - punto_2[2];


	return Math.sqrt(dx * dx + dy * dy + dz * dz);

}

function recalculoCentroide(cluster) {

	var x = y = z = 0;
	for (var i = 0; i < cluster.length; i++) {
		x += cluster[i][0];
		y += cluster[i][1];
		z += cluster[i][2];
    }

	return new Array(x / cluster.length, y / cluster.length, z / cluster.length);
}


