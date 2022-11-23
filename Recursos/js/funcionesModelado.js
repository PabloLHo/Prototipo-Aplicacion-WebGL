/*Archivos JS encargado de las funciones de la interfaz de muestra del modelado de una parcela*/

var nombre_Modelo = ''; //Nombre del modelo que se va a mostrar en la ventana 3D

/*True si se estan mostrando las imagenes del tipo del nombre en el desplegable de la interfaz, false si no se estan mostrando
Es una condición exclusiva, solo una puede estar a true en cada momento
*/
var cenital = false; 
var termica = false;
var individual = false;


/*Crea la ventana de visualización para un olivo concreto
	modelo: El nombre de la función de visualización a la que llamar
*/
const createScene = (modelo) => {
	return window[modelo](nombre_Modelo);
}


const createSceneParkingEnfocada = (modelo,x1,y1,x2,y2) => {
	return window[modelo](nombre_Modelo,x1,y1,x2,y2);
}


/*Función principal para la creación del modelado de una nube de puntos, llama a todas las funciones necesarias para la correcta muestra de la interfaz
	id: El nombre del modelo que se quiere invocar
*/
function muestraNube(id){
	nombre_Modelo = id;
	sceneToRender = createScene("Parking");
	resize();
}

/*Función principal para la creación del modelado de una nube de puntos, llama a todas las funciones necesarias para la correcta muestra de la interfaz
	id: El nombre del modelo que se quiere invocar
*/
function muestraNubeRecortada(id,x1,y1,x2,y2){
	nombre_Modelo = id;
	sceneToRender = createSceneParkingEnfocada("ParkingZona",x1,y1,x2,y2);
	resize();
}


/* Función encargada de repinta o recargar el modelo en caso de que se realize un cambio de modelo dentro de una misma página */
function resize() {		
	initFunction().then(() => {
		sceneToRender = scene   
	});
}


/*Función que permite volver a la visión general de la parcela desde el modelado enfocado en un olivo o en una zona */
function volverModelo(){
	location.href = "Modelado.php?modelo=" + nombre_Modelo;
}


/*Función que nos permite desplazarnos a una zona de la parcela en concreto con el modelado */
function irZona(zona){
	var coordenadas = $.ajax({
		url:'Recursos/php/obtenerParcela.php',
		data: {modelo: nombre_Modelo, funcion: "zona", zona: zona},
		dataType:'text',
		async:false
	}).responseText;
	coordenadas = coordenadas.split("/");
	x = coordenadas[0];
	y = coordenadas[1];
	z = coordenadas[2];
	location.href = "Modelado.php?modelo=" + nombre_Modelo + "/" + x + "/"  + y + "/" + z;
}

