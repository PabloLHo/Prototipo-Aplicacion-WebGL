/*Archivos JS encargado de las funciones de la interfaz de muestra del modelado de una parcela*/

var nombre_Modelo = ''; //Nombre del modelo que se va a mostrar en la ventana 3D

window.onload = function() {
	//Obtenemos el valor de la parcela, olivo o zona a la que queremos ir
	var remplaza = /\+/gi;
	var url = window.location.href;
	url = unescape(url);
	url = url.replace(remplaza, " ");
	url = url.toUpperCase();
	variable = "modelo";
	var variable_may = variable.toUpperCase();
	var variable_pos = url.indexOf(variable_may);
	if (variable_pos != -1){
		var pos_separador = url.indexOf("&", variable_pos);
		if (pos_separador != -1)
		{
			valor = url.substring(variable_pos + variable_may.length + 1, pos_separador);
		} else{
			valor = url.substring(variable_pos + variable_may.length + 1, url.length);
		}
	} else{
		alert("NO_ENCONTRADO");
	}

	pagina = url.substring(0,url.indexOf("?"));
	pagina = pagina.substring(pagina.lastIndexOf("/")+1, pagina.length).toLowerCase();
	valor = valor.toLowerCase();

	if(valor.indexOf("#") != -1){
		valor = valor.substring(0, valor.indexOf("#"));
	}

	nombre_Modelo = valor;
	muestraInfo();
	document.getElementById("cargaModelo").onclick = function irModelo() { location.href = "Modelado.php?modelo=" + nombre_Modelo; };

	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: document.getElementById("onload").innerHTML, funcion: "permisos" },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("fotoPerfilNav").src = "Recursos/imagenes/usuarios/" + datos.split("&")[1];
}



/* Función encargada de mostrar toda la información relativa a una parcela en función de si el modelo esta en pantalla completa o no se mostrara mas información
   o menos.
		tablaGen: Muestra la información mas general de una parcela
		Completar...
*/
function muestraInfo(){
	var tablaSecun = $.ajax({
		url:'Recursos/php/obtenerParcela.php',
		data: {funcion:'DatosParcelaSecun' ,modelo: nombre_Modelo},
		dataType:'text',
		async:false
	}).responseText;
	var tablaInci = $.ajax({
		url:'Recursos/php/obtenerParcela.php',
		data: {funcion:'DatosIncidencias' ,modelo: nombre_Modelo},
		dataType:'text',
		async:false
	}).responseText;
	var tablaGen = $.ajax({
		url:'Recursos/php/obtenerParcela.php',
		data: {funcion:'DatosParcelaGen' ,modelo: nombre_Modelo, imagen: ''},
		dataType:'text',
		async:false
	}).responseText;
	var tablaResumen = $.ajax({
		url:'Recursos/php/obtenerParcela.php',
		data: {funcion:'DatosResumen' ,modelo: nombre_Modelo},
		dataType:'text',
		async:false
	}).responseText;
	var fechas = $.ajax({
		url:'Recursos/php/obtenerParcela.php',
		data: {funcion:'fechas' ,modelo: nombre_Modelo},
		dataType:'text',
		async:false
	}).responseText;
	fechas = fechas.split("/");
	document.getElementById("miTabla").innerHTML = tablaGen;
	document.getElementById("miTablaResumen").innerHTML = tablaResumen;
	document.getElementById("fecha_vuelo").innerHTML = fechas[0];
	document.getElementById("miTabla2").innerHTML = tablaSecun;
	document.getElementById("miTablaIncidencias").innerHTML = tablaInci;
	document.getElementById("imagen_altura").src = 'Recursos/mapasAltura/Marmolejo_A_' + nombre_Modelo + '.jpg';
	document.getElementById("ortoParcela").src = 'Recursos/ortofotos/Marmolejo_O_' + nombre_Modelo + '.png';

}

function irZona(direccion) {
	location.href = "Modelado.php?modelo=" + nombre_Modelo + "-" + direccion;
}


/*Función disponible para imprimir el contenido de las tablas de información en formato pdf */
function imprimir(){
	window.scrollTo(0, 0);
	setTimeout(() => {
      	const $elementoParaConvertir = document.getElementById("zonas"); // <-- Aquí puedes elegir cualquier elemento del DOM
		html2pdf()
			.set({
				margin: 1,
				filename: nombre_Modelo + '_Tablas.pdf',
				image: {
					type: 'jpeg',
					quality: 0.98
				},
				html2canvas: {
					scale: 5, // A mayor escala, mejores gráficos, pero más peso
					letterRendering: true,
				},
				jsPDF: {
					unit: "in",
					format: "a3",
					orientation: 'portrait' // landscape o portrait
				}
			})
			.from($elementoParaConvertir)
			.save()
			.catch(err => console.log(err));
    }, 1000);

}

function calculoGrafica(nombre, tiempo, ejeY) {
	fechas = [];
	datos = [];
	aux = nombre.toLowerCase();
	$.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { funcion: 'Datos', aspecto: aux, parcela: nombre_Modelo },
		dataType: 'json',
		success: function (response) {
			fechas = response["Fechas"];
			datos = response["Datos"];
			creacionGrafica(nombre, ejeY, fechas, datos);
		}
	});

}

function creacionGrafica(nombre, ejeY, fechas, datos){

	const data2 = [];
	const fechas2 = [];

	for (var i = 0; i < datos.length; i++) {
		data2.push(parseFloat(datos[i]));
	}

	document.getElementById("slider_" + nombre.toLowerCase()).min = 4;
	document.getElementById("slider_" + nombre.toLowerCase()).value = datos.length;
	document.getElementById("slider_" + nombre.toLowerCase()).max = datos.length;

	document.getElementById("slider_" + nombre.toLowerCase()).oninput = function () {
		var valor = document.getElementById("slider_" + nombre.toLowerCase()).value;
		myChart.config.data.labels = fechas.slice(fechas.length - valor, fechas.length);
		myChart.config.data.datasets[0].data = data2.slice(data2.length - valor, data2.length);
		if (valor < 12 && nombre != "Produccion")
			myChart.config.options.scales.x.time.unit = "week";
		else
			myChart.config.options.scales.x.time.unit = "month";
		myChart.update();

	};

	var r = 0;
	var g = 255;
	var b = 0;
	const data = {
		labels: fechas,
		datasets: [{
			label: nombre,
			backgroundColor: 'rgb(' + r + ',' + g + ',' + b +')',
			borderColor: 'rgb(' + r + ',' + g + ',' + b +')',
			data: data2,
		}]
	};

	const config = {
	  type: 'line',
	  data: data,
	  options: {
		scales: {
		  x: {
			type: "time",
			title: {
				display: true,

			  text: 'Fecha recogida de datos'
			},
			time: {
				unit: 'month',
				stepSize: 1
			},
			ticks: {
				display: true,
				source: 'auto'
			}
		  },
		  y: {
			title: {
			  display: true,
			  text: ejeY
			}
		  }
		}
	  },
	};
	
	const myChart = new Chart(document.getElementById(nombre), config);
	myChart.canvas.parentNode.style.width = '100%';

}

function sobresaltar(id) {

	if (Chart.getChart('SobrePuesta')) {
		let chartStatus = Chart.getChart('SobrePuesta'); // <canvas> id
		chartStatus.destroy();
	}

	document.getElementById("Grafica").show();
	document.getElementById("Grafica").style.zIndex = 4000;

	fechas = Chart.getChart(id).config.data.labels;
	datos = Chart.getChart(id).config.data.datasets[0].data;
	document.getElementById("slider_SobrePuesta").min = 4;
	document.getElementById("slider_SobrePuesta").max = datos.length;
	document.getElementById("slider_SobrePuesta").value = datos.length;

	const myChart = new Chart(document.getElementById('SobrePuesta'), Chart.getChart(id).config);

	document.getElementById("slider_SobrePuesta").oninput = function () {
		var valor = document.getElementById("slider_SobrePuesta").value;
		myChart.config.data.labels = fechas.slice(fechas.length - valor, fechas.length);
		myChart.config.data.datasets[0].data = datos.slice(datos.length - valor, datos.length);

		if (valor < 12 && id != "Produccion")
			myChart.config.options.scales.x.time.unit = "week";
		else
			myChart.config.options.scales.x.time.unit = "month";
		myChart.update();
		

	};
}



function muestraPrincipal(){
	document.getElementById("Principal").style.display = "block";
	document.getElementById("Historico").style.display = "none";
	document.getElementById("Zonas").style.display = "none";
}

function muestraZonas(){
	document.getElementById("Principal").style.display = "none";
	document.getElementById("Historico").style.display = "none";
	document.getElementById("Zonas").style.display = "block";
}

function muestraHistorico() {

	document.getElementById("Principal").style.display = "none";
	document.getElementById("Historico").style.display = "block";
	document.getElementById("Zonas").style.display = "none";

	calculoGrafica('Produccion', 'week', "Kg");
	calculoGrafica("Temperatura" ,'week', "Grados");
	calculoGrafica("Precipitaciones" ,'week', "L/ha");
	calculoGrafica("Humedad", 'week', "%");

}


$(function() {
	$('.navbar-nav li a').click(function (e) {
		$("nav").find(".active").removeClass("active");
        e.preventDefault();
		var $this = $(this);
        $this.closest('ul').children('li').removeClass('active');
        $this.parent().addClass('active');
    });
});