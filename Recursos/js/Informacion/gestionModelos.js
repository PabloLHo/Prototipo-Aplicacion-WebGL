/*Archivos JS encargado de las funciones de la interfaz perfil de usuario para control de modelos*/

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
		data: { funcion: "mostrarParcelas", nivel: 0, tipo: "inicial", permisos: datos[0], usuario: datos[9] },
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
		data: { funcion: "mostrarParcelas", nivel: numero + 1, tipo: "siguiente", permisos: datos, usuario: usuario },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_modelos").innerHTML = usuarios.split("&");
	document.getElementById("disabled").className = "page-item";

	if (numero >= total - 10) {
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
		data: { funcion: "mostrarParcelas", nivel: numero - 1, tipo: "anterior", permisos: datos, usuario: usuario },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_modelos").innerHTML = usuarios.split("&");

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

