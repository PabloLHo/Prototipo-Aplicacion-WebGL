/*Archivos JS encargado del modelado de una escena dentro de la interfaz web*/

/*Variable que nos permite activar la seleccion por primera vez */
var activacion = true;
var recortada = false;
var poligonoCreado = false;
var seleccionActivo = false;

//Seleccion
var lineasSeleccion = null;
var finSeleccion;
var puntos = 0;
var coordenadas = [];

//Vectores coordenadas nube
var pcs;
var nube = [];
var nubeExists = false;
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
var posicionesY = [];
var maxT = new BABYLON.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
var minT = new BABYLON.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
var medT = new BABYLON.Vector2(0, 0);
var polygon;



/*
 * Función que modela una escena preparada para albergar una nube de puntos
 * 
 * nombre: Variable string que almacena el identificador de la parcela a renderizar
 * 
 */
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

	obtenerTextura(nombre);

	fetch('Recursos/Modelos/Marmolejo_' + nombre + '.txt')
		.then(response => {
			if (response.ok) {
				nubeExists = true;
				creacionParcela(scene, nombre, camera, cameraCenital, nubeExists);
			} else {
				nubeExists = false;
				document.getElementById("mensaje").style.display = "none";
				controlEscena(camera, cameraCenital, scene, nombre, nubeExists);
			}
			
	});

	return scene;
}


/*
 * Función que lee el fichero txt con los puntos y genera un sistema de nube de puntos con los datos de los mismos y lo descarga como glb
 *
 * parcela: Variable String identificador de la parcela a renderizar
 * camera: Variable de Babylon que almacena la camara del sistema
 * cameraCenital: Variable del sistema que almacena la camara cpm visión cenital del sistema
 * nubeBool: Booleano que indica que la nube existe en el sistema
 *
 */
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
				comparar(datos, max, min);
			}

		});
	if (nube.length > 0) {
		var factorZ = (maxT.y - minT.y) / (max.z - min.z);
		min.z *= factorZ;
		max.z *= factorZ;
		min.x *= factorZ;
		max.x *= factorZ;

		med.x = (max.x + min.x) / 2, med.z = (max.z + min.z) / 2;

		min.x -= med.x, max.x -= med.x;
		min.z -= med.z, max.z -= med.z;
		auxY = min.y;
		min.y = 0, max.y -= auxY;
		voxelizar(max, min);
		var myfunc = function (particle, i) {
			nube[i][2] *= factorZ;
			nube[i][0] *= factorZ;
			nube[i][0] -= med.x;
			nube[i][1] -= auxY;
			nube[i][2] = - (nube[i][2] - med.z);
			particle.position = new BABYLON.Vector3(nube[i][0], nube[i][1], nube[i][2]);
			particle.color = new BABYLON.Color4(nube[i][3], nube[i][4], nube[i][5], nube[i][6]);
			var x = parseInt((nube[i][0] - min.x) / tamVoxel);
			var y = parseInt((nube[i][1] - min.y) / tamVoxel);
			var z = parseInt((nube[i][2] - min.z) / tamVoxel);
			voxelizacion[x][y][z].push(i);
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


/*
 * Función que permite reconstruir la nube de puntos al completo
 * 
 * origen: Booleano que indica si la reconstrucción consiste en volver a poner la nube entera sin recorte o solo mostrar la nube de nuevo
 * 
 */
function reconstruirParcela(origen) {
	if (!origen) {
		vector = nube;
		recortada = false;
		voxelizar(max, min);
	}else {
		vector = nubeRecortada;
    }
	pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene);
	
	var myfunc = function (particle, i) {
		particle.position = new BABYLON.Vector3(vector[i][0], vector[i][1], vector[i][2]);
		particle.color = new BABYLON.Color4(vector[i][3], vector[i][4], vector[i][5], vector[i][6]);
		if (!origen) {
			var y = parseInt((vector[i][0] - min.x) / tamVoxel);
			var x = parseInt((vector[i][1] - min.y) / tamVoxel);
			var z = parseInt((vector[i][2] - min.z) / tamVoxel);
			voxelizacion[y][x][z].push(i);
		}
	};
	for (let i = 2; i < vector.length; i++) {
		pcs.addPoints(1, myfunc);
	}
	pcs.buildMeshAsync();
	document.getElementById("mensaje").style.display = "none";
	
}


/*
 * 
 * Función que dada la nube de puntos recorta la misma en función de una serie de coordenadas previamente dadas
 *
 */
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
			comparar(vector[i], maxR, minR)
		}
	}

	medR.x = (maxR.x + minR.x) / 2, medR.z = (maxR.z + minR.z) / 2, medR.y = (maxR.y + minR.y) / 2;

	minR.x -= medR.x, maxR.x -= medR.x;
	minR.y -= medR.y, maxR.y -= medR.y;
	minR.z -= medR.z, maxR.z -= medR.z;

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


/*
 * Función que realiza el recorte de la parcela pero con el método de voxelización
 *
 * coordenadas: Vector con las coordenadas del poligono que contiene el recorte
 * 
 */
function recorteParcelaVoxelizado(scene, coordenadas) {
	document.getElementById('seleccion').style.display = 'none'
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
						comparar(vector[voxelizacion[i][x][z][p]], maxR, minR);
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


/*
 * Función que realiza la comparación de un punto del espacio con el maximo y minimo de su sistema
 *
 * punto: Variable vec3 que almacena los valores x,y,z del punto a comparar
 * max: Variable vec3 que almacena el máximo a comparar
 * min: Variable vec3 que almacena el mínimo a comparar
 *
 */
function comparar(punto, max, min) {
	if (punto[0] > max.x)
		max.x = punto[0];
	if (punto[0] < min.x)
		min.x = punto[0];
	if (punto[1] < min.y)
		min.y = punto[1];
	if (punto[1] > max.y)
		max.y = punto[1];
	if (punto[2] < min.z)
		min.z = punto[2];
	if (punto[2] > max.z)
		max.z = punto[2];
}


/*
 * Función que obtiene las coordenadas del poligono de la parcela de la base de datos
 *
 * parcela: Variable string que almacena el identificador de la parcela a renderizar
 *
 */
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

	maxT.x -= medT.x, minT.x -= medT.x;
	maxT.y -= medT.y, minT.y -= medT.y;


	for (var i = 0; i < coordenadas.length; i++) {
		corners.push(new BABYLON.Vector2(parseFloat(coordenadas[i].split(" ")[0]) - medT.x , parseFloat(coordenadas[i].split(" ")[1]) - medT.y));
	}

	medT.x = (maxT.x + minT.x) / 2;
	medT.y = (maxT.y + minT.y) / 2;


	coordenadas_textura = corners;
}


/*
 * Función que genera el poligono texturizado correspondiente a 
 *
 * parcela: Variable string que almacena el identificador de la parcela a renderizar
 *
 */
function creacionPoligono(parcela, scene) {

	var groundMaterial = new BABYLON.StandardMaterial("ground", escena);

	groundMaterial.diffuseTexture = new BABYLON.Texture("Recursos/ortofotos/Marmolejo_O_" + parcela + ".png", escena);
	shape = [];

	if (!poligonoCreado) {
		var factorX = maxT.x - max.x;
		var factorZ = maxT.y - max.z;
		maxT.x -= factorX;
		minT.x -= factorX;
		maxT.y -= factorZ;
		minT.y -= factorZ;
		poligonoCreado = true;
		for (var i = 0; i < coordenadas_textura.length; i++) {
			coordenadas_textura[i].x -= factorX;
			coordenadas_textura[i].z -= factorZ;
		}
	}
	for (var i = 0; i < coordenadas_textura.length; i++) {
		shape.push(new BABYLON.Vector3(coordenadas_textura[i].x, 0, coordenadas_textura[i].y));
	}

	holes = [];
	polygon = BABYLON.Mesh.CreatePolygon("polygon", shape, scene, holes,  true, BABYLON.Mesh.DOUBLESIDE);
	polygon.material = groundMaterial;
	var positions = polygon.getVerticesData(BABYLON.VertexBuffer.PositionKind);

	var vertexData = new BABYLON.VertexData();
	if (nubeExists) {
		for (var i = 1; i < positions.length; i += 3) {
			var x = positions[i - 1];
			var z = positions[i + 1];
			const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
			sphere.position = new BABYLON.Vector3(x, 0, z);
			ray = lanzarRayo(sphere);
			sphere.dispose();
			voxeles = new Array();
			rayTraversalSimplificado(ray, voxeles, min, max);
			var y = obtenerYminima(voxeles);
			positions[i] = y - 1;
		}
	}
	vertexData.positions = positions;
	vertexData.indices = polygon.getIndices();
	vertexData.applyToMesh(polygon);
}


/*
 * Función que genera los olivos detectados en la textura en la escena
 *
 * posiciones: Vector con las posiciones de cada uno de los olivos
 * limiteX: Valor de factorización para ubicar el olivo en la escena con respecto a la dimensiones de la textura en X
 * limiteZ: Valor de factorización para ubicar el olivo en la escena con respecto a la dimensiones de la textura en Z
 *
 */
async function posicionamiento(posiciones, limiteX, limiteZ) {

	var factorX = (maxT.x - minT.x) / (parseFloat(limiteX));
	var factorZ = (maxT.y - minT.y) / (parseFloat(limiteZ));
	voxelesAnalizar = new Array();
	for (let i = 0; i < posiciones.length; i++) {
		const { meshes } = await BABYLON.SceneLoader.ImportMeshAsync("", "Recursos/Modelos/", "tree01.glb", scene);
		meshes[0].position.x = (posiciones[i].x * factorX) + minT.x;
		meshes[0].position.y = 10;
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
		
	}

	document.getElementById("procesamientoVisual").style.display = "none";
}


/*
 * Función que lanza un rayo perpendicular a la superficie del rayo
 *
 * olivos: Mesh del olivo del que tiene que salir el rayo 
 *
 */
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


/*
 * Función que altera el vector del rayo a lanzar para colocarlo en el sistema de coordenadas adecuado
 *
 * vector: Vector a modificar
 * mesh: Mesh del olivo de la que sale el rayo
 *
 */
function vecToLocal(vector, mesh) {
	var m = mesh.getWorldMatrix();
	var v = BABYLON.Vector3.TransformCoordinates(vector, m);
	return v;
}


/*
 *
 *Función que analiza los puntos intersectados de la nube por el proceso de detección y realiza el clustering
 *
 */
function analisisNube() {
	for (var i = 0; i < olivos_deteccion.length; i++) {
		ray = lanzarRayo(olivos_deteccion[i][0]);

		voxeles = new Array();
		rayTraversalSimplificado(ray, voxeles, min, max);
		for (var x = 0; x < voxeles.length; x++) {
			if (voxelesAnalizar.indexOf(voxeles[x]) == -1) {
				voxelesAnalizar.push(voxeles[x]);
			}
		}
    }
	var puntosOlivos = new Array();
	for (var i = 0; i < voxelesAnalizar.length; i++) {
		for (var x = 0; x < voxelizacion[voxelesAnalizar[i].x][voxelesAnalizar[i].y][voxelesAnalizar[i].z].length; x++) {
			var punto = nube[voxelizacion[voxelesAnalizar[i].x][voxelesAnalizar[i].y][voxelesAnalizar[i].z][x]];
			var color = new BABYLON.Color3(punto[3] * 255, punto[4] * 255, punto[5] * 255);
			if (((color.g - 20) > color.r && color.g > color.b) || ((color.g - 20) > color.b && color.g > color.r))
				puntosOlivos.push(nube[voxelizacion[voxelesAnalizar[i].x][voxelesAnalizar[i].y][voxelesAnalizar[i].z][x]]);
        }
	}
	system["formato"] = "nube";
	cambioModelo();

	var umbralDistancia = 5;
	var clusters = new Array();
	var centroides = new Array();
	clusters.push(new Array());
	clusters[0].push(puntosOlivos[0]);
	centroides.push(new Array(puntosOlivos[0][0], puntosOlivos[0][1], puntosOlivos[0][2]));

	//proceso de clustering
	for (var i = 1; i < puntosOlivos.length; i++) {
		var minL = Number.MAX_VALUE;
		var indice = -1;
		for (var x = 0; x < centroides.length; x++) {
			distancia_puntos = distancia(puntosOlivos[i], centroides[x]);
			if (distancia_puntos < minL) {
				minL = distancia_puntos;
				indice = x;
            }
		}
		if (minL <= umbralDistancia) {
			clusters[indice].push(puntosOlivos[i]);
			centroide = recalculoCentroide(clusters[indice]);
			centroides[indice] = centroide;
		} else {
			clusters.push(new Array());
			clusters[clusters.length - 1].push(puntosOlivos[i]);
			centroides.push(new Array(puntosOlivos[i][0], puntosOlivos[i][1], puntosOlivos[i][2]));
        }
	}

	console.log(centroides);

	for (var i = 0; i < centroides.length; i++) {
		const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
		sphere.scalingDeterminant = 5;
		sphere.position = new BABYLON.Vector3(centroides[i][0], centroides[i][1] + 5, centroides[i][2]);
    }

}


/*
 * Función que calcula la distancia entre dos puntos
 *
 * punto: Variable vec3 que almacena los valores x,y,z de un punto
 * punto_2: Variable vec3 que almacena los valores x,y,z del segundo punto
 *
 */
function distancia(punto, punto_2) {

	var dx = punto[0] - punto_2[0];
	var dz = punto[2] - punto_2[2];

	return Math.sqrt(dx * dx + dz * dz);

}


/*
 * Función que recalcula el centroide de un cluster al añadir un elemento
 * 
 * cluster: Vector que almacena los puntos ubicados en el cluster
 *
 */
function recalculoCentroide(cluster) {

	var x = y = z = 0;
	for (var i = 0; i < cluster.length; i++) {
		x += cluster[i][0];
		y += cluster[i][1];
		z += cluster[i][2];
    }

	return new Array(x / cluster.length, y / cluster.length, z / cluster.length);
}


/*
 * Función que obtiene la menor Y para una serie de voxeles
 *
 * voxeles: Vector de voxeles a analizar
 *
 */
function obtenerYminima(voxeles) {
	if (voxeles.length > 0) {
		var yMin = Number.MAX_VALUE;
		for (var i = 0; i < voxeles.length; i++) {
			for (var x = 0; x < voxelizacion[voxeles[i].x][voxeles[i].y][voxeles[i].z].length; x++) {
				var punto = nube[voxelizacion[voxeles[i].x][voxeles[i].y][voxeles[i].z][x]];
				if (punto[1] < yMin) {
					yMin = punto[1];
				}
			}
		}
		return yMin;
	} else {
		return 0;

    }
}