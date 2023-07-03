/*Archivos JS encargado de las operaciones geométricas de la escena*/
numVoxeles = new BABYLON.Vector3(0, 0, 0);

/*
 * 
 * Función que genera el poligono de recorte con sus coordenadas
 *
 */
function seleccionPoligonal(scene, camera) {
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
		if (!finSeleccion && seleccionActivo) {
			document.getElementById("recorte").style.display = "flex";
			document.getElementById("seleccion").style.display = "none";
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
			} else if (eventData.type === BABYLON.PointerEventTypes.POINTERDOUBLETAP) {
				document.getElementById("recorte").style.display = "none";
				finSeleccion = true;
				limpiarCoordenadas();
				coordenadas.push(coordenadas[0]);
				options = {
						points: coordenadas,
						updatable: true
				}
				lineasSeleccion.dispose();
				lineasSeleccion = null;
				lineasSeleccion = BABYLON.MeshBuilder.CreateLines("lines", options);
				camera.speed = 0;
			}
		}
    });
	
}

/*
 * 
 * Función que limpia del vector de coordenadas del poligono las coordenadas repetidas
 *
 */
function limpiarCoordenadas(){
	
	for(var i = 0; i < coordenadas.length; i++){
		for(var x = i + 1; x < coordenadas.length; x++){
			if(coordenadas[i].x.toFixed(4) == coordenadas[x].x.toFixed(4) && coordenadas[i].z.toFixed(4) == coordenadas[x].z.toFixed(4)){
				x = x-1;
				coordenadas.splice(x,1);
			}
		}
	}
	
}


/*
 * Función que genera el algoritmo radial del punto en poligono
 *
 * punto: Variable vec3 que almacena los valores x,y,z del punto a comprobar su pertenencia al poligono
 *
 */
function seleccionPuntos(punto) {
	suma = 0;
	for( var i = 0; i < coordenadas.length-1; i++){
		var angulo = calculoAngulo(punto, coordenadas[i], coordenadas[(i + 1) % coordenadas.length]);
		if (angulo == 0) {
			angulo = Math.PI;
        }
		if(Math.abs(angulo) > Math.PI - 0.1 && Math.abs(angulo) < Math.PI + 0.1){
			//Si entra nos encontramos en uno de los lados del poligono
			return 0;
		}
		suma += angulo;
	}
	if (-0.1 < suma && suma < 0.1) {
		//Fuera del poligono (valor 0 aproximado)
		return -1;
	}
	//Dentro del poligono
	return 1;

}


/*
 * Función que calcula el ángulo que forma un punto con el segmento de dos vertices del poligono
 *
 * punto: Variable vec3 que almacena los valores x,y,z del punto a comprobar su pertenencia al poligono
 * vertice1: Vertice del poligono de recorte
 * vertice2: Vertice del poligon de recorte
 *
 */
function calculoAngulo(punto, vertice1, vertice2) {
	var vector = new BABYLON.Vector3(vertice1.x - punto.x, vertice1.y - punto.y, vertice1.z - punto.z);
	var vector2 = new BABYLON.Vector3(vertice2.x - punto.x, vertice2.y - punto.y, vertice2.z - punto.z);
	var prod_vectorial = vector.x * vector2.z - vector.z * vector2.x;
	var seno = Math.abs(prod_vectorial) / ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2))) * (Math.sqrt(Math.pow(vector2.x, 2) + Math.pow(vector2.z, 2))));
	if (prod_vectorial > 0) {
		if (seno > 0) {
			return Math.acos(((vector.x * vector2.x) + (vector.z * vector2.z)) / (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2)) * Math.sqrt(Math.pow(vector2.x, 2) + Math.pow(vector2.z, 2))));
		} else {
			return Math.acos(((vector.x * vector2.x) + (vector.z * vector2.z)) / (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2)) * Math.sqrt(Math.pow(vector2.x, 2) + Math.pow(vector2.z, 2)))) * -1;
        }
	} else {
		if (seno > 0) {
			return Math.acos(((vector.x * vector2.x) + (vector.z * vector2.z)) / (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2)) * Math.sqrt(Math.pow(vector2.x, 2) + Math.pow(vector2.z, 2)))) * -1;
		} else {
			return Math.acos(((vector.x * vector2.x) + (vector.z * vector2.z)) / (Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2)) * Math.sqrt(Math.pow(vector2.x, 2) + Math.pow(vector2.z, 2))));
		}
    }
}


/*
 * Función que calcula la voxelización de una nube de puntos
 *
 * maxV: Variable vec3 que almacena los valores máximos en cada eje del modelo
 * minV: Variable vec3 que almacena los valores mínimos en cada eje del modelo
 *
 */
function voxelizar(maxV, minV) {

	var numVoxelesX = parseInt((maxV.x - minV.x) / tamVoxel) + 1;
	var numVoxelesY = parseInt((maxV.y - minV.y) / tamVoxel) + 1;
	var numVoxelesZ = parseInt((maxV.z - minV.z) / tamVoxel) + 1;
	numVoxeles = new BABYLON.Vector3(numVoxelesX, numVoxelesY, numVoxelesZ);
	console.log(numVoxeles);
	var auxX = parseInt(minV.x) - 1;
	var auxY = parseInt(minV.y) - 1;
	var auxZ = parseInt(minV.z) - 1;

	voxelizacion = new Array(numVoxelesX);
	boundingBoxes = new Array(numVoxelesX);

	for (var i = 0; i < numVoxelesX; i++) {

		voxelizacion[i] = new Array(numVoxelesY);
		boundingBoxes[i] = new Array(numVoxelesY);

		for (var x = 0; x < numVoxelesY; x++) {

			voxelizacion[i][x] = new Array(numVoxelesZ);
			boundingBoxes[i][x] = new Array(numVoxelesZ);

			for (var z = 0; z < numVoxelesZ; z++) {

				voxelizacion[i][x][z] = new Array();

				const box = BABYLON.MeshBuilder.CreateBox("box", { height: tamVoxel, width: tamVoxel, depth: tamVoxel });
				box.position = new BABYLON.Vector3(auxX + tamVoxel / 2, auxY + tamVoxel / 2, auxZ + tamVoxel / 2);
				let parent = new BABYLON.Mesh("parent", scene);
				box.setParent(parent);
				
				let spheremin = box.getBoundingInfo().boundingBox.minimumWorld;
				let spheremax = box.getBoundingInfo().boundingBox.maximumWorld;

				parent.setBoundingInfo(new BABYLON.BoundingInfo(spheremin, spheremax));
				boundingBoxes[i][x][z] = parent;
				box.dispose();

				auxZ += tamVoxel;
			}

			auxZ = parseInt(minV.z) - 1;
			auxY += tamVoxel;
		}

		auxY = parseInt(minV.y) - 1;
		auxX += tamVoxel;
	}

}


/*
 * Función que calcula la intersección rayo-voxelización con funciones nativas de babylon
 *
 * ray: Variable interna de Babylon que almacena el rayo lanzado
 *
 */
function nativoBabylon(ray) {
	voxeles = [];
	for (var x = 0; x < voxelizacion.length; x++) {
		for (var y = 0; y < voxelizacion[x].length; y++) {
			for (var z = 0; z < voxelizacion[x][y].length; z++) {
				if (ray.intersectsBox(boundingBoxes[x][y][z].getBoundingInfo().boundingBox))
					voxeles.push(new BABYLON.Vector3(x, y, z));
			}
		}
	}
	return voxeles;
}


/*
 * Función que calcula la intersección rayo-voxelización con el algoritmo A Fast Voxel Traversal Algorithm for Ray Tracing obtiendo
 * los voxeles por los que se pasa
 *
 * rayo: Variable interna de Babylon que almacena el rayo lanzado
 * voxeles: Vector de voxeles de la voxelización
 * min: Variable vec3 que almacena los valores mínimos del modelo
 * max: Variable vec3 que almacena los valores máximos del modelo
 *
 */
function rayTraversal(rayo, voxeles, min, max) {
	var tMin;
	var tMax;
	ray_intersects_grid = rayBoxIntersection(rayo, 0, 1, min, max);

	if (!ray_intersects_grid[0]) return 0;

	tMin = Math.max(ray_intersects_grid[1], 0);
	tMax = Math.max(ray_intersects_grid[2], 1);
	ray_start = new BABYLON.Vector3(ray.origin.x, ray.origin.y, ray.origin.z);


	current_X_index = Math.max(1, Math.ceil((ray_start.x - min.x) / tamVoxel));
	var stepX;
	var tDeltaX;
	var tMaxX;
	if (ray.direction.x > 0.0) {
		stepX = 1;
		tDeltaX = tamVoxel / ray.direction.x;
		tMaxX = tMin + (min.x + current_X_index * tamVoxel - ray_start.x) / ray.direction.x;
	}
	else if (ray.direction.x < 0.0) {
		stepX = -1;
		tDeltaX = tamVoxel / -(ray.direction.x);
		var previous_X_index = current_X_index - 1;
		tMaxX = tMin + (min.x + previous_X_index * tamVoxel - ray_start.x) / ray.direction.x;
	}
	else {
		stepX = 0;
		tDeltaX = tMax;
		tMaxX = tMax;
	}

	current_Y_index = Math.max(1, Math.ceil((ray_start.y - min.y) / tamVoxel));
	var stepY;
	var tDeltaY;
	var tMaxY;
	if (ray.direction.y > 0.0) {
		stepY = 1;
		tDeltaY = tamVoxel / ray.direction.y;
		tMaxY = tMin + (min.y + current_Y_index * tamVoxel - ray_start.y) / ray.direction.y;
	}
	else if (ray.direction.y < 0.0) {
		stepY = -1;
		tDeltaY = tamVoxel / -(ray.direction.y);
		var previous_Y_index = current_Y_index - 1;
		tMaxY = tMin + (min.y + previous_Y_index * tamVoxel - ray_start.y) / ray.direction.y;
	}
	else {
		stepY = 0;
		tDeltaY = tMax;
		tMaxY = tMax;
	}

	current_Z_index = Math.max(1, Math.ceil((ray_start.z - min.z) / tamVoxel));
	var stepZ;
	var tDeltaZ;
	var tMaxZ;
	if (ray.direction.z > 0.0) {
		stepZ = 1;
		tDeltaZ = tamVoxel / ray.direction.z;
		tMaxZ = tMin + (min.z + current_Z_index * tamVoxel - ray_start.z) / ray.direction.z;
	}
	else if (ray.direction.z < 0.0) {
		stepZ = -1;
		tDeltaZ = tamVoxel / -(ray.direction.z);
		var previous_Z_index = current_Z_index - 1;
		tMaxZ = tMin + (min.z + previous_Z_index * tamVoxel - ray_start.z) / ray.direction.z;
	}
	else {
		stepZ = 0;
		tDeltaZ = tMax;
		tMaxZ = tMax;
	}

	while ((current_X_index >= 1 && current_Y_index >= 1 && current_Z_index >= 1) && (current_X_index <= numVoxeles.x && current_Y_index <= numVoxeles.y && current_Z_index <= numVoxeles.z)) {
		voxeles.push(new BABYLON.Vector3(current_X_index - 1,current_Y_index - 1, current_Z_index - 1));
		if (tMaxX < tMaxY && tMaxX < tMaxZ) {
			// X-axis traversal.
			current_X_index += stepX;
			tMaxX += tDeltaX;
		}
		else if (tMaxY < tMaxZ) {
			// Y-axis traversal.
			current_Y_index += stepY;
			tMaxY += tDeltaY;
		}
		else {
			// Z-axis traversal.
			current_Z_index += stepZ;
			tMaxZ += tDeltaZ;
		}

	}
	if (voxeles.length == 0)
		return false;
	return true;
}


/*
 * Función que calcula la intersección rayo-voxelización con el algoritmo A Fast Voxel Traversal Algorithm for Ray Tracing obtiendo
 * los voxeles por los que se pasa pero usando exclusivamente el avance en el eje Y
 *
 * rayo: Variable interna de Babylon que almacena el rayo lanzado
 * voxeles: Vector de voxeles de la voxelización
 * min: Variable vec3 que almacena los valores mínimos del modelo
 * max: Variable vec3 que almacena los valores máximos del modelo
 *
 */
function rayTraversalSimplificado(rayo, voxeles, min, max) {

	ray_intersects_grid = rayBoxIntersection(rayo, 0, 1, min, max);

	if (!ray_intersects_grid[0]) return 0;

	current_X_index = Math.max(1,Math.ceil((rayo.origin.x - min.x) / tamVoxel));

	current_Y_index = Math.max(1,Math.ceil((rayo.origin.y - min.y) / tamVoxel));

	current_Z_index = Math.max(1,Math.ceil((rayo.origin.z - min.z) / tamVoxel));

	while ((current_X_index >= 1 && current_Y_index >= 1 && current_Z_index >= 1) && (current_X_index <= numVoxeles.x && current_Y_index <= numVoxeles.y && current_Z_index <= numVoxeles.z)) {
		voxeles.push(new BABYLON.Vector3(current_X_index - 1, current_Y_index - 1, current_Z_index - 1));
		current_Y_index += 1;
	}

	return true;
}


/*
 * Función que calcula la intersección rayo-voxelización 
 *
 * rayo: Variable interna de Babylon que almacena el rayo lanzado
 *
 */
function rayBoxIntersection(rayo, t0, t1, min, max) {
	var tYMin, tYMax, tZMin, tZMax, tMin, tMax;
	var x_inv_dir = 1 / rayo.direction.x;
	if (x_inv_dir >= 0) {
		tMin = (min.x - rayo.origin.x) * x_inv_dir;
		tMax = (max.x - rayo.origin.x) * x_inv_dir;
	} else {
		tMin = (max.x - rayo.origin.x) * x_inv_dir;
		tMax = (min.x - rayo.origin.x) * x_inv_dir;
	}

	var y_inv_dir = 1 / rayo.direction.y;
	if (y_inv_dir >= 0) {
		tYMin = (min.y - rayo.origin.y) * y_inv_dir;
		tYMax = (max.y - rayo.origin.y) * y_inv_dir;
	} else {
		tYMin = (max.y - rayo.origin.y) * y_inv_dir;
		tYMax = (min.y - rayo.origin.y) * y_inv_dir;
	}
	if (tMin > tYMax || tYMin > tMax) return new Array(false);
	if (tYMin > tMin) tMin = tYMin;
	if (tYMax < tMax) tMax = tYMax;

	var z_inv_dir = 1 / rayo.direction.z;
	if (z_inv_dir >= 0) {
		tZMin = (min.z - rayo.origin.z) * z_inv_dir;
		tZMax = (max.z - rayo.origin.z) * z_inv_dir;
	} else {
		tZMin = (max.z - rayo.origin.z) * z_inv_dir;
		tZMax = (min.z - rayo.origin.z) * z_inv_dir;
	}

	if (tMin > tZMax || tZMin > tMax) return new Array(false);
	if (tZMin > tMin) tMin = tZMin;
	if (tZMax < tMax) tMax = tZMax;

	return new Array((tMin < t1 && tMax > t0), tMin, tMax);
}