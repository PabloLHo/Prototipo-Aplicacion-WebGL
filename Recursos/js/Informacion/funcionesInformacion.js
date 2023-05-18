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
	if(pagina == "informacionseleccion.php"){
		valor = valor.split("/");
		if(valor.length > 2){
			valor2 = valor[0]
			valor2 = valor2[0].toUpperCase() + valor2.slice(1);
			x1 = valor[1];
			y1 = valor[2];
			x2 = valor[3];
			y2 = valor[4];
			muestraNubeRecortada(valor2, valor[1], valor[2],valor[3],valor[4]);
		}
		//Si tenemos 2 datos tendremos un olivo (nombre y olivo en cuestión)
		else if(valor.length == 2){
			valor[0] = valor[0][0].toUpperCase() + valor[0].slice(1);
			muestraModeloOlivo(valor[0], valor[1]);
		}
		//En caso contrario con 1 dato tendremos una parcela completa
		else{
			valor[0] = valor[0][0].toUpperCase() + valor[0].slice(1);
			muestraNube(valor[0]);
		}
		nombre_Modelo = valor[0];
	}else{
		nombre_Modelo = valor;
	}
	muestraInfo();
	document.getElementById("cargaModelo").onclick = function irModelo(){	location.href = "Modelado.php?modelo=" + nombre_Modelo; };
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

function calculoGrafica(tipo, id, nombre ,tiempo){
	const labels = [new Date('2022-09-01T00:00:00'), new Date('2022-09-02T00:00:00'), new Date('2022-09-03T00:00:00'), new Date('2022-09-04T00:00:00'), new Date('2022-09-05T00:00:00'), new Date('2022-09-06T00:00:00'), new Date('2022-09-07T00:00:00'),
	new Date('2022-09-08T00:00:00'), new Date('2022-09-09T00:00:00'), new Date('2022-09-10T00:00:00'), new Date('2022-09-11T00:00:00'), new Date('2022-09-12T00:00:00'), new Date('2022-09-13T00:00:00'), new Date('2022-09-14T00:00:00'),
	new Date('2022-09-15T00:00:00'), new Date('2022-09-16T00:00:00'), new Date('2022-09-17T00:00:00'), new Date('2022-09-18T00:00:00'), new Date('2022-09-19T00:00:00'), new Date('2022-09-20T00:00:00'), new Date('2022-09-21T00:00:00'),
	new Date('2022-09-22T00:00:00'), new Date('2022-09-23T00:00:00'), new Date('2022-09-24T00:00:00'), new Date('2022-09-25T00:00:00'), new Date('2022-09-26T00:00:00'), new Date('2022-09-27T00:00:00'), new Date('2022-09-28T00:00:00'), 
	new Date('2022-09-29T00:00:00'), new Date('2022-09-30T00:00:00'), new Date('2022-10-01T00:00:00'), new Date('2022-10-02T00:00:00'), new Date('2022-10-03T00:00:00'), new Date('2022-10-04T00:00:00'), new Date('2022-10-05T00:00:00'), new Date('2022-10-06T00:00:00'), new Date('2022-10-07T00:00:00'),
	new Date('2022-10-08T00:00:00'), new Date('2022-10-09T00:00:00'), new Date('2022-10-10T00:00:00'), new Date('2022-10-11T00:00:00'), new Date('2022-10-12T00:00:00'), new Date('2022-10-13T00:00:00'), new Date('2022-10-14T00:00:00'),
	new Date('2022-10-15T00:00:00'), new Date('2022-10-16T00:00:00'), new Date('2022-10-17T00:00:00'), new Date('2022-10-18T00:00:00'), new Date('2022-10-19T00:00:00'), new Date('2022-10-20T00:00:00'), new Date('2022-10-21T00:00:00'),
	new Date('2022-10-22T00:00:00'), new Date('2022-10-23T00:00:00'), new Date('2022-10-24T00:00:00'), new Date('2022-10-25T00:00:00'), new Date('2022-10-26T00:00:00'), new Date('2022-10-27T00:00:00'), new Date('2022-10-28T00:00:00'), 
	new Date('2022-10-29T00:00:00'), new Date('2022-10-30T00:00:00'), new Date('2022-10-31T00:00:00'), new Date('2022-11-01T00:00:00'), new Date('2022-11-02T00:00:00'), new Date('2022-11-03T00:00:00'), new Date('2022-11-04T00:00:00'), new Date('2022-11-05T00:00:00'), new Date('2022-11-06T00:00:00'), new Date('2022-11-07T00:00:00'),
	new Date('2022-11-08T00:00:00'), new Date('2022-11-09T00:00:00'), new Date('2022-11-10T00:00:00'), new Date('2022-11-11T00:00:00'), new Date('2022-11-12T00:00:00'), new Date('2022-11-13T00:00:00'), new Date('2022-11-14T00:00:00'),
	new Date('2022-11-15T00:00:00'), new Date('2022-11-16T00:00:00'), new Date('2022-11-17T00:00:00'), new Date('2022-11-18T00:00:00'), new Date('2022-11-19T00:00:00'), new Date('2022-11-20T00:00:00'), new Date('2022-11-21T00:00:00'),
	new Date('2022-11-22T00:00:00'), new Date('2022-11-23T00:00:00'), new Date('2022-11-24T00:00:00'), new Date('2022-11-25T00:00:00'), new Date('2022-11-26T00:00:00'), new Date('2022-11-27T00:00:00'), new Date('2022-11-28T00:00:00'), 
	new Date('2022-11-29T00:00:00'), new Date('2022-11-30T00:00:00')];
	const data2 = [];

	for (let i = 0; i < 91; ++i) {
		data2.push(Math.random() * 20);
	}
	var r = Math.random() * 255;
	var g = Math.random() * 255;
	var b = Math.random() * 255;
	const data = {
		labels: labels,
		datasets: [{
			label: nombre,
			backgroundColor: 'rgb(' + r + ',' + g + ',' + b +')',
			borderColor: 'rgb(' + r + ',' + g + ',' + b +')',
			data: data2,
		}]
	};

	const config = {
	  type: tipo,
	  data: data,
	  options: {
		// maintainAspectRatio : true,
		scales: {
		  x: {
			type: "time",
			title: {
			  display: true,
			  text: 'Fecha recogida de datos'
			},
			time: {
				unit: tiempo,
				isoWeekday: true,
				stepSize: 1
			},
			grid: {
				color: 'rgb(0,0,0)'
			},
			ticks: {
				display: true,
				source: 'auto'
			}
		  },
		  y: {
			title: {
			  display: true,
			  text: 'Kg / m2'
			}
		  }
		}
	  },
	};
	
	const myChart = new Chart( document.getElementById(id),config);
	myChart.canvas.parentNode.style.width = '100%';

}

function sobresaltar(id) {
	if (Chart.getChart('SobrePuesta')) {
		let chartStatus = Chart.getChart('SobrePuesta'); // <canvas> id
		chartStatus.destroy();
	}
	document.getElementById("Grafica").show();
	document.getElementById("Grafica").style.zIndex = 4000;
	const myChart = new Chart(document.getElementById('SobrePuesta'), Chart.getChart(id).config);
	//calculoGrafica('line', 'SobrePuesta', id, 'week');
}

function actualizarGrafica(tipo, nombre){
	let chartStatus = Chart.getChart(nombre); // <canvas> id
	chartStatus.config.type = tipo;
	var config = chartStatus.config;
	chartStatus.destroy();
	const myChart = new Chart( document.getElementById(nombre),config);
}

function actualizarFormatoGrafica(tipo, nombre){
	let chartStatus = Chart.getChart(nombre); // <canvas> id
	if(tipo == 'year'){
		chartStatus.config.options.scales.x.ticks.source = 'data';
	}else{
		chartStatus.config.options.scales.x.ticks.source = 'auto';
	}
	chartStatus.config.options.scales.x.time.unit = tipo;
	var config = chartStatus.config;
	chartStatus.destroy();
	const myChart = new Chart( document.getElementById(nombre),config);
}


function muestraPrincipal(){
	document.getElementById("Principal").style.display = "block";
	document.getElementById("Historico").style.display = "none";
	document.getElementById("Zonas").style.display = "none";
	document.getElementById("Prediccion").style.display = "none";
}

function muestraZonas(){
	document.getElementById("Principal").style.display = "none";
	document.getElementById("Historico").style.display = "none";
	document.getElementById("Zonas").style.display = "block";
	document.getElementById("Prediccion").style.display = "none";
}

function muestraHistorico(){
	document.getElementById("Principal").style.display = "none";
	document.getElementById("Historico").style.display = "block";
	document.getElementById("Zonas").style.display = "none";
	document.getElementById("Prediccion").style.display = "none";
	calculoGrafica('line', 'Produccion_Anual', "Produccion" ,'week');
	calculoGrafica('line', 'Temperatura_Media', "Temperatura" ,'week');
	calculoGrafica('bar', 'Precipitaciones', "Precipitaciones" ,'week');
	calculoGrafica('line', 'Humedad', "Humedad" ,'week');
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