/*Archivos JS encargado de las funciones de la interfaz de muestra del modelado de una parcela*/
aspectoActual = ""

function descargarCSV(bool) {
	if (bool) {
		var link = document.createElement('a');
		link.href = "Recursos/CSV/Ejemplo.csv";
		link.download = "Ejemplo_" + aspecto;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	document.getElementById('boton_si').style.display = 'none';
	document.getElementById('boton_no').style.display = 'none';
	document.getElementById('csvFileInput').style.display = 'flex';
	document.getElementById('boton_guardar').style.display = 'flex';
	document.getElementById('mensajeAviso').style.display = 'none';
}


function subidaMasiva(aspecto) {

	aspectoActual = aspecto;
	document.getElementById("subirCSV").showModal();

}

function guardarDatosCSV() {

	const file = document.getElementById('csvFileInput').files[0];
	if (file != undefined) {
		const reader = new FileReader();
		const fechas = [];
		const valores = [];
		reader.readAsText(file);


		reader.onload = (e) => {
			const contents = e.target.result;
			const rows = contents.split('\n');
			var datosSinCaracteresR = rows[0].split(";")[1].replace(/\r/g, "");
			if (rows[0].split(";")[0] != "Fecha" || datosSinCaracteresR != "Valor") {
				document.getElementById("malFormato").style.display = "flex";
			} else {
				for (let i = 1; i < rows.length; i++) {
					const columns = rows[i].split(';');
					if (columns[0] != "" && columns[1] != "") {
						datosSinCaracteresR = columns[1].replace(/\r/g, "");
						fechas.push(columns[0]);
						valores.push(parseFloat(datosSinCaracteresR));
					}
				}
				if (fechas.length > 0) {
					for (var i = 0; i < filas; i++) {
						$.ajax({
							url: 'Recursos/php/obtenerHistorico.php',
							data: { nombre: parcela, funcion: "insertarDato", fecha: fecha[i], valor: valor[i], aspecto: aspectoActual },
							dataType: 'text',
							async: false
						});
					}

					document.getElementById("subirCSV").close();

					document.getElementById('boton_si').style.display = 'none';
					document.getElementById('boton_no').style.display = 'none';
					document.getElementById('csvFileInput').style.display = 'flex';
					document.getElementById('boton_guardar').style.display = 'flex';
					document.getElementById('mensajeAviso').style.display = 'none';
					muestraHistoricoBoton(aspectoActual);
				} else {
					document.getElementById("ningunDato").style.display = "flex";
				}
			}
		};


		
	}
}