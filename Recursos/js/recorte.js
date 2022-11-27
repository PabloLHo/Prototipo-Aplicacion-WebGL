/*Archivos JS encargado del modelado de una escena dentro de la interfaz web*/


function seleccionRectangular(scene, camera, advancedTexture) {
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

//Método punto en poligono, se deben recorrer las coordenadas en sentido anti-horario
//coordenadas = [new BABYLON.Vector3(2, 0, -2), new BABYLON.Vector3(0, 0, 2), new BABYLON.Vector3(-2, 0, -2)];
//seleccionPuntos(new BABYLON.Vector3(0,0,0));

function seleccionPuntos(punto){
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
	//console.log(suma);
	if (-0.1 < suma && suma < 0.1) {
		//Fuera del poligono (valor 0 aproximado)
		return -1;
	}
	//} else if (2 * Math.PI - 0.1 < suma && suma < 2 * Math.PI + 0.1) {
		//Dentro del poligono
	return 1;
	//}
}

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


//Método a explicar
// vectorPerpendicular(new BABYLON.Vector3(2,0,1),new BABYLON.Vector3(1,-1,3));
function vectorPerpendicular(vector, vector2){
	x = vector.y * vector2.z - vector.z * vector2.y;
	y = vector.z * vector2.x - vector.x * vector2.z;
	z = vector.x * vector2.y - vector.y * vector2.x;
	var resultado = new BABYLON.Vector3(x,y,z);
	console.log(resultado);
}

function vectoresPoligono(){
	vectores = [];
	for( var i = 0; i < coordenadas.length; i++){
		x = coordenadas[i].x - coordenadas[(i+1) % coordenadas.length].x;
		y = coordenadas[i].y - coordenadas[(i+1) % coordenadas.length].y;
		z = coordenadas[i].z - coordenadas[(i+1) % coordenadas.length].z;
		vectores.push(new BABYLON.Vector3(x,y,z));
	}
}