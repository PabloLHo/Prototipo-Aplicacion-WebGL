/*Archivos JS encargado de las funciones de la interfaz perfil de usuario*/

window.onload = function () {


	var datos = $.ajax({
		url: 'Recursos/php/gestionPerfiles.php',
		data: { nombre: document.getElementById("onload").innerHTML, funcion: "permisos" },
		dataType: 'text',
		async: false
	}).responseText;

	datos = datos.split("&");
	document.getElementById("fotoPerfilNav").src = "Recursos/imagenes/usuarios/" + datos[1];
	document.getElementById("Titulo1").innerHTML = datos[0];
	document.getElementById("cambio_foto_form").action = "Recursos/php/cambiarFoto.php?w1=" + datos[9];
	switch (datos[0]) {
		case "PROPIETARIO":
			document.getElementById("usuario").style.display = "none";
			break;
		case "TECNICO":
			document.getElementById("usuario").style.display = "none";
			document.getElementById("modelo").style.display = "none";
			break;
	}

	document.getElementById("fotoPerfil").src = "Recursos/imagenes/usuarios/" + datos[1];
	document.getElementById("nombreUsuario").innerHTML = datos[2];
	document.getElementById("nombre").innerHTML = datos[3];
	document.getElementById("apellidos").innerHTML = datos[4];
	document.getElementById("correo").innerHTML = datos[5];
	document.getElementById("direccion").innerHTML = datos[6];
	document.getElementById("ciudad").innerHTML = datos[7];
	document.getElementById("pais").innerHTML = datos[8];

}


/*
 * 
 * Función que muestra el perfil de un usuario
 *
 */
function edicionCuenta(){
	if (document.getElementById("edicionCuenta").innerHTML == "Editar") {
		document.getElementById("cancelarEdicionCuenta").style.display = "block";
		document.getElementById("edicionCuenta").innerHTML = "Guardar";
		document.getElementById("edicion_usuario").style.display = "block";
		document.getElementById("edicion_correo").style.display = "block";
		document.getElementById("edicion_nombre").style.display = "block";
		document.getElementById("edicion_apellidos").style.display = "block";
		document.getElementById("edicion_direccion").style.display = "block";
		document.getElementById("edicion_ciudad").style.display = "block";
		document.getElementById("edicion_pais").style.display = "block";

		document.getElementById("muestraUsuario").style.display = "none";
		document.getElementById("muestraCorreo").style.display = "none";
		document.getElementById("muestraNombre").style.display = "none";
		document.getElementById("muestraApellidos").style.display = "none";
		document.getElementById("muestraDireccion").style.display = "none";
		document.getElementById("muestraCiudad").style.display = "none";
		document.getElementById("muestraPais").style.display = "none";

		document.getElementById("username").value = document.getElementById("nombreUsuario").innerHTML;
		document.getElementById("email").value = document.getElementById("correo").innerHTML;
		document.getElementById("name").value = document.getElementById("nombre").innerHTML;
		document.getElementById("last_name").value = document.getElementById("apellidos").innerHTML;
		document.getElementById("direction").value = document.getElementById("direccion").innerHTML;
		document.getElementById("city").value = document.getElementById("ciudad").innerHTML;
		document.getElementById("country").value = document.getElementById("pais").innerHTML;

	} else {
		resultado = $.ajax({
			url: 'Recursos/php/gestionPerfiles.php',
			data: {
				funcion: "actualizarUsuario", usuario: document.getElementById("nombreUsuario").innerHTML , usuarioNuevo: document.getElementById("username").value,
				correo: document.getElementById("email").value, nombre: document.getElementById("name").value,
				apellidos: document.getElementById("last_name").value, direccion: document.getElementById("direction").value,
				ciudad: document.getElementById("city").value, pais: document.getElementById("country").value
			},
			dataType: 'text',
			async: false
		}).responseText

		if (resultado) {
			document.getElementById("mensajeBien").style.display = "block";
		} else {
			document.getElementById("mensajeMal").style.display = "block";
			document.getElementById("edicionCuenta").innerHTML = "Editar";
			document.getElementById("edicion_usuario").style.display = "none";
			document.getElementById("edicion_correo").style.display = "none";
			document.getElementById("edicion_nombre").style.display = "none";
			document.getElementById("edicion_apellidos").style.display = "none";
			document.getElementById("edicion_direccion").style.display = "none";
			document.getElementById("edicion_ciudad").style.display = "none";
			document.getElementById("edicion_pais").style.display = "none";

			document.getElementById("muestraUsuario").style.display = "block";
			document.getElementById("muestraCorreo").style.display = "block";
			document.getElementById("muestraNombre").style.display = "block";
			document.getElementById("muestraApellidos").style.display = "block";
			document.getElementById("muestraDireccion").style.display = "block";
			document.getElementById("muestraCiudad").style.display = "block";
			document.getElementById("muestraPais").style.display = "block";
		}

    }

}


/*
 * 
 * Función que cancela la edición de los datos
 *
 */
function cancelarEdicion() {
	document.getElementById("cancelarEdicionCuenta").style.display = "none";
	document.getElementById("edicionCuenta").innerHTML = "Editar";
	document.getElementById("edicion_usuario").style.display = "none";
	document.getElementById("edicion_correo").style.display = "none";
	document.getElementById("edicion_nombre").style.display = "none";
	document.getElementById("edicion_apellidos").style.display = "none";
	document.getElementById("edicion_direccion").style.display = "none";
	document.getElementById("edicion_ciudad").style.display = "none";
	document.getElementById("edicion_pais").style.display = "none";

	document.getElementById("muestraUsuario").style.display = "block";
	document.getElementById("muestraCorreo").style.display = "block";
	document.getElementById("muestraNombre").style.display = "block";
	document.getElementById("muestraApellidos").style.display = "block";
	document.getElementById("muestraDireccion").style.display = "block";
	document.getElementById("muestraCiudad").style.display = "block";
	document.getElementById("muestraPais").style.display = "block";
}


/*
 * 
 * Función que comprueba la validez de la foto a subir
 *
 */
function comprobarFoto() {
	nombre = document.getElementById("foto_comprobar").value.split(".")[document.getElementById("foto_comprobar").value.split(".").length - 1];

	nombre = nombre.toLowerCase();
	if (nombre != "jpg" && nombre != "jpeg" && nombre != "png") {
		alert("Formato invalido, los formatos aceptados son JPG,PNG,JPEG");
		document.getElementById("foto_comprobar").value = "";
	}
	
}