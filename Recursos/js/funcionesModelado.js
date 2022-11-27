/*Archivos JS encargado de las funciones de la interfaz de muestra del modelado de una parcela*/

var nombre_Modelo = ''; //Nombre del modelo que se va a mostrar en la ventana 3D


/*Crea la ventana de visualización para un olivo concreto
	modelo: El nombre de la función de visualización a la que llamar
*/
const createScene = (modelo) => {
	return window[modelo](nombre_Modelo);
}



/*Función principal para la creación del modelado de una nube de puntos, llama a todas las funciones necesarias para la correcta muestra de la interfaz
	id: El nombre del modelo que se quiere invocar
*/
function muestraNube(id){
	nombre_Modelo = id;
	sceneToRender = createScene("Parcela");
	resize();
}


/* Función encargada de repinta o recargar el modelo en caso de que se realize un cambio de modelo dentro de una misma página */
function resize() {		
	initFunction().then(() => {
		sceneToRender = scene   
	});
}

