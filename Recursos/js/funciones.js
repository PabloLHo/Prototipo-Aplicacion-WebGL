/*Archivos JS encargado de las funciones de la interfaz principal del prototipo web*/

window.onload = function() {
	seleccionaOpciones();
}


/*Función que muestra los distintos municipios de los que se tiene modelado*/
function seleccionaOpciones(){
	botonVolver.style.visibility = "hidden";
	var botones = $.ajax({
		url:'Recursos/php/obtenerOpciones.php',
		data: {opcion: "", lugar: ''},
		dataType:'text',
		async:false
	}).responseText;
	document.getElementById("botonesLugar").innerHTML = botones;
}

/*Función que muestra los distintos modelados dentro de un municipio*/
function opcionesParcelas(variable){
	botonVolver.style.visibility = "visible";
	var botones = $.ajax({
		url:'Recursos/php/obtenerOpciones.php',
		data: {opcion: "Parcela" ,lugar: variable},
		dataType:'text',
		async:false
	}).responseText;
	document.getElementById("botonesLugar").innerHTML = botones;
}

