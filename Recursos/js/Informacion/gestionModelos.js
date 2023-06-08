/*Archivos JS encargado de las funciones de la interfaz perfil de usuario para control de modelos*/
parcelaElegida = "";
tipoActual = "";


window.onload = function () {

	usuario = document.getElementById("onload").innerHTML.split("<")[0];

	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: document.getElementById("onload").innerHTML, funcion: "permisos" },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&");

	switch (datos[0]) {
		case "PROPIETARIO":
			document.getElementById("anadirModelo").style.display = "none";
			document.getElementById("usuario").style.display = "none";
			document.getElementById("Titulo1").innerHTML = "Listado de Parcelas";
			break;
		case "TECNICO":
			document.getElementById("usuario").style.display = "none";
			document.getElementById("modelo").style.display = "none";
			break;
	}

	document.getElementById("fotoPerfilNav").src = "Recursos/imagenes/usuarios/" + datos[1];

	muestraModelos(datos);
}


function muestraModelos(datos) {

	parcelas = $.ajax({
		url: 'Recursos/php/gestionModelos.php',
		data: { funcion: "mostrarParcelas", nivel: 1, tipo: "inicial", permisos: datos[0], usuario: datos[9] },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_modelos").innerHTML = parcelas.split("&")[0];

	if (parseInt(parcelas.split("&")[1], 10) < 10) {
		document.getElementById("post").className = "page-item disabled";
	}

}


function siguientesModelos(numero, total) {

	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: document.getElementById("onload"), funcion: "permisos" },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&")[0];
	usuario = datos.split("&")[9];

	usuarios = $.ajax({
		url: 'Recursos/php/gestionModelos.php',
		data: { funcion: "mostrarParcelas", nivel: numero, tipo: "siguiente", permisos: datos, usuario: usuario },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_modelos").innerHTML = usuarios.split("&")[0];
	document.getElementById("disabled").className = "page-item";

	if (numero > total - 10) {
		document.getElementById("post").className = "page-item disabled";
	} else {
		document.getElementById("disabled").className = "page-item ";
	}

}

function anterioresModelos(numero) {

	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: document.getElementById("onload"), funcion: "permisos"  },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&")[0];
	usuario = datos.split("&")[9];

	usuarios = $.ajax({
		url: 'Recursos/php/gestionModelos.php',
		data: { funcion: "mostrarParcelas", nivel: numero, tipo: "anterior", permisos: datos, usuario: usuario },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_modelos").innerHTML = usuarios.split("&")[0];

	document.getElementById("post").className = "page-item";

	if ((numero - 1) > 10) {
		document.getElementById("disabled").className = "page-item";
	} else {
		document.getElementById("disabled").className = "page-item disabled";
	}

}

function mostrarParcela(parcela) {
	var datos = $.ajax({
		url: 'Recursos/php/gestionModelos.php',
		data: { nombre: parcela, funcion: "parcela" },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&");

	if (parseInt(datos[4])) {
		document.getElementById("nube").onclick = function DownloadFromUrl() {
			var link = document.createElement('a'); link.href = "Recursos/Modelos/" + datos[1] + "_" + parcela + ".txt"; link.download = datos[1] + "_" + parcela; document.body.appendChild(link); link.click(); document.body.removeChild(link);
		};
	}else
		document.getElementById("nube").style.display = "none";
	if (parseInt(datos[5])) {
		document.getElementById("orto").onclick = function DownloadFromUrl() {
			var link = document.createElement('a'); link.href = "Recursos/ortofotos/" + datos[1] + "_O_" + + parcela + ".png"; link.download = datos[1] + "_O_" + parcela; document.body.appendChild(link); link.click(); document.body.removeChild(link);
		};
	}else
		document.getElementById("orto").style.display = "none";
	if (parseInt(datos[6])) {
		document.getElementById("altura").onclick = function DownloadFromUrl() {
			var link = document.createElement('a'); link.href = "Recursos/mapasAltura/" + datos[1] + "_A_" + + parcela + ".png"; link.download = datos[1] + "_A_" + parcela; document.body.appendChild(link); link.click(); document.body.removeChild(link);
		};
	}else
		document.getElementById("altura").style.display = "none";

	if (datos[2] == "") {
		document.getElementById("fecha_vuelo").placeholder = "N/A";
	} else {
		document.getElementById("fecha_vuelo").placeholder = datos[2];
    }
	document.getElementById("ref_cat").placeholder = datos[3];
	document.getElementById("provincia_card").innerHTML = datos[0];
	document.getElementById("municipio_card").innerHTML = datos[1] + " / " + parcela;


	document.getElementById("card-parcelas").showModal();
}

function guardarParcela() {

	parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
	ref = document.getElementById("ref_cat").value;
	fecha = document.getElementById("fecha_vuelo").value;
	if ( fecha != "N/A" || ref != "N/A") {
		resultado = $.ajax({
			url: 'Recursos/php/gestionModelos.php',
			data: { funcion: "actualizarFecha", valor: document.getElementById("fecha_vuelo").value, parcela: parcela, ref: document.getElementById("ref_cat").value },
			dataType: 'text',
			async: false
		}).responseText;

    }

	if (document.getElementById("aux1").value != "") {
		$.ajax({
			url: 'Recursos/php/gestionModelos.php',
			data: { funcion: "actualizarNube", parcela: parcela },
			dataType: 'text',
			async: false
		});

	}
	if (document.getElementById("aux2").value != "") {
		$.ajax({
			url: 'Recursos/php/gestionModelos.php',
			data: { funcion: "actualizarOrto", parcela: parcela },
			dataType: 'text',
			async: false
		});

	}
	if (document.getElementById("aux3").value != "") {
		$.ajax({
			url: 'Recursos/php/gestionModelos.php',
			data: { funcion: "actualizarAltura", parcela: parcela },
			dataType: 'text',
			async: false
		});

	}

	document.getElementById("comboTriple").submit();
}

function ajustarNube() {
	nombre = document.getElementById("aux1").value.split(".")[document.getElementById("aux1").value.split(".").length - 1];

	if (nombre != "txt") {
		alert("Formato invalido, debe ser TXT");
		document.getElementById("aux1").value = "";
	} else {
		parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
		parcela = parcela.substring(1, parcela.length);
		document.getElementById("comboTriple").action = "Recursos/php/subirModelos.php?w1=" + parcela;
    }
	
}

function ajustarNube2() {
	nombre = document.getElementById("aux4").value.split(".")[document.getElementById("aux4").value.split(".").length - 1];
	nombre = nombre.toLowerCase();
	if (nombre != "txt") {
		alert("Formato invalido, debe ser TXT");
		document.getElementById("aux4").value = "";
	} else {
		parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
		parcela = parcela.substring(1, parcela.length);
		document.getElementById("comboTriple").action = "Recursos/php/subirModelos.php?w1=" + parcela;
	}
	
}

function ajustarOrto() {
	nombre = document.getElementById("aux2").value.split(".")[document.getElementById("aux2").value.split(".").length - 1];
	nombre = nombre.toLowerCase();
	if (nombre != "png") {
		alert("Formato invalido, debe ser PNG");
		document.getElementById("aux2").value = "";
	} else {
		parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
		parcela = parcela.substring(1, parcela.length);
		document.getElementById("comboTriple").action = "Recursos/php/subirModelos.php?w1=" + parcela;
	}
	
}

function ajustarOrto2() {
	nombre = document.getElementById("aux5").value.split(".")[document.getElementById("aux5").value.split(".").length - 1];
	nombre = nombre.toLowerCase();
	if (nombre != "png") {
		alert("Formato invalido, debe ser PNG");
		document.getElementById("aux5").value = "";
	} else {
		parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
		parcela = parcela.substring(1, parcela.length);
		document.getElementById("comboTriple").action = "Recursos/php/subirModelos.php?w1=" + parcela;
	}
	
}

function ajustarAltura() {
	nombre = document.getElementById("aux3").value.split(".")[document.getElementById("aux3").value.split(".").length - 1];
	nombre = nombre.toLowerCase();
	if (nombre != "jpg") {
		alert("Formato invalido, debe ser JPG");
		document.getElementById("aux3").value = "";
	} else {
		parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
		parcela = parcela.substring(1, parcela.length);
		document.getElementById("comboTriple").action = "Recursos/php/subirModelos.php?w1=" + parcela;
	}
	
}

function ajustarAltura2() {
	nombre = document.getElementById("aux6").value.split(".")[document.getElementById("aux6").value.split(".").length - 1];
	nombre = nombre.toLowerCase();
	if (nombre != "jpg") {
		alert("Formato invalido, debe ser JPG");
		document.getElementById("aux6").value = "";
	} else {
		parcela = document.getElementById("municipio_card").innerHTML.split("/")[1];
		parcela = parcela.substring(1, parcela.length);
		document.getElementById("comboTriple").action = "Recursos/php/subirModelos.php?w1=" + parcela;
	}
	
}


function anadirModelo() {

	document.getElementById("anadir_modelo").showModal();

	var select = document.getElementById("tipoModelo");

	select.addEventListener("change", function () {
		var selectedOption = this.options[this.selectedIndex].value;
		switch (selectedOption) {
			case "NubePuntos":
				document.getElementById("form_ortofoto").style.display = "none";
				document.getElementById("form_altura").style.display = "none";
				document.getElementById("form_nube").style.display = "flex";
				document.getElementById("form_fecha_vuelo").style.display = "flex";
				break;
			case "Combo":
				document.getElementById("form_altura").style.display = "flex";
				document.getElementById("form_fecha_vuelo").style.display = "none";
				document.getElementById("form_nube").style.display = "none";
				document.getElementById("form_ortofoto").style.display = "flex";
				break;
			case "Ortofoto":
				document.getElementById("form_altura").style.display = "none";
				document.getElementById("form_fecha_vuelo").style.display = "none";
				document.getElementById("form_nube").style.display = "none";
				document.getElementById("form_ortofoto").style.display = "flex";
				break;
			case "Triple":
				document.getElementById("form_altura").style.display = "flex";
				document.getElementById("form_ortofoto").style.display = "flex";
				document.getElementById("form_nube").style.display = "flex";
				document.getElementById("form_fecha_vuelo").style.display = "flex";
				break;
        }
	});
}

function incluirModelos() {
	if (document.getElementById("parcela_indicada").value == ""){
		alert("El campo de ID RECINTO es obligatorio");
	} else {
		parcela = document.getElementById("parcela_indicada").value;
		ref = document.getElementById("parcela_ref_indicada").value;
		fecha = document.getElementById("fecha_indicada").value;;
		$.ajax({
			url: 'Recursos/php/gestionModelos.php',
			data: { funcion: "insertarParcela", parcela: parcela },
			dataType: 'text',
			async: false
		});


		if (document.getElementById("aux4").value != "") {
			$.ajax({
				url: 'Recursos/php/gestionModelos.php',
				data: { funcion: "actualizarNube", parcela: parcela },
				dataType: 'text',
				async: false
			});

		}
		if (document.getElementById("aux5").value != "") {
			$.ajax({
				url: 'Recursos/php/gestionModelos.php',
				data: { funcion: "actualizarOrto", parcela: parcela },
				dataType: 'text',
				async: false
			});

		}
		if (document.getElementById("aux6").value != "") {
			$.ajax({
				url: 'Recursos/php/gestionModelos.php',
				data: { funcion: "actualizarAltura", parcela: parcela },
				dataType: 'text',
				async: false
			});

		}

		document.getElementById("comboTriple").submit();
	}
}

function calculoGrafica(nombre, ejeY, actual, total) {
	if (Chart.getChart('Grafica')) {
		let chartStatus = Chart.getChart('Grafica'); // <canvas> id
		chartStatus.destroy();
	}
	fechas = [];
	datos = [];
	final = 0;
	if ((actual + 10) > total)
		final = total
	else
		final = actual + 10;
	var aux = nombre.toLowerCase();
	$.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { funcion: 'Datos', aspecto: aux, parcela: parcelaElegida, numero: actual, final: final },
		dataType: 'json',
		success: function (response) {
			fechas = response["Fechas"];
			datos = response["Datos"];
			creacionGrafica(nombre, ejeY, fechas, datos);
		}
	});

}

function creacionGrafica(nombre, ejeY, fechas, datos) {

	const data2 = [];

	for (var i = 0; i < datos.length; i++) {
		data2.push(parseFloat(datos[i]));
	}

	var r = 0;
	var g = 255;
	var b = 0;
	const data = {
		labels: fechas,
		datasets: [{
			label: nombre,
			backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
			borderColor: 'rgb(' + r + ',' + g + ',' + b + ')',
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

	const myChart = new Chart(document.getElementById("Grafica"), config);
	myChart.canvas.parentNode.style.width = '100%';

}

function editarCampo(bool, tipo) {
	if (bool) {

		document.getElementById("boton_" + tipo).innerHTML = "Guardar";
		document.getElementById("boton_" + tipo).setAttribute("onclick", "editarCampo(false,'" + tipo + "')");
		valor = document.getElementById(tipo + "_valor").innerHTML;
		document.getElementById(tipo + "_valor").innerHTML = "<input type='number' id='" + tipo + "_valorNuevo'>"
		document.getElementById(tipo + "_valorNuevo").placeholder = valor;

	} else {
		document.getElementById("boton_" + tipo).innerHTML = "Editar Campos";
		document.getElementById("boton_" + tipo).setAttribute("onclick", "editarCampo(true,'" + tipo + "')");

		valor;
		if (document.getElementById(tipo + "_valorNuevo").value == "")
			valor = document.getElementById(tipo + "_valor").innerHTML = document.getElementById(tipo + "_valorNuevo").placeholder;
		else
			valor = document.getElementById(tipo + "_valor").innerHTML = document.getElementById(tipo + "_valorNuevo").value;
		$.ajax({
			url: 'Recursos/php/obtenerHistorico.php',
			data: {
				nombre: tipoActual, funcion: "editarValor", parcela: parcelaElegida, valor: valor, fecha: document.getElementById(tipo).innerHTML},
			dataType: 'text',
			async: false
		});

    }
}

function nuevoDato() {
	document.getElementById("nuevoDato").innerHTML = '<td id="insercion"><input type="date" id="insercion_fecha"></td><td id="insercion_2"><input type="number" id="insercion_valor"></td><td><button id="boton_nuevo" onclick=guardarDatos()>Guardar</button></td>';
	document.getElementById("boton_adicion").disabled = true;
}

function guardarDatos() {
	if (document.getElementById("insercion_fecha").value != "" && document.getElementById("insercion_valor").value != "") {

		aprobado = $.ajax({
			url: 'Recursos/php/obtenerHistorico.php',
			data: {
				nombre: tipoActual, funcion: "fecha", parcela: parcelaElegida,
				fecha: document.getElementById("insercion_fecha").value
			},
			dataType: 'text',
			async: false
		}).responseText;

		if (aprobado) {
			var date = new Date(document.getElementById("insercion_fecha").value);
			if (date.getDay() != 0) {
				document.getElementById("domingo").style.display = "flex";
			} else {
				$.ajax({
					url: 'Recursos/php/obtenerHistorico.php',
					data: {
						nombre: tipoActual, funcion: "insertarDato", parcela: parcelaElegida,
						fecha: document.getElementById("insercion_fecha").value, valor: document.getElementById("insercion_valor").value
					},
					dataType: 'text',
					async: false
				});
				document.getElementById("nuevoDato").innerHTML = "";
				document.getElementById("boton_adicion").disabled = false;
				muestraHistoricoBoton(tipoActual);
			}
		} else {
			document.getElementById("presente").style.display = "flex";
        }
	} else {
		document.getElementById("insercion").style.display = "flex";
    }
}

function muestraHistorico(parcela) {

	valores = $.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { funcion: "obtenerAspectos", parcela: parcela },
		dataType: 'text',
		async: false
	}).responseText;
	if (valores == "")
		aspecto = "temperatura";
	else
		aspecto = valores.split("-")[0];
	document.getElementById("radio-" + aspecto).checked = true;
	parcelaElegida = parcela;
	tipoActual = aspecto;
	tabla = $.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { nombre: aspecto, funcion: "obtenerTabla", parcela: parcela, nivel: 1, tipo: "inicial" },
		dataType: 'text',
		async: false
	}).responseText;
	document.getElementById("tablaHistorica").innerHTML = tabla.split("&")[0];
	document.getElementById("historico").showModal();
	elementos = tabla.split("&")[1];
	if (parseInt(elementos, 10) < 10) {
		document.getElementById("post").className = "page-item disabled";
	}
	ejeY = "";
	switch (aspecto) {
		case 'temperatura':
			ejeY = "Grados";
			break;
		case 'humedad':
			ejeY = "%";
			break;
		case 'produccion':
			ejeY = "Kg";
			break;
		case 'precipitaciones':
			ejeY = "L/ha";
			break;
	}
	calculoGrafica(aspecto, ejeY, 0, elementos);
}

function muestraHistoricoBoton(boton) {
	tipoActual = boton.toLowerCase();

	tabla = $.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { nombre: tipoActual, funcion: "obtenerTabla", parcela: parcelaElegida, nivel: 1, tipo: "inicial" },
		dataType: 'text',
		async: false
	}).responseText;

	ejeY = "";
	switch (boton) {
		case 'temperatura':
			ejeY = "Grados";
			break;
		case 'humedad':
			ejeY = "%";
			break;
		case 'produccion':
			ejeY = "Kg";
			break;
		case 'precipitaciones':
			ejeY = "L/ha";
			break;
	}
	document.getElementById("tablaHistorica").innerHTML = tabla.split("&")[0];

	elementos = tabla.split("&")[1];
	if (parseInt(elementos, 10) < 10) {
		document.getElementById("post-historico").className = "page-item disabled";
	}
	calculoGrafica(boton, ejeY, 0, elementos);
}


function siguientesDatos(numero, total) {

	datos = $.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { nombre: tipoActual, funcion: "obtenerTabla", nivel: numero, tipo: "siguiente", parcela: parcelaElegida },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("tablaHistorica").innerHTML = datos.split("&")[0];
	document.getElementById("disabled-historico").className = "page-item";

	if (numero > total - 10) {
		document.getElementById("post-historico").className = "page-item disabled";
	} else {
		document.getElementById("disabled-historico").className = "page-item ";
	}

	ejeY = "";
	switch (tipoActual) {
		case 'temperatura':
			ejeY = "Grados";
			break;
		case 'humedad':
			ejeY = "%";
			break;
		case 'produccion':
			ejeY = "Kg";
			break;
		case 'precipitaciones':
			ejeY = "L/ha";
			break;
	}

	calculoGrafica(tipoActual, ejeY, numero, total);
}


function anterioresDatos(numero) {
	datos = $.ajax({
		url: 'Recursos/php/obtenerHistorico.php',
		data: { nombre: tipoActual, funcion: "obtenerTabla", nivel: numero, tipo: "anterior", parcela: parcelaElegida },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("tablaHistorica").innerHTML = datos.split("&")[0];

	document.getElementById("post-historico").className = "page-item";

	if ((numero - 1) > 10) {
		document.getElementById("disabled-historico").className = "page-item";
	} else {
		document.getElementById("disabled-historico").className = "page-item disabled";
	}

	ejeY = "";
	switch (tipoActual) {
		case 'temperatura':
			ejeY = "Grados";
			break;
		case 'humedad':
			ejeY = "%";
			break;
		case 'produccion':
			ejeY = "Kg";
			break;
		case 'precipitaciones':
			ejeY = "L/ha";
			break;
	}

	calculoGrafica(tipoActual, ejeY, numero - 10, datos.split("&")[1]);
}
