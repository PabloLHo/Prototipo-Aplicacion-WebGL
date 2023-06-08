/*Archivos JS encargado de las funciones de la interfaz perfil de usuario*/
nombreActual = ""


window.onload = function () {
	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: document.getElementById("onload").innerHTML, funcion: "permisos" },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&")

	document.getElementById("fotoPerfilNav").src = "Recursos/imagenes/usuarios/" + datos[1];
	muestraUsuarios();
}

function muestraUsuarios() {

	usuarios = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { funcion: "mostrarUsuarios", nivel: 1, tipo: "inicial" },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_usuarios").innerHTML = usuarios.split("&")[0];

	if (parseInt(usuarios.split("&")[1], 10) < 10) {
		document.getElementById("post").className = "page-item disabled";
	}

}

function anterioresUsuarios(numero) {

	usuarios = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { funcion: "mostrarUsuarios", nivel: numero, tipo: "anterior" },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_usuarios").innerHTML = usuarios.split("&")[0];

	document.getElementById("post").className = "page-item";

	if ((numero - 1) > 10) {
		document.getElementById("disabled").className = "page-item";
	} else {
		document.getElementById("disabled").className = "page-item disabled";
	}

}

function siguientesUsuarios(numero, total) {

	usuarios = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { funcion: "mostrarUsuarios", nivel: numero, tipo: "siguiente" },
		dataType: 'text',
		async: false
	}).responseText;

	document.getElementById("contenido_usuarios").innerHTML = usuarios.split("&")[0];
	document.getElementById("disabled").className = "page-item";

	if (numero > total - 10) {
		document.getElementById("post").className = "page-item disabled";
	} else {
		document.getElementById("disabled").className = "page-item ";
	}

}

function eliminarUsuario(nombre) {
	nombre = nombre.split("/")[0];
	nombre = nombre.substring(0, nombre.length - 1);
	$.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { funcion: "borraUsuario", usuario: nombre },
		dataType: 'text',
		async: false
	});
	location.reload();
}

function editarUsuario(nombre) {
	document.getElementById('card-usuarios').close();
	document.getElementById('edicion-card-usuarios').showModal();

	document.getElementById("guardar").style.display = "block";
	document.getElementById("guardar2").style.display = "none";
	document.getElementById("bloque_psswd").style.display = "none";
	status = document.getElementById("usuario_card").innerHTML.split("/")[1];
	status = status.substring(1, status.length);
	document.getElementById("status").value = status;
	document.getElementById("email_user").value = document.getElementById("correo_card").innerHTML;
	document.getElementById("country_user").value = document.getElementById("pais_card").innerHTML;
	document.getElementById("city_user").value = document.getElementById("ciudad_card").innerHTML;
	document.getElementById("direction_user").value = document.getElementById("direccion_card").innerHTML;
	nombre = document.getElementById("usuario_card").innerHTML.split("/")[0];
	nombre = nombre.substring(0, nombre.length - 1);
	document.getElementById("user_user").value = nombre;
	document.getElementById("name_user").value = document.getElementById("nombre_card").innerHTML;
	document.getElementById("lastname_user").value = document.getElementById("apellido_card").innerHTML;

	nombreActual = nombre;

	var usuario = document.getElementById("user_user");
	usuario.addEventListener("input", function () {
		nombre = document.getElementById("user_user").value;
		var datos = $.ajax({
			url: 'Recursos/php/gestionPerfiles.php',
			data: { nombre: nombre, funcion: "existeUsuario" },
			dataType: 'text',
			async: false
		}).responseText;
		if (!datos && nombre != nombreActual) {
			document.getElementById("mensajeUsuario").style.display = "block";
		} else
			document.getElementById("mensajeUsuario").style.display = "none";
	});

}

function guardarDatos() {
	if (document.getElementById("mensajeUsuario").style.display == "block") {
		alert("Formulario incorrecto");
	} else {
		nombre = document.getElementById("usuario_card").innerHTML.split("/")[0];
		nombre = nombre.substring(0, nombre.length - 1);
		usuarioAnterior = nombre;

		resultado = $.ajax({
			url: 'Recursos/php/gestionPerfiles.php',
			data: {
				funcion: "actualizarUsuario", usuario: document.getElementById("user_user").value, usuarioAnterior: usuarioAnterior,
				correo: document.getElementById("email_user").value, nombre: document.getElementById("name_user").value,
				apellidos: document.getElementById("lastname_user").value, direccion: document.getElementById("direction_user").value,
				ciudad: document.getElementById("city_user").value, pais: document.getElementById("country_user").value, nivel: document.getElementById("status").value
			},
			dataType: 'text',
			async: false
		}).responseText

		location.reload();
	}
}

function anadirUsuario() {
	nombreActual = "";
	document.getElementById('edicion-card-usuarios').showModal()
	document.getElementById("bloque_psswd").style.display = "block";
	document.getElementById("email_user").value = "N/A";
	document.getElementById("country_user").value = "N/A";
	document.getElementById("status").value = "TECNICO";
	document.getElementById("city_user").value = "N/A";
	document.getElementById("direction_user").value = "N/A";
	document.getElementById("user_user").value = "";
	document.getElementById("name_user").value = "";
	document.getElementById("lastname_user").value = "";
	document.getElementById("guardar2").style.display = "block";
	document.getElementById("guardar").style.display = "none";

	var select = document.getElementById("npsswd_user");

	select.addEventListener("input", function () {
		if (document.getElementById("npsswd_user").value != document.getElementById("psswd_user").value) {
			document.getElementById("mensajeContrasena").style.display = "block";
		} else {
			document.getElementById("mensajeContrasena").style.display = "none";
        }
	});

	var usuario = document.getElementById("user_user");

	usuario.addEventListener("input", function () {
		nombre = document.getElementById("user_user").value;
		var datos = $.ajax({
			url: 'Recursos/php/gestionPerfiles.php',
			data: { nombre: nombre, funcion: "existeUsuario" },
			dataType: 'text',
			async: false
		}).responseText;
		if (!datos && nombre != nombreActual) {
			document.getElementById("mensajeUsuario").style.display = "block";
		} else
			document.getElementById("mensajeUsuario").style.display = "none";
	});


}

function anadirDatos() {
	if (document.getElementById("name_user").value == "" || document.getElementById("lastname_user").value == "" || document.getElementById("user_user").value == "" || document.getElementById("psswd_user").value == "" || document.getElementById("npsswd_user").value == "") {
		alert("Formulario incompleto");
	} else if (document.getElementById("mensajeUsuario").style.display == "block" || document.getElementById("mensajeContrasena").style.display == "block") {
		alert("Formulario incorrecto");
    } else {
		resultado = $.ajax({
			url: 'Recursos/php/gestionPerfiles.php',
			data: {
				funcion: "nuevoUsuario", aux: document.getElementById("name_user").value, usuario: document.getElementById("user_user").value,
				correo: document.getElementById("email_user").value, apellidos: document.getElementById("lastname_user").value, direccion: document.getElementById("direction_user").value,
				ciudad: document.getElementById("city_user").value, pais: document.getElementById("country_user").value, contrasena: document.getElementById("psswd_user").value, permisos: document.getElementById("status").value
			},
			dataType: 'text',
			async: false
		}).responseText;
		location.reload();
	}
}


function mostrarUsuario(nombre) {
	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: nombre, funcion: "permisos" },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&");

	document.getElementById("imagen_card").src = "Recursos/imagenes/usuarios/" + datos[1];
	document.getElementById("usuario_card").innerHTML = datos[2] + " / " + datos[0];
	document.getElementById("nombre_card").innerHTML = datos[3];
	document.getElementById("apellido_card").innerHTML = datos[4];
	document.getElementById("correo_card").innerHTML = datos[5];
	document.getElementById("pais_card").innerHTML = datos [6];
	document.getElementById("ciudad_card").innerHTML = datos[7];
	document.getElementById("direccion_card").innerHTML = datos[8];


	document.getElementById("card-usuarios").showModal();
}
