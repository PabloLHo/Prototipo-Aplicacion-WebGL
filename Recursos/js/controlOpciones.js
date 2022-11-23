/*Archivos JS encargado del correcto funcionamiento del menu de opciones para el modelado*/

//Esta función comprueba que boton ha sido pulsado, lo marca y desmarca los otros dos
$(document).ready(function () {
	$("#roundedOne").click(function () {
		document.getElementById("roundedOne").checked = true;
        document.getElementById("roundedOne2").checked = false;
		document.getElementById("roundedOne3").checked = false;
    });
	$("#roundedOne2").click(function () {
        document.getElementById("roundedOne").checked = false;
		document.getElementById("roundedOne2").checked = true;
		document.getElementById("roundedOne3").checked = false;
    });
	$("#roundedOne3").click(function () {
        document.getElementById("roundedOne").checked = false;
		document.getElementById("roundedOne2").checked = false;
		document.getElementById("roundedOne3").checked = true;
    });
});