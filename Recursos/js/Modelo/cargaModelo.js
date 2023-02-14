/*Archivos JS encargado de la definición del tipo de modelado al que llamar según la URL*/

var valor = "";
var nombre_modelo = "";

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
		nombre_modelo = "";
	}
	
	valor = valor.toLowerCase();
	valor = valor.split("/");
	//Si tenemos mas de 2 datos estaremos observando una zona (nombre, coordenadas x,y,z)
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
		nombre_modelo = valor[0];
	}

}